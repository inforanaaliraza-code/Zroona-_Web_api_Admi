# Phone Login Guide for Test Users

## Test User Credentials

### Guest User
- **Phone Number:** `501234567` (without country code)
- **Country Code:** `+966`
- **Full Phone:** `+966501234567`
- **OTP:** `123456` (stored in database)

### Host/Organizer User
- **Phone Number:** `507654321` (without country code)
- **Country Code:** `+966`
- **Full Phone:** `+966507654321`
- **OTP:** `123456` (stored in database)

## Login Steps

### Step 1: Send OTP Request
**Endpoint:** `POST /api/user/login/phone/send-otp`

**Request Body:**
```json
{
  "phone_number": "501234567",
  "country_code": "+966"
}
```

**Response:**
```json
{
  "status": 1,
  "message": "OTP sent successfully",
  "data": {
    "otp": "123456"  // In development mode, OTP is returned
  }
}
```

### Step 2: Verify OTP and Login
**Endpoint:** `POST /api/user/login/phone/verify-otp`

**Request Body:**
```json
{
  "phone_number": "501234567",
  "country_code": "+966",
  "otp": "123456"
}
```

**Response:**
```json
{
  "status": 1,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "695113e5b538c9fe23564486",
      "email": "guest@test.com",
      "first_name": "Test",
      "last_name": "Guest",
      "phone_number": 501234567,
      "country_code": "+966",
      "role": 1,
      "is_verified": true,
      "is_approved": null
    }
  }
}
```

## Testing with cURL

### Guest User Login:
```bash
# Step 1: Send OTP
curl -X POST http://localhost:3434/api/user/login/phone/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "501234567", "country_code": "+966"}'

# Step 2: Verify OTP
curl -X POST http://localhost:3434/api/user/login/phone/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "501234567", "country_code": "+966", "otp": "123456"}'
```

### Host User Login:
```bash
# Step 1: Send OTP
curl -X POST http://localhost:3434/api/user/login/phone/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "507654321", "country_code": "+966"}'

# Step 2: Verify OTP
curl -X POST http://localhost:3434/api/user/login/phone/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "507654321", "country_code": "+966", "otp": "123456"}'
```

## Important Notes

1. **OTP 123456** is a test OTP that works for both users
2. The OTP is stored in the database for test users
3. In development mode, the OTP is also returned in the response
4. The OTP verification checks:
   - First: Dummy OTP list (123456, 000000, 111111)
   - Then: Database OTP for the phone number
   - Finally: In-memory OTP store

## Frontend Login Flow

1. User enters phone number: `501234567` or `507654321`
2. User selects country code: `+966`
3. Click "Send OTP"
4. Enter OTP: `123456`
5. Click "Verify & Login"
6. User is logged in and receives JWT token

## Troubleshooting

- **"Invalid OTP"**: Make sure you're using `123456` as the OTP
- **"Account not found"**: Verify the phone number matches exactly (no spaces)
- **"Phone number not verified"**: Test users are already verified, this shouldn't happen
- **CORS Error**: Make sure API server is running and CORS is configured

