import { NextRequest, NextResponse } from 'next/server'
import { isAuthedAdmin } from '@/lib/adminAuth'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(req: NextRequest) {
  if (!isAuthedAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data } = await supabaseAdmin
    .from('quote_inquiries')
    .select('id, status, submitted_at, name, email, phone, description, timeline, budget')
    .order('submitted_at', { ascending: false })
    .limit(200)
  return NextResponse.json({ quotes: data ?? [] })
}
