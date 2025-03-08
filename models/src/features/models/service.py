import asyncio
import logging

from aiohttp.web import Application, AppRunner

from features.models.router import (get_topics_for_user, handle_load,
                                    handle_ping, handle_train, recommend_items,
                                    recommend_items_for_item,
                                    recommend_items_for_playground,
                                    recommend_items_for_user)

app = Application()
app.router.add_route("GET", "/ping", handle_ping)
app.router.add_route("POST", "/schemas/{schema}/load", handle_load)
app.router.add_route("POST", "/schemas/{schema}/models/{model}/train", handle_train)
app.router.add_route("GET", "/schemas/{schema}/models/{model}/items/{item_id}/items", recommend_items_for_item)
app.router.add_route("GET", "/schemas/{schema}/models/{model}/users/{user_id}/items", recommend_items_for_user)
app.router.add_route("GET", "/schemas/{schema}/models/{model}/items", recommend_items)
app.router.add_route("GET", "/schemas/{schema}/users/{user_id}/topics", get_topics_for_user)
app.router.add_route("POST", "/schemas/{schema}/playground", recommend_items_for_playground)


def start_app():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    runner = AppRunner(app)
    loop.run_until_complete(runner.setup())
    server = loop.create_server(runner.server, "0.0.0.0", 8000)
    server = loop.run_until_complete(server)
    logging.info("serving on %r", server.sockets[0].getsockname())

    try:
        loop.run_forever()
    except KeyboardInterrupt:
        pass
    finally:
        logging.info("\nBye")
        server.close()
        loop.run_until_complete(server.wait_closed())

    loop.close()
