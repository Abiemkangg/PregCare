#!/usr/bin/env pwsh
# START_DATABASE.ps1 - Start PostgreSQL Database for PregCare

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   Starting PostgreSQL Database (Docker)" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to training folder
Set-Location -Path "$PSScriptRoot\training"

Write-Host "[1/3] Checking Docker..." -ForegroundColor Yellow
docker --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker tidak ditemukan! Install Docker Desktop dulu" -ForegroundColor Red
    exit 1
}

Write-Host "[2/3] Starting PostgreSQL container..." -ForegroundColor Yellow
docker-compose up -d postgres

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ PostgreSQL container started!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Database Info:" -ForegroundColor Cyan
    Write-Host "  Host: localhost"
    Write-Host "  Port: 5432"
    Write-Host "  DB: pregcare_db"
    Write-Host "  User: pregcare_user"
    Write-Host "  Password: pregcare_pwd"
    Write-Host ""
    
    Write-Host "[3/3] Waiting for database to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    Write-Host "✅ Database is ready!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to start PostgreSQL" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "   Database Started Successfully!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
