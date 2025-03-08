import json
import logging
import re

import pandas as pd

from connections.rabbit import rabbit
from connections.redis_pubsub import redis
from models.attribute import AttributeModel
from models.recent import RecentModel


def start_trainer():
    logging.info("Starting online trainer...")
    queue = "models-trainer"

    channel = rabbit.channel()
    channel.queue_declare(queue=queue)
    channel.queue_bind(queue=queue, exchange="api", routing_key="*.interactions")
    channel.basic_consume(queue=queue, auto_ack=True, on_message_callback=trainer_callback)
    channel.start_consuming()


def trainer_callback(_ch, method, _properties, body):
    try:
        application_id = re.search(r"apps_(\d+).interactions", method.routing_key).group(1)
        schema = f"apps_{application_id}"

        df_interaction = pd.Series(json.loads(body))

        model = RecentModel(schema)
        model.load_cached()
        model.fit_one(df_interaction)
        model.save()

        model = AttributeModel(schema)
        model.load_cached()
        model.fit_one(df_interaction)
        model.save()

        redis.publish("models-reload", schema)

        logging.info('Captured interaction %s for application %s', df_interaction["id"], application_id)
    except Exception as err:
        logging.exception(err)


if __name__ == "__main__":
    start_trainer()
