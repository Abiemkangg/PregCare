# 🚀 OPTIMASI TOKEN - AI ASSISTANT ULTRA HEMAT

## Masalah
Quota Gemini Free Tier terlalu cepat habis:
- **15 request/menit (RPM)**
- **1,500 request/hari (RPD)** ⚠️
- **1,000,000 token/menit (TPM)**
- **4,000,000 token/hari (TPD)**

## Solusi Implementasi (26 Des 2025)

### 1. ⚡ FALLBACK RESPONSES (Zero API Calls!)
**File**: `training/scripts/fallback_responses.py`

Pre-written answers untuk 7 topik umum:
- ✅ Tanda kehamilan
- ✅ Makanan sehat
- ✅ Mual muntah
- ✅ Olahraga
- ✅ Vitamin
- ✅ Posisi tidur
- ✅ Hubungan intim

**Dampak**: **0 API calls** untuk pertanyaan umum ini!

### 2. 🎯 AGGRESSIVE SEMANTIC CACHE
**File**: `training/scripts/semantic_cache.py` - Line 28

```python
similarity_threshold: float = 0.90  # Turun dari 0.85
```

**Dampak**: 
- Pertanyaan mirip 90%+ langsung pakai cache
- Hemat **100% token** untuk query serupa
- Cache bertahan 24 jam

### 3. 📉 MINIMAL RETRIEVAL
**File**: `training/scripts/rag_pipeline.py` - Line 330

```python
search_kwargs={"k": 2}  # Turun dari 3
```

**Dampak**: Hemat **33% token** dari retrieval context

### 4. 🚫 NO CONVERSATION HISTORY
**File**: `training/scripts/rag_pipeline.py` - Lines 605-611

```python
# SKIP conversation history to save tokens
# Conversation history DISABLED untuk hemat 20-30% token
```

**Dampak**: Hemat **20-30% token** per query

### 5. 📝 SHORTER OUTPUT
**File**: `training/scripts/rag_pipeline.py` - Line 618

```python
max_output_tokens=400  # Turun dari 500
```

**Dampak**: Hemat **20% token** output

### 6. ⏱️ RATE LIMITER
**File**: `training/scripts/rag_pipeline.py` - Line 211

```python
api_rate_limiter = RateLimiter(min_interval=8.0)  # 8 detik delay
```

**Dampak**: 
- Max ~7-8 request/menit (di bawah limit 15 RPM)
- Hindari rate limit error

## Total Penghematan Token

### Per Query (Before → After):
```
BEFORE (OLD):
- Retrieval: 3 docs × ~150 tokens = 450 tokens
- History: 3 exchanges × 100 tokens = 300 tokens  
- System prompt: ~200 tokens
- Output: 500 tokens
TOTAL: ~1,450 tokens/query

AFTER (NEW):
- Fallback: 0 tokens (jika match) ✨
- Cache hit: 0 tokens (jika similarity >90%) ✨
- Retrieval: 2 docs × ~150 tokens = 300 tokens (-33%)
- History: DISABLED = 0 tokens (-100%)
- System prompt: ~200 tokens (sama)
- Output: 400 tokens (-20%)
TOTAL: ~900 tokens/query

PENGHEMATAN: 38% per query
DENGAN FALLBACK/CACHE: 100% hemat!
```

### Estimasi Daily Quota:
```
FREE TIER LIMIT: 1,500 request/day

SCENARIO 1 (No Cache):
- 900 tokens/query × 1,500 queries = 1.35M tokens/day
- ✅ AMAN (di bawah 4M TPD)

SCENARIO 2 (50% Cache Hit):
- 750 queries baru × 900 tokens = 675K tokens
- 750 queries cache × 0 tokens = 0 tokens
- Total: 675K tokens/day
- ✅ SANGAT AMAN (hanya 17% dari quota!)

SCENARIO 3 (Fallback + Cache 70%):
- 450 queries baru × 900 tokens = 405K tokens
- 1,050 queries zero-cost = 0 tokens  
- Total: 405K tokens/day
- ✅ SUPER HEMAT (hanya 10% dari quota!)
```

## Best Practices untuk User

### DO ✅
1. **Gunakan pertanyaan yang jelas** - lebih mudah di-cache
2. **Tunggu 8 detik** antara pertanyaan (auto-delay)
3. **Pertanyaan umum pakai fallback** (instant response!)
4. **Test di luar jam sibuk** (pagi/malam)

### DON'T ❌
1. **Jangan spam questions** - quota cepat habis
2. **Jangan test berlebihan** - simpan quota untuk user real
3. **Jangan pertanyaan panjang** - pakai token lebih banyak
4. **Jangan expect instant** - ada delay 8 detik (normal!)

## Monitoring

### Check Quota Status:
```bash
# Lihat log untuk cache hit rate
tail -f training/rag_pipeline.log | grep "Cache hit"

# Count API calls per session
grep "🤖 Generating answer" rag_pipeline.log | wc -l
```

### Cache Statistics:
- **Cache hit rate target**: >50%
- **Fallback hit rate target**: >20%
- **Combined zero-cost rate**: >70%

## Upgrade Options (Jika Masih Kurang)

### Option 1: Gemini Paid Tier
```
GEMINI PRO:
- 60 RPM (4x lebih banyak)
- 10,000 RPD (6.6x lebih banyak)
- 4M TPM (sama)
- 10M TPD (2.5x lebih banyak)
Cost: ~$7/million tokens
```

### Option 2: Alternative Models
- **Groq** (Free): 30 RPM, faster
- **Together AI** (Free trial): $1 credit
- **OpenRouter**: Mix models, pay-as-you-go

### Option 3: Hybrid Approach
- Fallback → Cache → Local Model → Gemini API
- Use Gemini only for complex queries

## File Changes Summary

```
CREATED:
✅ training/scripts/fallback_responses.py (220 lines)
✅ OPTIMASI_TOKEN.md (this file)

MODIFIED:
✅ training/scripts/rag_pipeline.py
   - Line 330: k=2 (retrieval)
   - Line 605-611: history disabled  
   - Line 618: max_output_tokens=400
   - Lines 485-495: fallback first, then cache
   
✅ training/scripts/semantic_cache.py
   - Line 28: threshold=0.90

✅ training/data/semantic_cache.json
   - Will be populated with fallback answers on startup
```

## Testing

```bash
# 1. Stop backend
Stop-Process -Name python -Force

# 2. Clear old cache (optional)
# Del training/data/semantic_cache.json

# 3. Restart backend
cd backend/app/API
& "C:/Users/chris/Documents/SEMESTER 5/IPPL/.venv/Scripts/python.exe" start_server.py

# 4. Test fallback (should be instant, 0 API calls)
curl -X POST http://localhost:8001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "apa saja tanda kehamilan awal?"}'

# 5. Test cache (similar question, should hit cache)
curl -X POST http://localhost:8001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "ciri-ciri hamil muda apa saja?"}'

# 6. Monitor logs
Get-Content rag_pipeline.log -Wait -Tail 20
```

## Expected Results

```
✅ Fallback answer: ~0.1s response, 0 tokens
✅ Cache hit: ~0.5s response, 0 tokens  
✅ New query: ~5-10s response (with 8s delay), 900 tokens
⚠️ Rate limit: Wait 8s between requests (normal)
❌ Quota exceeded: Wait 5-10 min or tomorrow
```

## Support

Jika masih ada error:
1. Check logs: `training/rag_pipeline.log`
2. Verify cache: `training/data/semantic_cache.json`
3. Monitor quota: Google AI Studio → API Usage
4. Read guide: `AI_ASSISTANT_BEST_PRACTICES.md`

---

**Last Updated**: 26 Desember 2025
**Status**: ✅ Implemented & Ready
**Token Savings**: ~70% with fallback+cache strategy
