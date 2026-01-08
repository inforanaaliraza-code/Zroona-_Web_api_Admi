# Zuroona Platform - Complete Database Schema
## (زورونا پلیٹ فارم - مکمل ڈیٹا بیس اسکیما)

**Version:** 1.0.0  
**Database:** MongoDB  
**Date:** Current Analysis

---

## 📊 **DATABASE OVERVIEW (ڈیٹا بیس کا جائزہ)**

**Total Collections:** 20  
**Database Name:** (Configured in MONGO_URI)

---

## 🗂️ **COLLECTIONS LIST (کالیکشنز کی فہرست)**

1. **users** - Guest/User accounts
2. **organizers** - Host/Organizer accounts
3. **admins** - Admin accounts
4. **events** - Event listings
5. **book_event** - Event bookings
6. **transactions** - Payment/Withdrawal/Refund transactions
7. **wallet** - Host wallet balances
8. **refund_request** - Refund requests
9. **event_review** - Event reviews/ratings
10. **user_review** - User-to-user reviews
11. **conversations** - Chat conversations (1-on-1 & group)
12. **messages** - Chat messages
13. **notification** - System notifications
14. **notification_users** - Notification read status
15. **event_categories** - Event categories
16. **group_categories** - Organizer group categories
17. **organizer_bank_detail** - Host bank account details
18. **cms** - Content Management System (Terms, Privacy, etc.)
19. **career_application** - Job applications
20. **email_verification_token** - Email verification tokens
21. **counter** - Auto-increment counters (for order IDs)

---

## 📋 **DETAILED SCHEMA (تفصیلی اسکیما)**

---

### **1. users Collection (یوزرز)**

**Purpose:** Guest/User accounts

```javascript
{
  _id: ObjectId,
  profile_image: String,
  first_name: String,
  last_name: String,
  country_code: String,
  phone_number: Number,
  email: String,
  password: String (hashed, select: false),
  gender: Number (enum: [1, 2, 3]), // 1=Male, 2=Female, 3=Other
  date_of_birth: Date,
  description: String,
  is_delete: Number (enum: [0, 1], default: 0),
  registration_step: Number (enum: [1, 2], default: 1),
  role: Number (default: 1, enum: [1]), // 1=Guest
  otp: String (default: '123456'),
  is_verified: Boolean (default: false), // Both email AND phone verified
  phone_verified: Boolean (default: false),
  phone_verified_at: Date,
  email_verified_at: Date,
  language: String (enum: ['en', 'ar'], default: 'en'),
  fcm_token: String (default: ''),
  device_id: String (default: ''),
  nationality: String (default: ''),
  isActive: Number (enum: [1, 2], default: 1), // 1=active, 2=inactive
  is_suspended: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `email` (unique)
- `phone_number` + `country_code` (compound)

**Relationships:**
- One-to-Many: `book_event` (user_id)
- One-to-Many: `transactions` (user_id)
- One-to-Many: `refund_request` (user_id)
- One-to-Many: `event_review` (user_id)
- One-to-Many: `user_review` (reviewer_id, reviewed_id)
- One-to-Many: `conversations` (user_id)
- One-to-Many: `messages` (sender_id)

---

### **2. organizers Collection (آرگنائزرز)**

**Purpose:** Host/Organizer accounts

```javascript
{
  _id: ObjectId,
  first_name: String,
  last_name: String,
  address: String,
  country_code: String,
  phone_number: Number,
  gender: Number (enum: [1, 2, 3]),
  email: String,
  password: String (hashed, select: false),
  date_of_birth: Date,
  bio: String,
  govt_id: String,
  group_location: [{
    location: {
      type: String (enum: ['Point'], default: 'Point'),
      coordinates: [Number] // [longitude, latitude]
    },
    city_name: String
  }],
  group_category: [ObjectId], // References group_categories
  group_name: String,
  profile_image: String,
  role: Number (default: 2, enum: [2]), // 2=Organizer
  otp: String (default: '123456'),
  registration_step: Number (enum: [1, 2, 3, 4], default: 1),
  is_verified: Boolean (default: false),
  phone_verified: Boolean (default: false),
  phone_verified_at: Date,
  email_verified_at: Date,
  language: String (enum: ['en', 'ar'], default: 'en'),
  fcm_token: String (default: ''),
  isActive: Number (enum: [1, 2], default: 1),
  is_approved: Number (enum: [1, 2, 3], default: 1), // 1=pending, 2=approved, 3=rejected
  registration_type: String (enum: ['New', 'Re-apply'], default: 'New'),
  is_suspended: Boolean (default: false),
  max_event_capacity: Number (default: 100, min: 1, max: 1000),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `email` (unique)
- `phone_number` + `country_code` (compound)
- `group_location.location` (2dsphere for geospatial queries)

**Relationships:**
- One-to-Many: `events` (organizer_id)
- One-to-Many: `book_event` (organizer_id)
- One-to-Many: `transactions` (organizer_id)
- One-to-One: `wallet` (organizer_id)
- One-to-One: `organizer_bank_detail` (organizer_id)
- One-to-Many: `user_review` (reviewer_id, reviewed_id)
- One-to-Many: `conversations` (organizer_id)

---

### **3. admins Collection (ایڈمنز)**

**Purpose:** Admin accounts

```javascript
{
  _id: ObjectId,
  image: String,
  firstName: String,
  lastName: String,
  countryCode: String,
  mobileNumber: Number,
  email: String,
  otp: String (default: '123456'),
  gender: Number,
  dateOfBirth: Date,
  is_verified: Boolean (default: false),
  bio: String,
  role: Number (default: 3), // 3=Admin
  password: String (hashed),
  language: String (default: 'en'),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `email` (unique)

**Relationships:**
- One-to-Many: `refund_request` (processed_by)
- One-to-Many: `transactions` (processed_by)
- One-to-Many: `career_application` (reviewed_by)

---

### **4. events Collection (ایونٹس)**

**Purpose:** Event listings

```javascript
{
  _id: ObjectId,
  organizer_id: ObjectId (required, ref: 'organizers'),
  event_date: Date (required),
  event_start_time: String (required),
  event_end_time: String (required),
  event_name: String (required),
  event_images: [String] (required, max: 5),
  event_image: String (required), // Main image
  event_description: String,
  event_address: String (required),
  location: {
    type: String (enum: ['Point'], default: 'Point'),
    coordinates: [Number] // [longitude, latitude]
  },
  no_of_attendees: Number (default: 1),
  event_price: Number (required),
  dos_instruction: String,
  do_not_instruction: String,
  is_delete: Number (enum: [0, 1], default: 0),
  is_approved: Number (enum: [0, 1, 2], default: 0), // 0=pending, 1=approved, 2=rejected
  event_type: Number (enum: [1, 2], default: 1),
  event_category: ObjectId (required, ref: 'event_categories'),
  event_categories: [ObjectId] (default: []), // Multiple categories
  event_types: [String] (default: []), // Multiple event types
  event_for: Number (enum: [1, 2, 3], required), // 1=Male, 2=Female, 3=Both
  isActive: Number (enum: [1, 2], default: 1),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `organizer_id`
- `event_category`
- `location` (2dsphere for geospatial queries)
- `is_approved` + `isActive` (compound)
- `event_date`

**Relationships:**
- Many-to-One: `organizers` (organizer_id)
- One-to-Many: `book_event` (event_id)
- One-to-Many: `event_review` (event_id)
- One-to-Many: `conversations` (event_id)
- Many-to-One: `event_categories` (event_category)

---

### **5. book_event Collection (بک ایونٹ)**

**Purpose:** Event bookings

```javascript
{
  _id: ObjectId,
  event_id: ObjectId (required, ref: 'events'),
  no_of_attendees: Number (required),
  user_id: ObjectId (required, ref: 'users'),
  organizer_id: ObjectId (required, ref: 'organizers'),
  total_amount_attendees: Number (required),
  total_tax_attendees: Number (required),
  total_amount: Number (required),
  book_status: Number (enum: [1, 2, 3, 4, 5, 6], default: 1),
  // 1=pending, 2=confirmed, 3=cancelled, 4=rejected, 5=completed, 6=refunded
  refund_request_id: ObjectId (ref: 'refund_request', default: null),
  payment_status: Number (enum: [0, 1], default: 0), // 0=pending, 1=paid
  payment_id: String, // Moyasar payment ID
  order_id: String, // Auto-generated: JN-OD-{seq}
  payment_data: Object (default: null),
  invoice_id: String (default: null), // Fatora/Daftra invoice ID
  invoice_url: String (default: null), // Invoice PDF URL
  rejection_reason: String (default: null),
  confirmed_at: Date (default: null),
  hold_expires_at: Date (default: null), // Booking hold expiry
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `user_id`
- `organizer_id`
- `event_id`
- `order_id` (unique)
- `payment_id`
- `book_status` + `payment_status` (compound)

**Relationships:**
- Many-to-One: `events` (event_id)
- Many-to-One: `users` (user_id)
- Many-to-One: `organizers` (organizer_id)
- One-to-One: `refund_request` (refund_request_id)
- One-to-Many: `transactions` (book_id)
- One-to-One: `conversations` (booking_id)

---

### **6. transactions Collection (ٹرانزیکشنز)**

**Purpose:** Payment/Withdrawal/Refund transactions

```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: 'users'),
  organizer_id: ObjectId (required, ref: 'organizers'),
  amount: Number (required),
  currency: String (enum: ['SAR', 'USD', 'EUR', ...], default: 'SAR'),
  type: Number (enum: [1, 2, 3], required),
  // 1=credit (earning/payment), 2=debit (withdrawal), 3=refund
  payment_id: String, // Moyasar payment ID
  book_id: ObjectId (ref: 'event_books'),
  status: Number (enum: [0, 1, 2], default: 0),
  // 0=pending, 1=success, 2=failed/rejected
  invoice_id: String (default: null),
  invoice_url: String (default: null),
  withdrawal_method: String (enum: ['bank_transfer', 'wallet', 'other'], default: 'bank_transfer'),
  bank_details: {
    bank_name: String,
    account_holder_name: String,
    account_number: String,
    iban: String,
    swift_code: String,
    branch_name: String
  },
  admin_notes: String (default: null),
  rejection_reason: String (default: null),
  processed_by: ObjectId (ref: 'admins'),
  processed_at: Date (default: null),
  transaction_reference: String (default: null), // Payout transaction ID
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `user_id`
- `organizer_id`
- `book_id`
- `type` + `status` (compound)
- `payment_id`

**Relationships:**
- Many-to-One: `users` (user_id)
- Many-to-One: `organizers` (organizer_id)
- Many-to-One: `book_event` (book_id)
- Many-to-One: `admins` (processed_by)

---

### **7. wallet Collection (والیٹ)**

**Purpose:** Host wallet balances

```javascript
{
  _id: ObjectId,
  organizer_id: ObjectId (required, ref: 'organizers', unique),
  total_amount: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `organizer_id` (unique)

**Relationships:**
- One-to-One: `organizers` (organizer_id)

---

### **8. refund_request Collection (ریفنڈ ریکویسٹ)**

**Purpose:** Refund requests

```javascript
{
  _id: ObjectId,
  booking_id: ObjectId (required, ref: 'book_event'),
  user_id: ObjectId (required, ref: 'users'),
  event_id: ObjectId (required, ref: 'events'),
  organizer_id: ObjectId (required, ref: 'organizers'),
  amount: Number (required),
  refund_reason: String (required),
  status: Number (enum: [0, 1, 2, 3], default: 0),
  // 0=pending, 1=approved, 2=rejected, 3=processed
  admin_response: String (default: null),
  processed_by: ObjectId (ref: 'admins', default: null),
  processed_at: Date (default: null),
  payment_refund_id: String (default: null), // Moyasar refund ID
  refund_transaction_id: ObjectId (ref: 'transaction', default: null),
  refund_error: String (default: null),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `user_id` + `status` (compound)
- `booking_id`
- `status`

**Relationships:**
- Many-to-One: `book_event` (booking_id)
- Many-to-One: `users` (user_id)
- Many-to-One: `events` (event_id)
- Many-to-One: `organizers` (organizer_id)
- Many-to-One: `admins` (processed_by)
- One-to-One: `transactions` (refund_transaction_id)

---

### **9. event_review Collection (ایونٹ ریویو)**

**Purpose:** Event reviews/ratings

```javascript
{
  _id: ObjectId,
  event_id: ObjectId (required, ref: 'events'),
  user_id: ObjectId (required, ref: 'users'),
  description: String,
  rating: Number, // 1-5 stars
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `event_id`
- `user_id`
- `event_id` + `user_id` (compound, unique)

**Relationships:**
- Many-to-One: `events` (event_id)
- Many-to-One: `users` (user_id)

---

### **10. user_review Collection (یوزر ریویو)**

**Purpose:** User-to-user reviews (Guest ↔ Host)

```javascript
{
  _id: ObjectId,
  reviewer_id: ObjectId (required, refPath: 'reviewer_type'),
  reviewer_type: String (required, enum: ['User', 'Organizer']),
  reviewed_id: ObjectId (required, refPath: 'reviewed_type'),
  reviewed_type: String (required, enum: ['User', 'Organizer']),
  rating: Number (required, min: 1, max: 5),
  description: String,
  is_delete: Number (enum: [0, 1], default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `reviewer_id` + `reviewed_id` + `is_delete` (compound, unique)

**Relationships:**
- Many-to-One: `users` or `organizers` (reviewer_id)
- Many-to-One: `users` or `organizers` (reviewed_id)

---

### **11. conversations Collection (کانورسیشنز)**

**Purpose:** Chat conversations (1-on-1 & group chats)

```javascript
{
  _id: ObjectId,
  event_id: ObjectId (required, ref: 'Event'),
  booking_id: ObjectId (ref: 'book_event', default: null),
  user_id: ObjectId (ref: 'user', required if !is_group),
  organizer_id: ObjectId (required, ref: 'organizer'),
  is_group: Boolean (default: false),
  group_name: String (default: null),
  participants: [{
    user_id: ObjectId (required, ref: 'user'),
    role: Number (enum: [1, 2]), // 1=User/Guest, 2=Organizer
    joined_at: Date (default: Date.now),
    left_at: Date (default: null)
  }],
  closed_at: Date (default: null),
  auto_close_after_hours: Number (default: 24),
  last_message: String (default: ''),
  last_message_at: Date (default: Date.now),
  last_sender_id: ObjectId (default: null),
  last_sender_role: Number (enum: [1, 2], default: null),
  unread_count_user: Number (default: 0),
  unread_count_organizer: Number (default: 0),
  status: String (enum: ['active', 'archived', 'blocked', 'closed'], default: 'active'),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `user_id` + `last_message_at` (compound)
- `organizer_id` + `last_message_at` (compound)
- `event_id`
- `participants.user_id`
- `event_id` + `user_id` + `organizer_id` (unique, partial: is_group=false)
- `event_id` + `is_group` (unique, partial: is_group=true)

**Relationships:**
- Many-to-One: `events` (event_id)
- Many-to-One: `book_event` (booking_id)
- Many-to-One: `users` (user_id)
- Many-to-One: `organizers` (organizer_id)
- One-to-Many: `messages` (conversation_id)

---

### **12. messages Collection (میسجز)**

**Purpose:** Chat messages

```javascript
{
  _id: ObjectId,
  conversation_id: ObjectId (required, ref: 'conversation'),
  sender_id: ObjectId (required),
  sender_role: Number (enum: [1, 2], required), // 1=User, 2=Organizer
  message: String (required, trim: true),
  message_type: String (enum: ['text', 'image', 'file'], default: 'text'),
  attachment_url: String (default: null),
  isRead: Boolean (default: false),
  readAt: Date (default: null),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `conversation_id` + `createdAt` (compound)
- `sender_id`

**Relationships:**
- Many-to-One: `conversations` (conversation_id)

---

### **13. notification Collection (نوٹیفیکیشن)**

**Purpose:** System notifications

```javascript
{
  _id: ObjectId,
  user_id: ObjectId (required),
  role: Number (enum: [1, 2, 3]), // 1=User, 2=Organizer, 3=Admin
  title: String,
  description: String,
  isRead: Boolean (default: false),
  profile_image: String,
  username: String,
  senderId: ObjectId,
  event_id: ObjectId,
  book_id: ObjectId,
  notification_type: Number,
  status: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `user_id` + `role`
- `isRead`
- `createdAt`

**Relationships:**
- Many-to-Many: `notification_users` (via notification_id)

---

### **14. notification_users Collection (نوٹیفیکیشن یوزرز)**

**Purpose:** Notification read status per user

```javascript
{
  _id: ObjectId,
  notification_id: ObjectId (required, ref: 'notification'),
  user_id: ObjectId (required),
  isRead: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `notification_id`
- `user_id`
- `notification_id` + `user_id` (compound)

**Relationships:**
- Many-to-One: `notification` (notification_id)

---

### **15. event_categories Collection (ایونٹ کیٹیگریز)**

**Purpose:** Event categories

```javascript
{
  _id: ObjectId,
  name: {
    ar: String,
    en: String
  },
  selected_image: String,
  unselected_image: String,
  is_delete: Number (enum: [0, 1], default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `is_delete`

**Relationships:**
- One-to-Many: `events` (event_category)

---

### **16. group_categories Collection (گروپ کیٹیگریز)**

**Purpose:** Organizer group categories

```javascript
{
  _id: ObjectId,
  name: {
    ar: String,
    en: String
  },
  selected_image: String,
  unselected_image: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Relationships:**
- Many-to-Many: `organizers` (group_category array)

---

### **17. organizer_bank_detail Collection (آرگنائزر بینک ڈیٹیل)**

**Purpose:** Host bank account details

```javascript
{
  _id: ObjectId,
  organizer_id: ObjectId (required, ref: 'organizers'),
  account_holder_name: String,
  bank_name: String,
  account_number: String,
  ifsc_code: String,
  iban: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `organizer_id` (unique)

**Relationships:**
- One-to-One: `organizers` (organizer_id)

---

### **18. cms Collection (سی ایم ایس)**

**Purpose:** Content Management System (Terms, Privacy, etc.)

```javascript
{
  _id: ObjectId,
  type: String (enum: ['1', '2', '3']), // 1=Terms, 2=Privacy, 3=Other
  description: String,
  description_ar: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `type`

---

### **19. career_application Collection (کیریئر اپلیکیشن)**

**Purpose:** Job applications

```javascript
{
  _id: ObjectId,
  first_name: String (required, trim: true),
  last_name: String (required, trim: true),
  email: String (required, lowercase, trim: true, unique),
  phone_number: String (trim: true),
  position: String (required, trim: true),
  cover_letter: String (required, trim: true),
  resume_url: String (default: null),
  status: Number (enum: [0, 1, 2, 3], default: 0),
  // 0=Pending, 1=Under Review, 2=Accepted, 3=Rejected
  notes: String (default: null),
  reviewed_by: ObjectId (ref: 'admin', default: null),
  reviewed_at: Date (default: null),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `email`
- `status`
- `position`
- `createdAt`

**Relationships:**
- Many-to-One: `admins` (reviewed_by)

---

### **20. email_verification_token Collection (ای میل ویریفیکیشن ٹوکن)**

**Purpose:** Email verification tokens

```javascript
{
  _id: ObjectId,
  token: String (required, unique, index: true),
  user_id: ObjectId (required, refPath: 'user_type'),
  user_type: String (required, enum: ['user', 'organizer', 'admin']),
  email: String (required),
  expiresAt: Date (required, index: true),
  isUsed: Boolean (default: false),
  usedAt: Date (default: null),
  token_type: String (enum: ['email_verification', 'password_reset'], default: 'email_verification'),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `token` + `isUsed` (compound)
- `expiresAt` (TTL index - auto-delete expired)

**Relationships:**
- Many-to-One: `users`, `organizers`, or `admins` (user_id based on user_type)

---

### **21. counter Collection (کاؤنٹر)**

**Purpose:** Auto-increment counters (for order IDs)

```javascript
{
  _id: ObjectId,
  name: String (required, unique), // e.g., 'order_id'
  seq: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `name` (unique)

---

## 🔗 **ENTITY RELATIONSHIP DIAGRAM (ای آر ڈی)**

```
┌─────────────┐
│    users    │
└──────┬──────┘
       │
       ├───┐
       │   │
       ▼   ▼
┌─────────────┐     ┌──────────────┐
│ book_event  │────▶│    events    │
└──────┬──────┘     └──────┬───────┘
       │                   │
       │                   │
       ▼                   ▼
┌─────────────┐     ┌──────────────┐
│transactions │     │  organizers  │
└─────────────┘     └──────┬───────┘
                           │
                           │
                           ▼
                    ┌─────────────┐
                    │   wallet    │
                    └─────────────┘

┌─────────────┐
│refund_request│────▶┌─────────────┐
└─────────────┘     │ book_event  │
                    └─────────────┘

┌─────────────┐
│conversations│────▶┌─────────────┐
└──────┬──────┘     │    events   │
       │            └─────────────┘
       │
       ▼
┌─────────────┐
│   messages  │
└─────────────┘
```

---

## 📊 **DATA FLOW DIAGRAMS (ڈیٹا فلو ڈایاگرام)**

### **Payment Flow:**
```
Guest Payment
    │
    ▼
book_event (payment_status: 0 → 1)
    │
    ▼
transactions (type: 1, status: 1)
    │
    ▼
wallet (total_amount += amount) [NOT AUTOMATIC - NEEDS FIX]
```

### **Refund Flow:**
```
refund_request (status: 0)
    │
    ▼
Admin Approval
    │
    ▼
refund_request (status: 1)
    │
    ▼
transactions (type: 3, status: 1)
    │
    ▼
book_event (book_status: 6, refunded)
```

### **Withdrawal Flow:**
```
organizer_bank_detail
    │
    ▼
transactions (type: 2, status: 0)
    │
    ▼
Admin Approval
    │
    ▼
transactions (type: 2, status: 1)
    │
    ▼
wallet (total_amount -= amount)
```

---

## 🔍 **KEY RELATIONSHIPS SUMMARY (اہم تعلقات کا خلاصہ)**

| Collection | Relationship | Related Collection | Field |
|------------|-------------|---------------------|-------|
| users | One-to-Many | book_event | user_id |
| users | One-to-Many | transactions | user_id |
| organizers | One-to-Many | events | organizer_id |
| organizers | One-to-One | wallet | organizer_id |
| organizers | One-to-One | organizer_bank_detail | organizer_id |
| events | One-to-Many | book_event | event_id |
| book_event | One-to-Many | transactions | book_id |
| book_event | One-to-One | refund_request | refund_request_id |
| conversations | One-to-Many | messages | conversation_id |

---

## 📝 **NOTES (نوٹس)**

1. **Timestamps:** All collections have `createdAt` and `updatedAt` (Mongoose timestamps)
2. **Soft Delete:** Some collections use `is_delete` flag instead of hard delete
3. **Geospatial:** `events` and `organizers` have location fields with 2dsphere indexes
4. **Auto-increment:** `book_event.order_id` uses counter collection
5. **Dynamic References:** `user_review` uses `refPath` for polymorphic relationships

---

**Document Generated:** Complete Database Schema  
**Last Updated:** Current Analysis  
**Status:** Production Ready

