# PowerShell script to check Python version and guide installation

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Python Version Checker" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check current Python version
$currentVersion = python --version 2>&1
Write-Host "Current Python version: $currentVersion" -ForegroundColor Yellow

# Check if Python 3.11 is available
Write-Host "`nChecking for Python 3.11..." -ForegroundColor Cyan

$python311 = $null
try {
    $version = & py -3.11 --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Python 3.11 found: $version" -ForegroundColor Green
        $python311 = $true
    }
} catch {
    $python311 = $false
}

if (-not $python311) {
    Write-Host "❌ Python 3.11 NOT found!" -ForegroundColor Red
    Write-Host "`nYou need to install Python 3.11 first.`n" -ForegroundColor Yellow
    Write-Host "Quick steps:" -ForegroundColor Cyan
    Write-Host "1. Download from: https://www.python.org/downloads/release/python-3119/" -ForegroundColor White
    Write-Host "2. Install it (check 'Add to PATH')" -ForegroundColor White
    Write-Host "3. Close and reopen PowerShell" -ForegroundColor White
    Write-Host "4. Run this script again`n" -ForegroundColor White
    Write-Host "See INSTALL_PYTHON311.md for detailed instructions.`n" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if current version is 3.11
if ($currentVersion -match "3\.11") {
    Write-Host "✅ You're using Python 3.11! Ready to install TensorFlow.`n" -ForegroundColor Green
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  pip install --upgrade pip" -ForegroundColor White
    Write-Host "  pip install -r requirements-windows.txt`n" -ForegroundColor White
} elseif ($currentVersion -match "3\.1[2-9]") {
    Write-Host "⚠️  You're using Python $($currentVersion -replace 'Python ', '')" -ForegroundColor Yellow
    Write-Host "TensorFlow requires Python 3.8-3.11.`n" -ForegroundColor Yellow
    Write-Host "To use Python 3.11, create a virtual environment:" -ForegroundColor Cyan
    Write-Host "  py -3.11 -m venv venv" -ForegroundColor White
    Write-Host "  .\venv\Scripts\Activate.ps1" -ForegroundColor White
    Write-Host "  pip install -r requirements-windows.txt`n" -ForegroundColor White
} else {
    Write-Host "Current version: $currentVersion" -ForegroundColor Yellow
    Write-Host "Python 3.11 is available. Use it in a virtual environment.`n" -ForegroundColor Cyan
}

Read-Host "Press Enter to exit"

