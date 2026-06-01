import { NextRequest, NextResponse } from 'next/server';
import { sendMail, NOTIFY_EMAIL } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  try {
    const o = await req.json();
    if (!o || !o.email || !o.name) {
      return NextResponse.json({ ok: false, error: 'Missing required fields.' }, { status: 400 });
    }

    const ship = o.shipping || {};
    const shippingFull = [ship.addr1, ship.addr2, ship.city, ship.state, ship.pincode, ship.landmark]
      .filter(Boolean).join(', ');
    const deliveryLabel = o.delivery === 'sameday' ? 'Same day' : '7 working days';
    const rushLabel = o.rush ? ' · ⚡ RUSH' : '';

    const adminHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;">
        <h2 style="color:#FF8C35;">New 3D Print Order — Kyzer Robotics</h2>
        <p style="color:#888;font-size:13px;">Order ID: <strong style="color:#111;">${o.id || '—'}</strong></p>
        <h3 style="margin:20px 0 8px;border-bottom:1px solid #eee;padding-bottom:6px;">Customer</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:7px 8px;color:#888;width:130px;">Name</td><td style="padding:7px 8px;font-weight:500;">${o.name}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:7px 8px;color:#888;">Email</td><td style="padding:7px 8px;"><a href="mailto:${o.email}">${o.email}</a></td></tr>
          <tr><td style="padding:7px 8px;color:#888;">Phone</td><td style="padding:7px 8px;">${o.phone || '—'}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:7px 8px;color:#888;">Company</td><td style="padding:7px 8px;">${o.company || '—'}</td></tr>
          <tr><td style="padding:7px 8px;color:#888;">Ship to</td><td style="padding:7px 8px;">${shippingFull || '—'}</td></tr>
        </table>
        <h3 style="margin:20px 0 8px;border-bottom:1px solid #eee;padding-bottom:6px;">Print Configuration</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:7px 8px;color:#888;width:130px;">Material</td><td style="padding:7px 8px;">${o.material || '—'}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:7px 8px;color:#888;">Quality</td><td style="padding:7px 8px;">${o.quality || '—'}</td></tr>
          <tr><td style="padding:7px 8px;color:#888;">Infill</td><td style="padding:7px 8px;">${o.infill || '—'}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:7px 8px;color:#888;">Colour</td><td style="padding:7px 8px;">${o.colour || '—'}</td></tr>
          <tr><td style="padding:7px 8px;color:#888;">Support</td><td style="padding:7px 8px;">${o.support || '—'}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:7px 8px;color:#888;">Quantity</td><td style="padding:7px 8px;">${o.quantity || '—'}</td></tr>
          <tr><td style="padding:7px 8px;color:#888;">Dimensions</td><td style="padding:7px 8px;">${o.dimensions || '—'}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:7px 8px;color:#888;">Delivery</td><td style="padding:7px 8px;">${deliveryLabel}${rushLabel}</td></tr>
          <tr><td style="padding:7px 8px;color:#888;">File</td><td style="padding:7px 8px;">${o.fileName || 'No file / manual dimensions'}</td></tr>
          <tr style="background:#fff3e8;"><td style="padding:9px 8px;color:#888;font-weight:700;">Est. Total</td><td style="padding:9px 8px;font-weight:700;color:#FF8C35;font-size:16px;">₹${o.estimatedTotal || '—'}</td></tr>
        </table>
        ${o.notes ? `<div style="margin-top:16px;padding:14px;background:#f4f4f4;border-radius:8px;"><p style="margin:0;color:#555;"><strong>Notes:</strong><br>${o.notes.replace(/\n/g, '<br>')}</p></div>` : ''}
        <p style="margin-top:20px;font-size:12px;color:#aaa;">Submitted from kyzerrobotics.com 3D print quote page</p>
      </div>`;

    const customerHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:20px;">
        <div style="background:#FF8C35;padding:24px 28px;border-radius:12px 12px 0 0;">
          <h2 style="color:#111;margin:0;">Quote Request Received ✓</h2>
        </div>
        <div style="background:#fff;border:1px solid #eee;border-top:none;padding:24px 28px;border-radius:0 0 12px 12px;">
          <p style="font-size:15px;">Hi <strong>${o.name}</strong>, thanks for your quote request!</p>
          <p style="color:#555;line-height:1.7;">Our team will review your file and confirm the final price within <strong>a few hours</strong>. We'll send a payment link once confirmed.</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:13px;background:#f9f9f9;border-radius:8px;">
            <tr><td style="padding:8px 12px;color:#888;">Material</td><td style="padding:8px 12px;font-weight:500;">${o.material || '—'}</td></tr>
            <tr><td style="padding:8px 12px;color:#888;">Quantity</td><td style="padding:8px 12px;font-weight:500;">${o.quantity || '—'}</td></tr>
            <tr><td style="padding:8px 12px;color:#888;">Delivery</td><td style="padding:8px 12px;font-weight:500;">${deliveryLabel}${rushLabel}</td></tr>
            <tr><td style="padding:8px 12px;color:#888;">File</td><td style="padding:8px 12px;font-weight:500;">${o.fileName || 'Manual dimensions'}</td></tr>
            <tr style="background:#fff3e8;"><td style="padding:10px 12px;color:#888;font-weight:700;">Est. Total</td><td style="padding:10px 12px;font-weight:700;color:#FF8C35;font-size:15px;">₹${o.estimatedTotal || '—'}</td></tr>
          </table>
          <p style="font-size:13px;color:#888;"><strong>Order ref:</strong> ${o.id || '—'}</p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
          <p style="font-size:12px;color:#aaa;">Questions? WhatsApp us at <a href="https://wa.me/919049695264" style="color:#FF8C35;">+91 90496 95264</a> or reply to this email.</p>
          <p style="font-size:12px;color:#aaa;">Kyzer Robotics Pvt. Ltd. · Pune, Maharashtra</p>
        </div>
      </div>`;

    await sendMail({
      to: NOTIFY_EMAIL(),
      subject: `[Kyzer 3D] ${o.name} — ${o.material || ''} · ₹${o.estimatedTotal || '?'}`,
      html: adminHtml,
    });
    await sendMail({ to: o.email, subject: 'Your 3D print quote request — Kyzer Robotics', html: customerHtml });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Print quote error:', err);
    return NextResponse.json({ ok: false, error: 'Failed to send email.' }, { status: 500 });
  }
}
