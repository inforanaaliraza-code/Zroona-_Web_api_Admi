#!/usr/bin/env powershell
# MongoDB Setup Helper Script
# This script helps setup local MongoDB for development

Write-Host "🚀 MongoDB Development Setup Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is installed
Write-Host "📦 Checking MongoDB installation..." -ForegroundColor Yellow
$mongoInstalled = Get-Command mongod -ErrorAction SilentlyContinue

if ($null -eq $mongoInstalled) {
    Write-Host "❌ MongoDB not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "📥 Please install MongoDB:" -ForegroundColor Cyan
    Write-Host "   1. Go to: https://www.mongodb.com/try/download/community" -ForegroundColor Gray
    Write-Host "   2. Download MongoDB Community Server for Windows" -ForegroundColor Gray
    Write-Host "   3. Run the installer and follow the setup wizard" -ForegroundColor Gray
    Write-Host "   4. Re-run this script after installation" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host "✅ MongoDB is installed!" -ForegroundColor Green
Write-Host ""

# Create data directory
Write-Host "📁 Creating MongoDB data directory..." -ForegroundColor Yellow
if (-not (Test-Path "C:\data\db")) {
    New-Item -ItemType Directory -Path "C:\data\db" -Force | Out-Null
    Write-Host "✅ Directory created: C:\data\db" -ForegroundColor Green
} else {
    Write-Host "✅ Directory already exists: C:\data\db" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔧 Setup Complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update api/.env file:" -ForegroundColor Gray
Write-Host "   Set: MONGO_PREFER_FALLBACK=true" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Start MongoDB:" -ForegroundColor Gray
Write-Host "   mongod --dbpath ""C:\data\db""" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Start your application" -ForegroundColor Gray
Write-Host ""

# Ask if user wants to start MongoDB now
$startNow = Read-Host "Start MongoDB now? (y/n)"
if ($startNow -eq "y" -or $startNow -eq "Y") {
    Write-Host ""
    Write-Host "🟢 Starting MongoDB..." -ForegroundColor Green
    Write-Host "(This window will stay open. MongoDB runs in the background)" -ForegroundColor Gray
    Write-Host ""
    & mongod --dbpath "C:\data\db"
} else {
    Write-Host "⏭️  You can start MongoDB anytime with:" -ForegroundColor Yellow
    Write-Host "   mongod --dbpath ""C:\data\db""" -ForegroundColor Gray
}
