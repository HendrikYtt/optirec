from connections.alchemy import engine


def get_user_properties(schema: str):
    with engine.connect() as conn:
        result = conn.execute(
            f"""
                SELECT name, type
                FROM {schema}.user_properties
            """
        )
    return [
        (
            name,
            type,
        )
        for (name, type) in result
    ]


def get_item_properties(schema: str):
    with engine.connect() as conn:
        result = conn.execute(
            f"""
                SELECT name, type
                FROM {schema}.item_properties
            """
        )
    return [
        (
            name,
            type,
        )
        for (name, type) in result
    ]


def get_interaction_properties(schema: str):
    with engine.connect() as conn:
        result = conn.execute(
            f"""
                SELECT name, type
                FROM {schema}.interaction_properties
            """
        )
    return [
        (
            name,
            type,
        )
        for (name, type) in result
    ]
