# Kyzer Robotics Website — Project Brain

> Pull this file at the start of every session. Update it when architecture or workflow changes.

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router), React, TypeScript |
| Styling | Tailwind CSS + DaisyUI |
| Hosting | Vercel (`kyzer1/kyzer-website`) — root dir: `react-app/` |
| Database | Supabase (orders, customers, OTPs, quotes) |
| Payments | Cashfree (sandbox test keys added 2026-06-30; switch CASHFREE_ENV=production for live) |
| Auth | HMAC HS256 JWT for admin; email OTP for customers |
| Domain | kyzerrobotics.com |

---

## Repo Layout

```
Kyzer website/
├── react-app/               ← Next.js app (Vercel root)
│   ├── src/
│   │   ├── app/             ← App Router pages + API routes
│   │   │   └── api/
│   │   │       ├── admin-login/      ← returns JWT token
│   │   │       ├── publish/          ← writes products to Supabase
│   │   │       ├── sheet-proxy/      ← server-side Google Sheets CSV fetch
│   │   │       ├── sheet-sync/       ← receives Apps Script webhook → Supabase
│   │   │       ├── create-cashfree-order/  ← creates Cashfree order, stores amount in pending_payments
│   │   │       ├── verify-cashfree-payment/ ← verifies payment, saves order, sends invoice email+PDF
│   │   │       ├── send-email-otp / verify-email-otp
│   │   │       └── ... (orders, quotes, support, etc.)
│   │   ├── checkout/
│   │   │   ├── review/page.tsx      ← Review order + payment method + Pay button (single step)
│   │   │   ├── success/page.tsx     ← post-Cashfree redirect; calls verify endpoint
│   │   │   └── address/             ← shipping address (COD flow)
│   │   ├── data/
│   │   │   └── products.ts  ← THE MASTER PRODUCT LIST for the live shop (21 products)
│   │   └── lib/
│   │       ├── adminAuth.ts ← isAuthedAdmin() — verifies Bearer JWT
│   │       └── rateLimit.ts
│   └── public/
│       ├── admin.html       ← Standalone admin panel (no React build needed)
│       └── kyzer-products-all.csv  ← 194-product export for Google Sheets
└── BRAIN.md                 ← this file
```

---

## Two Product Systems (IMPORTANT)

### 1. Live Shop — `products.ts`
- File: `react-app/src/data/products.ts`
- 21 products across 5 categories: electronics, drones, 3d-printing, prototyping, printers-supplies
- Powers the public shop at kyzerrobotics.com/shop
- To add/edit shop products → edit this file → redeploy

### 2. Admin Panel — `localStorage` in `admin.html`
- File: `react-app/public/admin.html` (static, no build step)
- Products stored in `localStorage.kyzer_site_data`
- Seeded from `SEED_PRODUCTS` array in admin.html on first load
- `SEED_VERSION` constant: bump to force-wipe old localStorage and reseed
- Current seed = 21 products from products.ts (matching IDs: e-uno, e-mega, d-fpv5, etc.)
- Publish button → calls `/api/publish` with Bearer token → writes to Supabase

### Syncing rule
- **Products.ts → Admin**: products.ts is the source of truth for the live shop. Admin seed mirrors it.
- **Admin → Google Sheet**: use the "Sync Sheets" button or export `kyzer-products-all.csv`
- **Google Sheet → Admin**: "Sync Sheets" button in admin → `/api/sheet-proxy` → imports CSV

---

## Admin Panel (`/admin.html`)

- URL: `kyzerrobotics.com/admin.html#manage`
- Auth: password → `/api/admin-login` → JWT stored as `TOKEN` in localStorage
- Tabs: Dashboard, Shop Orders, 3D Orders, Quotes, Support, Customers, **Products**, Hero & Stats, Services, Contact, Quote Pricing, Photos, Settings
- Product toolbar: Template download | Import Excel | Sync Sheets | + Add product
- Product edit modal: image preview + URL paste + file upload (base64, 2MB limit), name, category, subcategory, price, badge, description

### Key JS functions in admin.html
| Function | Purpose |
|----------|---------|
| `loadAll()` | Loads localStorage, checks SEED_VERSION, merges missing products |
| `syncGoogleSheet()` | Fetches CSV via `/api/sheet-proxy`, opens import modal |
| `parseSheetRows(text)` | Smart CSV parser — handles irregular Google Sheet formats |
| `openProductModal(product)` | Edit/add modal with image upload |
| `saveProduct()` | Saves edited product back to localStorage |
| `openImportModal()` | Bulk import from Excel/CSV via SheetJS |

---

## API Routes

| Route | Auth | Purpose |
|-------|------|---------|
| `POST /api/admin-login` | password | Returns JWT |
| `POST /api/publish` | Bearer JWT | Publishes localStorage products to Supabase |
| `GET /api/sheet-proxy?url=` | Bearer JWT | Proxies Google Sheets CSV (bypasses CORS) |
| `POST /api/sheet-sync` | SHEET_SYNC_SECRET | Apps Script webhook → upserts products to Supabase |
| `POST /api/create-cashfree-order` | — | Creates Cashfree order; server-calculates amount from Supabase prices; stores in `pending_payments` |
| `POST /api/verify-cashfree-payment` | — | Verifies via Cashfree API, saves order to Supabase, sends PDF invoice email |
| `POST /api/send-email-otp` | — | Sends OTP to customer email |
| `POST /api/verify-email-otp` | — | Verifies OTP, issues customer session |
| `GET /api/admin-orders` | Bearer JWT | Lists shop orders from Supabase |
| `GET /api/admin-stats` | Bearer JWT | Dashboard stats |

---

## Google Sheets Integration

- Kyzer products sheet: `https://docs.google.com/spreadsheets/d/11mvgKpp1_kb3yGfn76gSwuvN6BkeK64RqtOvKcnwugU`
- All-products export sheet (194 products): `https://docs.google.com/spreadsheets/d/1ahe8sNG8JDhSVD7dKOyRHFcnI8_YOxxvRiwB5ToQ5MM`
- Sheet proxy: admin passes raw sheets URL → `/api/sheet-proxy` extracts sheet ID + optional gid → builds clean `export?format=csv` URL → fetches server-side
- Sheet must be shared as "Anyone with the link can view" for sync to work

---

## Deployment

```bash
cd react-app
vercel --prod --yes   # deploy to production
```

- Vercel project: `kyzer1/kyzer-website`
- `.vercel/` config is at repo root (not inside react-app/)
- Preview builds fail (missing Supabase env vars) — always deploy `--prod`

---

## Payment Flow (Cashfree)

### Online checkout (shop cart / 3D print quote)
1. User clicks Pay → `site.js` or `/checkout/review` (payment method toggle + Pay button) calls `POST /api/create-cashfree-order`
2. Server calculates price from Supabase (not client), stores amount in `pending_payments` table
3. Server returns `payment_session_id` → client saves `kyzer_pending_order` to localStorage
4. Cashfree SDK redirects user to hosted checkout (`mode: 'production'`, `redirectTarget: '_self'`)
5. After payment, Cashfree redirects to `/checkout/success?order_id={order_id}`
6. Success page reads `kyzer_pending_order` from localStorage, calls `POST /api/verify-cashfree-payment`
7. Verify endpoint: checks Cashfree order status = PAID, fetches server amount from `pending_payments`, saves order to Supabase, sends admin + customer emails with PDF invoice

### Env vars (Vercel)
| Var | Value |
|-----|-------|
| `CASHFREE_APP_ID` | test or production App ID |
| `CASHFREE_SECRET_KEY` | test or production secret |
| `CASHFREE_ENV` | `sandbox` (test) or `production` (live) |

### Supabase table reuse
`pending_payments.razorpay_order_id` column stores the Cashfree order ID (column name kept to avoid migration).

---

## Known Gotchas

1. **Never use PowerShell `Get-Content`/`Set-Content` on admin.html** — PowerShell 5.1 re-encodes UTF-8 as Windows-1252, corrupting ₹ and emoji. Always use Node.js `fs.readFileSync/writeFileSync` with `'utf8'`.
2. **SEED_VERSION**: when changing which products are seeded, bump `SEED_VERSION` in admin.html so existing users get fresh data on next load.
3. **Two separate product lists**: `products.ts` powers the shop; admin.html `SEED_PRODUCTS` powers the admin. Keep them in sync manually — admin seed IDs must match products.ts IDs.
4. **Google Sheets gid=0 bug**: Google returns HTTP 400 when `gid=0` is appended but the sheet has no such tab. The proxy now omits gid when not present in the original URL.
5. **Admin auth**: JWT token is stored in `TOKEN` variable in admin.html. API routes check `Authorization: Bearer <token>` via `isAuthedAdmin()`.
6. **Base64 images**: product images uploaded via file picker are stored as base64 data URLs in localStorage. Large images (>2MB) are rejected.

---

## Change Log

| Date | Change |
|------|--------|
| 2026-06-26 | Added SEED_VERSION reset, replaced 173 rb-* seed with 21 website products |
| 2026-06-26 | Fixed UTF-8 corruption caused by PowerShell edit |
| 2026-06-26 | Created `/api/sheet-proxy` to bypass CORS on Google Sheets |
| 2026-06-26 | Fixed HTTP 400 from Google Sheets — proxy builds clean export URL |
| 2026-06-26 | Added image upload (URL + file/base64) to product edit modal |
| 2026-06-26 | Added Excel/CSV bulk import with SheetJS |
| 2026-06-26 | Added "Sync Sheets" button connecting admin to Google Sheets |
| 2026-06-26 | Uploaded all 194 products to Google Drive spreadsheet |
| 2026-06-30 | Fixed Upstash Redis BOM bug (invisible ﻿ in env var URL) |
| 2026-06-30 | Fixed evalsha crash — store Redis client separately, not extracted from Ratelimit instance |
| 2026-06-30 | Removed firebase-admin (caused ERR_REQUIRE_ESM on verify-email-otp) |
| 2026-06-30 | Replaced Razorpay with Cashfree — new routes: create-cashfree-order, verify-cashfree-payment |
| 2026-06-30 | Added /checkout/success page for post-Cashfree redirect verification |
| 2026-06-30 | Updated /checkout/payment page to use Cashfree redirect flow |
| 2026-06-30 | Collapsed two-step checkout (review + payment) into single /checkout/review page with inline payment method + Pay button |
| 2026-06-30 | Fixed mobile nav: backdrop-filter creating containing block, logo sizing, hamburger null guard |
| 2026-06-30 | Added pdfkit to serverExternalPackages + outputFileTracingIncludes for Vercel PDF support |
