# ============================================
# PregCare RAG Backend Startup Script
# ============================================
# This script starts the FastAPI RAG backend server
# Keep this terminal open while using the AI Assistant!
# ============================================

Write-Host "`n[STARTUP] Starting PregCare RAG Backend..." -ForegroundColor Cyan
Write-Host "================================================`n" -ForegroundColor Gray

# Check if port 8001 is already in use
$portCheck = Get-NetTCPConnection -LocalPort 8001 -ErrorAction SilentlyContinue
if ($portCheck) {
    Write-Host "[WARNING] Port 8001 is already in use!" -ForegroundColor Yellow
    Write-Host "[INFO] Attempting to stop existing process..." -ForegroundColor Yellow
    
    $processId = $portCheck.OwningProcess
    try {
        Stop-Process -Id $processId -Force -ErrorAction Stop
        Write-Host "[SUCCESS] Stopped process $processId" -ForegroundColor Green
        Start-Sleep -Seconds 2
    } catch {
        Write-Host "[ERROR] Could not stop process. Please close it manually." -ForegroundColor Red
        Write-Host "[INFO] Process ID: $processId" -ForegroundColor Yellow
        exit 1
    }
}

# Navigate to project root
$projectRoot = "C:\Users\chris\Documents\SEMESTER 5\IPPL"
Set-Location $projectRoot

# Set Python path
$venvPython = Join-Path $projectRoot ".venv\Scripts\python.exe"
if (-not (Test-Path $venvPython)) {
    Write-Host "[ERROR] Python virtual environment not found!" -ForegroundColor Red
    Write-Host "[INFO] Please run: python -m venv .venv" -ForegroundColor Yellow
    exit 1
}

# Navigate to API directory
$apiPath = Join-Path $projectRoot "backend\app\API"
Set-Location $apiPath

# Display startup info
Write-Host "`n[INFO] RAG Backend Configuration:" -ForegroundColor Cyan
Write-Host "  - Server URL: http://localhost:8001" -ForegroundColor White
Write-Host "  - Chat API: http://localhost:8001/api/chat" -ForegroundColor White
Write-Host "  - Working Directory: $apiPath" -ForegroundColor White
Write-Host "  - Fallback Responses: ENABLED" -ForegroundColor Green
Write-Host "  - Semantic Cache: ENABLED" -ForegroundColor Green
Write-Host "  - Rate Limiter: 8s interval" -ForegroundColor Green
Write-Host "`n[INFO] Press CTRL+C to stop the server" -ForegroundColor Yellow
Write-Host "================================================`n" -ForegroundColor Gray

# Start RAG server
try {
    & $venvPython start_server.py
} catch {
    Write-Host "`n[ERROR] Server crashed: $_" -ForegroundColor Red
    Write-Host "[INFO] Check the error messages above for details." -ForegroundColor Yellow
    exit 1
}
