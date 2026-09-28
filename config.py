"""Global settings. Change REGION to match where you want prices for."""
from dataclasses import dataclass


@dataclass(frozen=True)
class Region:
    country: str = "US"
    state: str = "IA"
    zip_code: str = "52001"  # change to the ZIP you shop in


REGION = Region()

# Politeness / dev settings
MIN_DELAY_SECONDS = 2.0      # minimum gap between requests to the same host
MAX_RETRIES = 3
CACHE_DIR = ".cache"         # raw responses are cached here while developing
CACHE_TTL_SECONDS = 60 * 60  # re-fetch after an hour; set 0 to disable cache
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
)
