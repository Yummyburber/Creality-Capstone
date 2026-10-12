from abc import ABC, abstractmethod

from config import Region
from http_client import Fetcher
from models import Product


class Store(ABC):
    """Every supermarket adapter subclasses this and implements search()."""

    name: str = ""              # short id used on the command line, e.g. "walmart"
    countries: tuple = ("US",)  # where this adapter works

    def __init__(self, region: Region, fetcher: Fetcher):
        self.region = region
        self.fetcher = fetcher

    @abstractmethod
    def search(self, query: str, limit: int = 5) -> list[Product]:
        """Return up to `limit` products matching the query, as listed on the site."""
