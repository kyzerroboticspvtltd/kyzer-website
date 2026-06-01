import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export function sendMail({ to, subject, html }: { to: string; subject: string; html: string }) {
  return transporter.sendMail({
    from: `"Kyzer Robotics Website" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });
}

export const NOTIFY_EMAIL = () => process.env.NOTIFY_EMAIL || process.env.GMAIL_USER || '';
export const NOTIFY_PHONE = () => process.env.NOTIFY_PHONE || '';
