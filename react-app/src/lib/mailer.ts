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

// Collapse CR/LF and other control characters in header values to prevent
// header injection (e.g. a crafted subject smuggling a "Bcc:" line).
function sanitizeHeader(value: string): string {
  return String(value || '').replace(/[\x00-\x1F\x7F]+/g, ' ').trim();
}

export function sendMail({
  to,
  subject,
  html,
  attachments,
}: {
  to: string;
  subject: string;
  html: string;
  attachments?: Attachment[];
}) {
  return transporter.sendMail({
    from: `"Kyzer Robotics" <${process.env.GMAIL_USER}>`,
    to: sanitizeHeader(to),
    subject: sanitizeHeader(subject),
    html,
    attachments,
  });
}

export const NOTIFY_EMAIL = () => process.env.NOTIFY_EMAIL || process.env.GMAIL_USER || '';
export const NOTIFY_PHONE = () => process.env.NOTIFY_PHONE || '';
