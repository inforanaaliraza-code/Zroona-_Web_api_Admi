# Fix for npm install with Special Characters in Path

## Problem
The folder path contains `&` character (`web & api & Admin`) which causes npm postinstall scripts to fail because Windows command line interprets `&` as a command separator.

## Error Message
```
npm error 'api' is not recognized as an internal or external command
Error: Cannot find module 'E:\chat\zuro\napi-postinstall\lib\cli.js'
```

## Solutions

### Solution 1: Use PowerShell Install Script (Recommended)
Run the provided PowerShell script that handles the path issues:

```powershell
.\install-packages.ps1
```

This script will:
1. Configure npm to use PowerShell for scripts
2. Try normal install first
3. Fall back to `--ignore-scripts` if needed

### Solution 2: Install with --ignore-scripts (Quick Fix)
Skip postinstall scripts that are causing issues:

```powershell
npm install --legacy-peer-deps --ignore-scripts
```

**Note:** This skips all postinstall scripts. The `unrs-resolver` package (used by eslint-import-resolver-typescript) will install but its postinstall script won't run. This is usually fine for development.

### Solution 3: Manual npm Config (One-time setup)
Set npm to use PowerShell for scripts:

```powershell
npm config set script-shell powershell.exe
npm install --legacy-peer-deps
```

### Solution 4: Use .npmrc file (Already Created)
An `.npmrc` file has been created in the `web` folder that configures npm to handle paths better. This should help with future installs.

## Verification
After installation, verify that packages are installed:

```powershell
npm list --depth=0
```

## Running the Application
Even if installation had warnings, the application should still work:

```powershell
# Development
.\run-dev.ps1
# or
npm run dev

# Production build
.\run-build.ps1
# or
npm run build
```

## Notes
- The `unrs-resolver` package is only used by `eslint-import-resolver-typescript` (a dev dependency)
- Skipping its postinstall script usually doesn't affect application functionality
- If you need full ESLint TypeScript resolution support, you may need to manually fix the path issue or use a different directory structure

