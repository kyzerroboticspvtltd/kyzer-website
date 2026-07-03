import { Resend } from 'resend';

interface Attachment {
  filename: string;
  content: Buffer;
  contentType: string;
}

const FROM_ADDRESS = 'Kyzer Robotics <info@kyzerrobotics.com>';

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
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured');

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject,
    html,
    replyTo: replyTo || NOTIFY_EMAIL() || undefined,
    attachments: attachments?.map(a => ({
      filename: a.filename,
      content: a.content,
    })),
  });

  if (error) throw new Error(error.message);
}

export const NOTIFY_EMAIL = () => process.env.NOTIFY_EMAIL || process.env.TITAN_USER || process.env.GMAIL_USER || '';
export const NOTIFY_PHONE = () => process.env.NOTIFY_PHONE || '';
