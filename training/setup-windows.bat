@echo off
REM Setup script for Windows to create Python 3.11 virtual environment
REM This script helps set up the correct Python version for TensorFlow

echo ========================================
echo AttractiveNet API Setup for Windows
echo ========================================
echo.

REM Check if Python 3.11 is available
python3.11 --version >nul 2>&1
if %errorlevel% == 0 (
    echo Found Python 3.11!
    set PYTHON_CMD=python3.11
    goto :create_venv
)

REM Check if py launcher can find Python 3.11
py -3.11 --version >nul 2>&1
if %errorlevel% == 0 (
    echo Found Python 3.11 via py launcher!
    set PYTHON_CMD=py -3.11
    goto :create_venv
)

echo.
echo ERROR: Python 3.11 not found!
echo.
echo TensorFlow requires Python 3.8-3.11.
echo Your current Python version is too new.
echo.
echo Please install Python 3.11 from: https://www.python.org/downloads/
echo Or use pyenv-win to manage multiple Python versions.
echo.
pause
exit /b 1

:create_venv
echo.
echo Creating virtual environment with Python 3.11...
%PYTHON_CMD% -m venv venv

echo.
echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Upgrading pip...
python -m pip install --upgrade pip

echo.
echo Installing requirements...
pip install -r requirements-windows.txt

echo.
echo ========================================
echo Setup complete!
echo ========================================
echo.
echo To activate the virtual environment in the future, run:
echo   venv\Scripts\activate
echo.
echo To start the API server, run:
echo   python inference_api.py
echo.
pause

