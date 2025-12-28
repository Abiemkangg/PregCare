"""
Semantic Caching untuk RAG Pipeline
Menyimpan jawaban berdasarkan similarity pertanyaan untuk mengurangi LLM calls
"""
import hashlib
import json
import time
from typing import Optional, Dict, Tuple
from datetime import datetime, timedelta
import pathlib

try:
    from sentence_transformers import SentenceTransformer, util
    import numpy as np
except ImportError:
    SentenceTransformer = None
    util = None
    np = None


class SemanticCache:
    """
    Semantic cache yang menyimpan jawaban berdasarkan similarity pertanyaan.
    Menggunakan cosine similarity untuk match pertanyaan yang serupa.
    """
    
    def __init__(
        self, 
        model_name: str = "all-MiniLM-L6-v2",
        similarity_threshold: float = 0.90,  # Lowered from 0.85 to 0.90 for AGGRESSIVE caching
        max_cache_size: int = 100,
        ttl_hours: int = 24,
        cache_file: Optional[pathlib.Path] = None
    ):
        """
        Args:
            model_name: Model untuk encode pertanyaan
            similarity_threshold: Threshold untuk match (0-1) - LOWER = more cache hits
            max_cache_size: Maximum entries di cache
            ttl_hours: Time-to-live untuk cache entries (jam)
            cache_file: File untuk persist cache (optional)
        """
        if SentenceTransformer is None:
            raise ImportError("sentence-transformers required for semantic caching")
        
        self.model = SentenceTransformer(model_name)
        self.similarity_threshold = similarity_threshold
        self.max_cache_size = max_cache_size
        self.ttl = timedelta(hours=ttl_hours)
        self.cache_file = cache_file
        
        # Cache storage: {query_hash: {data}}
        self.cache: Dict[str, Dict] = {}
        self.query_embeddings = []  # List of (hash, embedding, timestamp)
        
        # Statistics
        self.stats = {
            "hits": 0,
            "misses": 0,
            "total_queries": 0,
            "cache_size": 0,
            "total_saved_time": 0.0  # estimated seconds saved
        }
        
        # Load cache from file if exists
        if cache_file and cache_file.exists():
            self._load_from_file()
    
    def _hash_query(self, query: str) -> str:
        """Generate hash untuk query"""
        return hashlib.md5(query.lower().strip().encode()).hexdigest()
    
    def _is_expired(self, timestamp: datetime) -> bool:
        """Check if cache entry is expired"""
        return datetime.now() - timestamp > self.ttl
    
    def _evict_expired(self):
        """Remove expired entries"""
        expired_hashes = []
        current_time = datetime.now()
        
        for query_hash, entry in self.cache.items():
            if self._is_expired(entry["timestamp"]):
                expired_hashes.append(query_hash)
        
        for h in expired_hashes:
            del self.cache[h]
            # Remove from embeddings list
            self.query_embeddings = [
                (qh, emb, ts) for qh, emb, ts in self.query_embeddings 
                if qh != h
            ]
        
        if expired_hashes:
            print(f"   🗑️  Evicted {len(expired_hashes)} expired cache entries")
    
    def _evict_oldest(self):
        """Remove oldest entry when cache is full"""
        if len(self.cache) >= self.max_cache_size:
            # Find oldest entry
            oldest_hash = min(
                self.cache.keys(), 
                key=lambda h: self.cache[h]["timestamp"]
            )
            del self.cache[oldest_hash]
            self.query_embeddings = [
                (qh, emb, ts) for qh, emb, ts in self.query_embeddings 
                if qh != oldest_hash
            ]
    
    def get(self, query: str) -> Optional[Tuple[str, float]]:
        """
        Get cached answer for query if exists and similar enough.
        Returns: (answer, similarity_score) or None
        """
        self.stats["total_queries"] += 1
        
        # Clean expired entries periodically
        if self.stats["total_queries"] % 10 == 0:
            self._evict_expired()
        
        # If cache empty, return None
        if not self.cache:
            self.stats["misses"] += 1
            return None
        
        # Encode query
        query_embedding = self.model.encode(query, convert_to_tensor=True)
        
        # Find most similar cached query
        best_match = None
        best_score = 0.0
        
        for query_hash, cached_emb, timestamp in self.query_embeddings:
            if self._is_expired(timestamp):
                continue
            
            similarity = util.cos_sim(query_embedding, cached_emb).item()
            
            if similarity > best_score:
                best_score = similarity
                best_match = query_hash
        
        # Check if similarity above threshold
        if best_match and best_score >= self.similarity_threshold:
            self.stats["hits"] += 1
            self.stats["total_saved_time"] += 3.0  # Estimate 3s saved per cache hit
            
            cached_data = self.cache[best_match]
            print(f"   [CACHE HIT] (similarity: {best_score:.3f})")
            print(f"      Matched: '{cached_data['original_query'][:50]}...'")
            
            return (cached_data["answer"], best_score)
        else:
            self.stats["misses"] += 1
            return None
    
    def set(self, query: str, answer: str, response_time: float = 0.0):
        """
        Cache the answer for this query.
        
        Args:
            query: Original query
            answer: Generated answer
            response_time: Time taken to generate (for stats)
        """
        query_hash = self._hash_query(query)
        
        # Check if already cached
        if query_hash in self.cache:
            return
        
        # Evict oldest if cache full
        self._evict_oldest()
        
        # Encode query
        query_embedding = self.model.encode(query, convert_to_tensor=True)
        
        # Store in cache
        timestamp = datetime.now()
        self.cache[query_hash] = {
            "original_query": query,
            "answer": answer,
            "timestamp": timestamp,
            "response_time": response_time,
            "hits": 0
        }
        
        # Store embedding
        self.query_embeddings.append((query_hash, query_embedding, timestamp))
        
        self.stats["cache_size"] = len(self.cache)
        
        # Persist to file if configured
        if self.cache_file:
            self._save_to_file()
    
    def _save_to_file(self):
        """Save cache to file (without embeddings, too large)"""
        try:
            cache_data = {
                "cache": {
                    h: {
                        "original_query": v["original_query"],
                        "answer": v["answer"],
                        "timestamp": v["timestamp"].isoformat(),
                        "response_time": v["response_time"],
                        "hits": v["hits"]
                    }
                    for h, v in self.cache.items()
                },
                "stats": self.stats
            }
            
            with open(self.cache_file, "w", encoding="utf-8") as f:
                json.dump(cache_data, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"[WARNING] Failed to save cache: {e}")
    
    def _load_from_file(self):
        """Load cache from file"""
        try:
            with open(self.cache_file, "r", encoding="utf-8") as f:
                cache_data = json.load(f)
            
            # Load cache entries (need to re-encode queries)
            for query_hash, entry in cache_data.get("cache", {}).items():
                timestamp = datetime.fromisoformat(entry["timestamp"])
                
                # Skip if expired
                if self._is_expired(timestamp):
                    continue
                
                # Re-encode query
                query_embedding = self.model.encode(
                    entry["original_query"], 
                    convert_to_tensor=True
                )
                
                self.cache[query_hash] = {
                    "original_query": entry["original_query"],
                    "answer": entry["answer"],
                    "timestamp": timestamp,
                    "response_time": entry["response_time"],
                    "hits": entry["hits"]
                }
                
                self.query_embeddings.append((query_hash, query_embedding, timestamp))
            
            # Load stats
            self.stats.update(cache_data.get("stats", {}))
            self.stats["cache_size"] = len(self.cache)
            
            print(f"[SUCCESS] Loaded {len(self.cache)} entries from cache file")
            
        except Exception as e:
            print(f"[WARNING] Failed to load cache: {e}")
    
    def clear(self):
        """Clear all cache"""
        self.cache.clear()
        self.query_embeddings.clear()
        self.stats = {
            "hits": 0,
            "misses": 0,
            "total_queries": 0,
            "cache_size": 0,
            "total_saved_time": 0.0
        }
        if self.cache_file and self.cache_file.exists():
            self.cache_file.unlink()
    
    def get_stats(self) -> Dict:
        """Get cache statistics"""
        total = self.stats["hits"] + self.stats["misses"]
        hit_rate = (self.stats["hits"] / total * 100) if total > 0 else 0
        
        return {
            **self.stats,
            "hit_rate": hit_rate,
            "estimated_cost_saved": self.stats["hits"] * 0.0001,  # Rough estimate
        }
    
    def print_stats(self):
        """Print cache statistics"""
        stats = self.get_stats()
        print("\n" + "="*50)
        print("📊 Cache Statistics")
        print("="*50)
        print(f"Total Queries: {stats['total_queries']}")
        print(f"Cache Hits: {stats['hits']}")
        print(f"Cache Misses: {stats['misses']}")
        print(f"Hit Rate: {stats['hit_rate']:.1f}%")
        print(f"Cache Size: {stats['cache_size']}/{self.max_cache_size}")
        print(f"Time Saved: ~{stats['total_saved_time']:.1f}s")
        print(f"Est. Cost Saved: ~${stats['estimated_cost_saved']:.4f}")
        print("="*50 + "\n")


# Example usage
if __name__ == "__main__":
    import pathlib
    
    # Initialize cache
    cache_dir = pathlib.Path(__file__).parents[1] / "data"
    cache_dir.mkdir(exist_ok=True)
    cache_file = cache_dir / "semantic_cache.json"
    
    cache = SemanticCache(
        similarity_threshold=0.85,
        max_cache_size=100,
        ttl_hours=24,
        cache_file=cache_file
    )
    
    # Test queries
    test_queries = [
        "Apa makanan terbaik untuk ibu hamil?",
        "Makanan apa yang bagus untuk kehamilan?",  # Similar, should hit cache
        "Bagaimana cara mengatasi mual di pagi hari?",
        "Cara mengatasi morning sickness?",  # Similar
        "Apa itu diabetes gestasional?",
    ]
    
    # Simulate caching
    for i, query in enumerate(test_queries):
        print(f"\n🔍 Query {i+1}: {query}")
        
        # Try to get from cache
        cached = cache.get(query)
        
        if cached:
            answer, similarity = cached
            print(f"   [CACHE] Using cached answer")
        else:
            # Simulate LLM generation
            print(f"   [GENERATE] Generating new answer...")
            time.sleep(0.1)  # Simulate delay
            answer = f"Answer for: {query}"
            cache.set(query, answer, response_time=3.0)
    
    # Print statistics
    cache.print_stats()
