import { NextRequest, NextResponse } from 'next/server';
import { isAuthedAdmin } from '@/lib/adminAuth';
import { getIp, rateLimit, tooManyRequests } from '@/lib/rateLimit';

/**
 * Admin-only mutations for order-like tables.
 *
 * Replaces the old pattern where the admin panel held the Supabase service-role
 * key in the browser and PATCHed Supabase directly. Now the secret key stays on
 * the server (env) and every write is gated by a signed admin token — same model
 * as /api/publish.
 *
 * Body: { table, id, status?, dataPatch? }
 *   table     — 'orders' | 'shop_orders' | 'quote_inquiries'
 *   status    — new status string (optional)
 *   dataPatch — partial object merged into the row's `data` JSON
 *               (orders / shop_orders only; quote_inquiries has no data column)
 */

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://alrgkykezmlcagovkkdl.supabase.co';
const SB_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const ALLOWED_TABLES = new Set(['orders', 'shop_orders', 'quote_inquiries']);
const HAS_DATA_COLUMN = new Set(['orders', 'shop_orders']);

export async function POST(req: NextRequest) {
  const rl = rateLimit(`order-update:${getIp(req)}`, 20, 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfterSecs);

  if (!isAuthedAdmin(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  if (!SB_KEY) {
    return NextResponse.json({ ok: false, error: 'Database not configured' }, { status: 503 });
  }

  try {
    const { table, id, status, dataPatch } = await req.json();

    if (!ALLOWED_TABLES.has(table) || !id) {
      return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 });
    }

    const headers = {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      'Content-Type': 'application/json',
    };

    const patch: Record<string, unknown> = {};
    if (typeof status === 'string' && status) patch.status = status;

    // Merge dataPatch into the existing row's `data` JSON so we never clobber the
    // original order snapshot (read-modify-write, server-side).
    if (dataPatch && typeof dataPatch === 'object' && HAS_DATA_COLUMN.has(table)) {
      const getRes = await fetch(
        `${SB_URL}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}&select=data`,
        { headers },
      );
      const rows = getRes.ok ? await getRes.json().catch(() => []) : [];
      const existing = (Array.isArray(rows) && rows[0] && rows[0].data) || {};
      patch.data = { ...existing, ...dataPatch };
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ ok: false, error: 'Nothing to update' }, { status: 400 });
    }

    const r = await fetch(`${SB_URL}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { ...headers, Prefer: 'return=minimal' },
      body: JSON.stringify(patch),
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
