import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import jwt from 'jsonwebtoken';
import { getIp, rateLimit, tooManyRequests } from '@/lib/rateLimit';

const SECRET = process.env.SESSION_SECRET || process.env.OTP_SECRET || 'kyzer-otp-secret-change-me';

function getEmail(req: NextRequest): string | null {
  const auth = req.headers.get('authorization');
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return null;
  try {
    const p = jwt.verify(token, SECRET, { algorithms: ['HS256'] }) as { email: string };
    return p.email || null;
  } catch { return null; }
}

// GET /api/wishlist — fetch wishlist item ids
export async function GET(req: NextRequest) {
  const rl = await rateLimit(`wishlist:${getIp(req)}`, 30, 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfterSecs);
  const email = getEmail(req);
  if (!email || !supabaseAdmin) return NextResponse.json({ items: [] });
  const { data } = await supabaseAdmin.from('wishlists').select('product_id').eq('email', email);
  return NextResponse.json({ items: (data || []).map((r: { product_id: string }) => r.product_id) });
}

// POST /api/wishlist — toggle item
export async function POST(req: NextRequest) {
  const rl = await rateLimit(`wishlist-post:${getIp(req)}`, 30, 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfterSecs);
  const email = getEmail(req);
  if (!email || !supabaseAdmin) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  const { product_id } = await req.json();
  if (!product_id) return NextResponse.json({ ok: false, error: 'Missing product_id' }, { status: 400 });

  const { data: existing } = await supabaseAdmin.from('wishlists').select('id').eq('email', email).eq('product_id', product_id).single();
  if (existing) {
    await supabaseAdmin.from('wishlists').delete().eq('email', email).eq('product_id', product_id);
    return NextResponse.json({ ok: true, action: 'removed' });
  } else {
    await supabaseAdmin.from('wishlists').insert({ email, product_id });
    return NextResponse.json({ ok: true, action: 'added' });
  }
}
