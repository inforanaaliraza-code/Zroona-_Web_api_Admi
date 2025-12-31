# Quick Reference Guide - Passwordless Authentication

## 🚀 Quick Start

### For Developers

#### Backend API Endpoints
```javascript
// Signup
POST /api/user/register
Body: { email, phone_number, country_code, first_name, last_name, ... }

// Verify Email
GET /api/user/verify-email?token=xxx

// Verify Signup OTP
POST /api/user/verify-signup-otp
Body: { user_id, phone_number, country_code, otp }

// Login - Send OTP
POST /api/user/login/phone/send-otp
Body: { phone_number, country_code }

// Login - Verify OTP
POST /api/user/login/phone/verify-otp
Body: { phone_number, country_code, otp }
```

#### Frontend Components
```jsx
// User Signup
<GuestSignUpForm /> // No password field, has OTP verification

// Host Signup
<HostSignUpForm /> // No password field, has OTP verification

// Login
<EmailLoginForm /> // Phone + OTP (already implemented)
```

---

## 📋 Common Tasks

### Check User Verification Status
```javascript
// In database
{
  is_verified: true/false,        // Both email AND phone verified
  phone_verified: true/false,      // Phone verified
  email_verified_at: Date/null,   // Email verified timestamp
  phone_verified_at: Date/null    // Phone verified timestamp
}
```

### Resend Verification Email
```javascript
POST /api/user/resend-verification
Body: { email }
```

### Resend Signup OTP
```javascript
POST /api/user/resend-signup-otp
Body: { user_id, phone_number, country_code }
```

---

## 🔍 Debugging

### Check OTP in Development
- OTP is logged in console (development mode only)
- Check server logs for: `[SIGNUP:OTP]` or `[LOGIN:OTP]`
- Response includes `otp_for_testing` field in dev mode

### Check Email Verification Link
- Link is in response `verification_link` field (dev mode only)
- Format: `/auth/verify-email?token=xxx&role=guest&lang=en`

### Common Issues
1. **OTP not received** → Check Msegat configuration
2. **Email not received** → Check MailJS configuration
3. **Verification not working** → Check both email AND phone verified
4. **Login fails** → Check `is_verified: true` in database

---

## 📝 Validation Rules

### Email
- Format: RFC 5322 compliant
- Max length: 255 characters
- Disposable emails blocked
- Trimmed and lowercased

### Phone Number
- Country code: +966 only
- Format: 9 digits
- Must start with: 5
- Example: 501234567

### OTP
- Format: 6 digits
- Expiration: 5 minutes
- Rate limit: 30 seconds between requests
- Retry limit: 3 attempts

---

## 🎯 User Flow Diagrams

### Signup Flow
```
1. User enters email + phone
   ↓
2. System sends:
   - Email verification link
   - OTP to phone
   ↓
3. User verifies:
   - Email (click link)
   - Phone (enter OTP)
   ↓
4. Account created (is_verified: true)
```

### Login Flow
```
1. User enters phone number
   ↓
2. System checks: is_verified === true?
   ↓
3. If verified:
   - Send OTP
   - User enters OTP
   - Login successful
   ↓
4. If not verified:
   - Error: "Please verify first"
```

---

## 🔧 Configuration

### Environment Variables Required
```bash
# Email Service
MAILJS_PUBLIC_KEY=your_key
MAILJS_PRIVATE_KEY=your_key

# SMS Service
MSEGAT_USERNAME=your_username
MSEGAT_PASSWORD=your_password
MSEGAT_SENDER_NAME=your_sender

# Frontend URL
WEB_URL=https://your-domain.com

# Development
NODE_ENV=development
ALLOW_OTP_WITHOUT_SMS=true  # Only in dev
```

---

## 📞 Support Contacts

- **Technical Issues**: Check logs and error messages
- **SMS Issues**: Check Msegat dashboard
- **Email Issues**: Check MailJS dashboard
- **Database Issues**: Check MongoDB connection

---

**Last Updated**: 2024

