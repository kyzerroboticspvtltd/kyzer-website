import { NextRequest, NextResponse } from 'next/server';
import { sendMail, NOTIFY_EMAIL, NOTIFY_PHONE } from '@/lib/mailer';
import { getIp, rateLimit, tooManyRequests } from '@/lib/rateLimit';
import { BODY_LIMIT, rejectOversized, esc, isValidEmail } from '@/lib/sanitize';

function s(v: unknown): string { return String(v || ''); }
import { generateInvoicePDF, shopOrderToInvoice } from '@/lib/invoice';
import { saveOrder } from '@/lib/orders';
import { verifyCheckoutToken } from '@/app/api/checkout-token/route';

type OrderData = Record<string, unknown>;
type InvoiceData = ReturnType<typeof shopOrderToInvoice>;

function sendEmailsInBackground(o: OrderData, invoiceData: InvoiceData) {
  (async () => {
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

    const itemRows = (o.items as Array<{ name: string; qty: number; price: string }> || []).map(i =>
      `<tr>
        <td style="padding:8px;">${esc(i.name)}</td>
        <td style="padding:8px;text-align:center;">×${Number(i.qty) || 1}</td>
        <td style="padding:8px;text-align:right;">₹${(invoiceData.items.find(x => x.name === i.name)?.price ?? 0).toLocaleString('en-IN')}</td>
      </tr>`
    ).join('');

    const waPhone = NOTIFY_PHONE();
    const waLink = waPhone ? `https://wa.me/${waPhone.replace(/\D/g, '')}` : '#';
    const waDisplay = waPhone || '+91 90496 95264';

    try {
      await sendMail({
        to:      NOTIFY_EMAIL(),
        subject: `[Kyzer] New COD Order ${esc(s(o.id))} – ${esc(s(o.name))}`,
        html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;">
          <h2 style="color:#FF8C35;">New Shop Order – Kyzer Robotics</h2>
          <p><strong>Order ID:</strong> ${esc(s(o.id) || '–')}</p>
          <table style="width:100%;border-collapse:collapse;margin-top:12px;">
            <tr style="background:#f4f4f4;"><td style="padding:8px;color:#888;width:130px;">Customer</td><td style="padding:8px;font-weight:500;">${esc(s(o.name))}</td></tr>
            <tr><td style="padding:8px;color:#888;">Email</td><td style="padding:8px;"><a href="mailto:${esc(s(o.email))}">${esc(s(o.email))}</a></td></tr>
            <tr style="background:#f4f4f4;"><td style="padding:8px;color:#888;">Phone</td><td style="padding:8px;">${esc(s(o.phone)) || '–'}</td></tr>
            <tr><td style="padding:8px;color:#888;">Ship to</td><td style="padding:8px;">${esc(s(o.shippingFull)) || '–'}</td></tr>
            <tr style="background:#f4f4f4;"><td style="padding:8px;color:#888;">Payment</td><td style="padding:8px;">Cash on Delivery</td></tr>
          </table>
          <table style="width:100%;border-collapse:collapse;font-size:13px;margin-top:16px;">
            <tr style="background:#f4f4f4;font-weight:600;"><td style="padding:8px;">Product</td><td style="padding:8px;text-align:center;">Qty</td><td style="padding:8px;text-align:right;">Amount</td></tr>
            ${itemRows}
          </table>
          <p style="font-size:12px;color:#aaa;margin-top:20px;">Submitted from kyzerrobotics.com checkout</p>
        </div>`,
      });
    } catch (mailErr) {
      console.error('Admin email failed (order saved):', mailErr);
    }

    const custItemRows = invoiceData.items.map(i =>
      `<tr style="border-bottom:1px solid #f0f0f0;">
        <td style="padding:9px 10px;">${esc(i.name)}</td>
        <td style="padding:9px 10px;text-align:center;">×${i.qty}</td>
        <td style="padding:9px 10px;text-align:right;">₹${(i.price * i.qty).toLocaleString('en-IN')}</td>
      </tr>`
    ).join('');
    const orderTotal = invoiceData.total > 0
      ? `₹${invoiceData.total.toLocaleString('en-IN')}`
      : invoiceData.items.reduce((s, i) => s + i.price * i.qty, 0) > 0
        ? `₹${invoiceData.items.reduce((s, i) => s + i.price * i.qty, 0).toLocaleString('en-IN')}`
        : 'As per invoice';

    try {
      await sendMail({
        to:          s(o.email),
        subject:     `Order Confirmed - Kyzer Robotics (#${esc(s(o.id))})`,
        attachments: attachment ? [attachment] : undefined,
        html: `<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:620px;margin:auto;background:#f9f9f9;padding:24px;">
          <div style="background:#111;padding:20px 28px;border-radius:12px 12px 0 0;display:flex;align-items:center;gap:12px;">
            <div>
              <div style="color:#FF8C35;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Kyzer Robotics</div>
              <div style="color:#fff;font-size:20px;font-weight:700;margin-top:2px;">Order Confirmed!</div>
            </div>
          </div>
          <div style="background:#fff;border:1px solid #e8e8e8;border-top:none;padding:28px;border-radius:0 0 12px 12px;">
            <p style="font-size:15px;margin:0 0 6px;">Hi <strong>${esc(s(o.name))}</strong>,</p>
            <p style="color:#555;font-size:14px;margin:0 0 20px;">Thank you for your order! We've received it and will process it shortly.</p>
            <div style="background:#fff8f0;border:1px solid #ffd9a8;border-radius:8px;padding:16px 18px;margin-bottom:24px;">
              <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;">
                <div><span style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;">Order ID</span><br><strong style="color:#111;font-size:14px;">${esc(s(o.id) || '-')}</strong></div>
                <div><span style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;">Payment</span><br><strong style="color:#111;font-size:14px;">Cash on Delivery</strong></div>
                <div><span style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;">Date</span><br><strong style="color:#111;font-size:14px;">${invoiceData.date}</strong></div>
              </div>
            </div>
            <p style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px;">Shipping To</p>
            <p style="font-size:14px;margin:0 0 24px;color:#333;">${esc(s(o.shippingFull) || '-')}</p>
            <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:4px;">
              <tr style="background:#f5f5f5;font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">
                <td style="padding:9px 10px;">Item</td>
                <td style="padding:9px 10px;text-align:center;">Qty</td>
                <td style="padding:9px 10px;text-align:right;">Amount</td>
              </tr>
              ${custItemRows}
            </table>
            <div style="background:#f5f5f5;border-radius:0 0 8px 8px;padding:10px 10px;text-align:right;">
              <span style="font-size:13px;color:#555;">Order Total: </span>
              <strong style="font-size:16px;color:#111;">${orderTotal}</strong>
            </div>
            ${attachment ? `<p style="font-size:13px;color:#555;margin:20px 0 0;">Your invoice PDF is attached to this email.</p>` : ''}
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0 16px;">
            <p style="font-size:12px;color:#aaa;margin:0;">Questions? WhatsApp us at <a href="${waLink}" style="color:#FF8C35;text-decoration:none;">${waDisplay}</a> or reply to this email.</p>
            <p style="font-size:12px;color:#aaa;margin:6px 0 0;">Kyzer Robotics Pvt. Ltd. · Pune, Maharashtra · <a href="https://kyzerrobotics.com" style="color:#FF8C35;text-decoration:none;">kyzerrobotics.com</a></p>
          </div>
        </div>`,
      });
    } catch (mailErr) {
      console.error('Customer email failed (order saved):', mailErr);
    }
  })().catch(err => console.error('Background email task failed:', err));
}

export async function POST(req: NextRequest) {
  const rl = await rateLimit(`order-notify:${getIp(req)}`, 10, 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfterSecs);

  const oversize = rejectOversized(req, BODY_LIMIT.MEDIUM);
  if (oversize) return oversize;

  try {
    const body = await req.json();

    if (!verifyCheckoutToken(body?.checkoutToken)) {
      return NextResponse.json({ ok: false, error: 'Invalid or expired checkout session.' }, { status: 403 });
    }

    const o = body?.orderData;
    if (!o || !o.email) {
      return NextResponse.json({ ok: false, error: 'Missing order data.' }, { status: 400 });
    }
    if (!isValidEmail(o.email)) {
      return NextResponse.json({ ok: false, error: 'Invalid email address.' }, { status: 400 });
    }
    if (Array.isArray(o.items) && o.items.length > 100) {
      return NextResponse.json({ ok: false, error: 'Too many items.' }, { status: 400 });
    }

    await saveOrder({ ...o, status: o.status || 'new', paymentMethod: 'cod' }, 'cod');

    // Respond immediately so the checkout button doesn't hang.
    const invoiceData = shopOrderToInvoice(o as Record<string, unknown>, false);
    sendEmailsInBackground(o, invoiceData);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Order notify error:', err);
    return NextResponse.json({ ok: false, error: 'Failed to send notification.' }, { status: 500 });
  }
}
