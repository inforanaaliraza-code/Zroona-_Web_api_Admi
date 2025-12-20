# PowerShell wrapper script to handle paths with special characters
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Get the full path to next
$nextPath = Join-Path $scriptPath "node_modules\next\dist\bin\next"

# Run next start directly using node
& node $nextPath start

