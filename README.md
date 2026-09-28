# Supermarket price scraper

```
pip install -r requirements.txt
python main.py "whole milk"
python main.py "eggs" --stores walmart --limit 3
```

## Layout
- `config.py`      region (US / IA / ZIP), delays, cache settings
- `models.py`      `Product` dataclass (name as listed, price, unit price, url)
- `http_client.py` rate limiting, retries, disk cache, bot-block detection
- `stores/base.py` the `Store` interface every supermarket implements
- `stores/__init__.py` registry
- `stores/walmart.py` first adapter

## Adding a supermarket
1. Copy `stores/walmart.py` to `stores/<name>.py`, set `name = "<name>"`.
2. Find the store's data source (DevTools -> Network -> Fetch/XHR while searching).
3. Implement `search()` to return `Product` objects.
4. Add `from . import <name>` at the bottom of `stores/__init__.py`.
