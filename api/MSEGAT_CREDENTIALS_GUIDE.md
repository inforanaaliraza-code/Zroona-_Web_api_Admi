# Msegat SMS Service - Complete Credentials Guide

## 📋 Overview

This guide explains how to get all Msegat credentials needed for the Zuroona platform to send SMS OTP verification codes.

## 🔑 Required Credentials

You need the following credentials from Msegat:

1. **Msegat API Key** - For sending SMS messages
2. **Msegat Sender Name** (Optional) - Custom sender name for SMS

## 📝 Step-by-Step: How to Get Msegat Credentials

### Step 1: Create Msegat Account

1. Go to: **https://www.msegat.com/**
2. Click on **"Sign Up"** or **"Register"**
3. Fill in your details:
   - Company/Organization name
   - Email address
   - Phone number
   - Password
4. Verify your email address
5. Complete your profile information

### Step 2: Access Msegat Dashboard

1. Login to your Msegat account: **https://www.msegat.com/en/login**
2. Navigate to the **Dashboard**

### Step 3: Get API Key

1. In the Msegat dashboard, go to **"API"** or **"Settings"** section
2. Look for **"API Key"** or **"API Credentials"**
3. You should see your API Key (it looks like: `3808F5D4D89B1B23E61632C0B475A342`)
4. **Copy this API Key** - you'll need it for environment variables

**Note:** If you don't see an API Key, you may need to:
- Complete account verification
- Add payment method
- Contact Msegat support to activate API access

### Step 4: Get Sender Name (Optional)

1. In Msegat dashboard, go to **"SMS Settings"** or **"Sender Names"**
2. You can either:
   - Use default sender name
   - Request a custom sender name (may require approval)
3. Common sender names: Your company name (e.g., "Zuroona")

### Step 5: Add Credentials to Environment Variables

Add these to your `.env` file in the `api` folder:

```env
# Msegat SMS Configuration
MSEGAT_API_KEY=3808F5D4D89B1B23E61632C0B475A342
MSEGAT_SENDER_NAME=Zuroona
```

**Important:** 
- Replace `3808F5D4D89B1B23E61632C0B475A342` with your actual Msegat API Key
- Replace `Zuroona` with your approved sender name (if you have one)

## 🔍 Where to Find Credentials in Msegat Dashboard

| Credential | Location in Msegat Dashboard |
|------------|------------------------------|
| **API Key** | Dashboard → API Settings → API Key |
| **API Key** | Settings → API Credentials → API Key |
| **Sender Name** | SMS Settings → Sender Names |
| **Account Balance** | Dashboard → Account Balance |
| **SMS Reports** | Reports → SMS Delivery |

## ✅ Verification Checklist

Before using Msegat SMS service, ensure:

- [ ] Msegat account is created and verified
- [ ] API Key is obtained from dashboard
- [ ] API Key is added to `.env` file as `MSEGAT_API_KEY`
- [ ] Sender name is configured (optional, defaults to "Zuroona")
- [ ] Account has sufficient balance for SMS sending
- [ ] Test SMS is sent successfully

## 🧪 Testing Msegat Integration

1. Start your API server
2. Check console logs for: `✅ OneSignal credentials loaded successfully`
3. Try sending an OTP via phone login endpoint
4. Check Msegat dashboard → Reports → SMS Delivery to see if SMS was sent

## 📞 Msegat Support

If you need help:

- **Website:** https://www.msegat.com/
- **Support:** Contact through Msegat dashboard
- **API Documentation:** https://www.msegat.com/en/api/
- **Email:** Check Msegat website for support email

## 🔐 Security Notes

1. **Never commit `.env` file to Git** - it contains sensitive credentials
2. **Keep API Key secret** - don't share it publicly
3. **Rotate API Key** if compromised
4. **Monitor usage** - check Msegat dashboard regularly for unusual activity

## 📊 Current Implementation

The Msegat SMS service is implemented in:
- `api/src/helpers/msegatService.js` - Main SMS service
- `api/src/helpers/otpSend.js` - OTP generation and sending
- Used in:
  - User registration (sends OTP to phone)
  - Organizer registration (sends OTP to phone)
  - Phone login (sends OTP for authentication)

## 🚀 API Endpoints Using Msegat

1. **POST** `/api/user/login/phone/send-otp` - Send OTP to phone for login
2. **POST** `/api/user/login/phone/verify-otp` - Verify OTP and login
3. **POST** `/api/user/register` - Registration (sends OTP if phone provided)
4. **POST** `/api/organizer/register` - Organizer registration (sends OTP if phone provided)

---

**Last Updated:** Implementation completed with API Key: `3808F5D4D89B1B23E61632C0B475A342`

