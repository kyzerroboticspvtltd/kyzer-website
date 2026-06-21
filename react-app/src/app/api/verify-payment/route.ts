import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { getIp, rateLimit, tooManyRequests } from '@/lib/rateLimit';
import { BODY_LIMIT, rejectOversized, esc } from '@/lib/sanitize';
import { sendMail, NOTIFY_EMAIL, NOTIFY_PHONE } from '@/lib/mailer';
import { generateInvoicePDF, shopOrderToInvoice } from '@/lib/invoice';
import { saveOrder } from '@/lib/orders';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  const rl = await rateLimit(`verify-payment:${getIp(req)}`, 10, 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfterSecs);

  const oversize = rejectOversized(req, BODY_LIMIT.MEDIUM);
  if (oversize) return oversize;

  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = body ?? {};
    const waPhone = NOTIFY_PHONE();
    const waLink = waPhone ? `https://wa.me/${waPhone.replace(/\D/g, '')}` : '#';
    const waDisplay = waPhone || '+91 90496 95264';

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

    // Fetch the server-calculated amount so the client cannot manipulate the total.
    let serverTotal: number | null = null;
    const sb = getSupabase();
    if (sb) {
      const { data } = await sb
        .from('pending_payments')
        .select('server_amount_paise')
        .eq('razorpay_order_id', razorpay_order_id)
        .single();
      if (data?.server_amount_paise) {
        serverTotal = data.server_amount_paise / 100;
        await sb.from('pending_payments').delete().eq('razorpay_order_id', razorpay_order_id);
      }
    }

    if (orderData && orderData.email) {
      // Override the client-supplied total with the server-authoritative value.
      const authorisedTotal = serverTotal ?? orderData.total;
      const o = { ...orderData, total: authorisedTotal, paymentId: razorpay_payment_id } as Record<string, unknown>;

      // ðŸ’¾ Persist the paid order first â€” the server is the source of truth even
      // if the confirmation email or the customer's browser fails afterwards.
      await saveOrder(
        { ...o, status: 'paid', paymentStatus: 'paid', razorpayOrderId: razorpay_order_id },
        'shop',
      );

      // Generate tax invoice PDF (non-fatal â€” email sends even if PDF fails)
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

      const fmt = (n: number | string) => 'â‚¹' + Number(n || 0).toLocaleString('en-IN');

      const adminHtml = `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;">
          <h2 style="color:#FF8C35;">âœ… New Paid Order â€” Kyzer Robotics</h2>
          <p><strong>Order:</strong> ${esc(orderData.id) || 'â€”'} &nbsp;|&nbsp; <strong>Payment:</strong> ${esc(razorpay_payment_id)}</p>
          <table style="width:100%;border-collapse:collapse;margin-top:12px;">
            <tr style="background:#f4f4f4;"><td style="padding:8px;color:#888;width:130px;">Customer</td><td style="padding:8px;font-weight:500;">${esc(orderData.name)}</td></tr>
            <tr><td style="padding:8px;color:#888;">Email</td><td style="padding:8px;"><a href="mailto:${esc(orderData.email)}">${esc(orderData.email)}</a></td></tr>
            <tr style="background:#f4f4f4;"><td style="padding:8px;color:#888;">Phone</td><td style="padding:8px;">${esc(orderData.phone) || 'â€”'}</td></tr>
            <tr><td style="padding:8px;color:#888;">Ship to</td><td style="padding:8px;">${esc(orderData.shippingFull) || 'â€”'}</td></tr>
          </table>
          <h3 style="margin:20px 0 8px;">Items</h3>
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <tr style="background:#f4f4f4;font-weight:600;">
              <td style="padding:8px;">Product</td>
              <td style="padding:8px;text-align:center;">Qty</td>
              <td style="padding:8px;text-align:right;">Amount</td>
            </tr>
            ${(orderData.items || []).map((i: { name: string; qty: number; price: string | number }) =>
              `<tr><td style="padding:8px;">${esc(i.name)}</td><td style="padding:8px;text-align:center;">Ã—${Number(i.qty) || 1}</td><td style="padding:8px;text-align:right;">${fmt(Number(i.price || 0) * (Number(i.qty) || 1))}</td></tr>`
            ).join('')}
            <tr style="border-top:2px solid #eee;font-weight:700;font-size:15px;color:#FF8C35;">
              <td colspan="2" style="padding:10px;">Total (incl. GST)</td>
              <td style="padding:10px;text-align:right;">${fmt(authorisedTotal || 0)}</td>
            </tr>
          </table>
          ${orderData.notes ? `<p style="margin-top:14px;font-size:13px;color:#555;"><strong>Notes:</strong> ${esc(String(orderData.notes).slice(0, 2000))}</p>` : ''}
        </div>`;

      const customerHtml = `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:20px;">
          <div style="background:#FF8C35;padding:24px 28px;border-radius:12px 12px 0 0;">
            <h2 style="color:#111;margin:0;font-size:22px;">Order Confirmed âœ“</h2>
          </div>
          <div style="background:#fff;border:1px solid #eee;border-top:none;padding:24px 28px;border-radius:0 0 12px 12px;">
            <p style="font-size:15px;">Hi <strong>${esc(orderData.name)}</strong>, thanks for your order!</p>
            <p style="color:#555;font-size:14px;">Your payment was successful and your tax invoice is attached to this email.</p>

            <div style="background:#f0fff4;border:1px solid #b2f0c8;border-radius:8px;padding:14px 16px;margin:20px 0;">
              <p style="margin:0;font-size:13px;color:#1a7a40;"><strong>Order ID:</strong> ${esc(orderData.id) || 'â€”'}</p>
              <p style="margin:6px 0 0;font-size:13px;color:#1a7a40;"><strong>Payment ID:</strong> ${esc(razorpay_payment_id)}</p>
              <p style="margin:6px 0 0;font-size:13px;color:#1a7a40;"><strong>Ship to:</strong> ${esc(orderData.shippingFull) || 'â€”'}</p>
            </div>

            <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:20px;">
              <tr style="background:#f8f8f8;font-weight:600;">
                <td style="padding:8px 10px;">Item</td>
                <td style="padding:8px 10px;text-align:center;">Qty</td>
                <td style="padding:8px 10px;text-align:right;">Amount</td>
              </tr>
              ${(orderData.items || []).map((i: { name: string; qty: number; price: string | number }) =>
                `<tr style="border-bottom:1px solid #f0f0f0;">
                  <td style="padding:8px 10px;">${esc(i.name)}</td>
                  <td style="padding:8px 10px;text-align:center;">Ã—${Number(i.qty) || 1}</td>
                  <td style="padding:8px 10px;text-align:right;font-weight:600;">${fmt(Number(i.price || 0) * (Number(i.qty) || 1))}</td>
                </tr>`
              ).join('')}
              <tr style="border-top:2px solid #eee;">
                <td colspan="2" style="padding:10px;font-weight:700;font-size:15px;">Total (incl. GST)</td>
                <td style="padding:10px;font-weight:700;font-size:15px;text-align:right;color:#FF8C35;">${fmt(authorisedTotal || 0)}</td>
              </tr>
            </table>

            <hr style="border:none;border-top:1px solid #eee;margin:16px 0;">
            <p style="font-size:12px;color:#aaa;">${attachment ? 'ðŸ“Ž Your tax invoice (PDF) is attached to this email.' : 'Your invoice will be sent separately shortly.'}</p>
            <p style="font-size:12px;color:#aaa;">Questions? WhatsApp us at <a href="${waLink}" style="color:#FF8C35;">${waDisplay}</a> or reply to this email.</p>
            <p style="font-size:12px;color:#aaa;">Kyzer Robotics Pvt. Ltd. Â· Pune, Maharashtra Â· kyzerrobotics.com</p>
          </div>
        </div>`;

      try {
        await sendMail({
          to:      NOTIFY_EMAIL(),
          subject: `[Kyzer] Paid Order ${orderData.id || ''} â€” ${fmt(authorisedTotal || 0)} â€” ${orderData.name}`,
          html:    adminHtml,
        });
        await sendMail({
          to:          orderData.email,
          subject:     `Order confirmed â€” Kyzer Robotics (#${orderData.id || ''})`,
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
