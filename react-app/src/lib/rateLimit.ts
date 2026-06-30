import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// ── Upstash Redis (production) ────────────────────────────────────────────────
// Falls back to in-memory when env vars are absent (local dev).
let upstash: Ratelimit | null = null;

function getUpstash(): Ratelimit | null {
  if (upstash) return upstash;
  // Strip BOM character that may be prepended by some editors/env var tools
  const url = process.env.UPSTASH_REDIS_REST_URL?.replace(/^﻿/, '').trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;
  try {
    upstash = new Ratelimit({
      redis: new Redis({ url, token }),
      limiter: Ratelimit.slidingWindow(1, '1 s'),
      prefix: 'kyzer:rl',
    });
  } catch (err) {
    console.error('Upstash init error, rate limiting will use in-memory fallback:', err);
    return null;
  }
  return upstash;
}

// ── In-memory fallback (dev / cold-start without Redis) ───────────────────────
interface Bucket { count: number; resetAt: number; }
const store = new Map<string, Bucket>();
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of store) if (now > v.resetAt) store.delete(k);
}, 60_000).unref?.();

function inMemoryLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  let b = store.get(key);
  if (!b || now > b.resetAt) { b = { count: 0, resetAt: now + windowMs }; store.set(key, b); }
  b.count += 1;
  return { ok: b.count <= limit, retryAfterSecs: b.count > limit ? Math.ceil((b.resetAt - now) / 1000) : 0 };
}

// ── Public API ────────────────────────────────────────────────────────────────
export function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<{ ok: boolean; retryAfterSecs: number }> {
  const rl = getUpstash();
  if (rl) {
    try {
      const perCallRl = new Ratelimit({
        redis: (rl as unknown as { redis: Redis }).redis,
        limiter: Ratelimit.slidingWindow(limit, `${windowMs} ms`),
        prefix: 'kyzer:rl',
      });
      const { success, reset } = await perCallRl.limit(key);
      const retryAfterSecs = success ? 0 : Math.ceil((reset - Date.now()) / 1000);
      return { ok: success, retryAfterSecs };
    } catch (err) {
      console.error('Upstash rateLimit error, falling back to in-memory:', err);
    }
  }
  return inMemoryLimit(key, limit, windowMs);
}

export function tooManyRequests(retryAfterSecs: number): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'Too many requests. Please try again later.' },
    { status: 429, headers: { 'Retry-After': String(retryAfterSecs) } },
  );
}
