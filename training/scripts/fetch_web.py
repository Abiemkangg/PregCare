# scripts/fetch_web.py
import os
import json
import pathlib
import requests
from urllib.parse import urlencode

BASE_DIR = pathlib.Path(__file__).parents[1]
RAW_DIR = BASE_DIR / "data" / "raw"
RAW_DIR.mkdir(parents=True, exist_ok=True)

def fetch_crossref(query, rows=20):
    params = {"query.title": query, "rows": rows}
    url = "https://api.crossref.org/works?" + urlencode(params)
    r = requests.get(url, timeout=15)
    r.raise_for_status()
    return r.json()

def fetch_pubmed(query, retmax=20):
    base_esearch = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
    params = {"db":"pubmed", "term": query, "retmax": retmax, "retmode":"json"}
    r = requests.get(base_esearch, params=params, timeout=15)
    r.raise_for_status()
    return r.json()

def save_raw(name, obj):
    safe = "".join(c if c.isalnum() or c in "-_." else "_" for c in name)[:200]
    path = RAW_DIR / (safe + ".json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=2)
    return path

def fetch_all_sources(query):
    print(f"Fetching: {query}")
    try:
        cr = fetch_crossref(query)
        save_raw(f"crossref_{query}", cr)
    except Exception as e:
        print("CrossRef fetch failed:", e)
    try:
        pm = fetch_pubmed(query)
        save_raw(f"pubmed_{query}", pm)
    except Exception as e:
        print("PubMed fetch failed:", e)
    # extend with other sources as needed

if __name__ == '__main__':
    import sys
    q = "maternal nutrition" if len(sys.argv) < 2 else " ".join(sys.argv[1:])
    fetch_all_sources(q)
