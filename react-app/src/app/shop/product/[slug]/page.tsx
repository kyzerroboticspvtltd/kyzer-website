'use client'

import { use, useState } from 'react'
import { notFound } from 'next/navigation'
import { getProductBySlug, getProductsByCategory, CATEGORIES } from '@/data/products'
import Link from 'next/link'
import { ShoppingCart, Zap, ChevronRight, Check, Star, Share2, Heart, ArrowLeft } from 'lucide-react'

const FONT_URL = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap'

function addToCart(product: { id: string; name: string; price: number; emoji: string; slug: string }) {
  try {
    const raw = localStorage.getItem('kyzer_cart')
    const cart = raw ? JSON.parse(raw) : []
    const idx = cart.findIndex((i: { id: string }) => i.id === product.id)
    if (idx > -1) {
      cart[idx].qty = (cart[idx].qty || 1) + 1
    } else {
      cart.push({ id: product.id, name: product.name, price: product.price, emoji: product.emoji, qty: 1 })
    }
    localStorage.setItem('kyzer_cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('kyzer_cart_update'))
    return true
  } catch { return false }
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const product = getProductBySlug(slug)
  if (!product) notFound()

  const category = CATEGORIES.find(c => c.id === product.category)
  const related = getProductsByCategory(product.category).filter(p => p.slug !== slug).slice(0, 4)

  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)

  const priceDisplay = product.price > 0
    ? `₹${product.price.toLocaleString('en-IN')}`
    : 'Price on request'

  const originalDisplay = product.originalPrice && product.originalPrice > product.price
    ? `₹${product.originalPrice.toLocaleString('en-IN')}`
    : null

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  function handleAddToCart() {
    if (product.price === 0) {
      const msg = product.whatsappMsg || `Hi, I'm interested in ${product.name}. Please share details.`
      window.open(`https://wa.me/919049695264?text=${encodeURIComponent(msg)}`, '_blank')
      return
    }
    for (let i = 0; i < qty; i++) addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  function handleBuyNow() {
    if (product.price === 0) {
      handleAddToCart()
      return
    }
    for (let i = 0; i < qty; i++) addToCart(product)
    window.location.href = '/checkout'
  }

  const badgeColor: Record<string, string> = {
    HOT: '#FF8C35', NEW: '#2ecc71', SALE: '#e74c3c', LIMITED: '#9b59b6'
  }

  return (
    <>
      <link href={FONT_URL} rel="stylesheet" />
      <div style={{ minHeight: '100vh', background: '#f8f8f6', fontFamily: "'DM Sans', sans-serif" }}>

        {/* Breadcrumb */}
        <div style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.07)', padding: '12px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#888' }}>
            <Link href="/" style={{ color: '#888', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={14} />
            <Link href="/shop" style={{ color: '#888', textDecoration: 'none' }}>Shop</Link>
            <ChevronRight size={14} />
            <Link href={`/shop/${product.category}`} style={{ color: '#888', textDecoration: 'none' }}>{category?.name}</Link>
            <ChevronRight size={14} />
            <span style={{ color: '#111', fontWeight: 500 }}>{product.name}</span>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>

          {/* Back */}
          <Link href={`/shop/${product.category}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#666', textDecoration: 'none', marginBottom: 24 }}>
            <ArrowLeft size={14} /> Back to {category?.name}
          </Link>

          {/* Main grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 40, alignItems: 'start' }}>

            {/* Left: image */}
            <div>
              <div style={{
                background: '#fff', borderRadius: 20, border: '1px solid rgba(0,0,0,0.08)',
                aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 120, position: 'relative', overflow: 'hidden',
              }}>
                {product.image
                  ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span>{product.emoji}</span>
                }
                {product.badge && (
                  <div style={{
                    position: 'absolute', top: 16, left: 16,
                    background: badgeColor[product.badge] || '#FF8C35',
                    color: '#fff', fontSize: 11, fontWeight: 700,
                    padding: '4px 10px', borderRadius: 6, letterSpacing: '0.05em',
                  }}>
                    {product.badge}
                  </div>
                )}
                {!product.inStock && (
                  <div style={{
                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 18, fontWeight: 700, letterSpacing: '0.1em',
                  }}>
                    OUT OF STOCK
                  </div>
                )}
              </div>

              {/* Share / Wishlist */}
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button
                  onClick={() => { setWishlisted(!wishlisted) }}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '10px', borderRadius: 10, border: `1px solid ${wishlisted ? '#FF8C35' : 'rgba(0,0,0,0.1)'}`,
                    background: wishlisted ? '#fff7f0' : '#fff', cursor: 'pointer', fontSize: 13,
                    color: wishlisted ? '#FF8C35' : '#555', fontWeight: 500,
                  }}
                >
                  <Heart size={15} fill={wishlisted ? '#FF8C35' : 'none'} stroke={wishlisted ? '#FF8C35' : '#555'} />
                  {wishlisted ? 'Saved' : 'Wishlist'}
                </button>
                <button
                  onClick={() => { navigator.share?.({ title: product.name, url: window.location.href }) || navigator.clipboard.writeText(window.location.href) }}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '10px', borderRadius: 10, border: '1px solid rgba(0,0,0,0.1)',
                    background: '#fff', cursor: 'pointer', fontSize: 13, color: '#555', fontWeight: 500,
                  }}
                >
                  <Share2 size={15} />
                  Share
                </button>
              </div>
            </div>

            {/* Right: details */}
            <div>
              {/* Category pill */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 12, background: '#f0f0ed', color: '#666', padding: '3px 10px', borderRadius: 20, fontWeight: 500 }}>
                  {category?.emoji} {category?.name}
                </span>
                {product.inStock
                  ? <span style={{ fontSize: 12, color: '#2ecc71', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><Check size={12} /> In Stock</span>
                  : <span style={{ fontSize: 12, color: '#e74c3c', fontWeight: 600 }}>Out of Stock</span>
                }
              </div>

              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, color: '#111', margin: '0 0 12px', lineHeight: 1.1, letterSpacing: '0.02em' }}>
                {product.name}
              </h1>

              {/* Rating placeholder */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={14} fill={i <= 4 ? '#FF8C35' : 'none'} stroke="#FF8C35" />
                  ))}
                </div>
                <span style={{ fontSize: 13, color: '#888' }}>4.0 · Be the first to review</span>
              </div>

              <p style={{ fontSize: 15, color: '#555', lineHeight: 1.7, marginBottom: 24 }}>{product.shortDesc}</p>

              {/* Price */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 44, color: product.price > 0 ? '#111' : '#FF8C35', letterSpacing: '0.02em' }}>
                    {priceDisplay}
                  </span>
                  {originalDisplay && (
                    <span style={{ fontSize: 18, color: '#aaa', textDecoration: 'line-through' }}>{originalDisplay}</span>
                  )}
                  {discount && (
                    <span style={{ fontSize: 13, background: '#e8f8ef', color: '#2ecc71', padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>
                      {discount}% OFF
                    </span>
                  )}
                </div>
                {product.price > 0 && (
                  <p style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>Inclusive of all taxes · Free shipping above ₹999</p>
                )}
              </div>

              {/* Quantity */}
              {product.price > 0 && product.inStock && (
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#333', display: 'block', marginBottom: 8 }}>Quantity</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 0, width: 'fit-content', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 10, overflow: 'hidden' }}>
                    <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 40, height: 40, background: '#f8f8f6', border: 'none', fontSize: 18, cursor: 'pointer', color: '#111' }}>−</button>
                    <span style={{ width: 48, textAlign: 'center', fontSize: 15, fontWeight: 600 }}>{qty}</span>
                    <button onClick={() => setQty(qty + 1)} style={{ width: 40, height: 40, background: '#f8f8f6', border: 'none', fontSize: 18, cursor: 'pointer', color: '#111' }}>+</button>
                  </div>
                </div>
              )}

              {/* CTAs */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
                {product.inStock || product.price === 0 ? (
                  <>
                    <button
                      onClick={handleAddToCart}
                      style={{
                        flex: 1, minWidth: 140, padding: '14px 20px', borderRadius: 12,
                        border: '2px solid #111', background: added ? '#111' : '#fff',
                        color: added ? '#FF8C35' : '#111', fontSize: 14, fontWeight: 700,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        transition: 'all 0.2s',
                      }}
                    >
                      {product.price === 0
                        ? <><Zap size={16} /> WhatsApp Enquiry</>
                        : added
                          ? <><Check size={16} /> Added!</>
                          : <><ShoppingCart size={16} /> Add to Cart</>
                      }
                    </button>
                    {product.price > 0 && (
                      <button
                        onClick={handleBuyNow}
                        style={{
                          flex: 1, minWidth: 140, padding: '14px 20px', borderRadius: 12,
                          border: 'none', background: '#FF8C35', color: '#fff',
                          fontSize: 14, fontWeight: 700, cursor: 'pointer',
                        }}
                      >
                        Buy Now →
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => window.open(`https://wa.me/919049695264?text=${encodeURIComponent(`Hi, please notify me when ${product.name} is back in stock.`)}`, '_blank')}
                    style={{
                      flex: 1, padding: '14px 20px', borderRadius: 12,
                      border: '2px solid #FF8C35', background: '#fff',
                      color: '#FF8C35', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    Notify When Available
                  </button>
                )}
              </div>

              {/* Specs */}
              {product.specs && product.specs.length > 0 && (
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)', padding: 24, marginBottom: 20 }}>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#111', marginBottom: 16, letterSpacing: '0.03em' }}>Specifications</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {product.specs.map((spec, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <Check size={14} color="#FF8C35" style={{ flexShrink: 0, marginTop: 2 }} />
                        <span style={{ fontSize: 14, color: '#444', lineHeight: 1.5 }}>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trust strip */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {[
                  { icon: '🚚', label: 'Fast Delivery', sub: 'Pan India shipping' },
                  { icon: '✅', label: 'Genuine Parts', sub: '100% authentic' },
                  { icon: '💬', label: 'Expert Support', sub: 'WhatsApp help' },
                ].map(t => (
                  <div key={t.label} style={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(0,0,0,0.07)', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{t.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#111' }}>{t.label}</div>
                    <div style={{ fontSize: 11, color: '#888' }}>{t.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <div style={{ marginTop: 64 }}>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: '#111', marginBottom: 24, letterSpacing: '0.04em' }}>
                Related Products
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                {related.map(p => (
                  <Link key={p.slug} href={`/shop/product/${p.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)',
                      padding: 20, transition: 'box-shadow 0.2s', cursor: 'pointer',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)')}
                      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                    >
                      <div style={{ fontSize: 48, textAlign: 'center', marginBottom: 12 }}>{p.emoji}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 6 }}>{p.name}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: p.price > 0 ? '#111' : '#FF8C35' }}>
                        {p.price > 0 ? `₹${p.price.toLocaleString('en-IN')}` : 'Enquire'}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
