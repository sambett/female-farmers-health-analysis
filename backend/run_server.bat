@echo off
echo Starting Agricultural Health Risk Prediction API...

REM Run the server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

pause
