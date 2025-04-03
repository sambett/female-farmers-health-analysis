@echo off
echo Starting Agricultural Health Dashboard Frontend...

REM Set the entry point to the simplified version
set VITE_ENTRY_POINT=src/main.simplified.tsx

REM Run the development server using direct path to vite
call node_modules\.bin\vite

pause
