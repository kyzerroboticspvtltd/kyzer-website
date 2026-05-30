require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Razorpay = require('razorpay');

// ── Twilio SMS (optional — only loaded if credentials are set) ──
function sendSMS(to, body) {
  const sid   = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from  = process.env.TWILIO_FROM;
  if (!sid || !token || !from) return Promise.resolve();
  try {
    const twilio = require('twilio')(sid, token);
    const phone  = to.startsWith('+') ? to : '+91' + to.replace(/\D/g, '').slice(-10);
    return twilio.messages.create({ from, to: phone, body });
  } catch (e) {
    console.error('SMS error:', e.message);
    return Promise.resolve();
  }
}

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
    'https://kyzerrobotics.com',
    'https://www.kyzerrobotics.com',
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
          <p style="font-size:13px;color:#888;">Questions? Reply to this email or WhatsApp us at <a href="https://wa.me/919049695264">+91 90496 95264</a></p>
          <p style="font-size:13px;color:#888;">Kyzer Robotics Pvt. Ltd. · Pune, Maharashtra</p>
        </div>`,
    });
    res.json({ ok: true, message: 'Quote request sent successfully.' });
  } catch (err) {
    console.error('Quote mail error:', err.message);
    res.status(500).json({ ok: false, error: 'Failed to send email. Please try again.' });
  }
});

// ── RAZORPAY ──
function getRazorpay() {
  const keyId     = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

// POST /api/create-razorpay-order
app.post('/api/create-razorpay-order', formLimiter, async (req, res) => {
  const rzp = getRazorpay();
  if (!rzp) {
    return res.status(503).json({ ok: false, error: 'Payment gateway not configured on server.' });
  }

  const { amount, currency = 'INR', receipt, notes } = req.body;
  if (!amount || isNaN(amount) || amount < 1) {
    return res.status(400).json({ ok: false, error: 'Invalid amount.' });
  }

  try {
    const order = await rzp.orders.create({
      amount: Math.round(Number(amount) * 100), // paise
      currency,
      receipt: receipt || ('SHOP-' + Date.now()),
      notes: notes || {},
    });
    res.json({ ok: true, order });
  } catch (err) {
    console.error('Razorpay create order error:', err.message);
    res.status(500).json({ ok: false, error: 'Failed to create payment order.' });
  }
});

// POST /api/verify-payment
app.post('/api/verify-payment', formLimiter, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ ok: false, error: 'Missing payment fields.' });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return res.status(503).json({ ok: false, error: 'Payment gateway not configured.' });
  }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (expected !== razorpay_signature) {
    return res.status(400).json({ ok: false, error: 'Payment verification failed.' });
  }

  // Send order confirmation email if orderData provided
  if (orderData && orderData.email) {
    const o = orderData;
    const itemRows = (o.items || []).map(i =>
      `<tr><td style="padding:8px;">${i.name}</td><td style="padding:8px;text-align:center;">×${i.qty}</td><td style="padding:8px;text-align:right;">₹${(Number(i.price||0)*i.qty).toLocaleString('en-IN')}</td></tr>`
    ).join('');

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;">
        <h2 style="color:#FF8C35;">New Shop Order — Kyzer Robotics</h2>
        <p><strong>Order ID:</strong> ${o.id || '—'} &nbsp;|&nbsp; <strong>Payment:</strong> ${razorpay_payment_id}</p>
        <table style="width:100%;border-collapse:collapse;margin-top:12px;">
          <tr style="background:#f4f4f4;"><td style="padding:8px;color:#888;width:130px;">Customer</td><td style="padding:8px;font-weight:500;">${o.name}</td></tr>
          <tr><td style="padding:8px;color:#888;">Email</td><td style="padding:8px;"><a href="mailto:${o.email}">${o.email}</a></td></tr>
          <tr style="background:#f4f4f4;"><td style="padding:8px;color:#888;">Phone</td><td style="padding:8px;">${o.phone || '—'}</td></tr>
          <tr><td style="padding:8px;color:#888;">Ship to</td><td style="padding:8px;">${o.shippingFull || '—'}</td></tr>
        </table>
        <h3 style="margin:20px 0 8px;">Items</h3>
        <table style="width:100%;border-collapse:collapse;font-size:13px;">
          <tr style="background:#f4f4f4;font-weight:600;"><td style="padding:8px;">Product</td><td style="padding:8px;text-align:center;">Qty</td><td style="padding:8px;text-align:right;">Subtotal</td></tr>
          ${itemRows}
          <tr style="border-top:2px solid #eee;font-weight:700;font-size:15px;color:#FF8C35;">
            <td colspan="2" style="padding:10px;">Total</td>
            <td style="padding:10px;text-align:right;">₹${Number(o.total||0).toLocaleString('en-IN')}</td>
          </tr>
        </table>
        ${o.notes ? `<p style="margin-top:14px;font-size:13px;color:#555;"><strong>Notes:</strong> ${o.notes}</p>` : ''}
        <p style="font-size:12px;color:#aaa;margin-top:20px;">Submitted from kyzerrobotics.com checkout</p>
      </div>`;

    try {
      await sendMail({
        to: process.env.NOTIFY_EMAIL || process.env.GMAIL_USER,
        subject: `[Kyzer] New Order ${o.id || ''} — ₹${Number(o.total||0).toLocaleString('en-IN')} — ${o.name}`,
        html,
      });
      // Customer confirmation email
      await sendMail({
        to: o.email,
        subject: `Order confirmed — Kyzer Robotics`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:20px;">
            <div style="background:#FF8C35;padding:24px 28px;border-radius:12px 12px 0 0;">
              <h2 style="color:#111;margin:0;font-family:sans-serif;">Order Confirmed ✓</h2>
            </div>
            <div style="background:#fff;border:1px solid #eee;border-top:none;padding:24px 28px;border-radius:0 0 12px 12px;">
              <p style="font-size:15px;">Hi <strong>${o.name}</strong>, thanks for your order!</p>
              <p style="color:#555;">Your payment was received and we will process your order shortly.</p>
              <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:13px;">
                ${(o.items||[]).map(i=>`<tr><td style="padding:6px 0;border-bottom:1px solid #f0f0f0;">${i.name} ×${i.qty}</td><td style="padding:6px 0;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:600;">₹${(Number(i.price||0)*i.qty).toLocaleString('en-IN')}</td></tr>`).join('')}
                <tr><td style="padding:10px 0;font-weight:700;font-size:15px;">Total</td><td style="padding:10px 0;font-weight:700;font-size:15px;text-align:right;color:#FF8C35;">₹${Number(o.total||0).toLocaleString('en-IN')}</td></tr>
              </table>
              <p style="font-size:13px;color:#888;margin-top:6px;"><strong>Order ID:</strong> ${o.id || '—'} &nbsp;|&nbsp; <strong>Payment:</strong> ${razorpay_payment_id}</p>
              <p style="font-size:13px;color:#888;"><strong>Ship to:</strong> ${o.shippingFull || '—'}</p>
              <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
              <p style="font-size:12px;color:#aaa;">Questions? WhatsApp us at +91 90496 95264 or reply to this email.</p>
              <p style="font-size:12px;color:#aaa;">Kyzer Robotics Pvt. Ltd. · Pune, Maharashtra</p>
            </div>
          </div>`,
      });
    } catch (mailErr) {
      console.error('Order confirmation mail error:', mailErr.message);
    }

    // SMS notifications (fires and forgets — does not block the response)
    if (o.phone) {
      const itemSummary = (o.items||[]).map(i => `${i.name} x${i.qty}`).join(', ');
      sendSMS(o.phone,
        `Hi ${o.name}! Your Kyzer Robotics order ${o.id||''} is confirmed. ` +
        `Items: ${itemSummary}. Total: Rs.${Number(o.total||0).toLocaleString('en-IN')}. ` +
        `We will reach out soon. -Kyzer Robotics`
      ).catch(e => console.error('Customer SMS failed:', e.message));
    }
    sendSMS(process.env.NOTIFY_PHONE || '',
      `[Kyzer Order] ${o.id||''} - ${o.name} - Rs.${Number(o.total||0).toLocaleString('en-IN')} - ${o.phone||''}`
    ).catch(e => console.error('Owner SMS failed:', e.message));
  }

  res.json({ ok: true, message: 'Payment verified successfully.' });
});

// POST /api/order-notify — offline/COD order email + SMS notification
app.post('/api/order-notify', formLimiter, async (req, res) => {
  const o = req.body.orderData;
  if (!o || !o.email) return res.status(400).json({ ok: false, error: 'Missing order data.' });

  const itemRows = (o.items || []).map(i =>
    `<tr><td style="padding:8px;">${i.name}</td><td style="padding:8px;text-align:center;">×${i.qty}</td><td style="padding:8px;text-align:right;">₹${(Number(String(i.price||'').replace(/[^0-9.]/g,''))||0*i.qty).toLocaleString('en-IN')}</td></tr>`
  ).join('');

  try {
    await sendMail({
      to: process.env.NOTIFY_EMAIL || process.env.GMAIL_USER,
      subject: `[Kyzer] New Order ${o.id || ''} — ${o.name}`,
      html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;">
        <h2 style="color:#FF8C35;">New Shop Order — Kyzer Robotics</h2>
        <p><strong>Order ID:</strong> ${o.id || '—'}</p>
        <table style="width:100%;border-collapse:collapse;margin-top:12px;">
          <tr style="background:#f4f4f4;"><td style="padding:8px;color:#888;width:130px;">Customer</td><td style="padding:8px;font-weight:500;">${o.name}</td></tr>
          <tr><td style="padding:8px;color:#888;">Email</td><td style="padding:8px;"><a href="mailto:${o.email}">${o.email}</a></td></tr>
          <tr style="background:#f4f4f4;"><td style="padding:8px;color:#888;">Phone</td><td style="padding:8px;">${o.phone || '—'}</td></tr>
          <tr><td style="padding:8px;color:#888;">Ship to</td><td style="padding:8px;">${o.shippingFull || '—'}</td></tr>
        </table>
        <table style="width:100%;border-collapse:collapse;font-size:13px;margin-top:16px;">
          <tr style="background:#f4f4f4;font-weight:600;"><td style="padding:8px;">Product</td><td style="padding:8px;text-align:center;">Qty</td><td style="padding:8px;text-align:right;">Subtotal</td></tr>
          ${itemRows}
        </table>
        <p style="font-size:12px;color:#aaa;margin-top:20px;">Submitted from kyzerrobotics.com checkout</p>
      </div>`,
    });
    await sendMail({
      to: o.email,
      subject: 'Order received — Kyzer Robotics',
      html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:20px;">
        <div style="background:#FF8C35;padding:24px 28px;border-radius:12px 12px 0 0;">
          <h2 style="color:#111;margin:0;">Order Received ✓</h2>
        </div>
        <div style="background:#fff;border:1px solid #eee;border-top:none;padding:24px 28px;border-radius:0 0 12px 12px;">
          <p style="font-size:15px;">Hi <strong>${o.name}</strong>, we received your order!</p>
          <p style="color:#555;">Our team will confirm pricing and availability shortly.</p>
          <p style="font-size:13px;color:#888;"><strong>Order ID:</strong> ${o.id || '—'}</p>
          <p style="font-size:13px;color:#888;"><strong>Ship to:</strong> ${o.shippingFull || '—'}</p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
          <p style="font-size:12px;color:#aaa;">Questions? WhatsApp us at +91 90496 95264 or reply to this email.</p>
          <p style="font-size:12px;color:#aaa;">Kyzer Robotics Pvt. Ltd. · Pune, Maharashtra</p>
        </div>
      </div>`,
    });
  } catch (err) {
    console.error('Order notify mail error:', err.message);
  }

  if (o.phone) {
    const itemSummary = (o.items || []).map(i => `${i.name} x${i.qty}`).join(', ');
    sendSMS(o.phone,
      `Hi ${o.name}! Your Kyzer Robotics order ${o.id || ''} received. ` +
      `${itemSummary}. We will confirm shortly. -Kyzer Robotics`
    ).catch(e => console.error('Customer SMS failed:', e.message));
  }
  sendSMS(process.env.NOTIFY_PHONE || '',
    `[Kyzer Order] ${o.id || ''} - ${o.name} - ${o.phone || ''} - ${(o.items || []).map(i => i.name).join(', ')}`
  ).catch(e => console.error('Owner SMS failed:', e.message));

  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Kyzer API running on port ${PORT}`));
