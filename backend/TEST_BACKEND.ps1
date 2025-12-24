# Test Backend API Script
# Make sure backend server is running first!

Write-Host "`n🧪 Testing PregCare Backend API..." -ForegroundColor Cyan
Write-Host "================================================`n" -ForegroundColor Gray

# Test 1: Health Check
Write-Host "1️⃣  Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:8000/" -Method GET
    Write-Host "   ✅ Status: $($health.status)" -ForegroundColor Green
    Write-Host "   📊 RAG Ready: $($health.rag_ready)" -ForegroundColor Green
    Write-Host "   💾 Cache Enabled: $($health.cache_enabled)" -ForegroundColor Green
    Write-Host "   📚 Local Docs: $($health.local_docs_count)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Backend not running! Start it with START_BACKEND.ps1" -ForegroundColor Red
    exit
}

# Test 2: Chat Endpoint
Write-Host "`n2️⃣  Testing Chat Endpoint..." -ForegroundColor Yellow
$testQuestions = @(
    "Apa tanda-tanda kehamilan awal?",
    "Makanan apa yang baik untuk ibu hamil?",
    "Bagaimana cara mencegah kelahiran prematur?"
)

foreach ($question in $testQuestions) {
    Write-Host "`n   📝 Question: $question" -ForegroundColor Cyan
    
    $body = @{
        message = $question
        user_id = "test_user"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8000/api/chat" -Method POST -Body $body -ContentType "application/json"
        
        Write-Host "   ✅ Response received!" -ForegroundColor Green
        Write-Host "   ⏱️  Response time: $([math]::Round($response.response_time, 2))s" -ForegroundColor Gray
        Write-Host "   📦 Cached: $($response.cached)" -ForegroundColor Gray
        Write-Host "   💬 Answer (first 200 chars):" -ForegroundColor White
        
        $preview = $response.answer.Substring(0, [Math]::Min(200, $response.answer.Length))
        Write-Host "   $preview..." -ForegroundColor Gray
        
    } catch {
        Write-Host "   ❌ Error: $_" -ForegroundColor Red
    }
    
    Start-Sleep -Seconds 1
}

# Test 3: Stats Endpoint
Write-Host "`n3️⃣  Testing Stats Endpoint..." -ForegroundColor Yellow
try {
    $stats = Invoke-RestMethod -Uri "http://localhost:8000/api/stats" -Method GET
    Write-Host "   ✅ Cache Statistics:" -ForegroundColor Green
    Write-Host "   Total Queries: $($stats.total_queries)" -ForegroundColor Gray
    Write-Host "   Cache Hits: $($stats.cache_hits)" -ForegroundColor Gray
    Write-Host "   Hit Rate: $([math]::Round($stats.hit_rate * 100, 1))%" -ForegroundColor Gray
    Write-Host "   Time Saved: $([math]::Round($stats.time_saved, 2))s" -ForegroundColor Gray
    Write-Host "   Cost Saved: $" -NoNewline -ForegroundColor Gray
    Write-Host "$([math]::Round($stats.estimated_cost_saved, 4))" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Error getting stats: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Gray
Write-Host "[DONE] Backend API testing completed!" -ForegroundColor Green
Write-Host ""
