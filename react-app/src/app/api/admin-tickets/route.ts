import { NextRequest, NextResponse } from 'next/server'
import { isAuthedAdmin } from '@/lib/adminAuth'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(req: NextRequest) {
  if (!isAuthedAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data } = await supabaseAdmin
    .from('support_tickets')
    .select('id, status, created_at, name, email, subject, message')
    .order('created_at', { ascending: false })
    .limit(200)
  return NextResponse.json({ tickets: data ?? [] })
}
