import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';

  if (!token || !token.includes('.')) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const dotIdx = token.indexOf('.');
  const ts = token.slice(0, dotIdx);
  const sig = token.slice(dotIdx + 1);

  const secret = process.env.ADMIN_PASSWORD || '';
  const expected = crypto.createHmac('sha256', secret).update(ts).digest('hex');

  const age = Math.floor(Date.now() / 1000) - Number(ts);
  const valid = sig === expected && age >= 0 && age < 86400;

  if (!valid) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
