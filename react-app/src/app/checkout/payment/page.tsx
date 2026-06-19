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

interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  email: string;
  addr1: string;
  addr2: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  isDefault: boolean;
}

function parsePrice(p: string | number): number {
  if (!p) return 0;
  return parseFloat(String(p).replace(/[^0-9.]/g, '')) || 0;
}

const STEPS = ['Cart', 'Address', 'Review', 'Payment'];

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

function clearOrder() {
  try {
    localStorage.removeItem('kyzer_cart');
    sessionStorage.removeItem('kyzer_checkout');
  } catch { /* ignore */ }
}

export default function PaymentPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [address, setAddress] = useState<Address | null>(null);
  const [method, setMethod] = useState<'online' | 'cod'>('cod');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
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
          if (parsed.address) setAddress(parsed.address);
        }
      } catch { /* ignore */ }
      setMounted(true);
    });
    return () => unsubscribe();
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + parsePrice(item.price) * item.qty, 0);
  const gst = Math.round(subtotal * 0.18);
  const delivery = subtotal >= 999 ? 0 : 99;
  const grandTotal = subtotal + gst + delivery;

  function addrString(a: Address) {
    return [a.addr1, a.addr2, a.city, a.state, a.pincode, a.landmark].filter(Boolean).join(', ');
  }

  async function handleCOD() {
    if (!address) { setError('Address missing. Please go back.'); return; }
    setError('');
    setLoading(true);
    const orderId = 'SHOP-' + Date.now();
    try {
      const res = await fetch('/api/order-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: address.name,
          email: address.email,
          phone: address.phone,
          address: addrString(address),
          items: cart,
          total: grandTotal,
          paymentMethod: 'cod',
          orderId,
        }),
      });
      if (!res.ok) throw new Error('Order failed');
      clearOrder();
      window.location.href = `/order-confirmation/${orderId}`;
    } catch (err) {
      setError('Failed to place order. Please try again.');
      setLoading(false);
    }
  }

  async function handleOnline() {
    if (!address) { setError('Address missing. Please go back.'); return; }
    setError('');
    setLoading(true);
    const orderId = 'SHOP-' + Date.now();
    try {
      const res = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: grandTotal * 100, orderId }),
      });
      const orderData = await res.json();
      if (!orderData.id) throw new Error('Could not create payment order');

      // Load Razorpay script if needed
      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Razorpay load failed'));
          document.body.appendChild(script);
        });
      }

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: grandTotal * 100,
        currency: 'INR',
        name: 'Kyzer Robotics',
        description: 'Order ' + orderId,
        order_id: orderData.id,
        prefill: {
          name: address.name,
          email: address.email,
          contact: address.phone,
        },
        theme: { color: '#FF8C35' },
        handler: async function (response: Record<string, string>) {
          try {
            await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId,
              }),
            });
            clearOrder();
            window.location.href = `/order-confirmation/${orderId}`;
          } catch {
            setError('Payment verification failed. Please contact support.');
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => { setLoading(false); },
        },
      });
      rzp.open();
    } catch (err) {
      setError('Could not initiate payment. Please try again.');
      setLoading(false);
    }
  }

  if (!mounted) return null;

  return (
    <>
      <link href={FONT_URL} rel="stylesheet" />
      <div style={{ minHeight: '100vh', background: '#f8f8f6', fontFamily: "'DM Sans', sans-serif" }}>
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 60, borderBottom: '0.5px solid rgba(0,0,0,0.09)', background: '#f8f8f6' }}>
          <a href="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#FF8C35', textDecoration: 'none', letterSpacing: '0.03em' }}>
            KYZER <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.2em', verticalAlign: 'middle', color: '#111' }}>ROBOTICS</span>
          </a>
          <a href="/checkout/review" style={{ fontSize: 13, color: '#666', textDecoration: 'none' }}>← Back to Review</a>
        </nav>

        <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 16px' }}>
          <StepBar current={3} />
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: '#111', marginBottom: 24, letterSpacing: '0.04em' }}>Payment</h1>

          {error && (
            <div style={{ background: '#fff0f0', border: '1px solid #ffc5c5', borderRadius: 8, padding: '12px 14px', marginBottom: 20, fontSize: 14, color: '#c0392b' }}>
              {error}
            </div>
          )}

          {/* Order total */}
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid rgba(0,0,0,0.09)', padding: '16px 20px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, color: '#555' }}>Order Total ({cart.length} item{cart.length !== 1 ? 's' : ''})</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#111' }}>₹{grandTotal.toLocaleString('en-IN')}</span>
          </div>

          {/* Payment method toggle */}
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid rgba(0,0,0,0.09)', padding: '20px', marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#111', marginBottom: 16, letterSpacing: '0.04em' }}>Payment Method</h3>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              {[
                { key: 'online', label: '💳 Pay Online', sub: 'Card, UPI, Netbanking' },
                { key: 'cod', label: '📦 Cash on Delivery', sub: 'Pay when delivered' },
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setMethod(opt.key as 'online' | 'cod')}
                  style={{
                    flex: 1, padding: '14px 12px', borderRadius: 8, cursor: 'pointer',
                    border: `2px solid ${method === opt.key ? '#FF8C35' : 'rgba(0,0,0,0.1)'}`,
                    background: method === opt.key ? '#fff7f2' : '#fafaf9',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 600, color: method === opt.key ? '#FF8C35' : '#333' }}>{opt.label}</div>
                  <div style={{ fontSize: 11, color: '#888', marginTop: 3 }}>{opt.sub}</div>
                </button>
              ))}
            </div>

            {method === 'cod' && (
              <div style={{ background: '#f8fff8', borderRadius: 8, border: '1px solid #c8eac8', padding: '12px 14px', fontSize: 13, color: '#2d7a2d', marginBottom: 16 }}>
                Pay in cash when your order is delivered. No prepayment required.
              </div>
            )}

            {method === 'online' && (
              <div style={{ background: '#f2f0eb', borderRadius: 8, padding: '12px 14px', fontSize: 13, color: '#555', marginBottom: 16 }}>
                You&apos;ll be redirected to Razorpay secure checkout to complete payment.
              </div>
            )}

            <button
              onClick={method === 'cod' ? handleCOD : handleOnline}
              disabled={loading}
              style={{
                width: '100%', padding: '13px', background: loading ? '#ccc' : '#FF8C35',
                color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {loading ? 'Processing…' : method === 'cod' ? 'Confirm Order' : 'Pay ₹' + grandTotal.toLocaleString('en-IN')}
            </button>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { icon: '🔒', label: 'SSL Secured' },
              { icon: '💳', label: 'Card / UPI' },
              { icon: '🏦', label: 'Netbanking' },
              { icon: '👛', label: 'Wallets' },
            ].map(b => (
              <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#888' }}>
                <span>{b.icon}</span>
                <span>{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
