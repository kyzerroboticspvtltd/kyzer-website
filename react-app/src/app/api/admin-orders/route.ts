import { NextRequest, NextResponse } from 'next/server'
import { isAuthedAdmin, isValidAdminToken } from '@/lib/adminAuth'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(req: NextRequest) {
  const xToken = req.headers.get('x-admin-token')
  if (!isAuthedAdmin(req) && !isValidAdminToken(xToken)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('id, status, data, submitted_at')
    .order('submitted_at', { ascending: false })
    .limit(500)
  if (error) console.error('admin-orders fetch error:', error)
  return NextResponse.json({ orders: data ?? [] })
}
