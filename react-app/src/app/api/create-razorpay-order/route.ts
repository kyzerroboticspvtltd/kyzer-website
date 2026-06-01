import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

function getRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export async function POST(req: NextRequest) {
  const rzp = getRazorpay();
  if (!rzp) {
    return NextResponse.json({ ok: false, error: 'Payment gateway not configured.' }, { status: 503 });
  }

  try {
    const { amount, currency = 'INR', receipt, notes } = await req.json();

    if (!amount || isNaN(amount) || amount < 1) {
      return NextResponse.json({ ok: false, error: 'Invalid amount.' }, { status: 400 });
    }

    const order = await rzp.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency,
      receipt: receipt || ('SHOP-' + Date.now()),
      notes: notes || {},
    });

    return NextResponse.json({ ok: true, order });
  } catch (err) {
    console.error('Razorpay create order error:', err);
    return NextResponse.json({ ok: false, error: 'Failed to create payment order.' }, { status: 500 });
  }
}
