import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getIp, rateLimit, tooManyRequests } from '@/lib/rateLimit';
import { createClient } from '@supabase/supabase-js';

const GST_RATE = 0.18;
const DELIVERY_FREE_ABOVE = 999;
const DELIVERY_CHARGE = 99;
const ALLOWED_QUAL_MULTS: Record<string, number> = { Standard: 1, Fine: 1.2, Ultra: 1.5 };

function getRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
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
    if (!priceNum || isNaN(priceNum)) throw new Error(`Product has no fixed price`);
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
  const rl = rateLimit(`razorpay-order:${getIp(req)}`, 10, 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfterSecs);

  const rzp = getRazorpay();
  if (!rzp) {
    return NextResponse.json({ ok: false, error: 'Payment gateway not configured.' }, { status: 503 });
  }

  try {
    const body = await req.json();
    const { cartItems, quoteParams, currency = 'INR', receipt, notes } = body;

    let amount: number;

    if (cartItems && Array.isArray(cartItems) && cartItems.length > 0) {
      amount = await calcCartAmount(cartItems);
    } else if (quoteParams && typeof quoteParams === 'object') {
      amount = await calcQuoteAmount(quoteParams);
    } else {
      return NextResponse.json({ ok: false, error: 'Missing cart or quote data.' }, { status: 400 });
    }

    const order = await rzp.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: receipt || ('SHOP-' + Date.now()),
      notes: notes || {},
    });

    return NextResponse.json({ ok: true, order, serverAmount: amount });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create payment order.';
    console.error('Razorpay create order error:', err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
