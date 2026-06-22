'use client'

import { useState, useMemo } from 'react'
import { PRODUCTS, CATEGORIES } from '@/data/products'
import Link from 'next/link'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const results = useMemo(() => {
    const q = query.toLowerCase().trim()
    return PRODUCTS.filter(p => {
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.specs || []).some(s => s.toLowerCase().includes(q))
      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory
      return matchesQuery && matchesCat
    })
  }, [query, selectedCategory])

  return (
    <main style={{ minHeight: '100vh', background: '#f8f8f6', color: '#111', paddingTop: '80px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 20px 100px' }}>
        <h1 style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>
          SEARCH
        </h1>
        <p style={{ color: '#888', marginBottom: 40 }}>Find parts, components, and drone gear</p>

        {/* Search bar */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
          <input
            type="search"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search products, parts, components…"
            style={{
              flex: 1, minWidth: 260, padding: '14px 20px', fontSize: 16,
              background: '#111', border: '1px solid #222', borderRadius: 8,
              color: '#fff', outline: 'none',
            }}
          />
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            style={{
              padding: '14px 16px', fontSize: 14, background: '#111',
              border: '1px solid #222', borderRadius: 8, color: '#888',
            }}
          >
            <option value="all">All categories</option>
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Results count */}
        {query && (
          <p style={{ color: '#666', fontSize: 13, marginBottom: 24 }}>
            {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
          </p>
        )}

        {/* Results grid */}
        {results.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {results.map(p => (
              <Link key={p.id} href={`/shop/product/${p.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12,
                  padding: 20, transition: 'border-color .2s',
                  cursor: 'pointer',
                }} onMouseEnter={e => (e.currentTarget.style.borderColor = '#FF8C35')}
                   onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e1e1e')}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>{p.emoji}</div>
                  {p.badge && (
                    <span style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                      background: p.badge === 'SALE' ? '#e74c3c' : p.badge === 'NEW' ? '#1abc9c' : '#FF8C35',
                      color: '#fff', padding: '2px 8px', borderRadius: 4, marginBottom: 8, display: 'inline-block'
                    }}>{p.badge}</span>
                  )}
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 6, lineHeight: 1.3 }}>{p.name}</h3>
                  <p style={{ fontSize: 12, color: '#666', marginBottom: 12, lineHeight: 1.5 }}>{p.shortDesc}</p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#FF8C35' }}>
                    {p.price === 0 ? 'Price on request' : `₹${p.price.toLocaleString('en-IN')}`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#444' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: 18, marginBottom: 8 }}>No products found</p>
            <p style={{ fontSize: 14 }}>Try a different search term or browse our <Link href="/shop" style={{ color: '#FF8C35' }}>full shop</Link></p>
          </div>
        )}

        {/* Popular searches */}
        {!query && (
          <div style={{ marginTop: 60 }}>
            <p style={{ color: '#555', fontSize: 12, letterSpacing: '0.1em', marginBottom: 16 }}>POPULAR SEARCHES</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {['Arduino', 'Flight controller', 'FPV motor', 'LiPo battery', '3D printer', 'Raspberry Pi', 'ESC', 'Servo'].map(t => (
                <button key={t} onClick={() => setQuery(t)} style={{
                  padding: '8px 16px', background: '#111', border: '1px solid #222',
                  borderRadius: 20, color: '#888', fontSize: 13, cursor: 'pointer',
                }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
