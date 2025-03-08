import os

from connections.alchemy import engine


def load_table_to_csv(table: str, schema: str = "public", path: str = "out.csv"):
    sql = f"COPY {schema}.{table} TO STDOUT WITH CSV HEADER"

    with engine.connect() as connection:
        cur = connection.connection.cursor()
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "wb") as f:
            cur.copy_expert(sql, f)
