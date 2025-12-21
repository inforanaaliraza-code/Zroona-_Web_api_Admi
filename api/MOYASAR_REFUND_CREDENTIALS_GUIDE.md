# Moyasar Payment Gateway - Refund Integration Guide

## Overview
This guide explains how to obtain and configure Moyasar payment gateway credentials for refund processing in the Zuroona platform.

## Credentials Required

### 1. Moyasar API Keys

You need two types of keys from Moyasar:

#### **Publishable Key (Public Key)**
- Used in frontend for payment forms
- Safe to expose in client-side code
- Format: `pk_test_...` (test) or `pk_live_...` (production)

#### **Secret Key (Private Key)**
- Used in backend for API operations (refunds, captures, etc.)
- **NEVER expose this in client-side code**
- Format: `sk_test_...` (test) or `sk_live_...` (production)

## How to Obtain Credentials

### Step 1: Create Moyasar Account
1. Visit [https://moyasar.com](https://moyasar.com)
2. Sign up for a new account or log in to existing account
3. Complete business verification (required for production)

### Step 2: Access Dashboard
1. Log in to your Moyasar dashboard
2. Navigate to **Settings** → **API Keys**

### Step 3: Get Test Keys (Development)
1. In the dashboard, find **Test Mode** section
2. Copy the **Publishable Key** (starts with `pk_test_`)
3. Copy the **Secret Key** (starts with `sk_test_`)
4. **Note:** Test keys are for development only and won't process real payments

### Step 4: Get Production Keys (Live)
1. Complete business verification
2. Switch to **Live Mode** in dashboard
3. Navigate to **Settings** → **API Keys** → **Live Mode**
4. Copy the **Publishable Key** (starts with `pk_live_`)
5. Copy the **Secret Key** (starts with `sk_live_`)
6. **Important:** Production keys process real money transactions

## Environment Variables Setup

Add the following to your `.env` file:

```env
# Moyasar Payment Gateway
MOYASAR_PUBLISHABLE_KEY=pk_test_GUUdMyrNufV9xb59FBSAYi9jniyhvVDa9U2524pV
MOYASAR_SECRET_KEY=sk_test_@sG6LYsSoX4hixpSwCZEiaac1TSLtKXMy91Yen6B

# Alternative variable names (for backward compatibility)
MOYASAR_API_KEY=sk_test_@sG6LYsSoX4hixpSwCZEiaac1TSLtKXMy91Yen6B
MOYASAR_SECRET=sk_test_@sG6LYsSoX4hixpSwCZEiaac1TSLtKXMy91Yen6B

# Payment Signature Secret (for webhook verification)
MOYASAR_SIGNATURE_SECRET=your_webhook_secret_here
```

## Frontend Configuration

In your frontend `.env` or environment config:

```env
NEXT_PUBLIC_MOYASAR_KEY=pk_test_GUUdMyrNufV9xb59FBSAYi9jniyhvVDa9U2524pV
```

**Important:** Only use the **Publishable Key** in frontend, never the Secret Key!

## Refund Processing Flow

### How Refunds Work

1. **User Requests Refund**
   - User submits refund request for cancelled booking
   - Request stored with status: `pending` (0)

2. **Admin Reviews Request**
   - Admin views refund request in admin panel
   - Admin can approve or reject

3. **Refund Processing (When Approved)**
   - System automatically calls Moyasar refund API
   - Uses original `payment_id` from booking
   - Refunds full or partial amount
   - Stores Moyasar refund ID in database

4. **Status Updates**
   - Booking status → `Refunded` (6)
   - Refund request status → `Approved` (1) or `Processed` (3)
   - Transaction record created
   - User notification sent

## API Endpoints

### Admin Refund Management

#### Update Refund Status
```
PUT /api/admin/refund/update-status
```

**Request Body:**
```json
{
  "refund_id": "refund_request_id",
  "status": 1,  // 1: Approved, 2: Rejected, 3: Processed
  "admin_response": "Optional admin message",
  "payment_refund_id": "Optional manual refund ID"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "refund_id": "...",
    "status": 1,
    "payment_refund_id": "moyasar_refund_id",
    "processed_at": "2024-01-01T00:00:00.000Z"
  }
}
```

## Moyasar Refund API Details

### Endpoint
```
POST https://api.moyasar.com/v1/payments/{payment_id}/refund
```

### Authentication
- Uses **Basic Auth** with Secret Key as username
- Password is empty string

### Request Body
```json
{
  "amount": 10000,  // Amount in halala (SAR * 100)
  "description": "Refund description"
}
```

### Response
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

### Common Errors

1. **Invalid Payment ID**
   - Error: Payment not found
   - Solution: Verify `payment_id` exists in booking

2. **Already Refunded**
   - Error: Payment already refunded
   - Solution: Check refund status before processing

3. **Insufficient Funds**
   - Error: Cannot refund more than original amount
   - Solution: Verify refund amount ≤ original payment

4. **Invalid API Key**
   - Error: Unauthorized
   - Solution: Verify Secret Key is correct and active

## Testing

### Test Mode
- Use test keys (`sk_test_...`)
- Test refunds with test payment IDs
- No real money is processed

### Test Payment IDs
- Create test payments via Moyasar dashboard
- Use these IDs for refund testing

## Security Best Practices

1. **Never expose Secret Key**
   - Only use in backend/server-side code
   - Never commit to version control
   - Use environment variables

2. **Webhook Verification**
   - Always verify webhook signatures
   - Use `MOYASAR_SIGNATURE_SECRET` for verification

3. **HTTPS Only**
   - Always use HTTPS in production
   - Moyasar requires secure connections

4. **Logging**
   - Log refund operations (without sensitive data)
   - Monitor for failed refunds
   - Track refund success rates

## Troubleshooting

### Refund Not Processing

1. **Check API Key**
   ```bash
   # Verify key is set
   echo $MOYASAR_SECRET_KEY
   ```

2. **Check Payment ID**
   - Verify booking has `payment_id`
   - Check payment exists in Moyasar dashboard

3. **Check Logs**
   - Review server logs for Moyasar API errors
   - Check `refund_error` field in refund request

### Refund Status Not Updating

1. **Check Database**
   - Verify refund request status updated
   - Check transaction record created

2. **Check Notifications**
   - Verify user notification sent
   - Check booking status updated

## Support

- **Moyasar Documentation:** [https://moyasar.com/docs](https://moyasar.com/docs)
- **Moyasar Support:** support@moyasar.com
- **API Status:** [https://status.moyasar.com](https://status.moyasar.com)

## Current Configuration

### Test Credentials (Development)
- **Publishable Key:** `pk_test_GUUdMyrNufV9xb59FBSAYi9jniyhvVDa9U2524pV`
- **Secret Key:** `sk_test_@sG6LYsSoX4hixpSwCZEiaac1TSLtKXMy91Yen6B`

### Production Credentials
- **Note:** Production keys should be obtained from Moyasar dashboard after business verification
- **Important:** Replace test keys with production keys before going live

---

**Last Updated:** 2024-01-01
**Version:** 1.0.0

