# 🔧 MSEGAT SMS Service - Setup Guide

## ❌ Fixing M0002 "Invalid login info" Error

This error means your MSEGAT credentials are incorrect or not properly configured.

---

## 📋 Step-by-Step Setup

### **Step 1: Get Your Credentials**

1. **Login to MSEGAT Dashboard**
   - Go to: https://www.msegat.com/
   - Login with your account

2. **Find Your Username**
   - Dashboard → Profile/Settings
   - Copy your **EXACT username** (case-sensitive!)
   - Example: `NaifAlkhalaf` or `naif@example.com`

3. **Get Your API Key**
   - Dashboard → Settings → API Integration
   - Click "**Generate New API Key**" or "View API Key"
   - Copy the **FULL key** (usually 32 characters)
   - Example: `A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6`

4. **Check Sender Name (Optional)**
   - Dashboard → Sender Names
   - Make sure your sender name is **approved**
   - Default: `Zuroona`

---

### **Step 2: Update Your .env File**

1. **Open** `api/.env` file

2. **Find lines 49-52** (or wherever your MSEGAT credentials are)

3. **Update with EXACT values:**

```env
MSEGAT_USERNAME=your_exact_username_here
MSEGAT_API_KEY=your_full_32_character_api_key_here
MSEGAT_SENDER_NAME=Zuroona
```

**⚠️ Important Rules:**
- ✅ NO spaces before or after `=`
- ✅ NO quotes (unless value has spaces)
- ✅ Copy-paste directly from dashboard
- ✅ Case-sensitive - use exact case

**✅ CORRECT Format:**
```env
MSEGAT_USERNAME=naifalkhalaf
MSEGAT_API_KEY=ABC123DEF456GHI789JKL012MNO345PQ
MSEGAT_SENDER_NAME=Zuroona
```

**❌ WRONG Format:**
```env
MSEGAT_USERNAME = naifalkhalaf          # ❌ Spaces around =
MSEGAT_USERNAME="naifalkhalaf"          # ❌ Unnecessary quotes
MSEGAT_API_KEY=ABC123...                # ❌ Incomplete key
MSEGAT_API_KEY = "ABC123DEF456..."      # ❌ Spaces + quotes
```

---

### **Step 3: Test Your Credentials**

Run the detailed test script:

```bash
cd api
node test-msegat-detailed.js
```

**Expected SUCCESS output:**
```
✅ SUCCESS! API_KEY authentication working!
✅ Your MSEGAT credentials are correct!
```

**If you see M0002 error:**
```
❌ FAILED: Invalid login info
⚠️  Your USERNAME or API_KEY is incorrect!
```

→ Go back to Step 1 and verify your credentials

---

### **Step 4: Restart Your Server**

After updating credentials:

```bash
# Stop your server (Ctrl+C in terminal)
# Then restart:
cd api
npm start
```

---

## 🔍 Common MSEGAT Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| **M0002** | Invalid login info | Username or API Key is wrong. Copy from dashboard. |
| **M0001** | Variables missing | Username or API Key is missing in .env |
| **M0023** | Sender Name issue | Sender name not approved. Wait or use default. |
| **M0024** | Invalid Sender Name | Use only English letters/numbers |
| **1060** | Balance not enough | Add balance to MSEGAT account |
| **1064** | Free OTP format | Account in trial. Use specific format or upgrade. |
| **1110** | Sender name missing | Set MSEGAT_SENDER_NAME in .env |
| **1120** | Invalid mobile number | Check phone number format |
| **M0000** or **1** | Success! | SMS sent successfully ✅ |

---

## 📞 Still Not Working?

### **Double-Check These:**

1. **Account Status**
   - Login to MSEGAT dashboard
   - Check: Account is **Active** ✓
   - Check: Balance > 0 SAR ✓
   - Check: API Access is **Enabled** ✓

2. **Credentials Format**
   ```bash
   cd api
   node verify-msegat-credentials.js
   ```
   
   Should show:
   ```
   ✅ MSEGAT_USERNAME: [your_username]
   ✅ MSEGAT_API_KEY: [your_key...]
   ✅ All required credentials are set!
   ```

3. **Detailed API Test**
   ```bash
   cd api
   node test-msegat-detailed.js
   ```
   
   This will show:
   - Exact credentials being used
   - API request payload
   - API response
   - Detailed error diagnosis

---

### **Contact MSEGAT Support**

If all above steps fail, contact MSEGAT:

**Email:** support@msegat.com  
**Website:** https://www.msegat.com/

**Tell them:**
```
"I'm getting M0002 error when calling the API.
My username is: [your_username]
Please verify:
1. My account is active
2. My API credentials are correct
3. My account has API access enabled"
```

---

## ✅ Quick Checklist

- [ ] Logged into MSEGAT dashboard
- [ ] Copied EXACT username (no typos)
- [ ] Generated NEW API key
- [ ] Copied FULL API key (32 characters)
- [ ] Updated `api/.env` with exact values
- [ ] NO spaces before/after `=` in .env
- [ ] Saved .env file
- [ ] Ran test: `node test-msegat-detailed.js`
- [ ] Saw: ✅ SUCCESS! (not M0002 error)
- [ ] Restarted server
- [ ] Tried registration again
- [ ] OTP received on phone! 🎉

---

## 🎯 Final Notes

**The M0002 error is 99% caused by:**
1. Wrong username
2. Wrong API key
3. Typo in credentials
4. Extra spaces in .env file

**Solution:**
- Copy credentials EXACTLY from MSEGAT dashboard
- No spaces, no quotes, just plain values
- Test with `test-msegat-detailed.js`
- You should see M0000 (success) not M0002 (error)

**Dashboard se credentials bilkul waise hi copy karein jaise dikhte hain!** 🔑

