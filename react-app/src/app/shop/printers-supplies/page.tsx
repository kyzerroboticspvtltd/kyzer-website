'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { addToLocalCart, buyNow } from '@/lib/shopCart';

interface Supply {
  id: string;
  name: string;
  price: string;
  description: string;
  details: string;
  specs: string[];
  subcat: string;
  badge: string;
  badgeType: string;
  emoji: string;
  photos?: string[];
  visible: boolean;
  category: string;
  btnMode?: string;
}

const SUBCATS = [
  { key: 'all',       label: 'All' },
  { key: 'printer',   label: '3D Printers' },
  { key: 'filament',  label: 'Filaments' },
  { key: 'component', label: 'Components' },
];

const SORT_OPTIONS = [
  { key: 'default',    label: 'Default' },
  { key: 'price-asc',  label: 'Price: Low → High' },
  { key: 'price-desc', label: 'Price: High → Low' },
];

export default function PrintersSuppliesPage() {
  const [products, setProducts] = useState<Supply[]>([]);
  const [loading, setLoading]   = useState(true);
  const [fSub, setFSub]         = useState('all');
  const [sort, setSort]         = useState('default');
  const [search, setSearch]     = useState('');
  const [selected, setSelected] = useState<Supply | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const subcat = params.get('subcat');
    if (subcat) setFSub(subcat);
  }, []);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://alrgkykezmlcagovkkdl.supabase.co';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFscmdreWtlem1sY2Fnb3Zra2RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MjIxMjMsImV4cCI6MjA5NTE5ODEyM30.g_UjIRnjov6cUAkwjlifL2kDUzh1G7cpsThj6Ygq83U';
    fetch(`${url}/rest/v1/site_data?id=eq.1&select=products`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    })
      .then(r => r.json())
      .then(data => {
        const prods: Supply[] = (data?.[0]?.products || []).filter(
          (p: Supply) => p.category === '3dprint' && p.visible
        );
        setProducts(prods);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = products
    .filter(p => {
      if (fSub !== 'all' && p.subcat !== fSub) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
          !p.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'price-asc')  return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
      if (sort === 'price-desc') return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
      return 0;
    });

  const [addedId, setAddedId] = useState<string | null>(null);

  function handleAddToCart(p: Supply) {
    addToLocalCart(p);
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  }

  function enquireNow(p: Supply) {
    const msg = encodeURIComponent(`Hi, I'd like to enquire about: ${p.name} (${p.price})`);
    window.open(`https://wa.me/919049695264?text=${msg}`, '_blank');
  }

  const subcatLabel: Record<string, string> = {
    printer: '3D Printer', filament: 'Filament', component: 'Component',
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#f8f8f6', minHeight: '100vh', color: '#111' }}>
      {/* Top bar */}
      <div style={{ background: '#111', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link href="/" style={{ color: '#FF8C35', fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, textDecoration: 'none', letterSpacing: 1 }}>
          KYZER ROBOTICS
        </Link>
        <span style={{ color: '#444', fontSize: 18 }}>›</span>
        <Link href="/shop/printing" style={{ color: '#999', fontSize: 13, textDecoration: 'none' }}>3D Printing</Link>
        <span style={{ color: '#444', fontSize: 18 }}>›</span>
        <span style={{ color: '#FF8C35', fontSize: 13 }}>Printers & Supplies</span>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#FF8C35', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
            // HARDWARE & CONSUMABLES
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, letterSpacing: 2, margin: '0 0 12px' }}>Printers & Supplies</h1>
          <p style={{ color: '#555', maxWidth: 780, lineHeight: 1.7, margin: '0 0 6px' }}>
            FDM 3D printers, engineering-grade filaments, and upgrade components — everything you need to build and run
            your own print setup. All hardware is tested and sourced from trusted manufacturers.
          </p>
          <p style={{ color: '#555', maxWidth: 780, lineHeight: 1.7 }}>
            Bulk filament orders and custom hardware sourcing available. Contact us on WhatsApp for pricing.
          </p>
        </div>

        {/* Search + Sort */}
        <div style={{ display: 'flex', gap: 12, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <input
            type="text" placeholder="Search printers & supplies…" value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 200, padding: '10px 16px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, background: '#fff', outline: 'none' }}
          />
          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{ padding: '10px 16px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, background: '#fff', cursor: 'pointer' }}>
            {SORT_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
          </select>
        </div>

        {/* Filter panel */}
        <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: '1.25rem 1.5rem', marginBottom: '2rem' }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Filter</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', minWidth: 90 }}>Category</span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {SUBCATS.map(opt => (
                <button key={opt.key} onClick={() => setFSub(opt.key)}
                  style={{ padding: '5px 14px', borderRadius: 999, border: '1px solid', cursor: 'pointer', fontSize: 12, fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s',
                    background: fSub === opt.key ? '#FF8C35' : '#f4f4f4',
                    borderColor: fSub === opt.key ? '#FF8C35' : '#e0e0e0',
                    color: fSub === opt.key ? '#111' : '#555',
                    fontWeight: fSub === opt.key ? 600 : 400,
                  }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div style={{ fontSize: 13, color: '#888', marginBottom: '1.5rem' }}>
          Showing {filtered.length} of {products.length} products
        </div>

        {/* Product grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>Loading products…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>No products match your filters.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
            {filtered.map(p => {
              const photo = p.photos?.[0];
              const priceNum = parseFloat(p.price);
              return (
                <div key={p.id} onClick={() => setSelected(p)}
                  style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s', position: 'relative' }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
                  {p.badge && (
                    <div style={{ position: 'absolute', top: 10, left: 10, background: p.badgeType === 'new' ? '#FF8C35' : '#111', color: '#fff', fontSize: 10, fontFamily: "'JetBrains Mono', monospace", padding: '3px 8px', borderRadius: 4, letterSpacing: '0.08em', zIndex: 1 }}>
                      {p.badge}
                    </div>
                  )}
                  <div style={{ height: 180, background: '#f4f4f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56, overflow: 'hidden' }}>
                    {photo ? <img src={photo} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 16 }} /> : <span style={{ fontSize: 56 }}>{p.emoji}</span>}
                  </div>
                  <div style={{ padding: '14px 16px 12px' }}>
                    <div style={{ fontSize: 11, color: '#FF8C35', fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>
                      {p.subcat ? subcatLabel[p.subcat] || p.subcat : 'Supply'}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, lineHeight: 1.3 }}>{p.name}</div>
                    <div style={{ fontSize: 13, color: '#666', marginBottom: 10, lineHeight: 1.5 }}>{p.description}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 700, fontSize: 17, color: '#111' }}>
                        {priceNum > 0 ? `₹${priceNum.toLocaleString('en-IN')}` : p.price || 'On request'}
                      </span>
                      <span style={{ fontSize: 11, color: '#888' }}>Incl. GST</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', borderTop: '1px solid #e8e8e8' }}>
                    {p.btnMode === 'enquire' ? (
                      <button onClick={e => { e.stopPropagation(); enquireNow(p); }}
                        style={{ flex: 1, padding: '10px 6px', background: '#FF8C35', border: 'none', color: '#111', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                        Enquire Now →
                      </button>
                    ) : (
                      <>
                        <button onClick={e => { e.stopPropagation(); handleAddToCart(p); }}
                          style={{ flex: 1, padding: '10px 6px', background: addedId === p.id ? '#e8f5e9' : 'transparent', border: 'none', borderRight: `1px solid ${addedId === p.id ? '#c8e6c9' : '#e8e8e8'}`, color: addedId === p.id ? '#2e7d32' : '#FF8C35', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' }}>
                          {addedId === p.id ? '✓ Added!' : '+ Cart'}
                        </button>
                        <button onClick={e => { e.stopPropagation(); buyNow(p); }}
                          style={{ flex: 1, padding: '10px 6px', background: '#FF8C35', border: 'none', color: '#111', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                          Buy Now →
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cross-links */}
        <div style={{ marginTop: '3rem', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 240, padding: '1.25rem 1.5rem', background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#FF8C35', marginBottom: 4 }}>// ALSO AVAILABLE</div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Need something printed?</div>
              <div style={{ color: '#666', fontSize: 13, marginTop: 3 }}>Order a custom print — any material, any size.</div>
            </div>
            <Link href="/shop/3d-printing" style={{ padding: '9px 16px', background: '#111', color: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>Print Services →</Link>
          </div>
          <div style={{ flex: 1, minWidth: 240, padding: '1.25rem 1.5rem', background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#FF8C35', marginBottom: 4 }}>// ALSO AVAILABLE</div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Have an idea to prototype?</div>
              <div style={{ color: '#666', fontSize: 13, marginTop: 3 }}>48-hour design-to-delivery sprints.</div>
            </div>
            <Link href="/shop/prototyping" style={{ padding: '9px 16px', background: '#111', color: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>Prototyping →</Link>
          </div>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div onClick={() => setSelected(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 16, maxWidth: 560, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#FF8C35', textTransform: 'uppercase' }}>
                {selected.subcat ? subcatLabel[selected.subcat] || selected.subcat : 'Supply'}
              </span>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>✕</button>
            </div>
            <div style={{ height: 220, background: '#f4f4f2', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72, marginBottom: 16, overflow: 'hidden' }}>
              {selected.photos?.[0] ? <img src={selected.photos[0]} alt={selected.name} style={{ height: '100%', objectFit: 'contain' }} /> : <span style={{ fontSize: 72 }}>{selected.emoji}</span>}
            </div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 1, margin: '0 0 8px' }}>{selected.name}</h2>
            <p style={{ color: '#555', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{selected.details}</p>
            <ul style={{ margin: '0 0 20px', paddingLeft: 20 }}>
              {selected.specs?.map((s, i) => <li key={i} style={{ fontSize: 13, color: '#444', marginBottom: 4 }}>{s}</li>)}
            </ul>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: 1 }}>
                {parseFloat(selected.price) > 0 ? `₹${parseFloat(selected.price).toLocaleString('en-IN')}` : selected.price || 'On request'}
              </span>
              <span style={{ fontSize: 12, color: '#888' }}>Incl. GST · excl. shipping</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {selected.btnMode === 'enquire' ? (
                <button onClick={() => enquireNow(selected)}
                  style={{ flex: 1, padding: '13px', background: '#FF8C35', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", color: '#111' }}>
                  Enquire Now →
                </button>
              ) : (
                <>
                  <button onClick={() => { addToLocalCart(selected); setAddedId(selected.id); setTimeout(() => setAddedId(null), 1500); }}
                    style={{ flex: 1, padding: '13px', background: addedId === selected.id ? '#e8f5e9' : '#111', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", color: addedId === selected.id ? '#2e7d32' : '#fff', transition: 'all 0.2s' }}>
                    {addedId === selected.id ? '✓ Added to Cart!' : 'Add to Cart'}
                  </button>
                  <button onClick={() => buyNow(selected)}
                    style={{ flex: 1, padding: '13px', background: '#FF8C35', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", color: '#111' }}>
                    Buy Now →
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
