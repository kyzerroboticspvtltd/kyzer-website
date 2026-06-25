'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';

const FONT_URL =
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default function OrderConfirmationPage({ params }: PageProps) {
  const { orderId } = use(params);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    try {
      const last = sessionStorage.getItem('kyzer_last_order');
      if (last !== orderId) {
        window.location.href = '/';
        return;
      }
      // Clear so the page can't be revisited by URL
      sessionStorage.removeItem('kyzer_last_order');
      localStorage.removeItem('kyzer_cart');
      sessionStorage.removeItem('kyzer_checkout');
      setAuthorized(true);
    } catch {
      window.location.href = '/';
    }
  }, [orderId]);

  if (!authorized) return null;

  return (
    <>
      <link href={FONT_URL} rel="stylesheet" />
      <div style={{ minHeight: '100vh', background: '#f8f8f6', fontFamily: "'DM Sans', sans-serif" }}>
        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 90, borderBottom: '0.5px solid rgba(0,0,0,0.09)', background: '#f8f8f6' }}>
          <a href="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#FF8C35', textDecoration: 'none', letterSpacing: '0.03em' }}>
            KYZER <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.2em', verticalAlign: 'middle', color: '#111' }}>ROBOTICS</span>
          </a>
        </nav>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 60px)', padding: '40px 16px' }}>
          <div style={{ width: '100%', maxWidth: 520, textAlign: 'center' }}>
            {/* Checkmark */}
            <div style={{ width: 88, height: 88, borderRadius: '50%', background: '#e8f7ee', border: '3px solid #27ae60', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, margin: '0 auto 24px' }}>
              ✅
            </div>

            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, color: '#111', marginBottom: 8, letterSpacing: '0.04em' }}>Order Confirmed!</h1>
            <p style={{ fontSize: 15, color: '#555', marginBottom: 6 }}>We&apos;ve received your order.</p>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 28 }}>You&apos;ll get a confirmation email shortly.</p>

            {/* Order ID */}
            <div style={{ display: 'inline-block', background: '#f2f0eb', borderRadius: 8, padding: '8px 18px', fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: '#555', marginBottom: 32, letterSpacing: '0.02em' }}>
              Order ID: <strong style={{ color: '#111' }}>{orderId}</strong>
            </div>

            {/* Next steps */}
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(0,0,0,0.09)', padding: '24px', marginBottom: 28, textAlign: 'left' }}>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#111', marginBottom: 16, letterSpacing: '0.04em' }}>What Happens Next?</h3>
              {[
                { step: '1', title: 'Check your email', desc: 'A confirmation email with your order details is on its way.' },
                { step: '2', title: 'We process your order', desc: 'Our team typically processes orders within 1-2 business days.' },
                { step: '3', title: 'Track via WhatsApp', desc: 'Get real-time updates and reach us anytime on WhatsApp.' },
              ].map(item => (
                <div key={item.step} style={{ display: 'flex', gap: 14, marginBottom: 14, alignItems: 'flex-start' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#FF8C35', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                    {item.step}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 2 }}>{item.title}</div>
                    <div style={{ fontSize: 13, color: '#666' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="/"
                style={{ padding: '11px 24px', background: '#FF8C35', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}
              >
                Continue Shopping
              </a>
              <a
                href="https://wa.me/919049695264"
                target="_blank"
                rel="noopener noreferrer"
                style={{ padding: '11px 24px', background: '#25D366', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
