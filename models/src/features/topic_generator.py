from heapq import nlargest
from random import shuffle

from models.attribute import AttributeModel
from models.recent import RecentModel


def recommend_topics_for_user(schema: str, user_id: str):
    results = []

    model = RecentModel(schema)
    model.load_cached()
    recommendations = model.recommend_items_for_user(user_id)
    results.extend([{"kind": "recent", "value": x["id"]} for x in recommendations])

    model = AttributeModel(schema)
    model.load_cached()
    user_category_profile = model.get_user_category_profile()
    category_profile = user_category_profile.get(user_id, {})

    top_quantile = 0.8
    for category, count_by_value in category_profile.items():
        count_with_value = [(value, count) for value, count in count_by_value.items()]
        count_with_value = nlargest(10, count_with_value, key=lambda x: x[1])

        _, max_count = count_with_value[0]
        values = [value for value, count in count_with_value if count >= top_quantile * max_count]

        results.extend([{"kind": category, "value": value} for value in values])

    shuffle(results)
    return results
