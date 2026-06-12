import { NextRequest, NextResponse } from 'next/server';

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://alrgkykezmlcagovkkdl.supabase.co';
// Never fall back to a committed key. Writing to site_data must use the
// service-role key supplied via env at deploy time.
const SB_KEY = process.env.SUPABASE_SERVICE_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { payload } = body;

    if (!payload) {
      return NextResponse.json({ ok: false, error: 'No payload' }, { status: 400 });
    }

    if (!SB_KEY) {
      return NextResponse.json({ ok: false, error: 'Server not configured: SUPABASE_SERVICE_KEY missing.' }, { status: 500 });
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
