# Hardware POS System - Project Requirements & Instructions

මෙම ලේඛනය මඟින් කුඩා පරිමාණයේ හාඩ්වෙයාර් ව්‍යාපාරයක් සඳහා අවශ්‍ය වන POS (Point of Sale) පද්ධතියේ ව්‍යාපාරික සහ තාක්ෂණික අවශ්‍යතා විස්තර කෙරේ.

---

## 1. Business Requirements (ව්‍යාපාරික අවශ්‍යතා)

### A. Inventory Management (තොග කළමනාකරණය)
* **Item Categories:** නිෂ්පාදනය කරන දේවල් (Self-manufactured) සහ මිලදී ගෙන නැවත විකුණන දේවල් (Resale items) ලෙස වෙන්කර හඳුනා ගැනීම.
* **Wholesale & Retail Prices:** එකම භාණ්ඩයට මිල ගණන් දෙකක් ඇතුළත් කිරීමේ හැකියාව.
* **Stock Alerts:** තොග අවසන් වන විට (Low stock) දැනුම් දීම් ලබා දීම.
* **Unit Management:** මීටර්, අඩි, කිලෝ, මිටි හෝ ප්‍රමාණය (Quantity) අනුව විකිණීමට හැකි වීම.

### B. Sales & Invoicing (විකුණුම් සහ බිල්පත්)
* **Quick Search:** භාණ්ඩයේ නම හෝ කේතය (Code) මඟින් ඉක්මනින් සෙවීමේ හැකියාව.
* **Discount Management:** සම්පූර්ණ බිල්පතට හෝ තනි භාණ්ඩයකට වට්ටම් (Discounts) එකතු කිරීම.
* **Payment Methods:** මුදල් (Cash) හෝ කාඩ්පත් (Card) මඟින් ගෙවීම් වාර්තා කිරීම.
* **Print Receipts:** තාප මුද්‍රණ යන්ත්‍රයකට (Thermal Printer) ගැළපෙන ලෙස බිල්පතක් සැකසීම.

### C. Supplier & Customer Management
* **Suppliers:** බඩු ලබාගන්නා හෝල්සේල් වෙළෙන්දන්ගේ විස්තර පවත්වා ගැනීම.
* **Credit Sales:** ණයට බඩු ලබාගන්නා පාරිභෝගිකයන්ගේ නම් සහ හිඟ මුදල් වාර්තා කිරීම.

### D. Reporting (වාර්තා ලබා ගැනීම)
* **Daily Sales:** දිනපතා ලැබෙන මුළු ආදායම සහ ලාභය ගණනය කිරීම.
* **Stock Reports:** දැනට ඉතිරිව ඇති තොගවල වටිනාකම බැලීම.

---

## 2. Technical Requirements (තාක්ෂණික අවශ්‍යතා)

### A. Frontend Stack
* **HTML5 & Vanilla JavaScript:** පද්ධතියේ මූලික ව්‍යුහය සහ තර්කනය (Logic) සඳහා.
* **Tailwind CSS:** පද්ධතියේ පෙනුම (UI) ඉතා ඉක්මනින් සහ ආකර්ෂණීය ලෙස නිර්මාණය කිරීමට.
* **Lucide Icons / FontAwesome:** අයිකන භාවිතය සඳහා.

### B. Database & Storage (Dexie.js)
* **Dexie.js (IndexedDB wrapper):** බ්‍රවුසරය තුළම දත්ත ගබඩා කිරීමට (Offline-first approach). මෙහිදී ඉන්ටර්නෙට් නැතුව වුවත් වැඩ කළ හැක.
* **Data Persistence:** බ්‍රවුසරය රීප්‍රෙෂ් කළත් දත්ත මැකී නොයන ලෙස සැකසීම.
* **Backup & Restore:** මුළු දත්ත පද්ධතියම JSON ෆයිල් එකක් ලෙස ඩවුන්ලෝඩ් කර ගැනීමට (Backup) සහ අවශ්‍ය විටෙක නැවත ඇතුළත් කිරීමට (Restore) ඇති හැකියාව.

### C. System Architecture
1.  **Dashboard:** ව්‍යාපාරයේ සාරාංශය පෙන්වන මුහුණත.
2.  **POS Interface:** බිල්පත් සකසන ප්‍රධාන තිරය.
3.  **Inventory Page:** බඩු ඇතුළත් කරන සහ සංස්කරණය කරන තිරය.
4.  **Transaction History:** පරණ බිල්පත් බැලීමට සහ ඒවා අවලංගු කිරීමට ඇති හැකියාව.

---

## 3. Database Schema (Dexie.js සඳහා)

පහත දත්ත ව්‍යුහය Dexie.js හි නිර්මාණය කළ යුතුය:

```javascript
const db = new Dexie('HardwareDB');
db.version(1).stores({
  products: '++id, name, category, wholesalePrice, retailPrice, stockCount',
  sales: '++id, date, totalAmount, discount, paymentMethod',
  customers: '++id, name, phone, creditBalance',
  suppliers: '++id, name, contact'
});