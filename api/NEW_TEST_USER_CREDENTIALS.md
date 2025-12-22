# New Test User Credentials

## ✅ User Created Successfully

**User ID:** `6948ebf2bd0ecd82a87b5c84`

---

## 📋 Login Credentials

### Email/Password Login
- **Email:** `demouser@zuroona.com`
- **Password:** `Demo@123456`

### Phone/OTP Login
- **Phone Number:** `+966503456789`
- **Country Code:** `+966`
- **OTP (Dummy for Testing):** `123456`

---

## 🔐 User Details

- **First Name:** Demo
- **Last Name:** User
- **Role:** Guest (1)
- **Email Verified:** ✅ Yes
- **Status:** Active
- **Language:** English

---

## 🧪 How to Test

### 1. Email/Password Login
```bash
POST http://localhost:3434/api/user/login
Content-Type: application/json

{
  "email": "demouser@zuroona.com",
  "password": "Demo@123456"
}
```

### 2. Phone OTP Login (Step 1: Send OTP)
```bash
POST http://localhost:3434/api/user/login/phone/send-otp
Content-Type: application/json

{
  "phone_number": "503456789",
  "country_code": "+966"
}
```

### 3. Phone OTP Login (Step 2: Verify OTP)
```bash
POST http://localhost:3434/api/user/login/phone/verify-otp
Content-Type: application/json

{
  "phone_number": "503456789",
  "country_code": "+966",
  "otp": "123456"
}
```

---

## 📝 Notes

- ✅ User is **verified** (no email verification needed)
- ✅ User is **active** (can login immediately)
- ✅ Phone number is **Saudi Arabia** format (+966)
- ✅ Dummy OTP `123456` works in development/test mode
- ✅ All endpoints are ready to use

---

## 🚀 Quick Test Commands

### Using cURL (Email Login)
```bash
curl -X POST http://localhost:3434/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demouser@zuroona.com","password":"Demo@123456"}'
```

### Using cURL (Phone OTP - Send)
```bash
curl -X POST http://localhost:3434/api/user/login/phone/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone_number":"503456789","country_code":"+966"}'
```

### Using cURL (Phone OTP - Verify)
```bash
curl -X POST http://localhost:3434/api/user/login/phone/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone_number":"503456789","country_code":"+966","otp":"123456"}'
```

---

**Created:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

