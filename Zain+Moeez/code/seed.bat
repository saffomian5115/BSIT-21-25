@echo off
title FourWheels - Seeding Database...
color 0E

echo.
echo  ================================================
echo   FOURWHEELS - Database Seeding Tool
echo  ================================================
echo.

REM Backend folder me jao aur seed script run karo
cd /d "%~dp0backend"

echo  [1/2] Installing dependencies (if needed)...
if not exist "node_modules" (
    npm install
)

echo  [2/2] Inserting sample data (users + vehicles)...
echo.
node scripts/seedData.js

echo.
if %ERRORLEVEL% EQU 0 (
    color 0A
    echo  ================================================
    echo   ✅ SEED DATA INSERTED SUCCESSFULLY!
    echo  ================================================
    echo.
    echo   Test Accounts (password: password123):
    echo   Admin  - admin@fourwheels.pk
    echo   Seller - ahmed@fourwheels.pk
    echo   Seller - sara@fourwheels.pk
    echo   Buyer  - ali@fourwheels.pk
    echo.
    echo   Total: 4 Users + 10 Vehicles
    echo  ================================================
) else (
    color 0C
    echo  ================================================
    echo   ❌ SEEDING FAILED!
    echo   Make sure MongoDB is running and .env file exists
    echo  ================================================
)

echo.
echo  Press any key to exit...
pause >nul
