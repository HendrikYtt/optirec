import logging
import os
from time import sleep

from config import get_interactions_path, get_items_path
from connections.redis_pubsub import redis
from data.csv_to_pandas_df import load_pandas_df_from_csv
from data.table_to_csv import load_table_to_csv
from lib.postgres import list_app_schemas
from models.als import ALSModel
from models.attribute import AttributeModel
from models.popularity import PopularityModel
from models.popularity_by_country import PopularityByCountry
from models.rating import RatingModel

# TODO: make a schedule in postgres to distribute training across replicas


def start_trainer():
    logging.info("Starting offline trainer...")
    while True:
        schemas = list_app_schemas()
        for schema in schemas:
            if schema == "apps_7" or schema == "apps_13":
                # movielens datasets. TODO: fix list attributes
                continue

            try:
                logging.info("Training %s...", schema)

                path = get_items_path(schema)
                if not os.path.exists(path):
                    load_table_to_csv("items", schema, path)

                path = get_interactions_path(schema)
                if not os.path.exists(path):
                    load_table_to_csv("interactions", schema, path)
                df_interactions = load_pandas_df_from_csv(path)

                models = [PopularityByCountry, PopularityModel, RatingModel, AttributeModel, ALSModel]
                for model in models:
                    try:
                        logging.info(f"Training {model.__name__}")
                        model = model(schema)
                        model.fit(df_interactions)
                        model.save()
                    except Exception as err:
                        logging.exception(err)
                redis.publish("models.reload", schema)

            except Exception as err:
                logging.exception(err)

        sleep(10.0)


if __name__ == "__main__":
    start_trainer()
