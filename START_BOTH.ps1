# ============================================
# PregCare Full Stack Startup Script
# ============================================

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "   PregCare Full Stack Startup  " -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

$projectRoot = $PSScriptRoot

# Start Backend
Write-Host "[1/2] Starting Backend Server..." -ForegroundColor Yellow
$backendScript = Join-Path $projectRoot "backend\START_BACKEND.ps1"

if (Test-Path $backendScript) {
    Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", "`"$backendScript`"" -WindowStyle Normal
    Write-Host "  Backend starting in new window..." -ForegroundColor Green
} else {
    Write-Host "  [ERROR] Backend script not found!" -ForegroundColor Red
}

Start-Sleep -Seconds 3

# Start Frontend
Write-Host "`n[2/2] Starting Frontend Server..." -ForegroundColor Yellow
$frontendScript = Join-Path $projectRoot "FrontEnd\START_FRONTEND.ps1"

if (Test-Path $frontendScript) {
    Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", "`"$frontendScript`"" -WindowStyle Normal
    Write-Host "  Frontend starting in new window..." -ForegroundColor Green
} else {
    Write-Host "  [ERROR] Frontend script not found!" -ForegroundColor Red
}

Start-Sleep -Seconds 2

# Summary
Write-Host "`n================================" -ForegroundColor Green
Write-Host "   Startup Complete!            " -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

Write-Host "`nApplication URLs:" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:8000" -ForegroundColor White
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor White

Write-Host "`nPress any key to close..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
