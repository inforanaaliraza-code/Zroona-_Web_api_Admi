# Moyasar Refund Integration - Implementation Summary

## Overview
Complete integration of Moyasar payment gateway for automatic refund processing when admins approve refund requests.

## Implementation Date
2024-01-01

## Features Implemented

### 1. Moyasar Refund Service
- **File:** `api/src/helpers/MoyasarService.js`
- **New Methods:**
  - `refundPayment(paymentId, amount, description)` - Process refund via Moyasar API
  - `getPayment(paymentId)` - Fetch payment details from Moyasar

### 2. Automatic Refund Processing
- **File:** `api/src/controllers/adminController.js`
- **Function:** `refundStatusUpdate`
- **Behavior:**
  - When admin approves refund (status = 1), system automatically processes refund via Moyasar
  - Uses original `payment_id` from booking
  - Stores Moyasar refund ID in database
  - Handles errors gracefully (continues with approval even if Moyasar refund fails)

### 3. Refund Request Model Updates
- **File:** `api/src/models/refundRequestModel.js`
- **New Field:**
  - `refund_error` - Stores error messages if Moyasar refund fails

### 4. Transaction Tracking
- Refund transactions are automatically created
- Status: `1` (Success) if Moyasar refund succeeds, `0` (Pending) if it fails
- Stores Moyasar refund ID in `payment_id` field

## Refund Flow

### Step 1: User Requests Refund
```
POST /api/user/refund/request
{
  "book_id": "booking_id",
  "reason": "Cancellation reason"
}
```

### Step 2: Admin Reviews Request
```
GET /api/admin/refund/list
```

### Step 3: Admin Approves Refund
```
PUT /api/admin/refund/update-status
{
  "refund_id": "refund_request_id",
  "status": 1,  // 1: Approved
  "admin_response": "Optional message"
}
```

**What Happens:**
1. System fetches booking details
2. Extracts `payment_id` from booking
3. Calls Moyasar refund API with:
   - Payment ID: `booking.payment_id`
   - Amount: `refundRequest.amount` (in halala)
   - Description: Auto-generated with booking details
4. Stores Moyasar refund ID in `payment_refund_id`
5. Creates refund transaction record
6. Updates booking status to `Refunded` (6)
7. Sends notification to user

### Step 4: Refund Processed
- If Moyasar refund succeeds: Status = `Approved` (1), Transaction status = `Success` (1)
- If Moyasar refund fails: Status = `Approved` (1), Transaction status = `Pending` (0), Error stored in `refund_error`

## API Integration Details

### Moyasar Refund API
```
POST https://api.moyasar.com/v1/payments/{payment_id}/refund
```

**Authentication:**
- Basic Auth
- Username: `MOYASAR_SECRET_KEY`
- Password: (empty)

**Request Body:**
```json
{
  "amount": 10000,  // Amount in halala (SAR * 100)
  "description": "Refund description"
}
```

**Response:**
```json
{
  "id": "refund_id",
  "amount": 10000,
  "currency": "SAR",
  "status": "refunded",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

## Error Handling

### Graceful Degradation
- If Moyasar refund fails, refund request is still approved
- Error message stored in `refund_error` field
- Admin can manually process refund later
- User is notified that refund is approved but processing may take time

### Common Error Scenarios
1. **No Payment ID:** Booking doesn't have `payment_id` → Error logged, approval continues
2. **Payment Not Found:** Moyasar returns 404 → Error stored, approval continues
3. **Already Refunded:** Payment already refunded → Error stored, approval continues
4. **API Error:** Network or Moyasar API error → Error stored, approval continues

## Database Schema Updates

### RefundRequest Model
```javascript
{
  // ... existing fields ...
  payment_refund_id: String,      // Moyasar refund ID
  refund_transaction_id: ObjectId, // Transaction record ID
  refund_error: String,            // Error message if refund fails
}
```

### Transaction Model
```javascript
{
  // ... existing fields ...
  type: Number,  // 3 = Refund
  status: Number, // 0 = Pending, 1 = Success
  payment_id: String, // Moyasar refund ID
}
```

## Environment Variables

### Required
```env
MOYASAR_SECRET_KEY=sk_test_@sG6LYsSoX4hixpSwCZEiaac1TSLtKXMy91Yen6B
MOYASAR_PUBLISHABLE_KEY=pk_test_GUUdMyrNufV9xb59FBSAYi9jniyhvVDa9U2524pV
```

### Optional (for backward compatibility)
```env
MOYASAR_API_KEY=sk_test_@sG6LYsSoX4hixpSwCZEiaac1TSLtKXMy91Yen6B
MOYASAR_SECRET=sk_test_@sG6LYsSoX4hixpSwCZEiaac1TSLtKXMy91Yen6B
```

## Files Modified

1. **api/src/helpers/MoyasarService.js**
   - Added `refundPayment()` method
   - Added `getPayment()` method

2. **api/src/controllers/adminController.js**
   - Updated `refundStatusUpdate()` to process Moyasar refunds
   - Added error handling and logging

3. **api/src/models/refundRequestModel.js**
   - Added `refund_error` field

## Files Created

1. **api/MOYASAR_REFUND_CREDENTIALS_GUIDE.md**
   - Complete guide for obtaining and configuring Moyasar credentials

2. **api/MOYASAR_REFUND_IMPLEMENTATION_SUMMARY.md**
   - This file - implementation summary

## Testing

### Test Scenarios

1. **Successful Refund**
   - Create test booking with payment_id
   - Request refund
   - Approve refund
   - Verify Moyasar refund ID stored
   - Verify transaction created
   - Verify booking status updated

2. **Failed Refund (No Payment ID)**
   - Create booking without payment_id
   - Request refund
   - Approve refund
   - Verify error stored in `refund_error`
   - Verify refund request still approved

3. **Failed Refund (Invalid Payment ID)**
   - Create booking with invalid payment_id
   - Request refund
   - Approve refund
   - Verify error stored
   - Verify graceful handling

### Test Script
Run the test script to verify implementation:
```bash
cd api
node test-moyasar-refund-implementation.js
```

## Logging

### Log Messages
- `[MOYASAR:REFUND] Processing refund for payment {payment_id}`
- `[MOYASAR:REFUND] Refund successful: {refund_id}`
- `[MOYASAR:REFUND] Error processing refund: {error}`
- `[ADMIN:REFUND:MOYASAR] Refund processed successfully`
- `[ADMIN:REFUND:MOYASAR] Refund failed: {error}`

## Security Considerations

1. **API Key Protection**
   - Secret key only used in backend
   - Never exposed to frontend
   - Stored in environment variables

2. **Error Messages**
   - Detailed errors logged server-side
   - Generic messages sent to users
   - No sensitive data in user-facing errors

3. **Transaction Verification**
   - All refunds tracked in database
   - Moyasar refund IDs stored for audit
   - Transaction records for accounting

## Future Enhancements

1. **Partial Refunds**
   - Support for partial refund amounts
   - Admin can specify refund amount

2. **Refund Retry**
   - Automatic retry for failed refunds
   - Scheduled job to retry pending refunds

3. **Refund Webhooks**
   - Listen to Moyasar refund webhooks
   - Auto-update refund status

4. **Refund Analytics**
   - Dashboard for refund statistics
   - Success/failure rates
   - Average refund processing time

## Support

- **Moyasar Documentation:** [https://moyasar.com/docs](https://moyasar.com/docs)
- **Moyasar Support:** support@moyasar.com
- **Implementation Guide:** See `MOYASAR_REFUND_CREDENTIALS_GUIDE.md`

---

**Status:** ✅ Complete
**Version:** 1.0.0
**Last Updated:** 2024-01-01

