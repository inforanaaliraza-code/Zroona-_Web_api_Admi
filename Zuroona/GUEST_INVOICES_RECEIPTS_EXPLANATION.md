# Guest Invoices & Receipts System - Complete Explanation
## (مکمل وضاحت - گیسٹ انوائسز اور رسیدز سسٹم)

---

## 📋 **System Overview (سسٹم کا جائزہ)**

Guest Invoices & Receipts system ek automated invoice generation aur management system hai jo event bookings ke baad automatically invoices/receipts generate karta hai aur admin ko unhe manage karne ki facility deta hai.

**Example:** Jab koi guest event book karta hai aur payment complete hota hai, to automatically invoice generate hoti hai aur database mein save ho jati hai.

---

## 🔄 **Complete Flow (مکمل فلو)**

### **1. Invoice Generation Flow (انوائس جنریشن کا فلو)**

**Kya ho raha hai:**
- Guest event book karta hai → Payment complete hota hai → Automatically invoice generate hoti hai

**Kaise ho raha hai:**
- Payment success hone par `updatePaymentStatus` function call hota hai
- Ye function 3 services try karta hai (priority order mein):
  1. **Fatora** (Saudi Arabia platform) - Pehle try karta hai
  2. **Daftra** (International platform) - Agar Fatora fail ho to
  3. **Local Invoice Generator** - Agar dono fail ho to

**Example:**
```
Guest "Ahmed" ne "Music Concert" event book kiya → Payment 500 SAR complete hui 
→ System ne Fatora se invoice generate ki → Invoice ID: "INV-12345" 
→ Invoice URL: "https://fatora.com/invoices/12345/pdf" 
→ Database mein save ho gaya
```

**Connection:**
- `userController.js` → `updatePaymentStatus()` → `fatoraService.js` / `daftraService.js` / `localInvoiceGenerator.js`
- Invoice data `book_event` collection mein save hota hai (`invoice_id`, `invoice_url` fields mein)

---

### **2. Database Storage (ڈیٹا بیس میں محفوظ)**

**Kya ho raha hai:**
- Har booking ke saath invoice information store hoti hai

**Kaise ho raha hai:**
- `book_event` model mein 2 fields hain:
  - `invoice_id`: Invoice ka unique ID (e.g., "INV-12345")
  - `invoice_url`: Invoice PDF ka direct link (e.g., "https://fatora.com/invoices/12345/pdf")
  

**Example:**
```javascript
{
  order_id: "JN-OD-1001",
  invoice_id: "INV-12345",
  invoice_url: "https://fatora.com/invoices/12345/pdf",
  payment_status: 1,  // Paid
  total_amount: 500.00
}
```

**Connection:**
- Invoice services → `book_event` collection → `invoice_id` aur `invoice_url` fields

---

### **3. Admin Panel - Invoice List (ایڈمن پینل - انوائس فہرست)**

**Kya ho raha hai:**
- Admin panel mein saare paid bookings with invoices dikhaye jate hain

**Kaise ho raha hai:**
- Admin page load hote hi `GetGuestInvoicesApi()` call hota hai
- API endpoint: `GET /admin/bookings/invoices`
- Backend se bookings fetch hoti hain jo:
  - `payment_status = 1` (Paid) hain
  - `invoice_id` exist karta hai (null nahi hai)
  - Related data (user, event, organizer) ke saath join hota hai

**Example:**
```
Admin panel open karta hai → API call hoti hai 
→ Backend se 10 invoices aati hain (page 1)
→ Table mein dikhaye jate hain:
   - Invoice ID: INV-12345
   - Guest: Ahmed Ali
   - Event: Music Concert
   - Amount: 500 SAR
   - Status: Paid & Confirmed
```

**Connection:**
- `admin/src/app/(AfterLogin)/guest-invoices/page.js` → `GetGuestInvoicesApi()` → `api/src/controllers/adminController.js` → `getAllBookingsWithInvoices()`

---

### **4. Search & Filter Functionality (تلاش اور فلٹر کی سہولت)**

**Kya ho raha hai:**
- Admin invoice ko search aur filter kar sakta hai

**Kaise ho raha hai:**
- **Search:** Invoice ID, Order ID, Guest name, Email, Event name par search
- **Payment Status Filter:** Paid (1) ya Unpaid (0) ya Sab (all)
- **Booking Status Filter:** Pending, Confirmed, Cancelled, Completed, etc.
- **Date Range Filter:** Start date se end date tak

**Example:**
```
Admin "Ahmed" search karta hai → System invoice_id, order_id, guest name, 
email, event name mein search karta hai → Matching results dikhaye jate hain
```

**Connection:**
- Frontend filters → Query parameters → Backend `matchQuery` → MongoDB aggregation pipeline

---

### **5. Invoice Statistics Dashboard (انوائس اعداد و شمار ڈیش بورڈ)**

**Kya ho raha hai:**
- Top par statistics cards aur charts dikhaye jate hain

**Kaise ho raha hai:**
- `GetInvoiceStatsApi()` call hoti hai
- Backend se ye data calculate hota hai:
  - Total invoices count
  - Pending/Confirmed/Completed/Cancelled invoices
  - Total revenue, Average amount, Max amount
  - Monthly trends (last 6 months)
  - Top 5 events by revenue

**Example:**
```
Statistics show karte hain:
- Total Invoices: 150
- Total Revenue: 75,000 SAR
- Average Invoice: 500 SAR
- Top Event: "Music Concert" (25 invoices, 12,500 SAR)
```

**Connection:**
- `InvoiceStatsDashboard.jsx` → `GetInvoiceStatsApi()` → `adminController.getInvoiceStats()` → MongoDB aggregation queries

---

### **6. Invoice Detail Modal (انوائس کی تفصیلات)**

**Kya ho raha hai:**
- Admin kisi invoice par click karke uski complete details dekh sakta hai

**Kaise ho raha hai:**
- Table mein "View Details" button par click → Modal open hota hai
- Modal mein show hota hai:
  - Guest information (name, email, phone, profile image)
  - Event information (name, date, image)
  - Organizer information
  - Payment details (amount, payment ID, date)
  - Invoice download button

**Example:**
```
Admin invoice row par "View Details" click karta hai 
→ Modal open hota hai → Complete information dikhaye jati hai:
   Guest: Ahmed Ali (ahmed@email.com)
   Event: Music Concert (Dec 25, 2024)
   Amount: 500 SAR
   Invoice URL: [Download Button]
```

**Connection:**
- `InvoiceDetailModal.jsx` → Invoice object prop → Display all details

---

### **7. Export & Print Functionality (برآمد اور پرنٹ کی سہولت)**

**Kya ho raha hai:**
- Admin invoices ko CSV file mein export kar sakta hai ya print kar sakta hai

**Kaise ho raha hai:**
- **Export CSV:** All visible invoices ko CSV format mein download karta hai
- **Print:** Browser print dialog open karta hai

**Example:**
```
Admin "Export CSV" button click karta hai 
→ File download hoti hai: "guest-invoices-2024-12-25.csv"
→ Excel mein open karke dekh sakta hai
```

**Connection:**
- Frontend `exportToCSV()` function → CSV string generate → Blob create → Download

---

### **8. Pagination (صفحہ بندی)**

**Kya ho raha hai:**
- Agar zyada invoices hain to unhe pages mein divide kiya jata hai

**Kaise ho raha hai:**
- Default: 10 invoices per page
- Page number aur limit backend ko bheji jati hai
- Backend skip aur limit use karke specific page ki data return karta hai

**Example:**
```
Total 150 invoices hain → 15 pages (10 per page)
Admin page 2 par click karta hai → Next 10 invoices dikhaye jate hain
```

**Connection:**
- `Paginations` component → Page change → `fetchInvoices()` → Backend pagination

---

## 🔗 **Complete Connection Map (مکمل کنکشن کا نقشہ)**

```
1. Payment Success
   ↓
2. Invoice Generation (Fatora/Daftra/Local)
   ↓
3. Database Save (book_event collection)
   ↓
4. Admin Panel Load
   ↓
5. API Call (GET /admin/bookings/invoices)
   ↓
6. Backend Fetch (MongoDB Aggregation)
   ↓
7. Frontend Display (Table + Stats)
   ↓
8. User Actions (Search, Filter, View, Export)
```

---

## 📊 **Data Flow Example (ڈیٹا فلو کی مثال)**

**Real Scenario:**
```
1. Guest "Ahmed" ne "Music Concert" event book kiya
   → Booking created: order_id = "JN-OD-1001"

2. Payment 500 SAR complete hui
   → updatePaymentStatus() called
   → Fatora invoice generated: invoice_id = "INV-12345"
   → Database updated:
     {
       order_id: "JN-OD-1001",
       invoice_id: "INV-12345",
       invoice_url: "https://fatora.com/invoices/12345/pdf",
       payment_status: 1,
       book_status: 2
     }

3. Admin panel open karta hai
   → GetGuestInvoicesApi() called
   → Backend se invoice data fetch hoti hai
   → Table mein dikhaye jate hain:
     - Invoice ID: INV-12345
     - Guest: Ahmed Ali
     - Event: Music Concert
     - Amount: 500 SAR
     - Status: Paid & Confirmed

4. Admin "View Details" click karta hai
   → Modal open hota hai
   → Complete details dikhaye jate hain

5. Admin "Export CSV" click karta hai
   → CSV file download hoti hai
   → Excel mein open karke dekh sakta hai
```

---

## 🎯 **Key Points Summary (اہم نکات کا خلاصہ)**

1. **Automatic Invoice Generation:** Payment success par automatically invoice generate hoti hai
2. **Multiple Service Support:** Fatora, Daftra, ya Local - koi bhi use ho sakta hai
3. **Database Storage:** Invoice ID aur URL database mein save hota hai
4. **Admin Dashboard:** Saare invoices ek jagah dikhaye jate hain
5. **Search & Filter:** Multiple ways se invoices ko search/filter kiya ja sakta hai
6. **Statistics:** Revenue, trends, top events - sab analytics available hain
7. **Export/Print:** CSV export aur print functionality available hai
8. **Detail View:** Har invoice ki complete details modal mein dikhaye jati hain

---

## 💡 **Technical Connections (تکنیکی کنکشن)**

### **Frontend → Backend:**
- `admin/src/app/(AfterLogin)/guest-invoices/page.js` → `GetGuestInvoicesApi()`
- `admin/src/api/admin/apis.js` → API calls
- `admin/src/components/Invoice/InvoiceStatsDashboard.jsx` → Stats API

### **Backend → Database:**
- `api/src/controllers/adminController.js` → `getAllBookingsWithInvoices()`
- `api/src/controllers/adminController.js` → `getInvoiceStats()`
- MongoDB aggregation pipelines → `book_event` collection

### **Invoice Generation:**
- `api/src/controllers/userController.js` → `updatePaymentStatus()`
- `api/src/helpers/fatoraService.js` → Fatora API
- `api/src/helpers/daftraService.js` → Daftra API
- `api/src/helpers/localInvoiceGenerator.js` → Local fallback

---

## ✅ **Final Summary (حتمی خلاصہ)**

**Guest Invoices & Receipts system ek complete solution hai jo:**
- Automatic invoice generation karta hai
- Admin ko saare invoices manage karne ki facility deta hai
- Search, filter, export, print - sab features available hain
- Statistics aur analytics provide karta hai
- User-friendly interface hai jo admin ko easily invoices dekhne aur manage karne mein help karta hai

**Sab kuch connected hai:**
- Payment → Invoice Generation → Database → Admin Panel → Display → Actions

**Example flow:**
Guest books event → Pays → Invoice auto-generated → Saved in DB → Admin sees in panel → Can search/filter/view/export

