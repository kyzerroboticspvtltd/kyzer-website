import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { getIp, rateLimit, tooManyRequests } from '@/lib/rateLimit';

const OTP_SECRET = process.env.OTP_SECRET || 'kyzer-otp-secret-change-me';
const OTP_TTL_MS = 10 * 60 * 1000;

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function signSession(email: string, otp: string, iat: number): string {
  const payload = `${email}:${otp}:${iat}`;
  const sig = crypto.createHmac('sha256', OTP_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${sig}`).toString('base64url');
}

function getTitanTransport() {
  return nodemailer.createTransport({
    host: 'smtp.titan.email',
    port: 465,
    secure: true,
    auth: {
      type: 'login',
      user: process.env.TITAN_USER || 'info@kyzerrobotics.com',
      pass: process.env.TITAN_PASS,
    },
    tls: { rejectUnauthorized: false },
  });
}

export async function POST(req: NextRequest) {
  const rl = await rateLimit(`email-otp:${getIp(req)}`, 5, 60_000);
  if (!rl.ok) return tooManyRequests(rl.retryAfterSecs);

  const { email } = await req.json().catch(() => ({}));
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'Invalid email address.' }, { status: 400 });
  }

  const otp = generateOtp();
  const iat = Date.now();
  const session = signSession(email.toLowerCase(), otp, iat);

  try {
    const transporter = getTitanTransport();
    const info = await transporter.sendMail({
      from: `Kyzer Robotics <info@kyzerrobotics.com>`,
      to: email,
      subject: `Your Kyzer Robotics login code: ${otp}`,
      html: `
        <div style="font-family:'DM Sans',Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#f8f8f6;border-radius:12px;">
          <div style="text-align:center;margin-bottom:28px;">
            <span style="font-family:Arial,sans-serif;font-size:26px;font-weight:900;color:#FF8C35;letter-spacing:0.06em;">KYZER</span>
            <span style="font-size:10px;font-weight:600;letter-spacing:0.2em;color:#555;vertical-align:middle;margin-left:6px;">ROBOTICS</span>
          </div>
          <div style="background:#fff;border-radius:10px;border:1px solid rgba(0,0,0,0.08);padding:28px 24px;text-align:center;">
            <p style="font-size:15px;color:#444;margin:0 0 20px;">Your login code is:</p>
            <div style="font-family:'Courier New',monospace;font-size:40px;font-weight:700;color:#111;letter-spacing:10px;margin-bottom:20px;">${otp}</div>
            <p style="font-size:13px;color:#888;margin:0;">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
          </div>
          <p style="font-size:12px;color:#aaa;text-align:center;margin-top:20px;">If you did not request this, ignore this email.</p>
        </div>
      `,
    });
    console.log('Titan OTP sent:', info.messageId);
    return NextResponse.json({ ok: true, session });
  } catch (err) {
    console.error('Titan OTP send error:', err);
    return NextResponse.json({ ok: false, error: 'Failed to send email. Please try again.' }, { status: 500 });
  }
}
