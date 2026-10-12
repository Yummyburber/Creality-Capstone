"""Usage:  python main.py "whole milk" [--stores walmart] [--limit 5]"""
import argparse

import config
import stores
from http_client import BlockedError, Fetcher


def main():
    ap = argparse.ArgumentParser(description="Compare supermarket prices")
    ap.add_argument("query", help="product to search for, e.g. 'whole milk'")
    ap.add_argument("--stores", nargs="*", default=stores.available(),
                    help=f"stores to search (available: {', '.join(stores.available())})")
    ap.add_argument("--limit", type=int, default=5, help="results per store")
    args = ap.parse_args()

    r = config.REGION
    print(f"Searching '{args.query}' for {r.state}, {r.country} ({r.zip_code})\n")

    fetcher = Fetcher()
    for store_name in args.stores:
        store = stores.get(store_name)(r, fetcher)
        print(f"== {store_name.title()} ==")
        try:
            results = store.search(args.query, args.limit)
        except BlockedError as e:
            print(f"  Blocked: {e}\n")
            continue
        except Exception as e:  # keep going if one store breaks
            print(f"  Error: {e}\n")
            continue
        if not results:
            print("  No results.\n")
            continue
        for p in results:
            unit = f"  ({p.unit_price})" if p.unit_price else ""
            stock = "" if p.in_stock else "  [out of stock]"
            print(f"  ${p.price:.2f}  {p.name}{unit}{stock}")
        print()


if __name__ == "__main__":
    main()
