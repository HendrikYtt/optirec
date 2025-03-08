import os

from pyspark.sql import SparkSession

os.environ.setdefault("SPARK_LOCAL_IP", "127.0.0.1")

SPARK_MASTER = os.environ.get("SPARK_MASTER", "local[*]")

spark = SparkSession.builder.master(SPARK_MASTER).config("spark.driver.memory", "15g").appName("nrocinu").getOrCreate()

spark.sparkContext.setLogLevel("ERROR")
