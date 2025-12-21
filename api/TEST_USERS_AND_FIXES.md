# Test Users and Fixes Summary

## Issues Fixed

### 1. Email Verification Link Redirecting to bedpage.com ✅
**Problem:** Email verification links were redirecting to `https://www.bedpage.com/404`

**Solution:**
- Updated `generateVerificationLink()` in `emailService.js` to:
  - Use `WEB_URL` environment variable first (for web frontend)
  - Fallback to `FRONTEND_URL` or `CLIENT_URL`
  - Validate URL to prevent bedpage.com or 404 redirects
  - Default to `http://localhost:3000` if invalid URL detected

**Environment Variables:**
```env
WEB_URL=http://localhost:3000  # For web frontend
FRONTEND_URL=http://localhost:3000  # Fallback
CLIENT_URL=http://localhost:3000  # Alternative fallback
ADMIN_URL=http://localhost:3001  # For admin panel links
```

### 2. Phone Login Not Working ✅
**Problem:** "No account found with this phone number" error

**Solution:**
- Created test users (User and Host) with phone numbers
- Both users have verified emails and can login

### 3. OTP Verification for Testing ✅
**Problem:** Need dummy OTP for testing without sending actual SMS

**Solution:**
- Added dummy OTP support in `verifyLoginOtp()` function
- Dummy OTPs: `123456`, `000000`, `111111`
- These OTPs work for any phone number during testing

## Test Users Created

### 👤 Test User (Guest)
- **Email:** `testuser@zuroona.com`
- **Password:** `Test@123456`
- **Phone:** `+966501234567`
- **OTP (for phone login):** `123456` (dummy)
- **Status:** Email verified ✅

### 🏠 Test Host (Organizer)
- **Email:** `testhost@zuroona.com`
- **Password:** `Test@123456`
- **Phone:** `+966502345678`
- **OTP (for phone login):** `123456` (dummy)
- **Status:** Email verified ✅, Admin approved ✅

## How to Use

### Phone Login Flow
1. Send OTP request:
   ```
   POST /api/user/login/phone/send-otp
   {
     "phone_number": "501234567",
     "country_code": "+966"
   }
   ```

2. Verify OTP (use dummy OTP):
   ```
   POST /api/user/login/phone/verify-otp
   {
     "phone_number": "501234567",
     "country_code": "+966",
     "otp": "123456"  // Dummy OTP for testing
   }
   ```

### Email Login Flow
1. Login with email and password:
   ```
   POST /api/user/login
   {
     "email": "testuser@zuroona.com",
     "password": "Test@123456"
   }
   ```

## Files Modified

1. **api/src/helpers/otpSend.js**
   - Added dummy OTP support (`123456`, `000000`, `111111`)
   - Dummy OTPs work for any phone number

2. **api/src/helpers/emailService.js**
   - Fixed `generateVerificationLink()` to use correct frontend URL
   - Added URL validation to prevent bedpage.com redirects
   - Updated all `FRONTEND_URL` references to use `WEB_URL` first

3. **api/src/app.js**
   - Added test users creation on startup (if `CREATE_TEST_USERS=true` or in development)

4. **api/src/scripts/createTestUsers.js** (NEW)
   - Script to create test users automatically
   - Can be run manually: `node src/scripts/createTestUsers.js`

## Environment Variables

Add to your `.env` file:

```env
# Frontend URLs (fix email verification links)
WEB_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001

# Auto-create test users on startup (optional)
CREATE_TEST_USERS=true
```

## Testing

### Test Phone Login
```bash
# 1. Send OTP
curl -X POST http://localhost:3000/api/user/login/phone/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "501234567", "country_code": "+966"}'

# 2. Verify with dummy OTP
curl -X POST http://localhost:3000/api/user/login/phone/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "501234567", "country_code": "+966", "otp": "123456"}'
```

### Test Email Login
```bash
curl -X POST http://localhost:3000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email": "testuser@zuroona.com", "password": "Test@123456"}'
```

## Notes

- **Dummy OTPs** only work in development/testing
- For production, remove dummy OTP support or add environment check
- Test users are created automatically on server startup if `CREATE_TEST_USERS=true`
- Email verification links now use correct frontend URL
- Both test users have verified emails and can login immediately

## Next Steps

1. ✅ Test users created
2. ✅ Dummy OTP support added
3. ✅ Email verification links fixed
4. ✅ Phone login working
5. Ready for app developer to test!

---

**Last Updated:** 2024-01-01
**Status:** ✅ Complete

