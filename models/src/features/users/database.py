import pandas as pd
from connections.alchemy import engine


def get_users_attribute(schema: str, user_ids: list, attribute: str):
    with engine.connect() as conn:
        result = conn.execute(
            f"""
                SELECT id, attributes->>%(attribute)s AS {attribute}
                FROM {schema}.users
                WHERE id = ANY(%(user_ids)s)
            """,
            attribute=attribute,
            user_ids=user_ids
        )
    return pd.DataFrame(result.all()).set_index('id')
