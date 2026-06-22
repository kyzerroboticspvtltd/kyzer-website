'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

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

const STEPS = ['Cart', 'Address', 'Payment', 'Review'];

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
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

function isPuneAddress(_city: string, pincode: string): boolean {
  const pin = pincode.replace(/\D/g, '');
  return pin.startsWith('410') || pin.startsWith('411') || pin.startsWith('412');
}

export default function PaymentPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [method, setMethod] = useState<'online' | 'cod'>('online');
  const [mounted, setMounted] = useState(false);
  const [codAvailable, setCodAvailable] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    auth.authStateReady().then(() => {
      unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          window.location.href = '/login?redirect=/checkout/payment';
          return;
        }
        try {
          const cartRaw = localStorage.getItem('kyzer_cart');
          if (cartRaw) setCart(JSON.parse(cartRaw));
          const checkoutRaw = sessionStorage.getItem('kyzer_checkout');
          if (checkoutRaw) {
            const parsed = JSON.parse(checkoutRaw);
            const addr = parsed.address || {};
            const pune = isPuneAddress(addr.city || '', addr.pincode || '');
            setCodAvailable(pune);
            if (parsed.paymentMethod === 'cod' && pune) setMethod('cod');
            else if (parsed.paymentMethod === 'online') setMethod('online');
            else setMethod(pune ? 'cod' : 'online');
          }
        } catch { /* ignore */ }
        setMounted(true);
      });
    });
    return () => unsubscribe?.();
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + parsePrice(item.price) * item.qty, 0);
  const delivery = subtotal >= 999 ? 0 : 99;
  const grandTotal = subtotal + delivery;

  function handleContinue() {
    try {
      const existing = JSON.parse(sessionStorage.getItem('kyzer_checkout') || '{}');
      sessionStorage.setItem('kyzer_checkout', JSON.stringify({ ...existing, paymentMethod: method }));
    } catch { /* ignore */ }
    window.location.href = '/checkout/review';
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
          <a href="/checkout/address" style={{ fontSize: 13, color: '#666', textDecoration: 'none' }}>← Back to Address</a>
        </nav>

        <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 16px' }}>
          <StepBar current={2} />
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: '#111', marginBottom: 24, letterSpacing: '0.04em' }}>Payment Method</h1>

          {/* Order total */}
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid rgba(0,0,0,0.09)', padding: '16px 20px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, color: '#555' }}>Order Total ({cart.length} item{cart.length !== 1 ? 's' : ''})</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#111' }}>₹{grandTotal.toLocaleString('en-IN')}</span>
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
                <div style={{ fontSize: 14, fontWeight: 600, color: method === 'online' ? '#FF8C35' : '#333' }}>💳 Pay Online</div>
                <div style={{ fontSize: 11, color: '#888', marginTop: 3 }}>Card, UPI, Netbanking</div>
              </button>

              {codAvailable ? (
                <button
                  onClick={() => setMethod('cod')}
                  style={{
                    flex: 1, padding: '14px 12px', borderRadius: 8, cursor: 'pointer',
                    border: `2px solid ${method === 'cod' ? '#FF8C35' : 'rgba(0,0,0,0.1)'}`,
                    background: method === 'cod' ? '#fff7f2' : '#fafaf9',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 600, color: method === 'cod' ? '#FF8C35' : '#333' }}>📦 Cash on Delivery</div>
                  <div style={{ fontSize: 11, color: '#888', marginTop: 3 }}>Pay when delivered</div>
                </button>
              ) : (
                <div style={{
                  flex: 1, padding: '14px 12px', borderRadius: 8,
                  border: '2px solid rgba(0,0,0,0.06)',
                  background: '#f5f5f5', textAlign: 'center', opacity: 0.6,
                }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#999' }}>📦 Cash on Delivery</div>
                  <div style={{ fontSize: 11, color: '#aaa', marginTop: 3 }}>Pune orders only</div>
                </div>
              )}
            </div>

            {!codAvailable && (
              <div style={{ background: '#f8f8f6', borderRadius: 8, border: '1px solid #e0e0e0', padding: '10px 14px', fontSize: 12, color: '#888', marginBottom: 16 }}>
                🚚 Cash on Delivery is available for <strong>Pune</strong> addresses only. Other cities require online payment.
              </div>
            )}
            {method === 'cod' && codAvailable && (
              <div style={{ background: '#f8fff8', borderRadius: 8, border: '1px solid #c8eac8', padding: '12px 14px', fontSize: 13, color: '#2d7a2d', marginBottom: 16 }}>
                Pay in cash when your order is delivered. No prepayment required.
              </div>
            )}
            {method === 'online' && (
              <div style={{ background: '#fff7ed', borderRadius: 8, border: '1px solid #ffd8a8', padding: '12px 14px', fontSize: 13, color: '#7c4a00', marginBottom: 16 }}>
                <strong>Next:</strong> You&apos;ll be taken to <strong>Razorpay</strong> to complete payment securely.
              </div>
            )}

            <button
              onClick={handleContinue}
              style={{ width: '100%', padding: '13px', background: '#FF8C35', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
            >
              {method === 'online' ? 'Next: Enter Address →' : 'Continue to Address →'}
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

