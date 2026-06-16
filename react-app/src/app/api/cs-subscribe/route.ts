import { NextRequest, NextResponse } from 'next/server';
import { sendMail, NOTIFY_EMAIL } from '@/lib/mailer';
import { getIp, rateLimit, tooManyRequests } from '@/lib/rateLimit';

const esc = (s: unknown) =>
  String(s).replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c] as string));

export async function POST(req: NextRequest) {
  const rl = rateLimit(`cs-subscribe:${getIp(req)}`, 5, 60 * 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfterSecs);

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
