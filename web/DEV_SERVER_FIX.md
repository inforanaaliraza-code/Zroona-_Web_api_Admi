# Fix for Running Next.js Dev Server with Special Characters in Path

## Problem
When running `npm run dev`, Next.js tries to download SWC package and fails because the path contains `&` character (`web & api & Admin`), which Windows interprets as a command separator.

## Error Message
```
'api' is not recognized as an internal or external command
Error: Cannot find module 'E:\chat\zuro\npm\bin\npm-cli.js'
```

## Solutions

### Solution 1: Use Batch File (Recommended)
Use the provided `run-dev.bat` file:

```cmd
run-dev.bat
```

This batch file handles paths with special characters better than PowerShell in some cases.

### Solution 2: Use PowerShell Script
Use the provided PowerShell script:

```powershell
.\run-dev.ps1
```

Or the simplified version:

```powershell
.\run-dev-simple.ps1
```

### Solution 3: Use Drive Mapping (Best for Long-term)
Map the directory to a drive letter without special characters:

```powershell
# In PowerShell (Run as Administrator)
subst Z: "E:\chat\zuro\web & api & Admin\web"

# Then navigate and run
cd Z:
npm run dev

# When done, remove the mapping
subst Z: /D
```

### Solution 4: Direct Node Command
Run Next.js directly without npm:

```powershell
node .\node_modules\next\dist\bin\next dev
```

## Notes
- The issue occurs because Next.js internally tries to use npm to download SWC binaries
- The `&` character in the path causes Windows command line to split the command
- All solutions bypass npm's script execution which avoids the path parsing issue

