from aiohttp.web import HTTPNotImplemented

from models.als import ALSModel
from models.attribute import AttributeModel
from models.base import BaseModel
from models.popularity import PopularityModel
from models.popularity_by_country import PopularityByCountry
from models.rating import RatingModel
from models.recent import RecentModel

models = {
    "als": ALSModel,
    "attribute": AttributeModel,
    "popularity": PopularityModel,
    "popularity-by-country": PopularityByCountry,
    "rating": RatingModel,
    "recent": RecentModel,
}

def get_model(schema: str, model: str) -> BaseModel:
    model_cls = models.get(model, None)
    if model_cls is None:
        raise HTTPNotImplemented()
    return model_cls(schema)
