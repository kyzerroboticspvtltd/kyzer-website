import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

interface Attachment {
  filename: string;
  content: Buffer;
  contentType: string;
}

export function sendMail({
  to,
  subject,
  html,
  attachments,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  attachments?: Attachment[];
  replyTo?: string;
}) {
  return transporter.sendMail({
    from: `"Kyzer Robotics" <${process.env.GMAIL_USER}>`,
    // Replies go to the business inbox by default so customer responses are not
    // lost to a send-only Gmail address. Callers can override (e.g. admin
    // notifications can set the customer's address as reply-to).
    replyTo: replyTo || NOTIFY_EMAIL() || undefined,
    to,
    subject,
    html,
    attachments,
  });
}

export const NOTIFY_EMAIL = () => process.env.NOTIFY_EMAIL || process.env.GMAIL_USER || '';
export const NOTIFY_PHONE = () => process.env.NOTIFY_PHONE || '';
