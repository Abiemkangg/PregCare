"""
Script untuk ingest embeddings dari embeddings.jsonl ke PostgreSQL PGVector
"""
import os
import json
import pathlib
import sys
from typing import List
from dotenv import load_dotenv

# Import dependencies
try:
    from sentence_transformers import SentenceTransformer
    from langchain_postgres import PGVector
    from langchain_core.documents import Document
    import psycopg2
except ImportError as e:
    print(f"❗ Missing dependency: {e}")
    print("Install dengan: pip install sentence-transformers langchain-postgres psycopg2-binary")
    sys.exit(1)

# Load environment
BASE_DIR = pathlib.Path(__file__).parents[1]
load_dotenv(BASE_DIR / ".env")

# Config
DATA_DIR = BASE_DIR / "data"
EMB_FILE = DATA_DIR / "embeddings" / "embeddings.jsonl"
COLLECTION_NAME = "pregcare_rag"

# Database config
DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": os.getenv("DB_PORT", "5432"),
    "database": os.getenv("DB_NAME", "pregcare_db"),
    "user": os.getenv("DB_USER", "pregcare_user"),
    "password": os.getenv("DB_PASSWORD", "pregcare_pwd"),
}

CONNECTION_STRING = f"postgresql://{DB_CONFIG['user']}:{DB_CONFIG['password']}@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}"


class EmbeddingsWrapper:
    """Wrapper untuk SentenceTransformer"""
    def __init__(self, model_name="all-MiniLM-L6-v2"):
        print(f"📦 Loading embedding model: {model_name}...")
        self.model = SentenceTransformer(model_name)
        print("✅ Model loaded successfully")

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        return self.model.encode(texts, convert_to_numpy=True).tolist()

    def embed_query(self, text: str) -> List[float]:
        return self.model.encode([text], convert_to_numpy=True).tolist()[0]


def test_db_connection() -> bool:
    """Test PostgreSQL connection"""
    print("\n🔍 Testing database connection...")
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        cursor.execute("SELECT version();")
        version = cursor.fetchone()
        print(f"✅ Connected to PostgreSQL: {version[0]}")
        
        # Check if pgvector extension exists
        cursor.execute("SELECT * FROM pg_extension WHERE extname = 'vector';")
        if cursor.fetchone():
            print("✅ pgvector extension is installed")
        else:
            print("⚠️  pgvector extension not found. Installing...")
            cursor.execute("CREATE EXTENSION IF NOT EXISTS vector;")
            conn.commit()
            print("✅ pgvector extension installed")
        
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        print("\n💡 Make sure:")
        print("   1. PostgreSQL is running")
        print("   2. Database credentials in .env are correct")
        print("   3. pgvector extension is available")
        return False


def load_documents_from_jsonl(file_path: pathlib.Path) -> List[Document]:
    """Load documents from embeddings.jsonl"""
    print(f"\n📂 Loading documents from: {file_path}")
    
    if not file_path.exists():
        print(f"❌ File not found: {file_path}")
        return []
    
    documents = []
    with open(file_path, "r", encoding="utf-8") as f:
        for line_num, line in enumerate(f, 1):
            try:
                data = json.loads(line)
                text = data.get("text", "").strip()
                if text:
                    doc = Document(
                        page_content=text,
                        metadata={
                            "doc_id": data.get("doc_id", f"doc_{line_num}"),
                            "source": data.get("source", "unknown"),
                            "chunk_index": data.get("chunk_index", 0),
                        }
                    )
                    documents.append(doc)
            except json.JSONDecodeError:
                print(f"⚠️  Skipping invalid JSON at line {line_num}")
                continue
    
    print(f"✅ Loaded {len(documents)} documents")
    return documents


def ingest_to_pgvector(documents: List[Document], embeddings_wrapper: EmbeddingsWrapper) -> bool:
    """Ingest documents to PGVector"""
    print(f"\n🚀 Starting ingestion to PGVector (collection: {COLLECTION_NAME})...")
    
    try:
        # Create PGVector store
        vectorstore = PGVector(
            connection=CONNECTION_STRING,
            collection_name=COLLECTION_NAME,
            embeddings=embeddings_wrapper,
        )
        
        # Batch size for ingestion
        batch_size = 50
        total_docs = len(documents)
        
        print(f"📊 Ingesting {total_docs} documents in batches of {batch_size}...")
        
        for i in range(0, total_docs, batch_size):
            batch = documents[i:i + batch_size]
            vectorstore.add_documents(batch)
            print(f"   ✓ Ingested {min(i + batch_size, total_docs)}/{total_docs} documents")
        
        print(f"✅ Successfully ingested all {total_docs} documents to PGVector!")
        return True
        
    except Exception as e:
        print(f"❌ Ingestion failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def verify_ingestion() -> bool:
    """Verify data was ingested correctly"""
    print("\n🔍 Verifying ingestion...")
    
    try:
        embeddings_wrapper = EmbeddingsWrapper()
        vectorstore = PGVector(
            connection=CONNECTION_STRING,
            collection_name=COLLECTION_NAME,
            embeddings=embeddings_wrapper,
        )
        
        # Test search
        test_query = "kehamilan"
        results = vectorstore.similarity_search(test_query, k=3)
        
        if results:
            print(f"✅ Verification successful! Found {len(results)} results for query: '{test_query}'")
            print("\n📄 Sample result:")
            print(f"   {results[0].page_content[:200]}...")
            return True
        else:
            print("⚠️  No results found. Data might not be ingested properly.")
            return False
            
    except Exception as e:
        print(f"❌ Verification failed: {e}")
        return False


def main():
    """Main ingestion process"""
    print("=" * 60)
    print("🏥 PregCare RAG - Database Ingestion Script")
    print("=" * 60)
    
    # Step 1: Test database connection
    if not test_db_connection():
        print("\n❌ Please fix database connection issues before proceeding.")
        sys.exit(1)
    
    # Step 2: Load documents
    documents = load_documents_from_jsonl(EMB_FILE)
    if not documents:
        print("\n❌ No documents to ingest. Please check your embeddings.jsonl file.")
        sys.exit(1)
    
    # Step 3: Initialize embeddings
    embeddings_wrapper = EmbeddingsWrapper()
    
    # Step 4: Ingest to PGVector
    if not ingest_to_pgvector(documents, embeddings_wrapper):
        print("\n❌ Ingestion failed. Please check the errors above.")
        sys.exit(1)
    
    # Step 5: Verify ingestion
    if verify_ingestion():
        print("\n" + "=" * 60)
        print("🎉 Database ingestion completed successfully!")
        print("=" * 60)
        print("\n💡 You can now run the RAG pipeline with:")
        print("   python scripts/rag_pipeline.py")
    else:
        print("\n⚠️  Ingestion completed but verification failed.")
        print("   Please check the data manually.")


if __name__ == "__main__":
    main()
