'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const FONT_URL = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap';

interface OrderItem { name: string; qty: number; price: number; emoji?: string }
interface Order {
  id: string;
  status: string;
  submitted_at: string;
  data: {
    name?: string;
    email?: string;
    total?: number;
    items?: OrderItem[];
    paymentStatus?: string;
    paymentMethod?: string;
    shippingFull?: string;
    type?: string;
  };
}

const STATUS_COLOR: Record<string, string> = {
  paid: '#27ae60', confirmed: '#27ae60', processing: '#FF8C35',
  shipped: '#2980b9', delivered: '#27ae60', cancelled: '#e74c3c',
  pending: '#888', cod: '#FF8C35',
};
const STATUS_LABEL: Record<string, string> = {
  paid: 'Paid', confirmed: 'Confirmed', processing: 'Processing',
  shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled',
  pending: 'Pending', cod: 'COD - Pending',
};

function fmt(n: number) { return '₹' + Number(n || 0).toLocaleString('en-IN'); }
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('kyzer_auth_token');
    if (!token) { setLoading(false); return; }
    setIsLoggedIn(true);
    fetch('/api/my-orders', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        if (d.orders) setOrders(d.orders);
        else setError(d.error || 'Failed to load orders');
      })
      .catch(() => setError('Could not connect. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <link href={FONT_URL} rel="stylesheet" />
      <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: "'DM Sans', sans-serif" }}>
        {/* Header */}
        <div style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#FF8C35', textDecoration: 'none', letterSpacing: '0.04em' }}>KYZER <span style={{ fontSize: 10, fontWeight: 600, color: '#111', letterSpacing: '0.18em' }}>ROBOTICS</span></Link>
          <span style={{ color: '#ddd' }}>|</span>
          <span style={{ fontSize: 14, color: '#555', fontWeight: 500 }}>My Orders</span>
          <Link href="/" style={{ marginLeft: 'auto', fontSize: 13, color: '#888', textDecoration: 'none' }}>← Back to Home</Link>
        </div>

        <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 16px' }}>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: '#111', marginBottom: 8, letterSpacing: '0.04em' }}>Your Orders</h1>

          {!isLoggedIn && !loading && (
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #eee', padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#111', marginBottom: 8 }}>Login to view your orders</h2>
              <p style={{ fontSize: 14, color: '#666', marginBottom: 20 }}>You need to be logged in to see your order history.</p>
              <Link href="/login?redirect=/my-orders" style={{ display: 'inline-block', background: '#FF8C35', color: '#fff', padding: '11px 28px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>Login / Sign Up</Link>
            </div>
          )}

          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ background: '#fff', borderRadius: 12, border: '1px solid #eee', padding: 20, height: 90, animation: 'pulse 1.5s infinite' }} />
              ))}
              <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
            </div>
          )}

          {error && (
            <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 10, padding: 16, color: '#856404', fontSize: 14 }}>{error}</div>
          )}

          {!loading && isLoggedIn && orders.length === 0 && !error && (
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #eee', padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#111', marginBottom: 8 }}>No orders yet</h2>
              <p style={{ fontSize: 14, color: '#666', marginBottom: 20 }}>Start shopping to see your orders here.</p>
              <Link href="/shop" style={{ display: 'inline-block', background: '#FF8C35', color: '#fff', padding: '11px 28px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>Browse Products</Link>
            </div>
          )}

          {orders.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {orders.map(order => {
                const d = order.data || {};
                const status = order.status || 'pending';
                const color = STATUS_COLOR[status] || '#888';
                const isOpen = expanded === order.id;
                const items: OrderItem[] = d.items || [];
                const total = d.total || items.reduce((s, i) => s + (Number(i.price)||0) * (Number(i.qty)||1), 0);

                return (
                  <div key={order.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #eee', overflow: 'hidden' }}>
                    {/* Order header */}
                    <div
                      onClick={() => setExpanded(isOpen ? null : order.id)}
                      style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>#{order.id?.slice(-8) || '—'}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: color, background: color + '18', borderRadius: 20, padding: '2px 10px' }}>{STATUS_LABEL[status] || status}</span>
                          {d.paymentMethod && <span style={{ fontSize: 11, color: '#888', background: '#f5f5f5', borderRadius: 20, padding: '2px 8px' }}>{d.paymentMethod}</span>}
                        </div>
                        <div style={{ fontSize: 12, color: '#888' }}>
                          {fmtDate(order.submitted_at)} · {items.length} item{items.length !== 1 ? 's' : ''}
                          {d.shippingFull && ` · ${d.shippingFull.split(',')[0]}`}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: '#FF8C35' }}>{fmt(total)}</span>
                        <span style={{ fontSize: 18, color: '#bbb', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
                      </div>
                    </div>

                    {/* Order detail */}
                    {isOpen && (
                      <div style={{ borderTop: '1px solid #f0f0f0', padding: '16px 20px' }}>
                        {/* Items */}
                        <div style={{ marginBottom: 16 }}>
                          {items.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < items.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                              <div style={{ width: 36, height: 36, background: '#f2f0eb', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{item.emoji || '📦'}</div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                                <div style={{ fontSize: 12, color: '#888' }}>Qty: {item.qty || 1}</div>
                              </div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: '#111', flexShrink: 0 }}>{fmt((Number(item.price)||0) * (Number(item.qty)||1))}</div>
                            </div>
                          ))}
                        </div>

                        {/* Summary */}
                        <div style={{ background: '#f8f8f6', borderRadius: 8, padding: '12px 16px', fontSize: 13, display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {d.shippingFull && <div style={{ color: '#555' }}><strong>Ship to:</strong> {d.shippingFull}</div>}
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 15, color: '#111', borderTop: '1px solid #eee', paddingTop: 8, marginTop: 2 }}>
                            <span>Total</span><span style={{ color: '#FF8C35' }}>{fmt(total)}</span>
                          </div>
                        </div>

                        {/* Status info */}
                        <div style={{ marginTop: 12, fontSize: 12, color: '#888', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                          <span>Need help?</span>
                          <a href="https://wa.me/919049695264" target="_blank" rel="noreferrer" style={{ color: '#FF8C35', textDecoration: 'none', fontWeight: 600 }}>WhatsApp us</a>
                          <span>·</span>
                          <a href="mailto:info@kyzerrobotics.com" style={{ color: '#FF8C35', textDecoration: 'none', fontWeight: 600 }}>info@kyzerrobotics.com</a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
