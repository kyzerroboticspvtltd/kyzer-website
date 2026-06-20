import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getIp, rateLimit, tooManyRequests } from '@/lib/rateLimit';
import { BODY_LIMIT, rejectOversized, esc } from '@/lib/sanitize';
import { sendMail, NOTIFY_EMAIL } from '@/lib/mailer';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  const rl = rateLimit(`support-ticket:${getIp(req)}`, 5, 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfterSecs);

  const oversize = rejectOversized(req, BODY_LIMIT.SMALL);
  if (oversize) return oversize;

  try {
    const body = await req.json();
    const { name, email, subject, message, source } = body ?? {};

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: 'Missing required fields.' }, { status: 400 });
    }

    const id = `TKT-${Date.now()}`;
    const ticket = {
      id,
      name: String(name).slice(0, 100),
      email: String(email).slice(0, 200),
      subject: String(subject || 'Support Request').slice(0, 200),
      message: String(message).slice(0, 2000),
      source: String(source || 'website').slice(0, 50),
      status: 'open',
      created_at: new Date().toISOString(),
    };

    const sb = getSupabase();
    if (sb) {
      await sb.from('support_tickets').insert(ticket);
    }

    // Notify admin
    try {
      await sendMail({
        to: NOTIFY_EMAIL(),
        subject: `[Kyzer] New Support Ticket — ${ticket.subject}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:auto;">
            <h2 style="color:#FF8C35;">🎫 New Support Ticket — ${esc(ticket.subject)}</h2>
            <p><strong>Ticket ID:</strong> ${ticket.id}</p>
            <p><strong>From:</strong> ${esc(ticket.name)} &lt;${esc(ticket.email)}&gt;</p>
            <p><strong>Source:</strong> ${esc(ticket.source)}</p>
            <div style="background:#f4f4f4;border-radius:8px;padding:14px;margin-top:12px;">
              <p style="margin:0;font-size:14px;line-height:1.6;">${esc(ticket.message).replace(/\n/g, '<br>')}</p>
            </div>
            <p style="margin-top:16px;"><a href="mailto:${esc(ticket.email)}?subject=Re: ${esc(ticket.subject)}" style="background:#FF8C35;color:#111;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;">Reply to Customer</a></p>
          </div>`,
      });
    } catch {}

    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error('support-ticket error:', err);
    return NextResponse.json({ ok: false, error: 'Failed to submit ticket.' }, { status: 500 });
  }
}
