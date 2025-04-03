@echo off
echo Building the Agricultural Health Dashboard...
echo.

echo 1. Running TypeScript compiler...
call node node_modules\typescript\bin\tsc -b

echo.
echo 2. Building with Vite...
call node_modules\.bin\vite build

echo.
echo Build completed! Files are available in the dist directory.
