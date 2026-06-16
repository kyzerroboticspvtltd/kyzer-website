# Kyzer Robotics — Web App Architecture

## Folder Structure

```
c:\Desktop\Kyzer website\
├── react-app/          ← Next.js 16 app (deployed on Vercel)
├── backend/            ← Express.js server (separate deployment)
├── index.html          ← Legacy homepage (loaded inside Next.js home route)
├── admin.html          ← Standalone admin panel
└── supabase-config.js  ← Supabase client config
```

---

## Frontend — Next.js 16 (App Router)

Deployed to **Vercel → kyzerrobotics.com**

```
react-app/src/app/
├── page.tsx                     ← Home (embeds legacy index.html + site.js)
├── not-found.tsx / error.tsx / loading.tsx   ← global UX states
├── sitemap.ts / robots.ts       ← generated /sitemap.xml and /robots.txt
├── privacy/ terms/              ← legal pages (real, crawlable URLs)
├── refund-policy/ shipping-policy/
├── _components/LegalLayout.tsx  ← shared chrome for legal pages
├── get-a-quote/                 ← Quote request form (+ layout.tsx for SEO)
├── shop/                        ← each sub-route has a layout.tsx exporting metadata
│   ├── drones/
│   ├── drone-frames/
│   ├── complete-drones/
│   ├── electronics/
│   │   ├── arduino/
│   │   └── products/
│   ├── 3d-printing/
│   ├── printers-supplies/
│   ├── printing/
│   └── prototyping/
└── api/                         ← Next.js serverless API routes
    ├── admin-login / admin-verify
    ├── create-razorpay-order / verify-payment
    ├── contact / quote-inquiry / print-quote
    ├── order-notify
    ├── publish                  ← Pushes product data to Supabase
    ├── analytics / track-visit
    └── cs-subscribe             ← Coming Soon email signup
```

**Key client libs:** `@supabase/supabase-js`, `razorpay`, `nodemailer`, `pdfkit`

**Security & data integrity (added):**
- `src/lib/adminAuth.ts` — HMAC admin-token verification. `/api/publish` and `/api/admin-verify` now require a valid `Authorization: Bearer <token>` issued by `/api/admin-login`. The admin panel obtains and sends this token automatically.
- `src/lib/orders.ts` — server-side `saveOrder()` persists every order to Supabase (`orders` table) using the service key, so the server is the source of truth even if email or the client fails. Called from `verify-payment`, `order-notify`, and `print-quote`.
- `react-app/supabase-setup.sql` — schema + Row Level Security. Anon key can INSERT orders but **cannot read** them; admin/server read via the service-role key.

---

## Backend — Express.js

Separate Node.js server (`backend/server.js`), runs independently of Vercel.

- Admin login / session management
- Email notifications (Nodemailer → Gmail SMTP)
- SMS/WhatsApp alerts (Twilio)
- Razorpay order + payment verification (duplicate of Next.js API — legacy)
- Rate limiting, CORS whitelist

> **Note:** Most of this functionality is now duplicated inside Next.js API routes. The Express backend is a legacy server from before the Next.js migration.

---

## Database — Supabase (PostgreSQL)

| Table | Purpose |
|---|---|
| `site_data` | Single row (`id=1`) with `products` JSONB column — all product catalog |

Products are managed via `admin.html`, saved to localStorage, then **published** to Supabase via `/api/publish`. Shop pages fetch from Supabase on load.

---

## Admin Panel — `admin.html`

Standalone HTML file (no React). Direct Supabase JS SDK calls.

- Product CRUD (name, price, category, subcategory, images, visibility)
- Order tracking
- Analytics dashboard
- Settings (site content editor)
- Publishes to Supabase → live site updates

---

## Data Flow

### Product Publishing

```
Admin edits product
       ↓
admin.html → localStorage
       ↓
[Publish button] → POST /api/publish
       ↓
Supabase site_data.products (JSONB)
       ↓
Shop pages fetch on load → render product cards
```

### Checkout & Payment

```
Customer buys
       ↓
Shop page → Razorpay checkout
       ↓
POST /api/create-razorpay-order
       ↓
Razorpay webhook → POST /api/verify-payment
       ↓
POST /api/order-notify → Email (Gmail SMTP) + optional SMS
       ↓
Client-side: jsPDF generates invoice → Download
```

---

## Key Design Decisions

| Decision | Detail |
|---|---|
| **Hybrid site** | Next.js wraps the legacy `index.html` — homepage is the old static site inside a React shell |
| **Single JSONB column** | All products stored as one JSON blob in Supabase — no relational schema |
| **Admin is vanilla HTML** | No framework, direct Supabase calls — fast to edit, no build step |
| **Two backends** | Express (`backend/`) is legacy; Next.js API routes handle everything now |
| **Client-side PDF** | Invoices generated in-browser via `jsPDF` — no server involvement |
