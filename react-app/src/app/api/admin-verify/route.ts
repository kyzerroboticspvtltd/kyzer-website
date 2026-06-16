import { NextRequest, NextResponse } from 'next/server';
import { isAuthedAdmin } from '@/lib/adminAuth';
import { getIp, rateLimit, tooManyRequests } from '@/lib/rateLimit';

export async function GET(req: NextRequest) {
  const rl = rateLimit(`admin-verify:${getIp(req)}`, 30, 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfterSecs);

  if (!isAuthedAdmin(req)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
