from prometheus_client import Gauge

LOAD_DURATION = Gauge(
    "nrocinu_load_duration",
    "Time spent loading data",
    ["schema"],
)

TRAIN_DURATION = Gauge(
    "nrocinu_train_duration", "Time spent on training", ["schema", "model"]
)

RECOMMEND_ITEMS_FOR_ITEM_DURATION = Gauge(
    "nrocinu_recommend_items_for_item_duration",
    "Time spent on recommending items for item",
    ["schema", "model"],
)

RECOMMEND_ITEMS_FOR_USER_DURATION = Gauge(
    "nrocinu_recommend_items_for_user_duration",
    "Time spent on recommending items for user",
    ["schema", "model"],
)

RECOMMEND_USERS_FOR_ITEM_DURATION = Gauge(
    "nrocinu_recommend_users_for_item_duration",
    "Time spent on recommending users for item",
    ["schema", "model"],
)

RECOMMEND_ITEMS_DURATION = Gauge(
    "nrocinu_recommend_items_duration",
    "Time spent on recommending items",
    ["schema", "model"],
)
