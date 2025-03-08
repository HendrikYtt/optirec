from features.models.service import start_app
from features.models_reloader.service import start_reloader

if __name__ == "__main__":
    start_reloader()
    start_app()
