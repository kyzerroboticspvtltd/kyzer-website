import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getIp, rateLimit, tooManyRequests } from '@/lib/rateLimit';
import { BODY_LIMIT, rejectOversized } from '@/lib/sanitize';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

interface Coupon {
  code: string;
  type: 'percent' | 'flat';
  value: number;
  minOrder?: number;
  expiresAt?: string;
  active?: boolean;
}

export async function POST(req: NextRequest) {
  const rl = await rateLimit(`validate-coupon:${getIp(req)}`, 15, 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfterSecs);

  const oversize = rejectOversized(req, BODY_LIMIT.TINY);
  if (oversize) return oversize;

  try {
    const { code, subtotal } = await req.json();
    const trimmed = typeof code === 'string' ? code.trim().toUpperCase() : '';
    const sub = Number(subtotal) || 0;
    if (!trimmed) return NextResponse.json({ ok: false, error: 'Enter a coupon code.' }, { status: 400 });

    const sb = getSupabase();
    if (!sb) return NextResponse.json({ ok: false, error: 'Not available right now.' }, { status: 503 });

    const { data } = await sb.from('site_data').select('coupons').single();
    const coupons: Coupon[] = data?.coupons || [];
    const coupon = coupons.find(c => c.code === trimmed);

    if (!coupon) return NextResponse.json({ ok: false, error: 'Invalid coupon code.' }, { status: 404 });
    if (coupon.active === false) return NextResponse.json({ ok: false, error: 'This coupon is no longer active.' }, { status: 400 });
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return NextResponse.json({ ok: false, error: 'This coupon has expired.' }, { status: 400 });
    if (coupon.minOrder && sub < coupon.minOrder) {
      return NextResponse.json({ ok: false, error: `Minimum order of ₹${coupon.minOrder} required for this coupon.` }, { status: 400 });
    }

    const discount = coupon.type === 'percent' ? Math.round(sub * (coupon.value / 100)) : Math.min(coupon.value, sub);
    return NextResponse.json({ ok: true, discount, type: coupon.type, value: coupon.value });
  } catch {
    return NextResponse.json({ ok: false, error: 'Something went wrong.' }, { status: 500 });
  }
}
