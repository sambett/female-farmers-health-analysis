# Agricultural Health Dashboard - Instructions

## Quick Start Guide

Follow these simple steps to run the application:

### Building and Running the Frontend

1. **Build the application** (creates production files):
   - Double-click on `build.bat` in the project folder
   - The build process will create optimized files in the `dist` directory

2. **Run the development server** (for development):
   - Double-click on `dev.bat` in the project folder
   - The server will start at http://localhost:5173
   - Any changes you make to the code will be automatically reflected

### Running the Backend (Required for Risk Prediction)

1. Navigate to the `backend` folder
2. Double-click on `setup_and_run.bat`
3. The backend server will start at http://localhost:8000

### Running Everything at Once

- Double-click on `run_all.bat` to start both frontend and backend servers

## Troubleshooting

If you encounter problems with the build or running the application:

1. **If "tsc" is not recognized:**
   - Use the provided `build.bat` file instead of npm commands
   - It uses the full path to the TypeScript compiler

2. **If you get any npm warnings about "strict-peer-dependencies":**
   - These are just warnings and can be safely ignored
   - They don't affect the functionality of the application

3. **If the backend is not connecting:**
   - Make sure Python is installed
   - Check that the backend server is running (http://localhost:8000/health should return "OK")

## Project Structure

- `src/` - Frontend source code (React components, services, etc.)
- `backend/` - Python backend for the risk prediction API
- `dist/` - Built application (created after running build.bat)
- `public/` - Static assets
- `Analysis/` - Data analysis scripts and notebooks

## Contact for Support

If you need further assistance, please contact the development team at [your-email@example.com].
