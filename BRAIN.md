# Kyzer Robotics — Project Brain

Running notes on architecture decisions, features built, and things to know.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js (App Router) — `react-app/` |
| Homepage | Legacy `index.html` embedded inside `page.tsx` via `dangerouslySetInnerHTML` |
| Admin panel | `react-app/public/admin.html` (standalone vanilla HTML) + React admin at `/admin` |
| Database | Supabase (PostgreSQL) — project `alrgkykezmlcagovkkdl` (ap-northeast-1) |
| Hosting | Vercel — team `kyzer1`, project `prj_luy0xUV8xxOnZTjLdYtHtFrrcAXl` |
| Payments | Razorpay |
| Email | Nodemailer (Gmail SMTP) |

---

## Coming Soon Mode

- Controlled by `site_data.coming_soon` JSON in Supabase: `{ enabled: bool, headline, tagline, date }`
- Admin toggles it from the Settings tab → publishes to Supabase
- **Client-side overlay**: `site.js` `checkComingSoon()` reads `localStorage.kyzer_coming_soon` and shows `#comingSoonOverlay`
- **Server-side enforcement** (added): `src/middleware.ts` reads `site_data.coming_soon.enabled` from Supabase on every request, redirects all non-exempt routes to `/` when enabled. Result is cached in a `__kcs` cookie for 30 seconds to avoid hitting Supabase on every request.
- **Admin bypass**: `/api/admin-login` sets an `__kcs_admin` cookie (8h) so admin can browse the full site even during coming soon mode.
- **Exempt routes**: `/`, `/admin`, `/api/*`, `/_next/*`, static files

---

## Visitor Tracking (Coming Soon Page)

- **Supabase table**: `cs_visits` (id, session_id, referrer, visited_at)
- **API**: `POST /api/cs-visit` — records one visit per browser session (deduped via `sessionStorage` key `kyzer_cs_sid`). Rate limited 10/hour per IP.
- **API**: `GET /api/cs-visit` — admin-only, returns `{ total, today, week }`
- **Trigger**: `site.js` `_csTrackVisit()` fires when the coming soon overlay activates
- **Admin Dashboard**: "Coming Soon — Visitor Traffic" card shows Today / Last 7 days / All Time counts

---

## Admin Panel (`/admin`)

React component at `src/app/admin/page.tsx` → `AdminShell` → tabs:

| Tab | Component | Notes |
|---|---|---|
| Dashboard | `AdminDashboard` | KPIs: Revenue, Shop Orders, 3D Orders, Customers + CS Visitor card |
| Shop Orders | `AdminShopOrders` | |
| 3D Print Orders | `AdminOrders` | |
| Quote Inquiries | `AdminQuotes` | |
| Customers | `AdminCustomers` | |
| Products | `AdminProducts` | Edit/publish product catalog to Supabase |
| Support Tickets | `AdminTickets` | |
| Settings | `AdminSettings` | Includes coming soon toggle |

- Auth: password → HMAC JWT token stored in `sessionStorage`, sent as `Authorization: Bearer <token>`
- Stats API: `GET /api/admin-stats` — returns revenue, order counts, customer count, recent orders, CS visit counts

---

## Supabase Tables

| Table | Purpose |
|---|---|
| `site_data` | Single row (id=1) — products JSONB, coming_soon JSON, categories, etc. |
| `orders` | Shop orders |
| `print_orders` | 3D print orders |
| `customers` | Registered users |
| `quote_inquiries` | Quote form submissions |
| `subscribers` | Coming soon email signups |
| `cs_visits` | Coming soon page visit sessions |

---

## Key Files

| File | What it does |
|---|---|
| `react-app/src/middleware.ts` | Server-side coming soon enforcement |
| `react-app/src/app/page.tsx` | Root page — embeds full legacy site HTML |
| `react-app/public/site.js` | All client-side JS (overlay, shop, cart, etc.) |
| `react-app/public/admin.html` | Standalone admin panel (vanilla HTML) |
| `react-app/src/lib/supabase.ts` | Supabase anon client (uses fallback placeholder if env vars missing at build time) |
| `react-app/src/lib/adminAuth.ts` | HMAC token verification for API routes |
| `react-app/supabase-setup.sql` | Full schema + RLS setup (run once in Supabase SQL editor) |

---

## Environment Variables (Vercel)

| Variable | Used for |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client-side Supabase access |
| `SUPABASE_SERVICE_KEY` | Server-side Supabase access (bypasses RLS) |
| `ADMIN_PASSWORD` | Admin panel login |
| `ADMIN_TOKEN_SECRET` | HMAC signing secret for admin tokens |
| `GMAIL_USER` / `GMAIL_PASS` | Email notifications |
| `NOTIFY_EMAIL` | Where order/quote emails are sent |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Payments |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Client-side Razorpay |
