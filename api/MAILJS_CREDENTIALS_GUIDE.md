# MailJS (jsmail) Email Service - Complete Credentials Guide

## 📋 Overview

This guide explains how to get all MailJS credentials needed for the Zuroona platform to send emails.

## 🔑 Required Credentials

You need the following credentials from MailJS:

1. **MailJS Public Key** - For API authentication
2. **MailJS Private Key** - For API authentication

## 📝 Step-by-Step: How to Get MailJS Credentials

### Step 1: Create MailJS Account

1. Go to: **https://www.mailjs.com/** or **https://www.emailjs.com/**
2. Click on **"Sign Up"** or **"Register"**
3. Fill in your details:
   - Email address
   - Password
   - Company/Organization name (optional)
4. Verify your email address
5. Complete your profile information

### Step 2: Access MailJS Dashboard

1. Login to your MailJS account
2. Navigate to the **Dashboard** or **Account Settings**

### Step 3: Get Public Key

1. In the MailJS dashboard, go to **"API Keys"** or **"Settings"** section
2. Look for **"Public Key"** or **"User ID"**
3. You should see your Public Key (it looks like: `OSfCgupc61dwFtXNI`)
4. **Copy this Public Key** - you'll need it for environment variables

### Step 4: Get Private Key

1. In the same section, look for **"Private Key"** or **"Access Token"**
2. You should see your Private Key (it looks like: `fj4w33dz06Qafqvr46ZrK`)
3. **Copy this Private Key** - you'll need it for environment variables
4. **Important:** Keep this key secret and never share it publicly

### Step 5: Add Credentials to Environment Variables

Add these to your `.env` file in the `api` folder:

```env
# MailJS Email Configuration
MAILJS_PUBLIC_KEY=OSfCgupc61dwFtXNI
MAILJS_PRIVATE_KEY=fj4w33dz06Qafqvr46ZrK
MAIL_FROM=Zuroona Platform <noreply@zuroona.com>
```

**Important:** 
- Replace `OSfCgupc61dwFtXNI` with your actual MailJS Public Key
- Replace `fj4w33dz06Qafqvr46ZrK` with your actual MailJS Private Key
- Remove any spaces from the keys

## 🔍 Where to Find Credentials in MailJS Dashboard

| Credential | Location in MailJS Dashboard |
|------------|------------------------------|
| **Public Key** | Dashboard → API Settings → Public Key / User ID |
| **Private Key** | Dashboard → API Settings → Private Key / Access Token |
| **Account Settings** | Dashboard → Account → API Keys |
| **Email Reports** | Dashboard → Reports → Email Delivery |

## ✅ Verification Checklist

Before using MailJS email service, ensure:

- [ ] MailJS account is created and verified
- [ ] Public Key is obtained from dashboard
- [ ] Private Key is obtained from dashboard
- [ ] Public Key is added to `.env` file as `MAILJS_PUBLIC_KEY`
- [ ] Private Key is added to `.env` file as `MAILJS_PRIVATE_KEY`
- [ ] Account has sufficient quota/balance for email sending
- [ ] Test email is sent successfully

## 🧪 Testing MailJS Integration

1. Start your API server
2. Check console logs for: `✅ MailJS credentials loaded successfully`
3. Try sending a verification email via registration endpoint
4. Check MailJS dashboard → Reports → Email Delivery to see if email was sent

## 📞 MailJS Support

If you need help:

- **Website:** https://www.mailjs.com/ or https://www.emailjs.com/
- **Support:** Contact through MailJS dashboard
- **API Documentation:** Check MailJS website for API docs
- **Email:** Check MailJS website for support email

## 🔐 Security Notes

1. **Never commit `.env` file to Git** - it contains sensitive credentials
2. **Keep Private Key secret** - don't share it publicly
3. **Rotate keys** if compromised
4. **Monitor usage** - check MailJS dashboard regularly for unusual activity

## 📊 Current Implementation

The MailJS email service is implemented in:
- `api/src/helpers/mailJSService.js` - Main email service
- `api/src/helpers/emailService.js` - Email service wrapper
- Used in:
  - User registration (sends verification email)
  - Organizer registration (sends verification email)
  - Password reset (sends reset link)
  - Event approval/rejection notifications
  - Host approval/rejection notifications

## 🚀 API Endpoints Using MailJS

All email sending operations use MailJS:
1. **POST** `/api/user/register` - Registration (sends verification email)
2. **POST** `/api/organizer/register` - Organizer registration (sends verification email)
3. **POST** `/api/user/forgot-password` - Password reset (sends reset link)
4. **POST** `/api/user/resend-verification` - Resend verification email
5. Admin endpoints for event/host approval/rejection

## 📝 Current Credentials (Already Configured)

```
Public Key: OSfCgupc61dwFtXNI
Private Key: fj4w33dz06Qafqvr46ZrK
```

These are already set as defaults in the code, but should be added to `.env` file for production.

---

**Last Updated:** Implementation completed with provided credentials

