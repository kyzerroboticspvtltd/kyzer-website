import nodemailer from 'nodemailer';

interface Attachment {
  filename: string;
  content: Buffer;
  contentType: string;
}

function getTransporter() {
  const titanUser = process.env.TITAN_USER;
  const titanPass = (process.env.TITAN_PASS || '').replace(/^﻿/, '').trim();
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_PASS;

  if (titanUser && titanPass) {
    return nodemailer.createTransport({
      host: 'smtp.titan.email',
      port: 465,
      secure: true,
      auth: { user: titanUser, pass: titanPass },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
    } as Parameters<typeof nodemailer.createTransport>[0]);
  }

  // Gmail fallback — set GMAIL_USER + GMAIL_PASS (app password) in Vercel env
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user: gmailUser || '', pass: gmailPass || '' },
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
