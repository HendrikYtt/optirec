import json
import logging
import os
import re

import pandas as pd

from config import get_interactions_path, get_items_path, get_users_path
from connections.rabbit import rabbit
from data.table_to_csv import load_table_to_csv


def start_data_appender():
    logging.info("Starting data appender...")

    channel = rabbit.channel()

    queue = "models-user-appender"
    channel.queue_declare(queue=queue)
    channel.queue_bind(queue=queue, exchange="api", routing_key="*.users")
    channel.basic_consume(queue=queue, auto_ack=True, on_message_callback=message_callback)

    queue = "models-item-appender"
    channel.queue_declare(queue=queue)
    channel.queue_bind(queue=queue, exchange="api", routing_key="*.items")
    channel.basic_consume(queue=queue, auto_ack=True, on_message_callback=message_callback)

    queue = "models-interaction-appender"
    channel.queue_declare(queue=queue)
    channel.queue_bind(queue=queue, exchange="api", routing_key="*.interactions")
    channel.basic_consume(queue=queue, auto_ack=True, on_message_callback=message_callback)

    channel.start_consuming()


def message_callback(_ch, method, _properties, body):
    try:
        matches = re.search(r"apps_(\d+)\.(.+)", method.routing_key)
        application_id = matches.group(1)
        table = matches.group(2)

        schema = f"apps_{application_id}"

        body = json.loads(body)
        if 'attributes' in body:
            body['attributes'] = json.dumps(body['attributes'])

        df = pd.DataFrame.from_records([body]).set_index('id')
        logging.info(df)

        path = {"users": get_users_path, "items": get_items_path, "interactions": get_interactions_path}[table](schema)
        if not os.path.exists(path):
            load_table_to_csv(table, schema, path)

        df.to_csv(path, mode="a", header=False)
        logging.info("%s stored", table)
    except Exception as err:
        logging.exception(err)


if __name__ == "__main__":
    start_data_appender()
