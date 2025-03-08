import logging
from datetime import datetime

from aiohttp import web
from multidict import MultiDict

from config import get_interactions_path, get_items_path, get_users_path
from connections.spark import spark
from data.csv_to_pandas_df import load_pandas_df_from_csv
from data.table_to_csv import load_table_to_csv
from features.models.models import get_model
from features.topic_generator import recommend_topics_for_user
from lib.http import rest_handler
from lib.metrics import (LOAD_DURATION, RECOMMEND_ITEMS_DURATION,
                         RECOMMEND_ITEMS_FOR_ITEM_DURATION,
                         RECOMMEND_ITEMS_FOR_USER_DURATION, TRAIN_DURATION)
from models.als import ALSModel


@rest_handler
def handle_ping(_request: web.Request):
    return {"status": "pong"}


@rest_handler
def handle_load(request: web.Request):
    schema = request.match_info.get("schema", None)
    with LOAD_DURATION.labels(schema=schema).time():
        load_table_to_csv("interactions", schema, get_interactions_path(schema))
        load_table_to_csv("items", schema, get_items_path(schema))
        load_table_to_csv("users", schema, get_users_path(schema))
    return {"status": "ok"}


@rest_handler
def handle_train(request: web.Request):
    schema = request.match_info.get("schema", None)
    model = request.match_info.get("model", None)
    model_cls = get_model(schema, model)
    df_interactions = load_pandas_df_from_csv(get_interactions_path(schema))

    with TRAIN_DURATION.labels(schema=schema, model=model).time():
        model_cls.fit(df_interactions)
        model_cls.save()

    return {"status": "ok"}


@rest_handler
def recommend_items_for_item(request: web.Request):
    schema = request.match_info.get("schema", None)
    model = request.match_info.get("model", None)
    item_id = request.match_info.get("item_id", None)
    model_cls = get_model(schema, model)
    model_cls.load_cached()

    with RECOMMEND_ITEMS_FOR_ITEM_DURATION.labels(schema=schema, model=model).time():
        return model_cls.recommend_items_for_item(item_id, args=get_args(request))


@rest_handler
def recommend_items_for_user(request: web.Request):
    schema = request.match_info.get("schema", None)
    model = request.match_info.get("model", None)
    user_id = request.match_info.get("user_id", None)
    model_cls = get_model(schema, model)
    model_cls.load_cached()

    with RECOMMEND_ITEMS_FOR_USER_DURATION.labels(schema=schema, model=model).time():
        return model_cls.recommend_items_for_user(user_id, args=get_args(request))


@rest_handler
def recommend_items(request: web.Request):
    schema = request.match_info.get("schema", None)
    model = request.match_info.get("model", None)
    model_cls = get_model(schema, model)
    model_cls.load_cached()

    with RECOMMEND_ITEMS_DURATION.labels(schema=schema, model=model).time():
        return model_cls.recommend_items(args=get_args(request))


@rest_handler
def get_topics_for_user(request: web.Request):
    schema = request.match_info.get("schema", None)
    user_id = request.match_info.get("user_id", None)
    return recommend_topics_for_user(schema, user_id)


@rest_handler
def recommend_items_for_playground(request: web.Request):
    schema = request.match_info.get("schema", None)
    logging.info("Loading data...")
    user_interactions = map(lambda x: (x, 0, x, 1, datetime.now()), request.json)
    df_user_interactions = spark.createDataFrame(user_interactions)

    path = get_interactions_path(schema)
    df = spark.read.csv(path, header=True, inferSchema=True)
    df = df.union(df_user_interactions)
    df = df.toPandas()

    logging.info("Training model...")
    model = ALSModel(schema)
    model.fit(df)

    logging.info("Predicting items...")
    items = model.recommend_items_for_user(0)
    for item in items:
        item["similar_items"] = model.recommend_items_for_item(item["id"])

    return {"collaborativeFiltering": items}


def get_args(request: web.Request):
    return multidict_to_dict(request.rel_url.query)


def multidict_to_dict(multi_dict: MultiDict[str]):
    new_dict = {}
    for k in set(multi_dict.keys()):
        new_dict[k] = multi_dict.getone(k)
    return new_dict
