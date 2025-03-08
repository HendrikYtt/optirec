from connections.alchemy import engine

def list_app_schemas():
    with engine.connect() as conn:
        result = conn.execute("""
            SELECT nspname 
            FROM pg_catalog.pg_namespace 
            WHERE nspname ILIKE 'apps_%%'
        """)
    return [schema for (schema, ) in result]
