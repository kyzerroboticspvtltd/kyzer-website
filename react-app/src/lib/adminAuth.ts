import crypto from 'crypto';

/**
 * Shared admin-token verification.
 *
 * Tokens are issued by /api/admin-login in the form `<unixSeconds>.<hmac>`
 * where hmac = HMAC-SHA256(ADMIN_TOKEN_SECRET, unixSeconds). Tokens are valid
 * for 24h. ADMIN_TOKEN_SECRET is a separate env var from ADMIN_PASSWORD so a
 * captured token cannot be used to brute-force the login credential offline.
 *
 * If ADMIN_TOKEN_SECRET is unset the code falls back to ADMIN_PASSWORD for
 * backwards compatibility during migration, but Vercel env should have
 * ADMIN_TOKEN_SECRET set to a random 32-byte hex string.
 */
export function isValidAdminToken(token: string | null | undefined): boolean {
  if (!token || !token.includes('.')) return false;

  const dotIdx = token.indexOf('.');
  const ts = token.slice(0, dotIdx);
  const sig = token.slice(dotIdx + 1);

  // Prefer a dedicated signing secret; fall back to password only if unset.
  const secret = process.env.ADMIN_TOKEN_SECRET || process.env.ADMIN_PASSWORD || '';
  if (!secret) return false;

  const expected = crypto.createHmac('sha256', secret).update(ts).digest('hex');

  // Constant-time compare (lengths must match for timingSafeEqual)
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  if (!crypto.timingSafeEqual(a, b)) return false;

  const age = Math.floor(Date.now() / 1000) - Number(ts);
  return Number.isFinite(age) && age >= 0 && age < 86400;
}

/** Extract a Bearer token from a request's Authorization header. */
export function bearerToken(req: Request): string | null {
  const auth = req.headers.get('authorization') || '';
  return auth.startsWith('Bearer ') ? auth.slice(7) : null;
}

/** Returns true when the request carries a valid admin Bearer token. */
export function isAuthedAdmin(req: Request): boolean {
  return isValidAdminToken(bearerToken(req));
}
