'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface PrintProduct {
  id: string;
  name: string;
  price: string;
  description: string;
  details: string;
  specs: string[];
  material: string;
  printType: string;
  badge: string;
  badgeType: string;
  emoji: string;
  photos?: string[];
  visible: boolean;
  subcat: string;
  category: string;
}

const MATERIALS = [
  { key: 'all',    label: 'All Materials' },
  { key: 'pla',    label: 'PLA' },
  { key: 'petg',   label: 'PETG' },
  { key: 'abs',    label: 'ABS' },
  { key: 'nylon',  label: 'Nylon (PA12)' },
  { key: 'tpu',    label: 'TPU Flex' },
];

const PRINT_TYPES = [
  { key: 'all',        label: 'All Types' },
  { key: 'functional', label: '⚙️ Functional Parts' },
  { key: 'enclosure',  label: '📦 Enclosures' },
  { key: 'prototype',  label: '🔬 Prototype' },
  { key: 'custom',     label: '✏️ Custom' },
];

const SORT_OPTIONS = [
  { key: 'default',    label: 'Default' },
  { key: 'price-asc',  label: 'Price: Low → High' },
  { key: 'price-desc', label: 'Price: High → Low' },
];

export default function PrintingPage() {
  const [products, setProducts] = useState<PrintProduct[]>([]);
  const [loading, setLoading]   = useState(true);
  const [fMat, setFMat]         = useState('all');
  const [fType, setFType]       = useState('all');
  const [sort, setSort]         = useState('default');
  const [search, setSearch]     = useState('');
  const [selected, setSelected] = useState<PrintProduct | null>(null);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) { setLoading(false); return; }
    fetch(`${url}/rest/v1/site_data?id=eq.1&select=products`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    })
      .then(r => r.json())
      .then(data => {
        const prods: PrintProduct[] = (data?.[0]?.products || []).filter(
          (p: PrintProduct) => p.category === 'print' && p.visible
        );
        setProducts(prods);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = products
    .filter(p => {
      if (fMat  !== 'all' && p.material  !== fMat)  return false;
      if (fType !== 'all' && p.printType !== fType) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
          !p.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'price-asc')  return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
      if (sort === 'price-desc') return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
      return 0;
    });

  function whatsappOrder(p: PrintProduct) {
    const msg = encodeURIComponent(`Hi, I'd like to order *${p.name}* (${p.price}) from Kyzer Robotics. Please share details and turnaround time.`);
    window.open(`https://wa.me/919049695264?text=${msg}`, '_blank');
  }

  const matLabel: Record<string, string> = {
    pla: 'PLA', petg: 'PETG', abs: 'ABS', nylon: 'Nylon (PA12)', tpu: 'TPU Flex',
    'carbon-fiber': 'Carbon Fiber PLA', 'glass-fiber': 'Glass Fiber',
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#f8f8f6', minHeight: '100vh', color: '#111' }}>
      {/* Top bar */}
      <div style={{ background: '#111', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link href="/" style={{ color: '#FF8C35', fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, textDecoration: 'none', letterSpacing: 1 }}>
          KYZER ROBOTICS
        </Link>
        <span style={{ color: '#444', fontSize: 18 }}>›</span>
        <Link href="/#shop" style={{ color: '#999', fontSize: 13, textDecoration: 'none' }}>Shop</Link>
        <span style={{ color: '#444', fontSize: 18 }}>›</span>
        <span style={{ color: '#FF8C35', fontSize: 13 }}>3D Print Services</span>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#FF8C35', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
            // MANUFACTURING SERVICES
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, letterSpacing: 2, margin: '0 0 12px' }}>3D Print Services</h1>
          <p style={{ color: '#555', maxWidth: 780, lineHeight: 1.7, margin: '0 0 6px' }}>
            From engineering-grade nylon enclosures to flexible TPU gaskets and high-strength PETG brackets — we print your parts
            on industrial FDM machines with precision layer heights and post-processing. STEP, STL, and DXF files accepted.
          </p>
          <p style={{ color: '#555', maxWidth: 780, lineHeight: 1.7 }}>
            Typical turnaround is 2–3 business days. Same-day turnaround available for simple parts. Custom material, infill, and
            finish options available on enquiry.
          </p>
        </div>

        {/* Quick quote CTA */}
        <div style={{ background: '#111', borderRadius: 12, padding: '1.25rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#FF8C35', marginBottom: 4 }}>// INSTANT QUOTE</div>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>Have a file ready? Get a quote in minutes.</div>
            <div style={{ color: '#999', fontSize: 13, marginTop: 2 }}>Upload your STL, STEP, or DXF — we'll quote within an hour.</div>
          </div>
          <a href="/#" onClick={e => { e.preventDefault(); window.history.back(); }}
            style={{ padding: '10px 20px', background: '#FF8C35', color: '#111', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap', cursor: 'pointer' }}>
            Get 3D Quote ⚡
          </a>
        </div>

        {/* Search + Sort bar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <input
            type="text" placeholder="Search print services…" value={search}
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
          {[
            { label: 'Material', options: MATERIALS,   active: fMat,  set: setFMat },
            { label: 'Type',     options: PRINT_TYPES, active: fType, set: setFType },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', minWidth: 90 }}>{row.label}</span>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {row.options.map(opt => (
                  <button key={opt.key} onClick={() => row.set(opt.key)}
                    style={{ padding: '5px 14px', borderRadius: 999, border: '1px solid', cursor: 'pointer', fontSize: 12, fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s',
                      background: row.active === opt.key ? '#FF8C35' : '#f4f4f4',
                      borderColor: row.active === opt.key ? '#FF8C35' : '#e0e0e0',
                      color: row.active === opt.key ? '#111' : '#555',
                      fontWeight: row.active === opt.key ? 600 : 400,
                    }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Results count */}
        <div style={{ fontSize: 13, color: '#888', marginBottom: '1.5rem' }}>
          Showing {filtered.length} of {products.length} services
        </div>

        {/* Product grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>Loading services…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>No services match your filters.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
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
                  <div style={{ height: 160, background: '#f4f4f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56 }}>
                    {photo ? <img src={photo} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 16 }} /> : p.emoji}
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: 11, color: '#FF8C35', fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>3D Print Services</div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, lineHeight: 1.3 }}>{p.name}</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                      {p.material && <span style={{ fontSize: 11, background: '#f0f0ee', padding: '2px 8px', borderRadius: 4, color: '#555' }}>{matLabel[p.material] || p.material}</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 17, color: '#111' }}>
                        {priceNum > 0 ? `₹${priceNum.toLocaleString('en-IN')}` : p.price || 'Quote on request'}
                      </span>
                      <span style={{ fontSize: 11, color: '#888' }}>Incl. GST</span>
                    </div>
                    <button onClick={e => { e.stopPropagation(); whatsappOrder(p); }}
                      style={{ marginTop: 10, width: '100%', padding: '9px', background: 'transparent', border: '1.5px solid #FF8C35', color: '#FF8C35', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                      Order Now →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Capabilities section */}
        <div style={{ marginTop: '3rem' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#FF8C35', marginBottom: 8 }}>// CAPABILITIES</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { label: 'Build Volume', value: 'Up to 300×300×400mm' },
              { label: 'Layer Height', value: '0.1mm – 0.3mm' },
              { label: 'Materials', value: 'PLA, PETG, ABS, Nylon, TPU' },
              { label: 'Turnaround', value: '2–3 business days' },
              { label: 'File Formats', value: 'STL, STEP, DXF' },
              { label: 'Custom Finishes', value: 'Sanding, priming, painting' },
            ].map(c => (
              <div key={c.label} style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 10, padding: '16px 18px' }}>
                <div style={{ fontSize: 11, color: '#888', fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>{c.label}</div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{c.value}</div>
              </div>
            ))}
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
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#FF8C35', textTransform: 'uppercase' }}>3D Print Service</span>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>✕</button>
            </div>
            <div style={{ height: 200, background: '#f4f4f2', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72, marginBottom: 16 }}>
              {selected.photos?.[0] ? <img src={selected.photos[0]} alt={selected.name} style={{ height: '100%', objectFit: 'contain' }} /> : selected.emoji}
            </div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 1, margin: '0 0 8px' }}>{selected.name}</h2>
            <p style={{ color: '#555', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{selected.details}</p>
            {selected.material && (
              <div style={{ marginBottom: 16 }}>
                <span style={{ fontSize: 12, background: '#f0f0ee', padding: '4px 10px', borderRadius: 6 }}>{matLabel[selected.material] || selected.material}</span>
              </div>
            )}
            <ul style={{ margin: '0 0 20px', paddingLeft: 20 }}>
              {selected.specs?.map((s, i) => <li key={i} style={{ fontSize: 13, color: '#444', marginBottom: 4 }}>{s}</li>)}
            </ul>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: 1 }}>
                {parseFloat(selected.price) > 0 ? `₹${parseFloat(selected.price).toLocaleString('en-IN')}` : selected.price || 'Quote on request'}
              </span>
              <span style={{ fontSize: 12, color: '#888' }}>Incl. GST</span>
            </div>
            <button onClick={() => whatsappOrder(selected)}
              style={{ width: '100%', padding: '13px', background: '#FF8C35', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", color: '#111' }}>
              Order on WhatsApp →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
