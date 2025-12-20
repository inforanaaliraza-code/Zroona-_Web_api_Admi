# PowerShell wrapper script to handle paths with special characters
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Get the full path to nodemon
$nodemonPath = Join-Path $scriptPath "node_modules\nodemon\bin\nodemon.js"

# Run nodemon directly using node
& node $nodemonPath src/app.js

