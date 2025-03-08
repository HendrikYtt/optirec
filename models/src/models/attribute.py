import json

import pandas as pd
from pandas import DataFrame, Series

from config import get_items_path, get_users_path
from data.csv_to_pandas_df import load_pandas_df_from_csv
from features.properties.service import get_item_properties
from lib.cache import timed_lru_cache
from lib.pagination import get_page
from models.base_online import BaseOnlineModel


class AttributeModel(BaseOnlineModel):
    def __init__(self, schema: str):
        super().__init__("attribute", schema)

    def fit(self, df_interactions: DataFrame):
        if len(df_interactions) == 0:
            self.model = ({}, {})
            return

        df_items = load_items(self.schema)

        category_weights = {}

        categories = get_item_properties(self.schema)
        for category, category_type in categories:
            if category_type == "CATEGORY":
                category_weights[category] = 1 / df_items[category].nunique()
            elif category_type == "CATEGORY_LIST":
                category_weights[category] = 1 / df_items[category].apply(pd.Series).stack().nunique()

        df_interactions = df_interactions.join(df_items, on="item_id")

        user_category_profile = {}
        for category, category_type in categories:
            if category_type == "CATEGORY":
                category_profiles = df_interactions[["user_id", category]]
            elif category_type == "CATEGORY_LIST":
                category_profiles = df_interactions[["user_id", category]].explode(category)
            else:
                continue

            category_profiles = category_profiles.groupby("user_id")[category].value_counts(normalize=True)

            for (user_id, category_value), count in category_profiles.items():
                if user_id not in user_category_profile:
                    user_category_profile[user_id] = {}
                if category not in user_category_profile[user_id]:
                    user_category_profile[user_id][category] = {}
                user_category_profile[user_id][category][category_value] = count

        self.model = (category_weights, user_category_profile)
        super().fit(df_interactions)

    def fit_one(self, df_interaction: Series):
        _, user_category_profile = self.model
        df_items = load_items_cached(self.schema)

        user_id = df_interaction["user_id"]
        df_item = df_items.loc[df_interaction["item_id"]]

        if user_id not in user_category_profile:
            user_category_profile[user_id] = {}

        categories = get_item_properties(self.schema)

        for category, category_type in categories:
            if category_type == 'CATEGORY':
                category_values = [df_item[category]]
            elif category_type == 'CATEGORY_LIST':
                category_values = df_item[category]
            else:
                continue

            category_values = [x for x in category_values if x is not None]

            for category_value in category_values:
                if category not in user_category_profile[user_id]:
                    user_category_profile[user_id][category] = {}
                if category_value not in user_category_profile[user_id][category]:
                    user_category_profile[user_id][category][category_value] = 0
                user_category_profile[user_id][category][category_value] += 1
        super().fit_one(df_interaction)

    def recommend_items_for_user(self, user_id: str, args={}):
        limit, offset = get_page(args)
        category_weights, user_category_profile = self.model
        category_profile = user_category_profile.get(user_id, None)
        if category_profile is None:
            return []

        df_items = load_items_cached(self.schema)

        recommendations = []
        for item_id, item in df_items.iterrows():
            score = 0
            for category, weight in category_weights.items():
                # TODO: normalize category frequencies over users
                category_value = item[category]
                if isinstance(category_value, list):
                    for value in category_value:
                        score += category_profile.get(category, {}).get(value, 0) * weight
                else:
                    score += category_profile.get(category, {}).get(category_value, 0) * weight
            recommendations.append(dict(id=item_id, score=score))

        return sorted(recommendations, key=lambda x: x["score"], reverse=True)[offset : (offset + limit)]

    def get_user_category_profile(self):
        _, user_category_profile = self.model
        return user_category_profile


def load_users(schema: str, filter_func=None):
    df_users = load_pandas_df_from_csv(get_users_path(schema), filter_func=filter_func)
    df_users = df_users.apply(lambda x: json.loads(x["attributes"]), axis=1, result_type="expand")
    return df_users


def load_items(schema: str):
    df_items = load_pandas_df_from_csv(get_items_path(schema))
    df_items = df_items.apply(lambda x: json.loads(x["attributes"]), axis=1, result_type="expand")
    return df_items


@timed_lru_cache(seconds=60)
def load_items_cached(schema: str):
    return load_items(schema)
