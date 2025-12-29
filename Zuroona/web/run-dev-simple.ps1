# Simple PowerShell script to run Next.js dev server
# This script handles paths with special characters by using proper quoting

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Change to the script directory
Set-Location -LiteralPath $scriptPath

# Set environment variables
$env:NEXT_TELEMETRY_DISABLED = "1"
$env:NODE_ENV = "development"

# Get the path to next binary
$nextBin = Join-Path $scriptPath "node_modules\next\dist\bin\next"

# Verify the file exists
if (-not (Test-Path $nextBin)) {
    Write-Host "Error: Next.js binary not found at $nextBin" -ForegroundColor Red
    exit 1
}

# Run next dev - PowerShell's & operator handles paths with spaces correctly
Write-Host "Starting Next.js development server..." -ForegroundColor Green
& node $nextBin dev

