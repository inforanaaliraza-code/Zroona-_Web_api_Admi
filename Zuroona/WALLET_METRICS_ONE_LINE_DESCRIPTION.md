# Wallet Management Metrics - One Line Description
## (والیٹ مینجمنٹ میٹرکس - ایک لائن وضاحت)

---

## 📊 **Metrics Explanation (میٹرکس کی وضاحت)**

### **1. Total Balance (کل بیلنس)**
**Kya hai:** System mein sab hosts ke wallets ka total amount sum  
**Kahan se aata hai:** Wallet collection se sab wallets ke `total_amount` ka sum (MongoDB aggregation)  
**Example:** Host1 (5,000 SAR) + Host2 (3,000 SAR) + Host3 (2,000 SAR) = **10,000 SAR, 3 hosts**

---

### **2. Available Balance (دستیاب بیلنس)**
**Kya hai:** Total Balance minus Pending Withdrawals (jo amount actually available hai)  
**Kahan se aata hai:** Total Balance (wallet sum) - Pending Withdrawals (transactions with type=2, status=0)  
**Example:** Total Balance (10,000 SAR) - Pending (2,000 SAR) = **8,000 SAR**

---

### **3. Pending Withdrawals (زیر التواء ویتھ ڈراولز)**
**Kya hai:** Sab pending withdrawal requests ka total amount aur count  
**Kahan se aata hai:** Transaction collection se filter (type=2, status=0) ka sum aur count  
**Example:** Request1 (1,000 SAR) + Request2 (500 SAR) + Request3 (500 SAR) = **2,000 SAR, 3 requests**

---

### **4. Total Earnings (کل کمائی)**
**Kya hai:** System mein sab successful earnings ka total amount  
**Kahan se aata hai:** Transaction collection se filter (type=1=earning, status=1=success) ka sum  
**Example:** Earning1 (500 SAR) + Earning2 (300 SAR) + Earning3 (200 SAR) = **1,000 SAR**

---

### **5. Total Withdrawals (کل ویتھ ڈراولز)**
**Kya hai:** System mein sab approved/completed withdrawals ka total amount  
**Kahan se aata hai:** Transaction collection se filter (type=2=withdrawal, status=1=approved) ka sum  
**Example:** Withdrawal1 (1,000 SAR) + Withdrawal2 (500 SAR) + Withdrawal3 (300 SAR) = **1,800 SAR**

---

### **6. Average Balance (اوسط بیلنس)**
**Kya hai:** Sab hosts ke wallets ka average balance  
**Kahan se aata hai:** Wallet collection se sab wallets ke `total_amount` ka average (MongoDB $avg)  
**Example:** (5,000 + 3,000 + 2,000) / 3 hosts = **3,333.33 SAR**

---

### **7. Recent Activity (7d) (حالیہ سرگرمی)**
**Kya hai:** Last 7 days mein kitni transactions hui hain (count)  
**Kahan se aata hai:** Transaction collection se count jahan `createdAt >= 7 days ago`  
**Example:** Last week mein 25 transactions (earnings + withdrawals + refunds) = **25**

---

### **8. Approved Withdrawals (منظور شدہ ویتھ ڈراولز)**
**Kya hai:** Sab approved withdrawal requests ki count (amount nahi, sirf count)  
**Kahan se aata hai:** Transaction collection se filter (type=2, status=1) ka count  
**Example:** 10 approved withdrawal requests = **10**

---

## 📊 **Withdrawal Requests Metrics (ویتھ ڈراول ریکویسٹ میٹرکس)**

### **9. Total Requests (کل درخواستیں)**
**Kya hai:** System mein sab withdrawal requests ki total count  
**Kahan se aata hai:** Transaction collection se filter (type=2) ka count  
**Example:** 10 hosts ne withdrawal request ki = **10**

---

### **10. Pending (زیر التواء)**
**Kya hai:** Pending withdrawal requests ki count aur total amount  
**Kahan se aata hai:** Transaction collection se filter (type=2, status=0) ka count + sum  
**Example:** 2 requests (500 SAR + 500 SAR) = **2, 1,000 SAR**

---

### **11. Approved (منظور شدہ)**
**Kya hai:** Approved withdrawal requests ki count aur total amount  
**Kahan se aata hai:** Transaction collection se filter (type=2, status=1) ka count + sum  
**Example:** 5 requests (1,000 SAR total) = **5, 1,000 SAR**

---

### **12. Rejected (مسترد)**
**Kya hai:** Rejected withdrawal requests ki count aur total amount  
**Kahan se aata hai:** Transaction collection se filter (type=2, status=2) ka count + sum  
**Example:** 1 request (300 SAR) = **1, 300 SAR**

---

### **13. Total Amount (کل رقم)**
**Kya hai:** Sab withdrawal requests ka total amount (pending + approved + rejected)  
**Kahan se aata hai:** Transaction collection se filter (type=2) ka sab amounts ka sum  
**Example:** Pending (1,000) + Approved (2,500) + Rejected (300) = **3,800 SAR**

---

### **14. Avg. Processing Time (اوسط پروسیسنگ ٹائم)**
**Kya hai:** Average time jo withdrawal request ko process karne mein lagta hai (request se approval/rejection tak)  
**Kahan se aata hai:** Transaction collection se (processed_at - requested_at) ka average (sirf completed requests with status=1 or 2)  
**Example:** 10 requests ne total 50 hours liye = **5 Hours**

---

### **15. Approval Rate (منظوری کی شرح)**
**Kya hai:** Approved requests ka percentage (sirf processed requests se)  
**Kahan se aata hai:** (Approved count / (Approved + Rejected count)) * 100  
**Example:** 5 approved, 1 rejected = (5/6)*100 = **83% (5 of 6 approved)**

---

## 🔄 **Data Flow Summary (ڈیٹا فلو خلاصہ)**

```
Wallet Collection (total_amount) 
  → Total Balance (sum)
  → Average Balance (avg)

Transaction Collection (type, status, amount, createdAt)
  → type=1, status=1 → Total Earnings (sum)
  → type=2, status=0 → Pending Withdrawals (sum + count)
  → type=2, status=1 → Total Withdrawals (sum) + Approved Withdrawals (count)
  → createdAt >= 7 days → Recent Activity (count)

Total Balance - Pending Withdrawals 
  → Available Balance
```

---

## 📝 **API Endpoint (API اینڈپوائنٹ)**

**Endpoint:** `GET /admin/wallet/stats`  
**Controller:** `adminController.getWalletStats()`  
**File:** `api/src/controllers/adminController.js` (line 3011)  
**Frontend Component:** `admin/src/components/Wallet/WalletStatsDashboard.jsx`

**Withdrawal Stats Endpoint:** `GET /admin/organizer/withdrawalStats`  
**Controller:** `adminController.withdrawalStats()`  
**File:** `api/src/controllers/adminController.js` (line 1998)  
**Frontend Component:** `admin/src/components/Withdrawal/StatsDashboard.jsx`

---
