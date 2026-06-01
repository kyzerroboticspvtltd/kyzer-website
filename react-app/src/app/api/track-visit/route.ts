import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) {
      const sb = createClient(url, key);
      await sb.from('analytics_visits').insert({ visited_at: new Date().toISOString() });
    }
  } catch {
    // fire-and-forget — never block the response
  }
  return NextResponse.json({ ok: true });
}
