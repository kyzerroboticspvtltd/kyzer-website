import { NextRequest, NextResponse } from 'next/server';
import { isAuthedAdmin } from '@/lib/adminAuth';
import { getIp, rateLimit, tooManyRequests } from '@/lib/rateLimit';

const ALLOWED_HOST = 'docs.google.com';

export async function GET(req: NextRequest) {
  const rl = await rateLimit(`sheet-proxy:${getIp(req)}`, 20, 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfterSecs);

  if (!isAuthedAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const raw = req.nextUrl.searchParams.get('url');
  if (!raw) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 });
  }

  // Extract spreadsheet ID and optional gid from any Google Sheets URL form
  const idMatch = raw.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (!idMatch) {
    return NextResponse.json({ error: 'Could not find spreadsheet ID in URL: ' + raw }, { status: 400 });
  }
  const spreadsheetId = idMatch[1];
  const gidMatch = raw.match(/[?&#]gid=(\d+)/);
  const gid = gidMatch ? gidMatch[1] : null;

  // Build a clean export URL
  const exportUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv${gid ? '&gid=' + gid : ''}`;
  const target = new URL(exportUrl);

  try {
    const upstream = await fetch(target.toString(), {
      headers: { 'User-Agent': 'KyzerAdmin/1.0' },
      redirect: 'follow',
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Sheet returned HTTP ${upstream.status}. Make sure it is shared as "Anyone with the link can view".` },
        { status: 502 }
      );
    }

    const csv = await upstream.text();
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Fetch failed: ${msg}` }, { status: 502 });
  }
}
