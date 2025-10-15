$ErrorActionPreference = "Stop"

function Resolve-Poetry {
    if (Get-Command poetry -ErrorAction SilentlyContinue) { return "poetry" }
    $default = Join-Path $env:USERPROFILE "AppData\Roaming\Python\Scripts\poetry.exe"
    if (Test-Path $default) { return $default }
    Write-Error "Poetry not found (run scripts/create-venv.ps1)"; exit 1
}

if (-not (Get-Command python -ErrorAction SilentlyContinue)) { Write-Error "Python not found" }
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { Write-Error "Node.js not found" }
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) { Write-Error "npm not found" }

$poetry = Resolve-Poetry

Write-Output "Installing backend deps (poetry) and frontend deps (npm)..."
& $poetry lock | Out-Null
& $poetry install --no-interaction --no-ansi | Out-Null
Push-Location client
npm install --silent
Pop-Location

Write-Output "Starting backend and frontend..."
Start-Process powershell -ArgumentList "-NoExit","-Command","& `"$poetry`" run uvicorn src.main:app --host 127.0.0.1 --port 8000 --reload" | Out-Null
Start-Process powershell -ArgumentList "-NoExit","-Command","cd client; npm run dev" | Out-Null

Write-Output "Backend → http://127.0.0.1:8000/docs | Frontend → http://127.0.0.1:5173"


