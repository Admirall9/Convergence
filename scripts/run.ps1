$ErrorActionPreference = "Stop"

if (-not (Get-Command poetry -ErrorAction SilentlyContinue)) {
    Write-Error "Poetry not found. Run scripts/create-venv.ps1 first."
}

poetry run uvicorn src.main:app --host 127.0.0.1 --port 8000 --reload


