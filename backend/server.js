require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Data storage ──
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'site-data.json');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function readData() {
  try {
    if (fs.existsSync(DATA_FILE)) return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) { console.error('Data read error:', e.message); }
  return {};
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ── In-memory sessions (cleared on server restart) ──
const sessions = new Set();

// ── Middleware ──
app.use(express.json({ limit: '50mb' }));
app.use(cors({
  origin: [
    'https://kyzerroboticspvtltd.github.io',
    'https://kyzerrobotics.in',
    'http://localhost',
    'http://127.0.0.1',
    /^file:\/\//,
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiters
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { ok: false, error: 'Too many requests. Please try again later.' },
});
const dataReadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { ok: false, error: 'Too many requests.' },
});
const dataWriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { ok: false, error: 'Too many requests.' },
});

// ── Mailer setup ──
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

function sendMail({ to, subject, html }) {
  return transporter.sendMail({
    from: `"Kyzer Robotics Website" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });
}

// ── Auth middleware ──
function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  const token = auth && auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token || !sessions.has(token)) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }
  next();
}

// ── Health check ──
app.get('/', (req, res) => {
  res.json({ status: 'Kyzer Robotics API running' });
});

// ── POST /api/auth ─ validate admin password, return session token ──
app.post('/api/auth', dataWriteLimiter, (req, res) => {
  const { password } = req.body;
  const adminPass = process.env.ADMIN_PASSWORD;
  if (!adminPass) {
    return res.status(500).json({ ok: false, error: 'ADMIN_PASSWORD not configured on server.' });
  }
  if (password === adminPass) {
    const token = crypto.randomUUID();
    sessions.add(token);
    setTimeout(() => sessions.delete(token), 24 * 60 * 60 * 1000);
    res.json({ ok: true, token });
  } else {
    res.status(401).json({ ok: false, error: 'Invalid password.' });
  }
});

// ── GET /api/data ─ public site data ──
app.get('/api/data', dataReadLimiter, (req, res) => {
  res.json(readData());
});

// ── POST /api/data ─ save site data (admin only) ──
app.post('/api/data', dataWriteLimiter, requireAuth, (req, res) => {
  try {
    writeData(req.body);
    res.json({ ok: true });
  } catch (e) {
    console.error('Data write error:', e.message);
    res.status(500).json({ ok: false, error: 'Failed to save data.' });
  }
});

// ── POST /api/contact ──
app.post('/api/contact', formLimiter, async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: 'Name, email and message are required.' });
  }

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;">
      <h2 style="color:#FF8C35;">New Contact Message — Kyzer Robotics</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px;color:#888;width:120px;">Name</td><td style="padding:8px;font-weight:500;">${name}</td></tr>
        <tr style="background:#f9f9f9;"><td style="padding:8px;color:#888;">Email</td><td style="padding:8px;"><a href="mailto:${email}">${email}</a></td></tr>
        <tr><td style="padding:8px;color:#888;">Phone</td><td style="padding:8px;">${phone || '—'}</td></tr>
        <tr style="background:#f9f9f9;"><td style="padding:8px;color:#888;">Subject</td><td style="padding:8px;">${subject || '—'}</td></tr>
      </table>
      <div style="margin-top:20px;padding:16px;background:#f4f4f4;border-radius:8px;">
        <p style="margin:0;color:#333;">${message.replace(/\n/g, '<br>')}</p>
      </div>
      <p style="margin-top:16px;font-size:12px;color:#aaa;">Submitted from kyzerrobotics.in contact form</p>
    </div>`;

  try {
    await sendMail({
      to: process.env.NOTIFY_EMAIL || process.env.GMAIL_USER,
      subject: `[Kyzer] Contact: ${subject || name}`,
      html,
    });
    await sendMail({
      to: email,
      subject: 'We received your message — Kyzer Robotics',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;">
          <h2 style="color:#FF8C35;">Thanks, ${name}!</h2>
          <p>We received your message and will get back to you within <strong>24 hours</strong>.</p>
          <p style="color:#888;">Your message:<br><em>${message.replace(/\n/g, '<br>')}</em></p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
          <p style="font-size:13px;color:#888;">Kyzer Robotics Pvt. Ltd. · Pune, Maharashtra</p>
        </div>`,
    });
    res.json({ ok: true, message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Contact mail error:', err.message);
    res.status(500).json({ ok: false, error: 'Failed to send email. Please try again.' });
  }
});

// ── POST /api/quote ──
app.post('/api/quote', formLimiter, async (req, res) => {
  const { name, email, phone, company, notes, quoteDetails } = req.body;

  if (!name || !email) {
    return res.status(400).json({ ok: false, error: 'Name and email are required.' });
  }

  const q = quoteDetails || {};
  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;">
      <h2 style="color:#FF8C35;">New 3D Print Quote Request — Kyzer Robotics</h2>
      <h3 style="margin-bottom:8px;">Customer</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px;color:#888;width:120px;">Name</td><td style="padding:8px;font-weight:500;">${name}</td></tr>
        <tr style="background:#f9f9f9;"><td style="padding:8px;color:#888;">Email</td><td style="padding:8px;"><a href="mailto:${email}">${email}</a></td></tr>
        <tr><td style="padding:8px;color:#888;">Phone</td><td style="padding:8px;">${phone || '—'}</td></tr>
        <tr style="background:#f9f9f9;"><td style="padding:8px;color:#888;">Company</td><td style="padding:8px;">${company || '—'}</td></tr>
      </table>
      <h3 style="margin:20px 0 8px;">Quote Details</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px;color:#888;width:140px;">Material</td><td style="padding:8px;">${q.material || '—'}</td></tr>
        <tr style="background:#f9f9f9;"><td style="padding:8px;color:#888;">Quality</td><td style="padding:8px;">${q.quality || '—'}</td></tr>
        <tr><td style="padding:8px;color:#888;">Infill</td><td style="padding:8px;">${q.infill || '—'}</td></tr>
        <tr style="background:#f9f9f9;"><td style="padding:8px;color:#888;">Colour/Finish</td><td style="padding:8px;">${q.colour || '—'}</td></tr>
        <tr><td style="padding:8px;color:#888;">Support</td><td style="padding:8px;">${q.support || '—'}</td></tr>
        <tr style="background:#f9f9f9;"><td style="padding:8px;color:#888;">Quantity</td><td style="padding:8px;">${q.qty || '—'}</td></tr>
        <tr><td style="padding:8px;color:#888;">Delivery</td><td style="padding:8px;">${q.delivery || '—'}</td></tr>
        <tr style="background:#f9f9f9;"><td style="padding:8px;color:#888;">File</td><td style="padding:8px;">${q.fileName || 'No file / manual dims'}</td></tr>
        <tr><td style="padding:8px;color:#888;">Dimensions</td><td style="padding:8px;">${q.dimensions || '—'}</td></tr>
        <tr style="background:#f9f9f9;"><td style="padding:8px;color:#888;font-weight:600;">Est. Total</td><td style="padding:8px;font-weight:600;color:#FF8C35;">${q.total || '—'}</td></tr>
      </table>
      ${notes ? `<div style="margin-top:16px;padding:14px;background:#f4f4f4;border-radius:8px;"><p style="margin:0;color:#555;"><strong>Notes:</strong><br>${notes.replace(/\n/g, '<br>')}</p></div>` : ''}
      <p style="margin-top:16px;font-size:12px;color:#aaa;">Submitted from kyzerrobotics.in 3D quote page</p>
    </div>`;

  try {
    await sendMail({
      to: process.env.NOTIFY_EMAIL || process.env.GMAIL_USER,
      subject: `[Kyzer] 3D Quote: ${name} — ${q.material || ''} ${q.total || ''}`,
      html,
    });
    await sendMail({
      to: email,
      subject: 'Your 3D print quote request — Kyzer Robotics',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;">
          <h2 style="color:#FF8C35;">Thanks, ${name}!</h2>
          <p>We received your 3D print quote request. Our team will review it and confirm the final pricing within <strong>a few hours</strong>.</p>
          <p><strong>Estimated total:</strong> <span style="color:#FF8C35;">${q.total || '—'}</span></p>
          <p style="color:#888;font-size:13px;">Material: ${q.material || '—'} · Quality: ${q.quality || '—'} · Qty: ${q.qty || '—'}</p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
          <p style="font-size:13px;color:#888;">Questions? Reply to this email or call us at <a href="tel:+919876543210">+91 98765 43210</a></p>
          <p style="font-size:13px;color:#888;">Kyzer Robotics Pvt. Ltd. · Pune, Maharashtra</p>
        </div>`,
    });
    res.json({ ok: true, message: 'Quote request sent successfully.' });
  } catch (err) {
    console.error('Quote mail error:', err.message);
    res.status(500).json({ ok: false, error: 'Failed to send email. Please try again.' });
  }
});

app.listen(PORT, () => console.log(`Kyzer API running on port ${PORT}`));
