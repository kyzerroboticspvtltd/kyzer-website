'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { addToLocalCart, buyNow } from '@/lib/shopCart';
import { productSlug } from '@/lib/productSlug';

interface Frame {
  id: string;
  name: string;
  price: string;
  description: string;
  details: string;
  specs: string[];
  material: string;
  frameType: string;
  wheelbase: number;
  weight: number;
  badge: string;
  badgeType: string;
  emoji: string;
  photos?: string[];
  image?: string;
  visible: boolean;
  subcat: string;
  category: string;
  btnMode?: string;
}

const FRAME_TYPES = [
  { key: 'all',        label: 'All Types' },
  { key: 'racing',     label: 'Racing' },
  { key: 'quadcopter', label: 'Quadcopter' },
  { key: 'hexacopter', label: 'Hexacopter' },
];

const MATERIALS = [
  { key: 'all',          label: 'All Materials' },
  { key: 'carbon-fiber', label: 'Carbon Fiber' },
  { key: 'glass-fiber',  label: 'Glass Fiber' },
];

const SIZES = [
  { key: 'all',   label: 'All Sizes' },
  { key: 'micro', label: 'Micro <250mm' },
  { key: 'mid',   label: 'Mid 250–500mm' },
  { key: 'large', label: 'Large >500mm' },
];

const SORT_OPTIONS = [
  { key: 'default',    label: 'Default' },
  { key: 'price-asc',  label: 'Price: Low → High' },
  { key: 'price-desc', label: 'Price: High → Low' },
  { key: 'weight-asc', label: 'Weight: Lightest' },
];

export default function DroneFramesPage() {
  const router = useRouter();
  const [frames, setFrames]         = useState<Frame[]>([]);
  const [loading, setLoading]       = useState(true);
  const [fType, setFType]           = useState('all');
  const [fMat, setFMat]             = useState('all');
  const [fSize, setFSize]           = useState('all');
  const [sort, setSort]             = useState('default');
  const [search, setSearch]         = useState('');
  const [selected, setSelected]     = useState<Frame | null>(null);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;
    fetch(`${url}/rest/v1/site_data?id=eq.1&select=products`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    })
      .then(r => r.json())
      .then(data => {
        const products: Frame[] = (data?.[0]?.products || []).filter(
          (p: Frame) => p.category === 'drone' && p.subcat === 'frame' && p.visible
        );
        setFrames(products);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = frames
    .filter(f => {
      if (fType !== 'all' && f.frameType !== fType) return false;
      if (fMat  !== 'all' && f.material  !== fMat)  return false;
      if (fSize !== 'all') {
        const wb = f.wheelbase || 0;
        if (fSize === 'micro' && wb >= 250) return false;
        if (fSize === 'mid'   && (wb < 250 || wb > 500)) return false;
        if (fSize === 'large' && wb <= 500) return false;
      }
      if (search && !f.name.toLowerCase().includes(search.toLowerCase()) &&
          !f.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'price-asc')  return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
      if (sort === 'price-desc') return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
      if (sort === 'weight-asc') return (a.weight || 0) - (b.weight || 0);
      return 0;
    });

  const matLabel: Record<string,string> = { 'carbon-fiber': 'Carbon Fiber', 'glass-fiber': 'Glass Fiber', 'aluminum': 'Aluminum' };
  const typeLabel: Record<string,string> = { racing: 'Racing', quadcopter: 'Quadcopter', hexacopter: 'Hexacopter' };

  const [addedId, setAddedId] = useState<string | null>(null);

  function handleAddToCart(f: Frame) {
    addToLocalCart(f);
    setAddedId(f.id);
    setTimeout(() => setAddedId(null), 1500);
  }

  function enquireNow(f: Frame) {
    const msg = encodeURIComponent(`Hi, I'd like to enquire about: ${f.name} (${f.price})`);
    window.open(`https://wa.me/919049695264?text=${msg}`, '_blank');
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#f8f8f6', minHeight: '100vh', color: '#111' }}>
      {/* Top bar */}
      <div style={{ background: '#111', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link href="/" style={{ color: '#FF8C35', fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, textDecoration: 'none', letterSpacing: 1 }}>
          KYZER ROBOTICS
        </Link>
        <span style={{ color: '#444', fontSize: 18 }}>›</span>
        <Link href="/shop/drones" style={{ color: '#999', fontSize: 13, textDecoration: 'none' }}>Drones</Link>
        <span style={{ color: '#444', fontSize: 18 }}>›</span>
        <span style={{ color: '#FF8C35', fontSize: 13 }}>Drone Frames</span>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#FF8C35', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
            // DRONE PARTS
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, letterSpacing: 2, margin: '0 0 12px' }}>Drone Frames</h1>
          <p style={{ color: '#555', maxWidth: 780, lineHeight: 1.7, margin: '0 0 6px' }}>
            Drone frames form the structural backbone of any UAV, defining its durability, flight characteristics, and payload capacity.
            Choose from lightweight carbon fiber frames for high-speed FPV racing to robust glass fiber designs for photography and commercial applications.
          </p>
          <p style={{ color: '#555', maxWidth: 780, lineHeight: 1.7 }}>
            All frames are available for order and shipped from Pune with tracking. Custom builds and bulk orders welcome — contact us on WhatsApp.
          </p>
        </div>

        {/* Search + Sort bar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <input
            type="text" placeholder="Search frames…" value={search}
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
            { label: 'Frame Type', options: FRAME_TYPES, active: fType, set: setFType },
            { label: 'Material',   options: MATERIALS,   active: fMat,  set: setFMat },
            { label: 'Size',       options: SIZES,       active: fSize, set: setFSize },
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
          Showing {filtered.length} of {frames.length} frames
        </div>

        {/* Product grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>Loading frames…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>No frames match your filters.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
            {filtered.map(f => {
              const photo = f.photos?.[0] || f.image;
              const priceNum = parseFloat(f.price);
              return (
                <div key={f.id} onClick={() => router.push(`/shop/product/${productSlug(f)}`)}
                  style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s', position: 'relative' }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
                  {/* Badge */}
                  {f.badge && (
                    <div style={{ position: 'absolute', top: 10, left: 10, background: f.badgeType === 'new' ? '#FF8C35' : '#111', color: '#fff', fontSize: 10, fontFamily: "'JetBrains Mono', monospace", padding: '3px 8px', borderRadius: 4, letterSpacing: '0.08em', zIndex: 1 }}>
                      {f.badge}
                    </div>
                  )}
                  {/* Image */}
                  <div style={{ height: 180, background: '#f4f4f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56, overflow: 'hidden' }}>
                    {photo ? <img src={photo} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 16 }} /> : <span style={{ fontSize: 56 }}>{f.emoji}</span>}
                  </div>
                  {/* Body */}
                  <div style={{ padding: '14px 16px 12px' }}>
                    <div style={{ fontSize: 11, color: '#FF8C35', fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>Drone Frames</div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, lineHeight: 1.3 }}>{f.name}</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                      {f.wheelbase && <span style={{ fontSize: 11, background: '#f0f0ee', padding: '2px 8px', borderRadius: 4, color: '#555' }}>{f.wheelbase}mm</span>}
                      {f.material  && <span style={{ fontSize: 11, background: '#f0f0ee', padding: '2px 8px', borderRadius: 4, color: '#555' }}>{matLabel[f.material] || f.material}</span>}
                      {f.frameType && <span style={{ fontSize: 11, background: '#f0f0ee', padding: '2px 8px', borderRadius: 4, color: '#555' }}>{typeLabel[f.frameType] || f.frameType}</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 700, fontSize: 17, color: '#111' }}>
                        {priceNum > 0 ? `₹${priceNum.toLocaleString('en-IN')}` : f.price}
                      </span>
                      <span style={{ fontSize: 11, color: '#888' }}>Incl. GST</span>
                    </div>
                  </div>
                  {/* Action footer — direct child of card so it spans full width */}
                  <div style={{ display: 'flex', borderTop: '1px solid #e8e8e8' }}>
                    {f.btnMode === 'enquire' ? (
                      <button onClick={e => { e.stopPropagation(); enquireNow(f); }}
                        style={{ flex: 1, padding: '10px 6px', background: '#FF8C35', border: 'none', color: '#111', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                        Enquire Now →
                      </button>
                    ) : (
                      <>
                        <button onClick={e => { e.stopPropagation(); handleAddToCart(f); }}
                          style={{ flex: 1, padding: '10px 6px', background: addedId === f.id ? '#e8f5e9' : 'transparent', border: 'none', borderRight: `1px solid ${addedId === f.id ? '#c8e6c9' : '#e8e8e8'}`, color: addedId === f.id ? '#2e7d32' : '#FF8C35', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' }}>
                          {addedId === f.id ? '✓ Added!' : '+ Cart'}
                        </button>
                        <button onClick={e => { e.stopPropagation(); buyNow(f); }}
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
      </div>

      {/* Detail modal */}
      {selected && (
        <div onClick={() => setSelected(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 16, maxWidth: 560, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#FF8C35', textTransform: 'uppercase' }}>Drone Frames</span>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>✕</button>
            </div>
            <div style={{ height: 220, background: '#f4f4f2', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72, marginBottom: 16, overflow: 'hidden' }}>
              {(selected.photos?.[0] || selected.image) ? <img src={selected.photos?.[0] || selected.image} alt={selected.name} style={{ height: '100%', objectFit: 'contain' }} /> : <span style={{ fontSize: 72 }}>{selected.emoji}</span>}
            </div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 1, margin: '0 0 8px' }}>{selected.name}</h2>
            <p style={{ color: '#555', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{selected.details}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              {selected.wheelbase && <span style={{ fontSize: 12, background: '#f0f0ee', padding: '4px 10px', borderRadius: 6 }}>{selected.wheelbase}mm wheelbase</span>}
              {selected.weight    && <span style={{ fontSize: 12, background: '#f0f0ee', padding: '4px 10px', borderRadius: 6 }}>{selected.weight}g</span>}
              {selected.material  && <span style={{ fontSize: 12, background: '#f0f0ee', padding: '4px 10px', borderRadius: 6 }}>{matLabel[selected.material] || selected.material}</span>}
            </div>
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
