import { NextRequest, NextResponse } from 'next/server'
import { isAuthedAdmin } from '@/lib/adminAuth'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  if (!isAuthedAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)
  const { data } = await sb.from('customers').select('id, email, name, phone, created_at').order('created_at', { ascending: false })
  return NextResponse.json({ customers: data ?? [] })
}
