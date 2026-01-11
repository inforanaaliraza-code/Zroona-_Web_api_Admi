# Refund Module Testing Guide

## 🎯 Quick Testing Summary

### **Flow Overview:**

1. **Customer (User)** → Request refund for cancelled booking
2. **Admin** → Review & Approve/Reject refund
3. **Admin** → Process refund via payment gateway
4. **Customer** → Receive refund notification & status update

---

## 📋 **3 Stakeholders Flow:**

### **1. CUSTOMER (User) Flow:**
```
Step 1: Cancel booking (book_status = 3)
Step 2: Request refund
   POST /api/user/refund/request
   Body: { booking_id, refund_reason (min 10 chars) }
   
Step 3: Check refund status
   GET /api/user/refund/list
   GET /api/user/refund/detail?refund_id=xxx
   
Expected: Status = 0 (Pending) → 1 (Approved) → 3 (Processed)
```

### **2. HOST (Organizer) Flow:**
```
⚠️ Host does NOT directly handle refunds
- Host only sees bookings getting cancelled
- Refunds are handled between Customer & Admin
- Host receives booking cancellation notifications only
```

### **3. ADMIN Flow:**
```
Step 1: View all refund requests
   GET /api/admin/refund/list?status=0&page=1&limit=10
   
Step 2: View refund detail
   GET /api/admin/refund/detail?refund_id=xxx
   
Step 3: Approve/Reject refund
   PUT /api/admin/refund/update-status
   Body: {
     refund_id,
     status: 1 (approve) or 2 (reject),
     admin_response: "Optional reason",
     payment_refund_id: "From Moyasar" (if approved)
   }
   
Step 4: Process refund (if approved)
   - System automatically processes via Moyasar
   - Updates booking status to 6 (Refunded)
   - Creates transaction record
```

---

## 🧪 **How to Test - Step by Step:**

### **Test Case 1: Happy Path (Full Flow)**

1. **Create Booking & Payment:**
   - Create event
   - User books event
   - Payment successful (payment_status = 1)

2. **Cancel Booking:**
   - User cancels booking
   - book_status changes to 3 (Cancelled)

3. **Request Refund:**
   ```bash
   POST /api/user/refund/request
   Headers: { Authorization: Bearer <user_token>, lang: "en" }
   Body: {
     "booking_id": "xxx",
     "refund_reason": "Unable to attend the event"
   }
   ```
   ✅ Expected: Refund request created (status = 0)

4. **Admin Reviews:**
   ```bash
   GET /api/admin/refund/list?status=0
   Headers: { Authorization: Bearer <admin_token> }
   ```
   ✅ Expected: See new refund request

5. **Admin Approves:**
   ```bash
   PUT /api/admin/refund/update-status
   Body: {
     "refund_id": "xxx",
     "status": 1,
     "admin_response": "Refund approved"
   }
   ```
   ✅ Expected: Status = 1 (Approved)

6. **Admin Processes Refund:**
   - System processes via Moyasar payment gateway
   - payment_refund_id saved
   - Status = 3 (Processed)
   - Booking status = 6 (Refunded)
   - Transaction record created

7. **Customer Checks Status:**
   ```bash
   GET /api/user/refund/detail?refund_id=xxx
   ```
   ✅ Expected: Status = 3, refund processed

---

### **Test Case 2: Edge Cases**

**2.1 Duplicate Refund Request:**
- Try requesting refund twice for same booking
- ✅ Expected: Error "Refund request already submitted"

**2.2 Refund for Non-Cancelled Booking:**
- Request refund for active booking (status ≠ 3)
- ✅ Expected: Error "Refund can only be requested for cancelled bookings"

**2.3 Refund for Unpaid Booking:**
- Request refund when payment_status ≠ 1
- ✅ Expected: Error "Refund can only be requested for paid bookings"

**2.4 Admin Rejects Refund:**
- Admin sets status = 2 (Rejected)
- ✅ Expected: Refund rejected, customer notified, booking stays cancelled

**2.5 Short Refund Reason:**
- Submit refund_reason < 10 characters
- ✅ Expected: Validation error

---

## 🔍 **In-Depth Testing Checklist:**

### **API Endpoints Testing:**

#### **Customer Endpoints:**
- [ ] `POST /api/user/refund/request` - Create refund request
- [ ] `GET /api/user/refund/list` - List user's refunds
- [ ] `GET /api/user/refund/detail` - Get refund details

#### **Admin Endpoints:**
- [ ] `GET /api/admin/refund/list` - List all refunds (with filters)
- [ ] `GET /api/admin/refund/detail` - Get refund details
- [ ] `PUT /api/admin/refund/update-status` - Approve/Reject/Process

### **Validation Testing:**
- [ ] Missing booking_id
- [ ] Invalid booking_id format
- [ ] Booking belongs to different user
- [ ] Refund reason too short (< 10 chars)
- [ ] Missing required fields

### **Business Logic Testing:**
- [ ] Only cancelled bookings (status = 3) can request refund
- [ ] Only paid bookings (payment_status = 1) can request refund
- [ ] No duplicate refund requests
- [ ] Cannot process already processed refund (status = 3)
- [ ] Cannot approve already approved refund

### **Payment Gateway Integration:**
- [ ] Moyasar refund API call works
- [ ] payment_refund_id saved correctly
- [ ] Error handling if Moyasar fails
- [ ] Transaction record created (type = 3)

### **Notification Testing:**
- [ ] Admin notified on new refund request
- [ ] Customer notified on approval
- [ ] Customer notified on rejection
- [ ] Customer notified on processing

### **Database Testing:**
- [ ] Refund request saved correctly
- [ ] Booking updated with refund_request_id
- [ ] Status transitions correct (0→1→3 or 0→2)
- [ ] processed_by and processed_at fields set
- [ ] Transaction record created

### **Frontend Testing (Web/Admin):**
- [ ] Customer can see refund request form
- [ ] Customer can view refund status
- [ ] Admin can see refund list
- [ ] Admin can filter by status
- [ ] Admin can approve/reject
- [ ] Status updates reflect in UI

---

## 🚀 **Quick Test Commands:**

### **Using Postman/Thunder Client:**

1. **Customer Request Refund:**
```
POST {{base_url}}/api/user/refund/request
Headers: {
  Authorization: Bearer {{user_token}},
  lang: en
}
Body: {
  "booking_id": "67abc123...",
  "refund_reason": "Unable to attend due to emergency"
}
```

2. **Admin List Refunds:**
```
GET {{base_url}}/api/admin/refund/list?status=0&page=1&limit=10
Headers: {
  Authorization: Bearer {{admin_token}},
  lang: en
}
```

3. **Admin Update Status:**
```
PUT {{base_url}}/api/admin/refund/update-status
Headers: {
  Authorization: Bearer {{admin_token}},
  lang: en
}
Body: {
  "refund_id": "67def456...",
  "status": 1,
  "admin_response": "Approved - refund will be processed"
}
```

---

## 📊 **Status Codes:**

- **0** = Pending (Awaiting admin review)
- **1** = Approved (Admin approved, ready to process)
- **2** = Rejected (Admin rejected refund)
- **3** = Processed (Refund completed via payment gateway)

---

## ✅ **Success Criteria:**

1. ✅ Customer can request refund for cancelled paid bookings
2. ✅ Admin can view and filter refund requests
3. ✅ Admin can approve/reject refunds
4. ✅ Approved refunds processed via Moyasar
5. ✅ All stakeholders receive appropriate notifications
6. ✅ Booking status updates correctly
7. ✅ Transaction records created
8. ✅ Error handling works for edge cases

---

**Note:** Host/Organizer does NOT have direct refund functionality. Refunds are between Customer and Admin only.
