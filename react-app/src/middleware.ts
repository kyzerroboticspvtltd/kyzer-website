import { NextRequest, NextResponse } from 'next/server'

const EXEMPT = ['/admin', '/api/', '/_next/', '/favicon', '/logo', '/og-image', '/robots.txt', '/sitemap']
const CS_CACHE_COOKIE = '__kcs'  // '1' = enabled, '0' = disabled, 30s TTL
const ADMIN_BYPASS_COOKIE = '__kcs_admin'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Always allow: admin panel, API routes, Next.js internals, static files
  if (
    EXEMPT.some(p => pathname.startsWith(p)) ||
    pathname.includes('.')  // static assets (images, fonts, etc.)
  ) {
    return NextResponse.next()
  }

  // Admin gets a free pass (set by /api/admin-login)
  if (req.cookies.get(ADMIN_BYPASS_COOKIE)?.value === '1') {
    return NextResponse.next()
  }

  // Root is always allowed (it's the coming soon page itself)
  if (pathname === '/') return NextResponse.next()

  // Check cache cookie first to avoid hitting Supabase on every request
  const cached = req.cookies.get(CS_CACHE_COOKIE)?.value
  let csEnabled: boolean

  if (cached !== undefined) {
    csEnabled = cached === '1'
  } else {
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const key = process.env.SUPABASE_SERVICE_KEY!
      const res = await fetch(
        `${url}/rest/v1/site_data?id=eq.1&select=coming_soon`,
        { headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: 'no-store' },
      )
      const rows = await res.json()
      csEnabled = rows?.[0]?.coming_soon?.enabled === true
    } catch {
      csEnabled = false
    }
  }

  if (csEnabled) {
    const redirectRes = NextResponse.redirect(new URL('/', req.url))
    // Cache the enabled state so subsequent requests don't re-query Supabase
    redirectRes.cookies.set(CS_CACHE_COOKIE, '1', { maxAge: 30, httpOnly: true, sameSite: 'lax', path: '/' })
    return redirectRes
  }

  // Coming soon is off — let the request through, update cache
  const next = NextResponse.next()
  if (cached === undefined) {
    next.cookies.set(CS_CACHE_COOKIE, '0', { maxAge: 30, httpOnly: true, sameSite: 'lax', path: '/' })
  }
  return next
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
