'use client'

import { useState } from 'react'
import { PRODUCTS, CATEGORIES } from '@/data/products'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'

const BADGE_COLOR: Record<string, string> = {
  HOT: 'bg-red-100 text-red-600 border-0',
  NEW: 'bg-[#FF8C35]/15 text-[#FF8C35] border-0',
  SALE: 'bg-green-100 text-green-700 border-0',
  LIMITED: 'bg-purple-100 text-purple-700 border-0',
}

export function AdminProducts() {
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState('all')

  const filtered = PRODUCTS.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.subcategory.includes(q)
    const matchCat = activeCat === 'all' || p.category === activeCat
    return matchSearch && matchCat
  })

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-['Bebas_Neue',sans-serif] text-[28px] text-[#111] tracking-wide">Products</h2>
          <p className="text-[13px] text-gray-400">{PRODUCTS.length} products · edit prices in <code className="bg-[#f4f4f2] px-1.5 py-0.5 rounded text-[11px]">src/data/products.ts</code></p>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {[{ id: 'all', name: 'All' }, ...CATEGORIES].map(cat => (
          <button key={cat.id} onClick={() => setActiveCat(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all border ${activeCat === cat.id ? 'bg-[#FF8C35] text-white border-[#FF8C35]' : 'bg-white text-gray-500 border-black/10 hover:border-[#FF8C35] hover:text-[#FF8C35]'}`}>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)}
          className="pl-9 h-10 bg-white border-black/10 rounded-xl text-[13px]" />
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.07] overflow-hidden">
        {!filtered.length ? (
          <div className="py-16 text-center text-[13px] text-gray-400">No products found.</div>
        ) : (
          <div className="divide-y divide-black/[0.05]">
            {/* Header */}
            <div className="px-5 py-2.5 grid grid-cols-12 gap-3 text-[10px] font-mono text-gray-400 uppercase tracking-widest">
              <div className="col-span-5">Product</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-2">Stock</div>
              <div className="col-span-1">Badge</div>
            </div>

            {filtered.map(p => (
              <div key={p.id} className="px-5 py-3.5 grid grid-cols-12 gap-3 items-center hover:bg-[#fafaf8] transition-colors">
                <div className="col-span-5 flex items-center gap-3 min-w-0">
                  {p.image ? (
                    <img src={p.image} alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover shrink-0 bg-gray-100" />
                  ) : (
                    <span className="text-xl shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-gray-50">{p.emoji}</span>
                  )}
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-[#111] truncate">{p.name}</p>
                    <p className="text-[11px] text-gray-400 font-mono">{p.id}</p>
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-[12px] text-gray-500 capitalize">{p.subcategory.replace(/-/g, ' ')}</p>
                </div>
                <div className="col-span-2">
                  {p.price > 0
                    ? <p className="text-[13px] font-semibold text-[#111]">₹{p.price.toLocaleString('en-IN')}</p>
                    : <p className="text-[12px] text-gray-400 italic">Not set</p>}
                </div>
                <div className="col-span-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.inStock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                    {p.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div className="col-span-1">
                  {p.badge && <Badge className={`text-[9px] px-1.5 ${BADGE_COLOR[p.badge] ?? ''}`}>{p.badge}</Badge>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
