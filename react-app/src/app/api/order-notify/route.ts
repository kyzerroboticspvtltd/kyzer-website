import { NextRequest, NextResponse } from 'next/server';
import { sendMail, NOTIFY_EMAIL } from '@/lib/mailer';
import { getIp, rateLimit, tooManyRequests } from '@/lib/rateLimit';
import { generateInvoicePDF, shopOrderToInvoice } from '@/lib/invoice';
import { saveOrder } from '@/lib/orders';

export async function POST(req: NextRequest) {
  const rl = rateLimit(`order-notify:${getIp(req)}`, 10, 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfterSecs);

  try {
    const { orderData: o } = await req.json();
    if (!o || !o.email) {
      return NextResponse.json({ ok: false, error: 'Missing order data.' }, { status: 400 });
    }

    // 💾 Persist the COD order server-side before sending notifications.
    await saveOrder({ ...o, status: o.status || 'new', paymentMethod: 'cod' }, 'cod');

    // Build invoice data and generate PDF (non-fatal — email sends even if PDF fails)
    const invoiceData = shopOrderToInvoice(o as Record<string, unknown>, false);
    let attachment: { filename: string; content: Buffer; contentType: string } | undefined;
    try {
      const pdfBuffer = await generateInvoicePDF(invoiceData);
      attachment = {
        filename:    `Kyzer-Invoice-${invoiceData.invoiceNumber}.pdf`,
        content:     pdfBuffer,
        contentType: 'application/pdf',
      };
    } catch (pdfErr) {
      console.error('PDF generation failed (email will send without attachment):', pdfErr);
    }

    const itemRows = (o.items || []).map((i: { name: string; qty: number; price: string }) =>
      `<tr>
        <td style="padding:8px;">${i.name}</td>
        <td style="padding:8px;text-align:center;">×${i.qty}</td>
        <td style="padding:8px;text-align:right;">₹${(invoiceData.items.find(x => x.name === i.name)?.price ?? 0 * i.qty).toLocaleString('en-IN')}</td>
      </tr>`
    ).join('');

    // Admin notification (no PDF needed for admin)
    await sendMail({
      to:      NOTIFY_EMAIL(),
      subject: `[Kyzer] New COD Order ${o.id || ''} — ${o.name}`,
      html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;">
        <h2 style="color:#FF8C35;">New Shop Order — Kyzer Robotics</h2>
        <p><strong>Order ID:</strong> ${o.id || '—'}</p>
        <table style="width:100%;border-collapse:collapse;margin-top:12px;">
          <tr style="background:#f4f4f4;"><td style="padding:8px;color:#888;width:130px;">Customer</td><td style="padding:8px;font-weight:500;">${o.name}</td></tr>
          <tr><td style="padding:8px;color:#888;">Email</td><td style="padding:8px;"><a href="mailto:${o.email}">${o.email}</a></td></tr>
          <tr style="background:#f4f4f4;"><td style="padding:8px;color:#888;">Phone</td><td style="padding:8px;">${o.phone || '—'}</td></tr>
          <tr><td style="padding:8px;color:#888;">Ship to</td><td style="padding:8px;">${o.shippingFull || '—'}</td></tr>
          <tr style="background:#f4f4f4;"><td style="padding:8px;color:#888;">Payment</td><td style="padding:8px;">Cash on Delivery</td></tr>
        </table>
        <table style="width:100%;border-collapse:collapse;font-size:13px;margin-top:16px;">
          <tr style="background:#f4f4f4;font-weight:600;"><td style="padding:8px;">Product</td><td style="padding:8px;text-align:center;">Qty</td><td style="padding:8px;text-align:right;">Amount</td></tr>
          ${itemRows}
        </table>
        <p style="font-size:12px;color:#aaa;margin-top:20px;">Submitted from kyzerrobotics.com checkout</p>
      </div>`,
    });

    // Customer confirmation (with proforma invoice PDF if generated successfully)
    await sendMail({
      to:          o.email,
      subject:     `Order received — Kyzer Robotics (#${o.id || ''})`,
      attachments: attachment ? [attachment] : undefined,
      html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:20px;">
        <div style="background:#FF8C35;padding:24px 28px;border-radius:12px 12px 0 0;">
          <h2 style="color:#111;margin:0;font-size:22px;">Order Received ✓</h2>
        </div>
        <div style="background:#fff;border:1px solid #eee;border-top:none;padding:24px 28px;border-radius:0 0 12px 12px;">
          <p style="font-size:15px;">Hi <strong>${o.name}</strong>, we've received your order!</p>
          <p style="color:#555;font-size:14px;">Your proforma invoice is attached. Our team will confirm availability and arrange delivery shortly.</p>

          <div style="background:#fff8f3;border:1px solid #ffe0c0;border-radius:8px;padding:14px 16px;margin:20px 0;">
            <p style="margin:0;font-size:13px;color:#c06000;"><strong>Order ID:</strong> ${o.id || '—'}</p>
            <p style="margin:6px 0 0;font-size:13px;color:#c06000;"><strong>Payment:</strong> Cash on Delivery</p>
            <p style="margin:6px 0 0;font-size:13px;color:#c06000;"><strong>Ship to:</strong> ${o.shippingFull || '—'}</p>
          </div>

          <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:20px;">
            <tr style="background:#f8f8f8;font-weight:600;">
              <td style="padding:8px 10px;">Item</td>
              <td style="padding:8px 10px;text-align:center;">Qty</td>
              <td style="padding:8px 10px;text-align:right;">Amount</td>
            </tr>
            ${(o.items || []).map((i: { name: string; qty: number }) =>
              `<tr style="border-bottom:1px solid #f0f0f0;">
                <td style="padding:8px 10px;">${i.name}</td>
                <td style="padding:8px 10px;text-align:center;">×${i.qty}</td>
                <td style="padding:8px 10px;text-align:right;">—</td>
              </tr>`
            ).join('')}
          </table>

          <hr style="border:none;border-top:1px solid #eee;margin:16px 0;">
          <p style="font-size:12px;color:#aaa;">${attachment ? '📎 Your proforma invoice is attached as a PDF to this email.' : 'We will send your invoice separately once the order is confirmed.'}</p>
          <p style="font-size:12px;color:#aaa;">Questions? WhatsApp us at <a href="https://wa.me/919049695264" style="color:#FF8C35;">+91 90496 95264</a> or reply to this email.</p>
          <p style="font-size:12px;color:#aaa;">Kyzer Robotics Pvt. Ltd. · Pune, Maharashtra · kyzerrobotics.com</p>
        </div>
      </div>`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Order notify error:', err);
    return NextResponse.json({ ok: false, error: 'Failed to send notification.' }, { status: 500 });
  }
}
