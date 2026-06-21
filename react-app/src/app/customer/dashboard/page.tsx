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
    let unsubscribe: (() => void) | undefined;
    auth.authStateReady().then(() => {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user) {
          window.location.href = '/login?redirect=/customer/dashboard';
          return;
        }
        const email = user.email || '';
        setUserEmail(email);
        setUserName(user.displayName || email.split('@')[0] || 'Customer');

        const idToken = await user.getIdToken();
        const res = await fetch('/api/my-orders', {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        const json = await res.json();
        if (json.orders) setOrders(json.orders as Order[]);
        setLoading(false);
      });
    });
    return () => unsubscribe?.();
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
      <div style={{ minHeight: '100vh', background: '#f8f8f6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
        <style>{`
          @keyframes arm-move {
            0%,100% { transform: rotate(-18deg); }
            50% { transform: rotate(8deg); }
          }
          @keyframes box-slide {
            0% { transform: translateX(0px); opacity:1; }
            70% { transform: translateX(54px); opacity:1; }
            85%,100% { transform: translateX(64px); opacity:0; }
          }
          @keyframes belt-move {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -20; }
          }
          @keyframes spark {
            0%,100% { opacity:0; transform: scale(0.5); }
            50% { opacity:1; transform: scale(1); }
          }
          @keyframes label-blink {
            0%,100% { opacity:0.3; }
            50% { opacity:1; }
          }
          @keyframes float-up {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
            100% { transform: translateY(0px); }
          }
          .robot-float { animation: float-up 2.4s ease-in-out infinite; }
          .robot-arm { transform-origin: 12px 4px; animation: arm-move 1.1s ease-in-out infinite; }
          .conveyor-dash { animation: belt-move 0.5s linear infinite; }
          .box-anim { animation: box-slide 1.6s ease-in-out infinite; }
          .spark1 { animation: spark 1.1s 0.1s ease-in-out infinite; }
          .spark2 { animation: spark 1.1s 0.4s ease-in-out infinite; }
          .label-anim { animation: label-blink 1.1s ease-in-out infinite; }
          .dot1 { animation: spark 1.2s 0s ease-in-out infinite; }
          .dot2 { animation: spark 1.2s 0.4s ease-in-out infinite; }
          .dot3 { animation: spark 1.2s 0.8s ease-in-out infinite; }
        `}</style>

        <div className="robot-float">
          <svg width="220" height="180" viewBox="0 0 220 180" fill="none" xmlns="http://www.w3.org/2000/svg">

            {/* conveyor belt */}
            <rect x="30" y="132" width="160" height="14" rx="7" fill="#d4d0c8"/>
            <line x1="30" y1="139" x2="190" y2="139" stroke="#bbb" strokeWidth="2" strokeDasharray="10 10" className="conveyor-dash"/>
            <circle cx="37" cy="139" r="7" fill="#b0aca0"/>
            <circle cx="183" cy="139" r="7" fill="#b0aca0"/>

            {/* box on belt */}
            <g className="box-anim">
              <rect x="58" y="112" width="32" height="20" rx="3" fill="#FF8C35"/>
              <rect x="58" y="112" width="32" height="7" rx="3" fill="#e07020"/>
              {/* tape */}
              <rect x="72" y="112" width="4" height="20" fill="rgba(255,255,255,0.35)"/>
              <rect x="58" y="119" width="32" height="3" fill="rgba(255,255,255,0.25)"/>
              {/* label */}
              <rect x="62" y="122" width="18" height="7" rx="1" fill="white" opacity="0.9" className="label-anim"/>
              <line x1="64" y1="125" x2="78" y2="125" stroke="#aaa" strokeWidth="1"/>
              <line x1="64" y1="127" x2="75" y2="127" stroke="#aaa" strokeWidth="1"/>
            </g>

            {/* robot body */}
            <rect x="88" y="52" width="52" height="58" rx="10" fill="#2d2d2d"/>
            <rect x="92" y="56" width="44" height="50" rx="8" fill="#3a3a3a"/>

            {/* robot screen */}
            <rect x="97" y="62" width="34" height="22" rx="4" fill="#0a0a0a"/>
            <rect x="99" y="64" width="30" height="18" rx="3" fill="#001a0a"/>
            {/* screen glow lines */}
            <line x1="101" y1="68" x2="127" y2="68" stroke="#2ecc71" strokeWidth="1.5" opacity="0.9"/>
            <line x1="101" y1="72" x2="122" y2="72" stroke="#2ecc71" strokeWidth="1.5" opacity="0.7"/>
            <line x1="101" y1="76" x2="119" y2="76" stroke="#2ecc71" strokeWidth="1" opacity="0.5"/>

            {/* robot eyes / indicator */}
            <circle cx="104" cy="90" r="4" fill="#FF8C35"/>
            <circle cx="124" cy="90" r="4" fill="#FF8C35"/>
            <circle cx="104" cy="90" r="2" fill="#fff" opacity="0.6"/>
            <circle cx="124" cy="90" r="2" fill="#fff" opacity="0.6"/>

            {/* robot head */}
            <rect x="94" y="34" width="40" height="22" rx="8" fill="#2d2d2d"/>
            <rect x="98" y="37" width="32" height="16" rx="6" fill="#3a3a3a"/>
            {/* antenna */}
            <line x1="114" y1="34" x2="114" y2="24" stroke="#555" strokeWidth="2"/>
            <circle cx="114" cy="22" r="3" fill="#FF8C35" className="spark1"/>

            {/* robot arm (printing arm) */}
            <g className="robot-arm" style={{transformOrigin:'88px 80px'}}>
              <rect x="66" y="76" width="24" height="8" rx="4" fill="#444"/>
              <rect x="56" y="80" width="14" height="6" rx="3" fill="#555"/>
              {/* print head */}
              <rect x="46" y="83" width="12" height="8" rx="2" fill="#FF8C35"/>
              <circle cx="52" cy="91" r="2" fill="#fff" opacity="0.8" className="spark2"/>
            </g>

            {/* right arm */}
            <rect x="140" y="76" width="20" height="8" rx="4" fill="#444"/>
            <rect x="158" y="79" width="10" height="5" rx="2" fill="#555"/>

            {/* legs */}
            <rect x="100" y="108" width="10" height="18" rx="4" fill="#2d2d2d"/>
            <rect x="118" y="108" width="10" height="18" rx="4" fill="#2d2d2d"/>
            <rect x="97" y="122" width="16" height="6" rx="3" fill="#222"/>
            <rect x="115" y="122" width="16" height="6" rx="3" fill="#222"/>

            {/* spark effects near print head */}
            <circle cx="48" cy="86" r="2" fill="#FFD700" className="spark1"/>
            <circle cx="56" cy="84" r="1.5" fill="#FFD700" className="spark2"/>
          </svg>
        </div>

        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: '#555', marginTop: 8, letterSpacing: '0.02em' }}>
          Fetching your orders
          <span className="dot1" style={{ display:'inline-block', marginLeft:2 }}>.</span>
          <span className="dot2" style={{ display:'inline-block' }}>.</span>
          <span className="dot3" style={{ display:'inline-block' }}>.</span>
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

