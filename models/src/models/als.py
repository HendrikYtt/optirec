import numpy as np
import pandas as pd
import pyspark.sql.functions as F
from pyspark.ml.recommendation import ALS
from pyspark.sql.window import Window

from connections.spark import spark
from lib.pagination import get_page
from models.base import BaseModel


class ALSModel(BaseModel):
    def __init__(self, schema: str):
        super().__init__("als", schema)

    def fit(self, df_interactions: pd.DataFrame):
        if len(df_interactions) == 0:
            self.model = ({}, {})
            return

        spark_df = spark.createDataFrame(df_interactions)

        user_id_map = spark_df.select("user_id").distinct()
        user_id_map = user_id_map.withColumn("uid", F.dense_rank().over(Window.orderBy("user_id")))

        item_id_map = spark_df.select("item_id").distinct()
        item_id_map = item_id_map.withColumn("iid", F.dense_rank().over(Window.orderBy("item_id")))

        spark_df = spark_df.join(user_id_map, spark_df.user_id == user_id_map.user_id)
        spark_df = spark_df.join(item_id_map, spark_df.item_id == item_id_map.item_id)

        model = ALS(
            userCol="uid",
            itemCol="iid",
            ratingCol="rating",
            coldStartStrategy="drop",
            implicitPrefs=True,
        )
        model = model.fit(spark_df)

        user_id_map = user_id_map.toPandas().set_index("uid")
        user_factors = model.userFactors.toPandas().set_index("id")
        user_factors = pd.merge(user_id_map, user_factors, left_index=True, right_index=True)
        features_by_user_id = {str(id): np.array(features) for id, features in user_factors.values}

        item_id_map = item_id_map.toPandas().set_index("iid")
        item_factors = model.itemFactors.toPandas().set_index("id")
        item_factors = pd.merge(item_id_map, item_factors, left_index=True, right_index=True)
        features_by_item_id = {str(id): np.array(features) for id, features in item_factors.values}

        self.model = (
            features_by_user_id,
            features_by_item_id,
        )
        super().fit(df_interactions)

    def recommend_items_for_user(self, user_id: str, args: dict = {}):
        limit, offset = get_page(args)
        features_by_user_id, features_by_item_id = self.model

        user_features = features_by_user_id.get(str(user_id), None)
        if user_features is None:
            return []

        recommendations = map(
            lambda id: dict(id=id, score=np.dot(user_features, features_by_item_id[id])),
            features_by_item_id,
        )
        return sorted(recommendations, key=lambda x: x["score"], reverse=True)[offset : (offset + limit)]

    def recommend_items_for_item(self, item_id: str, args: dict = {}):
        limit, offset = get_page(args)
        _, features_by_item_id = self.model

        item_features = features_by_item_id.get(str(item_id), None)
        if item_features is None:
            return []

        recommendations = map(
            lambda id: dict(id=id, score=np.linalg.norm(item_features - features_by_item_id[id])),
            features_by_item_id,
        )
        return sorted(recommendations, key=lambda x: x["score"])[(offset + 1) : (offset + limit + 1)]
