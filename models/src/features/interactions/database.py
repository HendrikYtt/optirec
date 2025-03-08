import pandas as pd

from connections.alchemy import engine


def get_interactions(schema: str):
    with engine.connect() as conn:
        result = conn.execute(
            f"""
                SELECT *
                FROM {schema}.interactions
                LIMIT 10
            """
        )
    return pd.DataFrame(result.all()).set_index('id')
