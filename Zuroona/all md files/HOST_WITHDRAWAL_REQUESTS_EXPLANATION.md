# Host Withdrawal Requests System - Complete Explanation
## (مکمل وضاحت - ہوسٹ ویتھ ڈراول درخواستیں سسٹم)

---

## 📋 **System Overview (سسٹم کا جائزہ)**

Host Withdrawal Requests system ek complete withdrawal management system hai jo hosts/organizers ko apne earnings withdraw karne ki facility deta hai aur admin ko un requests ko manage karne ki power deta hai.

**Example:** Host ne event se 1000 SAR kamaye → Wallet mein balance hai → Withdrawal request submit ki → Admin ne approve/reject kiya

---

## 🔄 **Complete Flow (مکمل فلو)**

### **1. Withdrawal Request Creation (ویتھ ڈراول درخواست بنانا)**

**Kya ho raha hai:**
- Host apne wallet se paise withdraw karne ke liye request submit karta hai

**Kaise ho raha hai:**
- Host `withdrawal` API call karta hai with amount
- System check karta hai ke wallet mein sufficient balance hai ya nahi
- Agar balance sufficient hai to:
  - Wallet balance 0 kar diya jata hai (temporary hold)
  - Transaction record create hota hai with status = 0 (Pending)
  - Admin ko notification bheji jati hai

**Example:**
```
Host "Ahmed" ke wallet mein 1000 SAR hai
→ Host ne 1000 SAR withdrawal request submit ki
→ System ne wallet balance 0 kar diya (temporary hold)
→ Transaction create hui: status = 0 (Pending)
→ Admin ko notification mili: "New withdrawal request from Ahmed"
```

**Connection:**
- `organizerController.withdrawal()` → Wallet check → Transaction create → Admin notification

---

### **2. Database Storage (ڈیٹا بیس میں محفوظ)**

**Kya ho raha hai:**
- Har withdrawal request `transaction` collection mein save hoti hai

**Kaise ho raha hai:**
- Transaction model mein ye fields hain:
  - `type: 2` (Withdrawal type)
  - `status: 0/1/2` (0=Pending, 1=Approved, 2=Rejected)
  - `amount`: Withdrawal amount
  - `organizer_id`: Host ka ID
  - `bank_details`: Bank information
  - `admin_notes`: Admin ki internal notes
  - `rejection_reason`: Agar reject hui to reason

**Example:**
```javascript
{
  type: 2,  // Withdrawal
  amount: 1000,
  status: 0,  // Pending
  organizer_id: "organizer123",
  currency: "SAR",
  createdAt: "2024-12-25T10:00:00Z"
}
```

**Connection:**
- Withdrawal request → `transaction` collection → Status tracking

---

### **3. Admin Panel - Request List (ایڈمن پینل - درخواست فہرست)**

**Kya ho raha hai:**
- Admin panel mein saare withdrawal requests ek table mein dikhaye jate hain

**Kaise ho raha hai:**
- Admin page load hote hi `GetWithdrawalRequestsApi()` call hoti hai
- API endpoint: `GET /admin/organizer/withdrawalList`
- Backend se transactions fetch hoti hain jo:
  - `type = 2` (Withdrawal type) hain
  - Related data (organizer details) ke saath join hota hai

**Example:**
```
Admin panel open karta hai → API call hoti hai 
→ Backend se 10 withdrawal requests aati hain (page 1)
→ Table mein dikhaye jate hain:
   - Host: Ahmed Ali
   - Amount: 1000 SAR
   - Status: Pending
   - Date: Dec 25, 2024
   - Actions: [Approve] [Reject]
```

**Connection:**
- `admin/src/app/(AfterLogin)/withdrawal-requests/page.js` → `GetWithdrawalRequestsApi()` → `adminController.withdrawalList()`

---

### **4. Search & Filter Functionality (تلاش اور فلٹر کی سہولت)**

**Kya ho raha hai:**
- Admin withdrawal requests ko search aur filter kar sakta hai

**Kaise ho raha hai:**
- **Search:** Host name, email, phone number par search
- **Status Filter:** Pending (0), Approved (1), Rejected (2), ya Sab (all)
- **Date Range Filter:** Start date se end date tak

**Example:**
```
Admin "Ahmed" search karta hai → System host name, email, phone mein search karta hai 
→ Matching requests dikhaye jate hain
```

**Connection:**
- Frontend filters → Query parameters → Backend `matchQuery` → MongoDB aggregation pipeline

---

### **5. Withdrawal Statistics Dashboard (ویتھ ڈراول اعداد و شمار ڈیش بورڈ)**

**Kya ho raha hai:**
- Top par statistics cards aur charts dikhaye jate hain

**Kaise ho raha hai:**
- `GetWithdrawalStatsApi()` call hoti hai
- Backend se ye data calculate hota hai:
  - Total requests count
  - Pending/Approved/Rejected requests
  - Total amount, Pending amount, Approved amount, Rejected amount
  - Monthly trends (last 6 months)
  - Top 5 hosts by withdrawal amount
  - Average processing time

**Example:**
```
Statistics show karte hain:
- Total Requests: 50
- Pending: 5 (2,000 SAR)
- Approved: 40 (80,000 SAR)
- Rejected: 5 (1,000 SAR)
- Top Host: "Ahmed Ali" (10 requests, 20,000 SAR)
```

**Connection:**
- `StatsDashboard.jsx` → `GetWithdrawalStatsApi()` → `adminController.withdrawalStats()` → MongoDB aggregation queries

---

### **6. Approve Withdrawal Request (ویتھ ڈراول درخواست منظور کرنا)**

**Kya ho raha hai:**
- Admin withdrawal request ko approve kar sakta hai

**Kaise ho raha hai:**
- Admin "Approve" button click karta hai → Modal open hota hai
- Admin transaction reference (optional) aur admin notes add kar sakta hai
- Approve karne par:
  - Transaction status = 1 (Approved) ho jata hai
  - `processed_by` = Admin ID save hota hai
  - `processed_at` = Current date save hoti hai
  - Host ko notification aur email bheji jati hai
  - Wallet balance already 0 hai (request time par set kiya gaya tha)

**Example:**
```
Admin Ahmed ki 1000 SAR withdrawal request approve karta hai
→ Transaction status = 1 (Approved)
→ Transaction reference: "TXN-12345" save hota hai
→ Host ko notification milti hai: "Your withdrawal request approved"
→ Email bheji jati hai: "1000 SAR will be transferred soon"
```

**Connection:**
- Approve button → `WithdrawalActionModal` → `UpdateWithdrawalRequestApi()` → `adminController.withdrawalStatusUpdate()` → Transaction update → Notification

---

### **7. Reject Withdrawal Request (ویتھ ڈراول درخواست مسترد کرنا)**

**Kya ho raha hai:**
- Admin withdrawal request ko reject kar sakta hai

**Kaise ho raha hai:**
- Admin "Reject" button click karta hai → Modal open hota hai
- Admin rejection reason (required) aur admin notes add karta hai
- Reject karne par:
  - Transaction status = 2 (Rejected) ho jata hai
  - `processed_by` = Admin ID save hota hai
  - `processed_at` = Current date save hoti hai
  - **Wallet balance restore ho jata hai** (amount wapas wallet mein add ho jata hai)
  - Host ko notification aur email bheji jati hai

**Example:**
```
Admin Ahmed ki 1000 SAR withdrawal request reject karta hai
→ Transaction status = 2 (Rejected)
→ Rejection reason: "Incomplete bank details"
→ Wallet balance restore: 0 + 1000 = 1000 SAR
→ Host ko notification milti hai: "Withdrawal request rejected"
→ Email bheji jati hai: "1000 SAR restored to your wallet"
```

**Connection:**
- Reject button → `WithdrawalActionModal` → `UpdateWithdrawalRequestApi()` → `adminController.withdrawalStatusUpdate()` → Transaction update → Wallet restore → Notification

---

### **8. Withdrawal Action Modal (ویتھ ڈراول ایکشن موڈل)**

**Kya ho raha hai:**
- Admin approve/reject karne se pehle request ki complete details dekh sakta hai

**Kaise ho raha hai:**
- Modal mein show hota hai:
  - Host information (name, email, phone, profile image)
  - Withdrawal amount aur currency
  - Request date
  - Bank details (bank name, account number, IBAN, etc.)
  - Transaction reference field (approve ke liye)
  - Rejection reason field (reject ke liye)
  - Admin notes field

**Example:**
```
Admin "Approve" button click karta hai 
→ Modal open hota hai → Complete details dikhaye jati hain:
   Host: Ahmed Ali (ahmed@email.com, +966501234567)
   Amount: 1000 SAR
   Bank: Al Rajhi Bank
   Account: 1234567890
   IBAN: SA1234567890123456789012
   [Transaction Reference Input]
   [Admin Notes Input]
```

**Connection:**
- `WithdrawalActionModal.jsx` → Request data → Display details → Form submit → API call

---

### **9. Export & Print Functionality (برآمد اور پرنٹ کی سہولت)**

**Kya ho raha hai:**
- Admin withdrawal requests ko CSV file mein export kar sakta hai ya print kar sakta hai

**Kaise ho raha hai:**
- **Export CSV:** All visible requests ko CSV format mein download karta hai
- **Print:** Browser print dialog open karta hai

**Example:**
```
Admin "Export CSV" button click karta hai 
→ File download hoti hai: "withdrawal_requests_2024-12-25.csv"
→ Excel mein open karke dekh sakta hai
```

**Connection:**
- Frontend `exportToCSV()` function → CSV string generate → Blob create → Download

---

### **10. Pagination (صفحہ بندی)**

**Kya ho raha hai:**
- Agar zyada requests hain to unhe pages mein divide kiya jata hai

**Kaise ho raha hai:**
- Default: 10 requests per page
- Page number aur limit backend ko bheji jati hai
- Backend skip aur limit use karke specific page ki data return karta hai

**Example:**
```
Total 50 requests hain → 5 pages (10 per page)
Admin page 2 par click karta hai → Next 10 requests dikhaye jate hain
```

**Connection:**
- `Paginations` component → Page change → `fetchRequests()` → Backend pagination

---

### **11. Notification System (اطلاعات کا نظام)**

**Kya ho raha hai:**
- Har action par host aur admin ko notifications milti hain

**Kaise ho raha hai:**
- **Request Created:** Admin ko notification milti hai
- **Request Approved:** Host ko notification + email milti hai
- **Request Rejected:** Host ko notification + email milti hai (with reason)

**Example:**
```
Host ne withdrawal request submit ki 
→ Admin ko notification: "New withdrawal request from Ahmed"

Admin ne request approve ki
→ Host ko notification: "Your withdrawal request approved"
→ Host ko email: "1000 SAR will be transferred soon"
```

**Connection:**
- Transaction status change → Notification service → Email service → Push notification

---

### **12. Wallet Balance Management (والیٹ بیلنس مینجمنٹ)**

**Kya ho raha hai:**
- Withdrawal request ke time wallet balance manage hota hai

**Kaise ho raha hai:**
- **Request Time:** Wallet balance 0 kar diya jata hai (temporary hold)
- **If Approved:** Balance 0 hi rehta hai (money transferred)
- **If Rejected:** Balance restore ho jata hai (amount wapas add ho jata hai)

**Example:**
```
Host wallet: 1000 SAR
→ Withdrawal request: 1000 SAR
→ Wallet balance: 0 SAR (hold)

If Approved:
→ Wallet balance: 0 SAR (money transferred)

If Rejected:
→ Wallet balance: 0 + 1000 = 1000 SAR (restored)
```

**Connection:**
- Request create → Wallet balance = 0
- Approve → Balance remains 0
- Reject → Wallet restore → Balance + amount

---

## 🔗 **Complete Connection Map (مکمل کنکشن کا نقشہ)**

```
1. Host Submits Withdrawal Request
   ↓
2. Wallet Balance Set to 0 (Hold)
   ↓
3. Transaction Created (Status = 0, Pending)
   ↓
4. Admin Notification Sent
   ↓
5. Admin Panel Loads Requests
   ↓
6. Admin Reviews Request
   ↓
7. Admin Approves/Rejects
   ↓
8. If Approved: Status = 1, Notification to Host
   ↓
9. If Rejected: Status = 2, Wallet Restored, Notification to Host
```

---

## 📊 **Data Flow Example (ڈیٹا فلو کی مثال)**

**Real Scenario:**
```
1. Host "Ahmed" ke wallet mein 1000 SAR hai
   → Host ne withdrawal request submit ki: 1000 SAR

2. System ne wallet balance 0 kar diya
   → Transaction created: {
       type: 2,
       amount: 1000,
       status: 0,  // Pending
       organizer_id: "ahmed123"
     }

3. Admin ko notification mili
   → "New withdrawal request from Ahmed"

4. Admin panel open karta hai
   → Table mein request dikhaye jati hai:
     Host: Ahmed Ali
     Amount: 1000 SAR
     Status: Pending
     Actions: [Approve] [Reject]

5. Admin "Approve" click karta hai
   → Modal open hota hai
   → Transaction reference: "TXN-12345" add karta hai
   → Approve confirm karta hai

6. System ne transaction update ki
   → Status = 1 (Approved)
   → processed_by = admin_id
   → processed_at = current_date

7. Host ko notification mili
   → "Your withdrawal request approved"
   → Email: "1000 SAR will be transferred soon"
```

---

## 🎯 **Key Points Summary (اہم نکات کا خلاصہ)**

1. **Request Creation:** Host wallet se paise withdraw karne ke liye request submit karta hai
2. **Wallet Hold:** Request time par wallet balance 0 kar diya jata hai (temporary hold)
3. **Admin Review:** Admin panel mein saare requests dikhaye jate hain
4. **Approve/Reject:** Admin request ko approve ya reject kar sakta hai
5. **Wallet Management:** Approve = balance 0, Reject = balance restore
6. **Notifications:** Har action par host aur admin ko notifications milti hain
7. **Statistics:** Complete analytics available (counts, amounts, trends)
8. **Search/Filter:** Multiple ways se requests ko search/filter kiya ja sakta hai
9. **Export/Print:** CSV export aur print functionality available hai
10. **Bank Details:** Host ki bank information modal mein dikhaye jati hai

---

## 💡 **Technical Connections (تکنیکی کنکشن)**

### **Frontend → Backend:**
- `admin/src/app/(AfterLogin)/withdrawal-requests/page.js` → `GetWithdrawalRequestsApi()`
- `admin/src/api/admin/apis.js` → API calls
- `admin/src/components/Withdrawal/StatsDashboard.jsx` → Stats API
- `admin/src/components/Modals/WithdrawalActionModal.jsx` → Update API

### **Backend → Database:**
- `api/src/controllers/adminController.js` → `withdrawalList()`
- `api/src/controllers/adminController.js` → `withdrawalStatusUpdate()`
- `api/src/controllers/adminController.js` → `withdrawalStats()`
- MongoDB aggregation pipelines → `transaction` collection

### **Host Side:**
- `api/src/controllers/organizerController.js` → `withdrawal()`
- Wallet service → Balance check → Transaction create

---

## ✅ **Final Summary (حتمی خلاصہ)**

**Host Withdrawal Requests system ek complete solution hai jo:**
- Hosts ko apne earnings withdraw karne ki facility deta hai
- Admin ko saare requests manage karne ki power deta hai
- Wallet balance automatically manage hota hai
- Approve/Reject workflow hai with notifications
- Statistics aur analytics provide karta hai
- Search, filter, export, print - sab features available hain
- Bank details tracking hai
- Complete audit trail hai (who, when, why)

**Sab kuch connected hai:**
Host Request → Wallet Hold → Admin Review → Approve/Reject → Wallet Update → Notifications

**Example flow:**
Host submits request → Wallet balance = 0 → Admin sees request → Admin approves/rejects → Wallet updated → Host notified

