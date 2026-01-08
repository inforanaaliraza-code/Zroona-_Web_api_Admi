# PowerShell script to run event creation tests
# This script will attempt to run the test automatically

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Event Creation Integration Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if backend is running
Write-Host "Checking if backend API is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3434/api/organizer/event/category/list?page=1&limit=1" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✓ Backend API is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Backend API is not running or not accessible" -ForegroundColor Red
    Write-Host "  Please start the backend API first: cd api && npm run dev" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

Write-Host ""

# Check if axios is installed in api folder
Write-Host "Checking dependencies..." -ForegroundColor Yellow
$apiPath = Join-Path $PSScriptRoot "api"
if (Test-Path (Join-Path $apiPath "node_modules\axios")) {
    Write-Host "✓ axios is installed" -ForegroundColor Green
} else {
    Write-Host "Installing axios..." -ForegroundColor Yellow
    Set-Location $apiPath
    npm install axios --no-save
    Set-Location $PSScriptRoot
    Write-Host "✓ axios installed" -ForegroundColor Green
}

Write-Host ""

# Check if test script exists
$testScript = Join-Path $PSScriptRoot "test-event-creation.js"
if (-not (Test-Path $testScript)) {
    Write-Host "✗ Test script not found: $testScript" -ForegroundColor Red
    exit 1
}

Write-Host "Running test script..." -ForegroundColor Yellow
Write-Host ""
Write-Host "NOTE: If you see token errors, you need to:" -ForegroundColor Yellow
Write-Host "  1. Set ORGANIZER_TOKEN environment variable, OR" -ForegroundColor Yellow
Write-Host "  2. Set ORGANIZER_EMAIL and ORGANIZER_PASSWORD for auto-login" -ForegroundColor Yellow
Write-Host ""

# Try to run the test
Set-Location $apiPath
node ..\test-event-creation.js

Write-Host ""
Write-Host "Test completed!" -ForegroundColor Cyan

