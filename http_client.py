"""Shared fetcher: rate limiting, retries with backoff, and a disk cache."""
import hashlib
import json
import time
from pathlib import Path
from urllib.parse import urlparse

import requests

import config


class BlockedError(Exception):
    """The site served a bot check / CAPTCHA instead of real content."""


class Fetcher:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": config.USER_AGENT,
            "Accept-Language": "en-US,en;q=0.9",
            "Accept": "text/html,application/json;q=0.9,*/*;q=0.8",
        })
        self._last_hit: dict[str, float] = {}
        self.cache_dir = Path(config.CACHE_DIR)
        self.cache_dir.mkdir(exist_ok=True)

    def _cache_path(self, url, params):
        key = json.dumps([url, params], sort_keys=True)
        return self.cache_dir / (hashlib.sha256(key.encode()).hexdigest() + ".txt")

    def _wait(self, host):
        gap = time.time() - self._last_hit.get(host, 0)
        if gap < config.MIN_DELAY_SECONDS:
            time.sleep(config.MIN_DELAY_SECONDS - gap)
        self._last_hit[host] = time.time()

    def get(self, url, params=None) -> str:
        path = self._cache_path(url, params)
        if config.CACHE_TTL_SECONDS and path.exists():
            if time.time() - path.stat().st_mtime < config.CACHE_TTL_SECONDS:
                return path.read_text(encoding="utf-8")

        host = urlparse(url).netloc
        for attempt in range(config.MAX_RETRIES):
            self._wait(host)
            resp = self.session.get(url, params=params, timeout=20)
            if resp.status_code in (429, 500, 502, 503, 504):
                time.sleep(2 ** attempt * 3)  # exponential backoff
                continue
            if resp.status_code in (403, 412):
                raise BlockedError(f"{host} returned {resp.status_code} (likely bot protection)")
            resp.raise_for_status()
            path.write_text(resp.text, encoding="utf-8")
            return resp.text
        raise RuntimeError(f"Gave up on {url} after {config.MAX_RETRIES} attempts")
