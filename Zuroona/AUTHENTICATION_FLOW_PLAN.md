# Authentication Flow Implementation Plan
## Email + Phone OTP Based Authentication (No Password)

### Overview
This document outlines the comprehensive plan to implement passwordless authentication using email verification + phone OTP for both User and Host signup/login flows.

---

## 📋 Table of Contents
1. [Current State Analysis](#current-state-analysis)
2. [Requirements](#requirements)
3. [Database Schema Changes](#database-schema-changes)
4. [Backend API Changes](#backend-api-changes)
5. [Frontend Changes](#frontend-changes)
6. [Security & Validation Requirements](#security--validation-requirements)
7. [Implementation Steps](#implementation-steps)
8. [Testing Checklist](#testing-checklist)

---

## 🔍 Current State Analysis

### Existing Infrastructure:
✅ Email verification service (emailService.js)
✅ OTP service (otpSend.js) - supports login OTP
✅ Email verification tokens (EmailVerificationToken model)
✅ SMS service (msegatService.js)
✅ User and Organizer models with OTP fields

### Current Limitations:
❌ Password is required during signup
❌ Phone verification during signup is not mandatory
❌ No tracking of phone verification status separately
❌ Login requires password (not fully OTP-based)

---

## 📝 Requirements

### Signup Flow:
1. User enters **only email and phone number** (NO password field)
2. System sends:
   - Email verification link to email
   - OTP code to Saudi phone number (+966)
3. User must complete BOTH:
   - Click email verification link → email verified
   - Enter OTP code → phone verified
4. Signup completes **only when both are verified**
5. User account is created with `is_verified: true` only after both verifications

### Login Flow:
1. User enters **verified phone number** only
2. Click "Send OTP" button
3. System sends OTP to phone
4. User enters OTP
5. Login successful after OTP validation

---

## 🗄️ Database Schema Changes

### 1. User Model (`api/src/models/userModel.js`)
**Add fields:**
```javascript
phone_verified: {
    type: Boolean,
    default: false
},
phone_verified_at: {
    type: Date,
    default: null
},
email_verified_at: {
    type: Date,
    default: null
}
```

**Modify fields:**
```javascript
password: {
    type: String,
    required: false,  // Change from true to false
    select: false
},
is_verified: {
    type: Boolean,
    default: false  // Only true when BOTH email AND phone are verified
}
```

### 2. Organizer Model (`api/src/models/organizerModel.js`)
**Add same fields as User Model:**
```javascript
phone_verified: {
    type: Boolean,
    default: false
},
phone_verified_at: {
    type: Date,
    default: null
},
email_verified_at: {
    type: Date,
    default: null
}
```

**Modify fields:**
```javascript
password: {
    type: String,
    required: false,  // Change from true to false
    select: false
},
is_verified: {
    type: Boolean,
    default: false  // Only true when BOTH email AND phone are verified
}
```

### 3. OTP Storage Enhancement
**Consider adding OTP tracking model for better management:**
```javascript
// Optional: api/src/models/otpVerificationModel.js
{
    phone_number: String,
    country_code: String,
    otp: String,
    purpose: String, // 'signup' | 'login'
    expiresAt: Date,
    attempts: Number,
    user_id: ObjectId,
    user_type: String, // 'user' | 'organizer'
    verified: Boolean,
    verified_at: Date
}
```

---

## 🔧 Backend API Changes

### New/Modified Endpoints

#### 1. Signup Endpoint (`POST /user/register` & `POST /organizer/register`)

**Request Body (NO password):**
```json
{
    "email": "user@example.com",
    "phone_number": "501234567",
    "country_code": "+966",
    "first_name": "John",
    "last_name": "Doe",
    // ... other optional fields
}
```

**Flow:**
1. Validate email format
2. Validate Saudi phone number format (+966, 9 digits)
3. Check if email/phone already exists
4. Create user/organizer record with:
   - `is_verified: false`
   - `phone_verified: false`
   - `email_verified: false`
   - No password field
5. Generate and send email verification link
6. Generate and send OTP to phone
7. Store OTP with expiration (5 minutes)
8. Return response with user ID and verification status

**Response:**
```json
{
    "status": 1,
    "message": "Registration successful. Please verify your email and phone number.",
    "data": {
        "user_id": "...",
        "email_sent": true,
        "otp_sent": true,
        "email_verified": false,
        "phone_verified": false
    }
}
```

#### 2. Email Verification (`GET /user/verify-email` & `GET /organizer/verify-email`)

**Flow:**
1. Verify token validity and expiration
2. Mark email as verified (`email_verified: true`, `email_verified_at: Date`)
3. Check if phone is also verified
4. If both verified, set `is_verified: true`
5. Mark token as used

#### 3. Phone OTP Verification During Signup (`POST /user/verify-signup-otp` & `POST /organizer/verify-signup-otp`)

**Request Body:**
```json
{
    "user_id": "...",
    "phone_number": "501234567",
    "country_code": "+966",
    "otp": "123456"
}
```

**Flow:**
1. Validate OTP format (6 digits)
2. Check OTP expiration (5 minutes)
3. Verify OTP against stored value
4. Check retry limits (max 3 attempts)
5. Mark phone as verified (`phone_verified: true`, `phone_verified_at: Date`)
6. Check if email is also verified
7. If both verified, set `is_verified: true`
8. Clear OTP from storage
9. Return success

#### 4. Resend Signup OTP (`POST /user/resend-signup-otp` & `POST /organizer/resend-signup-otp`)

**Request Body:**
```json
{
    "user_id": "...",
    "phone_number": "501234567",
    "country_code": "+966"
}
```

**Flow:**
1. Rate limiting (30 seconds between requests)
2. Generate new OTP
3. Send OTP to phone
4. Return success

#### 5. Login - Send OTP (`POST /user/login/phone/send-otp` - Already exists, may need updates)

**Request Body:**
```json
{
    "phone_number": "501234567",
    "country_code": "+966"
}
```

**Flow:**
1. Validate phone format
2. Check if user/organizer exists with this phone
3. Check if account is fully verified (`is_verified: true`)
4. Generate and send OTP
5. Return success

#### 6. Login - Verify OTP (`POST /user/login/phone/verify-otp` - Already exists, may need updates)

**Request Body:**
```json
{
    "phone_number": "501234567",
    "country_code": "+966",
    "otp": "123456"
}
```

**Flow:**
1. Validate OTP
2. Verify OTP (check expiration, retry limits)
3. Find user/organizer by phone
4. Generate JWT token
5. Return token and user data

---

## 🎨 Frontend Changes

### Signup Forms

#### User Signup (`web/src/components/auth/GuestSignUpForm.jsx`)
**Changes:**
1. Remove password and confirmPassword fields
2. Add email and phone input fields only
3. Add OTP input field (shown after initial signup)
4. Add email verification status indicator
5. Multi-step flow:
   - Step 1: Email + Phone entry → Submit
   - Step 2: Show verification status
     - Email verification link sent message
     - OTP input field for phone
     - Show "Resend OTP" button
   - Step 3: Success page (only when both verified)

#### Host Signup (`web/src/components/auth/HostSignUpForm.jsx` or UnifiedSignUp)
**Similar changes as User Signup**

### Login Forms

#### Phone Login (`web/src/components/auth/EmailLoginForm.jsx` or new component)
**Changes:**
1. Show phone number input only
2. Add "Send OTP" button
3. Show OTP input field after OTP sent
4. Handle OTP verification
5. Redirect on successful login

---

## 🔒 Security & Validation Requirements

### Email Validation:
- ✅ Valid email format (RFC 5322 compliant)
- ✅ No disposable email domains (optional, recommended)
- ✅ Maximum length: 255 characters
- ✅ Trim whitespace and lowercase
- ✅ Check for existing email (including deleted accounts)

### Phone Validation:
- ✅ Must be Saudi Arabia (+966)
- ✅ Format: 9 digits after country code
- ✅ Pattern: `/^[0-9]{9}$/`
- ✅ Check for existing phone (including deleted accounts)
- ✅ No spaces or special characters

### OTP Validation:
- ✅ 6 digits only
- ✅ Expiration: 5 minutes
- ✅ Maximum retry attempts: 3
- ✅ Rate limiting: 30 seconds between requests
- ✅ Single-use (delete after successful verification)
- ✅ Case-insensitive input handling

### Security Best Practices:
1. **Rate Limiting:**
   - OTP requests: 5 per hour per phone
   - Email verification: 3 per hour per email
   - Login attempts: 10 per hour per IP

2. **OTP Generation:**
   - Cryptographically secure random generation
   - Never reuse OTPs
   - Store hashed OTPs (optional, for better security)

3. **Token Security:**
   - Email verification tokens: 48 characters, cryptographically random
   - Token expiration: 24 hours
   - Single-use tokens

4. **Error Handling:**
   - Generic error messages (don't reveal if email/phone exists)
   - Log security events
   - Track failed attempts

5. **Data Protection:**
   - Never log OTPs in plain text
   - Secure session management
   - HTTPS only in production

---

## 🚀 Implementation Steps

### Phase 1: Database Schema Updates
1. ✅ Update User model schema
2. ✅ Update Organizer model schema
3. ✅ Create migration script (if needed)
4. ✅ Test schema changes

### Phase 2: Backend API - Signup Flow
1. ✅ Remove password requirement from signup controllers
2. ✅ Add email + phone validation
3. ✅ Implement dual verification logic
4. ✅ Create signup OTP verification endpoint
5. ✅ Create resend signup OTP endpoint
6. ✅ Update email verification endpoint to check phone status
7. ✅ Add proper error handling

### Phase 3: Backend API - Login Flow
1. ✅ Update login OTP send endpoint
2. ✅ Update login OTP verify endpoint
3. ✅ Ensure only verified accounts can login
4. ✅ Add comprehensive validations

### Phase 4: Backend API - Validation & Security
1. ✅ Implement rate limiting
2. ✅ Add retry limits for OTP
3. ✅ Add comprehensive input validation
4. ✅ Add security logging

### Phase 5: Frontend - Signup Forms
1. ✅ Update User signup form
2. ✅ Update Host signup form
3. ✅ Add OTP input components
4. ✅ Add verification status indicators
5. ✅ Handle multi-step verification flow

### Phase 6: Frontend - Login Forms
1. ✅ Update login to phone-only
2. ✅ Add OTP input flow
3. ✅ Handle error states
4. ✅ Add loading states

### Phase 7: Testing & QA
1. ✅ Unit tests for validations
2. ✅ Integration tests for flows
3. ✅ Security testing
4. ✅ Edge case testing
5. ✅ UX testing

### Phase 8: Documentation & Deployment
1. ✅ Update API documentation
2. ✅ Update user guides
3. ✅ Deploy to staging
4. ✅ Production deployment

---

## ✅ Testing Checklist

### Signup Flow Testing:
- [ ] Email format validation (valid/invalid)
- [ ] Phone format validation (Saudi only, 9 digits)
- [ ] Duplicate email detection
- [ ] Duplicate phone detection
- [ ] Email verification link sent successfully
- [ ] OTP sent to phone successfully
- [ ] Email verification works
- [ ] OTP verification works
- [ ] Signup completes only when both verified
- [ ] Resend OTP functionality
- [ ] OTP expiration handling
- [ ] OTP retry limits
- [ ] Rate limiting for OTP requests

### Login Flow Testing:
- [ ] Phone format validation
- [ ] Unverified account cannot login
- [ ] OTP sent successfully
- [ ] OTP verification works
- [ ] Invalid OTP rejection
- [ ] Expired OTP rejection
- [ ] Retry limits enforced
- [ ] Rate limiting enforced
- [ ] JWT token generation
- [ ] User data returned correctly

### Edge Cases:
- [ ] Network failures during OTP send
- [ ] Multiple simultaneous OTP requests
- [ ] Email verification after phone verification
- [ ] Phone verification after email verification
- [ ] Deleted account recreation
- [ ] Special characters in email/phone
- [ ] Very long email addresses
- [ ] International phone numbers (should reject)

### Security Testing:
- [ ] Rate limiting prevents abuse
- [ ] OTPs expire correctly
- [ ] Tokens are single-use
- [ ] Error messages don't leak information
- [ ] Failed attempts are logged
- [ ] HTTPS enforcement (production)

---

## 📝 Notes

### Migration Strategy:
1. **Backward Compatibility:** Consider keeping password field optional for existing users
2. **Data Migration:** Existing users may need to verify phone numbers
3. **Gradual Rollout:** Consider feature flag for new signup flow

### Additional Considerations:
1. **SMS Provider:** Ensure Msegat is properly configured and has sufficient credits
2. **Email Provider:** Ensure MailJS is properly configured
3. **Monitoring:** Add logging and monitoring for OTP/email delivery
4. **Fallback:** Consider alternative verification methods if SMS fails

### Future Enhancements:
1. Remember device functionality
2. Two-factor authentication (2FA) options
3. Social login integration
4. Password recovery via email (if password is added later)

---

## 🎯 Success Criteria

✅ Users can signup with email + phone only (no password)
✅ Email verification link is sent and works
✅ OTP is sent to phone and works
✅ Signup completes only when both are verified
✅ Users can login with phone + OTP only
✅ All validations work correctly
✅ Security measures are in place
✅ Error handling is comprehensive
✅ UX is smooth and intuitive

---

**Document Version:** 1.0  
**Created:** 2024  
**Last Updated:** 2024

