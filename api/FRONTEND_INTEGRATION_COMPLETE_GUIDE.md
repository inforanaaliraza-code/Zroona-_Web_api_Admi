# Frontend Integration Complete Guide

## ✅ Implementation Status

All backend features have been integrated into the frontend (Web & Admin). This document provides a complete overview of what has been implemented and how to use it.

---

## 📋 Table of Contents

1. [Web Frontend Features](#web-frontend-features)
2. [Admin Panel Features](#admin-panel-features)
3. [API Endpoints Integration](#api-endpoints-integration)
4. [Testing Guide](#testing-guide)
5. [Credentials & Configuration](#credentials--configuration)

---

## 🌐 Web Frontend Features

### 1. Phone OTP Login ✅

**Location:** `web/src/components/Modal/PhoneLoginModal.jsx`

**Features:**
- ✅ Phone number input with country code selector
- ✅ OTP sending via Msegat SMS
- ✅ OTP verification (6-digit code)
- ✅ Dummy OTP support for testing (123456)
- ✅ Timer for OTP resend (30 seconds)
- ✅ Saudi Arabia phone number validation (+966)

**API Endpoints Used:**
- `POST /api/user/login/phone/send-otp` - Send OTP
- `POST /api/user/login/phone/verify-otp` - Verify OTP and login

**How to Test:**
1. Open login modal
2. Select "Phone Login" tab
3. Enter phone number: `503456789` (Saudi Arabia)
4. Select country code: `+966`
5. Click "Send OTP"
6. Enter OTP: `123456` (dummy OTP for testing)
7. Click "Verify"

---

### 2. Refund Management ✅

**Pages Created:**
- `web/src/app/(landingPage)/refunds/page.jsx` - Refund list
- `web/src/app/(landingPage)/refunds/request/page.jsx` - Request refund

**Features:**
- ✅ View all refund requests
- ✅ Filter by status (All, Pending, Approved, Rejected)
- ✅ Request new refund
- ✅ View refund details
- ✅ Status tracking with visual indicators

**API Endpoints Used:**
- `GET /api/user/refund/list` - Get refund list
- `POST /api/user/refund/request` - Request refund
- `GET /api/user/refund/detail` - Get refund detail

**How to Test:**
1. Navigate to `/refunds`
2. Click "Request New Refund"
3. Select a booking
4. Enter refund reason
5. Submit request
6. View refund status in list

---

### 3. Career Application ✅

**Page Created:**
- `web/src/app/(landingPage)/careers/page.jsx` - Career application form

**Features:**
- ✅ View available positions
- ✅ Submit job application
- ✅ Resume/CV upload (PDF, Word, max 5MB)
- ✅ Cover letter submission
- ✅ Form validation

**API Endpoints Used:**
- `GET /api/user/career/positions` - Get available positions
- `POST /api/user/career/apply` - Submit application
- `POST /api/user/uploadFile` - Upload resume

**How to Test:**
1. Navigate to `/careers`
2. Fill in application form
3. Upload resume (PDF or Word)
4. Write cover letter
5. Submit application

---

### 4. Enhanced Event Filters ✅

**Location:** `web/src/app/(landingPage)/events/page.jsx`

**Features:**
- ✅ Location filter (city, address, geolocation)
- ✅ Date & time filter (start date, end date)
- ✅ Price filter (minimum and maximum)
- ✅ Ratings filter (minimum rating)
- ✅ Search by event name/description

**API Endpoints Used:**
- `GET /api/user/event/list` - Get events with filters

**Filter Parameters:**
- `location` - City or address
- `startDate` - Event start date
- `endDate` - Event end date
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `minRating` - Minimum rating
- `search` - Search term

---

## 🔧 Admin Panel Features

### 1. Refund Management ✅

**Page Created:**
- `admin/src/app/(AfterLogin)/refund-requests/page.js` - Refund management

**Features:**
- ✅ View all refund requests
- ✅ Filter by status
- ✅ Approve/Reject refunds
- ✅ Process refunds via Moyasar
- ✅ View refund details
- ✅ Export to CSV

**API Endpoints Used:**
- `GET /api/admin/refund/list` - Get refund list
- `GET /api/admin/refund/detail` - Get refund detail
- `PUT /api/admin/refund/update-status` - Update refund status

**How to Test:**
1. Login as admin
2. Navigate to "Refund Requests"
3. View pending refunds
4. Click "Approve" or "Reject"
5. Confirm action
6. Refund processed via Moyasar (if approved)

---

### 2. Career Application Management ✅

**Page Created:**
- `admin/src/app/(AfterLogin)/career-applications/page.js` - Career management

**Features:**
- ✅ View all applications
- ✅ Filter by status/position
- ✅ View application details
- ✅ Update application status
- ✅ Download resumes
- ✅ Export to CSV

**API Endpoints Used:**
- `GET /api/admin/career/applications` - Get applications
- `GET /api/admin/career/application/detail` - Get application detail
- `PUT /api/admin/career/application/update-status` - Update status

**How to Test:**
1. Login as admin
2. Navigate to "Career Applications"
3. View all applications
4. Click on application to view details
5. Update status (Pending, Approved, Rejected)

---

## 🔌 API Endpoints Integration

### Web Frontend APIs

**File:** `web/src/app/api/setting.js`

**New APIs Added:**
```javascript
// Phone OTP Login
export const SendPhoneOTPApi = async (payload) => {...}
export const VerifyPhoneOTPApi = async (payload) => {...}

// Refund Management
export const RequestRefundApi = async (payload) => {...}
export const GetRefundListApi = async (payload) => {...}
export const GetRefundDetailApi = async (payload) => {...}

// Career Applications
export const SubmitCareerApplicationApi = async (payload) => {...}
export const GetCareerPositionsApi = async () => {...}
```

### Admin Panel APIs

**File:** `admin/src/api/setting.js`

**New APIs Added:**
```javascript
// Refund Management
export const GetRefundListApi = async (payload) => {...}
export const GetRefundDetailApi = async (payload) => {...}
export const UpdateRefundStatusApi = async (payload) => {...}

// Career Application Management
export const GetCareerApplicationsApi = async (payload) => {...}
export const GetCareerApplicationDetailApi = async (payload) => {...}
export const UpdateCareerApplicationStatusApi = async (payload) => {...}
```

---

## 🧪 Testing Guide

### Guest/User Testing

1. **Phone OTP Login:**
   - Phone: `+966503456789`
   - OTP: `123456` (dummy)

2. **Refund Request:**
   - Navigate to `/refunds`
   - Request refund for a confirmed booking
   - Check status updates

3. **Career Application:**
   - Navigate to `/careers`
   - Submit application with resume
   - Verify email notification

4. **Event Filters:**
   - Navigate to `/events`
   - Apply filters (location, date, price, ratings)
   - Verify filtered results

### Host/Organizer Testing

1. **Phone OTP Login:**
   - Same as guest
   - Must be approved by admin first

2. **Event Management:**
   - Create events
   - Manage bookings
   - View earnings

### Admin Testing

1. **Refund Management:**
   - View refund requests
   - Approve/Reject refunds
   - Verify Moyasar refund processing

2. **Career Application Management:**
   - View applications
   - Update status
   - Download resumes

---

## 🔐 Credentials & Configuration

### Environment Variables Required

**API (.env):**
```env
# Msegat SMS
MSEGAT_API_KEY=3808F5D4D89B1B23E61632C0B475A342
MSEGAT_SENDER_NAME=Zuroona

# MailJS Email
MAILJS_PUBLIC_KEY=OSfCgupc61dwFtXNI
MAILJS_PRIVATE_KEY=fj4w33dz06Qafqvr46ZrK

# Moyasar Payment
MOYASAR_PUBLISHABLE_KEY=pk_test_GUUdMyrNufV9xb59FBSAYi9jniyhvVDa9U2524pV
MOYASAR_SECRET_KEY=sk_test_@sG6LYsSoX4hixpSwCZEiaac1TSLtKXMy91Yen6B

# OneSignal Push Notifications
ONESIGNAL_APP_ID=0c335e7c-4c22-4a1d-bd44-82ce1b2ad6a3
ONESIGNAL_REST_API_KEY=os_v2_app_bqzv47cmejfb3pkeqlhbwkwwunahhk62ttrewietshmfvxsnajy5awtv2bs6z6tute6e6tpul45jm6xfvoizme6pxornddy5gdjbr2a

# Sentry Error Tracking
SENTRY_DSN=https://0b9a0508554c83f26e4f17fceca22a09@o4510574507851776.ingest.us.sentry.io/4510574510604288

# Frontend URL
FRONTEND_URL=http://localhost:3000
WEB_URL=http://localhost:3000
CLIENT_URL=http://localhost:3000

# Secret Key (JWT)
SECRET_KEY=e058705f0b8f1f936f57d9bf1bac33a91aa9d333e6cd3197db79488c1751aed0
```

**Web Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3434/api
```

**Admin Panel (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3434/api
```

---

## 📝 Test User Credentials

### Guest User
- **Email:** `demouser@zuroona.com`
- **Password:** `Demo@123456`
- **Phone:** `+966503456789`
- **OTP:** `123456` (dummy)

### Host/Organizer
- **Email:** `testhost@zuroona.com`
- **Password:** `Test@123456`
- **Phone:** `+966502345678`
- **OTP:** `123456` (dummy)
- **Status:** Approved

---

## 🚀 Deployment Checklist

### Backend (API)
- [x] All environment variables set
- [x] Database connected
- [x] All services configured (Msegat, MailJS, Moyasar, OneSignal)
- [x] Sentry configured
- [x] Rate limiting enabled
- [x] CSRF protection enabled

### Web Frontend
- [x] API endpoints integrated
- [x] Phone OTP login working
- [x] Refund pages created
- [x] Career application page created
- [x] Event filters enhanced
- [x] All API calls updated

### Admin Panel
- [x] Refund management page created
- [x] Career application management page created
- [x] All API endpoints integrated
- [x] Export functionality ready

---

## 📚 Additional Resources

- **API Endpoints Reference:** `api/API_ENDPOINTS_QUICK_REFERENCE.md`
- **Backend Implementation:** `api/BRD_FEATURES_IMPLEMENTATION_SUMMARY.md`
- **Credentials Guide:** `api/BRD_FEATURES_CREDENTIALS_GUIDE.md`
- **Test Users:** `api/NEW_TEST_USER_CREDENTIALS.md`

---

## ✅ Summary

**All features have been successfully integrated:**

1. ✅ Phone OTP Login (Web)
2. ✅ Refund Management (Web + Admin)
3. ✅ Career Applications (Web + Admin)
4. ✅ Enhanced Event Filters (Web)
5. ✅ All API endpoints connected
6. ✅ Complete testing guide provided
7. ✅ All credentials documented

**Status:** 100% Complete - Ready for Testing & Deployment

---

**Last Updated:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

