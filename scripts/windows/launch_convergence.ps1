# =====================================================================
# Convergence Full Auto Launcher (ASCII-safe)
# =====================================================================

Write-Host "Cleaning old ngrok sessions..."
taskkill /IM ngrok.exe /F > $null 2>&1

Write-Host ""
Write-Host "Checking Python..."
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Python not found. Install Python 3.10+ first."
    Read-Host "Press Enter to exit..."
    exit 1
} else {
    python --version
}

Write-Host ""
Write-Host "Checking Poetry..."
if (-not (Get-Command poetry -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Poetry..."
    (Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | python -
    $env:Path += ";" + $env:APPDATA + "\Python\Scripts"
    if (-not (Get-Command poetry -ErrorAction SilentlyContinue)) {
        Write-Host "ERROR: Poetry installation failed or PATH not updated."
        Read-Host "Press Enter to exit..."
        exit 1
    }
    Write-Host "Poetry installed successfully."
} else {
    poetry --version
}

Write-Host ""
Write-Host "Starting backend..."
$projRoot = "D:\LLM_Models\Convergence"
Set-Location $projRoot
try {
    poetry install
} catch {
    Write-Host "Note: poetry install failed, trying poetry lock then install..."
    poetry lock
    poetry install
}
Start-Process powershell -ArgumentList '-NoExit','-Command','poetry run uvicorn backend.main:app --reload --port 8000' -WorkingDirectory $projRoot -WindowStyle Minimized
Start-Sleep -Seconds 6

Write-Host ""
Write-Host "Starting frontend..."
$frontendPaths = @(
    "$projRoot\frontend",
    "$projRoot\web",
    "$projRoot\client",
    "$projRoot\ui"
)
$frontendDir = $null
foreach ($p in $frontendPaths) {
    if (Test-Path (Join-Path $p "package.json")) {
        $frontendDir = $p
        break
    }
}
if ($null -eq $frontendDir) {
    Write-Host "ERROR: No frontend found. Expected one of:"
    $frontendPaths | ForEach-Object { Write-Host "  $_" }
    Read-Host "Press Enter to exit..."
    exit 1
}
Write-Host "Frontend found at: $frontendDir"
Start-Process powershell -ArgumentList '-NoExit','-Command','npm install; npm run dev' -WorkingDirectory $frontendDir -WindowStyle Minimized
Start-Sleep -Seconds 8

Write-Host ""
Write-Host "Starting ngrok tunnels..."
Start-Process powershell -ArgumentList '-NoExit','-Command','ngrok http 8000 --region=eu' -WindowStyle Minimized
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList '-NoExit','-Command','ngrok http 5173 --region=eu' -WindowStyle Minimized
Start-Sleep -Seconds 8

Write-Host ""
Write-Host "Fetching active ngrok tunnels..."
try {
    $tunnels = Invoke-RestMethod -Uri "http://127.0.0.1:4040/api/tunnels"
    if ($tunnels -and $tunnels.tunnels) {
        foreach ($t in $tunnels.tunnels) {
            $addr = $t.config.addr
            $pub  = $t.public_url
            Write-Host ("  " + $addr + "  --->  " + $pub)
        }
    } else {
        Write-Host "No tunnels returned by ngrok API. Ensure ngrok windows are open."
    }
} catch {
    Write-Host "Could not read ngrok API at http://127.0.0.1:4040."
}

Write-Host ""
Write-Host "Convergence platform is ONLINE."
Write-Host "Keep the PowerShell windows open while tunnels are active."
Read-Host "Press Enter to exit..."
# =====================================================================
