import pandas as pd
from pandas import DataFrame, Series

from lib.pagination import get_page
from models.base_online import BaseOnlineModel


class RecentModel(BaseOnlineModel):
    def __init__(self, schema: str):
        super().__init__("recent", schema)
        self.top_k = 3

    def fit(self, df_interactions: DataFrame):
        self.model = (
            df_interactions.drop_duplicates(subset=["user_id", "item_id"])
            .groupby("user_id")
            .tail(self.top_k)
            .reset_index()
            .set_index("id")
        )
        super().fit(df_interactions)

    def fit_one(self, df_interaction: Series):
        recents = self.model

        user_id = df_interaction["user_id"]
        item_id = df_interaction["item_id"]

        user_recents = recents[recents["user_id"] == user_id]
        if item_id in user_recents["item_id"].values:
            return

        recents = pd.concat([recents, df_interaction.to_frame().transpose().set_index('id')])

        if len(user_recents) >= self.top_k:
            oldest = user_recents.iloc[0]
            recents = recents.drop(oldest.name)

        self.model = recents
        super().fit_one(df_interaction)

    def recommend_items_for_user(self, user_id: str, args = {}):
        if self.model is None:
            return []

        limit, offset = get_page(args)
        recents = self.model

        recommendations = recents[recents.user_id == user_id].iloc[offset : (limit + offset)]
        recommendations = recommendations[["item_id"]].rename(columns={"item_id": "id"})
        recommendations["score"] = 1

        return recommendations.to_dict("records")
