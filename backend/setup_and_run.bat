@echo off
echo Setting up and running the Agricultural Health Risk Prediction API...

REM Check if .venv exists, if not create it
if not exist .venv (
    echo Creating virtual environment...
    python -m venv .venv
)

REM Activate the virtual environment
echo Activating virtual environment...
call .venv\Scripts\activate

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

REM Create model_data directory if it doesn't exist
if not exist model_data mkdir model_data

REM Run the FastAPI server
echo Starting the server...
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

REM Keep the window open in case of error
pause
