'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const FONT_URL =
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap';

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan',
  'Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Jammu & Kashmir','Ladakh','Chandigarh','Puducherry','Lakshadweep',
  'Andaman & Nicobar Islands','Dadra & Nagar Haveli','Daman & Diu',
];

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

declare global {
  interface Window {
    Cashfree: (opts: { mode: string }) => { checkout(opts: { paymentSessionId: string; redirectTarget: string }): void };
  }
}

function parsePrice(p: string | number): number {
  if (!p) return 0;
  return parseFloat(String(p).replace(/[^0-9.]/g, '')) || 0;
}

function addrOneLine(a: Address) {
  return [a.addr1, a.addr2, a.city, a.state, a.pincode].filter(Boolean).join(', ');
}

function clearOrder() {
  try {
    localStorage.removeItem('kyzer_cart');
    sessionStorage.removeItem('kyzer_checkout');
  } catch { /* ignore */ }
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

const emptyForm = (): Omit<Address, 'id' | 'isDefault'> => ({
  label: 'Home', name: '', phone: '', email: '', addr1: '', addr2: '',
  city: '', state: '', pincode: '', landmark: '',
});

export default function OrderPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [activeAddr, setActiveAddr] = useState<Address | null>(null);
  const [editingAddr, setEditingAddr] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [saveToProfile, setSaveToProfile] = useState(true);
  const [payMethod, setPayMethod] = useState<'online' | 'cod'>('online');
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('kyzer_auth_token');
      const raw = localStorage.getItem('kyzer_current_customer');
      if (!token || !raw) {
        window.location.href = '/login?redirect=/checkout/order';
        return;
      }
      let customer: { id?: string; name?: string; email?: string; phone?: string } = {};
      try { customer = JSON.parse(raw); } catch { /* ignore */ }
      setUserId(customer.id || '');
      setUserName(customer.name || '');
      setUserEmail(customer.email || '');
      setUserPhone(customer.phone || '');

      try {
        const cartRaw = localStorage.getItem('kyzer_cart');
        if (cartRaw) setCart(JSON.parse(cartRaw));
      } catch { /* ignore */ }

      if (customer.id) {
        const { data: cust } = await supabase.from('customers').select('address').eq('id', customer.id).single();
        if (cust && Array.isArray(cust.address) && cust.address.length > 0) {
          const addrs = cust.address as Address[];
          setSavedAddresses(addrs);
          const def = addrs.find(a => a.isDefault) || addrs[0];
          setActiveAddr(def);
        } else {
          setEditingAddr(true);
          setForm(prev => ({ ...prev, name: customer.name || '', phone: customer.phone || '', email: customer.email || '' }));
        }
      }
      setPageLoading(false);
    })();
  }, []);

  const subtotal = cart.reduce((sum, i) => sum + parsePrice(i.price) * i.qty, 0);
  const delivery = subtotal >= 999 ? 0 : 99;
  const grandTotal = subtotal + delivery;

  function field(key: keyof typeof form, val: string) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  async function handlePlaceOrder() {
    setError('');

    // Resolve address
    let addr: Address;
    if (editingAddr) {
      if (!form.name.trim()) { setError('Full name is required.'); return; }
      if (!/^\d{10}$/.test(form.phone)) { setError('Phone must be 10 digits.'); return; }
      if (!form.email.trim()) { setError('Email is required.'); return; }
      if (!form.addr1.trim()) { setError('Address line 1 is required.'); return; }
      if (!form.city.trim()) { setError('City is required.'); return; }
      if (!form.state) { setError('State is required.'); return; }
      if (!/^\d{6}$/.test(form.pincode)) { setError('Pincode must be 6 digits.'); return; }
      addr = { ...form, id: 'addr-' + Date.now(), isDefault: false };
      if (saveToProfile && userId) {
        const updated = [...savedAddresses, addr];
        await supabase.from('customers').upsert({ id: userId, address: updated }, { onConflict: 'id' });
      }
    } else {
      if (!activeAddr) { setError('Please select or add a delivery address.'); return; }
      addr = activeAddr;
    }

    // COD: Pune only
    if (payMethod === 'cod') {
      const pin = parseInt(addr.pincode, 10);
      if (pin < 411001 || pin > 411067) {
        setError('Cash on Delivery is only available for Pune (pincode 411001–411067). Please choose Online Payment.');
        return;
      }
    }

    setLoading(true);

    try {
      if (payMethod === 'online') {
        const cartItems = cart.map(i => ({ id: i.id, qty: i.qty }));
        const res = await fetch('/api/create-cashfree-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cartItems, name: addr.name, email: addr.email || userEmail, phone: addr.phone || userPhone }),
        });
        const data = await res.json();
        if (!data.ok || !data.payment_session_id) throw new Error(data.error || 'Could not create payment order');

        localStorage.setItem('kyzer_pending_order', JSON.stringify({
          id: data.order_id,
          name: addr.name,
          email: addr.email || userEmail,
          phone: addr.phone || userPhone,
          address: addrOneLine(addr),
          items: cart.map(i => ({ name: i.name, qty: i.qty, price: parsePrice(i.price) })),
          total: data.amount,
          subtotal,
          delivery,
        }));

        await loadCashfree();
        window.Cashfree({ mode: 'production' }).checkout({ paymentSessionId: data.payment_session_id, redirectTarget: '_self' });
      } else {
        // COD
        const orderId = 'SHOP-' + Date.now();
        const tokenRes = await fetch('/api/checkout-token');
        const tokenData = await tokenRes.json();
        const notifyRes = await fetch('/api/order-notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            checkoutToken: tokenData?.token,
            orderData: {
              id: orderId,
              name: addr.name,
              email: addr.email || userEmail,
              phone: addr.phone || userPhone,
              shippingFull: addrOneLine(addr),
              address: addrOneLine(addr),
              items: cart,
              total: grandTotal,
              paymentMethod: 'cod',
              status: 'new',
            },
          }),
        });
        if (!notifyRes.ok) throw new Error('Order failed');
        clearOrder();
        window.location.href = `/order-confirmation/${orderId}`;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  if (pageLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
        <span style={{ color: '#888' }}>Loading…</span>
      </div>
    );
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '10px 13px', borderRadius: 6, border: '1px solid #ddd',
    fontSize: 14, color: '#222', background: '#fff', outline: 'none', boxSizing: 'border-box',
    fontFamily: "'DM Sans', sans-serif",
  };
  const lbl: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' };

  return (
    <>
      <link href={FONT_URL} rel="stylesheet" />
      <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: "'DM Sans', sans-serif" }}>

        {/* Nav */}
        <nav style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '0 32px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: '#FF8C35', textDecoration: 'none', letterSpacing: '0.03em' }}>
            KYZER <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', color: '#111', verticalAlign: 'middle' }}>ROBOTICS</span>
          </a>
          <div style={{ fontSize: 13, color: '#888' }}>
            Welcome, <strong style={{ color: '#222' }}>{userName}</strong>
          </div>
        </nav>

        {/* Breadcrumb */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '10px 32px' }}>
          <span style={{ fontSize: 13, color: '#888' }}>
            <a href="/" style={{ color: '#FF8C35', textDecoration: 'none' }}>Home</a>
            {' → '}
            <a href="/checkout" style={{ color: '#FF8C35', textDecoration: 'none' }}>Cart</a>
            {' → '}
            <span style={{ color: '#444', fontWeight: 500 }}>Checkout</span>
          </span>
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px', display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* LEFT COLUMN */}
          <div style={{ flex: 1, minWidth: 320, display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Page title */}
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 30, color: '#111', letterSpacing: '0.04em', margin: 0 }}>Checkout</h1>

            {error && (
              <div style={{ background: '#fff0f0', border: '1px solid #ffc5c5', borderRadius: 8, padding: '12px 16px', fontSize: 14, color: '#c0392b' }}>
                {error}
              </div>
            )}

            {/* Billing Address card */}
            <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8e8e8', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: editingAddr ? '1px solid #f0f0f0' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>Billing Address</span>
                {activeAddr && !editingAddr && (
                  <button
                    onClick={() => setEditingAddr(true)}
                    style={{ background: '#FF8C35', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                  >
                    Change Address
                  </button>
                )}
              </div>

              {/* Show selected address */}
              {activeAddr && !editingAddr && (
                <div style={{ padding: '16px 20px' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 4 }}>{activeAddr.name}</div>
                  <div style={{ fontSize: 14, color: '#555', lineHeight: 1.6 }}>
                    {activeAddr.addr1}{activeAddr.addr2 ? ', ' + activeAddr.addr2 : ''}<br />
                    {activeAddr.city}, {activeAddr.state} – {activeAddr.pincode}
                    {activeAddr.landmark ? <><br />{activeAddr.landmark}</> : null}
                  </div>
                  <div style={{ fontSize: 13, color: '#888', marginTop: 6 }}>📱 {activeAddr.phone}</div>

                  {/* Other saved addresses */}
                  {savedAddresses.length > 1 && (
                    <div style={{ marginTop: 14, borderTop: '1px solid #f0f0f0', paddingTop: 14 }}>
                      <div style={{ fontSize: 12, color: '#888', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Other saved addresses</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {savedAddresses.filter(a => a.id !== activeAddr.id).map(a => (
                          <div
                            key={a.id}
                            onClick={() => setActiveAddr(a)}
                            style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #e8e8e8', cursor: 'pointer', fontSize: 13, color: '#444' }}
                          >
                            <strong>{a.name}</strong> — {a.addr1}, {a.city} {a.pincode}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => { setEditingAddr(true); setForm({ ...emptyForm(), name: '', email: userEmail, phone: userPhone }); }}
                    style={{ marginTop: 14, background: 'none', border: '1px dashed #ccc', borderRadius: 6, padding: '8px 14px', fontSize: 13, color: '#666', cursor: 'pointer', width: '100%' }}
                  >
                    + Add New Address
                  </button>
                </div>
              )}

              {/* Address form */}
              {editingAddr && (
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div style={{ gridColumn: '1/-1' }}>
                      <label style={lbl}>Full Name *</label>
                      <input style={inp} value={form.name} onChange={e => field('name', e.target.value)} placeholder="Rahul Sharma" />
                    </div>
                    <div>
                      <label style={lbl}>Phone *</label>
                      <input style={inp} value={form.phone} onChange={e => field('phone', e.target.value)} placeholder="9876543210" maxLength={10} />
                    </div>
                    <div>
                      <label style={lbl}>Email *</label>
                      <input style={inp} value={form.email} onChange={e => field('email', e.target.value)} placeholder="you@example.com" />
                    </div>
                    <div style={{ gridColumn: '1/-1' }}>
                      <label style={lbl}>Address Line 1 *</label>
                      <input style={inp} value={form.addr1} onChange={e => field('addr1', e.target.value)} placeholder="Flat/House No., Street" />
                    </div>
                    <div style={{ gridColumn: '1/-1' }}>
                      <label style={lbl}>Address Line 2</label>
                      <input style={inp} value={form.addr2} onChange={e => field('addr2', e.target.value)} placeholder="Area, Colony (optional)" />
                    </div>
                    <div>
                      <label style={lbl}>City *</label>
                      <input style={inp} value={form.city} onChange={e => field('city', e.target.value)} placeholder="Pune" />
                    </div>
                    <div>
                      <label style={lbl}>Pincode *</label>
                      <input style={inp} value={form.pincode} onChange={e => field('pincode', e.target.value)} placeholder="411001" maxLength={6} />
                    </div>
                    <div style={{ gridColumn: '1/-1' }}>
                      <label style={lbl}>State *</label>
                      <select style={{ ...inp, appearance: 'auto' }} value={form.state} onChange={e => field('state', e.target.value)}>
                        <option value="">Select State</option>
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div style={{ gridColumn: '1/-1' }}>
                      <label style={lbl}>Landmark</label>
                      <input style={inp} value={form.landmark} onChange={e => field('landmark', e.target.value)} placeholder="Near bus stop, etc. (optional)" />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#555', cursor: 'pointer' }}>
                      <input type="checkbox" checked={saveToProfile} onChange={e => setSaveToProfile(e.target.checked)} />
                      Save to my profile
                    </label>
                    {savedAddresses.length > 0 && (
                      <button
                        onClick={() => { setEditingAddr(false); }}
                        style={{ background: 'none', border: 'none', color: '#FF8C35', fontSize: 13, cursor: 'pointer', padding: 0, fontWeight: 600 }}
                      >
                        ← Use saved address
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Shipping Method card */}
            <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8e8e8', padding: '16px 20px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Shipping Method</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f9f9f9', border: '1px solid #e0e0e0', borderRadius: 8, padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 22 }}>🚚</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>Standard Delivery</div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                      {delivery === 0 ? 'Free delivery on orders above ₹999' : 'Estimated delivery in 3–5 business days'}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: delivery === 0 ? '#27ae60' : '#111' }}>
                  {delivery === 0 ? 'FREE' : `₹${delivery}`}
                </div>
              </div>
            </div>

            {/* Payment Method card */}
            <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8e8e8', padding: '16px 20px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Pay Using</div>

              <div
                onClick={() => setPayMethod('online')}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 8, border: `2px solid ${payMethod === 'online' ? '#FF8C35' : '#e0e0e0'}`, background: payMethod === 'online' ? '#fff8f3' : '#fafafa', cursor: 'pointer', marginBottom: 10 }}
              >
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${payMethod === 'online' ? '#FF8C35' : '#ccc'}`, background: payMethod === 'online' ? '#FF8C35' : 'transparent', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>UPI | Credit | Debit Card | NetBanking | Wallets</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Secured by Cashfree</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['💳', '📱', '🏦'].map(ic => <span key={ic} style={{ fontSize: 18 }}>{ic}</span>)}
                </div>
              </div>

              <div
                onClick={() => setPayMethod('cod')}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 8, border: `2px solid ${payMethod === 'cod' ? '#FF8C35' : '#e0e0e0'}`, background: payMethod === 'cod' ? '#fff8f3' : '#fafafa', cursor: 'pointer' }}
              >
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${payMethod === 'cod' ? '#FF8C35' : '#ccc'}`, background: payMethod === 'cod' ? '#FF8C35' : 'transparent', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>Cash on Delivery</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Pune area only (pincode 411001–411067)</div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN — Order Summary */}
          <div style={{ width: 340, flexShrink: 0 }}>
            <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8e8e8', overflow: 'hidden', position: 'sticky', top: 20 }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>Cart Summary</span>
                <a href="/checkout" style={{ fontSize: 12, color: '#FF8C35', textDecoration: 'none', fontWeight: 600 }}>Edit Cart</a>
              </div>

              {/* Items */}
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 8, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0, overflow: 'hidden' }}>
                      {item.photo
                        ? <img src={item.photo} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : item.emoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#222', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>Qty: {item.qty}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#111', flexShrink: 0 }}>
                      ₹{(parsePrice(item.price) * item.qty).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Billing summary */}
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Billing Summary</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#555' }}>
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#555' }}>
                    <span>Standard Shipping</span>
                    <span style={{ color: delivery === 0 ? '#27ae60' : '#555' }}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#888' }}>
                    <span>Total with GST</span>
                    <span>₹{grandTotal.toLocaleString('en-IN')} <span style={{ fontSize: 11 }}>(Incl. GST)</span></span>
                  </div>
                </div>
              </div>

              {/* Grand total */}
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>Grand Total</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#27ae60' }}>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>

              {/* CTA */}
              <div style={{ padding: '16px 20px' }}>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || cart.length === 0}
                  style={{
                    width: '100%', padding: '14px', borderRadius: 8, border: 'none',
                    background: loading || cart.length === 0 ? '#ccc' : '#FF8C35',
                    color: '#fff', fontSize: 15, fontWeight: 700, cursor: loading || cart.length === 0 ? 'not-allowed' : 'pointer',
                    fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.02em',
                  }}
                >
                  {loading ? 'Placing Order…' : 'Place Order'}
                </button>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10 }}>
                  <span style={{ fontSize: 12 }}>🔒</span>
                  <span style={{ fontSize: 12, color: '#aaa' }}>Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
