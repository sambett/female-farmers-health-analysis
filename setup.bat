@echo off
echo Setting up Agricultural Health Dashboard...

REM Setup Backend
echo Setting up backend...
cd backend

REM Create virtual environment
python -m venv .venv

REM Activate virtual environment
call .venv\Scripts\activate.bat

REM Install backend dependencies
pip install fastapi uvicorn scikit-learn pandas numpy nltk
pip install -r requirements.txt

REM Deactivate virtual environment
call deactivate

cd ..

REM Setup Frontend
echo Setting up frontend...
cd frontend

REM Install frontend dependencies
call npm install

cd ..

echo Setup completed! 
echo - To run the application: run_app.bat
echo - To run only the backend: run_backend.bat
echo - To run only the frontend: run_frontend.bat
