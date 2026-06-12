import crypto from 'crypto';

/**
 * Verifies an admin session token of the form `<ts>.<hmac>` issued by
 * /api/admin-login. The HMAC is SHA-256 over the timestamp keyed with
 * ADMIN_PASSWORD, and tokens expire after 24h.
 */
export function verifyAdminToken(token: string | null | undefined): boolean {
  if (!token || !token.includes('.')) return false;

  const secret = process.env.ADMIN_PASSWORD || '';
  if (!secret) return false;

  const dotIdx = token.indexOf('.');
  const ts = token.slice(0, dotIdx);
  const sig = token.slice(dotIdx + 1);
  if (!ts || !sig) return false;

  const expected = crypto.createHmac('sha256', secret).update(ts).digest('hex');

  // Constant-time comparison to avoid signature timing leaks.
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

  const age = Math.floor(Date.now() / 1000) - Number(ts);
  return age >= 0 && age < 86400;
}

/** Extracts a Bearer token from an Authorization header value. */
export function bearerToken(authHeader: string | null | undefined): string {
  const h = authHeader || '';
  return h.startsWith('Bearer ') ? h.slice(7) : '';
}
