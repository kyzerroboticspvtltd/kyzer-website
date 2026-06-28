import Link from 'next/link'
import { CategoryCard } from '@/components/shop/CategoryCard'
import { ProductCard } from '@/components/shop/ProductCard'
import { CATEGORIES } from '@/data/products'
import { getMergedProducts } from '@/lib/getProducts'
import { ArrowRight, Zap } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Shop — Kyzer Robotics',
  description: 'Electronics, drones, 3D printing, prototyping and more. Built for makers, engineers and hobbyists.',
}

export default async function ShopPage() {
  const products = await getMergedProducts()
  const featured = products.filter(p => p.featured && p.inStock)

  return (
    <div className="min-h-screen bg-[#f8f8f6] font-[\'DM_Sans\',sans-serif]">
      {/* Nav spacer */}
      <div className="h-[90px]" />

      {/* Hero */}
      <section className="px-4 sm:px-8 lg:px-16 pt-12 pb-10 max-w-7xl mx-auto">
        <p className="font-mono text-[11px] text-[#FF8C35] tracking-[0.2em] uppercase mb-3">Kyzer Robotics Store</p>
        <h1 className="font-['Bebas_Neue',sans-serif] text-[clamp(48px,7vw,80px)] leading-none text-[#111] mb-4">
          Build Something <span className="text-[#FF8C35]">Real.</span>
        </h1>
        <p className="text-[16px] text-gray-500 max-w-xl leading-relaxed mb-8">
          Electronics, drones, 3D printing services and rapid prototyping — everything a maker needs, shipped from Pune.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link
            href="#categories"
            className="inline-flex items-center gap-2 bg-[#111] text-white px-5 py-2.5 rounded-xl text-[14px] font-medium hover:bg-[#FF8C35] hover:text-[#111] transition-colors"
          >
            Browse All <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="https://wa.me/919049695264?text=Hi! I need help finding a product."
            target="_blank"
            className="inline-flex items-center gap-2 bg-white border border-black/10 text-[#111] px-5 py-2.5 rounded-xl text-[14px] font-medium hover:border-[#FF8C35] hover:text-[#FF8C35] transition-colors"
          >
            <Zap className="w-4 h-4" /> Ask on WhatsApp
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="px-4 sm:px-8 lg:px-16 py-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-['Bebas_Neue',sans-serif] text-[28px] text-[#111] tracking-wide">Categories</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {CATEGORIES.map(cat => (
            <CategoryCard
              key={cat.id}
              category={cat}
              productCount={products.filter(p => p.category === cat.slug).length}
            />
          ))}
        </div>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="px-4 sm:px-8 lg:px-16 py-12 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-mono text-[11px] text-[#FF8C35] tracking-[0.15em] uppercase mb-1">Handpicked</p>
              <h2 className="font-['Bebas_Neue',sans-serif] text-[28px] text-[#111] tracking-wide">Featured Products</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* All categories grid */}
      <section className="px-4 sm:px-8 lg:px-16 py-12 max-w-7xl mx-auto">
        {CATEGORIES.map(cat => {
          const catProducts = products.filter(p => p.category === cat.slug).slice(0, 4)
          if (catProducts.length === 0) return null
          return (
            <div key={cat.id} className="mb-14">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.emoji}</span>
                  <h3 className="font-['Bebas_Neue',sans-serif] text-[22px] text-[#111] tracking-wide">{cat.name}</h3>
                </div>
                <Link
                  href={`/shop/${cat.slug}`}
                  className="inline-flex items-center gap-1 text-[13px] text-[#FF8C35] font-medium hover:underline"
                >
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {catProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )
        })}
      </section>

      {/* Quote CTA */}
      <section className="px-4 sm:px-8 lg:px-16 pb-20 max-w-7xl mx-auto">
        <div className="rounded-2xl bg-[#111] text-white p-8 sm:p-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] text-[#FF8C35] tracking-[0.2em] uppercase mb-2">Need something custom?</p>
            <h3 className="font-['Bebas_Neue',sans-serif] text-[32px] leading-tight mb-2">Get a Free Quote</h3>
            <p className="text-[14px] text-gray-400 max-w-md">3D printing, PCB design, CNC, custom drones — describe your project and we'll get back within 4 hours.</p>
          </div>
          <Link
            href="/get-a-quote"
            className="shrink-0 inline-flex items-center gap-2 bg-[#FF8C35] text-[#111] px-6 py-3 rounded-xl text-[14px] font-semibold hover:bg-[#ffa050] transition-colors whitespace-nowrap"
          >
            Get a Quote <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
