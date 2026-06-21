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
    let done = false;

    // authStateReady() resolves once Firebase has read the persisted session
    // from localStorage — only THEN do we check the user, so we never redirect
    // based on a transient null before the cache is loaded.
    auth.authStateReady().then(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (done) return;
        done = true;
        unsubscribe();

        if (!user) {
          window.location.href = '/login?redirect=/customer/dashboard';
          return;
        }

        const email = user.email || '';
        setUserEmail(email);
        setUserName(user.displayName || email.split('@')[0] || 'Customer');

        try {
          const idToken = await user.getIdToken();
          const res = await fetch('/api/my-orders', {
            headers: { Authorization: `Bearer ${idToken}` },
          });
          if (res.ok) {
            const json = await res.json();
            if (json.orders) setOrders(json.orders as Order[]);
          }
        } catch {
          // orders stay empty — dashboard still renders
        } finally {
          setLoading(false);
        }
      });
    });
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
      <div style={{ minHeight: '100vh', background: '#f9f9f7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <style>{`
          @keyframes kb-float {
            0%,100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          @keyframes kb-blink {
            0%,90%,100% { opacity: 1; }
            95% { opacity: 0; }
          }
          @keyframes kb-arm {
            0%,100% { transform: rotate(0deg); }
            40% { transform: rotate(-22deg); }
            60% { transform: rotate(-22deg); }
          }
          @keyframes kb-belt {
            from { transform: translateX(0); }
            to   { transform: translateX(-24px); }
          }
          @keyframes kb-box {
            0%   { transform: translateX(-10px); opacity: 0; }
            10%  { opacity: 1; }
            75%  { transform: translateX(90px); opacity: 1; }
            90%,100% { transform: translateX(110px); opacity: 0; }
          }
          @keyframes kb-ping {
            0%,100% { r: 3; opacity: 1; }
            50% { r: 5; opacity: 0.4; }
          }
          @keyframes kb-dot {
            0%,80%,100% { opacity: 0.2; transform: scale(0.8); }
            40% { opacity: 1; transform: scale(1); }
          }
          @keyframes kb-scan {
            0% { opacity:0.15; }
            50% { opacity:0.9; }
            100% { opacity:0.15; }
          }
          .kb-wrap    { animation: kb-float 3s ease-in-out infinite; }
          .kb-eye     { animation: kb-blink 4s ease-in-out infinite; }
          .kb-arm     { transform-origin: 78px 104px; animation: kb-arm 1.8s ease-in-out infinite; }
          .kb-belt-strip { animation: kb-belt 0.6s linear infinite; }
          .kb-box     { animation: kb-box 2.4s ease-in-out infinite; }
          .kb-ping    { animation: kb-ping 1.4s ease-in-out infinite; }
          .kb-scan    { animation: kb-scan 1.8s ease-in-out infinite; }
          .kb-d1 { animation: kb-dot 1.4s 0.0s ease-in-out infinite; }
          .kb-d2 { animation: kb-dot 1.4s 0.2s ease-in-out infinite; }
          .kb-d3 { animation: kb-dot 1.4s 0.4s ease-in-out infinite; }
        `}</style>

        <div className="kb-wrap">
          <svg width="260" height="220" viewBox="0 0 260 220" fill="none">

            {/* ── shadow ── */}
            <ellipse cx="130" cy="210" rx="52" ry="6" fill="#e0ddd7" opacity="0.7"/>

            {/* ── conveyor belt ── */}
            <rect x="40" y="168" width="180" height="18" rx="9" fill="#e8e4dc"/>
            {/* moving stripes — clipped */}
            <clipPath id="belt-clip"><rect x="49" y="168" width="162" height="18" rx="9"/></clipPath>
            <g clipPath="url(#belt-clip)">
              <g className="kb-belt-strip">
                {[0,24,48,72,96,120,144,168,192].map(x => (
                  <rect key={x} x={x+49} y="172" width="14" height="10" rx="2" fill="#ddd8ce" opacity="0.8"/>
                ))}
              </g>
            </g>
            <circle cx="49" cy="177" r="9" fill="#d5d0c6"/>
            <circle cx="211" cy="177" r="9" fill="#d5d0c6"/>

            {/* ── package on belt ── */}
            <g className="kb-box">
              {/* box body */}
              <rect x="40" y="143" width="38" height="28" rx="5" fill="#FF8C35"/>
              {/* lid crease */}
              <rect x="40" y="143" width="38" height="9" rx="5" fill="#e07520"/>
              <rect x="40" y="147" width="38" height="5" fill="#e07520"/>
              {/* center tape vertical */}
              <rect x="57" y="143" width="5" height="28" fill="rgba(255,255,255,0.28)" rx="1"/>
              {/* center tape horizontal */}
              <rect x="40" y="154" width="38" height="4" fill="rgba(255,255,255,0.2)" rx="1"/>
              {/* label */}
              <rect x="45" y="157" width="22" height="10" rx="2" fill="white" opacity="0.95"/>
              <rect x="47" y="160" width="14" height="1.5" rx="1" fill="#ccc"/>
              <rect x="47" y="163" width="10" height="1.5" rx="1" fill="#ccc"/>
            </g>

            {/* ── robot body ── */}
            {/* torso */}
            <rect x="86" y="96" width="68" height="72" rx="14" fill="#1e1e1e"/>
            <rect x="90" y="100" width="60" height="64" rx="11" fill="#2a2a2a"/>

            {/* chest panel / screen */}
            <rect x="98" y="108" width="44" height="32" rx="7" fill="#111"/>
            <rect x="100" y="110" width="40" height="28" rx="6" fill="#0d1a0d"/>
            {/* scanning line */}
            <rect x="102" y="120" width="36" height="2" rx="1" fill="#FF8C35" opacity="0.9" className="kb-scan"/>
            {/* green data lines */}
            <rect x="102" y="114" width="28" height="1.5" rx="1" fill="#3ddc84" opacity="0.7"/>
            <rect x="102" y="117" width="20" height="1.5" rx="1" fill="#3ddc84" opacity="0.5"/>
            <rect x="102" y="124" width="32" height="1.5" rx="1" fill="#3ddc84" opacity="0.6"/>
            <rect x="102" y="127" width="18" height="1.5" rx="1" fill="#3ddc84" opacity="0.4"/>
            <rect x="102" y="130" width="24" height="1.5" rx="1" fill="#3ddc84" opacity="0.5"/>

            {/* chest indicator dots */}
            <circle cx="106" cy="147" r="3.5" fill="#FF8C35" opacity="0.9"/>
            <circle cx="116" cy="147" r="3.5" fill="#3ddc84" opacity="0.9"/>
            <circle cx="126" cy="147" r="3.5" fill="#3ddc84" opacity="0.5"/>

            {/* ── head ── */}
            <rect x="92" y="60" width="56" height="40" rx="14" fill="#1e1e1e"/>
            <rect x="96" y="64" width="48" height="32" rx="11" fill="#2a2a2a"/>

            {/* eyes */}
            <rect x="103" y="72" width="14" height="10" rx="5" fill="#111" className="kb-eye"/>
            <rect x="123" y="72" width="14" height="10" rx="5" fill="#111" className="kb-eye"/>
            <rect x="105" y="74" width="10" height="6" rx="3" fill="#FF8C35" className="kb-eye"/>
            <rect x="125" y="74" width="10" height="6" rx="3" fill="#FF8C35" className="kb-eye"/>
            {/* eye shine */}
            <circle cx="108" cy="76" r="1.5" fill="white" opacity="0.7"/>
            <circle cx="128" cy="76" r="1.5" fill="white" opacity="0.7"/>

            {/* mouth — subtle */}
            <rect x="108" y="86" width="24" height="3" rx="1.5" fill="#111"/>
            <rect x="112" y="87" width="16" height="1.5" rx="1" fill="#3ddc84" opacity="0.6"/>

            {/* antenna */}
            <rect x="118" y="48" width="4" height="14" rx="2" fill="#333"/>
            <circle cx="120" cy="46" r="5" fill="#1e1e1e"/>
            <circle cx="120" cy="46" r="3" fill="#FF8C35" className="kb-ping"/>

            {/* ── left arm (moves, holds scanner) ── */}
            <g className="kb-arm">
              <rect x="72" y="100" width="16" height="36" rx="8" fill="#1e1e1e"/>
              <rect x="74" y="102" width="12" height="32" rx="6" fill="#2a2a2a"/>
              {/* scanner tool */}
              <rect x="62" y="130" width="22" height="10" rx="5" fill="#FF8C35"/>
              <rect x="64" y="133" width="18" height="4" rx="2" fill="#e07520"/>
              <rect x="71" y="131" width="2" height="8" rx="1" fill="rgba(255,255,255,0.4)"/>
            </g>

            {/* ── right arm ── */}
            <rect x="152" y="100" width="16" height="28" rx="8" fill="#1e1e1e"/>
            <rect x="154" y="102" width="12" height="24" rx="6" fill="#2a2a2a"/>
            {/* gripper */}
            <rect x="156" y="126" width="6" height="8" rx="3" fill="#333"/>
            <rect x="163" y="126" width="6" height="8" rx="3" fill="#333"/>

            {/* ── legs ── */}
            <rect x="100" y="166" width="18" height="22" rx="8" fill="#1e1e1e"/>
            <rect x="122" y="166" width="18" height="22" rx="8" fill="#1e1e1e"/>
            {/* feet */}
            <rect x="96" y="182" width="26" height="8" rx="5" fill="#161616"/>
            <rect x="118" y="182" width="26" height="8" rx="5" fill="#161616"/>

          </svg>
        </div>

        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#999', marginTop: 4, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>
          Fetching your orders
          <span className="kb-d1" style={{ display:'inline-block', marginLeft: 4 }}>·</span>
          <span className="kb-d2" style={{ display:'inline-block' }}>·</span>
          <span className="kb-d3" style={{ display:'inline-block' }}>·</span>
        </p>
      </div>
    );
  }

  return (
    <>
      <link href={FONT_URL} rel="stylesheet" />
      <div style={{ minHeight: '100vh', background: '#f8f8f6', fontFamily: "'DM Sans', sans-serif" }}>
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 90, borderBottom: '0.5px solid rgba(0,0,0,0.09)', background: '#f8f8f6' }}>
          <a href="/" className="logo-anim" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#FF8C35', textDecoration: 'none', letterSpacing: '0.03em' }}>
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

