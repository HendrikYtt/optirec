from socket_io_emitter import Emitter

from connections.redis_pubsub import REDIS_PUBSUB_HOST, REDIS_PUBSUB_PORT

io = Emitter({"host": REDIS_PUBSUB_HOST, "port": REDIS_PUBSUB_PORT})
