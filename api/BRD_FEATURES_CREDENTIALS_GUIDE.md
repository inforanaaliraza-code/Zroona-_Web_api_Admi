# BRD Features Implementation - Credentials Guide

This guide provides information on all credentials and configurations needed for the newly implemented BRD features.

## Table of Contents
1. [Sentry Error Tracking](#sentry-error-tracking)
2. [Rate Limiting](#rate-limiting)
3. [CSRF Protection](#csrf-protection)
4. [Enhanced Security Headers](#enhanced-security-headers)
5. [Career Applications](#career-applications)
6. [Enhanced Event Filters](#enhanced-event-filters)
7. [Enhanced Logging](#enhanced-logging)

---

## 1. Sentry Error Tracking

### Overview
Sentry provides real-time error tracking and monitoring for production applications.

### How to Obtain Credentials

1. **Create Sentry Account**
   - Visit [https://sentry.io](https://sentry.io)
   - Sign up for a free account or log in

2. **Create a New Project**
   - Go to **Projects** → **Create Project**
   - Select **Node.js** as the platform
   - Choose a project name (e.g., "Zuroona API")

3. **Get DSN (Data Source Name)**
   - After creating the project, you'll see the DSN
   - It looks like: `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`
   - Copy this DSN

### Environment Variables

Add to your `.env` file:

```env
# Sentry Error Tracking
SENTRY_DSN=https://0b9a0508554c83f26e4f17fceca22a09@o4510574507851776.ingest.us.sentry.io/4510574510604288
```

**Note:** DSN is already configured in code, but you can override it with environment variable.

### Configuration

- **Development:** Full error tracking (100% of errors)
- **Production:** 10% error sampling (configurable)

### Features
- Automatic error capture
- Unhandled promise rejection tracking
- Uncaught exception tracking
- Performance monitoring
- Release tracking

### Cost
- **Free Tier:** 5,000 events/month
- **Paid Plans:** Start at $26/month

---

## 2. Rate Limiting

### Overview
Rate limiting prevents API abuse by limiting requests from a single IP address.

### Configuration

No external credentials needed. Configured via environment variables:

```env
# Rate Limiting (optional - uses defaults if not set)
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes in milliseconds
RATE_LIMIT_MAX_REQUESTS=100  # Max requests per window
```

### Rate Limits Applied

1. **General API:** 100 requests per 15 minutes
2. **Authentication:** 5 requests per 15 minutes
3. **OTP Requests:** 5 requests per hour
4. **File Uploads:** 20 uploads per 15 minutes

### Customization

Edit `api/src/middleware/rateLimiter.js` to adjust limits.

---

## 3. CSRF Protection

### Overview
CSRF (Cross-Site Request Forgery) protection prevents unauthorized actions.

### Configuration

Add to your `.env` file:

```env
# CSRF Protection
COOKIE_SECRET=your-secret-key-change-in-production-min-32-chars
```

### How to Generate Secret Key

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Features
- Automatic CSRF token generation
- Token validation for state-changing operations
- Skipped for API endpoints with JWT authentication
- Skipped for webhook endpoints

### Testing
- CSRF tokens are automatically generated
- Include token in requests: `X-CSRF-Token` header or `_csrf` in body

---

## 4. Enhanced Security Headers

### Overview
Enhanced security headers protect against various attacks.

### Configuration

No external credentials needed. Configured via Helmet middleware.

### Security Headers Applied

1. **Content Security Policy (CSP)**
   - Restricts resource loading
   - Prevents XSS attacks

2. **HTTP Strict Transport Security (HSTS)**
   - Forces HTTPS connections
   - 1 year max age

3. **XSS Protection**
   - Browser XSS filter enabled

4. **No Sniff**
   - Prevents MIME type sniffing

5. **Frame Guard**
   - Prevents clickjacking attacks

6. **Referrer Policy**
   - Controls referrer information

### Customization

Edit `api/src/app.js` helmet configuration to adjust headers.

---

## 5. Career Applications

### Overview
Career application system for job postings and applications.

### Configuration

Add to your `.env` file:

```env
# Career Application Notifications
ADMIN_EMAIL=admin@zuroona.com
CAREER_EMAIL=careers@zuroona.com  # Alternative to ADMIN_EMAIL
```

### Email Configuration

Uses existing MailJS configuration (see `MAILJS_CREDENTIALS_GUIDE.md`).

### Features
- Job application submission
- Email notifications to applicants
- Email notifications to admins
- Application status tracking
- Admin review system

### No Additional Credentials Required

Uses existing:
- MailJS for emails
- MongoDB for storage
- Admin authentication system

---

## 6. Enhanced Event Filters

### Overview
Enhanced event filtering with location, date, price, and rating filters.

### Configuration

No external credentials needed.

### Available Filters

1. **Location Filter**
   - City name search
   - Address search
   - Geographic coordinates (latitude/longitude) with radius

2. **Date Filter**
   - Start date
   - End date

3. **Time Filter**
   - Start time
   - End time

4. **Price Filter**
   - Minimum price
   - Maximum price

5. **Rating Filter**
   - Minimum rating
   - Sort by rating

### API Usage

```
GET /api/landing/events?location=Riyadh&minPrice=100&maxPrice=500&minRating=4&startDate=2024-01-01
```

### No Additional Credentials Required

Uses existing:
- MongoDB geospatial queries
- Event and review data

---

## 7. Enhanced Logging

### Overview
Centralized logging system with Winston.

### Configuration

Add to your `.env` file:

```env
# Logging Configuration
LOG_LEVEL=info  # Options: error, warn, info, http, debug
```

### Log Files

Logs are stored in:
- `api/logs/error.log` - Error logs only
- `api/logs/combined.log` - All logs

### Log Levels

1. **error** - Error messages only
2. **warn** - Warning and error messages
3. **info** - Informational, warning, and error messages
4. **http** - HTTP requests, info, warnings, and errors
5. **debug** - All log messages

### Features
- Console output with colors
- File-based logging
- Automatic log rotation
- Structured JSON logs in files

### No Additional Credentials Required

Uses local file system for log storage.

---

## Summary of Required Credentials

### Required (External Services)
1. **Sentry DSN** - For error tracking (optional but recommended)

### Required (Internal Configuration)
1. **COOKIE_SECRET** - For CSRF protection (required)
2. **ADMIN_EMAIL** or **CAREER_EMAIL** - For career notifications (optional)
3. **LOG_LEVEL** - For logging configuration (optional)

### Optional
- Rate limiting configuration (uses defaults)
- Security headers (uses defaults)

---

## Quick Setup Checklist

- [ ] Create Sentry account and get DSN
- [ ] Generate COOKIE_SECRET
- [ ] Set ADMIN_EMAIL or CAREER_EMAIL
- [ ] Configure LOG_LEVEL (optional)
- [ ] Test all features

---

## Support

- **Sentry:** [https://sentry.io/support](https://sentry.io/support)
- **Winston Logging:** [https://github.com/winstonjs/winston](https://github.com/winstonjs/winston)
- **Express Rate Limit:** [https://github.com/express-rate-limit/express-rate-limit](https://github.com/express-rate-limit/express-rate-limit)

---

**Last Updated:** 2024-01-01
**Version:** 1.0.0

