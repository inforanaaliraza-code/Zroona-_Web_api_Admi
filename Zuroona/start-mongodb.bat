@echo off
REM MongoDB Startup Script for Windows
REM This script starts MongoDB with the proper data directory

echo.
echo ========================================
echo MongoDB Development Server Startup
echo ========================================
echo.

REM Check if mongod is available
where mongod >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: MongoDB is not installed or not in PATH
    echo.
    echo Please install MongoDB first:
    echo https://www.mongodb.com/try/download/community
    echo.
    pause
    exit /b 1
)

REM Create data directory if it doesn't exist
if not exist C:\data\db (
    echo Creating data directory: C:\data\db
    mkdir C:\data\db
    if %ERRORLEVEL% EQU 0 (
        echo ^[OK^] Directory created
    ) else (
        echo ^[ERROR^] Failed to create directory
        pause
        exit /b 1
    )
)

echo.
echo ^[OK^] Data directory: C:\data\db
echo.
echo Starting MongoDB...
echo Press Ctrl+C to stop MongoDB
echo.
echo ========================================
echo.

mongod --dbpath "C:\data\db"

pause
