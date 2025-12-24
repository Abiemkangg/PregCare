# FINAL embedding.py — FULL AI, NO GEMINI QUOTA, NO LANGCHAIN HF
# Menggunakan SentenceTransformer langsung + PGVector yang kompatibel

import os
import json
import pathlib
from sentence_transformers import SentenceTransformer
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv
load_dotenv()

BASE_DIR = pathlib.Path(__file__).parents[1]
load_dotenv(BASE_DIR / ".env")
DATA_DIR = BASE_DIR / "data"
PROCESSED_DIR = DATA_DIR / "processed"
EMB_DIR = DATA_DIR / "embeddings"
EMB_DIR.mkdir(parents=True, exist_ok=True)
EMB_FILE = EMB_DIR / "embeddings.jsonl"

# ===== AI EMBEDDING MODEL (HuggingFace Transformer) =====
MODEL = SentenceTransformer("all-MiniLM-L6-v2")

def connect_db():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=os.getenv("DB_PORT", "5432"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        dbname=os.getenv("DB_NAME"),
    )

# ===== TEXT CHUNKING =====
def chunk_text(text, max_words=300):
    words = text.split()
    chunks = []
    for i in range(0, len(words), max_words):
        chunks.append(" ".join(words[i : i + max_words]))
    return chunks

# ===== MAIN EMBEDDING GENERATOR =====
def generate_embeddings():
    print("📦 Membaca dokumen dari PostgreSQL...")

    conn = connect_db()
    cur = conn.cursor()
    cur.execute("SELECT id, title, abstract FROM documents;")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    print(f"✔ {len(rows)} dokumen ditemukan, memulai embedding...")

    all_records = []

    for (doc_id, title, abstract) in rows:
        text = (title or "") + "\n\n" + (abstract or "")
        if not text.strip():
            continue

        chunks = chunk_text(text)
        for idx, chunk in enumerate(chunks):
            emb = MODEL.encode(chunk, convert_to_numpy=True).tolist()
            all_records.append(
                {
                    "doc_id": doc_id,
                    "chunk_id": idx,
                    "text": chunk,
                    "category": None,
                    "source": None,
                    "embedding": emb,
                }
            )

    # ===== SIMPAN JSONL =====
    with open(EMB_FILE, "w", encoding="utf-8") as f:
        for rec in all_records:
            f.write(json.dumps(rec, ensure_ascii=False) + "\n")

    print(f"✔ {len(all_records)} embedding disimpan ke embeddings.jsonl")

    # ===== INSERT POSTGRES =====
    print("📥 Menyimpan embedding ke PostgreSQL...")
    conn = connect_db()
    cur = conn.cursor()

    sql = """
        INSERT INTO pregcare_embeddings
        (doc_id, chunk_index, text_chunk, category, source, embedding)
        VALUES %s
    """

    values = [
        (
            r["doc_id"],
            r["chunk_id"],
            r["text"],
            r["category"],
            r["source"],
            r["embedding"],
        )
        for r in all_records
    ]

    execute_values(cur, sql, values)
    conn.commit()
    cur.close()
    conn.close()

    print(f"✔ {len(values)} embedding berhasil dimasukkan ke DB!")
    print("🎉 Tahap embedding selesai tanpa error.")

if __name__ == "__main__":
    generate_embeddings()
