# MongoDB Connection Fix - Setup Guide

## Issue
Your project is experiencing MongoDB connection errors:
```
MongoDB disconnected. Attempting to reconnect...
MongoDB connection attempt failed: querySrv ECONNREFUSED
```

This happens when your application cannot reach MongoDB Atlas cluster.

---

## Solution: Choose One Option

### ✅ Option 1: Use Local MongoDB (Recommended for Development)

Local MongoDB is the fastest solution and works entirely offline without internet.

#### Step 1: Download MongoDB Community Edition
- Download from: https://www.mongodb.com/try/download/community
- Select Windows and install

#### Step 2: Create Data Directory
Open PowerShell and run:
```powershell
mkdir C:\data\db
```

#### Step 3: Start MongoDB
Open PowerShell and run:
```powershell
mongod --dbpath "C:\data\db"
```

You should see: `[initandlisten] Waiting for connections on port 27017`

#### Step 4: Update `.env` file
Edit `api/.env` and change:
```dotenv
# Set this to true to use local MongoDB
MONGO_PREFER_FALLBACK=true
```

#### Step 5: Restart Your Application
Restart the API server. It will now connect to local MongoDB at:
```
mongodb://localhost:27017/zuroona
```

---

### ⚠️ Option 2: Fix MongoDB Atlas Connection (For Production/Cloud)

If you need to use MongoDB Atlas (cloud version):

#### Step 1: Login to MongoDB Atlas
- Go to: https://cloud.mongodb.com/v2
- Login with your credentials

#### Step 2: Whitelist Your IP Address
1. Click on **Network Access** from the left sidebar
2. Click **ADD IP ADDRESS**
3. Choose **Add Current IP Address** (auto-detects your IP)
4. Or manually enter your IP
5. Click **Confirm**

#### Step 3: Verify Connection String
1. Click on **Databases** 
2. Click **Connect** on your cluster
3. Click **Connect your application**
4. Copy the connection string
5. Make sure it matches in `api/.env`:
   ```dotenv
   MONGO_URI=mongodb+srv://faith55771_db_user:%40Rana55771@cluster0.exxdpul.mongodb.net/?appName=Cluster0
   MONGODB_URI=mongodb+srv://faith55771_db_user:%40Rana55771@cluster0.exxdpul.mongodb.net/?appName=Cluster0
   MONGO_PREFER_FALLBACK=false
   ```

#### Step 4: Restart Your Application

---

## Troubleshooting

### Local MongoDB Not Connecting
**Error:** `connect ECONNREFUSED 127.0.0.1:27017`

✅ **Solution:** 
- Make sure MongoDB is running: `mongod --dbpath "C:\data\db"`
- Check if port 27017 is available

### MongoDB Atlas Still Not Connecting
**Error:** `querySrv ECONNREFUSED _mongodb._tcp.cluster0...`

✅ **Solutions:**
1. **IP Whitelist Issue** - Go to MongoDB Atlas → Network Access → Check if your IP is listed
2. **Cluster Paused** - Go to MongoDB Atlas → Check if cluster is running
3. **Wrong Credentials** - Verify username and password in connection string
4. **Firewall/VPN** - Disable VPN or firewall rules blocking MongoDB port 27017

### Connection Timeout
**Error:** `Operation buffering timed out`

✅ **Solution:** Use local MongoDB (Option 1) which doesn't require network

---

## Environment Variables Reference

| Variable | Value | Purpose |
|----------|-------|---------|
| `MONGO_URI` | Connection string | Primary MongoDB URI (Atlas) |
| `MONGO_FALLBACK` | `mongodb://localhost:27017/zuroona` | Local MongoDB fallback |
| `MONGO_PREFER_FALLBACK` | `true` or `false` | Use fallback instead of primary |

---

## Testing Connection

### Test Local MongoDB
```bash
npm run script:debug-db
```

### Manual Test with MongoDB Compass
1. Download: https://www.mongodb.com/products/compass
2. Connection String: `mongodb://localhost:27017` (for local)
3. Click **Connect**

---

## Auto-Reconnection

The application now automatically:
- ✅ Detects when MongoDB is disconnected
- ✅ Attempts to reconnect every 5 seconds
- ✅ Retries up to 5 times before failing
- ✅ Logs helpful error messages with solutions

No manual restart needed!

---

## Need Help?

If issues persist:
1. Check the console output - it now shows detailed error messages with solutions
2. Ensure MongoDB is running (if using local)
3. Check your internet connection (if using Atlas)
4. Verify IP whitelist in MongoDB Atlas (if using Atlas)
