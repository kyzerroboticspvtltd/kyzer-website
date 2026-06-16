import { NextRequest, NextResponse } from 'next/server';
import { sendMail, NOTIFY_EMAIL } from '@/lib/mailer';
import { getIp, rateLimit, tooManyRequests } from '@/lib/rateLimit';
import { BODY_LIMIT, rejectOversized, str, isValidEmail } from '@/lib/sanitize';

const esc = (s: unknown) =>
  String(s).replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c] as string));

export async function POST(req: NextRequest) {
  const rl = rateLimit(`cs-subscribe:${getIp(req)}`, 5, 60 * 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfterSecs);

  const oversize = rejectOversized(req, BODY_LIMIT.TINY);
  if (oversize) return oversize;

  try {
    const body = await req.json();
    const email   = str(body?.email,   254);
    const product = str(body?.product, 100);
    if (!email || !isValidEmail(email)) return NextResponse.json({ ok: false });

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
