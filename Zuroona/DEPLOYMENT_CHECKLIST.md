# Deployment Checklist - Passwordless Authentication

## Pre-Deployment Checklist

### Backend (API)

#### Environment Variables
- [ ] `MAILJS_PUBLIC_KEY` - Email service configured
- [ ] `MAILJS_PRIVATE_KEY` - Email service configured
- [ ] `MSEGAT_USERNAME` - SMS service configured
- [ ] `MSEGAT_PASSWORD` - SMS service configured
- [ ] `MSEGAT_SENDER_NAME` - SMS sender name configured
- [ ] `WEB_URL` - Frontend URL for email links
- [ ] `NODE_ENV` - Set to "production"
- [ ] `ALLOW_OTP_WITHOUT_SMS` - Set to "false" (production)

#### Database
- [ ] MongoDB connection string configured
- [ ] Database indexes created (if needed)
- [ ] Migration script run (if needed) for new fields:
  - `phone_verified`
  - `phone_verified_at`
  - `email_verified_at`
- [ ] Existing users migration (if needed)

#### Code Review
- [ ] All password fields made optional
- [ ] Dual verification logic implemented
- [ ] OTP service configured
- [ ] Email service configured
- [ ] Rate limiting enabled
- [ ] Error handling comprehensive
- [ ] Security measures in place

#### Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Load testing (if applicable)

---

### Frontend (Web)

#### Environment Variables
- [ ] `NEXT_PUBLIC_API_URL` - Backend API URL
- [ ] `NODE_ENV` - Set to "production"

#### Code Review
- [ ] Password fields removed from signup forms
- [ ] OTP verification flow implemented
- [ ] Verification status indicators added
- [ ] Error handling implemented
- [ ] Loading states implemented
- [ ] Responsive design verified

#### Testing
- [ ] Signup flow tested
- [ ] Login flow tested
- [ ] OTP verification tested
- [ ] Cross-browser testing
- [ ] Mobile device testing

---

## Deployment Steps

### 1. Backend Deployment

```bash
# 1. Pull latest code
git pull origin main

# 2. Install dependencies
npm install

# 3. Run database migrations (if any)
# Check if new fields need to be added to existing documents

# 4. Build (if needed)
# Node.js doesn't need build step, but check your setup

# 5. Restart server
pm2 restart api
# OR
systemctl restart zuroona-api
```

### 2. Frontend Deployment

```bash
# 1. Pull latest code
git pull origin main

# 2. Install dependencies
npm install

# 3. Build Next.js app
npm run build

# 4. Start/restart server
pm2 restart web
# OR
npm start
```

### 3. Database Migration (If Needed)

If you have existing users, you may need to:

```javascript
// Migration script (run once)
// Update existing users to have new fields

db.users.updateMany(
  { phone_verified: { $exists: false } },
  { 
    $set: { 
      phone_verified: false,
      phone_verified_at: null,
      email_verified_at: null
    } 
  }
);

db.organizers.updateMany(
  { phone_verified: { $exists: false } },
  { 
    $set: { 
      phone_verified: false,
      phone_verified_at: null,
      email_verified_at: null
    } 
  }
);
```

---

## Post-Deployment Verification

### 1. Smoke Tests
- [ ] Signup page loads
- [ ] Login page loads
- [ ] API endpoints respond
- [ ] Email service works
- [ ] SMS service works

### 2. Functional Tests
- [ ] New user can signup
- [ ] Email verification link works
- [ ] OTP is received via SMS
- [ ] OTP verification works
- [ ] Login with phone + OTP works

### 3. Monitoring
- [ ] Error logs monitored
- [ ] API response times normal
- [ ] Email delivery rate normal
- [ ] SMS delivery rate normal
- [ ] Database queries optimized

---

## Rollback Plan

If issues occur:

### Backend Rollback
```bash
# 1. Revert to previous commit
git revert HEAD
# OR
git checkout [previous-commit-hash]

# 2. Restart server
pm2 restart api
```

### Frontend Rollback
```bash
# 1. Revert to previous commit
git revert HEAD
# OR
git checkout [previous-commit-hash]

# 2. Rebuild and restart
npm run build
pm2 restart web
```

### Database Rollback
- Password field can remain optional (backward compatible)
- New fields can remain (won't break existing code)
- No destructive changes made

---

## Monitoring & Alerts

### Key Metrics to Monitor
1. **Signup Success Rate**
   - Track: Successful signups / Total signup attempts
   - Alert if: < 80%

2. **Verification Completion Rate**
   - Track: Fully verified accounts / Total signups
   - Alert if: < 60%

3. **OTP Delivery Rate**
   - Track: OTPs delivered / OTPs requested
   - Alert if: < 90%

4. **Email Delivery Rate**
   - Track: Emails delivered / Emails sent
   - Alert if: < 90%

5. **Login Success Rate**
   - Track: Successful logins / Login attempts
   - Alert if: < 85%

### Error Monitoring
- Monitor for 4xx/5xx errors
- Track OTP verification failures
- Track email verification failures
- Monitor rate limiting triggers

---

## Support Documentation

### For Users
- How to signup (no password needed)
- How to verify email
- How to verify phone (OTP)
- How to login (phone + OTP)
- Troubleshooting guide

### For Support Team
- Common issues and solutions
- How to verify user account status
- How to resend verification emails/OTPs
- How to check verification status in database

---

## Security Considerations

### Production Security
- [ ] HTTPS enabled
- [ ] Rate limiting enabled
- [ ] CORS configured properly
- [ ] Environment variables secured
- [ ] API keys not exposed
- [ ] Error messages don't leak information
- [ ] OTPs not logged in production
- [ ] Email tokens expire (24 hours)
- [ ] OTPs expire (5 minutes)

### Compliance
- [ ] GDPR compliance (if applicable)
- [ ] Data protection measures
- [ ] User consent for phone/email
- [ ] Privacy policy updated

---

## Performance Optimization

### Backend
- [ ] Database indexes on:
  - `email`
  - `phone_number` + `country_code`
  - `is_verified`
  - `phone_verified`
- [ ] OTP storage optimized (consider Redis for production)
- [ ] Email queue implemented (if high volume)

### Frontend
- [ ] Code splitting
- [ ] Image optimization
- [ ] Lazy loading
- [ ] Caching strategies

---

## Backup & Recovery

### Database Backup
- [ ] Regular backups configured
- [ ] Backup tested and verified
- [ ] Recovery procedure documented

### Code Backup
- [ ] Git repository backed up
- [ ] Deployment scripts documented
- [ ] Configuration files backed up

---

**Deployment Date**: [To be filled]
**Deployed By**: [To be filled]
**Version**: 1.0.0

