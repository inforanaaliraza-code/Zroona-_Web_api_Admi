# Path Fix for Special Characters

## Problem
The folder path contains `&` character (`web & api & Admin`) which causes npm scripts to fail because Windows command line interprets `&` as a command separator.

## Solution

### Option 1: Use Updated package.json (Recommended)
The `package.json` has been updated to use direct node paths instead of npm scripts:
- `npm run dev` - Now uses `node ./node_modules/next/dist/bin/next dev`
- `npm run build` - Now uses `node ./node_modules/next/dist/bin/next build`
- `npm run start` - Now uses `node ./node_modules/next/dist/bin/next start`

### Option 2: Use PowerShell Scripts
PowerShell wrapper scripts have been created:
- `.\run-dev.ps1` - Run development server
- `.\run-build.ps1` - Build the project
- `.\run-start.ps1` - Start production server

To use these scripts:
```powershell
.\run-dev.ps1
```

### Option 3: Direct Node Command
You can also run commands directly:
```powershell
node .\node_modules\next\dist\bin\next dev
node .\node_modules\next\dist\bin\next build
node .\node_modules\next\dist\bin\next start
```

## Notes
- All solutions bypass npm's PATH resolution which was causing the issue
- The scripts work by directly calling node with the full path to the binaries
- This is a permanent fix that will work regardless of folder name

