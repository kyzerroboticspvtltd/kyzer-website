import { Resend } from 'resend';

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY || 'placeholder');
  return _resend;
}

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
  return getResend().emails.send({
    from: `Kyzer Robotics <${process.env.GMAIL_USER || 'info@kyzerrobotics.com'}>`,
    replyTo: replyTo || NOTIFY_EMAIL() || undefined,
    to,
    subject,
    html,
    attachments: attachments?.map(a => ({
      filename: a.filename,
      content: a.content,
    })),
  });
}

export const NOTIFY_EMAIL = () => process.env.NOTIFY_EMAIL || process.env.GMAIL_USER || '';
export const NOTIFY_PHONE = () => process.env.NOTIFY_PHONE || '';
