import { NextRequest, NextResponse } from 'next/server';
import { sendMail, NOTIFY_EMAIL } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ ok: false });

    await sendMail({
      to: NOTIFY_EMAIL(),
      subject: '[Kyzer] New coming-soon signup: ' + email,
      html: `<p><strong>${email}</strong> signed up for launch notification on kyzerrobotics.com</p>`,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
