import { NextRequest, NextResponse } from 'next/server';

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://alrgkykezmlcagovkkdl.supabase.co';
const SB_KEY = process.env.SUPABASE_SERVICE_KEY
  || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFscmdreWtlem1sY2Fnb3Zra2RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MjIxMjMsImV4cCI6MjA5NTE5ODEyM30.g_UjIRnjov6cUAkwjlifL2kDUzh1G7cpsThj6Ygq83U';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { payload } = body;

    if (!payload) {
      return NextResponse.json({ ok: false, error: 'No payload' }, { status: 400 });
    }

    const r = await fetch(`${SB_URL}/rest/v1/site_data`, {
      method: 'POST',
      headers: {
        'apikey': SB_KEY,
        'Authorization': `Bearer ${SB_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify({ ...payload, id: 1, updated_at: new Date().toISOString() }),
    });

    if (!r.ok) {
      const err = await r.text();
      return NextResponse.json({ ok: false, error: err }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
