import Link from 'next/link'
import type { Category } from '@/data/products'
import { ArrowRight } from 'lucide-react'

interface CategoryCardProps {
  category: Category
  productCount: number
}

export function CategoryCard({ category, productCount }: CategoryCardProps) {
  return (
    <Link
      href={`/shop/${category.slug}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-black/[0.07] bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.09)] hover:border-[#FF8C35]/40"
    >
      {/* Glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF8C35]/0 to-[#FF8C35]/0 group-hover:from-[#FF8C35]/5 group-hover:to-transparent transition-all duration-300 rounded-2xl pointer-events-none" />

      <div>
        <span className="text-4xl mb-4 block">{category.emoji}</span>
        <h3 className="text-[18px] font-semibold text-[#111] mb-2">{category.name}</h3>
        <p className="text-[13px] text-gray-500 leading-relaxed">{category.description}</p>
      </div>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-black/[0.06]">
        <span className="font-mono text-[11px] text-[#FF8C35] tracking-wider">
          {productCount} product{productCount !== 1 ? 's' : ''}
        </span>
        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#FF8C35] group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  )
}
