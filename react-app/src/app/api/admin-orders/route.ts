import { NextRequest, NextResponse } from 'next/server'
import { isAuthedAdmin, isValidAdminToken } from '@/lib/adminAuth'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  const xToken = req.headers.get('x-admin-token')
  if (!isAuthedAdmin(req) && !isValidAdminToken(xToken)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)
  const { data, error } = await sb.from('orders').select('*').order('submitted_at', { ascending: false })
  if (error) console.error('admin-orders fetch error:', error)
  return NextResponse.json({ orders: data ?? [] })
}
