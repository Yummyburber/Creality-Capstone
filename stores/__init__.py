"""Store registry. To add a supermarket:
  1. create stores/<name>.py with a Store subclass decorated with @register
  2. import it at the bottom of this file
"""
from .base import Store

_REGISTRY: dict[str, type[Store]] = {}


def register(cls: type[Store]) -> type[Store]:
    _REGISTRY[cls.name] = cls
    return cls


def available() -> list[str]:
    return sorted(_REGISTRY)


def get(name: str) -> type[Store]:
    try:
        return _REGISTRY[name]
    except KeyError:
        raise SystemExit(f"Unknown store '{name}'. Available: {', '.join(available())}")


# --- add new store imports below this line ---
from . import walmart  # noqa: E402,F401
