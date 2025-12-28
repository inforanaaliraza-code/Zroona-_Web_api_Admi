# Booking Flow Test Runner Script (PowerShell)
# This script runs the booking flow tests on Windows

Write-Host "🚀 Starting Booking Flow Tests..." -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if API server is running
Write-Host "📡 Checking if API server is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3434/health" -Method GET -TimeoutSec 2 -ErrorAction Stop
    Write-Host "✅ API server is running" -ForegroundColor Green
} catch {
    Write-Host "⚠️  API server might not be running. Starting tests anyway..." -ForegroundColor Yellow
}

# Run the test script
Write-Host ""
Write-Host "🧪 Running tests..." -ForegroundColor Cyan
Write-Host ""

node test-booking-flow.js

# Capture exit code
$EXIT_CODE = $LASTEXITCODE

Write-Host ""
if ($EXIT_CODE -eq 0) {
    Write-Host "✅ All tests passed!" -ForegroundColor Green
} else {
    Write-Host "❌ Some tests failed. Check the output above for details." -ForegroundColor Red
}

exit $EXIT_CODE

