@echo off
echo Building the Agricultural Health Dashboard with our new Overview changes...
echo.

cd /d %~dp0

echo 1. Running TypeScript compiler...
call node node_modules\typescript\bin\tsc -b

echo.
echo 2. Building with Vite...
call node_modules\.bin\vite build

echo.
echo Build completed! Starting the dashboard...
call node_modules\.bin\vite preview
