import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getIp, rateLimit, tooManyRequests } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  const rl = rateLimit(`track-visit:${getIp(req)}`, 60, 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfterSecs);
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) {
      const sb = createClient(url, key);
      await sb.from('analytics_visits').insert({ visited_at: new Date().toISOString() });
    }
  } catch {
    // fire-and-forget — never block the response
  }
  return NextResponse.json({ ok: true });
}
