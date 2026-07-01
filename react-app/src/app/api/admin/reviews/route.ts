import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { isAuthedAdmin } from '@/lib/adminAuth';
import { getIp, rateLimit, tooManyRequests } from '@/lib/rateLimit';

export async function GET(req: NextRequest) {
  const rl = await rateLimit(`admin-reviews:${getIp(req)}`, 20, 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfterSecs);
  if (!isAuthedAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!supabaseAdmin) return NextResponse.json({ reviews: [] });
  const { data } = await supabaseAdmin.from('product_reviews').select('*').order('created_at', { ascending: false }).limit(200);
  return NextResponse.json({ reviews: data || [] });
}

export async function POST(req: NextRequest) {
  const rl = await rateLimit(`admin-reviews-post:${getIp(req)}`, 20, 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfterSecs);
  if (!isAuthedAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!supabaseAdmin) return NextResponse.json({ ok: false });
  const { id, action } = await req.json();
  if (!id || !action) return NextResponse.json({ ok: false }, { status: 400 });
  if (action === 'approve') {
    await supabaseAdmin.from('product_reviews').update({ approved: true }).eq('id', id);
  } else if (action === 'delete') {
    await supabaseAdmin.from('product_reviews').delete().eq('id', id);
  }
  return NextResponse.json({ ok: true });
}
