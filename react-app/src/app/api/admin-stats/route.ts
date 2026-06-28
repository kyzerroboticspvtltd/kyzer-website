import { NextRequest, NextResponse } from 'next/server'
import { isAuthedAdmin } from '@/lib/adminAuth'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(req: NextRequest) {
  if (!isAuthedAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const since7d  = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [shopRes, printRes, custRes, visitsTotal, visitsToday, visitsWeek] = await Promise.all([
    supabaseAdmin.from('orders').select('id, status, data, submitted_at').order('submitted_at', { ascending: false }).limit(50),
    supabaseAdmin.from('print_orders').select('id, status, submitted_at, name, email, material, price').order('submitted_at', { ascending: false }).limit(20),
    supabaseAdmin.from('customers').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('cs_visits').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('cs_visits').select('id', { count: 'exact', head: true }).gte('visited_at', since24h),
    supabaseAdmin.from('cs_visits').select('id', { count: 'exact', head: true }).gte('visited_at', since7d),
  ])

  const shopOrders = shopRes.data ?? []
  const totalRevenue = shopOrders.reduce((sum, o) => sum + (o.data?.total || 0), 0)

  const recentOrders = shopOrders.slice(0, 8).map(o => ({
    id: o.data?.orderId || o.id,
    name: o.data?.name || '—',
    total: o.data?.total || 0,
    status: o.status,
    type: 'shop' as const,
    date: new Date(o.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
  }))

  return NextResponse.json({
    totalRevenue,
    shopOrders: shopOrders.length,
    printOrders: (printRes.data ?? []).length,
    customers: custRes.count ?? 0,
    recentOrders,
    csVisits: {
      total: visitsTotal.count ?? 0,
      today: visitsToday.count ?? 0,
      week:  visitsWeek.count  ?? 0,
    },
  })
}
