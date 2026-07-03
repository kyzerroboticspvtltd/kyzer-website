import { NextRequest, NextResponse } from 'next/server';
import { getIp, rateLimit, tooManyRequests } from '@/lib/rateLimit';
import { BODY_LIMIT, rejectOversized } from '@/lib/sanitize';
import { createClient } from '@supabase/supabase-js';

const GST_RATE = 0.18;
const DELIVERY_FREE_ABOVE = 999;
const DELIVERY_CHARGE = 99;
const ALLOWED_QUAL_MULTS: Record<string, number> = { Standard: 1, Fine: 1.2, Ultra: 1.5 };

const CF_BASE = process.env.CASHFREE_ENV === 'sandbox'
  ? 'https://sandbox.cashfree.com/pg'
  : 'https://api.cashfree.com/pg';
const CF_VERSION = '2023-08-01';

function cfHeaders() {
  return {
    'x-client-id':     process.env.CASHFREE_APP_ID || '',
    'x-client-secret': process.env.CASHFREE_SECRET_KEY || '',
    'x-api-version':   CF_VERSION,
    'Content-Type':    'application/json',
  };
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

async function calcCartAmount(cartItems: { id: string; qty: number }[]): Promise<number> {
  const sb = getSupabase();
  if (!sb) throw new Error('Database not configured');
  const { data } = await sb.from('site_data').select('products').single();
  const products: Record<string, unknown>[] = data?.products || [];
  let subtotal = 0;
  for (const item of cartItems) {
    const product = products.find((p: Record<string, unknown>) => String(p.id) === String(item.id));
    if (!product) throw new Error(`Product ${item.id} not found`);
    const priceNum = parseFloat(String(product.price).replace(/[^0-9.]/g, ''));
    if (!priceNum || isNaN(priceNum)) throw new Error('Product has no fixed price');
    subtotal += priceNum * Math.max(1, item.qty || 1);
  }
  const gst = Math.round(subtotal * GST_RATE);
  const delivery = subtotal >= DELIVERY_FREE_ABOVE ? 0 : DELIVERY_CHARGE;
  return subtotal + gst + delivery;
}

async function calcQuoteAmount(params: Record<string, unknown>): Promise<number> {
  const sb = getSupabase();
  if (!sb) throw new Error('Database not configured');
  const { data } = await sb.from('site_data').select('quote').single();
  const q = data?.quote || {};
  const materials: { name: string; rate: number }[] = q.materials || [];
  const machineRate: number = q.machineRate || 80;
  const { L, W, H, matName, qualName, infill, supportLevel, colorExtra = 0, qty = 1, rush = false, delivery } = params as Record<string, number | string | boolean>;
  const mat = materials.find(m => m.name === matName);
  if (!mat) throw new Error('Invalid material');
  const qualMult = ALLOWED_QUAL_MULTS[qualName as string] ?? 1;
  const infillFactor = Math.min(1, Math.max(0.1, (Number(infill) || 20) / 100));
  const volumeMm3 = Number(L) * Number(W) * Number(H) * 0.6;
  const estimatedGrams = Math.max(5, (volumeMm3 / 1000) * 1.2 * infillFactor);
  const matCost = estimatedGrams * mat.rate;
  const printTimeCost = Math.max(0.5, estimatedGrams / 15) * machineRate;
  const qualityCost = (matCost + printTimeCost) * (qualMult - 1);
  const supportMult = supportLevel === 1 ? 0.10 : supportLevel === 2 ? 0.20 : 0;
  let subtotal = matCost + printTimeCost + qualityCost + Number(colorExtra);
  subtotal += subtotal * Number(supportMult);
  subtotal += 25;
  const qtyNum = Math.max(1, Math.min(100, Number(qty)));
  const qtyMult = qtyNum >= 10 ? 0.75 : qtyNum >= 5 ? 0.85 : 1;
  const afterRush = subtotal * qtyNum * qtyMult * (rush ? 1.5 : 1);
  const deliveryCost = delivery === 'sameday' ? (q.sameDayFee ?? 200) : (q.sevenDayFee ?? 150);
  return Math.round(Math.max(50, afterRush + deliveryCost));
}

export async function POST(req: NextRequest) {
  const rl = await rateLimit(`cashfree-order:${getIp(req)}`, 10, 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfterSecs);

  const oversize = rejectOversized(req, BODY_LIMIT.MEDIUM);
  if (oversize) return oversize;

  if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
    return NextResponse.json({ ok: false, error: 'Payment gateway not configured.' }, { status: 503 });
  }

  try {
    const body = await req.json();
    const { cartItems, quoteParams, name, email, phone } = body;

    let amount: number;
    if (cartItems && Array.isArray(cartItems) && cartItems.length > 0) {
      amount = await calcCartAmount(cartItems);
    } else if (quoteParams && typeof quoteParams === 'object') {
      amount = await calcQuoteAmount(quoteParams);
    } else {
      return NextResponse.json({ ok: false, error: 'Missing cart or quote data.' }, { status: 400 });
    }

    const orderId = `KYZER-${Date.now()}`;
    // {order_id} is a Cashfree template variable — replaced with the actual order ID on redirect
    const returnUrl = 'https://kyzerrobotics.com/checkout/success?order_id={order_id}';

    const cfRes = await fetch(`${CF_BASE}/orders`, {
      method: 'POST',
      headers: cfHeaders(),
      body: JSON.stringify({
        order_id: orderId,
        order_amount: amount,
        order_currency: 'INR',
        customer_details: {
          customer_id:    `cust_${Date.now()}`,
          customer_name:  (name || 'Customer').slice(0, 100),
          customer_email: email || 'customer@kyzerrobotics.com',
          customer_phone: (phone || '9999999999').replace(/\D/g, '').slice(-10) || '9999999999',
        },
        order_meta: { return_url: returnUrl },
      }),
    });

    if (!cfRes.ok) {
      const cfErr = await cfRes.json().catch(() => ({}));
      const appId = process.env.CASHFREE_APP_ID || '';
      console.error('Cashfree auth debug:', {
        status: cfRes.status,
        error: cfErr,
        env: process.env.CASHFREE_ENV,
        appIdLen: appId.length,
        appIdStart: appId.slice(0, 6),
        base: CF_BASE,
      });
      throw new Error(cfErr.message || `Cashfree API error ${cfRes.status}`);
    }

    const cfData = await cfRes.json();

    // Store server-calculated amount so verify endpoint can use it as source of truth
    const sb = getSupabase();
    if (sb) {
      await sb.from('pending_payments').upsert({
        razorpay_order_id: orderId,
        server_amount_paise: Math.round(amount * 100),
      });
    }

    return NextResponse.json({
      ok:                 true,
      payment_session_id: cfData.payment_session_id,
      order_id:           orderId,
      amount,
      mode:               process.env.CASHFREE_ENV === 'sandbox' ? 'sandbox' : 'production',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create payment order.';
    console.error('Cashfree create order error:', err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
