import asyncio
import logging
from threading import Thread

import aioredis

from connections.io import io
from connections.redis_pubsub import REDIS_PUBSUB_HOST, REDIS_PUBSUB_PORT
from models.als import ALSModel
from models.attribute import AttributeModel
from models.recent import RecentModel


async def start_consumer():
    redis = await aioredis.from_url(f"redis://{REDIS_PUBSUB_HOST}:{REDIS_PUBSUB_PORT}")
    pubsub = redis.pubsub()
    try:
        await pubsub.subscribe("models-reload")
        async for message in pubsub.listen():
            if message["type"] == "subscribe":
                continue

            schema = message['data'].decode()
            try:
                AttributeModel(schema).load()
                ALSModel(schema).load()
                RecentModel(schema).load()
                io.In(schema).Emit("models-reloaded")
            except Exception as err:
                logging.exception(err)
    except asyncio.CancelledError:
        pass
    finally:
        await pubsub.unsubscribe()
        await pubsub.close()


def start_event_loop():
    loop = asyncio.new_event_loop()
    loop.create_task(start_consumer())
    try:
        loop.run_forever()
    except KeyboardInterrupt:
        pass
    finally:
        loop.close()


def start_reloader():
    thread = Thread(target = start_event_loop, daemon=True)
    thread.start()
    return thread
