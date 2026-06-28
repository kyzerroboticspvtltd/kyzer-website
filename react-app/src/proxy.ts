import { NextRequest, NextResponse } from 'next/server';

const BYPASS_PATHS = [
  '/coming-soon',
  '/admin',
  '/api/',
  '/_next/',
  '/favicon',
  '/icon',
  '/robots',
  '/sitemap',
  '/cat-photos/',
  '/shop-photos/',
  '/admin.html',
];

const PREVIEW_PARAM_SECRET = process.env.PREVIEW_PARAM_SECRET || 'kyzer2025admin';
const PREVIEW_COOKIE_TOKEN = process.env.PREVIEW_COOKIE_TOKEN || 'kzr_preview_2026_Aj7mN2pQx9Rk';
const PREVIEW_COOKIE = '__kzr_access';

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (BYPASS_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const previewParam = req.nextUrl.searchParams.get('preview');
  if (previewParam === PREVIEW_PARAM_SECRET) {
    const dest = req.nextUrl.clone();
    dest.searchParams.delete('preview');
    const res = NextResponse.redirect(dest);
    res.cookies.set(PREVIEW_COOKIE, PREVIEW_COOKIE_TOKEN, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return res;
  }

  if (req.cookies.get(PREVIEW_COOKIE)?.value === PREVIEW_COOKIE_TOKEN) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = '/coming-soon';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|woff|woff2|ttf|otf|mp4|pdf|txt|xml|json)$).*)',
  ],
};
