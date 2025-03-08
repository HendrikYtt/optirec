from pandas import Series

from models.base import BaseModel


class BaseOnlineModel(BaseModel):
    def fit_one(self, df_interaction: Series):
        self.cache()
