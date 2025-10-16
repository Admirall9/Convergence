@echo off
echo 🌍 Starting Convergence Platform for Worldwide Access...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "python -m uvicorn src.main:app --host 0.0.0.0 --port 8000"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd client && npm run dev"

timeout /t 5 /nobreak >nul

echo Starting ngrok for Backend (API)...
start "Backend ngrok" cmd /k "ngrok http 8000"

timeout /t 2 /nobreak >nul

echo Starting ngrok for Frontend (Website)...
start "Frontend ngrok" cmd /k "ngrok http 5174"

echo.
echo 🎉 Your Convergence platform is now accessible worldwide!
echo.
echo 📋 You'll get two public URLs:
echo    • Backend API: https://xxxxx.ngrok.io
echo    • Frontend Website: https://yyyyy.ngrok.io (port 5174)
echo.
echo 📱 Share these URLs with anyone worldwide!
echo    They can access your platform from any device, anywhere!
echo.
echo 💡 The actual URLs will be displayed in the ngrok windows.
echo    Copy and share those URLs to give worldwide access!
echo.
pause
