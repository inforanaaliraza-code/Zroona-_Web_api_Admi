# Authentication Flow Testing Guide

## 🧪 Complete Testing Checklist

### Prerequisites
1. Ensure MongoDB is running
2. Ensure email service (MailJS) is configured
3. Ensure SMS service (Msegat) is configured
4. Backend API server running on configured port
5. Frontend web app running

---

## 📱 Signup Flow Testing

### User (Guest) Signup

#### Test Case 1: Successful Signup Flow
**Steps:**
1. Navigate to `/signup/guest`
2. Fill in form:
   - First Name: "John"
   - Last Name: "Doe"
   - Email: "john.doe@example.com"
   - Phone Number: "501234567" (9 digits, starts with 5)
   - Country Code: "+966" (Saudi Arabia)
   - Gender: Select any
   - Date of Birth: Select valid date
   - Nationality: Select any
   - Accept Privacy Policy: ✓
   - Accept Terms: ✓
3. Click "Create Account"
4. **Expected Results:**
   - ✅ Account created successfully
   - ✅ Email verification link sent to email
   - ✅ OTP sent to phone number
   - ✅ Verification modal appears with:
     - Email verification status (pending)
     - Phone verification status (pending)
     - OTP input field

#### Test Case 2: Email Verification
**Steps:**
1. Check email inbox
2. Click verification link
3. **Expected Results:**
   - ✅ Email marked as verified
   - ✅ Status updates in verification modal
   - ✅ If phone also verified → Account fully verified
   - ✅ If phone not verified → Message: "Please verify phone"

#### Test Case 3: Phone OTP Verification
**Steps:**
1. Enter 6-digit OTP received via SMS
2. Click "Verify OTP"
3. **Expected Results:**
   - ✅ Phone marked as verified
   - ✅ Status updates in verification modal
   - ✅ If email also verified → Account fully verified
   - ✅ Success message + redirect to login

#### Test Case 4: Resend OTP
**Steps:**
1. Click "Resend OTP" button
2. **Expected Results:**
   - ✅ New OTP sent (30 second rate limit)
   - ✅ Success message displayed
   - ✅ Timer resets

#### Test Case 5: Invalid OTP
**Steps:**
1. Enter wrong OTP (e.g., "000000")
2. Click "Verify OTP"
3. **Expected Results:**
   - ✅ Error message: "Invalid OTP"
   - ✅ OTP field cleared or highlighted
   - ✅ Can retry (max 3 attempts)

#### Test Case 6: Expired OTP
**Steps:**
1. Wait 5+ minutes after receiving OTP
2. Enter OTP
3. **Expected Results:**
   - ✅ Error message: "OTP has expired"
   - ✅ Prompt to request new OTP

#### Test Case 7: Validation Errors
**Test Scenarios:**
- Empty email → Error: "Email is required"
- Invalid email format → Error: "Invalid email format"
- Phone number < 9 digits → Error: "Invalid phone format"
- Phone number doesn't start with 5 → Error: "Must start with 5"
- Non-Saudi country code → Error: "Only Saudi Arabia allowed"
- Missing required fields → Form validation errors

#### Test Case 8: Duplicate Email/Phone
**Steps:**
1. Try to signup with existing email
2. **Expected Results:**
   - ✅ Error: "Email already registered" or resend verification
3. Try to signup with existing phone
4. **Expected Results:**
   - ✅ Error: "Phone number already registered"

---

### Host (Organizer) Signup

#### Test Case 9: Host Signup Flow
**Steps:**
1. Navigate to `/signup/host`
2. Fill in form (similar to Guest, but no password)
3. Submit
4. **Expected Results:**
   - ✅ Same verification flow as Guest
   - ✅ Admin approval notice displayed
   - ✅ Account pending approval after verification

---

## 🔐 Login Flow Testing

### Test Case 10: Successful Login
**Steps:**
1. Navigate to `/login`
2. Enter verified phone number: "501234567"
3. Country Code: "+966"
4. Click "Send OTP"
5. **Expected Results:**
   - ✅ OTP sent successfully
   - ✅ OTP input field appears
   - ✅ Timer starts (30 seconds)
6. Enter OTP received via SMS
7. Click "Verify & Login"
8. **Expected Results:**
   - ✅ Login successful
   - ✅ JWT token stored
   - ✅ Redirect based on role:
     - Guest → `/events`
     - Host → `/joinUsEvent`

### Test Case 11: Unverified Account Login Attempt
**Steps:**
1. Create account but don't verify email/phone
2. Try to login
3. **Expected Results:**
   - ✅ Error: "Please verify your email and phone number first"
   - ✅ Cannot proceed to OTP step

### Test Case 12: Partially Verified Account
**Steps:**
1. Create account, verify only email (not phone)
2. Try to login
3. **Expected Results:**
   - ✅ Error: "Please verify your phone number first"

### Test Case 13: Invalid Phone Number
**Steps:**
1. Enter phone number not in database
2. Click "Send OTP"
3. **Expected Results:**
   - ✅ Error: "No account found with this phone number"

### Test Case 14: Wrong OTP
**Steps:**
1. Enter correct phone number
2. Enter wrong OTP
3. **Expected Results:**
   - ✅ Error: "Invalid OTP"
   - ✅ Can retry

### Test Case 15: Rate Limiting
**Steps:**
1. Click "Send OTP"
2. Immediately click again (< 30 seconds)
3. **Expected Results:**
   - ✅ Error: "Please wait X seconds before requesting another OTP"

---

## 🔍 Edge Cases & Security Testing

### Test Case 16: SQL Injection / XSS
**Steps:**
1. Try entering malicious scripts in email/phone fields
2. **Expected Results:**
   - ✅ Input sanitized
   - ✅ No code execution

### Test Case 17: OTP Brute Force
**Steps:**
1. Try multiple wrong OTPs rapidly
2. **Expected Results:**
   - ✅ Rate limiting prevents abuse
   - ✅ Account locked after max attempts (if implemented)

### Test Case 18: Email Verification Token Reuse
**Steps:**
1. Click email verification link
2. Click same link again
3. **Expected Results:**
   - ✅ Token marked as used
   - ✅ Error: "Link already used" or "Already verified"

### Test Case 19: Expired Email Token
**Steps:**
1. Wait 24+ hours after receiving email
2. Click verification link
3. **Expected Results:**
   - ✅ Error: "Link expired"
   - ✅ Option to resend verification email

### Test Case 20: Multiple OTP Requests
**Steps:**
1. Request OTP multiple times (after rate limit)
2. Use oldest OTP
3. **Expected Results:**
   - ✅ Only latest OTP works
   - ✅ Previous OTPs invalidated

### Test Case 21: Phone Number Format Variations
**Test Scenarios:**
- With spaces: "501 234 567" → Should work (spaces removed)
- With dashes: "501-234-567" → Should work (dashes removed)
- With country code in phone: "+966501234567" → Should handle correctly
- International format: Should reject (only +966 allowed)

### Test Case 22: Email Format Variations
**Test Scenarios:**
- Uppercase: "JOHN@EXAMPLE.COM" → Should lowercase
- With spaces: " john@example.com " → Should trim
- Special characters: Should validate properly

---

## 🌐 Integration Testing

### Test Case 23: Complete User Journey
**Steps:**
1. Signup as Guest
2. Verify email
3. Verify phone OTP
4. Login with phone + OTP
5. **Expected Results:**
   - ✅ All steps complete successfully
   - ✅ User can access protected routes

### Test Case 24: Complete Host Journey
**Steps:**
1. Signup as Host
2. Verify email
3. Verify phone OTP
4. Wait for admin approval
5. Login with phone + OTP
6. **Expected Results:**
   - ✅ All steps complete successfully
   - ✅ Host can access organizer dashboard

### Test Case 25: Cross-Browser Testing
**Browsers to Test:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

**Expected Results:**
- ✅ All forms work correctly
- ✅ OTP input works on mobile
- ✅ Responsive design works

---

## 📊 API Testing (Postman/Thunder Client)

### Signup Endpoint
```http
POST /api/user/register
Content-Type: application/json
lang: en

{
  "email": "test@example.com",
  "phone_number": "501234567",
  "country_code": "+966",
  "first_name": "Test",
  "last_name": "User",
  "gender": 1,
  "date_of_birth": "1990-01-01",
  "nationality": "SA"
}
```

**Expected Response:**
```json
{
  "status": 1,
  "message": "Registration successful! Please verify your email and phone.",
  "data": {
    "user": {
      "_id": "...",
      "email": "test@example.com",
      "phone_number": 501234567,
      "is_verified": false,
      "phone_verified": false,
      "email_verified": false
    },
    "verification_status": {
      "email_sent": true,
      "otp_sent": true
    }
  }
}
```

### Verify Signup OTP
```http
POST /api/user/verify-signup-otp
Content-Type: application/json
lang: en

{
  "user_id": "...",
  "phone_number": "501234567",
  "country_code": "+966",
  "otp": "123456"
}
```

### Login - Send OTP
```http
POST /api/user/login/phone/send-otp
Content-Type: application/json
lang: en

{
  "phone_number": "501234567",
  "country_code": "+966"
}
```

### Login - Verify OTP
```http
POST /api/user/login/phone/verify-otp
Content-Type: application/json
lang: en

{
  "phone_number": "501234567",
  "country_code": "+966",
  "otp": "123456"
}
```

---

## 🐛 Common Issues & Solutions

### Issue 1: OTP Not Received
**Possible Causes:**
- SMS service not configured
- Invalid phone number
- Rate limiting
- Network issues

**Solutions:**
- Check Msegat configuration
- Verify phone number format
- Check development mode (OTP logged in console)
- Wait for rate limit to expire

### Issue 2: Email Not Received
**Possible Causes:**
- MailJS not configured
- Email in spam folder
- Invalid email address

**Solutions:**
- Check MailJS credentials
- Check spam/junk folder
- Verify email format
- Check development mode (link in console)

### Issue 3: Verification Not Completing
**Possible Causes:**
- One verification missing
- Database not updated
- Token expired

**Solutions:**
- Verify both email AND phone
- Check database directly
- Request new verification link/OTP

### Issue 4: Login Fails After Verification
**Possible Causes:**
- Account not fully verified
- Token not stored
- Role mismatch

**Solutions:**
- Check `is_verified` field in database
- Verify token in cookies
- Check user role

---

## ✅ Success Criteria

All tests should pass:
- ✅ Signup without password works
- ✅ Email verification works
- ✅ Phone OTP verification works
- ✅ Dual verification required
- ✅ Login with phone + OTP works
- ✅ Unverified accounts cannot login
- ✅ All validations work
- ✅ Error handling is proper
- ✅ Security measures in place

---

## 📝 Test Report Template

```
Test Date: [Date]
Tester: [Name]
Environment: [Development/Staging/Production]

Test Results:
- Signup Flow: [Pass/Fail]
- Email Verification: [Pass/Fail]
- Phone OTP Verification: [Pass/Fail]
- Login Flow: [Pass/Fail]
- Edge Cases: [Pass/Fail]

Issues Found:
1. [Issue description]
2. [Issue description]

Notes:
[Additional observations]
```

---

**Last Updated**: 2024

