'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import type { Subcategory } from '@/data/products'

interface ShopFiltersProps {
  subcategories: Subcategory[]
  activeSubcat: string
  onSubcatChange: (slug: string) => void
  search: string
  onSearchChange: (val: string) => void
  sort: string
  onSortChange: (val: string) => void
  totalCount: number
  maxPrice?: number
  priceRange?: [number, number]
  onPriceRangeChange?: (r: [number, number]) => void
  inStockOnly?: boolean
  onInStockChange?: (v: boolean) => void
}

const SORT_OPTIONS = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A–Z' },
]

function FilterPanel({ subcategories, activeSubcat, onSubcatChange, maxPrice, priceRange, onPriceRangeChange, inStockOnly, onInStockChange }: Pick<ShopFiltersProps, 'subcategories' | 'activeSubcat' | 'onSubcatChange' | 'maxPrice' | 'priceRange' | 'onPriceRangeChange' | 'inStockOnly' | 'onInStockChange'>) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <p className="text-[11px] font-mono text-gray-400 tracking-widest uppercase">Category</p>
        {[{ id: 'all', name: 'All', slug: 'all' }, ...subcategories].map(sub => (
          <button
            key={sub.slug}
            onClick={() => onSubcatChange(sub.slug)}
            className={`w-full text-left px-3 py-2 rounded-xl text-[13px] transition-all ${
              activeSubcat === sub.slug
                ? 'bg-[#FF8C35] text-white font-semibold'
                : 'text-gray-600 hover:bg-[#f4f4f2] hover:text-[#111]'
            }`}
          >
            {sub.name}
          </button>
        ))}
      </div>

      {onInStockChange && (
        <div>
          <p className="text-[11px] font-mono text-gray-400 tracking-widest uppercase mb-2">Availability</p>
          <label className="flex items-center gap-2 cursor-pointer text-[13px] text-gray-600 hover:text-[#111]">
            <input type="checkbox" checked={inStockOnly} onChange={e => onInStockChange(e.target.checked)} className="accent-[#FF8C35] w-4 h-4" />
            In Stock Only
          </label>
        </div>
      )}

      {onPriceRangeChange && maxPrice && maxPrice > 0 && (
        <div>
          <p className="text-[11px] font-mono text-gray-400 tracking-widest uppercase mb-2">Price Range</p>
          <div className="space-y-2">
            <input
              type="range"
              min={0}
              max={maxPrice}
              step={100}
              value={priceRange?.[1] ?? maxPrice}
              onChange={e => onPriceRangeChange([priceRange?.[0] ?? 0, Number(e.target.value)])}
              className="w-full accent-[#FF8C35]"
            />
            <div className="flex justify-between text-[12px] text-gray-400">
              <span>₹0</span>
              <span className="text-[#FF8C35] font-semibold">Up to ₹{(priceRange?.[1] ?? maxPrice).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function ShopFilters({
  subcategories,
  activeSubcat,
  onSubcatChange,
  search,
  onSearchChange,
  sort,
  onSortChange,
  totalCount,
  maxPrice,
  priceRange,
  onPriceRangeChange,
  inStockOnly,
  onInStockChange,
}: ShopFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Top bar */}
      <div className="flex items-center gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search products…"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            className="pl-9 h-10 bg-white border-black/10 text-[14px] rounded-xl focus-visible:ring-[#FF8C35]/40 focus-visible:border-[#FF8C35]"
          />
          {search && (
            <button onClick={() => onSearchChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort */}
        <Select value={sort} onValueChange={(val) => val && onSortChange(val)}>
          <SelectTrigger className="w-44 h-10 bg-white border-black/10 text-[13px] rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map(o => (
              <SelectItem key={o.value} value={o.value} className="text-[13px]">{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Mobile filter toggle */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger className="lg:hidden inline-flex items-center justify-center h-10 px-3 border border-black/10 rounded-xl bg-white hover:bg-gray-50 transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <SheetHeader>
              <SheetTitle className="font-mono text-[13px] tracking-widest text-[#FF8C35] uppercase">Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterPanel subcategories={subcategories} activeSubcat={activeSubcat} onSubcatChange={(slug) => { onSubcatChange(slug); setMobileOpen(false) }} maxPrice={maxPrice} priceRange={priceRange} onPriceRangeChange={onPriceRangeChange} inStockOnly={inStockOnly} onInStockChange={onInStockChange} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Result count */}
      <p className="text-[12px] text-gray-400 mb-4 font-mono">
        {totalCount} result{totalCount !== 1 ? 's' : ''}
        {search && ` for "${search}"`}
      </p>
    </>
  )
}

export function FilterSidebar({ subcategories, activeSubcat, onSubcatChange, maxPrice, priceRange, onPriceRangeChange, inStockOnly, onInStockChange }: Pick<ShopFiltersProps, 'subcategories' | 'activeSubcat' | 'onSubcatChange' | 'maxPrice' | 'priceRange' | 'onPriceRangeChange' | 'inStockOnly' | 'onInStockChange'>) {
  return (
    <aside className="hidden lg:block w-52 shrink-0">
      <div className="sticky top-28">
        <FilterPanel subcategories={subcategories} activeSubcat={activeSubcat} onSubcatChange={onSubcatChange} maxPrice={maxPrice} priceRange={priceRange} onPriceRangeChange={onPriceRangeChange} inStockOnly={inStockOnly} onInStockChange={onInStockChange} />
      </div>
    </aside>
  )
}
