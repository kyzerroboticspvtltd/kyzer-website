import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getIp, rateLimit, tooManyRequests } from '@/lib/rateLimit';
import { BODY_LIMIT, rejectOversized } from '@/lib/sanitize';

// Public, unauthenticated lookup — a customer proves ownership of an order by
// knowing both its exact ID and the email it was placed under. Rate-limited
// hard since this is effectively a credential-guessing surface.
export async function POST(req: NextRequest) {
  const rl = await rateLimit(`track-order:${getIp(req)}`, 8, 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfterSecs);

  const oversize = rejectOversized(req, BODY_LIMIT.TINY);
  if (oversize) return oversize;

  try {
    const body = await req.json();
    const orderId = typeof body?.orderId === 'string' ? body.orderId.trim().slice(0, 100) : '';
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase().slice(0, 200) : '';

    if (!orderId || !email) {
      return NextResponse.json({ ok: false, error: 'Order ID and email are required.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('id, status, data, submitted_at')
      .eq('id', orderId)
      .single();

    if (error || !data) {
      return NextResponse.json({ ok: false, error: 'Order not found. Check the order ID and try again.' }, { status: 404 });
    }

    const orderEmail = typeof data.data?.email === 'string' ? data.data.email.trim().toLowerCase() : '';
    if (orderEmail !== email) {
      return NextResponse.json({ ok: false, error: 'Order not found. Check the order ID and try again.' }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      order: {
        id: data.id,
        status: data.status,
        submittedAt: data.submitted_at,
        items: data.data?.items || [],
        total: data.data?.total,
        shippingFull: data.data?.shippingFull,
        trackingNumber: data.data?.trackingNumber || '',
        courier: data.data?.courier || '',
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
