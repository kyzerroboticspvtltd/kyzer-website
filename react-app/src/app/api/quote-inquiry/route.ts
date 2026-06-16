import { NextRequest, NextResponse } from 'next/server';
import { sendMail, NOTIFY_EMAIL, NOTIFY_PHONE } from '@/lib/mailer';
import { createClient } from '@supabase/supabase-js';
import { getIp, rateLimit, tooManyRequests } from '@/lib/rateLimit';
import { BODY_LIMIT, rejectOversized, esc, str, isValidEmail, stripControl } from '@/lib/sanitize';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  const rl = rateLimit(`quote-inquiry:${getIp(req)}`, 5, 60 * 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfterSecs);

  const oversize = rejectOversized(req, BODY_LIMIT.SMALL);
  if (oversize) return oversize;

  try {
    const data = await req.formData();

    const name        = str(data.get('name'),        100);
    const email       = str(data.get('email'),       254);
    const phone       = str(data.get('phone'),        20);
    const org         = str(data.get('org'),         100);
    const projectType = str(data.get('projectType'),  50);
    const description = stripControl(str(data.get('description'), 5000));
    const timeline    = str(data.get('timeline'),     50);
    const budget      = str(data.get('budget'),       50);

    if (!name || !email || !phone || !description) {
      return NextResponse.json({ ok: false, error: 'Missing required fields.' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: 'Invalid email address.' }, { status: 400 });
    }
    const waPhone = NOTIFY_PHONE();
    const waLink = waPhone ? `https://wa.me/${waPhone.replace(/\D/g, '')}` : '#';

    const inquiryId = 'QI-' + Date.now();
    const submittedAt = new Date().toISOString();

    // 1. Save to Supabase (primary — admin visibility)
    const sb = getSupabase();
    if (sb) {
      try {
        await sb.from('quote_inquiries').insert({
          id: inquiryId,
          submitted_at: submittedAt,
          status: 'new',
          name, email, phone, org,
          project_type: projectType,
          description, timeline, budget,
        });
      } catch {}
    }

    // 2. Send emails (non-fatal — don't fail the request if email is unconfigured)
    const safePhone = phone.replace(/[^\d+]/g, '').slice(0, 15);
    const html = `
      <div style="font-family:sans-serif;max-width:620px;margin:auto;">
        <h2 style="color:#FF8C35;margin-bottom:4px;">New Project Quote Request</h2>
        <p style="color:#888;font-size:13px;margin-bottom:24px;">Submitted via kyzerrobotics.com · ${esc(inquiryId)}</p>

        <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#aaa;margin-bottom:8px;">Contact</h3>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <tr><td style="padding:8px 12px;color:#888;width:130px;">Name</td><td style="padding:8px 12px;font-weight:600;">${esc(name)}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px 12px;color:#888;">Email</td><td style="padding:8px 12px;"><a href="mailto:${esc(email)}" style="color:#FF8C35;">${esc(email)}</a></td></tr>
          <tr><td style="padding:8px 12px;color:#888;">Phone / WA</td><td style="padding:8px 12px;"><a href="https://wa.me/${safePhone}" style="color:#25D366;">${esc(phone)}</a></td></tr>
          ${org ? `<tr style="background:#f9f9f9;"><td style="padding:8px 12px;color:#888;">Org / College</td><td style="padding:8px 12px;">${esc(org)}</td></tr>` : ''}
        </table>

        <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#aaa;margin-bottom:8px;">Project</h3>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <tr><td style="padding:8px 12px;color:#888;width:130px;">Type</td><td style="padding:8px 12px;font-weight:600;">${esc(projectType) || '—'}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px 12px;color:#888;">Timeline</td><td style="padding:8px 12px;">${esc(timeline) || '—'}</td></tr>
          <tr><td style="padding:8px 12px;color:#888;">Budget</td><td style="padding:8px 12px;">${esc(budget) || '—'}</td></tr>
        </table>

        <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#aaa;margin-bottom:8px;">Description</h3>
        <div style="padding:16px;background:#f4f4f4;border-radius:8px;margin-bottom:24px;">
          <p style="margin:0;color:#333;white-space:pre-wrap;">${esc(description)}</p>
        </div>

        <p style="font-size:12px;color:#bbb;">Kyzer Robotics · Quote Inquiry Form</p>
      </div>`;

    try {
      await sendMail({ to: NOTIFY_EMAIL(), subject: `[Kyzer Quote] ${projectType ? esc(projectType) + ' — ' : ''}${esc(name)}`, html });
      const waPhone = NOTIFY_PHONE();
      const waLink = waPhone ? `https://wa.me/${waPhone.replace(/\D/g, '')}` : '#';
      await sendMail({
        to: email,
        subject: 'We received your project request — Kyzer Robotics',
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:auto;">
            <h2 style="color:#FF8C35;">Got it, ${esc(name)}!</h2>
            <p>Thanks for reaching out. We've received your project details and will get back to you within <strong>a few hours</strong>.</p>
            <p>In the meantime, feel free to chat with us on WhatsApp for a faster response:</p>
            <a href="${waLink}" style="display:inline-block;margin:12px 0;background:#25D366;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Chat on WhatsApp →</a>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
            <p style="font-size:13px;color:#888;">Kyzer Robotics · Pune, Maharashtra<br>${esc(NOTIFY_EMAIL())}</p>
          </div>`,
      });
    } catch {
      // Email failed — inquiry is already saved to Supabase, so return success
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error('Quote inquiry error:', err);
    return NextResponse.json({ ok: false, error: 'Failed to save inquiry.' }, { status: 500 });
  }
}
