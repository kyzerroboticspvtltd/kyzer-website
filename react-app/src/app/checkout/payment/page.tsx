'use client';

import { useState, useEffect } from 'react';

const FONT_URL =
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';

interface CartItem {
  id: string;
  name: string;
  price: string | number;
  emoji: string;
  qty: number;
  photo?: string;
}

function parsePrice(p: string | number): number {
  if (!p) return 0;
  return parseFloat(String(p).replace(/[^0-9.]/g, '')) || 0;
}

const STEPS = ['Review', 'Payment', 'Address'];

function StepBar({ current }: { current: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32, flexWrap: 'wrap', gap: '8px' }}>
      {STEPS.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: done ? '#FF8C35' : active ? '#FF8C35' : '#e5e5e5',
                color: done || active ? '#fff' : '#888',
                fontSize: 12, fontWeight: 600, flexShrink: 0,
              }}>
                {done ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? '#111' : done ? '#FF8C35' : '#999' }}>
                {step}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ width: 32, height: 1, background: done ? '#FF8C35' : '#e0e0e0', margin: '0 8px' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

declare global {
  interface Window {
    Cashfree: (opts: { mode: string }) => { checkout(opts: { paymentSessionId: string; redirectTarget: string }): void; create(component: string, opts?: Record<string, unknown>): { mount(selector: string): void } };
  }
}

export default function PaymentPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [method, setMethod] = useState<'online' | 'cod'>('online');
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('kyzer_auth_token');
    const raw = localStorage.getItem('kyzer_current_customer');
    if (!token || !raw) {
      window.location.href = '/login?redirect=/checkout/payment';
      return;
    }
    let customer: { name?: string; email?: string; phone?: string } = {};
    try { customer = JSON.parse(raw); } catch { /* ignore */ }
    setUserName(customer.name || '');
    setUserEmail(customer.email || '');
    setUserPhone(customer.phone || '');
    try {
      const cartRaw = localStorage.getItem('kyzer_cart');
      if (cartRaw) setCart(JSON.parse(cartRaw));
      const checkoutRaw = sessionStorage.getItem('kyzer_checkout');
      if (checkoutRaw) {
        const parsed = JSON.parse(checkoutRaw);
        if (parsed.paymentMethod) setMethod(parsed.paymentMethod);
      }
    } catch { /* ignore */ }
    setMounted(true);
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + parsePrice(item.price) * item.qty, 0);
  const delivery = subtotal >= 999 ? 0 : 99;
  const grandTotal = subtotal + delivery;

  let _cfInstance: ReturnType<Window['Cashfree']> | null = null;

  function initCashfree(mode: string): Promise<ReturnType<Window['Cashfree']>> {
    return new Promise((resolve, reject) => {
      if (_cfInstance) { resolve(_cfInstance); return; }
      if (typeof window.Cashfree !== 'undefined') {
        _cfInstance = window.Cashfree({ mode });
        resolve(_cfInstance);
        return;
      }
      const s = document.createElement('script');
      s.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
      s.onload = () => {
        _cfInstance = window.Cashfree({ mode });
        resolve(_cfInstance);
      };
      s.onerror = () => reject(new Error('Cashfree SDK load failed'));
      document.head.appendChild(s);
    });
  }

  async function handleContinue() {
    setError('');

    if (method === 'cod') {
      try {
        sessionStorage.setItem('kyzer_checkout', JSON.stringify({ paymentMethod: 'cod' }));
      } catch { /* ignore */ }
      window.location.href = '/checkout/address';
      return;
    }

    setLoading(true);
    try {
      // Build cart items for server-side price calculation
      const cartItems = cart.map(item => ({ id: item.id, qty: item.qty }));

      const res = await fetch('/api/create-cashfree-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems,
          name: userName,
          email: userEmail,
          phone: userPhone,
        }),
      });
      const data = await res.json();
      if (!data.ok || !data.payment_session_id) {
        throw new Error(data.error || 'Could not create payment order');
      }

      // Save order data so /checkout/success can send the confirmation email
      const orderData = {
        id: data.order_id,
        name: userName,
        email: userEmail,
        phone: userPhone,
        items: cart.map(item => ({
          name: item.name,
          qty: item.qty,
          price: parsePrice(item.price),
        })),
        total: data.amount,
        subtotal,
        delivery,
      };
      localStorage.setItem('kyzer_pending_order', JSON.stringify(orderData));

      const cfMode = data.mode || 'production';
      const cf = await initCashfree(cfMode);
      cf.checkout({ paymentSessionId: data.payment_session_id, redirectTarget: '_self' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not initiate payment. Please try again.';
      setError(msg);
      setLoading(false);
    }
  }

  if (!mounted) return null;

  return (
    <>
      <link href={FONT_URL} rel="stylesheet" />
      <div style={{ minHeight: '100vh', background: '#f8f8f6', fontFamily: "'DM Sans', sans-serif" }}>
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 90, borderBottom: '0.5px solid rgba(0,0,0,0.09)', background: '#f8f8f6' }}>
          <a href="/" className="logo-anim" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#FF8C35', textDecoration: 'none', letterSpacing: '0.03em' }}>
            KYZER <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.2em', verticalAlign: 'middle', color: '#111' }}>ROBOTICS</span>
          </a>
          <a href="/checkout/review" style={{ fontSize: 13, color: '#666', textDecoration: 'none' }}>Back to Review</a>
        </nav>

        <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 16px' }}>
          <StepBar current={1} />
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: '#111', marginBottom: 24, letterSpacing: '0.04em' }}>Payment Method</h1>

          {error && (
            <div style={{ background: '#fff0f0', border: '1px solid #ffc5c5', borderRadius: 8, padding: '12px 14px', marginBottom: 20, fontSize: 14, color: '#c0392b' }}>
              {error}
            </div>
          )}

          {/* Order total */}
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid rgba(0,0,0,0.09)', padding: '16px 20px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, color: '#555' }}>Order Total ({cart.length} item{cart.length !== 1 ? 's' : ''})</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#111' }}>&#x20B9;{grandTotal.toLocaleString('en-IN')}</span>
          </div>

          {/* Method toggle */}
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid rgba(0,0,0,0.09)', padding: '20px', marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#111', marginBottom: 16, letterSpacing: '0.04em' }}>How would you like to pay?</h3>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <button
                onClick={() => setMethod('online')}
                style={{
                  flex: 1, padding: '14px 12px', borderRadius: 8, cursor: 'pointer',
                  border: `2px solid ${method === 'online' ? '#FF8C35' : 'rgba(0,0,0,0.1)'}`,
                  background: method === 'online' ? '#fff7f2' : '#fafaf9',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 600, color: method === 'online' ? '#FF8C35' : '#333' }}>&#x1F4B3; Pay Online</div>
                <div style={{ fontSize: 11, color: '#888', marginTop: 3 }}>Card, UPI, Netbanking</div>
              </button>

              <button
                onClick={() => setMethod('cod')}
                style={{
                  flex: 1, padding: '14px 12px', borderRadius: 8, cursor: 'pointer',
                  border: `2px solid ${method === 'cod' ? '#FF8C35' : 'rgba(0,0,0,0.1)'}`,
                  background: method === 'cod' ? '#fff7f2' : '#fafaf9',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 600, color: method === 'cod' ? '#FF8C35' : '#333' }}>&#x1F4E6; Cash on Delivery</div>
                <div style={{ fontSize: 11, color: '#888', marginTop: 3 }}>Pune area only</div>
              </button>
            </div>

            {method === 'cod' && (
              <div style={{ background: '#f8fff8', borderRadius: 8, border: '1px solid #c8eac8', padding: '12px 14px', fontSize: 13, color: '#2d7a2d', marginBottom: 16 }}>
                Cash on Delivery is available for Pune area orders. Pay when your order arrives.
              </div>
            )}
            {method === 'online' && (
              <div style={{ background: '#fff7ed', borderRadius: 8, border: '1px solid #ffd8a8', padding: '12px 14px', fontSize: 13, color: '#7c4a00', marginBottom: 16 }}>
                <strong>Next:</strong> You will be taken to <strong>Cashfree</strong> to complete payment securely. Then enter your delivery address.
              </div>
            )}

            <button
              onClick={handleContinue}
              disabled={loading}
              style={{ width: '100%', padding: '13px', background: loading ? '#ccc' : '#FF8C35', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif" }}
            >
              {loading ? 'Opening payment...' : method === 'cod' ? 'Continue to Address' : `Pay ₹${grandTotal.toLocaleString('en-IN')}`}
            </button>
          </div>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[{ icon: '🔒', label: 'SSL Secured' }, { icon: '💳', label: 'Card / UPI' }, { icon: '🏦', label: 'Netbanking' }, { icon: '👛', label: 'Wallets' }].map(b => (
              <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#888' }}>
                <span>{b.icon}</span><span>{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
