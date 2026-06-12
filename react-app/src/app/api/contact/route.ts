import { NextRequest, NextResponse } from 'next/server';
import { sendMail, NOTIFY_EMAIL } from '@/lib/mailer';
import { escapeHtml } from '@/lib/escape';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: 'Name, email and message are required.' }, { status: 400 });
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone || '—');
    const safeSubject = escapeHtml(subject || '—');
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;">
        <h2 style="color:#FF8C35;">New Contact Message — Kyzer Robotics</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px;color:#888;width:120px;">Name</td><td style="padding:8px;font-weight:500;">${safeName}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;color:#888;">Email</td><td style="padding:8px;"><a href="mailto:${encodeURIComponent(email)}">${safeEmail}</a></td></tr>
          <tr><td style="padding:8px;color:#888;">Phone</td><td style="padding:8px;">${safePhone}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;color:#888;">Subject</td><td style="padding:8px;">${safeSubject}</td></tr>
        </table>
        <div style="margin-top:20px;padding:16px;background:#f4f4f4;border-radius:8px;">
          <p style="margin:0;color:#333;">${safeMessage}</p>
        </div>
        <p style="margin-top:16px;font-size:12px;color:#aaa;">Submitted from kyzerrobotics.com contact form</p>
      </div>`;

    await sendMail({ to: NOTIFY_EMAIL(), subject: `[Kyzer] Contact: ${subject || name}`, html });
    await sendMail({
      to: email,
      subject: 'We received your message — Kyzer Robotics',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;">
          <h2 style="color:#FF8C35;">Thanks, ${safeName}!</h2>
          <p>We received your message and will get back to you within <strong>24 hours</strong>.</p>
          <p style="color:#888;">Your message:<br><em>${safeMessage}</em></p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
          <p style="font-size:13px;color:#888;">Kyzer Robotics Pvt. Ltd. · Pune, Maharashtra</p>
        </div>`,
    });

    return NextResponse.json({ ok: true, message: 'Message sent successfully.' });
  } catch (err: unknown) {
    console.error('Contact mail error:', err);
    return NextResponse.json({ ok: false, error: 'Failed to send email. Please try again.' }, { status: 500 });
  }
}
