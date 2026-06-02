import { NextRequest, NextResponse } from 'next/server';
import { sendMail, NOTIFY_EMAIL } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();

    const name        = (data.get('name')        as string) || '';
    const email       = (data.get('email')       as string) || '';
    const phone       = (data.get('phone')       as string) || '';
    const org         = (data.get('org')         as string) || '';
    const projectType = (data.get('projectType') as string) || '';
    const description = (data.get('description') as string) || '';
    const timeline    = (data.get('timeline')    as string) || '';
    const budget      = (data.get('budget')      as string) || '';

    if (!name || !email || !phone || !description) {
      return NextResponse.json({ ok: false, error: 'Missing required fields.' }, { status: 400 });
    }

    const html = `
      <div style="font-family:sans-serif;max-width:620px;margin:auto;">
        <h2 style="color:#FF8C35;margin-bottom:4px;">New Project Quote Request</h2>
        <p style="color:#888;font-size:13px;margin-bottom:24px;">Submitted via kyzerrobotics.com</p>

        <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#aaa;margin-bottom:8px;">Contact</h3>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <tr><td style="padding:8px 12px;color:#888;width:130px;">Name</td><td style="padding:8px 12px;font-weight:600;">${name}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px 12px;color:#888;">Email</td><td style="padding:8px 12px;"><a href="mailto:${email}" style="color:#FF8C35;">${email}</a></td></tr>
          <tr><td style="padding:8px 12px;color:#888;">Phone / WA</td><td style="padding:8px 12px;"><a href="https://wa.me/${phone.replace(/\D/g,'')}" style="color:#25D366;">${phone}</a></td></tr>
          ${org ? `<tr style="background:#f9f9f9;"><td style="padding:8px 12px;color:#888;">Org / College</td><td style="padding:8px 12px;">${org}</td></tr>` : ''}
        </table>

        <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#aaa;margin-bottom:8px;">Project</h3>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <tr><td style="padding:8px 12px;color:#888;width:130px;">Type</td><td style="padding:8px 12px;font-weight:600;">${projectType || '—'}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px 12px;color:#888;">Timeline</td><td style="padding:8px 12px;">${timeline || '—'}</td></tr>
          <tr><td style="padding:8px 12px;color:#888;">Budget</td><td style="padding:8px 12px;">${budget || '—'}</td></tr>
        </table>

        <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#aaa;margin-bottom:8px;">Description</h3>
        <div style="padding:16px;background:#f4f4f4;border-radius:8px;margin-bottom:24px;">
          <p style="margin:0;color:#333;white-space:pre-wrap;">${description}</p>
        </div>

        <p style="font-size:12px;color:#bbb;">Kyzer Robotics · Quote Inquiry Form</p>
      </div>`;

    await sendMail({ to: NOTIFY_EMAIL(), subject: `[Kyzer Quote] ${projectType ? projectType + ' — ' : ''}${name}`, html });

    await sendMail({
      to: email,
      subject: 'We received your project request — Kyzer Robotics',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;">
          <h2 style="color:#FF8C35;">Got it, ${name}!</h2>
          <p>Thanks for reaching out. We've received your project details and will get back to you within <strong>a few hours</strong>.</p>
          <p>In the meantime, feel free to chat with us on WhatsApp for a faster response:</p>
          <a href="https://wa.me/919049695264" style="display:inline-block;margin:12px 0;background:#25D366;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Chat on WhatsApp →</a>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
          <p style="font-size:13px;color:#888;">Kyzer Robotics · Pune, Maharashtra<br>info@kyzerrobotics.com</p>
        </div>`,
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error('Quote inquiry error:', err);
    return NextResponse.json({ ok: false, error: 'Failed to send.' }, { status: 500 });
  }
}
