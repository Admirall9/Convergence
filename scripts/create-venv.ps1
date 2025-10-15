$ErrorActionPreference = "Stop"

if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Error "Python is not installed or not in PATH. Install Python 3.10+ first."
}

if (-not (Get-Command poetry -ErrorAction SilentlyContinue)) {
    Write-Output "Installing Poetry..."
    (Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | python -
    $env:Path += ";$([Environment]::GetFolderPath('UserProfile'))\AppData\Roaming\Python\Scripts"
}

poetry --version
poetry env use python
poetry install --no-interaction --no-ansi

Write-Output 'Environment ready. To activate: poetry shell'


