# PowerShell script to set up a drive mapping for development
# This maps the current directory to Z: drive to avoid special character issues
# Run this script as Administrator

param(
    [string]$DriveLetter = "Z:"
)

Write-Host "Setting up drive mapping to avoid path issues..." -ForegroundColor Cyan

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$currentDrive = Get-PSDrive -Name ($DriveLetter.TrimEnd(':')) -ErrorAction SilentlyContinue

if ($currentDrive) {
    Write-Host "Drive $DriveLetter is already in use. Removing existing mapping..." -ForegroundColor Yellow
    subst "$DriveLetter" /D
    Start-Sleep -Seconds 1
}

Write-Host "Mapping $DriveLetter to: $scriptPath" -ForegroundColor Green
subst "$DriveLetter" "$scriptPath"

Write-Host ""
Write-Host "✅ Drive mapping created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "To use the mapped drive:" -ForegroundColor Cyan
Write-Host "  1. Navigate to: cd $DriveLetter" -ForegroundColor White
Write-Host "  2. Run: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Or use the provided scripts:" -ForegroundColor Cyan
Write-Host "  cd $DriveLetter" -ForegroundColor White
Write-Host "  .\run-dev.bat" -ForegroundColor White
Write-Host ""
Write-Host "To remove the mapping later, run:" -ForegroundColor Yellow
Write-Host "  subst $DriveLetter /D" -ForegroundColor White

