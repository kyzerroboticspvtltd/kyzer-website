import { NextRequest, NextResponse } from 'next/server'
import { isAuthedAdmin } from '@/lib/adminAuth'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  if (!isAuthedAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_KEY!
  const sb = createClient(url, key)

  const [shopRes, printRes, custRes] = await Promise.all([
    sb.from('orders').select('id, status, data, submitted_at').order('submitted_at', { ascending: false }).limit(50),
    sb.from('print_orders').select('id, status, submitted_at, name, email, material, price').order('submitted_at', { ascending: false }).limit(20),
    sb.from('customers').select('id', { count: 'exact', head: true }),
  ])

  const shopOrders = shopRes.data ?? []
  const printOrders = printRes.data ?? []

  const totalRevenue = shopOrders.reduce((sum, o) => sum + (o.data?.total || 0), 0)

  const recentOrders = [
    ...shopOrders.slice(0, 6).map(o => ({
      id: o.data?.orderId || o.id,
      name: o.data?.name || '—',
      total: o.data?.total || 0,
      status: o.status,
      type: 'shop' as const,
      date: new Date(o.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    })),
  ].slice(0, 8)

  return NextResponse.json({
    totalRevenue,
    shopOrders: shopOrders.length,
    printOrders: printOrders.length,
    customers: custRes.count ?? 0,
    recentOrders,
  })
}
