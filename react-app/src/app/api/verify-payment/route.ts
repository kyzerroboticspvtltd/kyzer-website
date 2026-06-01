import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { sendMail, NOTIFY_EMAIL } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ ok: false, error: 'Missing payment fields.' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ ok: false, error: 'Payment gateway not configured.' }, { status: 503 });
    }

    const expected = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return NextResponse.json({ ok: false, error: 'Payment verification failed.' }, { status: 400 });
    }

    if (orderData && orderData.email) {
      const o = orderData;
      const itemRows = (o.items || []).map((i: { name: string; qty: number; price: string }) =>
        `<tr><td style="padding:8px;">${i.name}</td><td style="padding:8px;text-align:center;">×${i.qty}</td><td style="padding:8px;text-align:right;">₹${(Number(i.price || 0) * i.qty).toLocaleString('en-IN')}</td></tr>`
      ).join('');

      const adminHtml = `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;">
          <h2 style="color:#FF8C35;">New Shop Order — Kyzer Robotics</h2>
          <p><strong>Order ID:</strong> ${o.id || '—'} &nbsp;|&nbsp; <strong>Payment:</strong> ${razorpay_payment_id}</p>
          <table style="width:100%;border-collapse:collapse;margin-top:12px;">
            <tr style="background:#f4f4f4;"><td style="padding:8px;color:#888;width:130px;">Customer</td><td style="padding:8px;font-weight:500;">${o.name}</td></tr>
            <tr><td style="padding:8px;color:#888;">Email</td><td style="padding:8px;"><a href="mailto:${o.email}">${o.email}</a></td></tr>
            <tr style="background:#f4f4f4;"><td style="padding:8px;color:#888;">Phone</td><td style="padding:8px;">${o.phone || '—'}</td></tr>
            <tr><td style="padding:8px;color:#888;">Ship to</td><td style="padding:8px;">${o.shippingFull || '—'}</td></tr>
          </table>
          <h3 style="margin:20px 0 8px;">Items</h3>
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <tr style="background:#f4f4f4;font-weight:600;"><td style="padding:8px;">Product</td><td style="padding:8px;text-align:center;">Qty</td><td style="padding:8px;text-align:right;">Subtotal</td></tr>
            ${itemRows}
            <tr style="border-top:2px solid #eee;font-weight:700;font-size:15px;color:#FF8C35;">
              <td colspan="2" style="padding:10px;">Total</td>
              <td style="padding:10px;text-align:right;">₹${Number(o.total || 0).toLocaleString('en-IN')}</td>
            </tr>
          </table>
          ${o.notes ? `<p style="margin-top:14px;font-size:13px;color:#555;"><strong>Notes:</strong> ${o.notes}</p>` : ''}
        </div>`;

      const customerHtml = `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:20px;">
          <div style="background:#FF8C35;padding:24px 28px;border-radius:12px 12px 0 0;">
            <h2 style="color:#111;margin:0;">Order Confirmed ✓</h2>
          </div>
          <div style="background:#fff;border:1px solid #eee;border-top:none;padding:24px 28px;border-radius:0 0 12px 12px;">
            <p style="font-size:15px;">Hi <strong>${o.name}</strong>, thanks for your order!</p>
            <p style="color:#555;">Your payment was received and we will process your order shortly.</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:13px;">
              ${(o.items || []).map((i: { name: string; qty: number; price: string }) =>
                `<tr><td style="padding:6px 0;border-bottom:1px solid #f0f0f0;">${i.name} ×${i.qty}</td><td style="padding:6px 0;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:600;">₹${(Number(i.price || 0) * i.qty).toLocaleString('en-IN')}</td></tr>`
              ).join('')}
              <tr><td style="padding:10px 0;font-weight:700;font-size:15px;">Total</td><td style="padding:10px 0;font-weight:700;font-size:15px;text-align:right;color:#FF8C35;">₹${Number(o.total || 0).toLocaleString('en-IN')}</td></tr>
            </table>
            <p style="font-size:13px;color:#888;"><strong>Order ID:</strong> ${o.id || '—'} &nbsp;|&nbsp; <strong>Payment:</strong> ${razorpay_payment_id}</p>
            <p style="font-size:13px;color:#888;"><strong>Ship to:</strong> ${o.shippingFull || '—'}</p>
            <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
            <p style="font-size:12px;color:#aaa;">Questions? WhatsApp us at +91 90496 95264 or reply to this email.</p>
            <p style="font-size:12px;color:#aaa;">Kyzer Robotics Pvt. Ltd. · Pune, Maharashtra</p>
          </div>
        </div>`;

      try {
        await sendMail({
          to: NOTIFY_EMAIL(),
          subject: `[Kyzer] New Order ${o.id || ''} — ₹${Number(o.total || 0).toLocaleString('en-IN')} — ${o.name}`,
          html: adminHtml,
        });
        await sendMail({ to: o.email, subject: 'Order confirmed — Kyzer Robotics', html: customerHtml });
      } catch (mailErr) {
        console.error('Order confirmation mail error:', mailErr);
      }
    }

    return NextResponse.json({ ok: true, message: 'Payment verified successfully.' });
  } catch (err) {
    console.error('Verify payment error:', err);
    return NextResponse.json({ ok: false, error: 'Verification failed.' }, { status: 500 });
  }
}
