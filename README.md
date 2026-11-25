# Bahawal Market (بہاول مارکیٹ)
### Digital Mobile Bazaar for Bahawalnagar, Pakistan

A localized digital marketplace where every mobile retailer in Bahawalnagar can create a digital shop, list phones and accessories, and customers can search the entire market from home. Payments are NOT processed within the app—customers find their desired phone, compare shop prices, and connect directly with shopkeepers via **Phone Call**, **WhatsApp (with pre-filled inquiry text)**, or an in-person shop visit.

---

## 🚀 Running on Localhost Right Now

The live development server is currently active:
- **Localhost URL:** [http://127.0.0.1:3000](http://127.0.0.1:3000)

### What you can test directly in the browser:
1. **Role Switcher (Top Header):**
   - **Customer (خریدار):** Search phones (e.g. `iPhone 15`, `Samsung`, `Redmi`), browse categories (*Mobiles, Accessories, Chargers, Covers, Earphones, Repair*), filter by condition (*New/Used*), PTA Status (*Approved/Non-PTA*), test Call and WhatsApp action buttons with pre-filled Urdu/English text, view verified shops, read/leave reviews, and bookmark favorites.
   - **Shopkeeper (دکاندار):** Register storefront with address and CNIC verification, review performance analytics (views, call button taps, WhatsApp clicks), and add products. **Used phones strictly mandate an IMEI entry** accompanied by anti-theft legal warnings and terms acceptance.
   - **Admin (ایڈمن):** Super admin console to approve/reject pending shops with reasons, toggle the **Verified Shop** badge, review citizen reports, ban/suspend retailers, and perform **IMEI Police Audit Lookups** to trace any 15-digit IMEI back to the listing shop.
2. **Urdu & English Localization:**
   - Tap the language button in the top bar to switch instantly between English and Urdu with automatic RTL (Right-to-Left) typography.
3. **Mobile Simulator Frame:**
   - Tap the phone icon in the top header to toggle between the desktop layout and an Android mobile phone frame simulator.

---

## 🏗️ Project Architecture

```
bahawal/
├── src/
│   ├── components/
│   │   ├── CustomerView.jsx      # Marketplace home, search, filters, details modal, WhatsApp/Call
│   │   ├── ShopkeeperView.jsx    # Shop portal, analytics, inventory, mandatory IMEI form
│   │   └── AdminView.jsx         # Shop verification, IMEI audit search, moderation, reports
│   ├── context/
│   │   └── AppContext.jsx        # Unified reactive state, role/language management, storage
│   ├── data/
│   │   └── mockData.js           # Bahawalnagar shops (Minchinabad Rd, Jail Rd, Model Town) & items
│   ├── i18n/
│   │   └── translations.js       # Complete English & Urdu bilingual dictionary
│   ├── App.jsx                   # Role switching & main shell
│   └── index.css                 # Tailwind CSS & Urdu typography
├── firebase/
│   ├── firestore.rules           # Strict security rules (private IMEI and CNIC access)
│   ├── firestore.indexes.json    # Composite indexes for category and price queries
│   └── functions/
│       ├── index.js              # Cloud Functions (search keyword normalization & FCM push notifications)
│       └── package.json
├── index.html
├── vite.config.js
└── package.json
```

---

## 🔒 Safety, Security & Anti-Theft Requirements

1. **Mandatory IMEI for Used Phones:**
   - In accordance with PECA and Punjab Police guidelines, any used handset listing strictly requires an IMEI number.
   - **Privacy Rule:** The IMEI is stored in `productPrivate` and is NEVER displayed to public buyers. It is solely accessible to the Admin for police audits.
2. **CNIC Verification:**
   - Shopkeeper CNIC photos and national identity details are stored in `shopPrivate` and are strictly restricted to admin access.
3. **Zero Financial Liability:**
   - The platform does not collect payments. Transactions take place physically in Bahawalnagar shops.

---

## 🛠️ Deploying Firebase Backend

```bash
# 1. Login to Firebase CLI
firebase login

# 2. Deploy Firestore Security Rules & Indexes
firebase deploy --only firestore:rules,firestore:indexes

# 3. Deploy Cloud Functions
firebase deploy --only functions
```











