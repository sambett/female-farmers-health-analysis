@echo off
echo Starting backend server setup...

cd backend

REM Create virtual environment if it doesn't exist
if not exist .venv (
    echo Creating virtual environment...
    python -m venv .venv
)

REM Activate virtual environment
call .venv\Scripts\activate.bat

REM Install requirements
echo Installing dependencies...
pip install -r requirements.txt

REM Run the backend server
echo Starting backend server...
python simple_server.py

echo Backend server stopped.
