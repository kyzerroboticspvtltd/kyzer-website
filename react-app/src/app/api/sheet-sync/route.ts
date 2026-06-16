import { NextRequest, NextResponse } from 'next/server';
import { getIp, rateLimit, tooManyRequests } from '@/lib/rateLimit';
import { BODY_LIMIT, rejectOversized } from '@/lib/sanitize';

/**
 * Sheet-sync endpoint — receives product rows from a Google Sheets Apps Script
 * trigger and upserts them into the live catalog (site_data.products).
 *
 * Auth: static bearer token from env SHEET_SYNC_SECRET (set in Vercel dashboard).
 * Body: { products: Array<{ id, name, price?, category?, subcat?, type?,
 *                            description?, emoji?, button?, visible? }> }
 *
 * Products are merged by `id` — existing products NOT in the sheet payload are
 * kept unchanged. To hide a product, set visible=false in the sheet.
 */

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SB_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SYNC_SECRET = process.env.SHEET_SYNC_SECRET || '';

function isAuthed(req: NextRequest): boolean {
  if (!SYNC_SECRET) return false;
  const auth = req.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  return token === SYNC_SECRET;
}

type SheetProduct = {
  id?: string;
  name?: string;
  price?: number | string;
  category?: string;
  subcat?: string;
  type?: string;
  description?: string;
  emoji?: string;
  button?: string;
  visible?: boolean | string;
};

function normalise(p: SheetProduct) {
  return {
    id: (p.id || '').trim(),
    name: (p.name || '').trim(),
    price: p.price !== undefined && p.price !== '' ? Number(p.price) : undefined,
    category: (p.category || 'electronics').trim().toLowerCase(),
    subcat: (p.subcat || '').trim().toLowerCase(),
    type: (p.type || '').trim().toLowerCase(),
    description: (p.description || '').trim(),
    emoji: (p.emoji || '📦').trim(),
    button: (p.button || 'buy').trim().toLowerCase(),
    visible: String(p.visible ?? 'yes').toLowerCase() !== 'no' &&
             String(p.visible ?? 'yes').toLowerCase() !== 'false',
  };
}

export async function POST(req: NextRequest) {
  const rl = rateLimit(`sheet-sync:${getIp(req)}`, 60, 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfterSecs);

  const oversize = rejectOversized(req, BODY_LIMIT.LARGE);
  if (oversize) return oversize;

  if (!isAuthed(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  if (!SB_KEY) {
    return NextResponse.json({ ok: false, error: 'Database not configured' }, { status: 503 });
  }

  let incoming: SheetProduct[];
  try {
    const body = await req.json();
    incoming = Array.isArray(body.products) ? body.products : [];
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  // Filter out rows with no id or no name (blank rows from the sheet)
  const sheetProducts = incoming
    .map(normalise)
    .filter(p => p.id && p.name);

  if (sheetProducts.length === 0) {
    return NextResponse.json({ ok: false, error: 'No valid products in payload' }, { status: 400 });
  }

  const headers = {
    apikey: SB_KEY,
    Authorization: `Bearer ${SB_KEY}`,
    'Content-Type': 'application/json',
  };

  // Read existing site_data
  const getRes = await fetch(`${SB_URL}/rest/v1/site_data?id=eq.1&select=products`, { headers });
  const rows = getRes.ok ? await getRes.json().catch(() => []) : [];
  const existingProducts: SheetProduct[] = (Array.isArray(rows) && rows[0]?.products) ? rows[0].products : [];

  // Upsert by id: sheet rows override, unknowns are kept
  const byId = new Map(existingProducts.map((p: SheetProduct) => [p.id, p]));
  for (const p of sheetProducts) {
    byId.set(p.id, { ...byId.get(p.id), ...p });
  }
  const merged = Array.from(byId.values());

  const r = await fetch(`${SB_URL}/rest/v1/site_data`, {
    method: 'POST',
    headers: { ...headers, Prefer: 'resolution=merge-duplicates' },
    body: JSON.stringify({ id: 1, products: merged, updated_at: new Date().toISOString() }),
  });

  if (!r.ok) {
    const err = await r.text();
    return NextResponse.json({ ok: false, error: err }, { status: 500 });
  }

  return NextResponse.json({ ok: true, upserted: sheetProducts.length, total: merged.length });
}
