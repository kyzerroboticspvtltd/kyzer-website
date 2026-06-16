import { NextRequest, NextResponse } from 'next/server';
import { isAuthedAdmin } from '@/lib/adminAuth';
import { getIp, rateLimit, tooManyRequests } from '@/lib/rateLimit';

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://alrgkykezmlcagovkkdl.supabase.co';
// Prefer the service-role key for this privileged write; fall back to anon only
// if no service key is configured (e.g. local dev with permissive RLS).
const SB_KEY = process.env.SUPABASE_SERVICE_KEY
  || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  || '';

export async function POST(req: NextRequest) {
  const rl = rateLimit(`publish:${getIp(req)}`, 20, 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfterSecs);

  // 🔒 Only an authenticated admin may overwrite the live catalog.
  if (!isAuthedAdmin(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { payload } = body;

    if (!payload || typeof payload !== 'object') {
      return NextResponse.json({ ok: false, error: 'No payload' }, { status: 400 });
    }

    if (!SB_KEY) {
      return NextResponse.json({ ok: false, error: 'Database not configured' }, { status: 503 });
    }

    const r = await fetch(`${SB_URL}/rest/v1/site_data`, {
      method: 'POST',
      headers: {
        'apikey': SB_KEY,
        'Authorization': `Bearer ${SB_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify({ ...payload, id: 1, updated_at: new Date().toISOString() }),
    });

    if (!r.ok) {
      const err = await r.text();
      return NextResponse.json({ ok: false, error: err }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
