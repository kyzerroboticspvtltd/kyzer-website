import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getIp, rateLimit, tooManyRequests } from '@/lib/rateLimit';

const TOKEN_TTL_MS = 30 * 60 * 1000; // 30 minutes

function makeToken(): string {
  const secret = process.env.ORDER_TOKEN_SECRET || '';
  if (!secret) throw new Error('ORDER_TOKEN_SECRET not configured');
  const ts = String(Date.now());
  const sig = crypto.createHmac('sha256', secret).update(ts).digest('hex');
  return `${ts}.${sig}`;
}

export function verifyCheckoutToken(token: string | null | undefined): boolean {
  if (!token) return false;
  const secret = process.env.ORDER_TOKEN_SECRET || '';
  if (!secret) return false;

  const dot = token.indexOf('.');
  if (dot < 1) return false;

  const ts = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const age = Date.now() - Number(ts);
  if (!Number.isFinite(age) || age < 0 || age > TOKEN_TTL_MS) return false;

  const expected = crypto.createHmac('sha256', secret).update(ts).digest('hex');
  const a = Buffer.from(sig.padEnd(expected.length, ' '));
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// GET /api/checkout-token  — called when the checkout page opens
export async function GET(req: NextRequest) {
  const rl = rateLimit(`checkout-token:${getIp(req)}`, 10, 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfterSecs);

  try {
    const token = makeToken();
    return NextResponse.json({ ok: true, token });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
