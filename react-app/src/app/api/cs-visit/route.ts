import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isAuthedAdmin } from '@/lib/adminAuth'
import { getIp, rateLimit, tooManyRequests } from '@/lib/rateLimit'
import { BODY_LIMIT, rejectOversized, str } from '@/lib/sanitize'

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  )
}

// POST /api/cs-visit — called by the coming soon page on each unique session visit
export async function POST(req: NextRequest) {
  const rl = await rateLimit(`cs-visit:${getIp(req)}`, 10, 60 * 60_000)
  if (!rl.ok) return tooManyRequests(rl.retryAfterSecs)

  const oversize = rejectOversized(req, BODY_LIMIT.TINY)
  if (oversize) return oversize

  try {
    const body = await req.json()
    const session_id = str(body?.session_id, 64)
    const referrer   = str(body?.referrer,   500)

    await sb().from('cs_visits').insert({ session_id, referrer })
  } catch { /* swallow — non-critical */ }

  return NextResponse.json({ ok: true })
}

// GET /api/cs-visit — admin-only: returns visit counts
export async function GET(req: NextRequest) {
  if (!isAuthedAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: total } = await sb()
    .from('cs_visits')
    .select('id', { count: 'exact', head: true })

  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { count: today } = await sb()
    .from('cs_visits')
    .select('id', { count: 'exact', head: true })
    .gte('visited_at', since24h)

  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { count: week } = await sb()
    .from('cs_visits')
    .select('id', { count: 'exact', head: true })
    .gte('visited_at', since7d)

  return NextResponse.json({ total: (total as any)?.count ?? 0, today: today ?? 0, week: week ?? 0 })
}
