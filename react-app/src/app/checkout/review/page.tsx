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

function clearOrder() {
  try {
    localStorage.removeItem('kyzer_cart');
    sessionStorage.removeItem('kyzer_checkout');
  } catch { /* ignore */ }
}

export default function ReviewPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [address, setAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    auth.authStateReady().then(() => {
      unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          window.location.href = '/login?redirect=/checkout/review';
          return;
        }
        try {
          const cartRaw = localStorage.getItem('kyzer_cart');
          if (cartRaw) setCart(JSON.parse(cartRaw));
          const checkoutRaw = sessionStorage.getItem('kyzer_checkout');
          if (checkoutRaw) {
            const parsed = JSON.parse(checkoutRaw);
            if (parsed.address) setAddress(parsed.address);
            if (parsed.paymentMethod) setPaymentMethod(parsed.paymentMethod);
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

  function addrString(a: Address) {
    return [a.addr1, a.addr2, a.city, a.state, a.pincode, a.landmark].filter(Boolean).join(', ');
  }

  async function handlePlaceOrder() {
    if (!address) { setError('Address missing. Please go back.'); return; }
    setError('');
    setLoading(true);
    const orderId = 'SHOP-' + Date.now();

    if (paymentMethod === 'cod') {
      try {
        // Fetch a checkout token first (required by the API)
        const tokenRes = await fetch('/api/checkout-token');
        const tokenData = await tokenRes.json();
        const checkoutToken = tokenData?.token;

        const orderData = {
          id: orderId,
          name: address.name,
          email: address.email,
          phone: address.phone,
          shippingFull: addrString(address),
          address: addrString(address),
          items: cart,
          total: grandTotal,
          paymentMethod: 'cod',
          status: 'new',
        };

        const res = await fetch('/api/order-notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ checkoutToken, orderData }),
        });
        if (!res.ok) throw new Error('Order failed');
        clearOrder();
        window.location.href = `/order-confirmation/${orderId}`;
      } catch {
        setError('Failed to place order. Please try again.');
        setLoading(false);
      }
      return;
    }

    // Online payment via Razorpay
    try {
      const res = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: grandTotal * 100, orderId }),
      });
      const orderData = await res.json();
      if (!orderData.id) throw new Error('Could not create payment order');
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
        amount: grandTotal * 100, currency: 'INR',
        name: 'Kyzer Robotics', description: 'Order ' + orderId,
        order_id: orderData.id,
        prefill: { name: address.name, email: address.email, contact: address.phone },
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
        modal: { ondismiss: () => setLoading(false) },
      });
      rzp.open();
    } catch {
      setError('Could not initiate payment. Please try again.');
      setLoading(false);
    }
  }

  if (!mounted) return null;

  if (!address) {
    return (
      <>
        <link href={FONT_URL} rel="stylesheet" />
        <div style={{ minHeight: '100vh', background: '#f8f8f6', fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <p style={{ color: '#666', marginBottom: 16 }}>No address found. Please go back and enter your address.</p>
          <a href="/checkout/payment" style={{ color: '#FF8C35', fontWeight: 600, textDecoration: 'none' }}>← Back to Address</a>
        </div>
      </>
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
          <a href="/checkout/payment" style={{ fontSize: 13, color: '#666', textDecoration: 'none' }}>← Back</a>
        </nav>

        <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px' }}>
          <StepBar current={3} />
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: '#111', marginBottom: 24, letterSpacing: '0.04em' }}>Review Order</h1>

          {error && (
            <div style={{ background: '#fff0f0', border: '1px solid #ffc5c5', borderRadius: 8, padding: '12px 14px', marginBottom: 20, fontSize: 14, color: '#c0392b' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Left: items + address + payment method */}
            <div style={{ flex: 1, minWidth: 300, display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Items */}
              <div style={{ background: '#fff', borderRadius: 10, border: '1px solid rgba(0,0,0,0.09)', padding: '20px' }}>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#111', marginBottom: 14, letterSpacing: '0.04em' }}>Items ({cart.length})</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 6, background: '#f2f0eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0, overflow: 'hidden' }}>
                        {item.photo ? <img src={item.photo} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : item.emoji}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>Qty: {item.qty}</div>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#111', flexShrink: 0 }}>
                        ₹{(parsePrice(item.price) * item.qty).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address */}
              <div style={{ background: '#fff', borderRadius: 10, border: '1px solid rgba(0,0,0,0.09)', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#111', letterSpacing: '0.04em' }}>Delivery Address</h3>
                  <a href="/checkout/payment" style={{ fontSize: 13, color: '#FF8C35', textDecoration: 'none', fontWeight: 500 }}>Edit</a>
                </div>
                <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", background: '#f2f0eb', padding: '2px 8px', borderRadius: 4, color: '#666', display: 'inline-block', marginBottom: 8 }}>{address.label}</span>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{address.name}</div>
                <div style={{ fontSize: 13, color: '#555', marginTop: 3 }}>{address.addr1}{address.addr2 ? ', ' + address.addr2 : ''}</div>
                <div style={{ fontSize: 13, color: '#555' }}>{address.city}, {address.state} – {address.pincode}</div>
                {address.landmark && <div style={{ fontSize: 13, color: '#888' }}>Near: {address.landmark}</div>}
                <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>📱 {address.phone}</div>
                <div style={{ fontSize: 13, color: '#666' }}>✉️ {address.email}</div>
              </div>

              {/* Payment method summary */}
              <div style={{ background: '#fff', borderRadius: 10, border: '1px solid rgba(0,0,0,0.09)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 2 }}>Payment Method</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>
                    {paymentMethod === 'cod' ? '📦 Cash on Delivery' : '💳 Pay Online (Razorpay)'}
                  </div>
                </div>
                <a href="/checkout/payment" style={{ fontSize: 13, color: '#FF8C35', textDecoration: 'none', fontWeight: 500 }}>Change</a>
              </div>
            </div>

            {/* Right: order summary + place order */}
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
                  <div style={{ borderTop: '1px solid rgba(0,0,0,0.09)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, color: '#111' }}>
                    <span>Total</span>
                    <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  style={{ width: '100%', marginTop: 18, padding: '12px', background: loading ? '#ccc' : '#FF8C35', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                >
                  {loading ? 'Processing…' : paymentMethod === 'cod' ? 'Confirm Order' : `Pay ₹${grandTotal.toLocaleString('en-IN')} →`}
                </button>

                <a href="/checkout/payment" style={{ display: 'block', textAlign: 'center', marginTop: 12, fontSize: 13, color: '#666', textDecoration: 'none' }}>
                  ← Back to Address
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

