# Convergence Platform - Worldwide Access with Custom Domain
Write-Host "Starting Convergence Platform for worldwide access..." -ForegroundColor Green
Write-Host ""

# Add ngrok to PATH
$env:PATH += ";$env:USERPROFILE\ngrok"

# Check if ngrok is available
if (!(Get-Command ngrok -ErrorAction SilentlyContinue)) {
    Write-Host "ngrok not found. Please run setup_ngrok.ps1 first" -ForegroundColor Red
    exit 1
}

Write-Host "ngrok is ready!" -ForegroundColor Green
Write-Host ""

# Check if backend is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "Backend is running on port 8000" -ForegroundColor Green
} catch {
    Write-Host "Backend not running. Starting it now..." -ForegroundColor Blue
    Start-Process powershell -ArgumentList "-Command", "python -m uvicorn src.main:app --host 0.0.0.0 --port 8000" -WindowStyle Minimized
    Start-Sleep -Seconds 5
}

# Check if frontend is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 5
    Write-Host "Frontend is running on port 5173" -ForegroundColor Green
} catch {
    Write-Host "Frontend not running. Starting it now..." -ForegroundColor Blue
    Start-Process powershell -ArgumentList "-Command", "cd client; npm run dev" -WindowStyle Minimized
    Start-Sleep -Seconds 8
}

Write-Host ""
Write-Host "Exposing Convergence platform to the world..." -ForegroundColor Cyan
Write-Host ""

# Expose backend with custom subdomain
Write-Host "Exposing backend API as convergence-api.ngrok.io..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-Command", "ngrok http 8000 --subdomain=convergence-api" -WindowStyle Normal

Start-Sleep -Seconds 3

# Expose frontend with custom subdomain
Write-Host "Exposing frontend website as convergence.ngrok.io..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-Command", "ngrok http 5173 --subdomain=convergence" -WindowStyle Normal

Write-Host ""
Write-Host "Convergence platform is now accessible worldwide!" -ForegroundColor Green
Write-Host ""
Write-Host "Your public URLs:" -ForegroundColor Cyan
Write-Host "   Backend API: https://convergence-api.ngrok.io" -ForegroundColor White
Write-Host "   Frontend Website: https://convergence.ngrok.io" -ForegroundColor White
Write-Host ""
Write-Host "Share https://convergence.ngrok.io with anyone worldwide!" -ForegroundColor Yellow
Write-Host "   They can access your platform from any device, anywhere!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Note: You need a paid ngrok account for custom subdomains." -ForegroundColor Magenta
Write-Host "   Free accounts get random URLs like https://abc123.ngrok.io" -ForegroundColor Magenta
