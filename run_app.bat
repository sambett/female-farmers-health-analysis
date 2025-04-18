@echo off
echo Starting the Agricultural Health Dashboard application...

REM Start backend server in a new window
start cmd /k "run_backend.bat"

REM Allow backend server to initialize
timeout /t 3 /nobreak > nul

REM Start frontend in a new window
start cmd /k "run_frontend.bat"

echo Application started. Please use the respective windows to control the frontend and backend servers.
