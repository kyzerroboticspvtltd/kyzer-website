import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getIp, rateLimit, tooManyRequests } from '@/lib/rateLimit';
import { BODY_LIMIT, rejectOversized } from '@/lib/sanitize';

function sign(ts: string): string {
  // Sign with a dedicated secret so captured tokens cannot be used to
  // brute-force the admin password offline.
  const secret = process.env.ADMIN_TOKEN_SECRET || process.env.ADMIN_PASSWORD || '';
  return crypto.createHmac('sha256', secret).update(ts).digest('hex');
}

export async function POST(req: NextRequest) {
  const rl = rateLimit(`login:${getIp(req)}`, 5, 15 * 60 * 1000);
  if (!rl.ok) return tooManyRequests(rl.retryAfterSecs);

  const oversize = rejectOversized(req, BODY_LIMIT.TINY);
  if (oversize) return oversize;

  try {
    const body = await req.json();
    const password = typeof body?.password === 'string' ? body.password.slice(0, 200) : '';
    const expected = process.env.ADMIN_PASSWORD;

    if (!expected || !password || password !== expected) {
      await new Promise(r => setTimeout(r, 600));
      return NextResponse.json({ ok: false, error: 'Invalid password' }, { status: 401 });
    }

    const ts = String(Math.floor(Date.now() / 1000));
    const token = `${ts}.${sign(ts)}`;
    return NextResponse.json({ ok: true, token });
  } catch {
    return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 });
  }
}
