@echo off
echo Setting up minimal dependencies for Agricultural Health Risk Prediction API...

REM Install minimal required packages
echo Installing minimal requirements...
pip install fastapi==0.104.1 uvicorn==0.23.2 pydantic==2.4.2 python-multipart==0.0.6 openpyxl==3.1.2 joblib

REM Install nltk
echo Installing nltk...
pip install nltk

REM Create model_data directory if it doesn't exist
if not exist model_data mkdir model_data

echo Download NLTK data
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"

echo.
echo Setup complete! Now run the server with:
echo python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
echo.

pause
