# 🚨 Quick Fix for ChunkLoadError

## ⚡ Fastest Solution (Do This First!)

### Step 1: Stop Dev Server
Press `Ctrl+C` in terminal

### Step 2: Run This Command in `web` folder:

**Windows PowerShell:**
```powershell
.\clear-cache.ps1
```

**Or Manual:**
```powershell
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules\.cache
```

**Git Bash/CMD:**
```bash
rm -rf .next
rm -rf node_modules/.cache
```

### Step 3: Restart
```bash
npm run dev
```

---

## ✅ That's It!

This error happens when Next.js build cache gets corrupted. Clearing `.next` folder fixes it 99% of the time.

---

## 🔄 If Still Not Working

1. **Check if port 3000 is free:**
   ```powershell
   netstat -ano | findstr :3000
   ```

2. **Try different port:**
   ```bash
   npm run dev -- -p 3001
   ```

3. **Full reinstall (last resort):**
   ```bash
   rm -rf node_modules
   npm install
   npm run dev
   ```

---

**Note:** I've also improved the Suspense fallback in `layout.js` to show a better loading state.

