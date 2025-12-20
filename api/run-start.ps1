# PowerShell wrapper script to handle paths with special characters
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Run node directly
& node src/app.js

