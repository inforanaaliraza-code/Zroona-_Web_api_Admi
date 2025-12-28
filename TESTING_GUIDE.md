# Complete Booking Flow Testing Guide

## 📦 Test Files Created

### Backend Tests (`api/` folder):
1. **`test-booking-flow.js`** - Complete automated test suite
2. **`quick-test.js`** - Quick endpoint verification
3. **`run-booking-tests.sh`** - Linux/Mac runner
4. **`run-booking-tests.ps1`** - Windows PowerShell runner
5. **`TEST_README.md`** - Detailed backend test documentation

### Frontend Tests (`web/` folder):
1. **`test-booking-flow.md`** - Complete manual testing checklist

---

## 🚀 Quick Start Testing

### Step 1: Start API Server
```bash
cd api
npm start
# or
npm run dev
```

### Step 2: Run Quick Test (Verify Endpoints)
```bash
cd api
npm run test:quick
```

**Expected Output:**
```
🧪 Quick Booking Flow Test

Testing API endpoints...

✅ Server is running
✅ Booking endpoint exists (auth required)
✅ Payment endpoint exists
✅ Change status endpoint exists

📊 Results:
Server: ✅
Booking Endpoint: ✅
Payment Endpoint: ✅
Change Status Endpoint: ✅

✅ All endpoints are accessible!
💡 Run full test: node test-booking-flow.js
```

### Step 3: Run Full Test Suite
```bash
cd api
npm run test:booking
```

**Note:** Make sure you have test accounts:
- Guest: `guest@test.com` / `password123`
- Host: `host@test.com` / `password123`

Or edit `api/test-booking-flow.js` to use your test accounts.

---

## 🧪 What Tests Verify

### ✅ Backend Tests Verify:

1. **Booking Creation**
   - Guest can book event
   - Booking status = 1 (Pending)
   - Notification sent to host

2. **Payment Restrictions**
   - ❌ Payment blocked when status = 1 (Pending)
   - ✅ Payment allowed when status = 2 (Approved)
   - ❌ Payment blocked when status = 3 (Rejected)

3. **Host Actions**
   - Host can accept booking (status → 2)
   - Host can reject booking (status → 3)
   - Notifications sent to guest

4. **Payment Processing**
   - Payment successful after approval
   - Payment status updated correctly
   - Group chat addition after payment

5. **Rejection Flow**
   - Rejection reason saved
   - Payment blocked for rejected bookings

### ✅ Frontend Tests Verify:

1. **UI States**
   - Payment button only shows when approved
   - Status displays correctly
   - Rejected bookings filtered properly

2. **User Experience**
   - Notifications appear correctly
   - Error messages are clear
   - Status updates in real-time

---

## 📋 Manual Testing Checklist

### Test Scenario 1: Complete Happy Path

1. ✅ Guest books event → Status: Pending
2. ✅ Payment button disabled
3. ✅ Host accepts booking → Status: Approved
4. ✅ Guest receives notification
5. ✅ Payment button enabled
6. ✅ Guest makes payment → Status: Paid
7. ✅ User added to group chat
8. ✅ Success notification received

### Test Scenario 2: Rejection Flow

1. ✅ Guest books event → Status: Pending
2. ✅ Host rejects booking → Status: Rejected
3. ✅ Guest receives rejection notification
4. ✅ Payment button remains disabled
5. ✅ Booking appears only in "Rejected" tab
6. ✅ Payment attempt fails with error

### Test Scenario 3: Payment Restrictions

1. ✅ Try payment before approval → ❌ Blocked
2. ✅ Try payment after approval → ✅ Allowed
3. ✅ Try payment after rejection → ❌ Blocked

---

## 🔍 Debugging Failed Tests

### Test Fails: "Guest login failed"
```bash
# Check if guest account exists
# Update credentials in test-booking-flow.js:
guest: {
    email: 'your-guest@email.com',
    password: 'your-password',
}
```

### Test Fails: "Event not found"
```bash
# Host must create an event first
# Or test will auto-create one if host has permission
```

### Test Fails: "Payment should have been rejected"
```javascript
// Check api/src/controllers/userController.js
// updatePaymentStatus function should validate:
if (bookingDetails.book_status !== 2) {
    return Response.badRequestResponse(...);
}
```

### Test Fails: "Group chat not found"
```
This is a warning, not a failure.
Group chat is created when host approves booking.
Check if ConversationService is working.
```

---

## 📊 Expected Test Results

### ✅ All Tests Pass:
```
📊 TEST SUMMARY
✅ Passed: 10
❌ Failed: 0

🎉 ALL TESTS PASSED!
```

### ❌ Some Tests Fail:
```
📊 TEST SUMMARY
✅ Passed: 7
❌ Failed: 3

⚠️  SOME TESTS FAILED

❌ ERRORS:
  - Payment Blocked Before Approval: Expected status 400, got 200
  - Host Accepts Booking: Booking acceptance failed
  - Payment Allowed After Approval: Payment failed
```

---

## 🎯 Testing Best Practices

1. **Run Quick Test First**
   - Verifies endpoints are accessible
   - Catches configuration issues early

2. **Run Full Test Suite**
   - Comprehensive coverage
   - Catches integration issues

3. **Manual Frontend Testing**
   - Verify UI/UX
   - Test user experience
   - Check notifications

4. **Test Edge Cases**
   - Multiple bookings
   - Concurrent actions
   - Network failures
   - Invalid data

---

## 📝 Test Configuration

### Change Test Accounts:
Edit `api/test-booking-flow.js`:
```javascript
const TEST_CONFIG = {
    guest: {
        email: 'your-guest@email.com',
        password: 'your-password',
    },
    host: {
        email: 'your-host@email.com',
        password: 'your-password',
    },
};
```

### Change API URL:
```bash
export API_BASE_URL=http://localhost:3434
# or
API_BASE_URL=http://localhost:3434 npm run test:booking
```

---

## 🚨 Common Issues

### Issue: "Cannot find module 'axios'"
```bash
cd api
npm install axios
```

### Issue: "ECONNREFUSED"
```bash
# API server is not running
npm start
```

### Issue: "Authentication failed"
```bash
# Check test account credentials
# Verify accounts exist in database
```

---

## ✅ Verification Checklist

After running tests, verify:

- [ ] All backend tests pass
- [ ] Payment restrictions work correctly
- [ ] Notifications are sent
- [ ] Group chat addition works
- [ ] Frontend UI updates correctly
- [ ] Error messages are clear
- [ ] Status displays are accurate

---

## 📞 Next Steps

1. ✅ Run backend tests: `npm run test:booking`
2. ✅ Run frontend manual tests: See `web/test-booking-flow.md`
3. ✅ Test with real payment gateway
4. ✅ Test with multiple users
5. ✅ Test edge cases

---

## 🎉 Success Criteria

All tests pass when:
- ✅ Guest can book event
- ✅ Payment blocked before approval
- ✅ Host can accept/reject
- ✅ Payment allowed after approval
- ✅ Group chat addition works
- ✅ Notifications sent correctly
- ✅ Rejected bookings filtered

**If all tests pass → System is production-ready! 🚀**

