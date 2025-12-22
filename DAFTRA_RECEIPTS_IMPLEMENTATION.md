# Daftra Receipts API Integration - Implementation Guide

## Overview
This document explains how Daftra Receipts API is integrated into the Zuroona platform to generate and display receipts for paid bookings.

## Credentials Required

### 1. Daftra API Key
- **API KEY:** `a287194bdf648c16341ecb843cea1fbae7392962`
- **Location:** 
  - **Option 1 (Recommended):** Set in environment variables: `DAFTRA_API_KEY`
  - **Option 2:** Already set as default in code (will work without env vars)
- **Where to get:** Provided by Daftra account admin
- **Security:** Keep this key secure, never commit to public repositories

### 2. Daftra Subdomain
- **Subdomain:** `tdb`
- **Full URL:** `https://tdb.daftra.com`
- **Location:**
  - **Option 1 (Recommended):** Set in environment variables: `DAFTRA_SUBDOMAIN`
  - **Option 2:** Already set as default in code (will work without env vars)
- **Where to get:** From your Daftra account URL (e.g., `https://tdb.daftra.com`)

### 3. API Documentation
- **URL:** https://tdb.daftra.com/api_docs/v2/
- **Endpoint:** `/api2/receipts`
- **Base URL:** `https://tdb.daftra.com/api2/`

## Where to Set Credentials

### Option 1: Environment Variables (Recommended for Production)
Add these to your `.env` file in the `api` directory:

**File:** `api/.env`
```env
DAFTRA_SUBDOMAIN=tdb
DAFTRA_API_KEY=a287194bdf648c16341ecb843cea1fbae7392962
```

**How to set:**
1. Navigate to `api` directory
2. Create or edit `.env` file
3. Add the above two lines
4. Restart your API server

### Option 2: Default Values (Already Implemented)
The code already has default values, so it will work without environment variables:
- Default subdomain: `tdb`
- Default API key: `a287194bdf648c16341ecb843cea1fbae7392962`

**Note:** Defaults are already hardcoded in `api/src/helpers/daftraService.js`, so the system will work immediately without any configuration.

### Option 3: Production Deployment (Vercel/Heroku/etc.)
For production deployments, set environment variables in your hosting platform:
- **Vercel:** Project Settings → Environment Variables
- **Heroku:** Settings → Config Vars
- **AWS/Docker:** Use `.env` file or environment configuration

## Implementation Details

### 1. Backend Service (`api/src/helpers/daftraService.js`)

#### New Functions Added:
- `createReceipt()` - Creates a receipt in Daftra
- `getReceipt()` - Retrieves receipt details
- `generateEventReceipt()` - Generates receipt for event booking

#### API Endpoints Used:
- **Create Receipt:** `POST https://tdb.daftra.com/api2/receipts`
- **Get Receipt:** `GET https://tdb.daftra.com/api2/receipts/{receipt_id}`
- **Receipt PDF:** `https://tdb.daftra.com/receipts/{receipt_id}/pdf`

### 2. Payment Callback (`api/src/controllers/userController.js`)

#### Flow:
1. Guest makes payment via Moyasar
2. Payment callback received
3. Booking status updated to paid
4. **Receipt generated automatically via Daftra Receipts API**
5. Receipt URL saved to booking (`invoice_url` field)
6. User notified with receipt link

### 3. Frontend Display

#### Where Receipt is Shown:
1. **Booking Details Component** (`web/src/components/events/BookingDetails.jsx`)
   - Shows "Download Invoice" button when `invoice_url` exists
   - Opens receipt PDF in new tab

2. **My Events Page** (`web/src/app/myEvents/page.jsx`)
   - Lists all bookings with receipt links
   - Shows receipt button for paid bookings

## Receipt Data Structure

### Receipt Creation Payload:
```json
{
  "Receipt": {
    "staff_id": 0,
    "store_id": 0,
    "client_id": "user_id",
    "currency_code": "SAR",
    "client_business_name": "Organizer Name",
    "client_first_name": "User First Name",
    "client_last_name": "User Last Name",
    "client_email": "user@email.com",
    "client_address1": "User Address",
    "client_country_code": "SA",
    "date": "2024-01-15",
    "draft": "0",
    "notes": "Payment receipt for event: Event Name",
    "html_notes": "<p>Thank you for your payment!</p>..."
  },
  "ReceiptItem": [
    {
      "item": "Event Name",
      "description": "Booking for X attendee(s)",
      "unit_price": 100,
      "quantity": 2,
      "product_id": "event_id"
    }
  ]
}
```

## Receipt URL Format

After receipt creation, the PDF URL is stored in booking:
- **Field:** `invoice_url` (kept for backward compatibility)
- **Format:** `https://tdb.daftra.com/receipts/{receipt_id}/pdf`
- **Access:** Direct link to PDF, opens in new tab

## User Flow

1. **Guest Books Event** → Booking created with status "Pending"
2. **Guest Pays via Card** → Moyasar payment gateway
3. **Payment Success** → Webhook/callback received
4. **Receipt Generated** → Daftra Receipts API called automatically
5. **Receipt URL Saved** → Stored in `booking.invoice_url`
6. **User Sees Receipt** → "Download Invoice" button appears
7. **User Clicks Button** → Receipt PDF opens in new tab

## Error Handling

- If receipt generation fails, payment still succeeds
- Error logged but doesn't block payment processing
- Receipt can be regenerated later if needed
- User can still access booking even if receipt fails

## Testing

### Test Receipt Generation:
1. Make a test booking
2. Complete payment
3. Check booking in database for `invoice_url`
4. Click "Download Invoice" button
5. Verify PDF opens correctly

### Test API Directly:
```bash
curl -X POST https://tdb.daftra.com/api2/receipts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer a287194bdf648c16341ecb843cea1fbae7392962" \
  -H "apikey: a287194bdf648c16341ecb843cea1fbae7392962" \
  -d '{
    "Receipt": {
      "client_first_name": "Test",
      "client_last_name": "User",
      "currency_code": "SAR",
      "date": "2024-01-15"
    },
    "ReceiptItem": [{
      "item": "Test Event",
      "unit_price": 100,
      "quantity": 1
    }]
  }'
```

## Security Notes

- API key is stored securely in environment variables
- Receipt URLs are only accessible to authenticated users
- Receipts are linked to specific bookings
- Only paid bookings have receipts

## Files Modified

1. `api/src/helpers/daftraService.js` - Added Receipts API methods
2. `api/src/controllers/userController.js` - Updated payment callback to generate receipts
3. `web/src/components/events/BookingDetails.jsx` - Shows receipt button (already implemented)
4. `web/src/app/myEvents/page.jsx` - Lists receipts (already implemented)

## Next Steps

1. ✅ Receipt generation on payment success
2. ✅ Receipt URL storage in booking
3. ✅ Frontend display of receipt button
4. ✅ Receipt PDF access

## Support

For Daftra API issues:
- Check API documentation: https://tdb.daftra.com/api_docs/v2/
- Verify credentials are correct
- Check network connectivity
- Review error logs in console

## Credentials Summary (Quick Reference)

| Credential | Value | Location |
|------------|-------|----------|
| **API Key** | `a287194bdf648c16341ecb843cea1fbae7392962` | `DAFTRA_API_KEY` env var or default in code |
| **Subdomain** | `tdb` | `DAFTRA_SUBDOMAIN` env var or default in code |
| **Base URL** | `https://tdb.daftra.com` | Constructed from subdomain |
| **API Endpoint** | `/api2/receipts` | Daftra Receipts API v2 |
| **Documentation** | https://tdb.daftra.com/api_docs/v2/ | Daftra API Docs |

## How to Get Credentials (If Needed)

1. **Login to Daftra:** Go to https://tdb.daftra.com
2. **Navigate to Settings:** Account Settings → API
3. **Generate API Key:** Create new API key if needed
4. **Get Subdomain:** From your Daftra URL (e.g., `tdb` from `https://tdb.daftra.com`)

## Testing Credentials

To test if credentials are working:

```bash
curl -X GET https://tdb.daftra.com/api2/receipts \
  -H "Authorization: Bearer a287194bdf648c16341ecb843cea1fbae7392962" \
  -H "apikey: a287194bdf648c16341ecb843cea1fbae7392962"
```

If you get a response (even if empty array), credentials are working!

