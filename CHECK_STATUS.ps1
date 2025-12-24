# ============================================
# PregCare Status Check Script
# ============================================
# This script checks the status of backend and frontend
# Use this to verify if services are running properly
# ============================================

Write-Host "`n" -ForegroundColor White
Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     PregCare System Status                ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host "`n"

$allGood = $true

# Check Backend
Write-Host "[BACKEND STATUS] Port 8000" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$backendPort = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($backendPort) {
    $processId = $backendPort.OwningProcess
    $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
    
    Write-Host "  [✓] Port 8000: LISTENING" -ForegroundColor Green
    Write-Host "      Process: $($process.ProcessName) (PID: $processId)" -ForegroundColor Gray
    
    # Check API health
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8000/" -TimeoutSec 3 -ErrorAction Stop
        Write-Host "  [✓] API Health: HEALTHY" -ForegroundColor Green
        Write-Host "      Status: $($response.status)" -ForegroundColor Gray
        Write-Host "      RAG Ready: $($response.rag_ready)" -ForegroundColor Gray
        Write-Host "      Documents: $($response.local_docs_count)" -ForegroundColor Gray
        
        # Check cache stats
        try {
            $stats = Invoke-RestMethod -Uri "http://localhost:8000/api/stats" -TimeoutSec 3
            Write-Host "  [✓] Cache Stats:" -ForegroundColor Green
            Write-Host "      Total Queries: $($stats.total_queries)" -ForegroundColor Gray
            Write-Host "      Cache Hits: $($stats.cache_hits) ($([Math]::Round($stats.hit_rate, 1))%)" -ForegroundColor Gray
            Write-Host "      Time Saved: $([Math]::Round($stats.time_saved, 1))s" -ForegroundColor Gray
        } catch {
            Write-Host "  [!] Cache Stats: Not available" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  [✗] API Health: NOT RESPONDING" -ForegroundColor Red
        Write-Host "      Error: $($_.Exception.Message)" -ForegroundColor Red
        $allGood = $false
    }
} else {
    Write-Host "  [✗] Port 8000: NOT LISTENING" -ForegroundColor Red
    Write-Host "      Backend server is not running!" -ForegroundColor Red
    $allGood = $false
}

# Check Frontend
Write-Host "`n[FRONTEND STATUS] Port 5173/5174" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$frontendFound = $false
$frontendPorts = @(5173, 5174)

foreach ($port in $frontendPorts) {
    $frontendPort = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($frontendPort) {
        $processId = $frontendPort.OwningProcess
        $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
        
        Write-Host "  [✓] Port $port : LISTENING" -ForegroundColor Green
        Write-Host "      Process: $($process.ProcessName) (PID: $processId)" -ForegroundColor Gray
        Write-Host "      URL: http://localhost:$port" -ForegroundColor Gray
        $frontendFound = $true
        break
    }
}

if (-not $frontendFound) {
    Write-Host "  [✗] Port 5173/5174: NOT LISTENING" -ForegroundColor Red
    Write-Host "      Frontend server is not running!" -ForegroundColor Red
    $allGood = $false
}

# Check Virtual Environment
Write-Host "`n[ENVIRONMENT STATUS]" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$venvPath = Join-Path $PSScriptRoot "training\.venv"
if (Test-Path $venvPath) {
    Write-Host "  [✓] Virtual Environment: EXISTS" -ForegroundColor Green
    Write-Host "      Path: $venvPath" -ForegroundColor Gray
} else {
    Write-Host "  [✗] Virtual Environment: NOT FOUND" -ForegroundColor Red
    Write-Host "      Expected at: $venvPath" -ForegroundColor Red
}

# Check Database (optional)
Write-Host "`n[DATABASE STATUS] PostgreSQL" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$pgPort = Get-NetTCPConnection -LocalPort 5432 -ErrorAction SilentlyContinue
if ($pgPort) {
    Write-Host "  [✓] Port 5432: LISTENING" -ForegroundColor Green
    Write-Host "      PostgreSQL appears to be running" -ForegroundColor Gray
} else {
    Write-Host "  [!] Port 5432: NOT LISTENING" -ForegroundColor Yellow
    Write-Host "      PostgreSQL may not be running (optional)" -ForegroundColor Yellow
}

# Summary
Write-Host "`n" -ForegroundColor White
Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor $(if($allGood){"Green"}else{"Red"})
Write-Host "║     $(if($allGood){"System Status: HEALTHY"}else{"System Status: ISSUES DETECTED"})            ║" -ForegroundColor $(if($allGood){"Green"}else{"Red"})
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor $(if($allGood){"Green"}else{"Red"})

if ($allGood) {
    Write-Host "`n[✓] All services are running properly!" -ForegroundColor Green
    Write-Host "[INFO] You can access the application at:" -ForegroundColor Cyan
    if ($frontendFound) {
        Write-Host "       http://localhost:$port" -ForegroundColor White
    } else {
        Write-Host "       http://localhost:5173 (or 5174)" -ForegroundColor White
    }
} else {
    Write-Host "`n[✗] Some services are not running!" -ForegroundColor Red
    Write-Host "[ACTION] Run START_ALL.ps1 to start the application" -ForegroundColor Yellow
}

Write-Host "`n[QUICK ACTIONS]" -ForegroundColor Cyan
Write-Host "  - Start all services: Run START_ALL.ps1" -ForegroundColor White
Write-Host "  - Stop all services: Run STOP_ALL.ps1" -ForegroundColor White
Write-Host "  - Check status again: Run CHECK_STATUS.ps1" -ForegroundColor White

Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
