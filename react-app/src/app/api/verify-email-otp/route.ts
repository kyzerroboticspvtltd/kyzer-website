import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import * as admin from 'firebase-admin';
import { getIp, rateLimit, tooManyRequests } from '@/lib/rateLimit';

const OTP_SECRET = process.env.OTP_SECRET || 'kyzer-otp-secret-change-me';
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

function getAdminApp() {
  if (admin.apps.length) return admin.app();
  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
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

  try {
    const app = getAdminApp();
    const auth = admin.auth(app);

    // Get or create the Firebase user for this email
    let uid: string;
    try {
      const existing = await auth.getUserByEmail(email);
      uid = existing.uid;
    } catch {
      const created = await auth.createUser({ email, emailVerified: true });
      uid = created.uid;
    }

    const customToken = await auth.createCustomToken(uid);
    return NextResponse.json({ ok: true, token: customToken });
  } catch (err) {
    console.error('Firebase custom token error:', err);
    return NextResponse.json({ ok: false, error: 'Authentication failed. Please try again.' }, { status: 500 });
  }
}
