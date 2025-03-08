import json
import logging
from functools import wraps

from aiohttp import web


def rest_handler(handler_func):
    @wraps(handler_func)
    def wrapper(request):
        error_code = None
        try:
            result = handler_func(request)
        except web.HTTPException as error:
            error_code = error.status_code
            result = dict(error_code=error_code, error_reason=error.reason)
        except Exception:
            logging.warning("Server error", exc_info=True)
            error_code = 500
            result = dict(error_code=error_code, error_reason="Unhandled exception")

        assert isinstance(result, (dict, list))
        body = json.dumps(result).encode("utf-8")
        result = web.Response(body=body)
        result.headers["Content-Type"] = "application/json"
        if error_code:
            result.set_status(error_code)
        return result

    return wrapper
