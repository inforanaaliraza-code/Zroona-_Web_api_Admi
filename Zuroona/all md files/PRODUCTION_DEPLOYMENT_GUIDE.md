# Zuroona Production Deployment Guide

یہ گائیڈ آپ کو VPS سرور پر Zuroona application کو production domains کے ساتھ deploy کرنے میں مدد کرے گی۔

## Production Domains

- **Web Application**: `https://zuroona.sa`
- **Admin Panel**: `https://admin.zuroona.sa`
- **API Server**: `https://api.zuroona.sa`

---

## Prerequisites

1. VPS Server (Ubuntu 20.04+ recommended)
2. Domain names configured with DNS pointing to your VPS IP
3. SSL Certificates (Let's Encrypt recommended)
4. Node.js 18+ installed
5. MongoDB database (local or cloud)
6. Nginx installed

---

## Step 1: Server Setup

### Install Required Software

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install MongoDB (if using local database)
# Follow MongoDB installation guide for your OS
```

---

## Step 2: SSL Certificates Setup

### Using Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificates for all domains
sudo certbot certonly --nginx -d zuroona.sa -d www.zuroona.sa
sudo certbot certonly --nginx -d admin.zuroona.sa
sudo certbot certonly --nginx -d api.zuroona.sa

# Auto-renewal (already configured by certbot)
sudo certbot renew --dry-run
```

### Manual SSL Certificate Setup

اگر آپ اپنے SSL certificates استعمال کر رہے ہیں:

1. Certificates کو یہاں رکھیں:
   - `/etc/ssl/certs/zuroona.sa.crt`
   - `/etc/ssl/private/zuroona.sa.key`
   - `/etc/ssl/certs/admin.zuroona.sa.crt`
   - `/etc/ssl/private/admin.zuroona.sa.key`
   - `/etc/ssl/certs/api.zuroona.sa.crt`
   - `/etc/ssl/private/api.zuroona.sa.key`

---

## Step 3: Application Deployment

### 3.1 Clone/Upload Project

```bash
# Create application directory
sudo mkdir -p /var/www/zuroona
cd /var/www/zuroona

# Clone your repository or upload files
# git clone https://your-repo-url.git .
```

### 3.2 API Setup

```bash
cd /var/www/zuroona/api

# Install dependencies
npm install --production

# Create .env file from example
cp .env.example .env
nano .env  # Edit with your production values

# Important environment variables:
# NODE_ENV=production
# PORT=3434
# BASE_URL=https://api.zuroona.sa
# FRONTEND_URL=https://zuroona.sa
# ADMIN_URL=https://admin.zuroona.sa
# MONGODB_URI=your_mongodb_connection_string
```

### 3.3 Web Application Setup

```bash
cd /var/www/zuroona/web

# Install dependencies
npm install --production

# Create .env.local file
cp .env.example .env.local
nano .env.local  # Edit with production values

# Important environment variables:
# NODE_ENV=production
# NEXT_PUBLIC_API_BASE_URL=https://api.zuroona.sa/api/
# NEXT_PUBLIC_API_URL=https://api.zuroona.sa/api/

# Build the application
npm run build
```

### 3.4 Admin Panel Setup

```bash
cd /var/www/zuroona/admin

# Install dependencies
npm install --production

# Create .env.local file
cp .env.example .env.local
nano .env.local  # Edit with production values

# Important environment variables:
# NODE_ENV=production
# NEXT_PUBLIC_API_BASE_URL=https://api.zuroona.sa/api/admin/
# NEXT_PUBLIC_API_BASE=https://api.zuroona.sa/api/admin/

# Build the application
npm run build
```

---

## Step 4: Nginx Configuration

### 4.1 Copy Nginx Configuration

```bash
# Copy the nginx configuration
sudo cp /var/www/zuroona/nginx.conf /etc/nginx/sites-available/zuroona

# Update SSL certificate paths in nginx.conf if using Let's Encrypt
# Let's Encrypt certificates are usually at:
# /etc/letsencrypt/live/domain-name/fullchain.pem
# /etc/letsencrypt/live/domain-name/privkey.pem

# Enable the site
sudo ln -s /etc/nginx/sites-available/zuroona /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### 4.2 Update SSL Paths in nginx.conf (if using Let's Encrypt)

اگر آپ Let's Encrypt استعمال کر رہے ہیں، تو nginx.conf میں SSL paths update کریں:

```nginx
# For zuroona.sa
ssl_certificate /etc/letsencrypt/live/zuroona.sa/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/zuroona.sa/privkey.pem;

# For admin.zuroona.sa
ssl_certificate /etc/letsencrypt/live/admin.zuroona.sa/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/admin.zuroona.sa/privkey.pem;

# For api.zuroona.sa
ssl_certificate /etc/letsencrypt/live/api.zuroona.sa/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/api.zuroona.sa/privkey.pem;
```

---

## Step 5: Start Applications with PM2

### 5.1 Create PM2 Ecosystem File

Create `/var/www/zuroona/ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'zuroona-api',
      cwd: '/var/www/zuroona/api',
      script: 'src/app.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3434
      },
      error_file: '/var/log/pm2/api-error.log',
      out_file: '/var/log/pm2/api-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G'
    },
    {
      name: 'zuroona-web',
      cwd: '/var/www/zuroona/web',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/pm2/web-error.log',
      out_file: '/var/log/pm2/web-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G'
    },
    {
      name: 'zuroona-admin',
      cwd: '/var/www/zuroona/admin',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: '/var/log/pm2/admin-error.log',
      out_file: '/var/log/pm2/admin-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G'
    }
  ]
};
```

### 5.2 Start Applications

```bash
# Start all applications
pm2 start /var/www/zuroona/ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Follow the instructions shown by PM2
```

---

## Step 6: Firewall Configuration

```bash
# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow SSH (if not already allowed)
sudo ufw allow 22/tcp

# Enable firewall
sudo ufw enable
```

---

## Step 7: DNS Configuration

آپ کے domain registrar میں DNS records setup کریں:

### A Records
```
zuroona.sa          A    YOUR_VPS_IP
www.zuroona.sa      A    YOUR_VPS_IP
admin.zuroona.sa    A    YOUR_VPS_IP
api.zuroona.sa      A    YOUR_VPS_IP
```

---

## Step 8: Verification

### Check Application Status

```bash
# Check PM2 status
pm2 status

# Check PM2 logs
pm2 logs

# Check Nginx status
sudo systemctl status nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/zuroona-*-error.log
```

### Test URLs

1. **Web Application**: https://zuroona.sa
2. **Admin Panel**: https://admin.zuroona.sa
3. **API Health Check**: https://api.zuroona.sa/api/health
4. **API Info**: https://api.zuroona.sa/

---

## Step 9: Monitoring & Maintenance

### PM2 Commands

```bash
# View logs
pm2 logs

# Restart all applications
pm2 restart all

# Restart specific application
pm2 restart zuroona-api

# Stop application
pm2 stop zuroona-api

# Delete application from PM2
pm2 delete zuroona-api

# Monitor resources
pm2 monit
```

### Update Application

```bash
# Pull latest code
cd /var/www/zuroona
git pull origin main

# Update API
cd api
npm install --production
pm2 restart zuroona-api

# Update Web
cd ../web
npm install --production
npm run build
pm2 restart zuroona-web

# Update Admin
cd ../admin
npm install --production
npm run build
pm2 restart zuroona-admin
```

---

## Troubleshooting

### Application Not Starting

1. Check PM2 logs: `pm2 logs`
2. Check environment variables in `.env` files
3. Verify ports are not in use: `sudo netstat -tulpn | grep :3434`

### Nginx Errors

1. Test configuration: `sudo nginx -t`
2. Check error logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify SSL certificates: `sudo certbot certificates`

### CORS Errors

1. Verify API CORS configuration in `api/src/app.js`
2. Check `FRONTEND_URL` and `ADMIN_URL` in API `.env`
3. Ensure domains match exactly (including https://)

### SSL Certificate Issues

1. Renew certificates: `sudo certbot renew`
2. Check certificate expiry: `sudo certbot certificates`
3. Reload nginx after renewal: `sudo systemctl reload nginx`

---

## Security Checklist

- [ ] SSL certificates installed and auto-renewing
- [ ] Firewall configured (only 80, 443, 22 open)
- [ ] Strong passwords for database and services
- [ ] Environment variables secured (not in git)
- [ ] PM2 running with proper user permissions
- [ ] Nginx security headers configured
- [ ] Regular backups configured
- [ ] Monitoring and logging enabled

---

## Support

اگر آپ کو کوئی مسئلہ درپیش ہو تو:
1. PM2 logs چیک کریں
2. Nginx logs چیک کریں
3. Application logs چیک کریں
4. Environment variables verify کریں

---

**نوٹ**: یہ configuration production کے لیے ہے۔ Development میں localhost URLs استعمال کریں۔
