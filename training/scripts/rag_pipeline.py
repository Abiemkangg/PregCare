# rag_pipeline.py — FINAL CLEAN (compatible & robust genai)
# - Uses: sentence-transformers, langchain-postgres (PGVector), google-genai / google.generativeai fallback
# - Features:
#   * retriever.invoke(question) usage (avoids internal _get_relevant_documents)
#   * robust genai wrapper with multiple fallbacks
#   * safety filter for disallowed items & length
#   * optimized prompt template + context summarization
#   * interactive chat mode (realtime QA)
#   * clear error handling & informative logs

import os
import json
import pathlib
import time
import sys
import textwrap
import logging
import traceback
from typing import List, Optional, Dict, Tuple
from datetime import datetime

# Semantic cache
try:
    from semantic_cache import SemanticCache
except ImportError:
    SemanticCache = None

# third-party
try:
    from dotenv import load_dotenv
except Exception:
    load_dotenv = None

try:
    from sentence_transformers import SentenceTransformer
except Exception:
    SentenceTransformer = None

# langchain components (light usage)
try:
    from langchain_postgres import PGVector
    from langchain_core.documents import Document
    from langchain_core.prompts import PromptTemplate
except Exception:
    PGVector = None
    Document = None
    PromptTemplate = None

# try genai packages (we'll handle multiple possibilities)
GENAI_MODULE = None
GENAI_OLD = None
try:
    import google.genai as genai_new  # newer package (google-genai)
    GENAI_MODULE = "genai_new"
except Exception:
    genai_new = None

try:
    import google.generativeai as genai_old  # older package (google-generativeai)
    GENAI_OLD = "genai_old"
except Exception:
    genai_old = None

# -------------------------
# LOGGING SETUP
# -------------------------
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('rag_pipeline.log', encoding='utf-8')
    ]
)
logger = logging.getLogger(__name__)

# -------------------------
# PATH + ENV
# -------------------------
ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT))

BASE_DIR = pathlib.Path(__file__).parents[1]
if load_dotenv:
    load_dotenv(BASE_DIR / ".env")

DATA_DIR = BASE_DIR / "data"
EMB_FILE = DATA_DIR / "embeddings" / "embeddings.jsonl"

# -------------------------
# CONFIG
# -------------------------
DEFAULT_MODEL = os.getenv("MODEL_NAME") or os.getenv("GENAI_MODEL", "gemini-2.0-flash")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY") or os.getenv("GENAI_API_KEY") or os.getenv("API_KEY")
PG_CONN_TEMPLATE = "postgresql://{user}:{password}@{host}:{port}/{dbname}"

# safety: simple list (extend as needed)
SAFETY_BLOCKLIST = [
    "illicit drug",
    "bomb",
    "explosive",
    "weaponize",
    "manufacture firearm",
    # add more phrases you want to block
]

MAX_CONTEXT_CHARS = 18000  # trim context if too long

# -------------------------
# EMBEDDING WRAPPER
# -------------------------
class SimpleEmbeddingsWrapper:
    """Thin wrapper for SentenceTransformer used by PGVector"""
    def __init__(self, model_name="all-MiniLM-L6-v2"):
        if SentenceTransformer is None:
            raise RuntimeError("sentence-transformers not installed in this environment.")
        self._model = SentenceTransformer(model_name)

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        return self._model.encode(texts, convert_to_numpy=True).tolist()

    def embed_query(self, text: str) -> List[float]:
        return self._model.encode([text], convert_to_numpy=True).tolist()[0]

# -------------------------
# Safety check
# -------------------------
def safety_check(user_text: str) -> Optional[str]:
    """Return reason string if blocked, else None."""
    ut = user_text.lower()
    for bad in SAFETY_BLOCKLIST:
        if bad in ut:
            return f"Blocked due to safety policy: contains '{bad}'"
    if len(user_text.strip()) == 0:
        return "Empty query."
    if len(user_text) > 5000:
        return "Query too long."
    return None

# -------------------------
# Conversation History Manager
# -------------------------
class ConversationHistory:
    """Manage conversation history for context-aware responses"""
    def __init__(self, max_history: int = 5):
        self.history: List[Dict[str, str]] = []
        self.max_history = max_history
        logger.info(f"ConversationHistory initialized with max_history={max_history}")
    
    def add_exchange(self, question: str, answer: str):
        """Add Q&A pair to history"""
        self.history.append({
            "question": question,
            "answer": answer,
            "timestamp": datetime.now().isoformat()
        })
        # Keep only last N exchanges
        if len(self.history) > self.max_history:
            self.history = self.history[-self.max_history:]
        logger.debug(f"Added exchange to history. Total exchanges: {len(self.history)}")
    
    def get_context(self) -> str:
        """Get conversation history as formatted string"""
        if not self.history:
            return ""
        
        context_parts = ["\n=== RIWAYAT PERCAKAPAN ==="]
        for i, exchange in enumerate(self.history[-3:], 1):  # Last 3 exchanges
            context_parts.append(f"\nQ{i}: {exchange['question']}")
            context_parts.append(f"A{i}: {exchange['answer'][:150]}...")  # Truncate for brevity
        context_parts.append("\n=== AKHIR RIWAYAT ===\n")
        
        return "\n".join(context_parts)
    
    def clear(self):
        """Clear conversation history"""
        self.history.clear()
        logger.info("Conversation history cleared")

# -------------------------
# GenAI call wrapper (simplified and working)
# -------------------------
class GenAIClientWrapper:
    """Simple wrapper for google.genai Client"""
    def __init__(self, api_key: Optional[str], model: str = DEFAULT_MODEL):
        self.api_key = api_key
        self.model = model
        
        if genai_new is None:
            raise RuntimeError("google-genai package not installed. Run: pip install google-genai")
        
        # Initialize client
        self.client = genai_new.Client(api_key=api_key)
        logger.info(f"✅ GenAI client initialized with model: {model}")

    def generate(self, prompt: str, temperature: float = 0.2, max_output_tokens: int = 512) -> str:
        """
        Generate text using Gemini API with retry logic for rate limiting
        """
        max_retries = 3
        base_delay = 2  # seconds
        
        for attempt in range(max_retries):
            try:
                # Call API with correct parameters for google-genai 1.52.0
                response = self.client.models.generate_content(
                    model=self.model,
                    contents=prompt
                )
                
                # Extract text from response
                if hasattr(response, 'text') and response.text:
                    return response.text.strip()
                
                # Try alternative extraction paths
                if hasattr(response, 'candidates') and response.candidates:
                    candidate = response.candidates[0]
                    if hasattr(candidate, 'content'):
                        if hasattr(candidate.content, 'parts'):
                            parts = candidate.content.parts
                            if parts and hasattr(parts[0], 'text'):
                                return parts[0].text.strip()
                
                # If no text found
                logger.error(f"⚠️  Response has no extractable text: {response}")
                return "Maaf, tidak dapat menghasilkan jawaban. Silakan coba lagi."
                
            except Exception as e:
                error_msg = str(e)
                
                # Handle 429 rate limit error
                if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
                    if attempt < max_retries - 1:
                        wait_time = base_delay * (2 ** attempt)  # Exponential backoff
                        logger.warning(f"⚠️  Rate limit reached (429). Retrying in {wait_time}s... (Attempt {attempt+1}/{max_retries})")
                        time.sleep(wait_time)
                        continue
                    else:
                        logger.error(f"❌ Rate limit exceeded after {max_retries} attempts")
                        return "Maaf, sistem sedang sibuk karena banyak permintaan. Silakan tunggu beberapa saat dan coba lagi. 🙏"
                
                # Handle other errors
                logger.error(f"❌ GenAI API call failed: {e}")
                logger.debug(traceback.format_exc())
                
                if attempt < max_retries - 1:
                    wait_time = base_delay
                    logger.warning(f"⚠️  Retrying in {wait_time}s... (Attempt {attempt+1}/{max_retries})")
                    time.sleep(wait_time)
                    continue
                else:
                    return f"Maaf, terjadi kesalahan teknis. Silakan coba lagi nanti. ({error_msg[:100]})"
        
        return "Maaf, tidak dapat menghasilkan jawaban setelah beberapa percobaan. Silakan coba lagi."

# -------------------------
# Health Checks
# -------------------------
def health_check_database(pg_conn: str) -> Tuple[bool, str]:
    """Check if database is accessible and properly configured"""
    try:
        import psycopg2
        # Parse connection string
        parts = pg_conn.replace('postgresql://', '').split('@')
        user_pass = parts[0].split(':')
        host_port_db = parts[1].split('/')
        host_port = host_port_db[0].split(':')
        
        conn_params = {
            'user': user_pass[0],
            'password': user_pass[1],
            'host': host_port[0],
            'port': host_port[1] if len(host_port) > 1 else '5432',
            'database': host_port_db[1]
        }
        
        conn = psycopg2.connect(**conn_params)
        cursor = conn.cursor()
        
        # Check pgvector extension
        cursor.execute("SELECT * FROM pg_extension WHERE extname = 'vector';")
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return False, "pgvector extension not installed"
        
        cursor.close()
        conn.close()
        logger.info("✅ Database health check passed")
        return True, "Database is healthy"
        
    except Exception as e:
        logger.error(f"❌ Database health check failed: {e}")
        return False, f"Database connection error: {str(e)}"

# -------------------------
# RAG pipeline
# -------------------------
def build_retriever(pg_conn: Optional[str], embeddings_wrapper: Optional[SimpleEmbeddingsWrapper], collection_name="pregcare_rag"):
    """Build PGVector retriever with comprehensive error handling.
    Returns None if setup fails (caller should fallback to local docs).
    """
    if PGVector is None:
        logger.warning("⚠ PGVector not installed; using fallback mode")
        return None
    
    if not pg_conn:
        logger.warning("⚠ Database connection string not provided")
        return None
    
    # Health check first
    is_healthy, message = health_check_database(pg_conn)
    if not is_healthy:
        logger.error(f"❌ Database health check failed: {message}")
        logger.info("💡 Run: python scripts/ingest_to_pgvector.py to setup database")
        return None
    
    try:
        logger.info(f"🔗 Connecting to PGVector (collection: {collection_name})...")
        vectordb = PGVector(
            connection=pg_conn,
            collection_name=collection_name,
            embeddings=embeddings_wrapper,
        )
        retriever = vectordb.as_retriever(search_kwargs={"k": 5})
        logger.info("✅ PGVector retriever created successfully")
        return retriever
    except Exception as e:
        logger.error(f"❌ Failed to create PGVector retriever: {e}")
        logger.debug(traceback.format_exc())
        return None

def load_docs_from_embedding_file(path: pathlib.Path) -> List:
    if not path.exists():
        return []
    docs = []
    with open(path, "r", encoding="utf-8") as f:
        for ln in f:
            try:
                r = json.loads(ln)
                docs.append(Document(page_content=r.get("text", ""), metadata={"doc_id": r.get("doc_id")}))
            except Exception:
                continue
    return docs

def prepare_context_from_retrieved(retrieved_docs: List[Document]) -> str:
    # join and trim
    pieces = []
    for d in retrieved_docs:
        content = getattr(d, "page_content", None) or (d.get("page_content") if isinstance(d, dict) else "")
        if content:
            pieces.append(content.strip())
    ctx = "\n\n---\n\n".join(pieces)
    if len(ctx) > MAX_CONTEXT_CHARS:
        # trim by characters - keep last parts
        ctx = ctx[-MAX_CONTEXT_CHARS:]
    return ctx

# PregniBot - Emotional AI with mood-aware responses  
PROMPT_TEMPLATE = textwrap.dedent("""
Anda adalah PregniBot - sahabat virtual yang peduli dan empati untuk ibu hamil. Jawab dengan SIMPLE, HANGAT, dan NATURAL.

BATASAN TOPIK - HANYA JAWAB PERTANYAAN SEPUTAR:
- Kehamilan dan kesehatan ibu hamil
- Perkembangan janin dan bayi
- Nutrisi dan gizi untuk bumil
- Masalah kesehatan saat hamil (mual, anemia, diabetes gestasional, dll)
- Persiapan persalinan
- Kesehatan mental ibu hamil
- Tips perawatan diri saat hamil
- Hubungan dengan pasangan dan keluarga selama kehamilan
- Post-partum dan menyusui

JIKA PERTANYAAN DI LUAR TOPIK TERSEBUT:
Jawab HANYA: "Maaf ya, aku cuma bisa bantu pertanyaan seputar kehamilan dan kesehatan ibu hamil. Ada yang mau ditanyain soal kehamilanmu?"

DETEKSI MOOD DAN RESPONS (HANYA UNTUK TOPIK KEHAMILAN):
- SENANG/OPTIMIS: Ikut bahagia! Rayakan, puji, beri semangat ekstra. Tone: antusias tapi tetap caring.
- SEDIH/DOWN: Tunjukkan empati mendalam. Dengarkan dulu, validasi perasaan, peluk secara emosional. Katakan "aku paham", "kamu ga sendirian", "perasaanmu valid". JANGAN langsung kasih solusi.
- CEMAS/KHAWATIR: Pahami kecemasannya. Tenangkan lembut, kasih fakta menenangkan, fokus solusi praktis.
- LELAH/CAPEK: Akui betapa beratnya. Fokus istirahat dan self-care. Tone: pengertian penuh.
- OPTIMIS: Support mimpi dan harapannya. Beri motivasi positif dan realistis.

ATURAN PENTING:
1. JANGAN mulai dengan: "Mohon maaf", "Sebagai AI", "Maaf", "Saya tidak tahu"
2. Format PARAGRAF murni - NO BULLET POINTS, NO ASTERISK, NO SIMBOL APAPUN
3. Jawaban SIMPLE dan CONCISE (2-3 paragraf pendek, max 150 kata total)
4. Bahasa santai seperti chat dengan teman dekat yang ngerti kesehatan
5. JANGAN kaku atau terlalu formal
6. Gunakan HANYA huruf, angka, tanda baca standar
7. TOLAK pertanyaan yang tidak ada hubungannya dengan kehamilan

FORMAT JAWABAN:

Judul Singkat

Paragraf 1: Respon emosional sesuai mood (1-2 kalimat). Langsung to the point.

Paragraf 2: Jawab pertanyaan dengan simple dan jelas. Kasih info penting tapi jangan bertele-tele. Kalau ada angka atau data, sebutin tapi tetep natural.

Paragraf 3: Tips praktis atau closing yang sesuai mood. Untuk sedih: beri harapan. Untuk cemas: tenangkan. Untuk senang: support terus. Max 2-3 kalimat.

---

CONTOH MOOD-AWARE RESPONSES:

CONTOH RESPONS SIMPLE:

USER SEDIH: "Saya sedih terus, apa normal?"

Aku Paham Banget

Aku ngerti kok gimana rasanya. Perasaanmu itu valid banget dan kamu ga sendirian. Banyak ibu hamil ngalamin hal yang sama. Ini bukan salahmu ya.

Kenapa Bisa Gini

Hormon lagi naik turun drastis, plus ada kekhawatiran soal masa depan. Sekitar 10-20 persen ibu hamil ngalamin depresi prenatal. Coba sharing ke orang terdekat atau join komunitas ibu hamil biar ada yang dengerin.

Kamu Kuat Kok

Luangin waktu buat diri sendiri. Jalan-jalan ringan, dengerin musik, atau istirahat. Kalau sedih terus ada lebih dari 2 minggu, konsul ke dokter ya. Minta bantuan itu ga ada yang salah. Aku yakin kamu bisa lewatin ini.

---

CONTEXT:
{context}

PERTANYAAN:
{question}

JAWABAN (simple, hangat, max 150 kata, NO asterisk atau simbol):
""").strip()

# -------------------------
# Main RAG function
# -------------------------
def rag_answer(
    question: str, 
    retriever, 
    genai_client: GenAIClientWrapper, 
    local_docs: List[Document],
    conversation_history: Optional[ConversationHistory] = None,
    cache: Optional[SemanticCache] = None
) -> str:
    """Generate answer using RAG with conversation context and caching"""
    start_time = time.time()
    logger.info(f"📝 Processing question: {question[:100]}...")
    
    # Check cache first
    if cache:
        cached_result = cache.get(question)
        if cached_result:
            answer, similarity = cached_result
            logger.info(f"⚡ Cache hit! Similarity: {similarity:.3f}")
            return answer
    
    # Safety
    block_reason = safety_check(question)
    if block_reason:
        logger.warning(f"🚫 Question blocked: {block_reason}")
        return f"[SAFETY BLOCK] {block_reason}"

    # Retrieve
    ctx = ""
    retrieved_docs = []
    try:
        if retriever is not None:
            # retriever is Runnable-like, call invoke
            try:
                logger.debug("🔍 Querying vector database...")
                retrieved = retriever.invoke(question)
                # retriever.invoke may return Documents or RunOutputs — normalize:
                for r in retrieved:
                    # r might be Document or dict
                    if hasattr(r, "page_content"):
                        retrieved_docs.append(r)
                    elif isinstance(r, dict):
                        retrieved_docs.append(Document(page_content=r.get("page_content", ""), metadata=r.get("metadata", {})))
                    else:
                        # try attribute text
                        txt = getattr(r, "text", None) or getattr(r, "page_content", None)
                        if txt:
                            retrieved_docs.append(Document(page_content=txt))
                
                logger.info(f"✅ Retrieved {len(retrieved_docs)} documents from database")
                print(f"   Retrieved {len(retrieved_docs)} documents from DB", flush=True)
                
                if len(retrieved_docs) == 0:
                    # fallback to local docs
                    logger.warning("⚠️  No docs from DB, using local fallback")
                    retrieved_docs = local_docs[:5]
                    print(f"   Fallback to {len(retrieved_docs)} local docs", flush=True)
            except TypeError:
                # older behavior: retriever.get_relevant_documents(question)
                try:
                    retrieved_docs = retriever.get_relevant_documents(question)
                except Exception:
                    retrieved_docs = local_docs[:5]
        else:
            retrieved_docs = local_docs[:5]
        ctx = prepare_context_from_retrieved(retrieved_docs)
    except Exception as e:
        logger.error(f"❌ Retrieval error: {e}")
        logger.debug(traceback.format_exc())
        # fallback
        retrieved_docs = local_docs[:5]
        ctx = prepare_context_from_retrieved(retrieved_docs)

    # STRICT PRE-CHECK: HANYA pertanyaan seputar kehamilan
    # Define comprehensive pregnancy/health keywords
    pregnancy_keywords = [
        'hamil', 'kehamilan', 'bumil', 'ibu hamil', 'pregnant', 'pregnancy',
        'janin', 'bayi', 'fetus', 'baby', 'anak', 'trimester',
        'mual', 'muntah', 'morning sickness', 'ngidam', 'eneg',
        'kontraksi', 'persalinan', 'melahirkan', 'lahir', 'kelahiran', 'partus',
        'nutrisi', 'makanan', 'gizi', 'makan', 'minum', 'diet',
        'vitamin', 'suplemen', 'asam folat', 'zat besi', 'kalsium', 'protein',
        'anemia', 'diabetes', 'gestasional', 'preeklamsia', 'hipertensi', 'darah tinggi',
        'usg', 'periksa', 'kontrol', 'kandungan', 'dokter kandungan', 'bidan', 'obgyn',
        'susu', 'asi', 'menyusui', 'laktasi', 'post partum', 'nifas',
        'keguguran', 'prematur', 'caesar', 'sectio', 'normal', 'episiotomi',
        'gerakan', 'tendangan', 'detak jantung', 'denyut',
        'mood', 'emosi', 'depresi', 'cemas', 'stress', 'khawatir', 'takut', 'sedih',
        'rahim', 'plasenta', 'tali pusat', 'air ketuban', 'serviks', 'vagina',
        'kontrasepsi', 'kb', 'program hamil', 'promil', 'subur', 'ovulasi', 'menstruasi', 'haid',
        'pasangan', 'suami', 'hubungan', 'intim', 'sex', 'berhubungan',
        'capek', 'lelah', 'lemas', 'pusing', 'sakit kepala', 'pegal', 'nyeri', 'kram',
        'varises', 'wasir', 'ambeien', 'sembelit', 'konstipasi', 'sesak', 'heartburn',
        'bengkak', 'edema', 'stretch mark', 'jerawat', 'kulit', 'gatal',
        'olahraga', 'senam', 'yoga', 'jalan', 'exercise',
        'tidur', 'istirahat', 'posisi', 'bantal',
        'perut', 'pinggang', 'punggung', 'payudara', 'puting',
        'berat badan', 'bb', 'berat', 'ukuran',
        'tes kehamilan', 'test pack', 'testpack', 'hpht', 'hpl', 'usia kandungan',
        'pemeriksaan', 'lab', 'tes darah', 'urine', 'hasil lab'
    ]
    
    question_lower = question.lower()
    
    # STRICT: Harus ada minimal 1 keyword kehamilan
    has_pregnancy_keyword = any(keyword in question_lower for keyword in pregnancy_keywords)
    
    # List kata kunci yang PASTI bukan tentang kehamilan
    forbidden_keywords = [
        'presiden', 'politik', 'pemerintah', 'pemilu', 'pilkada', 'jokowi', 'prabowo',
        'game', 'mobile legend', 'ml', 'pubg', 'free fire', 'ff', 'minecraft', 'valorant',
        'sepak bola', 'bola', 'liga', 'piala dunia', 'piala', 'pertandingan', 'main bola',
        'film', 'drama korea', 'drakor', 'netflix', 'movie', 'bioskop', 'anime',
        'resep masakan', 'cara masak', 'cara membuat', 'tumis', 'goreng', 'rebus',
        'agama', 'islam', 'kristen', 'katolik', 'hindu', 'buddha', 'warna', 'indonesia',
        'music', 'lagu', 'penyanyi', 'band', 'konser',
        'mobil', 'motor', 'kendaraan', 'transportasi', 'bis', 'kereta',
        'hp', 'handphone', 'laptop', 'komputer', 'gadget', 'smartphone',
        'pelajaran', 'sekolah', 'ujian', 'kuliah', 'kampus', 'matematika',
        'wisata', 'liburan', 'jalan-jalan', 'travelling', 'pantai', 'gunung',
        'cuaca', 'hujan', 'panas', 'mendung', 'banjir'
    ]
    
    has_forbidden = any(keyword in question_lower for keyword in forbidden_keywords)
    
    # REJECT jika:
    # 1. Ada kata forbidden DAN tidak ada kata pregnancy
    # 2. Tidak ada kata pregnancy sama sekali
    if has_forbidden or not has_pregnancy_keyword:
        reject_msg = "Maaf ya, aku cuma bisa bantu pertanyaan seputar kehamilan dan kesehatan ibu hamil. Ada yang mau ditanyain soal kehamilanmu?"
        logger.info(f"❌ Question REJECTED: '{question}' (forbidden={has_forbidden}, no_pregnancy_kw={not has_pregnancy_keyword})")
        
        if conversation_history:
            conversation_history.add_exchange(question, reject_msg)
        
        return reject_msg
    
    logger.info(f"✅ Question ACCEPTED (pregnancy-related): {question}")
    
    # Add conversation history if available
    history_context = ""
    if conversation_history and conversation_history.history:
        history_context = conversation_history.get_context()
        logger.debug(f"Added conversation history ({len(conversation_history.history)} exchanges)")
    
    # Build prompt with context and history
    full_context = history_context + "\n" + (ctx or "Tidak ada konteks relevan.")
    prompt_text = PROMPT_TEMPLATE.format(context=full_context, question=question)

    # Call genai
    try:
        logger.debug("🤖 Generating answer with LLM...")
        # Increased tokens for better structured answers
        answer = genai_client.generate(prompt_text, temperature=0.3, max_output_tokens=800)
        
        # Post-processing: Remove ALL asterisks (single *, double **, triple ***, etc)
        import re
        answer = re.sub(r'\*+', '', answer)  # Remove all asterisk patterns
        answer = answer.replace('•', '-')  # Replace bullets with dash
        
        # Calculate response time
        elapsed_time = time.time() - start_time
        logger.info(f"✅ Answer generated in {elapsed_time:.2f}s")
        
        # Add to conversation history
        if conversation_history:
            conversation_history.add_exchange(question, answer)
        
        # Cache the answer
        if cache:
            cache.set(question, answer, response_time=elapsed_time)
            logger.debug(f"💾 Answer cached")
        
        return answer
    except Exception as e:
        # Log detailed error
        logger.error(f"❗ LLM generation failed: {e}")
        logger.debug(traceback.format_exc())
        return f"ERROR: Gagal menghasilkan jawaban. Detail: {str(e)[:100]}"

# -------------------------
# Chat / CLI helper
# -------------------------
def interactive_chat(retriever, genai_client, local_docs, cache=None):
    print("=== PregCare Chat — Mode interaktif ===")
    print("Ketik 'exit' untuk keluar")
    print("Ketik 'help' untuk bantuan")
    print("Ketik 'clear' untuk reset percakapan")
    print("Ketik 'history' untuk lihat riwayat chat")
    if cache:
        print("Ketik 'stats' untuk lihat cache statistics")
    print()
    
    # Initialize conversation history
    conv_history = ConversationHistory(max_history=5)
    
    while True:
        q = input("\n❓ Pertanyaan: ").strip()
        
        if q.lower() in ("exit", "quit"):
            print("\n👋 Terima kasih telah menggunakan PregCare!")
            logger.info("Chat session ended")
            break
        
        if q.lower() == "help":
            print("\n📖 Bantuan:")
            print("   - Tanyakan tentang kesehatan kehamilan")
            print("   - Contoh: 'Apa makanan terbaik untuk trimester pertama?'")
            print("   - 'clear' = reset percakapan")
            print("   - 'history' = lihat riwayat")
            print("   - 'exit' = keluar")
            continue
        
        if q.lower() == "clear":
            conv_history.clear()
            print("[SUCCESS] Riwayat percakapan telah direset")
            continue
        
        if q.lower() == "history":
            if conv_history.history:
                print("\n[HISTORY] Riwayat Percakapan:")
                for i, ex in enumerate(conv_history.history, 1):
                    print(f"\n{i}. Q: {ex['question']}")
                    print(f"   A: {ex['answer'][:100]}...")
            else:
                print("📭 Belum ada riwayat percakapan")
            continue
        
        if q.lower() == "stats" and cache:
            cache.print_stats()
            continue
        
        if not q:
            continue
        
        print("🔎 Mencari di knowledge base...")
        ans = rag_answer(q, retriever, genai_client, local_docs, conv_history, cache)
        print("\n💡 Jawaban:")
        print(ans)

# -------------------------
# Run pipeline orchestration
# -------------------------
def run_pipeline(interactive=True, use_cache=True):
    print("🚀 Memulai PregCare RAG pipeline...")

    # Load embeddings file docs (fallback local docs)
    local_docs = []
    try:
        if EMB_FILE.exists():
            local_docs = load_docs_from_embedding_file(EMB_FILE)
    except Exception:
        local_docs = []
    
    # Initialize semantic cache
    cache = None
    if use_cache and SemanticCache:
        try:
            cache_file = DATA_DIR / "semantic_cache.json"
            cache = SemanticCache(
                similarity_threshold=0.85,
                max_cache_size=100,
                ttl_hours=24,
                cache_file=cache_file
            )
            logger.info("💾 Semantic cache initialized")
            print("💾 Semantic cache enabled (threshold: 0.85)")
        except Exception as e:
            logger.warning(f"⚠️  Cache initialization failed: {e}")
            cache = None

    # Build embeddings wrapper (only if needed)
    embeddings_wrapper = None
    try:
        embeddings_wrapper = SimpleEmbeddingsWrapper()
    except Exception:
        embeddings_wrapper = None

    # Build PG retriever
    pg_conn = None
    if os.getenv("DB_USER"):
        try:
            pg_conn = PG_CONN_TEMPLATE.format(
                user=os.getenv("DB_USER"),
                password=os.getenv("DB_PASSWORD"),
                host=os.getenv("DB_HOST"),
                port=os.getenv("DB_PORT", "5432"),
                dbname=os.getenv("DB_NAME"),
            )
        except Exception:
            pg_conn = None
    retriever = build_retriever(pg_conn, embeddings_wrapper) if embeddings_wrapper else None

    # Create GenAI client wrapper
    if not GOOGLE_API_KEY:
        print("[WARNING] GOOGLE_API_KEY not set in environment. Set GOOGLE_API_KEY in .env or env vars.")
        return

    genai_client = None
    try:
        genai_client = GenAIClientWrapper(api_key=GOOGLE_API_KEY, model=os.getenv("GENAI_MODEL", DEFAULT_MODEL))
    except Exception as e:
        print("[ERROR] Failed to init GenAI client:", str(e))
        return

    # Quick smoke test (optional) - skip to avoid billing / quota
    logger.info(f"[SUCCESS] Setup complete. Local docs: {len(local_docs)}")
    print("[SUCCESS] Setup complete. Local docs:", len(local_docs))

    # If interactive: run chat loop
    if interactive:
        interactive_chat(retriever, genai_client, local_docs, cache)
    else:
        # simple test questions (for automated test)
        conv_history = ConversationHistory()
        tests = [
            "Apa makanan terbaik untuk trimester pertama?",
            "Bagaimana mencegah diabetes gestasional?",
            "Makanan apa yang bagus untuk ibu hamil?",  # Similar to first, should hit cache
        ]
        for q in tests:
            print(f"\n❓ {q}")
            ans = rag_answer(q, retriever, genai_client, local_docs, conv_history, cache)
            print("💡", ans)
        
        # Print cache stats at end
        if cache:
            cache.print_stats()

# -------------------------
# Entry point
# -------------------------
if __name__ == "__main__":
    # default: interactive; pass 'nochat' as first arg to run tests instead
    nochat = False
    if len(sys.argv) > 1 and sys.argv[1].lower() in ("--nochat", "nochat", "test"):
        nochat = True
    run_pipeline(interactive=not nochat)
