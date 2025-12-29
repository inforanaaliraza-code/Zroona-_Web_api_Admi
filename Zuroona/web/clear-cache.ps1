# PowerShell script to clear Next.js cache
# Run this script if you get ChunkLoadError

Write-Host "Clearing Next.js build cache..." -ForegroundColor Yellow

# Remove .next folder
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "✓ Removed .next folder" -ForegroundColor Green
} else {
    Write-Host "⚠ .next folder not found" -ForegroundColor Yellow
}

# Remove node_modules cache
if (Test-Path "node_modules\.cache") {
    Remove-Item -Recurse -Force "node_modules\.cache"
    Write-Host "✓ Removed node_modules/.cache" -ForegroundColor Green
} else {
    Write-Host "⚠ node_modules/.cache not found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Cache cleared! Now run: npm run dev" -ForegroundColor Green

