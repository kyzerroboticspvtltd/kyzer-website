import { NextRequest, NextResponse } from 'next/server';

// ── HTML escaping ─────────────────────────────────────────────────────────────

const ESC_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** Escape a value for safe interpolation inside an HTML attribute or element. */
export function esc(v: unknown): string {
  return String(v ?? '').replace(/[&<>"']/g, c => ESC_MAP[c]);
}

// ── String coercion with max-length enforcement ───────────────────────────────

/** Coerce to string and truncate to maxLen characters. Returns '' for nullish. */
export function str(v: unknown, maxLen: number): string {
  return String(v ?? '').slice(0, maxLen);
}

/** Return a 400 response if `value` exceeds `maxLen` characters. */
export function rejectIfTooLong(
  value: unknown,
  field: string,
  maxLen: number,
): NextResponse | null {
  if (typeof value === 'string' && value.length > maxLen) {
    return NextResponse.json(
      { ok: false, error: `Field "${field}" exceeds maximum length of ${maxLen}.` },
      { status: 400 },
    );
  }
  return null;
}

// ── Email validation ──────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;

export function isValidEmail(email: unknown): boolean {
  return typeof email === 'string' && EMAIL_RE.test(email);
}

// ── Request body size guard ───────────────────────────────────────────────────

/** Maximum body sizes per endpoint type (bytes). */
export const BODY_LIMIT = {
  TINY: 2_048,       // login, subscribe
  SMALL: 16_384,     // contact, print-quote
  MEDIUM: 131_072,   // order payloads
  LARGE: 1_048_576,  // sheet-sync (many products)
} as const;

/**
 * Returns a 413 response when Content-Length exceeds the limit.
 * Call this before awaiting req.json() / req.formData().
 * Note: Content-Length may be absent (streaming); for defence-in-depth this
 * check is combined with field-level length limits after parsing.
 */
export function rejectOversized(
  req: NextRequest,
  limitBytes: number,
): NextResponse | null {
  const cl = req.headers.get('content-length');
  if (cl !== null && parseInt(cl, 10) > limitBytes) {
    return NextResponse.json(
      { ok: false, error: 'Request body too large.' },
      { status: 413 },
    );
  }
  return null;
}

/** Strip control characters (except \t, \n, \r) from a string. */
export function stripControl(s: string): string {
  return s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}
