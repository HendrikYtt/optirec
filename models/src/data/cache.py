cache = {}


def cache_key(model: str, schema: str):
    return f"{model}_{schema}"


def cached(model: str, schema: str, func):
    key = cache_key(model, schema)

    result = cache.get(key)
    if result:
        return result

    result = func()
    cache[key] = result
    return result


def invalidate_cache(model: str, schema: str):
    key = cache_key(model, schema)
    if key in cache:
        del cache[key]
