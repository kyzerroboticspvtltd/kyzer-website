import { NextRequest, NextResponse } from 'next/server';

const BASE = 'https://kyzerrobotics.com';

async function probe(url: string, init?: RequestInit): Promise<{ status: number; body: unknown; ms: number }> {
  const t0 = Date.now();
  try {
    const r = await fetch(url, { ...init, signal: AbortSignal.timeout(5000) });
    let body: unknown = null;
    try { body = await r.json(); } catch { /* not json */ }
    return { status: r.status, body, ms: Date.now() - t0 };
  } catch {
    return { status: 0, body: null, ms: Date.now() - t0 };
  }
}

export async function GET(req: NextRequest) {
  const results: Record<string, { ok: boolean; status: number; detail: string; ms: number }> = {};

  // analytics
  const analytics = await probe(`${BASE}/api/analytics`);
  results.analytics = {
    ok: analytics.status === 200,
    status: analytics.status,
    detail: analytics.status === 200
      ? `Online · ${(analytics.body as Record<string,unknown>)?.total ?? '?'} visits`
      : `HTTP ${analytics.status || 'timeout'}`,
    ms: analytics.ms,
  };

  // my-orders — no token → must 401
  const mo1 = await probe(`${BASE}/api/my-orders`);
  results.myorders_unauthed = {
    ok: mo1.status === 401,
    status: mo1.status,
    detail: mo1.status === 401 ? '401 Unauthorized — auth enforced' : `Got ${mo1.status}, expected 401`,
    ms: mo1.ms,
  };

  // my-orders — bad token → must 401
  const mo2 = await probe(`${BASE}/api/my-orders`, { headers: { Authorization: 'Bearer fake.token.here' } });
  results.myorders_badtoken = {
    ok: mo2.status === 401,
    status: mo2.status,
    detail: mo2.status === 401 ? '401 — bad token rejected' : `Got ${mo2.status}, expected 401`,
    ms: mo2.ms,
  };

  // admin-login — wrong password → 401
  const al = await probe(`${BASE}/api/admin-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'audit-probe-wrong' }),
  });
  results.adminlogin = {
    ok: al.status === 401 || al.status === 429,
    status: al.status,
    detail: al.status === 401 ? '401 — wrong password rejected'
      : al.status === 429 ? '429 — rate limited'
      : `Got ${al.status}, expected 401`,
    ms: al.ms,
  };

  // publish — no auth → 401/403
  const pub = await probe(`${BASE}/api/publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  });
  results.publish_unauthed = {
    ok: pub.status === 401 || pub.status === 403,
    status: pub.status,
    detail: pub.status === 401 || pub.status === 403 ? `${pub.status} — admin auth enforced` : `Got ${pub.status}`,
    ms: pub.ms,
  };

  // order-update — no auth → 401/403
  const ou = await probe(`${BASE}/api/order-update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  });
  results.orderupdate_unauthed = {
    ok: ou.status === 401 || ou.status === 403,
    status: ou.status,
    detail: ou.status === 401 || ou.status === 403 ? `${ou.status} — admin auth enforced` : `Got ${ou.status}`,
    ms: ou.ms,
  };

  // checkout-token — must return a token
  const ct = await probe(`${BASE}/api/checkout-token`);
  const ctBody = ct.body as Record<string, unknown> | null;
  const hasToken = typeof ctBody?.token === 'string' && (ctBody.token as string).includes('.');
  results.checkouttoken = {
    ok: ct.status === 200 && hasToken,
    status: ct.status,
    detail: hasToken ? 'Returns HMAC-signed token' : `HTTP ${ct.status} — bad or missing token`,
    ms: ct.ms,
  };

  // support-ticket — invalid email → should 400
  const st = await probe(`${BASE}/api/support-ticket`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test', email: 'not-an-email', subject: 'audit', message: 'probe' }),
  });
  results.supportticket_email = {
    ok: st.status === 400,
    status: st.status,
    detail: st.status === 400 ? '400 — invalid email rejected ✓'
      : st.status === 200 ? 'Accepted invalid email — validation missing ✗'
      : `HTTP ${st.status}`,
    ms: st.ms,
  };

  // sheet-sync — no auth → 401
  const ss = await probe(`${BASE}/api/sheet-sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  });
  results.sheetsync_unauthed = {
    ok: ss.status === 401 || ss.status === 403,
    status: ss.status,
    detail: ss.status === 401 || ss.status === 403 ? `${ss.status} — bearer token enforced` : `Got ${ss.status}`,
    ms: ss.ms,
  };

  // contact — probe (expect 400 on empty fields, 429 if rate limited)
  const co = await probe(`${BASE}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: '', email: '', message: '' }),
  });
  results.contact_ratelimit = {
    ok: co.status === 400 || co.status === 429,
    status: co.status,
    detail: co.status === 429 ? '429 — rate limited'
      : co.status === 400 ? 'Handler reached (empty fields rejected)'
      : `HTTP ${co.status}`,
    ms: co.ms,
  };

  const passed = Object.values(results).filter(r => r.ok).length;
  const total = Object.keys(results).length;

  return NextResponse.json({ results, passed, total, ts: Date.now() });
}
