# ============================================
# PregCare Complete System Startup Script
# ============================================
# Starts: Django Backend + RAG Backend + Frontend
# ============================================

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "  PregCare Complete Startup    " -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

$ErrorActionPreference = "Continue"
$projectRoot = $PSScriptRoot

# Function to check if port is in use
function Test-PortInUse {
    param([int]$Port)
    try {
        $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        return $connection -ne $null
    } catch {
        return $false
    }
}

# Function to kill process on port
function Stop-ProcessOnPort {
    param([int]$Port)
    try {
        $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        if ($connection) {
            $processId = $connection[0].OwningProcess
            Stop-Process -Id $processId -Force -ErrorAction Stop
            Write-Host "[SUCCESS] Stopped process on port $Port (PID: $processId)" -ForegroundColor Green
            Start-Sleep -Seconds 2
            return $true
        }
        return $false
    } catch {
        Write-Host "[ERROR] Could not stop process on port $Port" -ForegroundColor Red
        return $false
    }
}

# Step 1: Check and clean up port 8000 (Backend)
Write-Host "[STEP 1] Checking backend port 8000..." -ForegroundColor Yellow

# First check if backend is already running and healthy
$backendHealthy = $false
$skipBackend = $false

if (Test-PortInUse -Port 8000) {
    Write-Host "[INFO] Port 8000 is in use, checking if it's our backend..." -ForegroundColor Yellow
    try {
        $health = Invoke-WebRequest -Uri "http://localhost:8000/" -TimeoutSec 3 -ErrorAction Stop
        $data = $health.Content | ConvertFrom-Json
        if ($data.status -eq "online" -and $data.rag_ready -eq $true) {
            Write-Host "[SUCCESS] Backend is already running and healthy!" -ForegroundColor Green
            Write-Host "  - Status: $($data.status)" -ForegroundColor White
            Write-Host "  - RAG Ready: $($data.rag_ready)" -ForegroundColor White
            Write-Host "  - Documents: $($data.local_docs_count)" -ForegroundColor White
            $backendHealthy = $true
            $skipBackend = $true
        }
    } catch {
        Write-Host "[WARNING] Port 8000 occupied but backend not responding properly" -ForegroundColor Yellow
        Write-Host "[INFO] Automatically stopping old process..." -ForegroundColor Cyan
        Stop-ProcessOnPort -Port 8000
        $skipBackend = $false
    }
} else {
    Write-Host "[OK] Port 8000 is available" -ForegroundColor Green
    $skipBackend = $false
}

# Step 2: Start Backend
if (-not $skipBackend) {
    Write-Host "`n[STEP 2] Starting Backend Server..." -ForegroundColor Yellow
    $backendScript = Join-Path $projectRoot "backend\START_BACKEND.ps1"
    
    if (-not (Test-Path $backendScript)) {
        Write-Host "[ERROR] Backend script not found: $backendScript" -ForegroundColor Red
        exit 1
    }
    
    # Start backend in new window
    Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", "`"$backendScript`"" -WindowStyle Normal
    
    Write-Host "[INFO] Backend starting in new window..." -ForegroundColor Cyan
    Write-Host "[INFO] Waiting for backend to be ready..." -ForegroundColor Yellow
    
    # Wait for backend to be ready (max 30 seconds)
    $maxWait = 30
    $waited = 0
    $backendReady = $false
    
    while ($waited -lt $maxWait -and -not $backendReady) {
        Start-Sleep -Seconds 2
        $waited += 2
        
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8000/" -TimeoutSec 2 -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                $backendReady = $true
                $data = $response.Content | ConvertFrom-Json
                Write-Host "[SUCCESS] Backend is ready!" -ForegroundColor Green
                Write-Host "  - Status: $($data.status)" -ForegroundColor White
                Write-Host "  - RAG Ready: $($data.rag_ready)" -ForegroundColor White
                Write-Host "  - Documents: $($data.local_docs_count)" -ForegroundColor White
            }
        } catch {
            Write-Host "." -NoNewline -ForegroundColor Gray
        }
    }
    
    if (-not $backendReady) {
        Write-Host "`n[WARNING] Backend did not respond within $maxWait seconds" -ForegroundColor Yellow
        Write-Host "[INFO] Check the backend window for errors" -ForegroundColor Yellow
        $continue = Read-Host "Continue anyway? (Y/N)"
        if ($continue -ne 'Y' -and $continue -ne 'y') {
            exit 1
        }
    }
} else {
    Write-Host "`n[STEP 2] Skipping backend startup (already running)" -ForegroundColor Cyan
}

# Step 3: Start Frontend
Write-Host "`n[STEP 3] Starting Frontend Server..." -ForegroundColor Yellow
$frontendScript = Join-Path $projectRoot "FrontEnd\START_FRONTEND.ps1"

if (-not (Test-Path $frontendScript)) {
    Write-Host "[ERROR] Frontend script not found: $frontendScript" -ForegroundColor Red
    exit 1
}

# Start frontend in new window
Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", "`"$frontendScript`"" -WindowStyle Normal

Write-Host "[INFO] Frontend starting in new window..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

# Summary
Write-Host "`n" -ForegroundColor White
Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║     Startup Complete!                     ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Green

# Verify everything is running
Write-Host "`n[VERIFICATION] Checking all services..." -ForegroundColor Cyan
$backendOK = $false
$frontendOK = $false

# Check backend
try {
    $health = Invoke-WebRequest -Uri "http://localhost:8000/" -TimeoutSec 3 -ErrorAction Stop
    $data = $health.Content | ConvertFrom-Json
    if ($data.status -eq "online") {
        Write-Host "  [OK] Backend: ONLINE (Port 8000)" -ForegroundColor Green
        Write-Host "       RAG Ready: $($data.rag_ready) | Documents: $($data.local_docs_count)" -ForegroundColor Gray
        $backendOK = $true
    }
} catch {
    Write-Host "  [FAIL] Backend: NOT RESPONDING" -ForegroundColor Red
}

# Check frontend (wait a bit more if needed)
Start-Sleep -Seconds 2
$frontendPorts = @(5173, 5174)
foreach ($port in $frontendPorts) {
    if (Test-PortInUse -Port $port) {
        Write-Host "  [OK] Frontend: RUNNING (Port $port)" -ForegroundColor Green
        $frontendOK = $true
        $frontendPort = $port
        break
    }
}

if (-not $frontendOK) {
    Write-Host "  [WARNING] Frontend: Port detection uncertain (may still be starting)" -ForegroundColor Yellow
}

# Display URLs
Write-Host "`n[APPLICATION URLS]" -ForegroundColor Cyan
Write-Host "  Backend API:  http://localhost:8000" -ForegroundColor White
Write-Host "  API Docs:     http://localhost:8000/docs" -ForegroundColor White
if ($frontendOK) {
    Write-Host "  Frontend App: http://localhost:$frontendPort" -ForegroundColor White
    Write-Host "`n[READY] Open your browser at: http://localhost:$frontendPort" -ForegroundColor Green -BackgroundColor DarkGreen
} else {
    Write-Host "  Frontend App: http://localhost:5173 (or 5174)" -ForegroundColor White
    Write-Host "`n[INFO] Frontend may take a few more seconds to start..." -ForegroundColor Yellow
}

Write-Host "`n[IMPORTANT] To stop the servers:" -ForegroundColor Yellow
Write-Host "  - Close the backend window (or press CTRL+C)" -ForegroundColor White
Write-Host "  - Close the frontend window (or press CTRL+C)" -ForegroundColor White
Write-Host "`n[TIP] Keep both windows open while using the app!" -ForegroundColor Cyan

# Auto-open browser if both services are ready
if ($backendOK -and $frontendOK) {
    Write-Host "`n[AUTO-OPEN] Opening browser in 3 seconds..." -ForegroundColor Magenta
    Start-Sleep -Seconds 3
    Start-Process "http://localhost:$frontendPort"
}

Write-Host "`nPress any key to close this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
