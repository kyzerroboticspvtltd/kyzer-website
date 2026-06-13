import { NextRequest, NextResponse } from 'next/server';
import { sendMail, NOTIFY_EMAIL } from '@/lib/mailer';

const esc = (s: unknown) =>
  String(s).replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c] as string));

export async function POST(req: NextRequest) {
  try {
    const { email, product } = await req.json();
    if (!email) return NextResponse.json({ ok: false });

    const label = product ? esc(product) : 'kyzerrobotics.com';
    await sendMail({
      to: NOTIFY_EMAIL(),
      subject: `[Kyzer] New ${product ? esc(product) + ' ' : ''}waitlist signup: ${esc(email)}`,
      html: `<p><strong>${esc(email)}</strong> signed up for launch notification (${label}).</p>`,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
