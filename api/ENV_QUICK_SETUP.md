# Quick .env Setup Guide

## Your .env File Should Contain:

```env
# ============================================
# Sentry Error Tracking (Already Configured)
# ============================================
SENTRY_DSN=https://0b9a0508554c83f26e4f17fceca22a09@o4510574507851776.ingest.us.sentry.io/4510574510604288

# ============================================
# CSRF Protection (REQUIRED - Generate Secret)
# ============================================
# Run this command to generate:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
COOKIE_SECRET=PASTE_GENERATED_SECRET_HERE

# ============================================
# Career Applications
# ============================================
ADMIN_EMAIL=info.rana.aliraza@gmail.com
CAREER_EMAIL=info.rana.aliraza@gmail.com

# ============================================
# Logging (Optional)
# ============================================
LOG_LEVEL=info
```

## Quick Steps:

### 1. Generate COOKIE_SECRET

Run this command in terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as `COOKIE_SECRET` value.

### 2. Add to .env File

Open your `.env` file and add/update these lines:

```env
# Sentry (Already configured in code, but you can add here too)
SENTRY_DSN=https://0b9a0508554c83f26e4f17fceca22a09@o4510574507851776.ingest.us.sentry.io/4510574510604288

# CSRF Protection (REQUIRED)
COOKIE_SECRET=your-generated-secret-from-step-1

# Career Applications
ADMIN_EMAIL=info.rana.aliraza@gmail.com
CAREER_EMAIL=info.rana.aliraza@gmail.com

# Logging
LOG_LEVEL=info
```

## Important Notes:

1. **Sentry DSN**: Already configured in code, but you can add to `.env` to override
2. **COOKIE_SECRET**: **REQUIRED** - Must be at least 32 characters
3. **ADMIN_EMAIL**: Used for career application notifications
4. **LOG_LEVEL**: Options: `error`, `warn`, `info`, `http`, `debug`

## Verification:

After adding these values, restart your server:
```bash
npm start
```

You should see:
- ✅ Sentry error tracking initialized
- 📊 Sentry Project ID: 4510574510604288
- ✅ MailJS credentials loaded successfully
- ✅ Winston logger initialized

---

**Note:** Sentry DSN is already hardcoded in `api/src/config/sentry.js`, so it will work even without adding to `.env`. But it's good practice to keep it in `.env` for easy management.

