# PowerShell setup script for Windows
# This script helps set up the correct Python version for TensorFlow

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AttractiveNet API Setup for Windows" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python 3.11 is available
$python311 = $null

# Try python3.11
try {
    $version = & python3.11 --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        $python311 = "python3.11"
        Write-Host "Found Python 3.11!" -ForegroundColor Green
    }
} catch {}

# Try py launcher
if ($null -eq $python311) {
    try {
        $version = & py -3.11 --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            $python311 = "py -3.11"
            Write-Host "Found Python 3.11 via py launcher!" -ForegroundColor Green
        }
    } catch {}
}

if ($null -eq $python311) {
    Write-Host ""
    Write-Host "ERROR: Python 3.11 not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "TensorFlow requires Python 3.8-3.11." -ForegroundColor Yellow
    Write-Host "Your current Python version is too new." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please install Python 3.11 from: https://www.python.org/downloads/" -ForegroundColor Yellow
    Write-Host "Or use pyenv-win to manage multiple Python versions." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Creating virtual environment with Python 3.11..." -ForegroundColor Cyan
& $python311 -m venv venv

Write-Host ""
Write-Host "Activating virtual environment..." -ForegroundColor Cyan
& .\venv\Scripts\Activate.ps1

Write-Host ""
Write-Host "Upgrading pip..." -ForegroundColor Cyan
python -m pip install --upgrade pip

Write-Host ""
Write-Host "Installing requirements..." -ForegroundColor Cyan
pip install -r requirements-windows.txt

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "To activate the virtual environment in the future, run:" -ForegroundColor Yellow
Write-Host "  .\venv\Scripts\Activate.ps1" -ForegroundColor White
Write-Host ""
Write-Host "To start the API server, run:" -ForegroundColor Yellow
Write-Host "  python inference_api.py" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"

