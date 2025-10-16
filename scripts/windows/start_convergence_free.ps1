param(
    [switch]$Online
)

Write-Host "`n=== Starting Convergence Platform ===`n" -ForegroundColor Green

$env:PATH += ";$env:USERPROFILE\ngrok"

if ($Online -and !(Get-Command ngrok -ErrorAction SilentlyContinue)) {
    Write-Host "ngrok not found. Please install or run setup_ngrok.ps1 first." -ForegroundColor Red
    exit 1
}

function Test-Endpoint($url) {
    try {
        Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5 > $null
        return $true
    } catch {
        return $false
    }
}

function Wait-ForPort {
    param([int]$Port, [int]$TimeoutSec = 30)
    $sw = [Diagnostics.Stopwatch]::StartNew()
    while ($sw.Elapsed.TotalSeconds -lt $TimeoutSec) {
        try {
            $tcp = New-Object Net.Sockets.TcpClient("localhost", $Port)
            $tcp.Close()
            return $true
        } catch {
            Start-Sleep -Seconds 1
        }
    }
    return $false
}

if (Test-Endpoint "http://127.0.0.1:8000/health") {
    Write-Host "Backend already running (port 8000)" -ForegroundColor Green
} else {
    Write-Host "Starting backend (FastAPI)..." -ForegroundColor Blue
    Start-Process powershell -ArgumentList "-Command", "& $env:USERPROFILE\AppData\Roaming\Python\Scripts\poetry.exe run uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload" -WindowStyle Minimized
    Write-Host "Waiting for backend to start..." -ForegroundColor Yellow
    if (Wait-ForPort 8000 -TimeoutSec 30) {
        Write-Host "Backend live at http://127.0.0.1:8000" -ForegroundColor Green
    } else {
        Write-Host "Backend failed to start within timeout." -ForegroundColor Red
        exit 1
    }
}

if (Test-Endpoint "http://127.0.0.1:5173") {
    Write-Host "Frontend already running (port 5173)" -ForegroundColor Green
} else {
    Write-Host "Starting frontend (Vite)..." -ForegroundColor Blue
    $frontendCmd = "cd client; npm run dev -- --host"
    Start-Process powershell -ArgumentList "-Command", $frontendCmd -WindowStyle Minimized
    Write-Host "Waiting for frontend to start..." -ForegroundColor Yellow
    if (Wait-ForPort 5173 -TimeoutSec 30) {
        Write-Host "Frontend live at http://127.0.0.1:5173" -ForegroundColor Green
    } else {
        Write-Host "Frontend failed to start within timeout." -ForegroundColor Red
        exit 1
    }
}

$clientEnvPath = Join-Path (Get-Location) "client\.env.local"
"VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1" | Out-File -FilePath $clientEnvPath -Encoding ascii -Force

if ($Online) {
    Write-Host "`nOnline mode enabled (ngrok)..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-Command", "ngrok http 5173" -WindowStyle Normal
    Start-Sleep -Seconds 5
    try {
        $json = Invoke-RestMethod -Uri "http://127.0.0.1:4040/api/tunnels" -TimeoutSec 3
        if ($json.tunnels -and $json.tunnels.Count -gt 0) {
            $frontendUrl = $json.tunnels[0].public_url
            Write-Host "Public URL: $frontendUrl" -ForegroundColor Green
            Start-Process $frontendUrl
        } else {
            Write-Host "ngrok tunnel not found." -ForegroundColor Yellow
        }
    } catch {
        Write-Host "Could not retrieve ngrok URL." -ForegroundColor Yellow
    }
} else {
    Write-Host "`nRunning locally only (no ngrok tunnel started)." -ForegroundColor Yellow
    Write-Host "Frontend: http://127.0.0.1:5173"
    Write-Host "Backend:  http://127.0.0.1:8000"
    Start-Process "http://127.0.0.1:5173"
}

Write-Host "`nAll systems running successfully!" -ForegroundColor Green
