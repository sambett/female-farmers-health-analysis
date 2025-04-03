# Agricultural Health Dashboard

This application provides data visualization and analysis tools for understanding health risks among female agricultural workers.

## Project Overview

The dashboard analyzes data from female farmers to understand occupational risks, exploring the relationships between working conditions, lifestyle habits, and occupational diseases to develop effective prevention solutions.

## Running the Application

### Quick Start

Use the included batch files to run the application:

1. **Development Server**:
   - Double-click `dev.bat` or run it from the command line
   - This will start the development server at http://localhost:5173

2. **Build for Production**:
   - Double-click `build.bat` or run it from the command line
   - This will create optimized files in the `dist` directory

3. **Run the Backend** (required for risk prediction tool):
   - Navigate to the `backend` directory
   - Run `setup_and_run.bat`

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
- Risk prediction tool
- Comparative analysis of worker profiles
- Regional pattern identification

## Tech Stack

- React 19
- TypeScript
- Vite
- Material UI
- TensorFlow.js for machine learning
- Recharts for data visualization
