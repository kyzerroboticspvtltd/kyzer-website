'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
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

const emptyForm = (): Omit<Address, 'id' | 'isDefault'> => ({
  label: 'Home', name: '', phone: '', email: '', addr1: '', addr2: '',
  city: '', state: '', pincode: '', landmark: '',
});

export default function ProfilePage() {
  const [tab, setTab] = useState<'addresses' | 'settings'>('addresses');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    auth.authStateReady().then(() => {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user) {
          window.location.href = '/login?redirect=/profile';
          return;
        }
        setUserId(user.uid);
        setUserEmail(user.email || '');
        setUserName(user.displayName || user.email?.split('@')[0] || 'User');

        const { data: cust } = await supabase.from('customers').select('address').eq('id', user.uid).single();
        if (cust && Array.isArray(cust.address)) {
          setAddresses(cust.address as Address[]);
        }
        setLoading(false);
      });
    });
    return () => unsubscribe?.();
  }, []);

  async function saveAddresses(updated: Address[]) {
    setSaving(true);
    setAddresses(updated);
    await supabase.from('customers').upsert({ id: userId, address: updated }, { onConflict: 'id' });
    setSaving(false);
  }

  async function handleDelete(id: string) {
    await saveAddresses(addresses.filter(a => a.id !== id));
  }

  async function handleSetDefault(id: string) {
    await saveAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
  }

  function startEdit(addr: Address) {
    setEditingId(addr.id);
    setAddingNew(false);
    setFormError('');
    setForm({
      label: addr.label, name: addr.name, phone: addr.phone, email: addr.email,
      addr1: addr.addr1, addr2: addr.addr2, city: addr.city, state: addr.state,
      pincode: addr.pincode, landmark: addr.landmark,
    });
  }

  function startNew() {
    setAddingNew(true);
    setEditingId(null);
    setFormError('');
    setForm({ ...emptyForm(), email: userEmail });
  }

  function cancelForm() {
    setEditingId(null);
    setAddingNew(false);
    setFormError('');
  }

  async function handleSaveForm() {
    setFormError('');
    if (!form.name.trim()) { setFormError('Full name is required.'); return; }
    if (!/^\d{10}$/.test(form.phone)) { setFormError('Phone must be 10 digits.'); return; }
    if (!form.addr1.trim()) { setFormError('Address line 1 is required.'); return; }
    if (!form.city.trim()) { setFormError('City is required.'); return; }
    if (!form.state) { setFormError('State is required.'); return; }
    if (!/^\d{6}$/.test(form.pincode)) { setFormError('Pincode must be 6 digits.'); return; }

    if (editingId) {
      const updated = addresses.map(a =>
        a.id === editingId ? { ...a, ...form } : a
      );
      await saveAddresses(updated);
    } else {
      const newAddr: Address = { ...form, id: 'addr-' + Date.now(), isDefault: addresses.length === 0 };
      await saveAddresses([...addresses, newAddr]);
    }
    cancelForm();
  }

  async function handleSignOut() {
    await signOut(auth);
    window.location.href = '/';
  }

  const initials = userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

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
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 60, borderBottom: '0.5px solid rgba(0,0,0,0.09)', background: '#f8f8f6' }}>
          <a href="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#FF8C35', textDecoration: 'none', letterSpacing: '0.03em' }}>
            KYZER <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.2em', verticalAlign: 'middle', color: '#111' }}>ROBOTICS</span>
          </a>
          <a href="/" style={{ fontSize: 13, color: '#666', textDecoration: 'none' }}>← Back to home</a>
        </nav>

        <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 16px' }}>
          {/* User header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#FF8C35', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: '0.06em' }}>
              {initials || '?'}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#111' }}>{userName}</div>
              <div style={{ fontSize: 13, color: '#666' }}>{userEmail}</div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '1px solid rgba(0,0,0,0.09)' }}>
            {[{ key: 'addresses', label: '📍 Addresses' }, { key: 'settings', label: '⚙️ Settings' }].map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key as 'addresses' | 'settings')}
                style={{
                  padding: '10px 18px', border: 'none', background: 'none', cursor: 'pointer',
                  fontSize: 14, fontWeight: tab === t.key ? 600 : 400,
                  color: tab === t.key ? '#FF8C35' : '#666',
                  borderBottom: `2px solid ${tab === t.key ? '#FF8C35' : 'transparent'}`,
                  marginBottom: -1, fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Addresses tab */}
          {tab === 'addresses' && (
            <div>
              {addresses.length === 0 && !addingNew && (
                <div style={{ textAlign: 'center', padding: '48px 20px', color: '#888' }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>📍</div>
                  <p style={{ fontSize: 14 }}>No saved addresses yet.</p>
                </div>
              )}

              {addresses.map(addr => (
                <div key={addr.id} style={{ background: '#fff', borderRadius: 10, border: '1px solid rgba(0,0,0,0.09)', padding: '16px', marginBottom: 12 }}>
                  {editingId === addr.id ? (
                    // Edit form
                    <div>
                      <h4 style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 14 }}>Edit Address</h4>
                      {formError && <div style={{ color: '#c0392b', fontSize: 13, marginBottom: 12 }}>{formError}</div>}
                      <AddressFormFields form={form} setForm={setForm} inputStyle={inputStyle} labelStyle={labelStyle} />
                      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                        <button onClick={handleSaveForm} disabled={saving} style={{ padding: '9px 20px', background: '#FF8C35', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                          {saving ? 'Saving…' : 'Save'}
                        </button>
                        <button onClick={cancelForm} style={{ padding: '9px 20px', background: 'none', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 8, fontSize: 13, cursor: 'pointer', color: '#555' }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", background: '#f2f0eb', padding: '2px 8px', borderRadius: 4, color: '#666' }}>{addr.label}</span>
                          {addr.isDefault && <span style={{ fontSize: 11, color: '#27ae60', fontWeight: 600 }}>Default</span>}
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{addr.name}</div>
                        <div style={{ fontSize: 13, color: '#555', marginTop: 2 }}>{addr.addr1}{addr.addr2 ? ', ' + addr.addr2 : ''}</div>
                        <div style={{ fontSize: 13, color: '#555' }}>{addr.city}, {addr.state} – {addr.pincode}</div>
                        <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>📱 {addr.phone}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                        <button onClick={() => startEdit(addr)} style={{ background: 'none', border: 'none', color: '#FF8C35', cursor: 'pointer', fontSize: 13, fontWeight: 500, padding: 0 }}>Edit</button>
                        <button onClick={() => handleDelete(addr.id)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: 13, padding: 0 }}>Delete</button>
                        {!addr.isDefault && (
                          <button onClick={() => handleSetDefault(addr.id)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 12, padding: 0 }}>Set Default</button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Add new form */}
              {addingNew && (
                <div style={{ background: '#fff', borderRadius: 10, border: '1px solid rgba(0,0,0,0.09)', padding: '20px', marginBottom: 12 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 14 }}>Add New Address</h4>
                  {formError && <div style={{ color: '#c0392b', fontSize: 13, marginBottom: 12 }}>{formError}</div>}
                  <AddressFormFields form={form} setForm={setForm} inputStyle={inputStyle} labelStyle={labelStyle} />
                  <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                    <button onClick={handleSaveForm} disabled={saving} style={{ padding: '9px 20px', background: '#FF8C35', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      {saving ? 'Saving…' : 'Save Address'}
                    </button>
                    <button onClick={cancelForm} style={{ padding: '9px 20px', background: 'none', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 8, fontSize: 13, cursor: 'pointer', color: '#555' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {!addingNew && editingId === null && (
                <button
                  onClick={startNew}
                  style={{ width: '100%', padding: '12px', background: 'none', border: '1px dashed rgba(0,0,0,0.18)', borderRadius: 8, fontSize: 14, color: '#555', cursor: 'pointer' }}
                >
                  + Add New Address
                </button>
              )}
            </div>
          )}

          {/* Settings tab */}
          {tab === 'settings' && (
            <div style={{ background: '#fff', borderRadius: 10, border: '1px solid rgba(0,0,0,0.09)', padding: '24px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111', marginBottom: 20 }}>Account Details</h3>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Full Name</label>
                <div style={{ ...inputStyle, color: '#555', cursor: 'default', background: '#f5f5f3' } as React.CSSProperties}>{userName}</div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Email</label>
                <div style={{ ...inputStyle, color: '#555', cursor: 'default', background: '#f5f5f3' } as React.CSSProperties}>{userEmail}</div>
              </div>

              <div style={{ borderTop: '1px solid rgba(0,0,0,0.09)', paddingTop: 20 }}>
                <button
                  onClick={handleSignOut}
                  style={{ padding: '11px 24px', background: '#fff', border: '1.5px solid #e74c3c', borderRadius: 8, color: '#e74c3c', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Extracted form fields component to avoid duplication
function AddressFormFields({
  form,
  setForm,
  inputStyle,
  labelStyle,
}: {
  form: Omit<Address, 'id' | 'isDefault'>;
  setForm: React.Dispatch<React.SetStateAction<Omit<Address, 'id' | 'isDefault'>>>;
  inputStyle: React.CSSProperties;
  labelStyle: React.CSSProperties;
}) {
  function field(key: keyof typeof form, value: string) {
    setForm(prev => ({ ...prev, [key]: value }));
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <div style={{ gridColumn: '1/-1' }}>
        <label style={labelStyle}>Full Name *</label>
        <input style={inputStyle} value={form.name} onChange={e => field('name', e.target.value)} placeholder="Rahul Sharma" />
      </div>
      <div>
        <label style={labelStyle}>Phone * (10 digits)</label>
        <input style={inputStyle} value={form.phone} onChange={e => field('phone', e.target.value)} placeholder="9876543210" maxLength={10} />
      </div>
      <div>
        <label style={labelStyle}>Email</label>
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
        <select style={{ ...inputStyle, appearance: 'auto' } as React.CSSProperties} value={form.state} onChange={e => field('state', e.target.value)}>
          <option value="">Select State</option>
          {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div style={{ gridColumn: '1/-1' }}>
        <label style={labelStyle}>Landmark</label>
        <input style={inputStyle} value={form.landmark} onChange={e => field('landmark', e.target.value)} placeholder="Near bus stop, etc. (optional)" />
      </div>
      <div style={{ gridColumn: '1/-1' }}>
        <label style={labelStyle}>Address Type</label>
        <div style={{ display: 'flex', gap: 14 }}>
          {['Home', 'Office', 'Other'].map(type => (
            <label key={type} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 14, color: '#555' }}>
              <input type="radio" name="profileAddrType" value={type} checked={form.label === type} onChange={() => field('label', type)} />
              {type}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
