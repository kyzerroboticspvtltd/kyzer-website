import { NextRequest, NextResponse } from 'next/server';
import { sendMail, NOTIFY_EMAIL } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  try {
    const { orderData: o } = await req.json();
    if (!o || !o.email) {
      return NextResponse.json({ ok: false, error: 'Missing order data.' }, { status: 400 });
    }

    const itemRows = (o.items || []).map((i: { name: string; qty: number; price: string }) =>
      `<tr><td style="padding:8px;">${i.name}</td><td style="padding:8px;text-align:center;">×${i.qty}</td><td style="padding:8px;text-align:right;">₹${(Number(String(i.price || '').replace(/[^0-9.]/g, '')) * i.qty).toLocaleString('en-IN')}</td></tr>`
    ).join('');

    await sendMail({
      to: NOTIFY_EMAIL(),
      subject: `[Kyzer] New Order ${o.id || ''} — ${o.name}`,
      html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;">
        <h2 style="color:#FF8C35;">New Shop Order — Kyzer Robotics</h2>
        <p><strong>Order ID:</strong> ${o.id || '—'}</p>
        <table style="width:100%;border-collapse:collapse;margin-top:12px;">
          <tr style="background:#f4f4f4;"><td style="padding:8px;color:#888;width:130px;">Customer</td><td style="padding:8px;font-weight:500;">${o.name}</td></tr>
          <tr><td style="padding:8px;color:#888;">Email</td><td style="padding:8px;"><a href="mailto:${o.email}">${o.email}</a></td></tr>
          <tr style="background:#f4f4f4;"><td style="padding:8px;color:#888;">Phone</td><td style="padding:8px;">${o.phone || '—'}</td></tr>
          <tr><td style="padding:8px;color:#888;">Ship to</td><td style="padding:8px;">${o.shippingFull || '—'}</td></tr>
        </table>
        <table style="width:100%;border-collapse:collapse;font-size:13px;margin-top:16px;">
          <tr style="background:#f4f4f4;font-weight:600;"><td style="padding:8px;">Product</td><td style="padding:8px;text-align:center;">Qty</td><td style="padding:8px;text-align:right;">Subtotal</td></tr>
          ${itemRows}
        </table>
        <p style="font-size:12px;color:#aaa;margin-top:20px;">Submitted from kyzerrobotics.com checkout</p>
      </div>`,
    });

    await sendMail({
      to: o.email,
      subject: 'Order received — Kyzer Robotics',
      html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:20px;">
        <div style="background:#FF8C35;padding:24px 28px;border-radius:12px 12px 0 0;">
          <h2 style="color:#111;margin:0;">Order Received ✓</h2>
        </div>
        <div style="background:#fff;border:1px solid #eee;border-top:none;padding:24px 28px;border-radius:0 0 12px 12px;">
          <p style="font-size:15px;">Hi <strong>${o.name}</strong>, we received your order!</p>
          <p style="color:#555;">Our team will confirm pricing and availability shortly.</p>
          <p style="font-size:13px;color:#888;"><strong>Order ID:</strong> ${o.id || '—'}</p>
          <p style="font-size:13px;color:#888;"><strong>Ship to:</strong> ${o.shippingFull || '—'}</p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
          <p style="font-size:12px;color:#aaa;">Questions? WhatsApp us at +91 90496 95264 or reply to this email.</p>
          <p style="font-size:12px;color:#aaa;">Kyzer Robotics Pvt. Ltd. · Pune, Maharashtra</p>
        </div>
      </div>`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Order notify error:', err);
    return NextResponse.json({ ok: false, error: 'Failed to send notification.' }, { status: 500 });
  }
}
