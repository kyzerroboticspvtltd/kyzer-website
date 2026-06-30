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

const STEPS = ['Cart', 'Review', 'Payment', 'Address'];

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

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem('kyzer_cart');
      if (raw) setCart(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('kyzer_auth_token'));
  }, []);

  function saveCart(updated: CartItem[]) {
    setCart(updated);
    try { localStorage.setItem('kyzer_cart', JSON.stringify(updated)); } catch { /* ignore */ }
  }

  function updateQty(id: string, delta: number) {
    const updated = cart.map(item =>
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    );
    saveCart(updated);
  }

  function removeItem(id: string) {
    saveCart(cart.filter(item => item.id !== id));
  }

  const subtotal = cart.reduce((sum, item) => sum + parsePrice(item.price) * item.qty, 0);
  const gst = 0;
  const delivery = subtotal >= 999 ? 0 : 99;
  const grandTotal = subtotal + gst + delivery;

  function handleProceed() {
    if (isLoggedIn) {
      window.location.href = '/checkout/order';
    } else {
      window.location.href = '/login?redirect=/checkout/order';
    }
  }

  if (!mounted) return null;

  return (
    <>
      <link href={FONT_URL} rel="stylesheet" />
      <div style={{ minHeight: '100vh', background: '#f8f8f6', fontFamily: "'DM Sans', sans-serif" }}>
        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 90, borderBottom: '0.5px solid rgba(0,0,0,0.09)', background: '#f8f8f6' }}>
          <a href="/" className="logo-anim" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#FF8C35', textDecoration: 'none', letterSpacing: '0.03em' }}>
            KYZER <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.2em', verticalAlign: 'middle', color: '#111' }}>ROBOTICS</span>
          </a>
          <a href="/" style={{ fontSize: 13, color: '#666', textDecoration: 'none' }}>← Continue Shopping</a>
        </nav>

        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 16px' }}>
          <StepBar current={0} />

          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: '#111', marginBottom: 24, letterSpacing: '0.04em' }}>
            Your Cart
          </h1>

          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: 60, marginBottom: 16 }}>🛒</div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: '#111', marginBottom: 10 }}>Your cart is empty</h2>
              <p style={{ fontSize: 14, color: '#666', marginBottom: 24 }}>Looks like you haven&apos;t added anything yet.</p>
              <a href="/" style={{ display: 'inline-block', background: '#FF8C35', color: '#fff', padding: '12px 28px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
                Browse Products
              </a>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {/* Cart Items */}
              <div style={{ flex: 1, minWidth: 300 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ background: '#fff', borderRadius: 10, border: '1px solid rgba(0,0,0,0.09)', padding: '16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                      {/* Image/Emoji */}
                      <div style={{ width: 60, height: 60, borderRadius: 8, background: '#f2f0eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0, overflow: 'hidden' }}>
                        {item.photo
                          ? <img src={item.photo} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : item.emoji}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#FF8C35' }}>₹{parsePrice(item.price).toLocaleString('en-IN')}</div>
                      </div>

                      {/* Qty controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        <button onClick={() => updateQty(item.id, -1)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid rgba(0,0,0,0.12)', background: '#f8f8f6', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                        <span style={{ fontSize: 14, fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid rgba(0,0,0,0.12)', background: '#f8f8f6', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                      </div>

                      <div style={{ fontSize: 14, fontWeight: 700, color: '#111', minWidth: 70, textAlign: 'right', flexShrink: 0 }}>
                        ₹{(parsePrice(item.price) * item.qty).toLocaleString('en-IN')}
                      </div>

                      <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: '#bbb', cursor: 'pointer', fontSize: 18, padding: 4, flexShrink: 0 }} title="Remove">✕</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div style={{ width: 280, flexShrink: 0 }}>
                <div style={{ background: '#fff', borderRadius: 10, border: '1px solid rgba(0,0,0,0.09)', padding: '20px' }}>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#111', marginBottom: 16, letterSpacing: '0.04em' }}>Order Summary</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555' }}>
                      <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555' }}>
                      <span>Delivery</span>
                      <span style={{ color: delivery === 0 ? '#27ae60' : '#111' }}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
                    </div>
                    {subtotal < 999 && (
                      <div style={{ fontSize: 11, color: '#888', background: '#f2f0eb', borderRadius: 6, padding: '6px 10px' }}>
                        Add ₹{(999 - subtotal).toLocaleString('en-IN')} more for free delivery
                      </div>
                    )}
                    <div style={{ borderTop: '1px solid rgba(0,0,0,0.09)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, color: '#111' }}>
                      <span>Total</span>
                      <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleProceed}
                    style={{ width: '100%', marginTop: 18, padding: '12px', background: '#FF8C35', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Proceed to Checkout →
                  </button>

                  <a href="/" style={{ display: 'block', textAlign: 'center', marginTop: 12, fontSize: 13, color: '#666', textDecoration: 'none' }}>
                    Continue Shopping
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

