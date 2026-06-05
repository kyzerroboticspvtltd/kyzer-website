import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { sendMail, NOTIFY_EMAIL } from '@/lib/mailer';
import { generateInvoicePDF, shopOrderToInvoice } from '@/lib/invoice';

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
      const o = { ...orderData, paymentId: razorpay_payment_id } as Record<string, unknown>;

      // Generate tax invoice PDF (payment confirmed = final invoice, not proforma)
      const invoiceData = shopOrderToInvoice(o, true);
      const pdfBuffer   = await generateInvoicePDF(invoiceData);
      const attachment  = {
        filename:    `Kyzer-Invoice-${invoiceData.invoiceNumber}.pdf`,
        content:     pdfBuffer,
        contentType: 'application/pdf',
      };

      const fmt = (n: number | string) => '₹' + Number(n || 0).toLocaleString('en-IN');

      const adminHtml = `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;">
          <h2 style="color:#FF8C35;">✅ New Paid Order — Kyzer Robotics</h2>
          <p><strong>Order:</strong> ${orderData.id || '—'} &nbsp;|&nbsp; <strong>Payment:</strong> ${razorpay_payment_id}</p>
          <table style="width:100%;border-collapse:collapse;margin-top:12px;">
            <tr style="background:#f4f4f4;"><td style="padding:8px;color:#888;width:130px;">Customer</td><td style="padding:8px;font-weight:500;">${orderData.name}</td></tr>
            <tr><td style="padding:8px;color:#888;">Email</td><td style="padding:8px;"><a href="mailto:${orderData.email}">${orderData.email}</a></td></tr>
            <tr style="background:#f4f4f4;"><td style="padding:8px;color:#888;">Phone</td><td style="padding:8px;">${orderData.phone || '—'}</td></tr>
            <tr><td style="padding:8px;color:#888;">Ship to</td><td style="padding:8px;">${orderData.shippingFull || '—'}</td></tr>
          </table>
          <h3 style="margin:20px 0 8px;">Items</h3>
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <tr style="background:#f4f4f4;font-weight:600;">
              <td style="padding:8px;">Product</td>
              <td style="padding:8px;text-align:center;">Qty</td>
              <td style="padding:8px;text-align:right;">Amount</td>
            </tr>
            ${(orderData.items || []).map((i: { name: string; qty: number; price: string | number }) =>
              `<tr><td style="padding:8px;">${i.name}</td><td style="padding:8px;text-align:center;">×${i.qty}</td><td style="padding:8px;text-align:right;">${fmt(Number(i.price || 0) * i.qty)}</td></tr>`
            ).join('')}
            <tr style="border-top:2px solid #eee;font-weight:700;font-size:15px;color:#FF8C35;">
              <td colspan="2" style="padding:10px;">Total (incl. GST)</td>
              <td style="padding:10px;text-align:right;">${fmt(orderData.total || 0)}</td>
            </tr>
          </table>
          ${orderData.notes ? `<p style="margin-top:14px;font-size:13px;color:#555;"><strong>Notes:</strong> ${orderData.notes}</p>` : ''}
        </div>`;

      const customerHtml = `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:20px;">
          <div style="background:#FF8C35;padding:24px 28px;border-radius:12px 12px 0 0;">
            <h2 style="color:#111;margin:0;font-size:22px;">Order Confirmed ✓</h2>
          </div>
          <div style="background:#fff;border:1px solid #eee;border-top:none;padding:24px 28px;border-radius:0 0 12px 12px;">
            <p style="font-size:15px;">Hi <strong>${orderData.name}</strong>, thanks for your order!</p>
            <p style="color:#555;font-size:14px;">Your payment was successful and your tax invoice is attached to this email.</p>

            <div style="background:#f0fff4;border:1px solid #b2f0c8;border-radius:8px;padding:14px 16px;margin:20px 0;">
              <p style="margin:0;font-size:13px;color:#1a7a40;"><strong>Order ID:</strong> ${orderData.id || '—'}</p>
              <p style="margin:6px 0 0;font-size:13px;color:#1a7a40;"><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
              <p style="margin:6px 0 0;font-size:13px;color:#1a7a40;"><strong>Ship to:</strong> ${orderData.shippingFull || '—'}</p>
            </div>

            <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:20px;">
              <tr style="background:#f8f8f8;font-weight:600;">
                <td style="padding:8px 10px;">Item</td>
                <td style="padding:8px 10px;text-align:center;">Qty</td>
                <td style="padding:8px 10px;text-align:right;">Amount</td>
              </tr>
              ${(orderData.items || []).map((i: { name: string; qty: number; price: string | number }) =>
                `<tr style="border-bottom:1px solid #f0f0f0;">
                  <td style="padding:8px 10px;">${i.name}</td>
                  <td style="padding:8px 10px;text-align:center;">×${i.qty}</td>
                  <td style="padding:8px 10px;text-align:right;font-weight:600;">${fmt(Number(i.price || 0) * i.qty)}</td>
                </tr>`
              ).join('')}
              <tr style="border-top:2px solid #eee;">
                <td colspan="2" style="padding:10px;font-weight:700;font-size:15px;">Total (incl. GST)</td>
                <td style="padding:10px;font-weight:700;font-size:15px;text-align:right;color:#FF8C35;">${fmt(orderData.total || 0)}</td>
              </tr>
            </table>

            <hr style="border:none;border-top:1px solid #eee;margin:16px 0;">
            <p style="font-size:12px;color:#aaa;">📎 Your tax invoice (PDF) is attached to this email.</p>
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
          attachments: [attachment],
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
