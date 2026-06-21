import { NextRequest, NextResponse } from 'next/server';
import { sendMail, NOTIFY_EMAIL } from '@/lib/mailer';
import { getIp, rateLimit, tooManyRequests } from '@/lib/rateLimit';
import { BODY_LIMIT, rejectOversized, esc, str, isValidEmail, stripControl } from '@/lib/sanitize';

export async function POST(req: NextRequest) {
  const rl = await rateLimit(`contact:${getIp(req)}`, 5, 60 * 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfterSecs);

  const oversize = rejectOversized(req, BODY_LIMIT.SMALL);
  if (oversize) return oversize;

  try {
    const body = await req.json();

    const name    = str(body?.name,    100);
    const email   = str(body?.email,   254);
    const phone   = str(body?.phone,    20);
    const subject = str(body?.subject, 200);
    const message = stripControl(str(body?.message, 5000));

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: 'Name, email and message are required.' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: 'Invalid email address.' }, { status: 400 });
    }

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;">
        <h2 style="color:#FF8C35;">New Contact Message â€” Kyzer Robotics</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px;color:#888;width:120px;">Name</td><td style="padding:8px;font-weight:500;">${esc(name)}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;color:#888;">Email</td><td style="padding:8px;"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
          <tr><td style="padding:8px;color:#888;">Phone</td><td style="padding:8px;">${esc(phone) || 'â€”'}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;color:#888;">Subject</td><td style="padding:8px;">${esc(subject) || 'â€”'}</td></tr>
        </table>
        <div style="margin-top:20px;padding:16px;background:#f4f4f4;border-radius:8px;">
          <p style="margin:0;color:#333;">${esc(message).replace(/\n/g, '<br>')}</p>
        </div>
        <p style="margin-top:16px;font-size:12px;color:#aaa;">Submitted from kyzerrobotics.com contact form</p>
      </div>`;

    await sendMail({ to: NOTIFY_EMAIL(), subject: `[Kyzer] Contact: ${esc(subject || name)}`, html });
    await sendMail({
      to: email,
      subject: 'We received your message â€” Kyzer Robotics',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;">
          <h2 style="color:#FF8C35;">Thanks, ${esc(name)}!</h2>
          <p>We received your message and will get back to you within <strong>24 hours</strong>.</p>
          <p style="color:#888;">Your message:<br><em>${esc(message).replace(/\n/g, '<br>')}</em></p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
          <p style="font-size:13px;color:#888;">Kyzer Robotics Pvt. Ltd. Â· Pune, Maharashtra</p>
        </div>`,
    });

    return NextResponse.json({ ok: true, message: 'Message sent successfully.' });
  } catch (err: unknown) {
    console.error('Contact mail error:', err);
    return NextResponse.json({ ok: false, error: 'Failed to send email. Please try again.' }, { status: 500 });
  }
}
