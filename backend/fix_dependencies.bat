@echo off
echo Fixing Agricultural Health Risk Prediction API dependencies...

REM Activate the virtual environment
echo Activating virtual environment...
call .venv\Scripts\activate

REM Uninstall problematic pandas
echo Uninstalling pandas...
pip uninstall -y pandas

REM Install dependencies with specific versions
echo Installing core dependencies...
pip install fastapi==0.104.1 uvicorn==0.23.2 scikit-learn==1.3.2 numpy==1.26.0 pydantic==2.4.2 python-multipart==0.0.6 joblib==1.3.2 openpyxl==3.1.2 nltk==3.8.1 starlette-cors==0.4.0

REM Try to install pandas with a specific version
echo Installing pandas==2.0.3 (more stable version)...
pip install pandas==2.0.3

REM If issue persists with pandas, try a simpler approach
echo If pandas installation fails, try installing with conda instead...
echo Example: conda install pandas=2.0.3 scikit-learn

REM Create model_data directory if it doesn't exist
if not exist model_data mkdir model_data

echo Dependencies fixed. Now run setup_and_run.bat to start the server.
pause
