import pandas as pd

from lib.pagination import get_page
from models.base import BaseModel


class RatingModel(BaseModel):
    def __init__(self, schema: str):
        super().__init__("rating", schema)

    def fit(self, df_interactions: pd.DataFrame):
        result = (
            df_interactions[["item_id", "rating"]]
            .groupby(["item_id"])["rating"]
            .sum()
            .sort_values(ascending=False)
            .reset_index(name="rating")
            .rename(columns={"item_id": "id", "rating": "score"})
        )
        self.model = result.to_dict(orient="records")
        super().fit(df_interactions)

    def recommend_items(self, args = {}):
        limit, offset = get_page(args)
        return self.model[offset:(offset + limit)]
