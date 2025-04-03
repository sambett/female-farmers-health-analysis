@echo off
echo Agricultural Health Dashboard - Startup Script

echo Starting backend server...
start cmd /k "cd backend && python simple_server.py"

echo Waiting for backend to initialize (5 seconds)...
timeout /t 5 /nobreak >nul

echo Starting frontend development server...
start cmd /k "call node_modules\.bin\vite --port 5173"

echo.
echo Application is starting!
echo.
echo The dashboard should open automatically in your default browser.
echo If it doesn't, navigate to: http://localhost:5173
echo.
echo - Backend runs on: http://localhost:8000
echo - Frontend runs on: http://localhost:5173
echo.
echo Press any key to exit this window (the applications will continue running)...
pause >nul
