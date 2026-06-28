import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getIp, rateLimit } from '@/lib/rateLimit';

function detectDevice(ua: string): string {
  if (/mobile|android|iphone|ipad|ipod/i.test(ua)) return 'mobile';
  if (/tablet|ipad/i.test(ua)) return 'tablet';
  return 'desktop';
}

export async function POST(req: NextRequest) {
  // Rate limit: max 5 track calls per IP per minute
  const ip = getIp(req);
  const rl = await rateLimit(`track:${ip}`, 5, 60_000);
  if (!rl.ok) return NextResponse.json({ ok: false }, { status: 429 });

  try {
    const body = await req.json();
    const ua = req.headers.get('user-agent') || '';
    const country = req.headers.get('x-vercel-ip-country') || null;

    // Ignore bot traffic
    if (/bot|crawl|spider|slurp|googlebot|bingbot|facebookexternalhit/i.test(ua)) {
      return NextResponse.json({ ok: true });
    }

    const page = typeof body.page === 'string' ? body.page.slice(0, 300) : null;
    const referrer = typeof body.referrer === 'string' ? body.referrer.slice(0, 500) : null;
    const device = detectDevice(ua);

    await supabaseAdmin.from('analytics_visits').insert({
      visited_at: new Date().toISOString(),
      page,
      referrer,
      device,
      country,
      ua: ua.slice(0, 300),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
