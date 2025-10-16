# Expose your current Convergence setup to the world
Write-Host "Exposing your current Convergence setup..." -ForegroundColor Green
Write-Host ""

# Add ngrok to PATH
$env:PATH += ";$env:USERPROFILE\ngrok"

# Check if ngrok is available
if (!(Get-Command ngrok -ErrorAction SilentlyContinue)) {
    Write-Host "ngrok not found. Please run setup_ngrok.ps1 first" -ForegroundColor Red
    Write-Host "Or download from: https://ngrok.com/download" -ForegroundColor Yellow
    exit 1
}

Write-Host "ngrok is ready!" -ForegroundColor Green
Write-Host ""

# Check if backend is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "Backend is running on port 8000" -ForegroundColor Green
} catch {
    Write-Host "Backend not running on port 8000" -ForegroundColor Red
    Write-Host "Please start it with: python -m uvicorn src.main:app --host 0.0.0.0 --port 8000" -ForegroundColor Yellow
}

# Check if frontend is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5174" -UseBasicParsing -TimeoutSec 5
    Write-Host "Frontend is running on port 5174" -ForegroundColor Green
} catch {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 5
        Write-Host "Frontend is running on port 5173" -ForegroundColor Green
    } catch {
        Write-Host "Frontend not running" -ForegroundColor Red
        Write-Host "Please start it with: cd client && npm run dev" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Starting ngrok tunnels..." -ForegroundColor Cyan
Write-Host ""

# Expose backend
Write-Host "Exposing backend API..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-Command", "ngrok http 8000" -WindowStyle Normal

Start-Sleep -Seconds 3

# Expose frontend (try 5174 first, then 5173)
Write-Host "Exposing frontend website..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-Command", "ngrok http 5174" -WindowStyle Normal

Write-Host ""
Write-Host "Convergence platform is now accessible worldwide!" -ForegroundColor Green
Write-Host ""
Write-Host "Your public URLs will be displayed in the ngrok windows:" -ForegroundColor Cyan
Write-Host "   Backend API: https://xxxxx.ngrok.io" -ForegroundColor White
Write-Host "   Frontend Website: https://yyyyy.ngrok.io" -ForegroundColor White
Write-Host ""
Write-Host "Copy the frontend URL and share it worldwide!" -ForegroundColor Yellow
Write-Host "   Anyone can access your Convergence platform from any device!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Note: If you get authentication errors, you need to:" -ForegroundColor Magenta
Write-Host "   1. Sign up at https://dashboard.ngrok.com/signup" -ForegroundColor Magenta
Write-Host "   2. Get your auth token from https://dashboard.ngrok.com/get-started/your-authtoken" -ForegroundColor Magenta
Write-Host "   3. Run: ngrok config add-authtoken YOUR_TOKEN" -ForegroundColor Magenta
