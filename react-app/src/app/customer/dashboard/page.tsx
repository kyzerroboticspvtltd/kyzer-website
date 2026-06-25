'use client';

import { useState, useEffect } from 'react';

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

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  new:        { label: 'New',        color: '#d97706', bg: '#fffbeb', dot: '#f59e0b' },
  processing: { label: 'Processing', color: '#2563eb', bg: '#eff6ff', dot: '#3b82f6' },
  shipped:    { label: 'Shipped',    color: '#7c3aed', bg: '#f5f3ff', dot: '#8b5cf6' },
  completed:  { label: 'Completed',  color: '#16a34a', bg: '#f0fdf4', dot: '#22c55e' },
  cancelled:  { label: 'Cancelled',  color: '#dc2626', bg: '#fef2f2', dot: '#ef4444' },
};

function parsePrice(p: string | number): number {
  if (!p) return 0;
  return parseFloat(String(p).replace(/[^0-9.]/g, '')) || 0;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return iso; }
}

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CONFIG[order.status] || { label: order.status, color: '#666', bg: '#f5f5f5', dot: '#999' };
  const data = order.data;
  const total = data.total || 0;
  const items = data.items || [];

  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      border: '1px solid #f0f0ee',
      overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      transition: 'box-shadow 0.15s',
    }}>
      {/* Card header */}
      <div style={{ padding: '18px 20px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600,
                color: '#555', background: '#f5f5f3', padding: '3px 8px', borderRadius: 6,
              }}>
                {data.orderId || order.id.slice(0, 12)}
              </span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20,
                color: status.color, background: status.bg, letterSpacing: '0.02em',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: status.dot, display: 'inline-block' }} />
                {status.label}
              </span>
            </div>

            {items.length > 0 && (
              <div style={{ fontSize: 14, fontWeight: 500, color: '#111', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {items.length === 1 ? items[0].name : `${items[0].name} + ${items.length - 1} more`}
              </div>
            )}
            <div style={{ fontSize: 12, color: '#aaa' }}>{formatDate(order.submitted_at)}</div>
          </div>

          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>
              ₹{parsePrice(total).toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: 11, color: '#bbb', marginTop: 2 }}>
              {data.paymentMethod === 'cod' ? 'Cash on delivery' : 'Paid online'}
            </div>
          </div>
        </div>

        {/* Expand toggle */}
        {items.length > 0 && (
          <button
            onClick={() => setExpanded(e => !e)}
            style={{
              marginTop: 10, background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, color: '#FF8C35', fontWeight: 600, padding: 0,
              display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {expanded ? 'Hide items' : `View ${items.length} item${items.length > 1 ? 's' : ''}`}
            <span style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)', display: 'inline-block', transition: 'transform 0.2s', fontSize: 10 }}>▼</span>
          </button>
        )}
      </div>

      {/* Expanded items */}
      {expanded && items.length > 0 && (
        <div style={{ borderTop: '1px solid #f5f5f3', padding: '12px 20px', background: '#fafaf8' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {item.emoji && <span style={{ fontSize: 18 }}>{item.emoji}</span>}
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#222' }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: '#aaa' }}>Qty: {item.qty}</div>
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#444' }}>
                  ₹{(parsePrice(item.price) * item.qty).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
          {data.address && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #efefed', fontSize: 12, color: '#888' }}>
              <span style={{ fontWeight: 600, color: '#555' }}>Deliver to: </span>{data.address}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('kyzer_auth_token');
    const raw = localStorage.getItem('kyzer_current_customer');

    if (!token || !raw) {
      window.location.href = '/login?redirect=/customer/dashboard';
      return;
    }

    let customer: { id?: string; name?: string; email?: string } = {};
    try { customer = JSON.parse(raw); } catch { /* ignore */ }

    setUserEmail(customer.email || '');
    setUserName(customer.name || customer.email?.split('@')[0] || 'Customer');

    fetch('/api/my-orders', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : null)
      .then(json => { if (json?.orders) setOrders(json.orders as Order[]); })
      .catch(() => { /* orders stay empty */ })
      .finally(() => setLoading(false));
  }, []);

  function handleSignOut() {
    localStorage.removeItem('kyzer_auth_token');
    localStorage.removeItem('kyzer_current_customer');
    window.location.href = '/';
  }

  const totalSpent = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + parsePrice(o.data.total || 0), 0);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f8f6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <style>{`@keyframes db-pulse{0%,100%{opacity:1}50%{opacity:0.35}} .db-logo{animation:db-pulse 1.4s ease-in-out infinite;}`}</style>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Kyzer Robotics" className="db-logo" style={{ width: 72, height: 'auto' }} />
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#ccc', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}>Loading…</span>
      </div>
    );
  }

  return (
    <>
      <link href={FONT_URL} rel="stylesheet" />
      <style>{`
        @keyframes fade-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .dash-card { animation: fade-up 0.35s ease both; }
        .dash-card:nth-child(1) { animation-delay: 0.05s; }
        .dash-card:nth-child(2) { animation-delay: 0.10s; }
        .dash-card:nth-child(3) { animation-delay: 0.15s; }
        .dash-card:nth-child(4) { animation-delay: 0.20s; }
        .dash-card:nth-child(5) { animation-delay: 0.25s; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#f5f5f2', fontFamily: "'DM Sans', sans-serif" }}>

        {/* Nav */}
        <nav style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', height: 72, borderBottom: '1px solid #ebebea',
          background: '#fff', position: 'sticky', top: 0, zIndex: 10,
        }}>
          <a href="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: '#FF8C35', textDecoration: 'none', letterSpacing: '0.03em' }}>
            KYZER <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', verticalAlign: 'middle', color: '#333' }}>ROBOTICS</span>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <a href="/" style={{ fontSize: 13, color: '#666', textDecoration: 'none', padding: '7px 14px', borderRadius: 8 }}>Shop</a>
            <button
              onClick={handleSignOut}
              style={{ fontSize: 13, color: '#666', background: '#f5f5f3', border: 'none', cursor: 'pointer', padding: '7px 14px', borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
            >
              Sign out
            </button>
          </div>
        </nav>

        <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 16px 64px' }}>

          {/* Profile header */}
          <div style={{
            background: '#fff', borderRadius: 20, border: '1px solid #ebebea',
            padding: '28px 28px 24px', marginBottom: 20,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #FF8C35 0%, #ff6b00 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: '0.02em',
              }}>
                {getInitials(userName)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 2 }}>
                  {userName}
                </div>
                <div style={{ fontSize: 13, color: '#aaa' }}>{userEmail}</div>
              </div>
              <a
                href="/profile"
                style={{
                  fontSize: 13, fontWeight: 600, color: '#FF8C35', textDecoration: 'none',
                  background: '#fff7f2', padding: '8px 16px', borderRadius: 10, border: '1px solid #ffe5d0',
                }}
              >
                Edit profile
              </a>
            </div>

            {/* Stats */}
            {orders.length > 0 && (
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 20,
                paddingTop: 20, borderTop: '1px solid #f5f5f3',
              }}>
                <div style={{ background: '#fafaf8', borderRadius: 12, padding: '14px 16px' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#111', letterSpacing: '-0.03em' }}>{orders.length}</div>
                  <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>Total orders</div>
                </div>
                <div style={{ background: '#fafaf8', borderRadius: 12, padding: '14px 16px' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#111', letterSpacing: '-0.03em' }}>
                    ₹{totalSpent.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>Total spent</div>
                </div>
              </div>
            )}
          </div>

          {/* Orders section */}
          <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: 0 }}>
              {orders.length > 0 ? `${orders.length} Order${orders.length > 1 ? 's' : ''}` : 'Orders'}
            </h2>
            <a href="/shop" style={{ fontSize: 12, color: '#FF8C35', textDecoration: 'none', fontWeight: 600 }}>
              + New order
            </a>
          </div>

          {orders.length === 0 ? (
            <div style={{
              background: '#fff', borderRadius: 20, border: '1px solid #ebebea',
              padding: '64px 32px', textAlign: 'center',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%', background: '#fff7f2',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, margin: '0 auto 16px',
              }}>
                📦
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#111', marginBottom: 6 }}>No orders yet</div>
              <div style={{ fontSize: 13, color: '#aaa', marginBottom: 24, maxWidth: 260, margin: '0 auto 24px' }}>
                Your orders will show up here once you place one.
              </div>
              <a
                href="/shop"
                style={{
                  display: 'inline-block', background: '#FF8C35', color: '#fff',
                  padding: '11px 28px', borderRadius: 10, textDecoration: 'none',
                  fontWeight: 600, fontSize: 14,
                }}
              >
                Browse shop
              </a>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {orders.map((order, i) => (
                <div key={order.id} className="dash-card" style={{ animationDelay: `${i * 0.05}s` }}>
                  <OrderCard order={order} />
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
