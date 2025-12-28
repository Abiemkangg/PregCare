"""
FastAPI Backend for PregCare RAG Chat System
Provides REST API endpoints for AI Assistant integration with frontend
"""

import os
import sys
from pathlib import Path
from typing import Optional, List, Dict
from datetime import datetime

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# Import auth router
from auth_api import router as auth_router

# Add training scripts to path
TRAINING_PATH = Path(__file__).parent.parent.parent.parent / "training"
SCRIPTS_PATH = TRAINING_PATH / "scripts"
sys.path.insert(0, str(SCRIPTS_PATH))  # Add scripts folder for fallback_responses
sys.path.insert(0, str(TRAINING_PATH))

# Will import inside startup event after path is set
SimpleEmbeddingsWrapper = None
build_retriever = None
load_docs_from_embedding_file = None
rag_answer = None
ConversationHistory = None
SemanticCache = None
genai = None
api_rate_limiter = None  # Rate limiter instance

# ==================== Pydantic Models ====================

class ChatRequest(BaseModel):
    """Request model for chat endpoint"""
    message: str
    user_id: Optional[str] = "default_user"

class ChatResponse(BaseModel):
    """Response model for chat endpoint"""
    answer: str
    response_time: float
    cached: bool
    timestamp: str
    sources_count: int

class HistoryResponse(BaseModel):
    """Response model for conversation history"""
    history: List[Dict[str, str]]
    count: int

class StatsResponse(BaseModel):
    """Response model for cache statistics"""
    cache_hits: int
    cache_misses: int
    hit_rate: float
    time_saved: float
    estimated_cost_saved: float
    total_queries: int

class StatusResponse(BaseModel):
    """Response model for health check"""
    status: str
    message: str
    rag_ready: bool
    cache_enabled: bool
    local_docs_count: int

# ==================== FastAPI App ====================

app = FastAPI(
    title="PregCare RAG API",
    description="AI Assistant Backend for Pregnancy Care Information",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite default
        "http://localhost:5174",  # Vite alternate port
        "http://localhost:3000",  # React default
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Auth Router
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])

# Global State ====================

# Initialize components on startup
retriever = None
genai_client = None
local_docs = []
cache = None
conversation_histories = {}  # Store per user_id
ConversationHistory = None  # Will be imported at startup
SemanticCache = None  # Will be imported at startup

def get_conversation_history(user_id: str):
    """Get or create conversation history for user"""
    if user_id not in conversation_histories:
        conversation_histories[user_id] = ConversationHistory(max_history=10)
    return conversation_histories[user_id]

# ==================== Startup Event ====================

@app.on_event("startup")
async def startup_event():
    """Initialize RAG components on server startup"""
    global retriever, genai_client, local_docs, cache, api_rate_limiter
    global SimpleEmbeddingsWrapper, build_retriever, load_docs_from_embedding_file
    global rag_answer, ConversationHistory, SemanticCache, genai
    
    print("[STARTUP] Initializing PregCare RAG Backend...")
    
    try:
        # Import all required modules
        from scripts.rag_pipeline import (
            SimpleEmbeddingsWrapper as EmbWrapper,
            build_retriever as build_ret,
            load_docs_from_embedding_file as load_docs,
            rag_answer as rag_ans,
            ConversationHistory as ConvHist,
            api_rate_limiter as rate_lim,
        )
        from scripts.semantic_cache import SemanticCache as SemCache
        import google.genai as genai_module
        
        # Assign to globals
        SimpleEmbeddingsWrapper = EmbWrapper
        build_retriever = build_ret
        load_docs_from_embedding_file = load_docs
        rag_answer = rag_ans
        ConversationHistory = ConvHist
        SemanticCache = SemCache
        genai = genai_module
        api_rate_limiter = rate_lim
        
        # Load environment from training folder
        from dotenv import load_dotenv
        training_env = TRAINING_PATH / ".env"
        if training_env.exists():
            load_dotenv(training_env)
        
        # Setup embedding model
        print("[STARTUP] Loading embedding model...")
        embeddings_wrapper = SimpleEmbeddingsWrapper("all-MiniLM-L6-v2")
        
        # Build database connection
        pg_conn = None
        db_host = os.getenv("DB_HOST", "localhost")
        db_port = os.getenv("DB_PORT", "5432")
        db_name = os.getenv("DB_NAME", "pregcare_db")
        db_user = os.getenv("DB_USER", "pregcare_user")
        db_password = os.getenv("DB_PASSWORD", "pregcare_pwd")
        
        if all([db_host, db_port, db_name, db_user, db_password]):
            pg_conn = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
        
        # Build retriever
        print("[STARTUP] Building retriever...")
        retriever = build_retriever(pg_conn, embeddings_wrapper)
        
        # Load local docs fallback
        embeddings_file = TRAINING_PATH / "data" / "embeddings" / "embeddings.jsonl"
        local_docs = load_docs_from_embedding_file(embeddings_file)
        print(f"[STARTUP] Loaded {len(local_docs)} local documents")
        
        # Initialize cache
        cache_file = TRAINING_PATH / "data" / "semantic_cache.json"
        cache = SemanticCache(
            model_name="all-MiniLM-L6-v2",
            cache_file=cache_file,
            similarity_threshold=0.85,
            max_cache_size=100
        )
        print("[STARTUP] Semantic cache initialized")
        
        # Initialize GenAI client
        api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment")
        
        model_name = os.getenv("MODEL_NAME", "gemini-2.0-flash")
        
        # Import GenAIClientWrapper from rag_pipeline
        from scripts.rag_pipeline import GenAIClientWrapper
        genai_client = GenAIClientWrapper(api_key=api_key, model=model_name)
        
        print(f"[SUCCESS] RAG Backend initialized successfully!")
        print(f"   - Local docs: {len(local_docs)}")
        print(f"   - Cache enabled: {cache is not None}")
        print(f"   - Model: {model_name}")
        print(f"   - Database: {'Connected' if retriever else 'Using local fallback'}")
        
    except Exception as e:
        print(f"[ERROR] Failed to initialize RAG backend: {e}")
        import traceback
        traceback.print_exc()

# ==================== API Endpoints ====================

@app.get("/", response_model=StatusResponse)
async def root():
    """Health check endpoint"""
    return StatusResponse(
        status="online",
        message="PregCare RAG API is running",
        rag_ready=retriever is not None and genai_client is not None,
        cache_enabled=cache is not None,
        local_docs_count=len(local_docs) if local_docs else 0
    )

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main chat endpoint - send question, receive AI answer
    
    Best Practices:
    - Tunggu 4-5 detik antar pertanyaan
    - Gunakan pertanyaan spesifik tentang kehamilan
    - Hindari spam request berulang
    """
    if not genai_client:
        raise HTTPException(status_code=503, detail="RAG system not initialized")
    
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    # Apply rate limiting to prevent API abuse
    if api_rate_limiter:
        api_rate_limiter.wait_if_needed()
    
    try:
        # Get user's conversation history
        conv_history = get_conversation_history(request.user_id)
        
        # Call RAG pipeline
        start_time = datetime.now()
        
        # Check cache before calling RAG
        cached = False
        if cache:
            cached_result = cache.get(request.message)
            if cached_result:
                cached = True
        
        answer = rag_answer(
            question=request.message,
            retriever=retriever,
            genai_client=genai_client,
            local_docs=local_docs,
            cache=cache,
            conversation_history=conv_history
        )
        end_time = datetime.now()
        
        response_time = (end_time - start_time).total_seconds()
        
        return ChatResponse(
            answer=answer,
            response_time=response_time,
            cached=cached,
            timestamp=end_time.isoformat(),
            sources_count=len(local_docs) if local_docs else 0
        )
        
    except Exception as e:
        print(f"[ERROR] Error in chat endpoint: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error processing question: {str(e)}")

@app.get("/api/history/{user_id}", response_model=HistoryResponse)
async def get_history(user_id: str = "default_user"):
    """
    Get conversation history for a user
    """
    try:
        conv_history = get_conversation_history(user_id)
        history = conv_history.get_history()
        
        # Format history for frontend
        formatted_history = []
        for item in history:
            formatted_history.append({
                "question": item["question"],
                "answer": item["answer"],
                "timestamp": item.get("timestamp", "")
            })
        
        return HistoryResponse(
            history=formatted_history,
            count=len(formatted_history)
        )
        
    except Exception as e:
        print(f"Error getting history: {e}")
        raise HTTPException(status_code=500, detail=f"Error retrieving history: {str(e)}")

@app.post("/api/clear/{user_id}")
async def clear_history(user_id: str = "default_user"):
    """
    Clear conversation history for a user
    """
    try:
        conv_history = get_conversation_history(user_id)
        conv_history.clear()
        
        return {"status": "success", "message": f"History cleared for user {user_id}"}
        
    except Exception as e:
        print(f"[ERROR] Error clearing history: {e}")
        raise HTTPException(status_code=500, detail=f"Error clearing history: {str(e)}")

@app.get("/api/stats", response_model=StatsResponse)
async def get_stats():
    """
    Get cache statistics
    """
    if not cache:
        raise HTTPException(status_code=503, detail="Cache not initialized")
    
    try:
        stats = cache.get_stats()
        
        return StatsResponse(
            cache_hits=stats["hits"],
            cache_misses=stats["misses"],
            hit_rate=stats["hit_rate"],
            time_saved=stats.get("total_saved_time", 0.0),
            estimated_cost_saved=stats["estimated_cost_saved"],
            total_queries=stats["hits"] + stats["misses"]
        )
        
    except Exception as e:
        print(f"[ERROR] Error getting stats: {e}")
        raise HTTPException(status_code=500, detail=f"Error retrieving stats: {str(e)}")

# ==================== Run Server ====================

if __name__ == "__main__":
    print("[STARTUP] Starting PregCare RAG API Server...")
    print("[INFO] Server will be available at: http://localhost:8000")
    print("[INFO] API docs available at: http://localhost:8000/docs")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
