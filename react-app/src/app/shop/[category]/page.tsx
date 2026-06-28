'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProductCard } from '@/components/shop/ProductCard'
import { ShopFilters, FilterSidebar } from '@/components/shop/ShopFilters'
import { getCategoryBySlug, getProductsByCategory, type Product } from '@/data/products'
import { ChevronRight } from 'lucide-react'
import { use } from 'react'

interface PageProps {
  params: Promise<{ category: string }>
}

export default function CategoryPage({ params }: PageProps) {
  const { category: slug } = use(params)
  const category = getCategoryBySlug(slug)
  if (!category) notFound()

  const [allProducts, setAllProducts] = useState<Product[]>(getProductsByCategory(slug))

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(d => {
        if (d.ok && Array.isArray(d.products)) {
          setAllProducts(d.products.filter((p: Product) => p.category === slug))
        }
      })
      .catch(() => {})
  }, [slug])

  const [activeSubcat, setActiveSubcat] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('default')

  const filtered = useMemo(() => {
    let list = [...allProducts]

    if (activeSubcat !== 'all') list = list.filter(p => p.subcategory === activeSubcat)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q)
      )
    }

    switch (sort) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break
      case 'price-desc': list.sort((a, b) => b.price - a.price); break
      case 'name-asc': list.sort((a, b) => a.name.localeCompare(b.name)); break
      default: list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); break
    }

    return list
  }, [allProducts, activeSubcat, search, sort])

  return (
    <div className="min-h-screen bg-[#f8f8f6]">
      <div className="h-[90px]" />

      {/* Header */}
      <div className="px-4 sm:px-8 lg:px-16 py-10 max-w-7xl mx-auto border-b border-black/[0.06]">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[12px] text-gray-400 mb-4 font-mono">
          <Link href="/" className="hover:text-[#FF8C35] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-[#FF8C35] transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#111]">{category.name}</span>
        </div>

        <div className="flex items-start gap-4">
          <span className="text-4xl mt-1">{category.emoji}</span>
          <div>
            <h1 className="font-['Bebas_Neue',sans-serif] text-[clamp(36px,5vw,56px)] leading-none text-[#111] mb-2">
              {category.name}
            </h1>
            <p className="text-[14px] text-gray-500 max-w-lg">{category.description}</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 sm:px-8 lg:px-16 py-8 max-w-7xl mx-auto">
        <div className="flex gap-8">
          {/* Sidebar — desktop */}
          <FilterSidebar
            subcategories={category.subcategories}
            activeSubcat={activeSubcat}
            onSubcatChange={setActiveSubcat}
          />

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            <ShopFilters
              subcategories={category.subcategories}
              activeSubcat={activeSubcat}
              onSubcatChange={setActiveSubcat}
              search={search}
              onSearchChange={setSearch}
              sort={sort}
              onSortChange={setSort}
              totalCount={filtered.length}
            />

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <span className="text-5xl mb-4">🔍</span>
                <h3 className="font-['Bebas_Neue',sans-serif] text-[24px] text-[#111] mb-2">No products found</h3>
                <p className="text-[14px] text-gray-400">Try adjusting your search or filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
