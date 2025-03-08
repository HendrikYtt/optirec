from connections.spark import spark
from pyspark.sql import DataFrame


def load_spark_df_from_csv(csv_path: str) -> DataFrame:
    return spark.read.csv(csv_path, header=True, inferSchema=True)
