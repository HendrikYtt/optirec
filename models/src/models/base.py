import logging
import os
import pickle

from pandas import DataFrame

from config import get_model_path

cache = {}

class BaseModel:
    def __init__(self, name: str, schema: str):
        self.name = name
        self.model_path = get_model_path(schema, name)
        self.schema = schema
        self.model = None
        self.cache_key = f'{name}.{schema}'

    def save(self):
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        with open(self.model_path, "wb") as file:
            pickle.dump(self.model, file, pickle.HIGHEST_PROTOCOL)

    def load(self):
        logging.info('Loading model for %s...', self.cache_key)
        if not os.path.exists(self.model_path):
            logging.info(f'Model is not trained yet for {self.cache_key}')
            return

        with open(self.model_path, "rb") as file:
            self.model = pickle.load(file)
        self.cache()
        logging.info('Loaded model for %s', self.cache_key)

    def load_cached(self):
        if self.cache_key in cache:
            self.model = cache[self.cache_key]
        else:
            self.load()

    def cache(self):
        cache[self.cache_key] = self.model

    def fit(self, df_interactions: DataFrame):
        self.cache()

    def recommend_items_for_user(self, user_id: str, args = {}):
        raise NotImplementedError()

    def recommend_items_for_item(self, item_id: str, args = {}):
        raise NotImplementedError()

    def recommend_items(self, args = {}):
        raise NotImplementedError()
