import os

from pika import BlockingConnection, ConnectionParameters, PlainCredentials

RABBITMQ_HOST = os.environ.get("RABBITMQ_HOST", "localhost")
RABBITMQ_USER = os.environ.get("RABBITMQ_USER", "admin")
RABBITMQ_PASS = os.environ.get("RABBITMQ_PASS", "admin")

rabbit = BlockingConnection(
    ConnectionParameters(
        host=RABBITMQ_HOST,
        credentials=PlainCredentials(username=RABBITMQ_USER, password=RABBITMQ_PASS),
    )
)
