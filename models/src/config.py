import logging
import os
import pathlib
import sys

from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(stream=sys.stdout, level=logging.INFO, format = "%(levelname) -10s %(asctime)s %(module)s:%(lineno)s %(funcName)s %(message)s")

FILE_PATH = pathlib.Path(__file__).parent.resolve()


def get_users_path(schema: str):
    path = os.environ.get("DATA_PATH", os.path.join(FILE_PATH, "..", "data"))
    return os.path.join(path, "processed", f"{schema}_users.csv")


def get_items_path(schema: str):
    path = os.environ.get("DATA_PATH", os.path.join(FILE_PATH, "..", "data"))
    return os.path.join(path, "processed", f"{schema}_items.csv")


def get_interactions_path(schema: str):
    path = os.environ.get("DATA_PATH", os.path.join(FILE_PATH, "..", "data"))
    return os.path.join(path, "processed", f"{schema}_interactions.csv")


def get_model_path(schema: str, model: str):
    path = os.environ.get("MODELS_PATH", os.path.join(FILE_PATH, "..", "models"))
    path = os.path.join(path, f"{schema}_{model}")
    return path
