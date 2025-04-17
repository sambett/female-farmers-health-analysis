@echo off
echo Agricultural Health Dashboard - Setup Script

echo Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo Setting up Python environment for backend...
cd backend
if exist .venv (
    echo Virtual environment already exists, skipping creation...
) else (
    echo Creating virtual environment...
    python -m venv .venv
)

echo Activating virtual environment...
call .venv\Scripts\activate

echo Installing backend dependencies...
pip install -r requirements.txt
cd ..

echo.
echo Setup complete!
echo.
echo To run the application:
echo - Full application: run_app.bat
echo - Frontend only: run_frontend.bat
echo - Backend only: run_backend.bat
echo.
echo Press any key to exit...
pause > nul
