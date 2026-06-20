'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { supabase } from '@/lib/supabase';

const FONT_URL =
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan',
  'Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Jammu & Kashmir','Ladakh','Chandigarh','Puducherry','Lakshadweep',
  'Andaman & Nicobar Islands','Dadra & Nagar Haveli','Daman & Diu',
];

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

const STEPS = ['Cart', 'Payment', 'Address', 'Review'];

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

const emptyForm = (): Omit<Address, 'id' | 'isDefault'> => ({
  label: 'Home', name: '', phone: '', email: '', addr1: '', addr2: '',
  city: '', state: '', pincode: '', landmark: '',
});

export default function AddressPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [saveToProfile, setSaveToProfile] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    auth.authStateReady().then(() => {
    unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = '/login?redirect=/checkout/address';
        return;
      }
      const uid = user.uid;
      const email = user.email || '';
      setUserId(uid);
      setUserEmail(email);
      const { data: cust } = await supabase.from('customers').select('address').eq('id', uid).single();
      if (cust && Array.isArray(cust.address) && cust.address.length > 0) {
        setSavedAddresses(cust.address as Address[]);
        const def = (cust.address as Address[]).find(a => a.isDefault);
        setSelectedId(def?.id || (cust.address as Address[])[0]?.id);
        setShowForm(false);
      } else {
        setShowForm(true);
        setForm(prev => ({ ...prev, email }));
      }
      setLoading(false);
    });
    });
    return () => unsubscribe?.();
  }, []);

  function field(key: keyof typeof form, value: string) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleContinue() {
    setError('');
    let addr: Address;

    if (showForm) {
      // Validate
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
      const sel = savedAddresses.find(a => a.id === selectedId);
      if (!sel) { setError('Please select an address.'); return; }
      addr = sel;
    }

    try {
      const existing = JSON.parse(sessionStorage.getItem('kyzer_checkout') || '{}');
      sessionStorage.setItem('kyzer_checkout', JSON.stringify({ ...existing, address: addr }));
    } catch { /* ignore */ }

    window.location.href = '/checkout/review';
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f8f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#666', fontFamily: "'DM Sans', sans-serif" }}>Loading…</span>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)',
    fontSize: 14, color: '#111', background: '#fafaf9', outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 500, color: '#111', marginBottom: 6 };

  return (
    <>
      <link href={FONT_URL} rel="stylesheet" />
      <div style={{ minHeight: '100vh', background: '#f8f8f6', fontFamily: "'DM Sans', sans-serif" }}>
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 90, borderBottom: '0.5px solid rgba(0,0,0,0.09)', background: '#f8f8f6' }}>
          <a href="/" className="logo-anim" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#FF8C35', textDecoration: 'none', letterSpacing: '0.03em' }}>
            KYZER <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.2em', verticalAlign: 'middle', color: '#111' }}>ROBOTICS</span>
          </a>
          <a href="/checkout/payment" style={{ fontSize: 13, color: '#666', textDecoration: 'none' }}>← Back to Payment</a>
        </nav>

        <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 16px' }}>
          <StepBar current={2} />
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: '#111', marginBottom: 24, letterSpacing: '0.04em' }}>Delivery Address</h1>

          {error && (
            <div style={{ background: '#fff0f0', border: '1px solid #ffc5c5', borderRadius: 8, padding: '12px 14px', marginBottom: 20, fontSize: 14, color: '#c0392b' }}>
              {error}
            </div>
          )}

          {/* Saved addresses */}
          {savedAddresses.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111', marginBottom: 12 }}>Saved Addresses</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {savedAddresses.map(addr => (
                  <div
                    key={addr.id}
                    onClick={() => { setSelectedId(addr.id); setShowForm(false); }}
                    style={{
                      background: '#fff', borderRadius: 10,
                      border: `2px solid ${selectedId === addr.id && !showForm ? '#FF8C35' : 'rgba(0,0,0,0.09)'}`,
                      padding: '14px 16px', cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", background: '#f2f0eb', padding: '2px 8px', borderRadius: 4, color: '#666', marginBottom: 8, display: 'inline-block' }}>{addr.label}</span>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{addr.name}</div>
                        <div style={{ fontSize: 13, color: '#555', marginTop: 2 }}>{addr.addr1}{addr.addr2 ? ', ' + addr.addr2 : ''}</div>
                        <div style={{ fontSize: 13, color: '#555' }}>{addr.city}, {addr.state} – {addr.pincode}</div>
                        <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>📱 {addr.phone}</div>
                      </div>
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%', border: '2px solid',
                        borderColor: selectedId === addr.id && !showForm ? '#FF8C35' : '#ccc',
                        background: selectedId === addr.id && !showForm ? '#FF8C35' : 'transparent',
                        flexShrink: 0,
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => { setShowForm(true); setSelectedId(null); setForm({ ...emptyForm(), email: userEmail }); }}
                style={{ marginTop: 12, background: 'none', border: '1px dashed rgba(0,0,0,0.18)', borderRadius: 8, padding: '10px 16px', fontSize: 13, color: '#555', cursor: 'pointer', width: '100%' }}
              >
                + Add New Address
              </button>
            </div>
          )}

          {/* Address form */}
          {showForm && (
            <div style={{ background: '#fff', borderRadius: 10, border: '1px solid rgba(0,0,0,0.09)', padding: '24px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111', marginBottom: 20 }}>
                {savedAddresses.length > 0 ? 'New Address' : 'Delivery Details'}
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={labelStyle}>Full Name *</label>
                  <input style={inputStyle} value={form.name} onChange={e => field('name', e.target.value)} placeholder="Rahul Sharma" />
                </div>
                <div>
                  <label style={labelStyle}>Phone * (10 digits)</label>
                  <input style={inputStyle} value={form.phone} onChange={e => field('phone', e.target.value)} placeholder="9876543210" maxLength={10} />
                </div>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input style={inputStyle} value={form.email} onChange={e => field('email', e.target.value)} placeholder="you@example.com" />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={labelStyle}>Address Line 1 *</label>
                  <input style={inputStyle} value={form.addr1} onChange={e => field('addr1', e.target.value)} placeholder="Flat/House No., Street" />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={labelStyle}>Address Line 2</label>
                  <input style={inputStyle} value={form.addr2} onChange={e => field('addr2', e.target.value)} placeholder="Area, Colony (optional)" />
                </div>
                <div>
                  <label style={labelStyle}>City *</label>
                  <input style={inputStyle} value={form.city} onChange={e => field('city', e.target.value)} placeholder="Pune" />
                </div>
                <div>
                  <label style={labelStyle}>Pincode * (6 digits)</label>
                  <input style={inputStyle} value={form.pincode} onChange={e => field('pincode', e.target.value)} placeholder="411001" maxLength={6} />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={labelStyle}>State *</label>
                  <select style={{ ...inputStyle, appearance: 'auto' }} value={form.state} onChange={e => field('state', e.target.value)}>
                    <option value="">Select State</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={labelStyle}>Landmark</label>
                  <input style={inputStyle} value={form.landmark} onChange={e => field('landmark', e.target.value)} placeholder="Near bus stop, etc. (optional)" />
                </div>
              </div>

              {/* Address type */}
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Address Type</label>
                <div style={{ display: 'flex', gap: 12 }}>
                  {['Home', 'Office', 'Other'].map(type => (
                    <label key={type} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 14, color: '#555' }}>
                      <input type="radio" name="addrType" value={type} checked={form.label === type} onChange={() => field('label', type)} />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              {/* Save checkbox */}
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#555', marginBottom: 4 }}>
                <input type="checkbox" checked={saveToProfile} onChange={e => setSaveToProfile(e.target.checked)} />
                Save this address to my profile
              </label>

              {savedAddresses.length > 0 && (
                <button
                  onClick={() => { setShowForm(false); setSelectedId(savedAddresses[0]?.id || null); }}
                  style={{ marginTop: 12, background: 'none', border: 'none', color: '#FF8C35', cursor: 'pointer', fontSize: 13, padding: 0 }}
                >
                  ← Use a saved address
                </button>
              )}
            </div>
          )}

          <button
            onClick={handleContinue}
            style={{ width: '100%', marginTop: 20, padding: '13px', background: '#FF8C35', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
          >
            Continue to Review →
          </button>
        </div>
      </div>
    </>
  );
}

