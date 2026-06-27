import nodemailer from 'nodemailer';

interface Attachment {
  filename: string;
  content: Buffer;
  contentType: string;
}

function getTransporter() {
  // Prefer Titan business email if configured, fall back to Gmail
  const useTitan = !!(process.env.TITAN_HOST && process.env.TITAN_USER && process.env.TITAN_PASS);
  return nodemailer.createTransport({
    host:   useTitan ? process.env.TITAN_HOST! : 'smtp.gmail.com',
    port:   parseInt(useTitan ? (process.env.TITAN_PORT || '587') : '587'),
    secure: false,
    auth: {
      user: useTitan ? process.env.TITAN_USER! : (process.env.GMAIL_USER || ''),
      pass: useTitan ? process.env.TITAN_PASS! : (process.env.GMAIL_PASS || ''),
    },
  });
}

const FROM_ADDRESS = () => {
  const user = process.env.TITAN_USER || process.env.GMAIL_USER || 'info@kyzerrobotics.com';
  return `Kyzer Robotics <${user}>`;
};

export async function sendMail({
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
  const transporter = getTransporter();
  return transporter.sendMail({
    from:       FROM_ADDRESS(),
    replyTo:    replyTo || NOTIFY_EMAIL() || FROM_ADDRESS(),
    to,
    subject,
    html,
    attachments: attachments?.map(a => ({
      filename:    a.filename,
      content:     a.content,
      contentType: a.contentType,
    })),
  });
}

export const NOTIFY_EMAIL = () => process.env.NOTIFY_EMAIL || process.env.TITAN_USER || process.env.GMAIL_USER || '';
export const NOTIFY_PHONE = () => process.env.NOTIFY_PHONE || '';
