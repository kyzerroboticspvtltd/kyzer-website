import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
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

function b64url(data: string) {
  return Buffer.from(data).toString('base64url');
}

async function getGoogleAccessToken(clientEmail: string, privateKey: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const assertion = jwt.sign(
    {
      iss: clientEmail,
      scope: 'https://www.googleapis.com/auth/cloud-platform',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    },
    privateKey,
    { algorithm: 'RS256' },
  );
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });
  const data = await res.json() as { access_token: string };
  if (!data.access_token) throw new Error('Failed to get Google access token');
  return data.access_token;
}

async function getOrCreateUid(email: string, accessToken: string, projectId: string): Promise<string> {
  const lookupRes = await fetch(
    `https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:lookup`,
    {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: [email] }),
    },
  );
  const lookupData = await lookupRes.json() as { users?: { localId: string }[] };
  if (lookupData.users?.length) return lookupData.users[0].localId;

  const createRes = await fetch(
    `https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts`,
    {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, emailVerified: true }),
    },
  );
  const createData = await createRes.json() as { localId: string };
  if (!createData.localId) throw new Error('Failed to create Firebase user');
  return createData.localId;
}

function createCustomToken(uid: string, clientEmail: string, privateKey: string): string {
  return jwt.sign(
    {
      iss: clientEmail,
      sub: clientEmail,
      aud: 'https://identitytoolkit.googleapis.com/google.identity.toolkit.v1.IdentityToolkit',
      uid,
    },
    privateKey,
    { algorithm: 'RS256', expiresIn: 3600 },
  );
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
    const projectId = process.env.FIREBASE_PROJECT_ID!;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL!;
    const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

    const accessToken = await getGoogleAccessToken(clientEmail, privateKey);
    const uid = await getOrCreateUid(email.toLowerCase(), accessToken, projectId);
    console.log('uid:', uid, 'email:', email, 'clientEmail:', clientEmail, 'projectId:', projectId);
    const customToken = createCustomToken(uid, clientEmail, privateKey);
    console.log('token preview:', customToken.slice(0, 80));

    return NextResponse.json({ ok: true, token: customToken });
  } catch (err) {
    console.error('Firebase custom token error:', err);
    return NextResponse.json({ ok: false, error: 'Authentication failed. Please try again.' }, { status: 500 });
  }
}
