import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getIp, rateLimit, tooManyRequests } from '@/lib/rateLimit';
import { esc } from '@/lib/sanitize';

// GET /api/reviews?product_id=xxx — fetch approved reviews
export async function GET(req: NextRequest) {
  const rl = await rateLimit(`reviews-get:${getIp(req)}`, 30, 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfterSecs);
  const product_id = req.nextUrl.searchParams.get('product_id');
  if (!product_id || !supabaseAdmin) return NextResponse.json({ reviews: [] });
  const { data } = await supabaseAdmin
    .from('product_reviews')
    .select('id, name, rating, review, created_at')
    .eq('product_id', product_id)
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(50);
  return NextResponse.json({ reviews: data || [] });
}

// POST /api/reviews — submit a new review
export async function POST(req: NextRequest) {
  const rl = await rateLimit(`reviews-post:${getIp(req)}`, 5, 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfterSecs);
  if (!supabaseAdmin) return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  const body = await req.json();
  const { product_id, name, email, rating, review } = body ?? {};
  if (!product_id || !name || !email || !rating) return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 });
  if (rating < 1 || rating > 5) return NextResponse.json({ ok: false, error: 'Invalid rating' }, { status: 400 });
  const { error } = await supabaseAdmin.from('product_reviews').upsert({
    product_id: esc(String(product_id)),
    name: esc(String(name).slice(0, 100)),
    email: esc(String(email).slice(0, 200)),
    rating: Number(rating),
    review: esc(String(review || '').slice(0, 2000)),
    approved: false,
  }, { onConflict: 'product_id,email' });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
