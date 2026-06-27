@echo off
title FourWheels - Starting...
color 0A

echo.
echo  ================================================
echo   FOURWHEELS - Pakistan's Vehicle Marketplace
echo  ================================================
echo.

REM Backend folder me jao aur server start karo
echo  [1/2] Starting Backend Server...
cd /d "%~dp0backend"

REM Check karo node_modules exist karta hai
if not exist "node_modules" (
    echo  Installing dependencies...
    npm install
)

REM Backend ko background me start karo
start "FourWheels Backend" cmd /k "color 0A && title FourWheels Backend Server && echo Backend running on http://localhost:5000 && npm run dev"

REM Thoda wait karo server start hone ke liye
echo  Waiting for server to start...
timeout /t 3 /nobreak >nul

REM Frontend index.html open karo default browser me
echo  [2/2] Opening Frontend...
cd /d "%~dp0frontend"
start "" "index.html"

echo.
echo  ================================================
echo   Done! FourWheels is running.
echo   Backend  : http://localhost:5000
echo   Frontend : index.html opened in browser
echo  ================================================
echo.
echo  Close the Backend Server window to stop.
echo.
pause