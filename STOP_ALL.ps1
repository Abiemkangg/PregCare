# ============================================
# PregCare Stop All Servers Script
# ============================================
# This script stops both backend and frontend servers
# Run this to cleanly shut down the application
# ============================================

Write-Host "`n" -ForegroundColor White
Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Red
Write-Host "║     Stopping PregCare Servers             ║" -ForegroundColor Red
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Red
Write-Host "`n"

$ErrorActionPreference = "Continue"
$stopped = 0

# Function to stop process on port
function Stop-ProcessOnPort {
    param(
        [int]$Port,
        [string]$ServiceName
    )
    
    try {
        $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        if ($connection) {
            $processId = $connection.OwningProcess
            $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
            
            if ($process) {
                Write-Host "[STOPPING] $ServiceName (Port $Port, PID: $processId)..." -ForegroundColor Yellow
                Stop-Process -Id $processId -Force -ErrorAction Stop
                Start-Sleep -Seconds 1
                
                # Verify stopped
                $stillRunning = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
                if (-not $stillRunning) {
                    Write-Host "[SUCCESS] $ServiceName stopped successfully" -ForegroundColor Green
                    return $true
                } else {
                    Write-Host "[WARNING] $ServiceName may still be running" -ForegroundColor Yellow
                    return $false
                }
            } else {
                Write-Host "[INFO] $ServiceName process already terminated" -ForegroundColor Gray
                return $false
            }
        } else {
            Write-Host "[INFO] $ServiceName is not running on port $Port" -ForegroundColor Gray
            return $false
        }
    } catch {
        Write-Host "[ERROR] Failed to stop $ServiceName: $_" -ForegroundColor Red
        return $false
    }
}

# Stop Backend (Port 8000)
Write-Host "[STEP 1] Checking Backend Server..." -ForegroundColor Cyan
if (Stop-ProcessOnPort -Port 8000 -ServiceName "Backend") {
    $stopped++
}

# Stop Frontend (Port 5173 and 5174)
Write-Host "`n[STEP 2] Checking Frontend Server..." -ForegroundColor Cyan
$frontendStopped = $false

if (Stop-ProcessOnPort -Port 5173 -ServiceName "Frontend (Port 5173)") {
    $stopped++
    $frontendStopped = $true
}

if (Stop-ProcessOnPort -Port 5174 -ServiceName "Frontend (Port 5174)") {
    $stopped++
    $frontendStopped = $true
}

if (-not $frontendStopped) {
    Write-Host "[INFO] Frontend is not running" -ForegroundColor Gray
}

# Kill any python processes related to uvicorn
Write-Host "`n[STEP 3] Cleaning up Python processes..." -ForegroundColor Cyan
$pythonProcesses = Get-Process python* -ErrorAction SilentlyContinue | Where-Object {
    $_.CommandLine -like "*uvicorn*" -or $_.CommandLine -like "*chat_api*"
}

if ($pythonProcesses) {
    foreach ($proc in $pythonProcesses) {
        Write-Host "[CLEANUP] Stopping Python process (PID: $($proc.Id))..." -ForegroundColor Yellow
        Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
        $stopped++
    }
    Write-Host "[SUCCESS] Python processes cleaned up" -ForegroundColor Green
} else {
    Write-Host "[INFO] No additional Python processes found" -ForegroundColor Gray
}

# Summary
Write-Host "`n" -ForegroundColor White
Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║     Shutdown Complete                     ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host "`n[SUMMARY]" -ForegroundColor Cyan
Write-Host "  Processes stopped: $stopped" -ForegroundColor White
Write-Host "`n[INFO] All servers have been stopped." -ForegroundColor Green
Write-Host "[INFO] You can safely close all PowerShell windows now." -ForegroundColor Yellow

Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
