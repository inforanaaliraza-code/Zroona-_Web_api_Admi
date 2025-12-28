# Booking Flow Test Suite

Complete test suite for verifying the booking flow implementation.

## 📋 Test Files

1. **`test-booking-flow.js`** - Comprehensive automated test suite
2. **`quick-test.js`** - Quick endpoint verification
3. **`run-booking-tests.sh`** - Linux/Mac test runner
4. **`run-booking-tests.ps1`** - Windows PowerShell test runner

## 🚀 Quick Start

### Prerequisites
1. API server must be running: `npm start` or `npm run dev`
2. Test accounts must exist:
   - Guest: `guest@test.com` / `password123`
   - Host: `host@test.com` / `password123`
3. Host must have at least one approved event

### Run Quick Test (Endpoint Verification)
```bash
npm run test:quick
```

### Run Full Test Suite
```bash
npm run test:booking
```

### Manual Test (Windows)
```powershell
.\run-booking-tests.ps1
```

### Manual Test (Linux/Mac)
```bash
chmod +x run-booking-tests.sh
./run-booking-tests.sh
```

## 🧪 Test Coverage

### 1. Authentication Tests
- ✅ Guest login
- ✅ Host login

### 2. Booking Creation Tests
- ✅ Guest books event
- ✅ Booking status = 1 (Pending)
- ✅ Notification sent to host

### 3. Payment Restriction Tests
- ✅ Payment blocked when booking status = 1 (Pending)
- ✅ Payment allowed when booking status = 2 (Approved)
- ✅ Payment blocked when booking status = 3 (Rejected)

### 4. Host Action Tests
- ✅ Host accepts booking (status → 2)
- ✅ Host rejects booking (status → 3)
- ✅ Notification sent to guest on accept/reject

### 5. Payment Processing Tests
- ✅ Payment successful after approval
- ✅ Payment status updated correctly
- ✅ Group chat addition after payment

### 6. Rejection Flow Tests
- ✅ Rejection reason saved
- ✅ Payment blocked for rejected bookings
- ✅ Notifications sent correctly

## 📊 Expected Test Results

### Successful Test Run:
```
🚀 Starting Booking Flow Tests...
============================================================

🧪 Testing: Guest Login
✅ PASSED: Guest Login

🧪 Testing: Host Login
✅ PASSED: Host Login

🧪 Testing: Get or Create Test Event
✅ PASSED: Get or Create Test Event

🧪 Testing: Guest Books Event (Status = Pending)
✅ PASSED: Guest Books Event (Status = Pending)

🧪 Testing: Payment Blocked Before Approval
✅ PASSED: Payment Blocked Before Approval

🧪 Testing: Host Accepts Booking (Status = Approved)
✅ PASSED: Host Accepts Booking (Status = Approved)

🧪 Testing: Payment Allowed After Approval
✅ PASSED: Payment Allowed After Approval

🧪 Testing: Group Chat Addition After Payment
✅ PASSED: Group Chat Addition After Payment

🧪 Testing: Rejection Flow Test
✅ PASSED: Rejection Flow Test

🧪 Testing: Verify Notifications
✅ PASSED: Verify Notifications

============================================================
📊 TEST SUMMARY
✅ Passed: 10
❌ Failed: 0

🎉 ALL TESTS PASSED!
```

## 🔧 Configuration

Edit `test-booking-flow.js` to change test configuration:

```javascript
const TEST_CONFIG = {
	guest: {
		email: 'guest@test.com',
		password: 'password123',
	},
	host: {
		email: 'host@test.com',
		password: 'password123',
	},
};
```

Or set environment variable:
```bash
export API_BASE_URL=http://localhost:3434
```

## 🐛 Troubleshooting

### Test Fails: "Guest login failed"
- **Solution**: Create test guest account or update credentials in `TEST_CONFIG`

### Test Fails: "Host login failed"
- **Solution**: Create test host account or update credentials in `TEST_CONFIG`

### Test Fails: "Event not found"
- **Solution**: Host must create at least one approved event before running tests

### Test Fails: "Payment should have been rejected"
- **Solution**: Check that payment validation is working in `updatePaymentStatus` controller

### Test Fails: "Group chat not found"
- **Solution**: This is a warning, not a failure. Group chat is created when host approves booking.

## 📝 Manual Testing

For frontend manual testing, see: `../web/test-booking-flow.md`

## 🔍 Debugging

### Enable Verbose Logging
Add to `test-booking-flow.js`:
```javascript
const DEBUG = true;
```

### Check API Responses
All API responses are logged. Check console output for details.

### Test Individual Functions
```javascript
// Test only guest login
await test('Guest Login', testGuestLogin);

// Test only booking creation
await test('Guest Books Event', testGuestBooksEvent);
```

## ✅ Checklist Before Running Tests

- [ ] API server is running
- [ ] Database is connected
- [ ] Test accounts exist (guest and host)
- [ ] Host has at least one approved event
- [ ] Environment variables are set (if needed)
- [ ] Dependencies installed (`npm install`)

## 📞 Support

If tests fail:
1. Check API server logs
2. Verify database connection
3. Check test account credentials
4. Verify event exists and is approved
5. Check network connectivity

## 🎯 Next Steps

After tests pass:
1. Test frontend manually (see `web/test-booking-flow.md`)
2. Test with real payment gateway
3. Test with multiple concurrent bookings
4. Test edge cases (cancelled bookings, refunds, etc.)

