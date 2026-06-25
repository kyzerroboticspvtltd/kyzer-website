import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { getIp, rateLimit, tooManyRequests } from '@/lib/rateLimit';

const OTP_SECRET = process.env.OTP_SECRET || 'kyzer-otp-secret-change-me';
const SESSION_SECRET = process.env.SESSION_SECRET || OTP_SECRET;
const OTP_TTL_MS = 10 * 60 * 1000;

function verifySession(email: string, otp: string, session: string): boolean {
  try {
    const decoded = Buffer.from(session, 'base64url').toString();
    const parts = decoded.split(':');
    if (parts.length !== 4) return false;
    const [sEmail, sOtp, sIat, sSig] = parts;
    if (sEmail !== email.toLowerCase()) return false;
    if (sOtp !== otp) return false;
    if (Date.now() - Number(sIat) > OTP_TTL_MS) return false;
    const expected = crypto
      .createHmac('sha256', OTP_SECRET)
      .update(`${sEmail}:${sOtp}:${sIat}`)
      .digest('hex');
    return crypto.timingSafeEqual(Buffer.from(sSig), Buffer.from(expected));
  } catch {
    return false;
  }
}

function emailToUid(email: string): string {
  return crypto.createHash('sha256').update(email.toLowerCase()).digest('hex').slice(0, 28);
}

export async function POST(req: NextRequest) {
  const rl = await rateLimit(`verify-otp:${getIp(req)}`, 10, 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfterSecs);

  const { email, otp, session } = await req.json().catch(() => ({}));
  if (!email || !otp || !session) {
    return NextResponse.json({ ok: false, error: 'Missing fields.' }, { status: 400 });
  }

  if (!verifySession(email, otp, session)) {
    return NextResponse.json({ ok: false, error: 'Incorrect or expired code. Please try again.' }, { status: 401 });
  }

  const uid = emailToUid(email);
  const token = jwt.sign(
    { email: email.toLowerCase(), uid },
    SESSION_SECRET,
    { algorithm: 'HS256', expiresIn: '7d' },
  );

  return NextResponse.json({ ok: true, token, uid, email: email.toLowerCase() });
}
