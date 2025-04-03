@echo off
echo ====================================================
echo    Agricultural Health Dashboard - Setup and Run
echo ====================================================
echo.

REM Check for Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH.
    echo Please install Python and try again.
    pause
    exit /b
)

REM Check for Node.js
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH.
    echo Please install Node.js and try again.
    pause
    exit /b
)

echo Step 1: Installing Python dependencies...
echo.
python -m pip install fastapi uvicorn pydantic python-multipart 
echo.
echo Python dependencies installed successfully!
echo.

echo Step 2: Setting up frontend...
echo.

REM Copy the simplified index.html to be the default
copy /Y index.simplified.html index.html

echo.
echo Frontend setup complete!
echo.

echo Setup complete! Starting the application...
echo.

REM Run the application
call run_all.bat
