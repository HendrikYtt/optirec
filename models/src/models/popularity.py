import logging

import pandas as pd
from features.properties.service import get_item_properties

from lib.pagination import get_page
from models.attribute import load_items_cached
from models.base import BaseModel


class PopularityModel(BaseModel):
    def __init__(self, schema: str):
        super().__init__("popularity", schema)

    def fit(self, df_interactions: pd.DataFrame):
        self.model = (
            df_interactions[["user_id", "item_id"]]
            .groupby(["item_id"])["user_id"]
            .nunique()
            .sort_values(ascending=False)
            .reset_index(name="count")
            .rename(columns={"item_id": "id", "count": "score"})
        )
        super().fit(df_interactions)

    def recommend_items(self, args = {}):
        limit, offset = get_page(args)
        recommendations = self.model

        properties = get_item_properties(self.schema)
        property_type_by_name = {name: property_type for name, property_type in properties }

        item_category_filters = [(key.replace("ìtem__", ""), value, ) for key, value in args.items() if key.startswith("ìtem__")]
        if len(item_category_filters) > 0:
            df_items = load_items_cached(self.schema)

            for category, filter_value in item_category_filters:
                property_type = property_type_by_name[category]
                if property_type == 'CATEGORY':
                    logging.info('Filtering by %s = %s', category, filter_value)
                    df_items = df_items[df_items[category] == filter_value]
                elif property_type == 'CATEGORY_LIST':
                    logging.info('Filtering by %s INCLUDES %s', category, filter_value)
                    df_items = df_items[df_items[category].apply(lambda x: filter_value in x)]

            recommendations = recommendations[recommendations["id"].isin(df_items.index)]

        return recommendations.iloc[offset : (offset + limit)].to_dict(orient="records")
