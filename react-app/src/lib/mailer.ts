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
}: {
  to: string;
  subject: string;
  html: string;
  attachments?: Attachment[];
}) {
  return transporter.sendMail({
    from: `"Kyzer Robotics" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
    attachments,
  });
}

export const NOTIFY_EMAIL = () => process.env.NOTIFY_EMAIL || process.env.GMAIL_USER || '';
export const NOTIFY_PHONE = () => process.env.NOTIFY_PHONE || '';
