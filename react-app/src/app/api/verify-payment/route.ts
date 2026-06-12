import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { sendMail, NOTIFY_EMAIL } from '@/lib/mailer';
import { generateInvoicePDF, shopOrderToInvoice } from '@/lib/invoice';
import { escapeHtml } from '@/lib/escape';

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ ok: false, error: 'Missing payment fields.' }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret || !keyId) {
      return NextResponse.json({ ok: false, error: 'Payment gateway not configured.' }, { status: 503 });
    }

    const expected = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return NextResponse.json({ ok: false, error: 'Payment verification failed.' }, { status: 400 });
    }

    // The Razorpay signature only binds order_id+payment_id, not the amount.
    // Fetch the authoritative order/payment server-side and confirm the
    // payment was actually captured for this order, then use the server-side
    // amount everywhere — never the client-supplied orderData.total.
    const rzp = new Razorpay({ key_id: keyId, key_secret: secret });
    let serverTotal: number;
    try {
      const payment = await rzp.payments.fetch(razorpay_payment_id);
      if (payment.order_id !== razorpay_order_id || (payment.status !== 'captured' && payment.status !== 'authorized')) {
        return NextResponse.json({ ok: false, error: 'Payment not valid for this order.' }, { status: 400 });
      }
      serverTotal = Number(payment.amount) / 100;
    } catch (fetchErr) {
      console.error('Razorpay payment fetch failed:', fetchErr);
      return NextResponse.json({ ok: false, error: 'Could not verify payment with gateway.' }, { status: 502 });
    }

    if (orderData && orderData.email) {
      // Override any client-supplied total with the gateway-verified amount.
      const o = { ...orderData, total: serverTotal, paymentId: razorpay_payment_id } as Record<string, unknown>;
      orderData.total = serverTotal;

      // Generate tax invoice PDF (non-fatal — email sends even if PDF fails)
      const invoiceData = shopOrderToInvoice(o, true);
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

      const fmt = (n: number | string) => '₹' + Number(n || 0).toLocaleString('en-IN');

      // Escape all client-supplied order fields before embedding in email HTML.
      const sName = escapeHtml(orderData.name || '');
      const sEmail = escapeHtml(orderData.email || '');
      const sEmailHref = encodeURIComponent(String(orderData.email || ''));
      const sPhone = escapeHtml(orderData.phone || '—');
      const sShip = escapeHtml(orderData.shippingFull || '—');
      const sId = escapeHtml(orderData.id || '—');
      const sNotes = escapeHtml(orderData.notes || '');
      const itemRow = (i: { name: string; qty: number; price: string | number }, style: string) =>
        `<tr style="${style}"><td style="padding:8px;">${escapeHtml(i.name)}</td><td style="padding:8px;text-align:center;">×${Number(i.qty) || 0}</td><td style="padding:8px;text-align:right;">${fmt(Number(i.price || 0) * (Number(i.qty) || 0))}</td></tr>`;

      const adminHtml = `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;">
          <h2 style="color:#FF8C35;">✅ New Paid Order — Kyzer Robotics</h2>
          <p><strong>Order:</strong> ${sId} &nbsp;|&nbsp; <strong>Payment:</strong> ${escapeHtml(razorpay_payment_id)}</p>
          <table style="width:100%;border-collapse:collapse;margin-top:12px;">
            <tr style="background:#f4f4f4;"><td style="padding:8px;color:#888;width:130px;">Customer</td><td style="padding:8px;font-weight:500;">${sName}</td></tr>
            <tr><td style="padding:8px;color:#888;">Email</td><td style="padding:8px;"><a href="mailto:${sEmailHref}">${sEmail}</a></td></tr>
            <tr style="background:#f4f4f4;"><td style="padding:8px;color:#888;">Phone</td><td style="padding:8px;">${sPhone}</td></tr>
            <tr><td style="padding:8px;color:#888;">Ship to</td><td style="padding:8px;">${sShip}</td></tr>
          </table>
          <h3 style="margin:20px 0 8px;">Items</h3>
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <tr style="background:#f4f4f4;font-weight:600;">
              <td style="padding:8px;">Product</td>
              <td style="padding:8px;text-align:center;">Qty</td>
              <td style="padding:8px;text-align:right;">Amount</td>
            </tr>
            ${(orderData.items || []).map((i: { name: string; qty: number; price: string | number }) => itemRow(i, '')).join('')}
            <tr style="border-top:2px solid #eee;font-weight:700;font-size:15px;color:#FF8C35;">
              <td colspan="2" style="padding:10px;">Total (incl. GST)</td>
              <td style="padding:10px;text-align:right;">${fmt(serverTotal)}</td>
            </tr>
          </table>
          ${sNotes ? `<p style="margin-top:14px;font-size:13px;color:#555;"><strong>Notes:</strong> ${sNotes}</p>` : ''}
        </div>`;

      const customerHtml = `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:20px;">
          <div style="background:#FF8C35;padding:24px 28px;border-radius:12px 12px 0 0;">
            <h2 style="color:#111;margin:0;font-size:22px;">Order Confirmed ✓</h2>
          </div>
          <div style="background:#fff;border:1px solid #eee;border-top:none;padding:24px 28px;border-radius:0 0 12px 12px;">
            <p style="font-size:15px;">Hi <strong>${sName}</strong>, thanks for your order!</p>
            <p style="color:#555;font-size:14px;">Your payment was successful and your tax invoice is attached to this email.</p>

            <div style="background:#f0fff4;border:1px solid #b2f0c8;border-radius:8px;padding:14px 16px;margin:20px 0;">
              <p style="margin:0;font-size:13px;color:#1a7a40;"><strong>Order ID:</strong> ${sId}</p>
              <p style="margin:6px 0 0;font-size:13px;color:#1a7a40;"><strong>Payment ID:</strong> ${escapeHtml(razorpay_payment_id)}</p>
              <p style="margin:6px 0 0;font-size:13px;color:#1a7a40;"><strong>Ship to:</strong> ${sShip}</p>
            </div>

            <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:20px;">
              <tr style="background:#f8f8f8;font-weight:600;">
                <td style="padding:8px 10px;">Item</td>
                <td style="padding:8px 10px;text-align:center;">Qty</td>
                <td style="padding:8px 10px;text-align:right;">Amount</td>
              </tr>
              ${(orderData.items || []).map((i: { name: string; qty: number; price: string | number }) => itemRow(i, 'border-bottom:1px solid #f0f0f0;')).join('')}
              <tr style="border-top:2px solid #eee;">
                <td colspan="2" style="padding:10px;font-weight:700;font-size:15px;">Total (incl. GST)</td>
                <td style="padding:10px;font-weight:700;font-size:15px;text-align:right;color:#FF8C35;">${fmt(serverTotal)}</td>
              </tr>
            </table>

            <hr style="border:none;border-top:1px solid #eee;margin:16px 0;">
            <p style="font-size:12px;color:#aaa;">${attachment ? '📎 Your tax invoice (PDF) is attached to this email.' : 'Your invoice will be sent separately shortly.'}</p>
            <p style="font-size:12px;color:#aaa;">Questions? WhatsApp us at <a href="https://wa.me/919049695264" style="color:#FF8C35;">+91 90496 95264</a> or reply to this email.</p>
            <p style="font-size:12px;color:#aaa;">Kyzer Robotics Pvt. Ltd. · Pune, Maharashtra · kyzerrobotics.com</p>
          </div>
        </div>`;

      try {
        await sendMail({
          to:      NOTIFY_EMAIL(),
          subject: `[Kyzer] Paid Order ${orderData.id || ''} — ${fmt(orderData.total || 0)} — ${orderData.name}`,
          html:    adminHtml,
        });
        await sendMail({
          to:          orderData.email,
          subject:     `Order confirmed — Kyzer Robotics (#${orderData.id || ''})`,
          html:        customerHtml,
          attachments: attachment ? [attachment] : undefined,
        });
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
