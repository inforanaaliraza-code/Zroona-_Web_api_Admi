# Production Domains Setup Summary

## ✅ Completed Setup

آپ کے project میں production domains کا setup مکمل ہو گیا ہے۔

### 🌐 Production Domains

- **Web Application**: `https://zuroona.sa`
- **Admin Panel**: `https://admin.zuroona.sa`
- **API Server**: `https://api.zuroona.sa`

---

## 📝 Changes Made

### 1. Web Application (`web/src/until/index.js`)
- ✅ Production domain support added
- ✅ Automatic environment detection (development/production)
- ✅ Environment variable support (`NEXT_PUBLIC_API_BASE_URL`)

### 2. Admin Panel (`admin/src/until/index.js`)
- ✅ Production domain support added
- ✅ Automatic environment detection
- ✅ Environment variable support

### 3. API Server (`api/src/app.js`)
- ✅ CORS configuration updated with production domains
- ✅ All three domains added to allowed origins
- ✅ Security headers configured

### 4. Configuration Files Created
- ✅ `nginx.conf` - Nginx reverse proxy configuration
- ✅ `ecosystem.config.js` - PM2 process manager configuration
- ✅ `PRODUCTION_DEPLOYMENT_GUIDE.md` - Complete deployment guide
- ✅ `ENV_SETUP_GUIDE.md` - Environment variables guide

---

## 🚀 Quick Start

### Step 1: Environment Variables

ہر project کے لیے environment variables setup کریں:

**API** (`api/.env`):
```env
NODE_ENV=production
BASE_URL=https://api.zuroona.sa
FRONTEND_URL=https://zuroona.sa
ADMIN_URL=https://admin.zuroona.sa
```

**Web** (`web/.env.local`):
```env
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://api.zuroona.sa/api/
```

**Admin** (`admin/.env.local`):
```env
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://api.zuroona.sa/api/admin/
```

### Step 2: Build Applications

```bash
# Build Web
cd web
npm run build

# Build Admin
cd admin
npm run build
```

### Step 3: Setup Nginx

```bash
# Copy nginx config
sudo cp nginx.conf /etc/nginx/sites-available/zuroona
sudo ln -s /etc/nginx/sites-available/zuroona /etc/nginx/sites-enabled/

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

### Step 4: Start with PM2

```bash
# Start all applications
pm2 start ecosystem.config.js

# Save configuration
pm2 save
pm2 startup
```

---

## 📚 Documentation

مکمل تفصیلات کے لیے یہ files دیکھیں:

1. **PRODUCTION_DEPLOYMENT_GUIDE.md** - Complete deployment guide
2. **ENV_SETUP_GUIDE.md** - Environment variables setup
3. **nginx.conf** - Nginx configuration
4. **ecosystem.config.js** - PM2 configuration

---

## 🔧 How It Works

### Automatic Environment Detection

Code automatically development یا production detect کرتا ہے:

```javascript
// Development میں
BASE_API_URL = "http://localhost:3434/api/"

// Production میں
BASE_API_URL = "https://api.zuroona.sa/api/"
```

### Domain Routing

Nginx domain کے مطابق traffic route کرتا ہے:

- `zuroona.sa` → Web Application (Port 3000)
- `admin.zuroona.sa` → Admin Panel (Port 3001)
- `api.zuroona.sa` → API Server (Port 3434)

---

## ⚠️ Important Notes

1. **SSL Certificates**: Production میں SSL certificates ضروری ہیں
2. **Environment Variables**: Production values `.env` files میں set کریں
3. **Build Before Deploy**: Web اور Admin کو deploy سے پہلے build کریں
4. **CORS**: API CORS میں production domains شامل ہیں
5. **Security**: `.env` files کو git میں commit نہ کریں

---

## 🐛 Troubleshooting

### Application Not Connecting to API

1. Check environment variables
2. Verify `NEXT_PUBLIC_API_BASE_URL` is set correctly
3. Check browser console for CORS errors

### CORS Errors

1. Verify API CORS configuration includes your domain
2. Check `FRONTEND_URL` and `ADMIN_URL` in API `.env`
3. Ensure domains match exactly (including `https://`)

### Nginx Not Routing Correctly

1. Check nginx configuration: `sudo nginx -t`
2. Verify domain DNS points to server IP
3. Check nginx logs: `sudo tail -f /var/log/nginx/error.log`

---

## 📞 Support

اگر آپ کو کوئی مسئلہ درپیش ہو:

1. `PRODUCTION_DEPLOYMENT_GUIDE.md` دیکھیں
2. PM2 logs چیک کریں: `pm2 logs`
3. Nginx logs چیک کریں: `sudo tail -f /var/log/nginx/*.log`
4. Environment variables verify کریں

---

**نوٹ**: Development میں localhost URLs استعمال ہوں گی، production میں automatically production domains استعمال ہوں گی۔
