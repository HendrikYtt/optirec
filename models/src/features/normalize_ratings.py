from connections.spark import spark
import pyspark.sql.functions as F


def normalize_ratings(in_file, out_file):
    df = spark.read.csv(in_file, header=True, inferSchema=True)
    return (
        df.join(
            df.groupBy("bet_id").agg(F.count("id").alias("n_selections")), on="bet_id"
        )
        .join(
            df.groupBy("user_id").agg(
                F.max("bet_stake_eur").alias("bet_stake_eur_max")
            ),
            on="user_id",
        )
        .write.csv(out_file, header=True)
    )
