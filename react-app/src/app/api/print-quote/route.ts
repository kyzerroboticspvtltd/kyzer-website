import { NextRequest, NextResponse } from 'next/server';
import { sendMail, NOTIFY_EMAIL, NOTIFY_PHONE } from '@/lib/mailer';
import { getIp, rateLimit, tooManyRequests } from '@/lib/rateLimit';
import { BODY_LIMIT, rejectOversized, esc, str, isValidEmail, stripControl } from '@/lib/sanitize';
import { saveOrder } from '@/lib/orders';

export async function POST(req: NextRequest) {
  const rl = await rateLimit(`print-quote:${getIp(req)}`, 10, 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfterSecs);

  const oversize = rejectOversized(req, BODY_LIMIT.SMALL);
  if (oversize) return oversize;

  try {
    const raw = await req.json();
    if (!raw || !raw.email || !raw.name) {
      return NextResponse.json({ ok: false, error: 'Missing required fields.' }, { status: 400 });
    }
    if (!isValidEmail(raw.email)) {
      return NextResponse.json({ ok: false, error: 'Invalid email address.' }, { status: 400 });
    }
    // Sanitise all user-supplied fields
    const o = {
      ...raw,
      name:           str(raw.name, 100),
      email:          str(raw.email, 254),
      phone:          str(raw.phone, 20),
      company:        str(raw.company, 100),
      material:       str(raw.material, 50),
      quality:        str(raw.quality, 50),
      infill:         str(raw.infill, 10),
      colour:         str(raw.colour, 50),
      support:        str(raw.support, 50),
      quantity:       str(raw.quantity, 10),
      dimensions:     str(raw.dimensions, 100),
      fileName:       str(raw.fileName, 255),
      notes:          stripControl(str(raw.notes, 2000)),
      id:             str(raw.id, 50),
      estimatedTotal: str(raw.estimatedTotal, 20),
    };
    const waPhone = NOTIFY_PHONE();
    const waLink = waPhone ? `https://wa.me/${waPhone.replace(/\D/g, '')}` : '#';
    const waDisplay = waPhone || '+91 90496 95264';

    // ðŸ’¾ Persist the print order server-side (idempotent upsert on id).
    await saveOrder({ ...o, status: o.status || 'new' }, 'print');

    const ship = o.shipping || {};
    const shippingFull = [ship.addr1, ship.addr2, ship.city, ship.state, ship.pincode, ship.landmark]
      .filter(Boolean).join(', ');
    const deliveryLabel = o.delivery === 'sameday' ? 'Same day' : '7 working days';
    const rushLabel = o.rush ? ' Â· âš¡ RUSH' : '';

    const adminHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;">
        <h2 style="color:#FF8C35;">New 3D Print Order â€” Kyzer Robotics</h2>
        <p style="color:#888;font-size:13px;">Order ID: <strong style="color:#111;">${esc(o.id) || 'â€”'}</strong></p>
        <h3 style="margin:20px 0 8px;border-bottom:1px solid #eee;padding-bottom:6px;">Customer</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:7px 8px;color:#888;width:130px;">Name</td><td style="padding:7px 8px;font-weight:500;">${esc(o.name)}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:7px 8px;color:#888;">Email</td><td style="padding:7px 8px;"><a href="mailto:${esc(o.email)}">${esc(o.email)}</a></td></tr>
          <tr><td style="padding:7px 8px;color:#888;">Phone</td><td style="padding:7px 8px;">${esc(o.phone) || 'â€”'}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:7px 8px;color:#888;">Company</td><td style="padding:7px 8px;">${esc(o.company) || 'â€”'}</td></tr>
          <tr><td style="padding:7px 8px;color:#888;">Ship to</td><td style="padding:7px 8px;">${esc(shippingFull) || 'â€”'}</td></tr>
        </table>
        <h3 style="margin:20px 0 8px;border-bottom:1px solid #eee;padding-bottom:6px;">Print Configuration</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:7px 8px;color:#888;width:130px;">Material</td><td style="padding:7px 8px;">${esc(o.material) || 'â€”'}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:7px 8px;color:#888;">Quality</td><td style="padding:7px 8px;">${esc(o.quality) || 'â€”'}</td></tr>
          <tr><td style="padding:7px 8px;color:#888;">Infill</td><td style="padding:7px 8px;">${esc(o.infill) || 'â€”'}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:7px 8px;color:#888;">Colour</td><td style="padding:7px 8px;">${esc(o.colour) || 'â€”'}</td></tr>
          <tr><td style="padding:7px 8px;color:#888;">Support</td><td style="padding:7px 8px;">${esc(o.support) || 'â€”'}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:7px 8px;color:#888;">Quantity</td><td style="padding:7px 8px;">${esc(o.quantity) || 'â€”'}</td></tr>
          <tr><td style="padding:7px 8px;color:#888;">Dimensions</td><td style="padding:7px 8px;">${esc(o.dimensions) || 'â€”'}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:7px 8px;color:#888;">Delivery</td><td style="padding:7px 8px;">${esc(deliveryLabel)}${esc(rushLabel)}</td></tr>
          <tr><td style="padding:7px 8px;color:#888;">File</td><td style="padding:7px 8px;">${esc(o.fileName) || 'No file / manual dimensions'}</td></tr>
          <tr style="background:#fff3e8;"><td style="padding:9px 8px;color:#888;font-weight:700;">Est. Total</td><td style="padding:9px 8px;font-weight:700;color:#FF8C35;font-size:16px;">â‚¹${esc(o.estimatedTotal) || 'â€”'}</td></tr>
        </table>
        ${o.notes ? `<div style="margin-top:16px;padding:14px;background:#f4f4f4;border-radius:8px;"><p style="margin:0;color:#555;"><strong>Notes:</strong><br>${esc(o.notes).replace(/\n/g, '<br>')}</p></div>` : ''}
        <p style="margin-top:20px;font-size:12px;color:#aaa;">Submitted from kyzerrobotics.com 3D print quote page</p>
      </div>`;

    const customerHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:20px;">
        <div style="background:#FF8C35;padding:24px 28px;border-radius:12px 12px 0 0;">
          <h2 style="color:#111;margin:0;">Quote Request Received âœ“</h2>
        </div>
        <div style="background:#fff;border:1px solid #eee;border-top:none;padding:24px 28px;border-radius:0 0 12px 12px;">
          <p style="font-size:15px;">Hi <strong>${esc(o.name)}</strong>, thanks for your quote request!</p>
          <p style="color:#555;line-height:1.7;">Our team will review your file and confirm the final price within <strong>a few hours</strong>. We'll send a payment link once confirmed.</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:13px;background:#f9f9f9;border-radius:8px;">
            <tr><td style="padding:8px 12px;color:#888;">Material</td><td style="padding:8px 12px;font-weight:500;">${esc(o.material) || 'â€”'}</td></tr>
            <tr><td style="padding:8px 12px;color:#888;">Quantity</td><td style="padding:8px 12px;font-weight:500;">${esc(o.quantity) || 'â€”'}</td></tr>
            <tr><td style="padding:8px 12px;color:#888;">Delivery</td><td style="padding:8px 12px;font-weight:500;">${esc(deliveryLabel)}${esc(rushLabel)}</td></tr>
            <tr><td style="padding:8px 12px;color:#888;">File</td><td style="padding:8px 12px;font-weight:500;">${esc(o.fileName) || 'Manual dimensions'}</td></tr>
            <tr style="background:#fff3e8;"><td style="padding:10px 12px;color:#888;font-weight:700;">Est. Total</td><td style="padding:10px 12px;font-weight:700;color:#FF8C35;font-size:15px;">â‚¹${esc(o.estimatedTotal) || 'â€”'}</td></tr>
          </table>
          <p style="font-size:13px;color:#888;"><strong>Order ref:</strong> ${esc(o.id) || 'â€”'}</p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
          <p style="font-size:12px;color:#aaa;">Questions? WhatsApp us at <a href="${waLink}" style="color:#FF8C35;">${waDisplay}</a> or reply to this email.</p>
          <p style="font-size:12px;color:#aaa;">Kyzer Robotics Pvt. Ltd. Â· Pune, Maharashtra</p>
        </div>
      </div>`;

    await sendMail({
      to: NOTIFY_EMAIL(),
      subject: `[Kyzer 3D] ${esc(o.name)} â€” ${esc(o.material) || ''} Â· â‚¹${esc(o.estimatedTotal) || '?'}`,
      html: adminHtml,
    });
    await sendMail({ to: o.email, subject: 'Your 3D print quote request â€” Kyzer Robotics', html: customerHtml });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Print quote error:', err);
    return NextResponse.json({ ok: false, error: 'Failed to send email.' }, { status: 500 });
  }
}
