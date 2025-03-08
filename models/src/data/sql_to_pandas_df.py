import pandas as pd

from connections.alchemy import engine

pd.set_option("display.expand_frame_repr", False)


def get_items(schema: str):
    with engine.connect() as connection:
        items = pd.read_sql(
            f"SELECT id, title, array_to_json(keywords) as keywords FROM {schema}.items",
            connection,
        )
    items["keywords"] = items["keywords"].apply(
        lambda keywords: " ".join({x.strip().lower() for x in keywords})
    )
    return items


def get_users(schema: str):
    with engine.connect() as connection:
        return pd.read_sql(f"SELECT * FROM {schema}.users", connection)


def get_interactions(schema: str):
    with engine.connect() as connection:
        return pd.read_sql(f"SELECT * FROM {schema}.interactions", connection)
