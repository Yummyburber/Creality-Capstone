"""Walmart adapter.

Approach: Walmart's search page is a Next.js app, so the results are embedded in the
HTML as JSON inside <script id="__NEXT_DATA__">. We parse that instead of scraping tags.

CAVEATS (verify in your browser's Network/Elements tabs, these can change any time):
  * Walmart uses aggressive bot protection. You may get a CAPTCHA page instead of results.
  * The JSON path below (props.pageProps.initialData.searchResult.itemStacks) is my best
    understanding and may need adjusting.
  * Prices depend on the selected store. Location is cookie-based; see _apply_location().
"""
import json
import re

from bs4 import BeautifulSoup

from http_client import BlockedError
from models import Product
from . import register
from .base import Store

BASE = "https://www.walmart.com"


def dig(obj, *path, default=None):
    """Safely walk nested dicts/lists: dig(d, 'a', 0, 'b')."""
    for key in path:
        try:
            obj = obj[key]
        except (KeyError, IndexError, TypeError):
            return default
    return obj


@register
class Walmart(Store):
    name = "walmart"

    def _apply_location(self):
        """TODO: make results reflect Iowa stores.

        Open walmart.com, choose a store/ZIP in Iowa, then check DevTools ->
        Application -> Cookies for the location cookies (e.g. ones containing store id
        and ZIP). Copy the names/values here, e.g.:
            self.fetcher.session.cookies.set("assortmentStoreId", "<id>", domain=".walmart.com")
        Until then you get default (non-Iowa) pricing.
        """

    def search(self, query, limit=5):
        self._apply_location()
        html = self.fetcher.get(f"{BASE}/search", params={"q": query})

        if re.search(r"robot or human|px-captcha|verify your identity", html, re.I):
            raise BlockedError("Walmart served a bot check instead of results")

        tag = BeautifulSoup(html, "html.parser").find("script", id="__NEXT_DATA__")
        if not tag or not tag.string:
            raise RuntimeError("No __NEXT_DATA__ found; page layout may have changed")
        data = json.loads(tag.string)

        stacks = dig(data, "props", "pageProps", "initialData", "searchResult",
                     "itemStacks", default=[])
        products = []
        for stack in stacks:
            for item in stack.get("items", []):
                name = item.get("name")
                if not name:  # ads/banners have no name
                    continue
                price = dig(item, "priceInfo", "currentPrice", "price")
                if price is None:
                    continue
                link = item.get("canonicalUrl")
                products.append(Product(
                    store="Walmart",
                    name=name,
                    price=float(price),
                    unit_price=dig(item, "priceInfo", "unitPrice"),
                    url=BASE + link if link else None,
                    in_stock=dig(item, "availabilityStatusV2", "value", default="IN_STOCK") == "IN_STOCK",
                ))
                if len(products) >= limit:
                    return products
        return products
