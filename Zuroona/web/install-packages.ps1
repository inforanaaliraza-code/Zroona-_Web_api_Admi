# PowerShell script to handle npm install with paths containing special characters
# This script wraps npm install to handle the '&' character in the path

Write-Host "Installing npm packages (handling special characters in path)..." -ForegroundColor Cyan

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Set npm config to use PowerShell for scripts
npm config set script-shell powershell.exe

# Try normal install first
Write-Host "`nAttempting npm install with --legacy-peer-deps..." -ForegroundColor Yellow
$installResult = & npm install --legacy-peer-deps 2>&1

# Check if install succeeded
if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Installation completed successfully!" -ForegroundColor Green
    exit 0
}

# If install failed, try with --ignore-scripts
Write-Host "`n⚠️  Normal install failed. Trying with --ignore-scripts..." -ForegroundColor Yellow
Write-Host "Note: This will skip postinstall scripts which may affect some packages." -ForegroundColor Yellow

$ignoreScriptsResult = & npm install --legacy-peer-deps --ignore-scripts 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Installation completed with --ignore-scripts!" -ForegroundColor Green
    Write-Host "⚠️  Note: Postinstall scripts were skipped. Most packages should work fine." -ForegroundColor Yellow
    Write-Host "   If you encounter issues with eslint or other dev tools, you may need to" -ForegroundColor Yellow
    Write-Host "   reinstall the problematic packages manually." -ForegroundColor Yellow
    exit 0
} else {
    Write-Host "`n❌ Installation failed even with --ignore-scripts." -ForegroundColor Red
    Write-Host "Error output:" -ForegroundColor Red
    Write-Host $ignoreScriptsResult
    exit 1
}

