@echo off
echo Setting up Conda environment for Agricultural Health Risk Prediction API...

REM Create conda environment if it doesn't exist
call conda create -n agri-health-env python=3.10 -y
echo.
echo Activating conda environment...
call conda activate agri-health-env

REM Install scientific packages with conda
echo.
echo Installing scientific packages via conda...
call conda install pandas scikit-learn numpy joblib nltk -y

REM Install web framework packages with pip
echo.
echo Installing web framework packages via pip...
call pip install fastapi==0.104.1 uvicorn==0.23.2 pydantic==2.4.2 python-multipart==0.0.6 starlette-cors==0.4.0 openpyxl==3.1.2

REM Create model_data directory if it doesn't exist
if not exist model_data mkdir model_data

echo.
echo Environment setup complete!
echo.
echo To run the server:
echo 1. Activate the environment: conda activate agri-health-env
echo 2. Start the server: python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
echo.
pause
