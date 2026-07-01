'use client'

import { useState, useEffect } from 'react'

interface Review {
  id: string
  product_id: string
  name: string
  email: string
  rating: number
  review: string
  approved: boolean
  created_at: string
}

function Stars({ n }: { n: number }) {
  return <span>{[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= n ? '#FF8C35' : '#ddd' }}>★</span>)}</span>
}

export default function AdminReviews({ token }: { token: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending')

  async function load() {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/reviews', { headers: { Authorization: `Bearer ${token}` } })
      const d = await r.json()
      setReviews(d.reviews || [])
    } catch { /* ignore */ } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function approve(id: string) {
    await fetch('/api/admin/reviews', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action: 'approve' }) })
    setReviews(rs => rs.map(r => r.id === id ? { ...r, approved: true } : r))
  }

  async function remove(id: string) {
    await fetch('/api/admin/reviews', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action: 'delete' }) })
    setReviews(rs => rs.filter(r => r.id !== id))
  }

  const filtered = reviews.filter(r => filter === 'all' ? true : filter === 'pending' ? !r.approved : r.approved)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#111', margin: 0 }}>Product Reviews</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['pending', 'approved', 'all'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #ddd', background: filter === f ? '#FF8C35' : '#fff', color: filter === f ? '#fff' : '#555', fontSize: 13, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }}>{f}</button>
          ))}
        </div>
      </div>

      {loading && <div style={{ color: '#888', fontSize: 14 }}>Loading reviews...</div>}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#aaa', fontSize: 14 }}>No {filter} reviews.</div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(r => (
          <div key={r.id} style={{ background: '#fff', borderRadius: 12, border: `1px solid ${r.approved ? '#e0f0e8' : '#fff3cd'}`, padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>{r.name}</span>
                  <span style={{ fontSize: 11, color: '#888' }}>{r.email}</span>
                  <Stars n={r.rating} />
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: r.approved ? '#e0f0e8' : '#fff3cd', color: r.approved ? '#2e7d32' : '#856404', fontWeight: 600 }}>{r.approved ? 'Approved' : 'Pending'}</span>
                </div>
                <div style={{ fontSize: 11, color: '#bbb', marginBottom: 6 }}>Product: {r.product_id} · {new Date(r.created_at).toLocaleDateString('en-IN')}</div>
                {r.review && <p style={{ fontSize: 13, color: '#444', margin: 0, lineHeight: 1.6 }}>{r.review}</p>}
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                {!r.approved && (
                  <button onClick={() => approve(r.id)} style={{ padding: '6px 14px', background: '#27ae60', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Approve</button>
                )}
                <button onClick={() => remove(r.id)} style={{ padding: '6px 14px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
