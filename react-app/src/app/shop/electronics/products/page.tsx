'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { addToLocalCart, buyNow } from '@/lib/shopCart';

interface ElecProduct {
  id: string;
  name: string;
  price: string;
  description: string;
  details: string;
  specs: string[];
  subcat: string;
  type?: string;
  badge: string;
  badgeType: string;
  emoji: string;
  photos?: string[];
  visible: boolean;
  category: string;
  btnMode?: string;
}

const SUBCATS = [
  { key: 'all',          label: 'All' },
  { key: 'arduino',      label: 'Arduino' },
  { key: 'raspberry-pi', label: 'Raspberry Pi' },
  { key: 'sensors',      label: 'Sensors' },
  { key: 'motors',       label: 'Motors' },
  { key: 'components',   label: 'Components' },
  { key: 'tools',        label: 'Tools' },
];

export default function ElectronicsProductsPage() {
  const [products, setProducts] = useState<ElecProduct[]>([]);
  const [loading, setLoading]   = useState(true);
  const [fSub, setFSub]         = useState('all');
  const [fType, setFType]       = useState('');
  const [search, setSearch]     = useState('');
  const [sort, setSort]         = useState('default');
  const [selected, setSelected] = useState<ElecProduct | null>(null);
  const [addedId, setAddedId]   = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat  = params.get('cat');
    const type = params.get('type');
    if (cat)  setFSub(cat);
    if (type) setFType(type);
  }, []);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://alrgkykezmlcagovkkdl.supabase.co';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFscmdreWtlem1sY2Fnb3Zra2RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MjIxMjMsImV4cCI6MjA5NTE5ODEyM30.g_UjIRnjov6cUAkwjlifL2kDUzh1G7cpsThj6Ygq83U';
    fetch(`${url}/rest/v1/site_data?id=eq.1&select=products`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    })
      .then(r => r.json())
      .then(data => {
        const prods: ElecProduct[] = (data?.[0]?.products || []).filter(
          (p: ElecProduct) => p.category === 'electronics' && p.visible
        );
        setProducts(prods);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = products
    .filter(p => {
      if (fSub !== 'all' && p.subcat !== fSub) return false;
      if (fType && p.type !== fType) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
          !p.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'price-asc')  return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
      if (sort === 'price-desc') return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
      return 0;
    });

  function handleAddToCart(p: ElecProduct) {
    addToLocalCart(p);
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  }

  function enquireNow(p: ElecProduct) {
    const msg = encodeURIComponent(`Hi, I'd like to enquire about: ${p.name} (${p.price})`);
    window.open(`https://wa.me/919049695264?text=${msg}`, '_blank');
  }

  const subcatLabel: Record<string, string> = {
    arduino: 'Arduino', 'raspberry-pi': 'Raspberry Pi', sensors: 'Sensors & Modules',
    motors: 'Motors & Actuators', components: 'Components', tools: 'Tools & Equipment',
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#f8f8f6', minHeight: '100vh', color: '#111' }}>
      {/* Top bar */}
      <div style={{ background: '#111', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <Link href="/" style={{ color: '#FF8C35', fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, textDecoration: 'none', letterSpacing: 1 }}>KYZER ROBOTICS</Link>
        <span style={{ color: '#444', fontSize: 18 }}>›</span>
        <Link href="/shop/electronics" style={{ color: '#999', fontSize: 13, textDecoration: 'none' }}>Electronics</Link>
        <span style={{ color: '#444', fontSize: 18 }}>›</span>
        <span style={{ color: '#FF8C35', fontSize: 13 }}>{fSub === 'all' ? 'All Products' : (subcatLabel[fSub] || fSub)}</span>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#FF8C35', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>// Electronics</div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, letterSpacing: 2, margin: '0 0 12px' }}>
            {fSub === 'all' ? 'All Electronics' : (subcatLabel[fSub] || fSub)}
          </h1>
        </div>

        {/* Category filter tabs */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {SUBCATS.map(s => (
            <button key={s.key} onClick={() => setFSub(s.key)}
              style={{ padding: '7px 16px', borderRadius: 20, border: '1.5px solid', fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: fSub === s.key ? 600 : 400,
                background: fSub === s.key ? '#FF8C35' : '#fff', borderColor: fSub === s.key ? '#FF8C35' : '#ddd', color: fSub === s.key ? '#111' : '#555', transition: 'all 0.15s' }}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Search + Sort */}
        <div style={{ display: 'flex', gap: 12, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <input type="text" placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 200, padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: 10, fontSize: 14, fontFamily: "'DM Sans', sans-serif", background: '#fff', outline: 'none' }} />
          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{ padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: 10, fontSize: 14, fontFamily: "'DM Sans', sans-serif", background: '#fff', cursor: 'pointer' }}>
            <option value="default">Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
        </div>

        <div style={{ fontSize: 13, color: '#888', marginBottom: '1.5rem' }}>
          {loading ? 'Loading…' : `Showing ${filtered.length} of ${products.length} products`}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>Loading products…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
            {products.length === 0 ? 'No electronics products added yet. Add them via the admin panel.' : 'No products match your search.'}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            {filtered.map(p => {
              const photo = p.photos?.[0];
              const priceNum = parseFloat(p.price);
              return (
                <div key={p.id} onClick={() => setSelected(p)}
                  style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 14, overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s', position: 'relative' }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
                  {p.badge && (
                    <div style={{ position: 'absolute', top: 10, left: 10, background: p.badgeType === 'new' ? '#FF8C35' : '#111', color: '#fff', fontSize: 10, fontFamily: "'JetBrains Mono', monospace", padding: '3px 8px', borderRadius: 4, zIndex: 1 }}>{p.badge}</div>
                  )}
                  <div style={{ height: 170, background: '#f4f4f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56 }}>
                    {photo ? <img src={photo} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 16 }} /> : p.emoji || '🔌'}
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: 10, color: '#FF8C35', fontFamily: "'JetBrains Mono', monospace", marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {subcatLabel[p.subcat] || 'Electronics'}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6, lineHeight: 1.3 }}>{p.name}</div>
                    <div style={{ fontSize: 13, color: '#666', marginBottom: 12, lineHeight: 1.5 }}>{p.description}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span style={{ fontWeight: 700, fontSize: 17 }}>{priceNum > 0 ? `₹${priceNum.toLocaleString('en-IN')}` : p.price}</span>
                      <span style={{ fontSize: 11, color: '#888' }}>Incl. GST</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {p.btnMode === 'enquire' ? (
                        <button onClick={e => { e.stopPropagation(); enquireNow(p); }}
                          style={{ flex: 1, padding: '9px 6px', background: '#FF8C35', border: 'none', color: '#111', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                          Enquire Now →
                        </button>
                      ) : (
                        <>
                          <button onClick={e => { e.stopPropagation(); handleAddToCart(p); }}
                            style={{ flex: 1, padding: '9px 6px', background: addedId === p.id ? '#e8f5e9' : 'transparent', border: `1.5px solid ${addedId === p.id ? '#2e7d32' : '#FF8C35'}`, color: addedId === p.id ? '#2e7d32' : '#FF8C35', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' }}>
                            {addedId === p.id ? '✓ Added!' : '+ Cart'}
                          </button>
                          <button onClick={e => { e.stopPropagation(); buyNow(p); }}
                            style={{ flex: 1, padding: '9px 6px', background: '#FF8C35', border: 'none', color: '#111', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                            Buy Now →
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, maxWidth: 560, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#FF8C35', textTransform: 'uppercase' }}>{subcatLabel[selected.subcat] || 'Electronics'}</span>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>✕</button>
            </div>
            <div style={{ height: 200, background: '#f4f4f2', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72, marginBottom: 16 }}>
              {selected.photos?.[0] ? <img src={selected.photos[0]} alt={selected.name} style={{ height: '100%', objectFit: 'contain' }} /> : selected.emoji || '🔌'}
            </div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 1, margin: '0 0 8px' }}>{selected.name}</h2>
            <p style={{ color: '#555', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{selected.details}</p>
            <ul style={{ margin: '0 0 20px', paddingLeft: 20 }}>
              {selected.specs?.map((s, i) => <li key={i} style={{ fontSize: 13, color: '#444', marginBottom: 4 }}>{s}</li>)}
            </ul>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: 1 }}>
                {parseFloat(selected.price) > 0 ? `₹${parseFloat(selected.price).toLocaleString('en-IN')}` : selected.price}
              </span>
              <span style={{ fontSize: 12, color: '#888' }}>Incl. GST · excl. shipping</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {selected.btnMode === 'enquire' ? (
                <button onClick={() => enquireNow(selected)} style={{ flex: 1, padding: '13px', background: '#FF8C35', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", color: '#111' }}>Enquire Now →</button>
              ) : (
                <>
                  <button onClick={() => { handleAddToCart(selected); }}
                    style={{ flex: 1, padding: '13px', background: addedId === selected.id ? '#e8f5e9' : '#111', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", color: addedId === selected.id ? '#2e7d32' : '#fff', transition: 'all 0.2s' }}>
                    {addedId === selected.id ? '✓ Added to Cart!' : 'Add to Cart'}
                  </button>
                  <button onClick={() => buyNow(selected)} style={{ flex: 1, padding: '13px', background: '#FF8C35', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", color: '#111' }}>Buy Now →</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
