import pandas as pd
from aiohttp.web_exceptions import HTTPBadRequest

from features.users.database import get_users_attribute
from lib.pagination import get_page
from models.base import BaseModel


class PopularityByCountry(BaseModel):
    def __init__(self, schema: str):
        super().__init__("popularity_by_country", schema)

    def fit(self, df_interactions: pd.DataFrame):
        df_interactions = df_interactions[["user_id", "item_id"]]

        user_ids = df_interactions["user_id"].tolist()
        df_users = get_users_attribute(self.schema, user_ids, "country")

        df_interactions = df_interactions.merge(df_users, left_on="user_id", right_index=True)
        self.model = (
            df_interactions.groupby(["country", "item_id"])
            .count()
            .reset_index()
            .rename(columns={"user_id": "score", "item_id": "id"})
            .sort_values("score", ascending=False)
            .set_index("country")
        )

        super().fit(df_interactions)

    def recommend_items(self, args={}):
        if self.model is None:
            return []

        limit, offset = get_page(args)
        country = args.get("country")
        if not country:
            raise HTTPBadRequest(reason="Missing `country` query parameter")

        df = self.model
        df = df.loc[df.index.intersection([country])]
        return df.iloc[offset : (offset + limit)].to_dict(orient="records")
