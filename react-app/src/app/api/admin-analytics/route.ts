import { NextRequest, NextResponse } from 'next/server';
import { isAuthedAdmin } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(req: NextRequest) {
  if (!isAuthedAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [totalRes, pagesRes, devicesRes, referrersRes, dailyRes] = await Promise.all([
    // All-time total
    supabaseAdmin.from('analytics_visits').select('id', { count: 'exact', head: true }),

    // Top pages last 30 days
    supabaseAdmin
      .from('analytics_visits')
      .select('page')
      .gte('visited_at', new Date(Date.now() - 30 * 86400000).toISOString())
      .not('page', 'is', null)
      .limit(2000),

    // Device breakdown last 30 days
    supabaseAdmin
      .from('analytics_visits')
      .select('device')
      .gte('visited_at', new Date(Date.now() - 30 * 86400000).toISOString())
      .not('device', 'is', null)
      .limit(2000),

    // Top referrers last 30 days
    supabaseAdmin
      .from('analytics_visits')
      .select('referrer')
      .gte('visited_at', new Date(Date.now() - 30 * 86400000).toISOString())
      .not('referrer', 'is', null)
      .neq('referrer', '')
      .limit(2000),

    // Daily visits last 30 days
    supabaseAdmin
      .from('analytics_visits')
      .select('visited_at')
      .gte('visited_at', new Date(Date.now() - 30 * 86400000).toISOString())
      .order('visited_at', { ascending: true })
      .limit(5000),
  ]);

  const allVisits = dailyRes.data ?? [];
  const pageList = pagesRes.data ?? [];
  const deviceList = devicesRes.data ?? [];
  const refList = referrersRes.data ?? [];

  // Aggregate daily counts
  const dailyMap: Record<string, number> = {};
  for (const v of allVisits) {
    const day = v.visited_at.slice(0, 10);
    dailyMap[day] = (dailyMap[day] || 0) + 1;
  }
  const daily = Object.entries(dailyMap)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Aggregate pages
  const pageMap: Record<string, number> = {};
  for (const v of pageList) {
    const p = v.page || '/';
    pageMap[p] = (pageMap[p] || 0) + 1;
  }
  const topPages = Object.entries(pageMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([page, count]) => ({ page, count }));

  // Aggregate devices
  const deviceMap: Record<string, number> = {};
  for (const v of deviceList) {
    const d = v.device || 'unknown';
    deviceMap[d] = (deviceMap[d] || 0) + 1;
  }
  const devices = Object.entries(deviceMap).map(([device, count]) => ({ device, count }));

  // Aggregate referrers
  const refMap: Record<string, number> = {};
  for (const v of refList) {
    try {
      const host = new URL(v.referrer).hostname.replace('www.', '');
      refMap[host] = (refMap[host] || 0) + 1;
    } catch {
      refMap[v.referrer] = (refMap[v.referrer] || 0) + 1;
    }
  }
  const topReferrers = Object.entries(refMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([source, count]) => ({ source, count }));

  // Period counts
  const now = Date.now();
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const yesterdayStart = new Date(todayStart); yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const week7 = new Date(now - 7 * 86400000);
  const day30 = new Date(now - 30 * 86400000);

  const [todayRes, yestRes, week7Res, day30Res] = await Promise.all([
    supabaseAdmin.from('analytics_visits').select('id', { count: 'exact', head: true }).gte('visited_at', todayStart.toISOString()),
    supabaseAdmin.from('analytics_visits').select('id', { count: 'exact', head: true }).gte('visited_at', yesterdayStart.toISOString()).lt('visited_at', todayStart.toISOString()),
    supabaseAdmin.from('analytics_visits').select('id', { count: 'exact', head: true }).gte('visited_at', week7.toISOString()),
    supabaseAdmin.from('analytics_visits').select('id', { count: 'exact', head: true }).gte('visited_at', day30.toISOString()),
  ]);

  return NextResponse.json({
    total: totalRes.count ?? 0,
    today: todayRes.count ?? 0,
    yesterday: yestRes.count ?? 0,
    last7: week7Res.count ?? 0,
    last30: day30Res.count ?? 0,
    daily,
    topPages,
    devices,
    topReferrers,
  });
}
