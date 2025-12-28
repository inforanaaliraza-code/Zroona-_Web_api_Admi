# Frontend Booking Flow Test Guide

## Manual Testing Checklist

### Prerequisites
1. Start the web server: `npm run dev`
2. Have test accounts ready:
   - Guest account (role = 1)
   - Host account (role = 2)
3. Host should have at least one approved event

---

## Test 1: Guest Books Event (Initial Request)

### Steps:
1. Login as Guest
2. Navigate to Events page
3. Click on any event
4. Click "Book Now" button
5. Select number of attendees
6. Submit booking

### Expected Results:
- ✅ Booking created successfully
- ✅ Booking status shows as "Pending" (Status = 1)
- ✅ Toast notification: "Booking successful"
- ✅ "Book Now" button changes to "Pending - Waiting for host approval"
- ✅ Payment button is NOT visible/disabled

### Check in Browser Console:
```javascript
// Check booking status
console.log('Booking Status:', event.booked_event?.book_status); // Should be 1
```

---

## Test 2: Payment Blocked Before Approval

### Steps:
1. After booking (while status is Pending)
2. Try to access payment (if payment button is visible, click it)
3. Or try to manually navigate to payment page

### Expected Results:
- ✅ Payment button is disabled/hidden
- ✅ If payment attempted, error message: "Your booking request is still pending approval from the host"
- ✅ No payment can be processed

### Check in Browser Console:
```javascript
// Try to initiate payment
handleInitiatePayment(); // Should show error toast
```

---

## Test 3: Host Reviews and Accepts Booking

### Steps:
1. Login as Host
2. Navigate to "My Bookings" page
3. Find the pending booking
4. Click on booking to view guest profile
5. Review guest details
6. Click "Accept" button

### Expected Results:
- ✅ Booking status changes to "Approved" (Status = 2)
- ✅ Guest receives notification: "Your booking request for [event] has been accepted by the host. You can now proceed with payment."
- ✅ Toast notification: "Booking accepted successfully"

### Check in Browser Console:
```javascript
// Check booking status after acceptance
console.log('Booking Status:', booking.book_status); // Should be 2
```

---

## Test 4: Payment Enabled After Approval

### Steps:
1. Login as Guest
2. Navigate to "My Events" page
3. Find the approved booking
4. Check if payment button is visible

### Expected Results:
- ✅ Booking status shows as "Approved" (Status = 2)
- ✅ Payment button is NOW visible and enabled
- ✅ Button text: "Proceed to Payment"
- ✅ Can click payment button without errors

### Check in Browser Console:
```javascript
// Check if payment button should be shown
const showPaymentButton = booking.book_status === 2 && booking.payment_status === 0;
console.log('Payment Button Should Show:', showPaymentButton); // Should be true
```

---

## Test 5: Payment Processing

### Steps:
1. Click "Proceed to Payment" button
2. Complete payment process (use test payment method)
3. Wait for payment confirmation

### Expected Results:
- ✅ Payment processed successfully
- ✅ Payment status changes to "Paid" (payment_status = 1)
- ✅ Toast notification: "Payment completed successfully"
- ✅ User automatically added to event's group chat
- ✅ Success notification received

### Check in Browser Console:
```javascript
// Check payment status after payment
console.log('Payment Status:', booking.payment_status); // Should be 1
console.log('Booking Status:', booking.book_status); // Should be 2
```

---

## Test 6: Group Chat Access

### Steps:
1. After payment is completed
2. Navigate to "Messaging" page
3. Look for group chat for the event

### Expected Results:
- ✅ Group chat appears in conversations list
- ✅ Guest can see group chat for the event
- ✅ Guest can send messages in group chat

### Check in Browser Console:
```javascript
// Check group chats
// Navigate to messaging and check if group chat exists
```

---

## Test 7: Host Rejects Booking

### Steps:
1. Login as Host
2. Navigate to "My Bookings" page
3. Find a pending booking
4. Click "Reject" button
5. Enter rejection reason (minimum 10 characters)
6. Submit rejection

### Expected Results:
- ✅ Booking status changes to "Rejected" (Status = 3)
- ✅ Guest receives notification: "Your booking request for [event] has been rejected by the host. You cannot book this event."
- ✅ Rejection reason is included in notification
- ✅ Toast notification: "Booking rejected successfully"

### Check in Browser Console:
```javascript
// Check booking status after rejection
console.log('Booking Status:', booking.book_status); // Should be 3
console.log('Rejection Reason:', booking.rejection_reason);
```

---

## Test 8: Payment Blocked for Rejected Booking

### Steps:
1. Login as Guest
2. Navigate to "My Events" page
3. Find the rejected booking
4. Try to access payment

### Expected Results:
- ✅ Payment button is NOT visible/disabled
- ✅ If payment attempted, error: "Your booking request was rejected by the host. You cannot make payment for a rejected booking."
- ✅ Booking appears in "Rejected" tab only
- ✅ Booking does NOT appear in "Approved" tab

### Check in Browser Console:
```javascript
// Try to initiate payment for rejected booking
// Should show error toast
```

---

## Test 9: Rejected Bookings Filter

### Steps:
1. Login as Guest
2. Navigate to "My Events" page
3. Check different tabs:
   - "Approved" tab
   - "Pending" tab
   - "Rejected" tab

### Expected Results:
- ✅ Rejected bookings (status 3/4) only appear in "Rejected" tab
- ✅ Rejected bookings do NOT appear in "Approved" tab
- ✅ Rejected bookings do NOT appear in "Pending" tab
- ✅ Filtering works correctly

### Check in Browser Console:
```javascript
// Check filtered bookings
console.log('Approved bookings:', bookings.filter(b => b.status === 1 || b.status === 2));
console.log('Rejected bookings:', bookings.filter(b => b.status === 4));
```

---

## Test 10: Notification Flow

### Steps:
1. Complete the full flow:
   - Guest books event
   - Host accepts/rejects
   - Guest makes payment (if accepted)
2. Check notifications for both Guest and Host

### Expected Results:
- ✅ Host receives notification when guest books event
- ✅ Guest receives notification when host accepts booking
- ✅ Guest receives notification when host rejects booking
- ✅ Guest receives notification when payment is successful
- ✅ Notifications have correct titles and descriptions
- ✅ Notifications are clickable and redirect correctly

### Check in Browser Console:
```javascript
// Check notifications
// Navigate to notifications page and verify all notifications are present
```

---

## Test 11: Booking Status Display

### Steps:
1. Check booking status display in different places:
   - Event details page
   - My Events page
   - Booking details modal

### Expected Results:
- ✅ Status 1 (Pending): Shows "Pending - Waiting for host approval"
- ✅ Status 2 (Approved): Shows "Approved - You can now proceed with payment"
- ✅ Status 3/4 (Rejected): Shows "Rejected" with rejection reason
- ✅ Status colors are correct (Yellow for pending, Green for approved, Red for rejected)

---

## Test 12: Edge Cases

### Test 12.1: Multiple Bookings
- Create multiple bookings for same event
- Verify each booking has independent status

### Test 12.2: Payment Retry
- After payment fails, verify booking status remains correct
- Verify payment can be retried if booking is still approved

### Test 12.3: Concurrent Actions
- Host accepts booking while guest is viewing event page
- Verify UI updates correctly (may need refresh)

---

## Browser DevTools Checks

### Network Tab:
1. Check API calls:
   - `POST /user/event/book` - Should return book_status: 1
   - `PUT /organizer/booking/changeStatus` - Should return book_status: 2 or 3
   - `POST /user/payment/update` - Should validate book_status === 2

### Console Tab:
1. Check for errors
2. Check for warnings
3. Verify API responses

### Application Tab:
1. Check localStorage for tokens
2. Check sessionStorage for booking data

---

## Expected API Responses

### Booking Created:
```json
{
  "status": 1,
  "data": {
    "_id": "...",
    "book_status": 1,
    "payment_status": 0,
    "order_id": "JN-OD-XXX"
  }
}
```

### Booking Accepted:
```json
{
  "status": 1,
  "data": {
    "_id": "...",
    "book_status": 2,
    "payment_status": 0
  }
}
```

### Payment Update (Before Approval - Should Fail):
```json
{
  "status": 0,
  "message": "Your booking request is still pending approval from the host..."
}
```

### Payment Update (After Approval - Should Succeed):
```json
{
  "status": 1,
  "data": {
    "payment_status": 1,
    "book_status": 2
  }
}
```

---

## Troubleshooting

### Payment button not showing:
- Check: `booking.book_status === 2`
- Check: `booking.payment_status === 0`
- Check browser console for errors

### Payment fails:
- Check API response in Network tab
- Verify booking status is 2 (approved)
- Check for validation errors

### Notifications not appearing:
- Check notification API endpoint
- Verify notification service is running
- Check browser console for errors

### Group chat not accessible:
- Verify payment was successful
- Check group chat API endpoint
- Verify user was added to participants

---

## Test Results Template

```
Date: [Date]
Tester: [Name]

Test 1: Guest Books Event - ✅/❌
Test 2: Payment Blocked Before Approval - ✅/❌
Test 3: Host Accepts Booking - ✅/❌
Test 4: Payment Enabled After Approval - ✅/❌
Test 5: Payment Processing - ✅/❌
Test 6: Group Chat Access - ✅/❌
Test 7: Host Rejects Booking - ✅/❌
Test 8: Payment Blocked for Rejected Booking - ✅/❌
Test 9: Rejected Bookings Filter - ✅/❌
Test 10: Notification Flow - ✅/❌
Test 11: Booking Status Display - ✅/❌
Test 12: Edge Cases - ✅/❌

Overall: ✅ PASS / ❌ FAIL
Notes: [Any issues found]
```

