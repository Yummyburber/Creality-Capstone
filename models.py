from dataclasses import dataclass


@dataclass
class Product:
    store: str
    name: str                    # name exactly as listed on the site
    price: float | None          # listed price in USD, None if not shown
    unit_price: str | None = None  # e.g. "$0.03/fl oz", if the site lists it
    url: str | None = None
    in_stock: bool = True
