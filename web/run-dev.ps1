# PowerShell wrapper script to handle paths with special characters
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Get the full path to node_modules/.bin
$nodeBinPath = Join-Path $scriptPath "node_modules\.bin"
$nextPath = Join-Path $scriptPath "node_modules\next\dist\bin\next"

# Run next dev directly using node
& node $nextPath dev

