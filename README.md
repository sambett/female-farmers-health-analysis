# Agricultural Health Dashboard

This application provides data visualization and analysis tools for understanding health risks among female agricultural workers.

## Project Overview

The dashboard analyzes data from female farmers to understand occupational risks, exploring the relationships between working conditions, lifestyle habits, and occupational diseases to develop effective prevention solutions.

## Running the Application

### Quick Start

1. **Initial Setup**:
   - Run `setup.bat` to install all dependencies
   - This sets up both frontend and backend environments

2. **Run the Application**:
   - Run `run_app.bat` to start both frontend and backend servers
   - The frontend will be available at http://localhost:5173
   - The backend API will be available at http://localhost:8000

3. **Individual Components**:
   - **Frontend Only**: Run `run_frontend.bat` 
   - **Backend Only**: Run `run_backend.bat`

### Manual Commands

If you prefer using npm commands directly:

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Features

- Statistical analysis of health data
- Visual analytics and dashboard
- Risk prediction tool with ML models
- Comparative analysis of worker profiles
- Regional pattern identification
- Text analysis of agricultural descriptions
- What-if scenarios for intervention planning

## Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS, Material UI, Recharts
- **Backend**: Python, FastAPI, scikit-learn, NLTK
- **Data Processing**: Pandas, NumPy, SciPy
- **Machine Learning**: Random Forest model for risk prediction

## Project Structure

- `frontend/` - Frontend React application
  - `src/` - React components, services, and TypeScript code
  - `public/` - Static assets
- `backend/` - Python backend for the risk prediction API
  - `app/` - FastAPI application code
  - `model_data/` - Trained ML models
- `data/` - Dataset files
- `Analysis/` - Data analysis and modeling notebooks
- `cleaning_process/` - Data cleaning and preprocessing pipeline
- `farmers report/` - Analysis reports and documentation

## Predictive Model

The system uses a hybrid approach combining Random Forest machine learning with domain knowledge for agricultural risk prediction. The model provides:

- Overall and domain-specific risk scores (respiratory, skin, neurological)
- Personalized recommendations for risk reduction
- What-if scenarios to explore intervention impacts
- Text analysis capabilities for natural language input
