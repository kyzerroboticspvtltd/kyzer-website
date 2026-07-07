import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import jwt from 'jsonwebtoken';
import { getIp, rateLimit, tooManyRequests } from '@/lib/rateLimit';

const SESSION_SECRET = process.env.SESSION_SECRET || process.env.OTP_SECRET || 'kyzer-otp-secret-change-me';

function verifySessionToken(token: string): string | null {
  try {
    const payload = jwt.verify(token, SESSION_SECRET, { algorithms: ['HS256'] }) as { email: string };
    return payload.email || null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const rl = await rateLimit(`my-orders:${getIp(req)}`, 20, 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfterSecs);

  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const email = verifySessionToken(token);
  if (!email) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('id, status, data, submitted_at')
    .filter('data->>email', 'ilike', email)
    .filter('data->>type', 'in', '(shop,cod)')
    .order('submitted_at', { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data });
}
