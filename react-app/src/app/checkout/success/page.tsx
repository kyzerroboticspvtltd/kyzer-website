'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get('order_id');
  const [state, setState] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [paymentId, setPaymentId] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!orderId) {
      setState('failed');
      setErrorMsg('No order ID found in URL.');
      return;
    }

    const raw = localStorage.getItem('kyzer_pending_order');
    const orderData = raw ? JSON.parse(raw) : {};

    fetch('/api/verify-cashfree-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId, orderData }),
    })
      .then(r => r.json())
      .then(d => {
        if (d.ok) {
          // Clear cart and pending order only on confirmed success
          localStorage.removeItem('kyzer_pending_order');
          localStorage.removeItem('kyzer_cart');
          setPaymentId(d.paymentId || orderId);
          setState('success');
        } else {
          setErrorMsg(d.error || 'Payment could not be verified.');
          setState('failed');
        }
      })
      .catch(() => {
        setErrorMsg('Network error. Please contact us with your order ID.');
        setState('failed');
      });
  }, [orderId]);

  if (state === 'verifying') {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ width: 48, height: 48, border: '3px solid #FF8C35', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' }} />
        <p style={{ fontSize: 18, color: '#555' }}>Verifying your payment...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (state === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', maxWidth: 520, margin: '0 auto' }}>
        <div style={{ width: 72, height: 72, background: '#f0fff4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 24px' }}>
          ✅
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Order Confirmed!</h1>
        <p style={{ color: '#555', fontSize: 16, marginBottom: 24 }}>
          Your payment was successful. Check your email for the invoice and order details.
        </p>
        <div style={{ background: '#f0fff4', border: '1px solid #b2f0c8', borderRadius: 12, padding: '16px 20px', marginBottom: 32, textAlign: 'left' }}>
          <p style={{ margin: 0, fontSize: 13, color: '#1a7a40' }}><strong>Payment ID:</strong> {paymentId}</p>
          {orderId && <p style={{ margin: '6px 0 0', fontSize: 13, color: '#1a7a40' }}><strong>Order ID:</strong> {orderId}</p>}
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/shop" style={{ padding: '12px 24px', background: '#FF8C35', color: '#000', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>
            Continue Shopping
          </a>
          <a href="/contact" style={{ padding: '12px 24px', background: '#f0f0ee', color: '#111', borderRadius: 8, fontWeight: 600, textDecoration: 'none', fontSize: 14, border: '1px solid #ddd' }}>
            Contact Support
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', maxWidth: 520, margin: '0 auto' }}>
      <div style={{ width: 72, height: 72, background: '#fff3f3', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 24px' }}>
        ❌
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Payment Issue</h1>
      <p style={{ color: '#555', fontSize: 16, marginBottom: 8 }}>{errorMsg || 'We could not verify your payment.'}</p>
      {orderId && (
        <p style={{ color: '#888', fontSize: 13, marginBottom: 24 }}>
          Reference: <strong>{orderId}</strong>
        </p>
      )}
      <p style={{ color: '#888', fontSize: 14, marginBottom: 28 }}>
        If money was deducted, please contact us with the order reference above and we will resolve it immediately.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href="mailto:info@kyzerrobotics.com" style={{ padding: '12px 24px', background: '#FF8C35', color: '#000', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>
          Email Us
        </a>
        <a href="/shop" style={{ padding: '12px 24px', background: '#f0f0ee', color: '#111', borderRadius: 8, fontWeight: 600, textDecoration: 'none', fontSize: 14, border: '1px solid #ddd' }}>
          Back to Shop
        </a>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f8f8f6', paddingTop: 100 }}>
      <Suspense fallback={<div style={{ textAlign: 'center', padding: 60, color: '#888' }}>Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
