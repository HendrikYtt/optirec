import os

from redis import Redis

REDIS_PUBSUB_HOST = os.environ.get("REDIS_PUBSUB_HOST", "localhost")
REDIS_PUBSUB_PORT = 6379

redis = Redis(
    host=REDIS_PUBSUB_HOST,
    port=REDIS_PUBSUB_PORT,
    decode_responses=True,
)
