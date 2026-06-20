'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ProtoProduct {
  id: string;
  name: string;
  price: string;
  description: string;
  details: string;
  specs: string[];
  badge: string;
  badgeType: string;
  emoji: string;
  photos?: string[];
  visible: boolean;
  subcat: string;
  category: string;
}

const SORT_OPTIONS = [
  { key: 'default',    label: 'Default' },
  { key: 'price-asc',  label: 'Price: Low → High' },
  { key: 'price-desc', label: 'Price: High → Low' },
];

const PROCESS_STEPS = [
  { num: '01', title: 'Brief us', desc: 'Share your requirements, sketches, or CAD files via WhatsApp or email. We will review and respond within a few hours.' },
  { num: '02', title: 'Quote & confirm', desc: 'We send a fixed price quote with timeline. No surprises — price locked once confirmed.' },
  { num: '03', title: 'Design & build', desc: 'Our engineers handle CAD design verification, material selection, print, and assembly.' },
  { num: '04', title: 'Ship to you', desc: 'Prototype delivered to your door with a full build report and manufacture-ready files.' },
];

export default function PrototypingPage() {
  const [products, setProducts] = useState<ProtoProduct[]>([]);
  const [loading, setLoading]   = useState(true);
  const [sort, setSort]         = useState('default');
  const [search, setSearch]     = useState('');
  const [selected, setSelected] = useState<ProtoProduct | null>(null);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://alrgkykezmlcagovkkdl.supabase.co';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFscmdreWtlem1sY2Fnb3Zra2RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MjIxMjMsImV4cCI6MjA5NTE5ODEyM30.g_UjIRnjov6cUAkwjlifL2kDUzh1G7cpsThj6Ygq83U';
    fetch(`${url}/rest/v1/site_data?id=eq.1&select=products`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    })
      .then(r => r.json())
      .then(data => {
        const prods: ProtoProduct[] = (data?.[0]?.products || []).filter(
          (p: ProtoProduct) => p.category === 'proto' && p.visible
        );
        setProducts(prods);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = products
    .filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
          !p.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'price-asc')  return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
      if (sort === 'price-desc') return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
      return 0;
    });

  function whatsappBook(p: ProtoProduct) {
    const msg = encodeURIComponent(`Hi, I'd like to book the *${p.name}* service (${p.price}) from Kyzer Robotics. Can you share availability and next steps?`);
    window.open(`https://wa.me/919049695264?text=${msg}`, '_blank');
  }

  function whatsappGeneral() {
    const msg = encodeURIComponent(`Hi, I'm looking to prototype a product with Kyzer Robotics. Could you share what services are available?`);
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
        <Link href="/#products" style={{ color: '#999', fontSize: 13, textDecoration: 'none' }}>Shop</Link>
        <span style={{ color: '#444', fontSize: 18 }}>›</span>
        <span style={{ color: '#FF8C35', fontSize: 13 }}>Prototyping</span>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#FF8C35', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
            // RAPID DEVELOPMENT
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, letterSpacing: 2, margin: '0 0 12px' }}>Prototyping Services</h1>
          <p style={{ color: '#555', maxWidth: 780, lineHeight: 1.7, margin: '0 0 6px' }}>
            From concept to physical prototype in as fast as 48 hours. We handle design verification, CAD, printing, and assembly
            — so you can focus on testing and iterating. Ideal for startups, college teams, and industrial R&D.
          </p>
          <p style={{ color: '#555', maxWidth: 780, lineHeight: 1.7 }}>
            Custom scopes available. Share your idea on WhatsApp and we'll put together a quote the same day.
          </p>
        </div>

        {/* Hero CTA strip */}
        <div style={{ background: '#111', borderRadius: 12, padding: '1.5rem 2rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ color: '#fff', fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 1 }}>Not sure where to start?</div>
            <div style={{ color: '#999', fontSize: 13, marginTop: 4 }}>Describe your project and we'll recommend the right service and timeline.</div>
          </div>
          <button onClick={whatsappGeneral}
            style={{ padding: '11px 22px', background: '#FF8C35', color: '#111', borderRadius: 8, fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' }}>
            Chat on WhatsApp →
          </button>
        </div>

        {/* Search + Sort */}
        <div style={{ display: 'flex', gap: 12, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <input
            type="text" placeholder="Search services…" value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 200, padding: '10px 16px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, background: '#fff', outline: 'none' }}
          />
          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{ padding: '10px 16px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, background: '#fff', cursor: 'pointer' }}>
            {SORT_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
          </select>
        </div>

        {/* Results count */}
        <div style={{ fontSize: 13, color: '#888', marginBottom: '1.5rem' }}>
          Showing {filtered.length} of {products.length} services
        </div>

        {/* Product grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>Loading services…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>No services match your search.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
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
                  <div style={{ height: 160, background: '#f4f4f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56, overflow: 'hidden' }}>
                    {photo ? <img src={photo} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 16 }} /> : <span style={{ fontSize: 56 }}>{p.emoji}</span>}
                  </div>
                  <div style={{ padding: '16px 18px' }}>
                    <div style={{ fontSize: 11, color: '#FF8C35', fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>Prototyping Service</div>
                    <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6, lineHeight: 1.3 }}>{p.name}</div>
                    <div style={{ fontSize: 13, color: '#666', marginBottom: 12, lineHeight: 1.55 }}>{p.description}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 700, fontSize: 18, color: '#111' }}>
                        {priceNum > 0 ? `₹${priceNum.toLocaleString('en-IN')}` : p.price || 'Custom pricing'}
                      </span>
                    </div>
                    <button onClick={e => { e.stopPropagation(); whatsappBook(p); }}
                      style={{ marginTop: 12, width: '100%', padding: '10px', background: '#FF8C35', border: 'none', color: '#111', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                      Book Now →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* How it works */}
        <div style={{ marginTop: '3.5rem' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#FF8C35', marginBottom: 8 }}>// HOW IT WORKS</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: 1, margin: '0 0 1.5rem' }}>From brief to build in 4 steps</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {PROCESS_STEPS.map(s => (
              <div key={s.num} style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: '20px 22px' }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: '#FF8C35', letterSpacing: 1, marginBottom: 8 }}>{s.num}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: '#666', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Also see 3D printing */}
        <div style={{ marginTop: '2.5rem', padding: '1.5rem 2rem', background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#FF8C35', marginBottom: 4 }}>// ALSO AVAILABLE</div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>Already have a file? Order a print directly.</div>
            <div style={{ color: '#666', fontSize: 13, marginTop: 4 }}>Browse our 3D print services — PLA, PETG, ABS, Nylon and more.</div>
          </div>
          <Link href="/shop/3d-printing"
            style={{ padding: '10px 20px', background: '#111', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            View Print Services →
          </Link>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div onClick={() => setSelected(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 16, maxWidth: 560, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#FF8C35', textTransform: 'uppercase' }}>Prototyping Service</span>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>✕</button>
            </div>
            <div style={{ height: 200, background: '#f4f4f2', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72, marginBottom: 16, overflow: 'hidden' }}>
              {selected.photos?.[0] ? <img src={selected.photos[0]} alt={selected.name} style={{ height: '100%', objectFit: 'contain' }} /> : <span style={{ fontSize: 72 }}>{selected.emoji}</span>}
            </div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 1, margin: '0 0 8px' }}>{selected.name}</h2>
            <p style={{ color: '#555', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{selected.details}</p>
            <ul style={{ margin: '0 0 20px', paddingLeft: 20 }}>
              {selected.specs?.map((s, i) => <li key={i} style={{ fontSize: 13, color: '#444', marginBottom: 4 }}>{s}</li>)}
            </ul>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: 1 }}>
                {parseFloat(selected.price) > 0 ? `₹${parseFloat(selected.price).toLocaleString('en-IN')}` : selected.price || 'Custom pricing'}
              </span>
            </div>
            <button onClick={() => whatsappBook(selected)}
              style={{ width: '100%', padding: '13px', background: '#FF8C35', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", color: '#111' }}>
              Book on WhatsApp →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
