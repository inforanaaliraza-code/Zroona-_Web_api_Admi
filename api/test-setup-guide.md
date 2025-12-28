# Test Setup Guide

## ⚠️ Test Results Showed Failures

The automated tests failed because:

1. **API Server Not Running** - Most tests require the server to be running
2. **Test Accounts Don't Exist** - Need to create test accounts first

## 🔧 Setup Steps

### Step 1: Start API Server
```bash
cd api
npm start
# or
npm run dev
```

Wait for: `Server running on port 3434` or similar message.

### Step 2: Create Test Accounts

#### Option A: Use Existing Accounts
Edit `test-booking-flow.js` and update:
```javascript
const TEST_CONFIG = {
	guest: {
		email: 'your-existing-guest@email.com',
		password: 'your-password',
	},
	host: {
		email: 'your-existing-host@email.com',
		password: 'your-password',
	},
};
```

#### Option B: Create New Test Accounts

**Create Guest Account:**
- Register via frontend or API
- Email: `guest@test.com`
- Password: `password123`
- Role: User/Guest (role = 1)

**Create Host Account:**
- Register via frontend or API
- Email: `host@test.com`
- Password: `password123`
- Role: Organizer/Host (role = 2)
- Complete host registration (all 4 steps)

### Step 3: Host Must Have an Event

The host account must have at least one **approved** event.

**Create Event via API:**
```bash
# Login as host first to get token
# Then create event
POST /organizer/event/add
```

**Or create via frontend:**
- Login as host
- Go to "Create Event"
- Fill all required fields
- Submit event
- Wait for admin approval (or auto-approve if configured)

### Step 4: Run Tests Again

```bash
npm run test:booking
```

## 🐛 Troubleshooting

### Error: "Cannot connect to server"
- **Solution**: Start API server with `npm start`

### Error: "Guest login failed"
- **Solution**: Create guest account or update credentials in test file

### Error: "Host login failed"
- **Solution**: Create host account or update credentials in test file

### Error: "Event not found"
- **Solution**: Host must create at least one approved event

### Error: "ECONNREFUSED"
- **Solution**: Check if server is running on correct port (default: 3434)

## ✅ Quick Verification

Before running full tests, verify:

1. **Server is running:**
   ```bash
   curl http://localhost:3434/health
   # or
   npm run test:quick
   ```

2. **Test accounts exist:**
   - Try logging in via frontend
   - Or check database directly

3. **Host has events:**
   - Login as host
   - Check "My Events" page
   - Should see at least one approved event

## 📝 Test Configuration

Default test accounts in `test-booking-flow.js`:
- Guest: `guest@test.com` / `password123`
- Host: `host@test.com` / `password123`

**Change these if your test accounts are different!**

## 🎯 Expected Behavior

Once setup is complete:
- ✅ All 10 tests should pass
- ✅ Booking flow works end-to-end
- ✅ Payment restrictions work correctly
- ✅ Notifications are sent
- ✅ Group chat addition works

## 🚀 Next Steps

1. Complete setup steps above
2. Run `npm run test:booking`
3. All tests should pass
4. If tests still fail, check error messages for specific issues

