'use client';

import { useState } from 'react';
import Link from 'next/link';
import { courierTrackingUrl } from '@/lib/courierTracking';

const FONT_URL = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap';

const STATUS_LABEL: Record<string, string> = {
  new: 'Order Received', processing: 'Processing', shipped: 'Shipped',
  completed: 'Delivered', cancelled: 'Cancelled', cod: 'Cash on Delivery — Pending',
};
const STEPS = ['new', 'processing', 'shipped', 'completed'];

interface OrderResult {
  id: string;
  status: string;
  submittedAt: string;
  items: { name: string; qty: number; price: number }[];
  total?: number;
  shippingFull?: string;
  trackingNumber?: string;
  courier?: string;
}

function fmt(n: number) { return '₹' + Number(n || 0).toLocaleString('en-IN'); }

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<OrderResult | null>(null);

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setOrder(null);
    if (!orderId.trim() || !email.trim()) { setError('Please enter both your Order ID and email.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/track-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: orderId.trim(), email: email.trim() }),
      });
      const d = await res.json();
      if (!d.ok) { setError(d.error || 'Order not found.'); return; }
      setOrder(d.order);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const stepIndex = order ? STEPS.indexOf(order.status) : -1;
  const trackUrl = order ? courierTrackingUrl(order.courier, order.trackingNumber) : null;

  return (
    <>
      <link href={FONT_URL} rel="stylesheet" />
      <main style={{ minHeight: '100vh', background: '#f8f8f6', fontFamily: "'DM Sans', sans-serif", paddingTop: 110 }}>
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 16px 60px' }}>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: '#111', marginBottom: 8, letterSpacing: '0.04em' }}>Track Your Order</h1>
          <p style={{ fontSize: 14, color: '#666', marginBottom: 28 }}>Enter your Order ID and the email you used at checkout.</p>

          <form onSubmit={handleTrack} style={{ background: '#fff', border: '1px solid #eee', borderRadius: 14, padding: 24, marginBottom: 24 }}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Order ID</label>
              <input value={orderId} onChange={e => setOrderId(e.target.value)} placeholder="SHOP-1234567890" style={{ width: '100%', padding: '11px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif" }} />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" style={{ width: '100%', padding: '11px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif" }} />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '13px', background: loading ? '#ccc' : '#FF8C35', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Searching…' : 'Track Order'}
            </button>
          </form>

          {error && (
            <div style={{ background: '#fff0f0', border: '1px solid #ffc5c5', borderRadius: 10, padding: '14px 16px', fontSize: 14, color: '#c0392b', marginBottom: 24 }}>{error}</div>
          )}

          {order && (
            <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 14, padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <div>
                  <div style={{ fontSize: 12, color: '#888' }}>Order</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#111', fontFamily: 'monospace' }}>{order.id}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#FF8C35' }}>{STATUS_LABEL[order.status] || order.status}</div>
              </div>

              {stepIndex >= 0 && (
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 22 }}>
                  {STEPS.map((s, i) => (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : undefined }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: i <= stepIndex ? '#FF8C35' : '#eee', color: i <= stepIndex ? '#fff' : '#999', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {i < stepIndex ? '✓' : i + 1}
                      </div>
                      {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: i < stepIndex ? '#FF8C35' : '#eee' }} />}
                    </div>
                  ))}
                </div>
              )}

              {order.trackingNumber && (
                <div style={{ background: '#f8f8f6', borderRadius: 10, padding: '14px 16px', marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{order.courier || 'Courier'} tracking number</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111', fontFamily: 'monospace', marginBottom: trackUrl ? 10 : 0 }}>{order.trackingNumber}</div>
                  {trackUrl && (
                    <a href={trackUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-block', fontSize: 13, color: '#FF8C35', fontWeight: 600, textDecoration: 'none' }}>
                      Track on {order.courier} →
                    </a>
                  )}
                </div>
              )}

              {order.shippingFull && (
                <div style={{ fontSize: 13, color: '#555', marginBottom: 14 }}><strong>Ship to:</strong> {order.shippingFull}</div>
              )}

              {order.items?.length > 0 && (
                <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 14 }}>
                  {order.items.map((i, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#444', padding: '4px 0' }}>
                      <span>{i.name} × {i.qty}</span>
                      <span>{fmt(Number(i.price || 0) * Number(i.qty || 1))}</span>
                    </div>
                  ))}
                  {order.total != null && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 14, borderTop: '1px solid #f0f0f0', marginTop: 8, paddingTop: 8 }}>
                      <span>Total</span><span style={{ color: '#FF8C35' }}>{fmt(order.total)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: 24, fontSize: 13, color: '#888', textAlign: 'center' }}>
            Already logged in? <Link href="/my-orders" style={{ color: '#FF8C35', fontWeight: 600, textDecoration: 'none' }}>View all your orders</Link>
          </div>
        </div>
      </main>
    </>
  );
}
