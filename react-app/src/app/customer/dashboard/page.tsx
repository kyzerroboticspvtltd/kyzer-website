'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const FONT_URL =
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';

interface OrderItem {
  id: string;
  name: string;
  price: string | number;
  qty: number;
  emoji?: string;
}

interface OrderData {
  email?: string;
  name?: string;
  items?: OrderItem[];
  total?: number;
  paymentMethod?: string;
  address?: string;
  orderId?: string;
}

interface Order {
  id: string;
  status: string;
  data: OrderData;
  submitted_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  new:        { label: 'New',        color: '#FF8C35', bg: '#fff7f2' },
  processing: { label: 'Processing', color: '#2980b9', bg: '#ebf5fb' },
  shipped:    { label: 'Shipped',    color: '#8e44ad', bg: '#f5eef8' },
  completed:  { label: 'Completed',  color: '#27ae60', bg: '#eafaf1' },
  cancelled:  { label: 'Cancelled',  color: '#e74c3c', bg: '#fdf3f2' },
};

function parsePrice(p: string | number): number {
  if (!p) return 0;
  return parseFloat(String(p).replace(/[^0-9.]/g, '')) || 0;
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = '/login?redirect=/customer/dashboard';
        return;
      }
      const email = user.email || '';
      setUserEmail(email);
      setUserName(user.displayName || email.split('@')[0] || 'Customer');

      const res = await fetch(`/api/my-orders?email=${encodeURIComponent(email)}`);
      const json = await res.json();
      if (json.orders) setOrders(json.orders as Order[]);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  function formatDate(iso: string) {
    try {
      return new Date(iso).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
      });
    } catch { return iso; }
  }

  function itemsSummary(items?: OrderItem[]) {
    if (!items || items.length === 0) return 'No items';
    if (items.length === 1) return items[0].name;
    return `${items[0].name} + ${items.length - 1} more`;
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f8f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#666', fontFamily: "'DM Sans', sans-serif" }}>Loading orders…</span>
      </div>
    );
  }

  return (
    <>
      <link href={FONT_URL} rel="stylesheet" />
      <div style={{ minHeight: '100vh', background: '#f8f8f6', fontFamily: "'DM Sans', sans-serif" }}>
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 60, borderBottom: '0.5px solid rgba(0,0,0,0.09)', background: '#f8f8f6' }}>
          <a href="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#FF8C35', textDecoration: 'none', letterSpacing: '0.03em' }}>
            KYZER <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.2em', verticalAlign: 'middle', color: '#111' }}>ROBOTICS</span>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <a href="/profile" style={{ fontSize: 13, color: '#666', textDecoration: 'none' }}>My Profile</a>
            <a href="/" style={{ fontSize: 13, color: '#666', textDecoration: 'none' }}>← Back to home</a>
          </div>
        </nav>

        <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 16px' }}>
          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: '#111', letterSpacing: '0.04em', marginBottom: 4 }}>My Orders</h1>
            <p style={{ fontSize: 14, color: '#666' }}>Hi, {userName}! Here are all your orders.</p>
          </div>

          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: 12, border: '1px solid rgba(0,0,0,0.09)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#111', marginBottom: 8 }}>No orders yet</h2>
              <p style={{ fontSize: 14, color: '#666', marginBottom: 24 }}>Start shopping and your orders will appear here.</p>
              <a
                href="/"
                style={{ display: 'inline-block', background: '#FF8C35', color: '#fff', padding: '11px 28px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}
              >
                Shop Now
              </a>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {orders.map(order => {
                const status = STATUS_CONFIG[order.status] || { label: order.status, color: '#666', bg: '#f5f5f5' };
                const data = order.data as OrderData;
                const total = data.total || 0;
                return (
                  <div key={order.id} style={{ background: '#fff', borderRadius: 10, border: '1px solid rgba(0,0,0,0.09)', padding: '18px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, color: '#111' }}>
                            {data.orderId || order.id}
                          </span>
                          <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 9px', borderRadius: 12, color: status.color, background: status.bg }}>
                            {status.label}
                          </span>
                        </div>
                        <div style={{ fontSize: 13, color: '#555', marginBottom: 3 }}>{itemsSummary(data.items)}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>{formatDate(order.submitted_at)}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: '#111' }}>₹{parsePrice(total).toLocaleString('en-IN')}</div>
                        {data.paymentMethod && (
                          <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
                            {data.paymentMethod === 'cod' ? '📦 COD' : '💳 Online'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ marginTop: 28, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <a href="/" style={{ fontSize: 13, color: '#666', textDecoration: 'none' }}>← Back to home</a>
            <a href="/" style={{ display: 'inline-block', background: '#FF8C35', color: '#fff', padding: '9px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 13 }}>
              Shop Now
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
