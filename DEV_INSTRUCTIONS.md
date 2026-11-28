# Bahawal Market (بہاول مارکیٹ) — Backend & Engineering Master Guide

This document outlines the system architecture, backend technical requirements, product logic rules, and frontend roadmap for **Bahawal Market** (`bahawal-market.pk`), Bahawalnagar's dedicated mobile and electronics marketplace.

---

## 1. Executive Summary & Core Platform Flows

Bahawal Market is a local marketplace connecting buyers in Bahawalnagar, Pakistan, directly with verified mobile phone shops, repair centers, and accessories retailers.

### The Standard User Journey
1. **App Entry & Guest Browsing**:
   - The user opens the web application and can immediately explore the marketplace without friction ("Skip for now" / Guest mode).
   - Can view hot deals, search local shops, browse accessories, check product specifications, and compare prices across shops.
2. **Authentication (Customer Flow)**:
   - When a user chooses to sign in, save an item, place an order, or save an address, they can authenticate via:
     - **Pakistani Mobile Phone Number** (`0300 1234567`) + 4-digit SMS OTP (via local SMS gateway or Firebase Auth).
     - **Google One-Tap / OAuth Sign-In**.
     - Standard password fallback.
3. **Checkout & WhatsApp Fulfillment**:
   - Customer adds items to Cart or taps **"Buy Now"**.
   - Selects fulfillment: **Home Delivery** (Rs. 150 across Bahawalnagar) or **Free Market Counter Pickup**.
   - Cash on Delivery (COD) only — zero card barriers.
   - Generates an official trackable **`#BWN-XXXX` Order ID** saved to their device.
   - Formats a pre-filled receipt to the retailer’s WhatsApp.
4. **Shopkeeper Ecosystem (Merchant Portal)**:
   - Local shopkeepers register with Shop Name, Owner CNIC, WhatsApp Number, and Market Location (Main Bazar, Rail Bazar, Baldia Road, Model Town, Circular Road, etc.) with **0% sales commission**.
   - Dedicated Merchant Dashboard to:
     - Add new & used phone inventory with photo previews and full specs.
     - Toggle stock in real-time (`In Stock` / `Out of Stock`) and adjust prices.
     - View incoming customer orders, inspect COD details, and update statuses (`Confirmed`, `Out for Delivery`, `Delivered`).

---

## 2. Status Audit: Frontend Built vs. Backend Pending

| Feature / Module | Frontend Status | Backend Requirement |
| :--- | :--- | :--- |
| **Explore & Discovery** | ✅ Completed (`HomePage.jsx`, `NavbarOptions.jsx`) | Product feed APIs, category indexes, banner management. |
| **Search & Faceted Filters** | ✅ Completed (`SearchPage.jsx`, `FilterDrawerModal.jsx`) | Full-text search (PostgreSQL / Meilisearch), price range & brand facets. |
| **Product Detail & Specs** | ✅ Completed (`ProductDetailPage.jsx`) | Relational product schema, specs JSON, related item queries. |
| **Order Tracking ("My Orders")** | ✅ Completed (`MyOrdersModal.jsx`) | Relational `orders` table, SMS alerts, status webhook/endpoints. |
| **Customer Saved Addresses** | ✅ Completed (`AddressesModal.jsx`) | User address book schema, default address toggle. |
| **Merchant Dashboard** | ✅ Completed (`ShopkeeperDashboardModal.jsx`) | Shop inventory CRUD, image upload storage, seller analytics. |
| **Authentication Flow** | 🟡 UI Built (`AuthModal.jsx`) | **Backend Required**: Real SMS OTP provider (Jazz/Zong/Twilio) + JWT tokens. |
| **Shop Onboarding** | 🟡 UI Built (`ShopRegistrationModal.jsx`) | **Backend Required**: CNIC verification, Admin shop approval queue. |
| **AI Assistant (Gemini)** | ⏳ UI Pending (Bot button in header) | **Backend Required**: Gemini 1.5/2.0 API pipeline with live inventory RAG. |
| **Cross-Shop Comparison** | ⏳ UI Pending | **Backend Required**: Matching engine for identical SKUs across shops. |
| **10-Point Condition Scoring** | ⏳ UI Pending | **Backend Required**: Scoring schema & inspection checklist storage. |

---

## 3. High-Priority Backend Tasks & Engineering Challenges

The backend developer is assigned the following foundational architecture tasks:

### Task 1: Homepage Listing & "Buy Box" Multi-Shop Ranking Algorithm
> **Problem Statement**: Multiple mobile shops in Bahawalnagar will list the exact same phone (e.g., *Xiaomi Redmi Note 13 8GB/256GB* or *iPhone 15 Pro Max 256GB*). If all 6 shops are listed individually on the Explore homepage, the feed becomes cluttered with duplicate listings.

#### Required Solution:
- Implement a canonical product grouping algorithm (**Canonical Parent SKU**):
  - The homepage displays the single **Parent Product Card**.
  - The card displays: `Rs. 74,999` with a badge: *"Available at 4 shops in Bahawalnagar"*.
  - When the user taps the card, it displays the top **"Buy Box" Winner** shop first, with a clean selector below showing other available shops in Bahawalnagar.
- **Ranking Formula for Top Buy Box Winner**:
  $$\text{Score} = (0.45 \times \text{Price Score}) + (0.25 \times \text{Shop Rating}) + (0.15 \times \text{Verified Status}) + (0.15 \times \text{Stock Recency})$$
  1. **Price Competitiveness (45%)**: The shop offering the lowest price gets highest priority.
  2. **Merchant Reliability (25%)**: Customer review rating and completed order history.
  3. **Verification Badge (15%)**: Physically verified shopkeeper in Bahawalnagar market.
  4. **Active Stock Recency (15%)**: Shopkeeper who updated stock within the last 24-48 hours.

---

### Task 2: Search Intent Disambiguation (Phones vs. Accessories of the Same Name)
> **Problem Statement**: When a customer searches for *"iPhone 15"* or *"S24"*, search results frequently return accessories like *"iPhone 15 Silicon Case"* or *"iPhone 15 9D Glass Protector"* ahead of the actual smartphone, creating user frustration.

#### Required Solution:
1. **Category Hierarchy & Weighting**:
   - Search indexing must assign heavy category relevance weight:
     - `smartphones` (Weight: 10.0)
     - `tablets` (Weight: 7.0)
     - `smartwatches` / `earbuds` (Weight: 5.0)
     - `chargers` (Weight: 3.0)
     - `cases` / `covers` / `glass` (Weight: 1.0)
2. **Intent Keyword Matcher**:
   - If the user query does NOT explicitly include accessory keywords (*"case"*, *"cover"*, *"glass"*, *"protector"*, *"charger"*, *"cable"*), the search engine must automatically rank smartphone category items first.
   - If accessory terms are present (*"iPhone 15 case"*), promote accessory category items.
3. **Tabbed Search Results UI**:
   - Provide results divided into two clear tabs: **"Phones (N)"** and **"Cases & Accessories (N)"**.

---

### Task 3: Product Segmentation Matrix (New vs. Used, PTA vs. Non-PTA)
In the Pakistani market, smartphones have 4 distinct sub-markets that cannot be mixed:
1. **Brand New / Box Pack (PTA Approved)**
2. **Brand New / Box Pack (Non-PTA / JV / Sim-Lock)**
3. **Used / Pre-Owned (Official PTA Approved)**
4. **Used / Pre-Owned (Non-PTA / JV / Sim-Lock / Gevey)**

#### Required Backend Schema:
Every device listing must include:
```json
{
  "condition": "new" | "used",
  "pta_status": "official_approved" | "non_pta" | "jv" | "sim_lock",
  "warranty_type": "official_brand" | "shop_check_warranty" | "none",
  "warranty_duration_days": 7,
  "battery_health_percentage": 92,
  "condition_score_total": 9.2
}
```

---

### Task 4: Automated Cross-Shop Device Comparison Engine
> **Feature**: A dedicated comparison system that automatically highlights differences when a user views a phone available at multiple Bahawalnagar shops.

#### Required Logic:
- Given a `parent_model_id` (e.g. `apple-iphone-13-128gb`):
- Fetch all active listings across Bahawalnagar retailers.
- Compare side-by-side:
  - **Price Difference** (e.g., Shop A: Rs. 148,000 vs. Shop B: Rs. 153,000).
  - **Condition Score** (e.g., 9.5/10 vs. 8.8/10).
  - **Battery Health** (e.g., 94% vs. 86%).
  - **Shop Distance** (e.g., Main Bazar 0.3 km vs. Circular Road 1.2 km).
  - **Included Accessories** (e.g., Original Box + 20W Charger vs. Phone Only).
  - **Check Warranty** (e.g., 10 Days vs. 3 Days).

---

### Task 5: 10-Point Condition Scoring & Bar-Style Verification Panel
For all used/pre-owned devices, shopkeepers must fill out a 10-point checklist instead of subjective "10/10" text:

| Inspection Point | Weight | Criteria |
| :--- | :--- | :--- |
| **1. Battery Health** | 15% | Actual iOS/Android battery capacity percentage (e.g., 85% = 8.5/10). |
| **2. Screen / Display** | 15% | Original display, True Tone working, no lines, no burn-in/dots. |
| **3. Body & Edges** | 10% | Scratch inspection on frame and bezels (0 to 10 scale). |
| **4. Back Glass / Camera Lens**| 10% | Flawless, micro-scratches, or repaired glass. |
| **5. Face ID / Fingerprint** | 10% | Fully functional biometric sensor (10 or 0). |
| **6. Camera Autofocus & OIS** | 10% | Clean lenses, optical stabilization, 0.5x ultra-wide clean. |
| **7. Mic, Speaker & Earpiece** | 10% | Clear call audio, loud stereo speaker test. |
| **8. PTA / Network Status** | 10% | Official DIRBS verification (SIM 1 & SIM 2 valid). |
| **9. Charging & Ports** | 5% | Fast charging operational, Type-C/Lightning snug fit. |
| **10. Box & Original Accessories**| 5% | Matching IMEI box, original cable/adapter included. |

#### Visual Panel Output:
A segmented horizontal score bar (e.g., `Score: 9.3 / 10 · Excellent Condition`) with individual breakdown tags so buyers buy with total confidence.

---

### Task 6: Gemini AI Marketplace Shopping Assistant (`<Bot />`)
The AI Assistant in the header (`<Bot />` icon) acts as a local Bahawalnagar mobile expert.

#### Conversational Prompt Architecture:
1. **Interactive Needs Discovery**:
   - *"Salam! What kind of phone are you looking for today?"*
   - Asks 2 quick questions:
     1. **Budget Range** (e.g., Under Rs. 50k, Rs. 60k–100k, Flagship).
     2. **Primary Priority** (Camera / PUBG & Gaming / Heavy Battery / Casual Everyday).
2. **Catalog RAG Query**:
   - The assistant queries the live Bahawal Market product database.
   - Filters out out-of-stock items.
3. **Structured Recommendation**:
   - Returns 2 to 3 genuinely best available options with specific reasons:
     - *Option 1*: Top Performance Choice.
     - *Option 2*: Best Camera Choice.
     - *Option 3*: Best Value for Money.
4. **Comparison Action**:
   - Provides a 1-tap button: *"Compare these 2 models side-by-side"*.

---

## 4. Backend Implementation Roadmap (Priority-Wise)

### Priority 0: Core Data & Authentication (Sprint 1)
1. **Database Schema Setup** (PostgreSQL / Supabase):
   - `users` (id, phone, name, role, created_at)
   - `shops` (id, name, owner_name, cnic, phone, whatsapp, market_area, rating, verified, views)
   - `products` (id, shop_id, name, brand, category, price, condition, pta_status, specs, images, stock_status)
   - `orders` (id, order_number, customer_name, customer_phone, delivery_address, items, total, status, fulfillment_type)
   - `addresses` (id, user_id, title, recipient_name, phone, street_address, area, landmark, is_default)
2. **SMS OTP Authentication Service**:
   - Endpoint: `POST /api/auth/send-otp`
   - Endpoint: `POST /api/auth/verify-otp`
   - Integration with Pakistani SMS provider (Jazz/Zong/Telenor API or Twilio fallback).
3. **Product & Order APIs**:
   - `GET /api/products` (with faceted filters: brand, min_price, max_price, pta, condition, category).
   - `POST /api/orders` (generates `#BWN-XXXX` order, saves order record, triggers merchant notification).

### Priority 1: Merchant Center & Image Pipeline (Sprint 2)
1. **Cloud Image Storage**:
   - Cloudinary / S3 bucket with auto-compression to WebP (under 150KB for fast mobile load on 3G/4G).
2. **Merchant Portal APIs**:
   - `GET /api/merchant/inventory`
   - `POST /api/merchant/products` (add product with image URL & specs)
   - `PATCH /api/merchant/products/:id/stock` (toggle stock status)
   - `GET /api/merchant/orders`
   - `PATCH /api/merchant/orders/:id/status` (Confirmed, Dispatched, Delivered)
3. **Shop Onboarding & Approval Queue**:
   - Admin verification flow for new shops.

### Priority 2: Intelligence & Advanced Features (Sprint 3)
1. **Canonical Product Grouping & Buy Box Engine**:
   - Aggregate multi-shop listings under common parent SKUs.
2. **Cross-Shop Comparison Engine**:
   - Endpoint: `GET /api/products/compare?parent_sku=XYZ`
3. **Gemini AI Shopping Agent**:
   - Serverless Gemini function with live product inventory context.
4. **10-Point Condition Scoring Endpoint**:
   - Automated score calculation and visual inspection checklist serializer.

---

## 5. Required New Frontend UI Screens & Features

To support the full vision, the following frontend screens/components need to be created in subsequent updates:

1. **Mobile Hardware/Back Button Guard & Exit Dialog**:
   - Intercept Android back button (`popstate`) so pressing back reverses navigation or closes active modals, rather than dumping the user out of the site.
   - If on the main Explore page, show: *"Exit Bahawal Market? [Cancel] [Exit]"*.
2. **Cross-Shop Device Comparison Modal / Page (`ComparisonView.jsx`)**:
   - Side-by-side comparison columns for the same phone across different shops (Price, Battery, PTA, Condition, Shop distance).
3. **10-Point Condition Inspection Bar Panel**:
   - Visual breakdown component on product details for used phones showing scores out of 10 for Battery, Screen, Body, Camera, and PTA.
4. **Gemini AI Shopping Assistant Drawer (`AIAssistantModal.jsx`)**:
   - Interactive chat drawer connected to the `<Bot />` icon in the header.
5. **Account Settings Sub-Modals**:
   - Help Center & FAQ bottom sheet.
   - Vouchers list modal.
