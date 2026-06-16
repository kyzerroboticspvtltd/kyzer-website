import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getIp, rateLimit, tooManyRequests } from '@/lib/rateLimit';

const CORS = { 'Access-Control-Allow-Origin': '*' };

export async function OPTIONS() {
  return new NextResponse(null, { headers: { ...CORS, 'Access-Control-Allow-Methods': 'GET' } });
}

export async function GET(req: NextRequest) {
  const rl = rateLimit(`analytics:${getIp(req)}`, 60, 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfterSecs);
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      return NextResponse.json({ ok: true, total: 0, today: 0, week: 0 });
    }

    const sb = createClient(url, key);
    const today = new Date().toISOString().slice(0, 10);
    const weekAgo = new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10);

    const { count: total } = await sb.from('analytics_visits').select('*', { count: 'exact', head: true });
    const { count: todayCount } = await sb
      .from('analytics_visits')
      .select('*', { count: 'exact', head: true })
      .gte('visited_at', today + 'T00:00:00Z');
    const { count: weekCount } = await sb
      .from('analytics_visits')
      .select('*', { count: 'exact', head: true })
      .gte('visited_at', weekAgo + 'T00:00:00Z');

    return NextResponse.json({ ok: true, total: total || 0, today: todayCount || 0, week: weekCount || 0 }, { headers: CORS });
  } catch {
    return NextResponse.json({ ok: true, total: 0, today: 0, week: 0 }, { headers: CORS });
  }
}
