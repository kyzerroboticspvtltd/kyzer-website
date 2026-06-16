-- ============================================================================
--  Kyzer Robotics — Supabase schema & security setup
--  Run this once in the Supabase SQL Editor (Dashboard → SQL → New query).
--  Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE / DROP POLICY IF EXISTS.
-- ============================================================================

-- ── 1. Product catalog (single row, id = 1) ────────────────────────────────
create table if not exists public.site_data (
  id          bigint primary key,
  products    jsonb,
  updated_at  timestamptz default now()
);
-- site_data may carry additional JSON columns published by the admin panel
-- (categories, hero_photos, coming_soon, etc.). PostgREST will accept them as
-- long as the columns exist; add any extra columns your admin payload sends.

-- ── 2. Orders (shop, COD, 3D print, quotes) ─────────────────────────────────
create table if not exists public.orders (
  id            text primary key,
  status        text default 'new',
  data          jsonb,                       -- full order snapshot (incl. type)
  submitted_at  timestamptz default now()
);
create index if not exists orders_submitted_at_idx on public.orders (submitted_at desc);

-- ── 3. Coming-soon / newsletter subscribers ────────────────────────────────
create table if not exists public.subscribers (
  email       text primary key,
  source      text,                          -- 'coming_soon' | 'newsletter'
  created_at  timestamptz default now()
);

-- ── 4. Customers (optional — only if you move auth server-side later) ───────
create table if not exists public.customers (
  id          text primary key,
  email       text unique,
  data        jsonb,
  created_at  timestamptz default now()
);

-- ── 5. Quote inquiries ──────────────────────────────────────────────────────
create table if not exists public.quote_inquiries (
  id            text primary key,
  data          jsonb,
  submitted_at  timestamptz default now()
);

-- ============================================================================
--  ROW LEVEL SECURITY
--  Principle: the public (anon key, shipped in the browser) may only WRITE the
--  things it needs to (create orders, subscribe). It must NOT be able to READ
--  customer/order data. The admin panel and server routes read using the
--  SERVICE ROLE key, which bypasses RLS entirely.
-- ============================================================================

-- site_data: world-readable (it's the public catalog), writes via service key only.
alter table public.site_data enable row level security;
drop policy if exists "site_data public read" on public.site_data;
create policy "site_data public read" on public.site_data
  for select to anon using (true);
-- (No anon insert/update policy → only the service role can publish.)

-- orders: anon may INSERT (place an order) but NOT select/update/delete.
alter table public.orders enable row level security;
drop policy if exists "orders anon insert" on public.orders;
create policy "orders anon insert" on public.orders
  for insert to anon with check (true);
-- (No anon select policy → order data is private. Admin reads via service key.)

-- subscribers: anon may INSERT only.
alter table public.subscribers enable row level security;
drop policy if exists "subscribers anon insert" on public.subscribers;
create policy "subscribers anon insert" on public.subscribers
  for insert to anon with check (true);

-- customers: anon may INSERT (sign up) only. (Reads via service key.)
alter table public.customers enable row level security;
drop policy if exists "customers anon insert" on public.customers;
create policy "customers anon insert" on public.customers
  for insert to anon with check (true);

-- quote_inquiries: anon may INSERT only.
alter table public.quote_inquiries enable row level security;
drop policy if exists "quote_inquiries anon insert" on public.quote_inquiries;
create policy "quote_inquiries anon insert" on public.quote_inquiries
  for insert to anon with check (true);

-- ============================================================================
--  AFTER RUNNING THIS:
--  1. In Vercel → Project → Settings → Environment Variables, ensure these are
--     set: ADMIN_PASSWORD, SUPABASE_SERVICE_KEY, NEXT_PUBLIC_SUPABASE_URL,
--     NEXT_PUBLIC_SUPABASE_ANON_KEY, GMAIL_USER, GMAIL_PASS, NOTIFY_EMAIL,
--     RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, NEXT_PUBLIC_RAZORPAY_KEY_ID.
--  2. In the admin panel → Security tab, paste the Supabase SERVICE ROLE key so
--     the admin can read orders/customers (anon key can no longer read them).
-- ============================================================================
