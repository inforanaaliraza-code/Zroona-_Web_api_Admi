# Fix ChunkLoadError - Quick Solution

## 🔧 Solution Steps

### Step 1: Stop the Dev Server
Press `Ctrl+C` in the terminal where dev server is running

### Step 2: Clear Build Cache
Run these commands in `web` folder:

```bash
# Windows PowerShell
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules/.cache

# Or if using Git Bash/CMD
rm -rf .next
rm -rf node_modules/.cache
```

### Step 3: Restart Dev Server
```bash
npm run dev
```

---

## 🚨 If Still Not Working

### Option 1: Full Clean Rebuild
```bash
# Delete everything
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules/.cache

# Reinstall (optional, only if needed)
npm install

# Start fresh
npm run dev
```

### Option 2: Check Port Conflicts
Make sure port 3000 is not being used by another process:
```bash
# Windows - Check what's using port 3000
netstat -ano | findstr :3000

# Kill the process if needed
taskkill /PID <PID_NUMBER> /F
```

### Option 3: Try Different Port
```bash
# Edit package.json dev script to:
"dev": "node ./node_modules/next/dist/bin/next dev -p 3001"
```

---

## ✅ Prevention

This error usually happens when:
- Build cache gets corrupted
- Hot reload fails
- Network timeout during chunk loading

**Best Practice:** Always stop dev server properly (Ctrl+C) before closing terminal.

