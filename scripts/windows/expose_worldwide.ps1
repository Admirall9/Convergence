# Worldwide Access Script for Convergence Platform
Write-Host "Making your Convergence platform accessible worldwide..." -ForegroundColor Green
Write-Host ""

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
    Write-Host "Backend not running. Please start it first:" -ForegroundColor Red
    Write-Host "   python -m uvicorn src.main:app --host 0.0.0.0 --port 8000" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Starting backend now..." -ForegroundColor Blue
    Start-Process powershell -ArgumentList "-Command", "python -m uvicorn src.main:app --host 0.0.0.0 --port 8000" -WindowStyle Minimized
    Start-Sleep -Seconds 5
}

# Check if frontend is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 5
    Write-Host "Frontend is running on port 5173" -ForegroundColor Green
} catch {
    Write-Host "Frontend not running. Please start it first:" -ForegroundColor Red
    Write-Host "   cd client && npm run dev" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Starting frontend now..." -ForegroundColor Blue
    Start-Process powershell -ArgumentList "-Command", "cd client; npm run dev" -WindowStyle Minimized
    Start-Sleep -Seconds 5
}

Write-Host ""
Write-Host "Exposing your services to the world..." -ForegroundColor Cyan
Write-Host ""

# Expose backend
Write-Host "Exposing backend (API)..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-Command", "ngrok http 8000" -WindowStyle Normal

Start-Sleep -Seconds 3

# Expose frontend  
Write-Host "Exposing frontend (Website)..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-Command", "ngrok http 5173" -WindowStyle Normal

Write-Host ""
Write-Host "Your Convergence platform is now accessible worldwide!" -ForegroundColor Green
Write-Host ""
Write-Host "What you'll get:" -ForegroundColor Cyan
Write-Host "   Backend API: https://xxxxx.ngrok.io (for API calls)" -ForegroundColor White
Write-Host "   Frontend Website: https://yyyyy.ngrok.io (for users)" -ForegroundColor White
Write-Host ""
Write-Host "Share these URLs with anyone worldwide!" -ForegroundColor Yellow
Write-Host "   They can access your platform from any device, anywhere!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Pro tip: The URLs will be displayed in the ngrok windows that just opened" -ForegroundColor Cyan
Write-Host "   Copy and share those URLs to give worldwide access!" -ForegroundColor Cyan
