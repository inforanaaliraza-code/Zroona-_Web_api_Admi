# PowerShell wrapper script to handle paths with special characters
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Change to the script directory
Set-Location -LiteralPath $scriptPath

# Set environment variables
$env:NEXT_TELEMETRY_DISABLED = "1"
$env:NODE_ENV = "development"

# Get the path to next binary
$nextBin = Join-Path $scriptPath "node_modules\next\dist\bin\next"

# Verify the file exists
if (-not (Test-Path -LiteralPath $nextBin)) {
    Write-Host "Error: Next.js binary not found at $nextBin" -ForegroundColor Red
    exit 1
}

# Use Invoke-Expression with proper quoting to handle paths with special characters
$nodeExe = Get-Command node -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source
if (-not $nodeExe) {
    $nodeExe = "node"
}

# Run next dev - PowerShell's call operator handles paths correctly
Write-Host "Starting Next.js development server..." -ForegroundColor Green
& $nodeExe $nextBin dev

