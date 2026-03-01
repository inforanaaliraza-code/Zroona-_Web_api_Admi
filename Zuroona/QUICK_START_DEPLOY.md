# Zuroona – Deploy Quick Start (Very Easy)

Sab kuch order mein — step 1 se last tak follow karo.

---

## Step 1: GitHub pe branch banao (2 min)

```bash
git checkout -b develop
git push -u origin develop
```

---

## Step 2: VPS pe login karo

```bash
ssh root@YOUR_VPS_IP
```

(Password ya SSH key se login.)

---

## Step 3: VPS pe Docker + Nginx + Git install karo

```bash
apt update && apt upgrade -y
curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh
apt install -y docker-compose-plugin nginx git
```

---

## Step 4: Domain DNS set karo

Apne domain panel mein (jahan se domains buy kiye):

| Domain | Type | Value |
|--------|------|--------|
| zuroona.sa | A | VPS_IP |
| admin.zuroona.sa | A | VPS_IP |
| api.zuroona.sa | A | VPS_IP |

(5–15 min wait for DNS.)

---

## Step 5: Project VPS pe clone karo

**Agar repo public hai:**

```bash
mkdir -p /var/www && cd /var/www
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git Zuroona
cd Zuroona
```

**Agar repo private hai:** pehle VPS pe SSH key banao, GitHub repo → Settings → Deploy keys → add karo, phir:

```bash
git clone git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git Zuroona
cd Zuroona
```

---

## Step 6: VPS pe .env banao

```bash
cd /var/www/Zuroona
cp .env.example .env
nano .env
```

Minimum ye set karo (baaki apne hisaab se):

- `MONGODB_URI=mongodb://mongodb:27017/jeena`
- `SECRET_KEY=koi-lambi-random-secret-key-32-chars`
- `NEXT_PUBLIC_API_BASE_URL=https://api.zuroona.sa/api/`
- `NEXT_PUBLIC_API_URL=https://api.zuroona.sa/api`
- `FRONTEND_URL=https://zuroona.sa`
- `ADMIN_URL=https://admin.zuroona.sa`
- `WEB_URL=https://zuroona.sa`
- AWS/S3 keys agar use ho rahe hon

Save: `Ctrl+O`, Enter, `Ctrl+X`.

---

## Step 7: Docker se sab run karo

```bash
cd /var/www/Zuroona
docker compose build --no-cache
docker compose up -d
```

2–5 min lag sakta hai. Check: `docker compose ps` — sab "Up" dikhna chahiye.

---

## Step 8: Nginx config (domain → app)

```bash
# Web
cat > /etc/nginx/sites-available/zuroona-web << 'EOF'
server {
    listen 80;
    server_name zuroona.sa www.zuroona.sa;
    location / { proxy_pass http://127.0.0.1:3000; proxy_http_version 1.1; proxy_set_header Host $host; proxy_set_header X-Real-IP $remote_addr; proxy_set_header X-Forwarded-Proto $scheme; }
}
EOF

# Admin
cat > /etc/nginx/sites-available/zuroona-admin << 'EOF'
server {
    listen 80;
    server_name admin.zuroona.sa;
    location / { proxy_pass http://127.0.0.1:3002; proxy_http_version 1.1; proxy_set_header Host $host; proxy_set_header X-Real-IP $remote_addr; proxy_set_header X-Forwarded-Proto $scheme; }
}
EOF

# API
cat > /etc/nginx/sites-available/zuroona-api << 'EOF'
server {
    listen 80;
    server_name api.zuroona.sa;
    location / { proxy_pass http://127.0.0.1:3434; proxy_http_version 1.1; proxy_set_header Host $host; proxy_set_header X-Real-IP $remote_addr; proxy_set_header X-Forwarded-Proto $scheme; }
}
EOF

# Enable
ln -sf /etc/nginx/sites-available/zuroona-web /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/zuroona-admin /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/zuroona-api /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

---

## Step 9: SSL (HTTPS) lagaao

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d zuroona.sa -d www.zuroona.sa -d admin.zuroona.sa -d api.zuroona.sa
```

Prompts follow karo (email do). Done.

---

## Step 10: Auto deploy (CI/CD) — jab main pe merge karo tab auto deploy

**GitHub:** Repo → **Settings → Secrets and variables → Actions** → New repository secret (3 alag):

| Name | Value |
|------|--------|
| `VPS_HOST` | VPS ka IP |
| `VPS_USER` | `root` (ya jo user use karte ho) |
| `VPS_SSH_KEY` | VPS login wali **private** SSH key (poori copy-paste) |

Ab jab bhi **main** branch pe code merge hoga, GitHub Actions khud VPS pe deploy kar dega. Kuch extra mat karo.

---

## Done

- **Web:** https://zuroona.sa  
- **Admin:** https://admin.zuroona.sa  
- **API:** https://api.zuroona.sa  

---

## Baad mein: code update kaise?

1. Local pe **develop** pe kaam karo → `git push origin develop`
2. Jab release karna ho: **develop → main** PR banao → merge
3. Merge hote hi auto deploy (Step 10 ki wajah se)

---

## Problem?

- Site nahi khul rahi → `docker compose ps` (sab Up?) aur `docker compose logs -f`
- 502 → ports check: `curl -I http://127.0.0.1:3000` (3000, 3002, 3434)
