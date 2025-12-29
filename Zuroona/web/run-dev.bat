@echo off
REM Batch file wrapper to run Next.js dev server
REM This handles paths with special characters better than PowerShell in some cases

cd /d "%~dp0"

REM Set environment variables
set NEXT_TELEMETRY_DISABLED=1
set NODE_ENV=development

REM Run next dev using node directly
node "%~dp0node_modules\next\dist\bin\next" dev

