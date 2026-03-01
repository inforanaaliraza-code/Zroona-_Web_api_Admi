# Zuroona – Full Deployment Guide (End-to-End)

**Domains:**  
- Web: https://zuroona.sa/  
- Admin: https://admin.zuroona.sa/  
- API: https://api.zuroona.sa/  

Ye guide step-by-step hai: **kyun**, **kahan**, **kaise**, **kab** har step kiya jata hai. Zero knowledge assume karke likha gaya hai.

---

## Table of Contents

1. [Overview – Kya kya deploy hoga](#1-overview)
2. [Git branches – Kaun si branch kahan use hogi](#2-git-branches)
3. [VPS pe pehli baar setup](#3-vps-setup)
4. [Domain + SSL (HTTPS)](#4-domain--ssl-https)
5. [Project VPS pe kaise chalega (Docker + Nginx)](#5-project-vps-pe-kaise-chalega)
6. [Environment variables & secrets](#6-environment-variables--secrets)
7. [CI/CD – Push/merge par auto deploy](#7-cicd--auto-deploy)
8. [CodeRabbit – Code review](#8-coderabbit)
9. [Daily workflow – Local se live tak](#9-daily-workflow)
10. [Naye repo se start karna (optional)](#10-naye-repo-se-start-karna)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. Overview

### Kya kya deploy hoga?

| Part | Folder | Domain | Port (internal) |
|------|--------|--------|------------------|
| **Web** (public site) | `Zuroona/web/` | https://zuroona.sa/ | 3000 |
| **Admin** (admin panel) | `Zuroona/admin/` | https://admin.zuroona.sa/ | 3002 |
| **API** (backend) | `Zuroona/api/` | https://api.zuroona.sa/ | 3434 |
| **MongoDB** | (Docker container) | — | 27017 (internal only) |

### Kyun alag alag directories?

- **Web, Admin, API** teen alag apps hain (alag `package.json`). Production mein inhein alag containers/channels se serve karte hain taake:
  - Ek fail ho to doosra na ruke
  - Security aur logging alag ho sake
  - Domain-wise routing (zuroona.sa, admin.zuroona.sa, api.zuroona.sa) easy ho

### Flow short mein

- **Local:** Dev branch pe code likho → push.
- **Main branch:** Jab `develop` (ya feature branch) ko `main` pe merge karo → CI/CD automatically VPS pe deploy karega.
- **VPS pe:** Git pull + Docker build/up → Nginx in sabko domains se point karega + SSL (HTTPS).

---

## 2. Git branches

### Kaun si branch kahan use hogi?

| Branch | Kab use karein | Kya hota hai |
|--------|----------------|--------------|
| **main** | Live production code | Is branch pe push/merge hote hi CI/CD **live domains** pe deploy karta hai. |
| **develop** | Daily development | Yahan naya code push karte ho; test/staging ke liye. Jab theek ho, `develop` → `main` merge. |
| **feature/xyz** (optional) | Nayi feature | Feature complete → `feature/xyz` → `develop` merge. Phir `develop` → `main`. |

### Kyun aise?

- **main** = sirf stable, tested code. Isliye merge par hi live deploy.
- **develop** = sab latest dev work; yahan break ho to live affect nahi hota.
- **feature branches** = ek feature ek branch, taake code review (CodeRabbit) aur merge clean rahein.

### Kab kya karna hai?

- **Pehli baar:** Agar `develop` branch nahi hai to banao: `git checkout -b develop && git push -u origin develop`. Ab CI workflow `develop` pe push/PR pe chalega.
- **Naya kaam shuru:** `develop` se nayi branch banao: `git checkout develop && git pull && git checkout -b feature/login-fix`.
- **Feature complete:** PR banao `feature/login-fix` → `develop`. CodeRabbit review → merge.
- **Release / live karna:** PR banao `develop` → `main`. Merge hote hi CI/CD deploy karega.

---

## 3. VPS setup

### Kahan: Apna VPS (jo hosting buy ki hai)

### Kab: Ek baar, deployment se pehle

### Kyun: VPS pe hi app chalegi; isliye OS, Docker, Nginx, Git sab yahan setup karna hai.

### Kaise (step-by-step):

#### 3.1 VPS pe login (SSH)

- **Kahan:** Apne laptop/PC se Terminal/PowerShell.
- **Kaise:**  
  `ssh root@YOUR_VPS_IP`  
  (IP wahi jo hosting provider ne diya; password ya SSH key se login.)
- **Kyun:** VPS pe commands chalane ke liye.

#### 3.2 System update

```bash
apt update && apt upgrade -y
```

- **Kyun:** Security aur latest packages.

#### 3.3 Docker install

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

- **Kyun:** Hum app Docker containers se chalayenge (same jaise local `docker-compose`).

#### 3.4 Docker Compose install

```bash
apt install docker-compose-plugin -y
```

- **Kyun:** `docker-compose.yml` se sab services (api, web, admin, mongodb) ek saath.

#### 3.5 Nginx install

```bash
apt install nginx -y
```

- **Kyun:** Nginx:
  - **zuroona.sa** → web (port 3000)
  - **admin.zuroona.sa** → admin (port 3002)
  - **api.zuroona.sa** → api (port 3434)  
  + SSL (HTTPS) handle karega.

#### 3.6 Git install

```bash
apt install git -y
```

- **Kyun:** VPS pe repo clone/pull karke latest code lana.

#### 3.7 Project directory banao

```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git Zuroona
cd Zuroona
```

- **Kahan:** `/var/www/Zuroona` — saari app code yahi rahegi.
- **Kyun:** Ek fixed jagah; Nginx config mein yahi path use karenge.

#### 3.8 GitHub se VPS pe pull (private repo)

Agar repo **private** hai to VPS pe GitHub auth chahiye:

- **Option A – Deploy key (recommended):**  
  - VPS pe: `ssh-keygen -t ed25519 -C "vps-deploy" -f ~/.ssh/deploy_key -N ""`  
  - `cat ~/.ssh/deploy_key.pub` copy karo.  
  - GitHub → Repo → Settings → Deploy keys → Add key → paste.  
  - Repo clone:  
    `git clone git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git Zuroona`  
    (aur `~/.ssh/config` mein `Host github.com` ke under `IdentityFile ~/.ssh/deploy_key` set karo.)

- **Option B – Personal Access Token:**  
  - GitHub → Settings → Developer settings → Personal access tokens → Generate.  
  - Clone: `git clone https://TOKEN@github.com/USER/REPO.git Zuroona`

---

## 4. Domain + SSL (HTTPS)

### Kahan: VPS pe Nginx + Certbot

### Kab: Ek baar, jab domains VPS ki IP pe point ho chuke hon

### Kyun: Browser mein https://zuroona.sa, https://admin.zuroona.sa, https://api.zuroona.sa chalne ke liye.

### Kaise:

#### 4.1 Domain DNS (kahan: Domain provider panel)

- **zuroona.sa** → A record → VPS IP  
- **admin.zuroona.sa** → A record → same VPS IP  
- **api.zuroona.sa** → A record → same VPS IP  

Propagation 5–30 min lag sakta hai.

#### 4.2 Certbot (free SSL)

```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d zuroona.sa -d www.zuroona.sa -d admin.zuroona.sa -d api.zuroona.sa
```

- **Kyun:** Let’s Encrypt se free HTTPS certificate.
- **Kab:** Sirf ek baar; Certbot auto-renew set kar deta hai.

Nginx config Certbot khud update karta hai. Baad mein hum proxy rules add karenge (Section 5).

---

## 5. Project VPS pe kaise chalega (Docker + Nginx)

### Kahan: `/var/www/Zuroona`

### Kyun: Same `docker-compose.yml` jo local pe hai; VPS pe bhi wahi chalega. Nginx sirf reverse proxy hai (domain → sahi port).

### Kaise:

#### 5.1 Environment file (production secrets)

Repo ke root mein **`.env.example`** hai — usko copy karke VPS pe `.env` banao aur values bharo:

```bash
cd /var/www/Zuroona
cp .env.example .env
nano .env
```

Isme production values daalo (Section 6 dekho). Example structure:

```env
# API
API_PORT=3434
MONGODB_URI=mongodb://mongodb:27017/jeena
SECRET_KEY=your-production-secret
# ... baaki API + Web + Admin env vars
```

Save: `Ctrl+O`, Enter, `Ctrl+X`.

#### 5.2 Production URLs (env mein zaroor)

- **Web:**  
  `NEXT_PUBLIC_API_BASE_URL=https://api.zuroona.sa/api/`  
  `NEXT_PUBLIC_API_URL=https://api.zuroona.sa/api`
- **Admin:**  
  `NEXT_PUBLIC_API_BASE_URL=https://api.zuroona.sa/api/`  
  `NEXT_PUBLIC_API_ADMIN_BASE_URL=https://api.zuroona.sa/api/admin/`
- **API:**  
  `FRONTEND_URL=https://zuroona.sa`  
  `ADMIN_URL=https://admin.zuroona.sa`  
  `WEB_URL=https://zuroona.sa`

#### 5.3 Docker Compose (build & run)

```bash
cd /var/www/Zuroona
docker compose build --no-cache
docker compose up -d
```

- **Kyun:** Pehli baar images build karni hoti hain; `-d` background mein chalega.

#### 5.4 Nginx reverse proxy (har domain → sahi port)

Config files:

- **Web:** `/etc/nginx/sites-available/zuroona-web`  
- **Admin:** `/etc/nginx/sites-available/zuroona-admin`  
- **API:** `/etc/nginx/sites-available/zuroona-api`  

**Web (zuroona.sa → 3000):**

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name zuroona.sa www.zuroona.sa;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Admin (admin.zuroona.sa → 3002):**

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name admin.zuroona.sa;
    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**API (api.zuroona.sa → 3434):**

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name api.zuroona.sa;
    location / {
        proxy_pass http://127.0.0.1:3434;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable karo:

```bash
ln -sf /etc/nginx/sites-available/zuroona-web /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/zuroona-admin /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/zuroona-api /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

Phir Certbot dubara chalao taake in domains pe SSL lage (agar pehle nahi chala tha):

```bash
certbot --nginx -d zuroona.sa -d www.zuroona.sa -d admin.zuroona.sa -d api.zuroona.sa
```

Ab https://zuroona.sa, https://admin.zuroona.sa, https://api.zuroona.sa chalna chahiye.

---

## 6. Environment variables & secrets

### Kahan:

- **Local:** Har app ke folder mein `.env.local` (web, admin) aur `.env` (api). Git mein commit **mat** karo.
- **VPS:** `/var/www/Zuroona/.env` — sirf VPS pe; GitHub Secrets se bhi use kar sakte ho CI/CD ke liye.

### Kyun: API keys, DB URL, secrets git mein nahi aane chahiye; production alag values use karti hai.

### Kaise:

- **Web:** `web/.env.example` copy karke `web/.env.local` banao; production mein `NEXT_PUBLIC_*` ki values production API URL (https://api.zuroona.sa) rakho.
- **Admin:** Same idea; `NEXT_PUBLIC_API_BASE_URL` etc. production.
- **API:** `api/.env` — `MONGODB_URI`, `SECRET_KEY`, `FRONTEND_URL`, `ADMIN_URL`, AWS/S3, payment keys, etc.  
Root `docker-compose` jo `.env` use karta hai wahi VPS pe `/var/www/Zuroona/.env` mein hona chahiye.

CI/CD mein agar deploy time env inject karna ho to GitHub Secrets use karo (Section 7).

---

## 7. CI/CD – Auto deploy

### Kya hota hai:

- **develop** pe push → sirf build/lint (optional).
- **main** pe push (ya merge) → GitHub Actions VPS pe SSH karke `git pull` + `docker compose build && docker compose up -d` chalata hai.  
Isse **har merge to main = automatic live deploy**.

### Kahan: GitHub repo → Actions tab; workflow files `.github/workflows/` mein.

### Kab: Jab bhi `main` update hoti hai (merge/push).

### Kyun: Manual SSH karke pull/build/up har baar nahi karna; professional flow + galti kam.

### Kaise:

#### 7.1 GitHub Secrets (kahan: Repo → Settings → Secrets and variables → Actions)

Add:

- `VPS_HOST` — VPS IP (e.g. `123.45.67.89`)
- `VPS_USER` — SSH user (e.g. `root`)
- `VPS_SSH_KEY` — Private key (jo VPS pe login ke liye use karte ho).  
  Puri key paste karo (including `-----BEGIN ... KEY-----` and `-----END ... KEY-----`).

#### 7.2 Workflow file

`.github/workflows/deploy.yml` (ye repo mein add kiya gaya hai):

- **Trigger:** `push` to `main` (ya **workflow_dispatch** for manual run: Actions → Deploy to VPS → Run workflow).
- **Steps:**  
  1. GitHub Actions runner VPS pe SSH karta hai (secrets se VPS_HOST, VPS_USER, VPS_SSH_KEY).  
  2. VPS pe: `cd /var/www/Zuroona` → `git fetch origin main` → `git reset --hard origin/main` (taake VPS hamesha latest `main` se match kare).  
  3. `docker compose build --no-cache` → `docker compose up -d` (containers rebuild + restart).  

**Zaroori:** VPS pe repo pehle se clone hona chahiye (Section 3.7) aur **deploy key** GitHub pe add honi chahiye taake `git fetch origin main` bina password ke chal sake. Agar repo public hai to fetch bina key ke bhi chal jata hai.

Isse **kab** bhi `develop` → `main` merge karoge, **us waqt** live deploy ho jayega; naya upload manually nahi karna padega.

---

## 8. CodeRabbit

### Kya hai: GitHub pe PR par automatic code review (suggestions, best practices).

### Kahan: GitHub Marketplace → “CodeRabbit” → Install (repo ya account level).

### Kab: Jab bhi PR open/update karo.

### Kyun: Code quality, bugs, security tips; merge se pehle review mil jata hai.

### Kaise:

1. GitHub → Marketplace → CodeRabbit → Install.
2. Repo select karo.
3. Ab har PR par CodeRabbit comment karega.  
Koi alag workflow file tumhe likhni nahi; app khud PRs scan karta hai.

---

## 9. Daily workflow (local se live tak)

### Flow short mein:

1. **Local:** `develop` branch use karo (ya `feature/xyz`).
2. **Code:** Web/Admin/API jo change karna hai karo.
3. **Commit & push:**  
   `git add . && git commit -m "feat: login fix" && git push origin develop`
4. **PR (optional):** `develop` → `main` PR banao. CodeRabbit review dekho.
5. **Merge to main:** PR merge karo.  
   → GitHub Actions run hoga → VPS pe pull + docker build + up.  
   → Live sites (zuroona.sa, admin.zuroona.sa, api.zuroona.sa) update ho jayenge.

### Kab kya:

- **Naya feature:** `develop` se branch → code → PR to `develop` → merge.  
- **Release / go live:** PR `develop` → `main` → merge. Usi waqt deploy.

---

## 10. Naye repo se start karna (optional)

Agar tum **naya repo** bana kar ye project wahan shift karna chahte ho:

### Branches kitni aur kaun si:

- **main** — production; isi pe deploy trigger.
- **develop** — development; yahan daily push.

Optional: `staging` agar staging server alag ho.

### Kab kaise:

1. GitHub pe naya repo banao (empty).
2. Local project folder:  
   `git remote add origin https://github.com/USER/NEW_REPO.git`  
   `git push -u origin main`
3. `develop` banao:  
   `git checkout -b develop && git push -u origin develop`
4. GitHub → Settings → Default branch = `main` rakho.  
5. CI/CD ke liye `.github/workflows/deploy.yml` mein `main` trigger hai; VPS pe clone/pull **main** karo.  
6. CodeRabbit usi repo pe install karo.

Is setup ke baad: develop pe kaam → main merge → auto deploy; naya project upload manually nahi karna padega.

---

## 11. Troubleshooting

| Problem | Kahan dekho | Kaise fix |
|--------|-------------|-----------|
| Site open nahi ho rahi | VPS: `docker compose ps` | Sab containers “Up” hon. Nahi to `docker compose logs -f` |
| 502 Bad Gateway | Nginx + Docker | Ports 3000, 3002, 3434 VPS pe chal rahe hon: `curl -I http://127.0.0.1:3000` |
| API connect nahi ho raha | Browser / app logs | Web/Admin env mein `NEXT_PUBLIC_API_BASE_URL=https://api.zuroona.sa/api/` |
| SSL error | Certbot | `certbot renew --dry-run` |
| Deploy run hota hai par site purani | VPS pe code | SSH → `cd /var/www/Zuroona && git status && git pull` then `docker compose up -d --build` |
| GitHub Actions fail | Actions tab → failed run | Log dekho; zyada tar `VPS_SSH_KEY` ya path (`/var/www/Zuroona`) galat hota hai |

---

## Quick checklist (ek nazar mein)

- [ ] VPS: Docker, Docker Compose, Nginx, Git installed
- [ ] Domain DNS: zuroona.sa, admin.zuroona.sa, api.zuroona.sa → VPS IP
- [ ] SSL: Certbot se certificates
- [ ] Repo VPS pe clone (deploy key agar private repo)
- [ ] `/var/www/Zuroona/.env` production values ke sath
- [ ] Nginx configs: web (3000), admin (3002), api (3434) + enable + reload
- [ ] `docker compose up -d` se sab services up
- [ ] GitHub Secrets: VPS_HOST, VPS_USER, VPS_SSH_KEY
- [ ] `.github/workflows/deploy.yml` repo mein (main pe push → deploy)
- [ ] Branches: main = live, develop = dev; merge develop → main = deploy
- [ ] CodeRabbit: GitHub se install (optional but recommended)

Is guide ke hisaab se tum **kab, kahan, kaise, kyun** har step karenge — end-to-end professional deployment + CI/CD + local dev flow cover ho jata hai.
