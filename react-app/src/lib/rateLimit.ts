import { NextRequest, NextResponse } from 'next/server';

interface Bucket {
  count: number;
  resetAt: number;
}

const store = new Map<string, Bucket>();

// Prune expired buckets once per minute to prevent unbounded growth
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of store) {
    if (now > v.resetAt) store.delete(k);
  }
}, 60_000).unref?.();

export function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

/**
 * Returns ok:true when the request is within the allowed rate.
 * key    – unique string per (route, IP) combination
 * limit  – max requests allowed in the window
 * windowMs – rolling window in milliseconds
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: boolean; retryAfterSecs: number } {
  const now = Date.now();
  let bucket = store.get(key);

  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 0, resetAt: now + windowMs };
    store.set(key, bucket);
  }

  bucket.count += 1;

  if (bucket.count > limit) {
    return { ok: false, retryAfterSecs: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  return { ok: true, retryAfterSecs: 0 };
}

export function tooManyRequests(retryAfterSecs: number): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'Too many requests. Please try again later.' },
    { status: 429, headers: { 'Retry-After': String(retryAfterSecs) } },
  );
}
