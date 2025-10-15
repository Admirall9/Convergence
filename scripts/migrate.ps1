param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$cmd = @("upgrade", "head")
)

$ErrorActionPreference = "Stop"

function Resolve-Poetry {
    if (Get-Command poetry -ErrorAction SilentlyContinue) { return "poetry" }
    $default = Join-Path $env:USERPROFILE "AppData\Roaming\Python\Scripts\poetry.exe"
    if (Test-Path $default) { return $default }
    Write-Error "Poetry not found. Run scripts/create-venv.ps1 first."; exit 1
}

$poetry = Resolve-Poetry

& $poetry run alembic @cmd


