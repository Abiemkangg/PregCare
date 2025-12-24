# ============================================
# PregCare Frontend Startup Script
# ============================================
# This script starts the React frontend dev server
# Make sure backend is running first!
# ============================================

Write-Host "`n[STARTUP] Starting PregCare Frontend Server..." -ForegroundColor Cyan
Write-Host "================================================`n" -ForegroundColor Gray

# Navigate to frontend directory
$frontendPath = $PSScriptRoot
Set-Location $frontendPath

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "[WARNING] node_modules not found. Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to install dependencies!" -ForegroundColor Red
        exit 1
    }
}

# Check backend availability
Write-Host "[INFO] Checking backend connection..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/" -TimeoutSec 3 -ErrorAction Stop
    $status = ($response.Content | ConvertFrom-Json).status
    Write-Host "[SUCCESS] Backend is online! Status: $status" -ForegroundColor Green
} catch {
    Write-Host "[WARNING] Backend is not running on port 8000!" -ForegroundColor Red
    Write-Host "[INFO] Please start backend first using backend\START_BACKEND.ps1" -ForegroundColor Yellow
    Write-Host "[INFO] Continuing anyway..." -ForegroundColor Yellow
}

# Display startup info
Write-Host "`n[INFO] Frontend Configuration:" -ForegroundColor Cyan
Write-Host "  - Frontend URL: http://localhost:5173 (or 5174 if port is busy)" -ForegroundColor White
Write-Host "  - Backend API: http://localhost:8000" -ForegroundColor White
Write-Host "  - Working Directory: $frontendPath" -ForegroundColor White
Write-Host "`n[INFO] Press CTRL+C to stop the server" -ForegroundColor Yellow
Write-Host "================================================`n" -ForegroundColor Gray

# Start dev server
npm run dev
