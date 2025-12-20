## Zuroona API – Postman Testing Guide

This document lists **all main REST endpoints** for the project, grouped by role:

- **User (Guest)** – `/api/user/...`
- **Organizer / Host** – `/api/organizer/...`
- **Admin** – `/api/admin/...`
- **Common / Public / Landing / Reviews / Messaging**

Use this to configure **Postman** and test every API.

---

## 1. Base URLs & Auth

- **Local API base URL**
  - `http://localhost:3434/api/`

- **Auth header (JWT)**
  - Header: `Authorization: Bearer <token>`
  - Token is received from **login** endpoints.

- **Language header (optional)**
  - Header: `lang: en` or `lang: ar`

- **Standard response format**

```json
{
  "status": 1,
  "message": "success message",
  "data": { ... },
  "total_count": 0
}
```

`status: 1` means success, `status: 0` means error.

---

## 2. Common / Public Endpoints

### 2.1 Health Check

- **GET** `http://localhost:3434/api/health`
- **Auth**: None
- **Query / Body**: None
- **Success 200**

```json
{
  "status": "ok",
  "timestamp": "2025-01-01T12:34:56.789Z"
}
```

---

### 2.2 Decode Token Info (for debugging)

- **GET** `http://localhost:3434/api/user-info`
- **Auth**: Optional (`Authorization: Bearer <token>`)
- **Success 200**

```json
{
  "userId": "6630f1c0f3...",
  "role": 1,
  "isAuthenticated": true,
  "message": "User is authenticated"
}
```

If no/invalid token: `userId: null`, `isAuthenticated: false`.

---

### 2.3 Get (legacy) S3 Credentials

> Mostly legacy, but endpoint still exists.

- **GET** `http://localhost:3434/api/get-s3-credentials`
- **Auth**: None
- **Success 200**

```json
{
  "status": 1,
  "message": "success",
  "data": {
    "accessKeyId": "...",
    "secretAccessKey": "...",
    "bucketName": "...",
    "region": "..."
  },
  "total_count": 0
}
```

---

### 2.4 CMS Content

- **GET** `http://localhost:3434/api/cms`
- **Auth**: None
- **Query params**
  - `type` – required, e.g. `terms_condition`, `privacy_policy`, etc.
- **Success 200**

```json
{
  "status": 1,
  "message": "fetched data",
  "data": {
    "type": "terms_condition",
    "description": "Text in selected language"
  },
  "total_count": 0
}
```

If `lang: ar` header is set, description is Arabic text.

---

### 2.5 Static Data Add (Admin-like utility)

- **POST** `http://localhost:3434/api/dataAdd`
- **Auth**: None
- **Body (JSON)**: free-form; passed to `EventCategoryService.CreateService`
- **Success 200**

```json
{
  "status": 1,
  "message": "success",
  "data": { "....createdObject..." },
  "total_count": 0
}
```

---

### 2.6 File Upload (Cloudinary)

There are **3** equivalent routes:

- **POST** `http://localhost:3434/api/user/uploadFile`
- **POST** `http://localhost:3434/api/common/user/uploadFile`
- **POST** `http://localhost:3434/api/user/uploadFile` (from `/user` router)

Use any of:

- `POST http://localhost:3434/api/user/uploadFile`
- or `POST http://localhost:3434/api/common/user/uploadFile`

#### Request (Postman)

- **Body**: `form-data`
  - `file` – **File**, required (field name must be exactly `file`)
  - `dirName` – Text, optional (Cloudinary folder, default `Jeena`, examples: `Jeena/events`, `Jeena/profiles`)

#### Success 200

```json
{
  "status": 1,
  "message": "File uploaded successfully to Cloudinary",
  "data": {
    "location": "https://res.cloudinary.com/.../image/upload/v.../Jeena/...jpg",
    "url": "https://res.cloudinary.com/.../image/upload/v.../Jeena/...jpg",
    "public_id": "Jeena/1713434545-filename.jpg",
    "format": "jpg",
    "bytes": 12345
  },
  "total_count": 0
}
```

If Cloudinary is not configured: `status: 0` and message about missing credentials.

---

## 3. Landing Page / Public Events

Base path: `http://localhost:3434/api/landing`

### 3.1 List Landing Events (Public)

- **GET** `/landing/events`
- **Auth**: None
- **Headers**: optional `lang`
- **Query params** (all optional):
  - `page` (default `1`)
  - `limit` (default `10`)
  - `startDate` (ISO date string)
  - `endDate` (ISO date string)
  - `minPrice` (number)
  - `maxPrice` (number)

#### Success 200

```json
{
  "status": 1,
  "message": "Events fetched successfully",
  "data": {
    "events": [ { /* event summary */ }, ... ],
    "total_count": 25
  },
  "total_count": 0
}
```

Actual `data` structure is what `LandingPageService.getEventsForLanding` returns: list of events with dates, prices, image, etc.

---

### 3.2 Featured Events

- **GET** `/landing/featured-events`
- **Auth**: None
- **Query params**:
  - `limit` (default `50`)

#### Success 200

```json
{
  "status": 1,
  "message": "Featured events fetched successfully",
  "data": [
    { "event_name": "...", "event_date": "...", "event_image": "...", ... }
  ],
  "total_count": 0
}
```

On error, returns `data: []` with status 1.

---

### 3.3 Event Details (Public – used on landing)

- **GET** `/landing/events/:eventId`
- **Auth**: Optional (if token is provided, some user-related flags may be included)
- **Path params**:
  - `eventId` – MongoDB ObjectId

#### Success 200

```json
{
  "status": 1,
  "message": "Event details fetched successfully",
  "data": { /* detailed event object */ },
  "total_count": 0
}
```

If event not found: 404 with `status: 0`.

---

### 3.4 Similar Events

- **GET** `/landing/events/:eventId/similar`
- **Auth**: Optional
- **Path params**:
  - `eventId` – event ID (Mongo ObjectId)
- **Query params** (optional):
  - `event_category` – category ID

#### Success 200

```json
{
  "status": 1,
  "message": "Similar events fetched successfully",
  "data": [ { /* event summary */ }, ... ],
  "total_count": 0
}
```

---

## 4. User (Guest) APIs – `/api/user/...`

### 4.1 Registration (Guest)

- **POST** `http://localhost:3434/api/user/register`
- **Auth**: None
- **Headers**: optional `lang`
- **Body (JSON)**:

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "StrongPass123!",
  "confirmPassword": "StrongPass123!",
  "phone_number": "555123456",
  "country_code": "+966"
}
```

#### Success 201

```json
{
  "status": 1,
  "message": "Registration successful! Please check your email to verify your account.",
  "data": {
    "user": {
      "_id": "6630f1c0f3...",
      "email": "john@example.com",
      "phone_number": "555123456",
      "country_code": "+966",
      "first_name": "John",
      "last_name": "Doe",
      "is_verified": false
    },
    "verification_sent": true,
    "verification_link": "http://.../verify-email?token=..." // only in development
  },
  "total_count": 0
}
```

Common errors: 400/422 for validation, 409 if email/phone already exists.

---

### 4.2 Login (Unified for Guest & Organizer)

> This is the main login used on web: guest & host both can login here.

- **POST** `/user/login`
- **Alias**: `/user/login/by-email-phone`
- **Auth**: None
- **Headers**: optional `lang`
- **Body (JSON)**:

```json
{
  "email": "john@example.com",
  "password": "StrongPass123!"
}
```

#### Success 200

```json
{
  "status": 1,
  "message": "Login successful",
  "data": {
    "token": "jwt-token-here",
    "user": {
      "_id": "6630f1c0f3...",
      "email": "john@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "phone_number": "555123456",
      "country_code": "+966",
      "role": 1,
      "is_verified": true,
      "is_approved": null,
      "profile_image": null
    }
  },
  "total_count": 0
}
```

If login is an **organizer**, `role: 2` and `is_approved` is included (2 = approved).

Errors:
- 401 invalid credentials
- 401 email not verified
- 401 organizer not approved / rejected

---

### 4.3 Email Verification (Guest)

- **GET** `/user/verify-email`
- **Auth**: None
- **Query params**:
  - `token` – verification token from email link

#### Success 200

```json
{
  "status": 1,
  "message": "Email verified successfully! You can now login.",
  "data": {
    "user": {
      "_id": "...",
      "email": "john@example.com",
      "phone_number": "555123456",
      "first_name": "John",
      "last_name": "Doe",
      "is_verified": true,
      "role": 1
    },
    "token": "jwt-token-for-auto-login"
  },
  "total_count": 0
}
```

---

### 4.4 Resend Verification Email (Guest)

- **POST** `/user/resend-verification`
- **Body (JSON)**:

```json
{ "email": "john@example.com" }
```

#### Success 200

```json
{
  "status": 1,
  "message": "Verification email sent successfully",
  "data": {
    "email": "john@example.com",
    "verification_sent": true
  },
  "total_count": 0
}
```

---

### 4.5 Forgot Password (User/Organizer by email)

- **POST** `/user/forgot-password`
- **Body (JSON)**:

```json
{ "email": "john@example.com" }
```

#### Success 200

```json
{
  "status": 1,
  "message": "If an account with this email exists, a password reset link has been sent to your email.",
  "data": {
    "email": "john@example.com",
    "reset_sent": true
  },
  "total_count": 0
}
```

---

### 4.6 Reset Password (User/Organizer)

- **POST** `/user/reset-password`
- **Body (JSON)**:

```json
{
  "token": "reset-token-from-email",
  "new_password": "NewStrongPass123!",
  "confirmPassword": "NewStrongPass123!"
}
```

#### Success 200

```json
{
  "status": 1,
  "message": "Password reset successfully. You can now login with your new password.",
  "data": {},
  "total_count": 0
}
```

---

### 4.7 Profile – Update (Guest / Organizer by token)

- **PUT** `/user/profile/update`
- **Auth**: **Required** (`Authorization: Bearer <token>`)
- **Body (JSON)**: any fields to update, e.g.

```json
{
  "first_name": "John",
  "last_name": "Updated",
  "profile_image": "https://....",
  "gender": 1
}
```

#### Success 200

```json
{
  "status": 1,
  "message": "Profile updated successfully",
  "data": {
    "user": { /* updated user or organizer */ },
    "token": "new-jwt-token"
  },
  "total_count": 0
}
```

---

### 4.8 Profile – Detail

- **GET** `/user/profile/detail`
- **Auth**: Required

#### Success 200

```json
{
  "status": 1,
  "message": "Profile access successfully",
  "data": {
    "user": {
      "_id": "...",
      "first_name": "...",
      "last_name": "...",
      "profile_image": "...",
      "group_category": [ ... ],
      "bank_details": { ... },
      "registration_step": 1,
      "is_approved": 2,
      ...
    },
    "token": "new-token"
  },
  "total_count": 0
}
```

---

### 4.9 Profile – Logout

- **POST** `/user/profile/logout`
- **Auth**: Required
- **Body**: empty

#### Success 200

```json
{
  "status": 1,
  "message": "Logout successfully",
  "data": {},
  "total_count": 0
}
```

---

### 4.10 Profile – Delete

- **DELETE** `/user/profile/delete`
- **Auth**: Required
- **Body**: empty

#### Success 200

```json
{
  "status": 1,
  "message": "Profile deleted successfully",
  "data": {},
  "total_count": 0
}
```

---

### 4.11 Event List (User)

- **GET** `/user/event/list`
- **Auth**: Optional (token may influence gender-specific filtering)
- **Query params**:
  - `page` (default `1`)
  - `limit` (default `10`)
  - `event_type` (default `1`)
  - `search` (optional)
  - `event_category` (optional category id)

#### Success 200

```json
{
  "status": 1,
  "message": "Fetched data",
  "data": [
    {
      "_id": "...",
      "event_name": "...",
      "event_date": "...",
      "event_image": "...",
      "event_price": 100,
      "event_type": 1,
      "event_for": [1,3],
      "attendees": [ { "_id": "...", "first_name": "...", "profile_image": "..." } ]
    }
  ],
  "total_count": 25
}
```

---

### 4.12 Event Detail (User)

- **GET** `/user/event/detail`
- **Auth**: Optional (`ExtractUserIdFromToken`)
- **Query params**:
  - `event_id` – required

#### Success 200

```json
{
  "status": 1,
  "message": "Fetched data",
  "data": {
    "_id": "...",
    "event_name": "...",
    "event_image": "...",
    "event_description": "...",
    "organizer": { ... },
    "attendees": [ ... ],
    "related_events": [ ... ],
    "user_booking": { ... } // if user has a booking
  },
  "total_count": 0
}
```

---

### 4.13 Book Event

- **POST** `/user/event/book`
- **Auth**: Required
- **Body (JSON)**:

```json
{
  "event_id": "6630f....",
  "no_of_attendees": 2
}
```

#### Success 200

```json
{
  "status": 1,
  "message": "Booking successful",
  "data": {
    "_id": "...book_event_id...",
    "event_id": "...",
    "user_id": "...",
    "organizer_id": "...",
    "no_of_attendees": 2,
    "total_amount": 200,
    "book_status": 1,
    "payment_status": 0,
    ...
  },
  "total_count": 0
}
```

Errors: invalid event id, overbooking, dummy event, etc.

---

### 4.14 User Bookings List

- **GET** `/user/event/booked/list`
- **Alias**: `/user/bookings`
- **Auth**: Required
- **Query params**:
  - `book_status` – `"1"` pending/unpaid, `"2"` paid/approved, `"3"` cancelled
  - `event_date` – optional filter
  - `page`, `limit`

#### Success 200

```json
{
  "status": 1,
  "message": "Fetched data",
  "data": [
    {
      "event_id": "...",
      "event_name": "...",
      "event_date": "...",
      "book_details": {
        "total_amount": 200,
        "no_of_attendees": 2,
        ...
      },
      "payment_status": 0,
      "book_status": 1
    }
  ],
  "total_count": 5
}
```

---

### 4.15 Booking Detail

- **GET** `/user/event/booked/detail`
- **Auth**: Required
- **Query params**:
  - `book_id` – booking id

#### Success 200

```json
{
  "status": 1,
  "message": "Fetched data",
  "data": {
    "event_name": "...",
    "event_date": "...",
    "attendees": [ ... ],
    "book_details": { ... },
    "event_review": [ ... ]
  },
  "total_count": 0
}
```

---

### 4.16 Cancel Booking (Guest side)

- **POST** `/user/event/cancel`
- **Auth**: Required
- **Body (JSON)**:

```json
{
  "book_id": "bookingIdHere",
  "reason": "I cannot attend"
}
```

#### Success 200

```json
{
  "status": 1,
  "message": "Booking cancelled successfully",
  "data": {
    "booking": { /* updated booking */ },
    "amountDeducted": 200,
    "ticketsCancelled": 2
  },
  "total_count": 0
}
```

---

### 4.17 Update Language

- **PATCH** `/user/language`
- **Auth**: Required
- **Body (JSON)**:

```json
{ "language": "en" }
```

#### Success 200

```json
{
  "status": 1,
  "message": "Update success",
  "data": {},
  "total_count": 0
}
```

---

### 4.18 Add Event Review (Guest)

- **POST** `/user/event/review/add`
- **Auth**: Required
- **Body (JSON)**:

```json
{
  "event_id": "eventIdHere",
  "rating": 5,
  "description": "Great event!"
}
```

#### Success 200

```json
{
  "status": 1,
  "message": "Review added successfully",
  "data": {
    "_id": "...",
    "event_id": "...",
    "user_id": "...",
    "rating": 5,
    "description": "Great event!"
  },
  "total_count": 0
}
```

---

### 4.19 Event Review List (Guest)

- **GET** `/user/event/review/list`
- **Auth**: Required
- **Query params**:
  - `event_id` – required
  - `page`, `limit`

#### Success 200

```json
{
  "status": 1,
  "message": "Fetched data",
  "data": [
    {
      "rating": 5,
      "description": "...",
      "user": { "first_name": "...", "profile_image": "..." }
    }
  ],
  "total_count": 10
}
```

---

### 4.20 Notifications – List

- **GET** `/user/notification/list`
- **Auth**: Required
- **Query params**:
  - `page`, `limit`

#### Success 200

```json
{
  "status": 1,
  "message": "Fetched data",
  "data": [ { "_id": "...", "title": "...", "description": "...", "isRead": true, ... } ],
  "total_count": 0
}
```

Also marks notifications as read.

---

### 4.21 Notifications – Unread Count

- **GET** `/user/unreadNotificationCount`
- **Auth**: Required

#### Success 200

```json
{
  "status": 1,
  "message": "Success",
  "data": {
    "unreadCount": 3
  },
  "total_count": 0
}
```

---

### 4.22 Device Token (Push Notifications)

- **PUT** `/user/deviceToken`
- **Auth**: Required
- **Body (JSON)**:

```json
{ "fcm_token": "firebase-token-here" }
```

#### Success 200

```json
{
  "status": 1,
  "message": "Device token updated successfully",
  "data": {},
  "total_count": 0
}
```

---

### 4.23 Payment – Verify Signature

- **POST** `/user/verifyPayment`
- **Auth**: Required
- **Body (JSON)**:

```json
{
  "order_id": "order_123",
  "payment_id": "pay_123",
  "signature": "hmac-signature"
}
```

#### Success 200

```json
{
  "status": 1,
  "message": "Payment verified successfully",
  "data": {
    "verified": true
  },
  "total_count": 0
}
```

---

### 4.24 Payment – Detail (Moyasar)

- **GET** `/user/payment`
- **Auth**: Required
- **Query params**:
  - `id` – Moyasar payment id

#### Success 200

```json
{
  "status": 1,
  "message": "Fetched data",
  "data": { /* Moyasar payment JSON */ },
  "total_count": 0
}
```

---

### 4.25 Payment – Update Status (Guest & Organizer)

> Route is shared: `/user/payment/update` is called from user and from organizer side.

- **POST** `/user/payment/update`
- **Auth**: Required
- **Body (JSON)**:

```json
{
  "booking_id": "bookEventId",
  "payment_id": "gatewayPaymentId",
  "payment_status": 1,
  "amount": 200
}
```

#### Success 200

```json
{
  "status": 1,
  "message": "Update success",
  "data": {
    "payment_status": 1,
    "booking_id": "bookEventId",
    "payment_id": "gatewayPaymentId",
    "book_status": 2
  },
  "total_count": 0
}
```

---

### 4.26 Webhook (Moyasar – server to server)

- **POST** `/user/webhookReceived`
- **Auth**: none (used by payment gateway)
- **Body**: full Moyasar webhook payload

For Postman test you can send any JSON; it returns plain text `"Webhook processed successfully."` on 200.

---

## 5. Organizer / Host APIs – `/api/organizer/...`

### 5.1 Organizer Registration

- **POST** `/organizer/register`
- **Auth**: None
- **Body (JSON)** (simplified):

```json
{
  "first_name": "Host",
  "last_name": "Name",
  "email": "host@example.com",
  "password": "StrongPass123!",
  "confirmPassword": "StrongPass123!",
  "phone_number": "555123456",
  "country_code": "+966",
  "gender": 1,
  "date_of_birth": "1990-01-01",
  "bio": "Host bio",
  "govt_id": "front_url,back_url",
  "registration_step": 4
}
```

#### Success 201

```json
{
  "status": 1,
  "message": "Registration successful! Please check your email to verify your account. Your application will be reviewed by our team.",
  "data": {
    "organizer": {
      "_id": "...",
      "email": "host@example.com",
      "phone_number": "555123456",
      "first_name": "Host",
      "last_name": "Name",
      "is_verified": false,
      "is_approved": 1,
      "registration_step": 4
    },
    "verification_sent": true,
    "verification_link": "..." // dev only
  },
  "total_count": 0
}
```

---

### 5.2 Organizer Login

- **POST** `/organizer/login`
- **Body (JSON)**:

```json
{ "email": "host@example.com", "password": "StrongPass123!" }
```

#### Success 200

```json
{
  "status": 1,
  "message": "Login successful!",
  "data": {
    "token": "jwt...",
    "organizer": { /* organizer object without password */ }
  },
  "total_count": 0
}
```

Errors: email not verified, not approved, etc.

---

### 5.3 Verify Organizer Email

- **GET** `/organizer/verify-email?token=...`
- **Auth**: None

#### Success 200

```json
{
  "status": 1,
  "message": "Email verified successfully! Your application is pending admin approval. We will notify you via email once approved.",
  "data": {
    "organizer": {
      "_id": "...",
      "email": "host@example.com",
      "is_verified": true,
      "is_approved": 1,
      "role": 2
    }
  },
  "total_count": 0
}
```

---

### 5.4 Organizer Forgot Password

- **POST** `/organizer/forgot-password`
- **Body (JSON)**:

```json
{ "email": "host@example.com" }
```

Success shape similar to user forgot password.

---

### 5.5 Organizer Reset Password

- **POST** `/organizer/reset-password`
- **Body (JSON)**:

```json
{
  "token": "reset-token",
  "new_password": "NewStrongPass123!",
  "confirmPassword": "NewStrongPass123!"
}
```

#### Success 200

```json
{
  "status": 1,
  "message": "Password reset successfully. You can now login with your new password.",
  "data": {},
  "total_count": 0
}
```

---

### 5.6 Update Registration Profile (No Auth)

- **PUT** `/organizer/registration/update`
- **Auth**: None (uses `organizer_id` in body)
- **Body (JSON)** example:

```json
{
  "organizer_id": "organizerId",
  "registration_step": 3,
  "account_holder_name": "...",
  "bank_name": "...",
  "iban": "...",
  "account_number": "...",
  "ifsc_code": "..."
}
```

#### Success 200

```json
{
  "status": 1,
  "message": "Profile updated successfully",
  "data": {
    "organizer": { /* updated organizer */ }
  },
  "total_count": 0
}
```

---

### 5.7 Organizer Profile Update (Authenticated)

- **PUT** `/organizer/profile/update`
- **Auth**: Required (`AuthenticateUser` + `AuthenticateOrganizer`)
- **Body (JSON)**: same fields as organizer model – e.g. group_location, govt_id, bank data, etc.

#### Success 200

```json
{
  "status": 1,
  "message": "Profile updated successfully",
  "data": {
    "user": { /* organizer object */ },
    "token": "new-token"
  },
  "total_count": 0
}
```

---

### 5.8 Organizer Category List (Group Categories)

- **GET** `/organizer/category/list`
- **Auth**: Optional
- **Query params**:
  - `page`, `limit`, `search`

#### Success 200

```json
{
  "status": 1,
  "message": "Fetched data",
  "data": [ { "_id": "...", "name": "Category name", "selected_image": "...", ... } ],
  "total_count": 10
}
```

---

### 5.9 Event Category List (For Organizer)

- **GET** `/organizer/event/category/list`

Similar to above, returns event categories for event creation.

---

### 5.10 Add Event (Host)

- **POST** `/organizer/event/add`
- **Auth**: Required
- **Body (JSON)** (simplified):

```json
{
  "event_name": "My Event",
  "event_date": "2025-01-01",
  "event_start_time": "18:00",
  "event_end_time": "20:00",
  "event_price": 100,
  "event_type": 1,
  "event_for": [1, 3],
  "event_images": ["url1", "url2"],
  "event_category": ["categoryId1", "categoryId2"], 
  "longitude": 46.7,
  "latitude": 24.7,
  "event_address": "Riyadh ..."
}
```

#### Success 201

```json
{
  "status": 1,
  "message": "Event added successfully",
  "data": { /* created event */ },
  "total_count": 0
}
```

---

### 5.11 Update Event

- **PUT** `/organizer/event/update`
- **Auth**: Required
- **Body (JSON)**:

```json
{
  "event_id": "eventId",
  "event_name": "Updated name",
  "event_images": ["url1","url2"],
  "event_category": ["categoryId1","categoryId2"],
  "longitude": 46.7,
  "latitude": 24.7
}
```

#### Success 200

```json
{
  "status": 1,
  "message": "Event updated successfully",
  "data": { /* updated event */ },
  "total_count": 0
}
```

---

### 5.12 Delete Event

- **DELETE** `/organizer/event/delete`
- **Auth**: Required
- **Body (JSON)**:

```json
{ "event_id": "eventId" }
```

#### Success 200

```json
{
  "status": 1,
  "message": "Event deleted successfully",
  "data": { /* deleted event doc */ },
  "total_count": 0
}
```

---

### 5.13 Organizer Event Detail

- **GET** `/organizer/event/detail`
- **Auth**: Required
- **Query params**:
  - `event_id`

#### Success 200

Event detail for the organizer’s own event (including lat/lng).

---

### 5.14 Organizer Event List (My Events)

- **GET** `/organizer/event/list`
- **Auth**: Required
- **Query params**:
  - `page`, `limit`
  - `event_type` (optional)
  - `status` (optional) – filter by approval status
  - `event_date` (optional)

Returns list of host’s own events with `is_approved` and computed `event_status`.

---

### 5.15 Organizer Booking List (Guests)

- **GET** `/organizer/event/booking/list`
- **Auth**: Required
- **Query params**:
  - `page`, `limit`, `search`, `book_status`, `booking_date`

Returns guests’ bookings for all host’s events.

---

### 5.16 Organizer Booking Detail

- **GET** `/organizer/event/booking/detail`
- **Auth**: Required
- **Query params**:
  - `book_id`

Returns event info + guest details + booking details.

---

### 5.17 Change Booking Status (Host)

- **PATCH** `/organizer/event/booking/update-status`
- **Auth**: Required
- **Body (JSON)**:

```json
{
  "book_id": "bookingId",
  "book_status": 2   // 2 = accepted, 3 = rejected
}
```

Success: booking updated, notifications created, group chat participation updated for accepted.

---

### 5.18 Organizer Review List (For Their Events)

- **GET** `/organizer/event/review/list`
- **Auth**: Required
- **Query params**:
  - `page`, `limit`

Returns aggregated reviews for organizer’s events plus rating stats.

---

### 5.19 Organizer Earnings & Dashboard

- **GET** `/organizer/earning`
- **Auth**: Required
- **Query params**:
  - `filter` – `"d"` (daily), `"w"` (weekly), `"m"` (monthly – default)
  - `page`, `limit`

#### Success 200

```json
{
  "status": 1,
  "message": "success",
  "data": {
    "total_earnings": 1000,
    "transactions": [ ... ],
    "graph_data": [ { "label": "JAN", "total_earning": 200 }, ... ],
    "total_attendees": 50,
    "is_increased": 1,
    "current_month_percentage": 25
  },
  "total_count": 0
}
```

---

### 5.20 Organizer Withdrawal Request

- **POST** `/organizer/withdrawal`
- **Auth**: Required
- **Body (JSON)**:

```json
{ "amount": 500 }
```

#### Success 200

```json
{
  "status": 1,
  "message": "Withdrawal request sent successfully",
  "data": {},
  "total_count": 0
}
```

Wallet balance is set to 0 and admin sees a pending withdrawal.

---

### 5.21 Organizer Withdrawal List

- **GET** `/organizer/withdrawalList`
- **Auth**: Required
- **Query params**:
  - `page`, `limit`

Returns host’s own withdrawal transactions with statuses.

---

### 5.22 Organizer Device Token

- **PUT** `/organizer/deviceToken`
- **Auth**: Required
- Same as user deviceToken but for role 2.

---

### 5.23 Organizer PaymentStatus (helper)

- **PATCH** `/organizer/paymentStatus`
- **Auth**: Required
- Proxies to `UserController.updatePaymentStatus` – body same as `/user/payment/update`.

---

### 5.24 Organizer Cancel Event (Host-side mass cancel)

- **POST** `/organizer/event/cancel`
- **Auth**: Required
- **Body (JSON)**:

```json
{
  "event_id": "eventId",
  "reason": "Event cancelled due to ... "
}
```

Cancels event, refunds from host wallet, updates bookings and notifies guests & admins.

---

## 6. Admin APIs – `/api/admin/...`

### 6.1 Admin Login

- **POST** `/admin/login`
- **Body (JSON)**:

```json
{
  "email": "admin@example.com",
  "password": "AdminPass123!"
}
```

#### Success 200

```json
{
  "status": 1,
  "message": "Login successful!",
  "data": {
    "token": "jwt...",
    "admin": { "_id": "...", "email": "admin@example.com", ... }
  },
  "total_count": 0
}
```

All **other admin routes below require** this token with `AuthenticateUser` + `AuthenticateAdmin`.

---

### 6.2 Admin Forgot/Reset Password

- **POST** `/admin/forgot-password`
  - Body: `{ "email": "admin@example.com" }`
- **POST** `/admin/reset-password`
  - Body: `{ "token": "...", "new_password": "...", "confirmPassword": "..." }`

Responses are same pattern as user/organizer.

---

### 6.3 Admin Change Password

- **POST** `/admin/change-password`
- **Auth**: Required
- **Body (JSON)**:

```json
{
  "current_password": "OldPass",
  "new_password": "NewPass123!"
}
```

---

### 6.4 Admin Logout

- **POST** `/admin/logout`
- **Auth**: Required

---

### 6.5 Admin Profile

- **GET** `/admin/profile`
- **Auth**: Required

Returns current admin profile.

---

### 6.6 User List & Detail (Admin)

- **GET** `/admin/user/list`
  - Query: `page`, `limit`, `search`
- **GET** `/admin/user/detail`
  - Query: `id` – user id

List returns pagination + `id` like `JN_UM_001`.

---

### 6.7 Organizer List & Detail (Admin)

- **GET** `/admin/organizer/list`
  - Query: `page`, `limit`, `search`, `is_approved`, `is_active`
- **GET** `/admin/organizer/detail`
  - Query: `id`

---

### 6.8 Admin Change Organizer Approval Status (Legacy)

- **PUT** `/admin/changeStatus`
- **Auth**: Required
- **Body (JSON)**:

```json
{
  "userId": "organizerId",
  "is_approved": 2,
  "rejection_reason": "..."
}
```

See also organizer-specific endpoints `/organizer/admin/approve/:organizerId` and `/organizer/admin/reject/:organizerId` documented above.

---

### 6.9 Admin Activate/Deactivate Organizer

- **PATCH** `/admin/changeOrganizerStatus`
- **Body (JSON)**:

```json
{ "id": "organizerId", "isActive": true }
```

---

### 6.10 Admin CMS

- **GET** `/admin/cms/detail`
  - Query: `cms_type`
- **PUT** `/admin/cms/update`
  - Body: `{ "id": "cmsId", ...fields }`

---

### 6.11 Admin Event List & Detail

- **GET** `/admin/eventList`
  - Query: `page`, `limit`, `search`, `status`
    - `status`: 1=pending, 2=upcoming, 3=completed, 4=rejected
- **GET** `/admin/event/detail`
  - Query: `id`

---

### 6.12 Event Status Change (Approve / Reject)

- **PUT** `/admin/event/changeStatus`
- **Body (JSON)**:

```json
{
  "eventId": "eventId",
  "status": 2,              // 2 = approve, 4 = reject
  "rejectionReason": "..."  // only when rejecting
}
```

Approves/rejects event, sends emails, and on approve creates group chat.

---

### 6.13 Admin Group & Event Categories

- **POST** `/admin/group-category/add`
- **GET** `/admin/group-category/detail`
- **PUT** `/admin/group-category/update`
- **DELETE** `/admin/group-category/delete`
- **GET** `/admin/group-category/list`

and similar for:

- **POST** `/admin/event/group-category/add`
- **GET** `/admin/event/group-category/detail`
- **PUT** `/admin/event/group-category/update`
- **DELETE** `/admin/event/group-category/delete`
- **GET** `/admin/event/group-category/list`

All use standard list/detail/create/update/delete patterns.

---

### 6.14 Admin Notifications (Send to Users / Organizers)

- **POST** `/admin/notification/add`
- **Auth**: Required
- **Body (JSON)**:

```json
{
  "title": "Title",
  "text": "Message",
  "type": 1,          // 1 = all, 2 = selected_users
  "role": [1, 2],     // 1=User, 2=Organizer
  "selected_users": ["userId1", "userId2"] // required when type = 2
}
```

---

### 6.15 Admin Notifications – List (Global)

- **GET** `/admin/notification/list`
- **Returns**: all notification documents.

---

### 6.16 Organizer Withdrawal List & Status (Admin)

- **GET** `/admin/organizer/withdrawalList`
  - Query: `page`, `limit`
- **PUT** `/admin/withdrawalStatus`
  - Body:

```json
{
  "id": "transactionId",
  "status": 1   // 1 = approved (done), 2 = rejected (restore wallet)
}
```

---

### 6.17 Wallet Summary (Admin)

- **GET** `/admin/wallet/details`

Returns totals: `total_balance`, `pending_balance`, `available_balance`, `total_withdrawals`, `total_earnings`.

---

### 6.18 Admin Management (CRUD)

- **GET** `/admin/admin/list`
  - Query: `page`, `limit`, `search`
- **GET** `/admin/admin/detail`
  - Query: `id`
- **POST** `/admin/admin/create`
- **PUT** `/admin/admin/update`
- **DELETE** `/admin/admin/delete`

These manage admin accounts themselves.

---

### 6.19 Current Admin Profile + Notifications

- **GET** `/admin/admin/current`
- **GET** `/admin/admin/notifications`

Both require admin auth token.

---

## 7. User/Organizer Reviews API – `/api/user-reviews/...`

Base: `http://localhost:3434/api/user-reviews`

### 7.1 Create Review (User ↔ Organizer)

- **POST** `/user-reviews/`
- **Auth**: Required (either role 1 or 2)
- **Body (JSON)**:

```json
{
  "reviewed_id": "targetUserOrOrganizerId",
  "reviewed_type": "User",    // or "Organizer"
  "rating": 5,
  "description": "Very good"
}
```

#### Success 201

```json
{
  "status": 1,
  "message": "Review created successfully",
  "data": { /* review doc */ },
  "total_count": 0
}
```

---

### 7.2 Get Reviews for Entity

- **GET** `/user-reviews/:entityType/:entityId`
  - `entityType` – `"User"` or `"Organizer"`
  - `entityId` – ID
- **Query**:
  - `page`, `limit`

---

### 7.3 Get Overall Rating

- **GET** `/user-reviews/rating/:userType/:userId`
  - `userType` – `"User"` or `"Organizer"`
  - `userId` – id

---

### 7.4 Update Review

- **PUT** `/user-reviews/:reviewId`
- **Auth**: Required (must be owner)
- **Body**: `{ "rating": 4, "description": "Edited..." }`

---

### 7.5 Delete Review

- **DELETE** `/user-reviews/:reviewId`
- **Auth**: Required (must be owner)

---

## 8. Messaging & Group Chat APIs

These routes exist under both `/api/user/...` and `/api/organizer/...`:

- `/conversations`
- `/messages`
- `/message/send`
- `/conversation/get-or-create`
- `/messages/unread-count`
- `/group-chat`

### 8.1 List Conversations

- **GET** `/user/conversations` or `/organizer/conversations`
- **Auth**: Required
- **Query**: `page`, `limit`

Returns pagination with conversation list.

---

### 8.2 Get Messages for Conversation

- **GET** `/user/messages` or `/organizer/messages`
- **Auth**: Required
- **Query**:
  - `conversation_id` – required
  - `page`, `limit`

---

### 8.3 Send Message

- **POST** `/user/message/send` or `/organizer/message/send`
- **Auth**: Required
- **Body (JSON)**:

For **1:1 chat**:

```json
{
  "event_id": "eventId",
  "receiver_id": "otherUserOrOrganizerId",
  "message": "Hello"
}
```

For **group chat**:

```json
{
  "event_id": "eventId",
  "message": "Hello group",
  "is_group_chat": true
}
```

---

### 8.4 Get or Create Conversation (1:1)

- **GET** `/user/conversation/get-or-create` or `/organizer/conversation/get-or-create`
- **Auth**: Required
- **Query**:
  - `event_id` – required
  - for organizer: `other_user_id` required

---

### 8.5 Get Unread Count

- **GET** `/user/messages/unread-count` or `/organizer/messages/unread-count`

---

### 8.6 Get Group Chat for Event

- **GET** `/user/group-chat` or `/organizer/group-chat`
- **Auth**: Required
- **Query**:
  - `event_id`

---

## 9. Quick Postman Setup Notes

- Set **Environment variable** `BASE_API_URL = http://localhost:3434/api/`
- Create **Collections**:
  - `User` – use `/user/...`, `/landing/...`, `/user-reviews/...`, messaging
  - `Organizer` – `/organizer/...` + shared messaging
  - `Admin` – `/admin/...`
- For authenticated requests:
  - First call the relevant **login** (`/user/login`, `/organizer/login`, `/admin/login`).
  - Copy the `data.token` value and use it as `Bearer <token>` in `Authorization` header.

This file should be enough to configure and **test every major endpoint** of the project in Postman. If you want, we can next create a **Postman collection JSON** based on this document.


