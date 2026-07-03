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

declare global {
  interface Window {
    Cashfree: (opts: { mode: string }) => { checkout(opts: { paymentSessionId: string; redirectTarget: string }): Promise<{ error?: { message?: string } }> };
  }
}

function loadCashfree(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window.Cashfree !== 'undefined') { resolve(); return; }
    const s = document.createElement('script');
    s.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Cashfree SDK load failed'));
    document.head.appendChild(s);
  });
}

export default function ReviewPage() {
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
    if (!token) {
      window.location.href = '/login?redirect=/checkout/review';
      return;
    }
    try {
      const raw = localStorage.getItem('kyzer_current_customer');
      if (raw) {
        const c = JSON.parse(raw);
        setUserName(c.name || '');
        setUserEmail(c.email || '');
        setUserPhone(c.phone || '');
      }
      const cartRaw = localStorage.getItem('kyzer_cart');
      if (cartRaw) setCart(JSON.parse(cartRaw));
    } catch { /* ignore */ }
    setMounted(true);
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + parsePrice(item.price) * item.qty, 0);
  const delivery = subtotal >= 999 ? 0 : 99;
  const grandTotal = subtotal + delivery;

  async function handlePay() {
    setError('');
    if (method === 'cod') {
      sessionStorage.setItem('kyzer_checkout', JSON.stringify({ paymentMethod: 'cod' }));
      window.location.href = '/checkout/address';
      return;
    }

    setLoading(true);
    try {
      const cartItems = cart.map(item => ({ id: item.id, qty: item.qty }));
      const res = await fetch('/api/create-cashfree-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems, name: userName, email: userEmail, phone: userPhone }),
      });
      const data = await res.json();
      if (!data.ok || !data.payment_session_id) throw new Error(data.error || 'Could not create payment order');

      localStorage.setItem('kyzer_pending_order', JSON.stringify({
        id: data.order_id,
        name: userName,
        email: userEmail,
        phone: userPhone,
        items: cart.map(item => ({ name: item.name, qty: item.qty, price: parsePrice(item.price) })),
        total: data.amount,
        subtotal,
        delivery,
      }));

      await loadCashfree();
      const cfMode = data.mode || 'production';
      const cf = window.Cashfree({ mode: cfMode });
      const result = await cf.checkout({ paymentSessionId: data.payment_session_id, redirectTarget: '_self' });
      if (result?.error) throw new Error(result.error.message || 'Payment checkout failed');
      window.location.href = `/checkout/success?order_id=${data.order_id}`;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not initiate payment. Please try again.');
      setLoading(false);
    }
  }

  if (!mounted) return null;

  return (
    <>
      <link href={FONT_URL} rel="stylesheet" />
      <div style={{ minHeight: '100vh', background: '#f8f8f6', fontFamily: "'DM Sans', sans-serif" }}>
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 90, borderBottom: '0.5px solid rgba(0,0,0,0.09)', background: '#f8f8f6' }}>
          <a href="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#FF8C35', textDecoration: 'none', letterSpacing: '0.03em' }}>
            KYZER <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.2em', verticalAlign: 'middle', color: '#111' }}>ROBOTICS</span>
          </a>
          <a href="/checkout" style={{ fontSize: 13, color: '#666', textDecoration: 'none' }}>Back to Cart</a>
        </nav>

        <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px' }}>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: '#111', marginBottom: 24, letterSpacing: '0.04em' }}>Review Your Order</h1>

          {error && (
            <div style={{ background: '#fff0f0', border: '1px solid #ffc5c5', borderRadius: 8, padding: '12px 14px', marginBottom: 20, fontSize: 14, color: '#c0392b' }}>
              {error}
            </div>
          )}

          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ color: '#666', marginBottom: 16 }}>Your cart is empty.</p>
              <a href="/" style={{ color: '#FF8C35', fontWeight: 600, textDecoration: 'none' }}>Browse Products</a>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {/* Items */}
              <div style={{ flex: 1, minWidth: 300 }}>
                <div style={{ background: '#fff', borderRadius: 10, border: '1px solid rgba(0,0,0,0.09)', padding: '20px' }}>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#111', marginBottom: 14, letterSpacing: '0.04em' }}>
                    Items ({cart.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {cart.map(item => (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 52, height: 52, borderRadius: 8, background: '#f2f0eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0, overflow: 'hidden' }}>
                          {item.photo
                            ? <img src={item.photo} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : item.emoji}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                          <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Qty: {item.qty}</div>
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#111', flexShrink: 0 }}>
                          &#x20B9;{(parsePrice(item.price) * item.qty).toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary + Payment */}
              <div style={{ width: 300, flexShrink: 0 }}>
                <div style={{ background: '#fff', borderRadius: 10, border: '1px solid rgba(0,0,0,0.09)', padding: '20px' }}>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#111', marginBottom: 16, letterSpacing: '0.04em' }}>Order Summary</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14, marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555' }}>
                      <span>Subtotal</span>
                      <span>&#x20B9;{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555' }}>
                      <span>Delivery</span>
                      <span style={{ color: delivery === 0 ? '#27ae60' : '#111' }}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
                    </div>
                    {subtotal < 999 && (
                      <div style={{ fontSize: 11, color: '#888', background: '#f2f0eb', borderRadius: 6, padding: '6px 10px' }}>
                        Add &#x20B9;{(999 - subtotal).toLocaleString('en-IN')} more for free delivery
                      </div>
                    )}
                    <div style={{ borderTop: '1px solid rgba(0,0,0,0.09)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, color: '#111' }}>
                      <span>Total</span>
                      <span>&#x20B9;{grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Payment method */}
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, color: '#111', marginBottom: 12, letterSpacing: '0.04em' }}>How to Pay?</h3>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                    <button onClick={() => setMethod('online')} style={{ flex: 1, padding: '10px 8px', borderRadius: 8, cursor: 'pointer', border: `2px solid ${method === 'online' ? '#FF8C35' : 'rgba(0,0,0,0.1)'}`, background: method === 'online' ? '#fff7f2' : '#fafaf9', textAlign: 'center' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: method === 'online' ? '#FF8C35' : '#333' }}>&#x1F4B3; Online</div>
                      <div style={{ fontSize: 10, color: '#888', marginTop: 2 }}>Card, UPI, Netbanking</div>
                    </button>
                    <button onClick={() => setMethod('cod')} style={{ flex: 1, padding: '10px 8px', borderRadius: 8, cursor: 'pointer', border: `2px solid ${method === 'cod' ? '#FF8C35' : 'rgba(0,0,0,0.1)'}`, background: method === 'cod' ? '#fff7f2' : '#fafaf9', textAlign: 'center' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: method === 'cod' ? '#FF8C35' : '#333' }}>&#x1F4E6; COD</div>
                      <div style={{ fontSize: 10, color: '#888', marginTop: 2 }}>Pune area only</div>
                    </button>
                  </div>

                  {method === 'cod' && (
                    <div style={{ background: '#f8fff8', borderRadius: 8, border: '1px solid #c8eac8', padding: '10px 12px', fontSize: 12, color: '#2d7a2d', marginBottom: 14 }}>
                      Pay when your order arrives. Pune area only.
                    </div>
                  )}
                  {method === 'online' && (
                    <div style={{ background: '#fff7ed', borderRadius: 8, border: '1px solid #ffd8a8', padding: '10px 12px', fontSize: 12, color: '#7c4a00', marginBottom: 14 }}>
                      You will be redirected to <strong>Cashfree</strong> to pay securely.
                    </div>
                  )}

                  <button
                    onClick={handlePay}
                    disabled={loading}
                    style={{ width: '100%', padding: '13px', background: loading ? '#ccc' : '#FF8C35', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {loading ? 'Processing...' : method === 'cod' ? 'Continue to Address' : `Pay ₹${grandTotal.toLocaleString('en-IN')}`}
                  </button>

                  <a href="/checkout" style={{ display: 'block', textAlign: 'center', marginTop: 12, fontSize: 13, color: '#666', textDecoration: 'none' }}>
                    Edit Cart
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
