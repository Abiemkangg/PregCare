# scripts/parsing.py
import os
import json
import pathlib
import re
from psycopg2.extras import execute_values
import psycopg2

BASE_DIR = pathlib.Path(__file__).parents[1]
RAW_DIR = BASE_DIR / "data" / "raw"
PROCESSED_DIR = BASE_DIR / "data" / "processed"
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

def connect_db():
    return psycopg2.connect(
        host=os.getenv('DB_HOST','localhost'),
        port=os.getenv('DB_PORT','5432'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        dbname=os.getenv('DB_NAME')
    )

def clean_text(s):
    if not s: return ""
    s = re.sub(r"\s+", " ", str(s)).strip()
    return s

def extract_from_crossref(raw):
    items = []
    for r in raw.get('message', {}).get('items', []):
        doi = r.get('DOI')
        title = " ".join(r.get('title',[])) if r.get('title') else ""
        abstract = r.get('abstract') or ''
        year = None
        if 'published-print' in r and 'date-parts' in r['published-print']:
            year = r['published-print']['date-parts'][0][0]
        items.append({
            'id': doi or r.get('URL'),
            'title': clean_text(title),
            'abstract': clean_text(abstract),
            'source': 'crossref',
            'category': None,
            'year': year,
            'doi': doi
        })
    return items

def process_all_raw_files():
    docs = []
    for p in RAW_DIR.glob('*.json'):
        try:
            raw = json.loads(p.read_text(encoding='utf-8'))
            if 'crossref' in p.name:
                docs += extract_from_crossref(raw)
            elif 'pubmed' in p.name:
                ids = raw.get('esearchresult', {}).get('idlist', [])
                for uid in ids:
                    docs.append({'id': f'pmid:{uid}', 'title':'', 'abstract':'', 'source':'pubmed', 'category':None, 'year':None, 'doi':None})
            out = PROCESSED_DIR / (p.stem + '_processed.json')
            out.write_text(json.dumps({'docs_count':len(docs)}, ensure_ascii=False), encoding='utf-8')
        except Exception as e:
            print('parse error', p, e)

    if docs:
        conn = connect_db()
        cur = conn.cursor()
        sql = """
        INSERT INTO documents (id, title, abstract, source, category, year, doi)
        VALUES %s
        ON CONFLICT (id) DO NOTHING;
        """
        values = [(d['id'], d.get('title',''), d.get('abstract',''), d.get('source',''), d.get('category'), d.get('year'), d.get('doi')) for d in docs]
        execute_values(cur, sql, values)
        conn.commit()
        cur.close()
        conn.close()
        print(f"Inserted {len(values)} documents into DB")

if __name__ == '__main__':
    process_all_raw_files()
