'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { Product } from '@/data/products'
import { ShoppingCart, Zap } from 'lucide-react'
import Link from 'next/link'

const BADGE_STYLES: Record<string, string> = {
  HOT: 'bg-red-500 text-white border-0',
  NEW: 'bg-[#FF8C35] text-white border-0',
  SALE: 'bg-green-500 text-white border-0',
  LIMITED: 'bg-purple-500 text-white border-0',
}

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const whatsappText = product.whatsappMsg
    ?? `Hi! I'm interested in ${product.name} (₹${product.price.toLocaleString('en-IN')}). Can you confirm availability?`

  return (
    <Link href={`/shop/product/${product.slug}`} className="block group">
      <Card className="relative flex flex-col overflow-hidden border border-black/[0.07] bg-white rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:border-[#FF8C35]/30 h-full">
        {/* Image / Emoji area */}
        <div className="relative flex items-center justify-center h-48 bg-[#f4f4f2] border-b border-black/[0.06] overflow-hidden transition-colors duration-300 group-hover:bg-[#fff5ed]">
          {product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4" />
          ) : (
            <span className="text-6xl select-none">{product.emoji}</span>
          )}

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 left-3">
              <Badge className={`text-[10px] font-bold tracking-wide px-2 py-0.5 ${BADGE_STYLES[product.badge]}`}>
                {product.badge}
              </Badge>
            </div>
          )}

          {/* Out of stock overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-4 gap-3">
          <div className="flex-1">
            <p className="text-[10px] font-mono text-[#FF8C35] tracking-[0.12em] uppercase mb-1">
              {product.subcategory.replace(/-/g, ' ')}
            </p>
            <h3 className="text-[15px] font-semibold text-[#111] leading-tight mb-1.5">{product.name}</h3>
            <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-3">{product.shortDesc}</p>
          </div>

          {/* Price + actions */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-black/[0.06]">
            <div>
              {product.price > 0 ? (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[17px] font-bold text-[#111]">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-[12px] text-gray-400 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-[13px] text-gray-400 italic">Price on request</span>
              )}
            </div>

            <div className="flex gap-1.5">
              <Button
                size="sm"
                variant="outline"
                className="h-8 px-2.5 text-[12px] border-black/10 text-gray-600 hover:border-[#FF8C35] hover:text-[#FF8C35] hover:bg-[#fff5ed]"
                onClick={e => { e.preventDefault(); window.open(`https://wa.me/919049695264?text=${encodeURIComponent(whatsappText)}`, '_blank') }}
              >
                <Zap className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                disabled={!product.inStock}
                className="h-8 px-3 text-[12px] bg-[#111] text-white hover:bg-[#FF8C35] hover:text-[#111] transition-colors"
                onClick={e => { e.preventDefault(); onAddToCart?.(product) }}
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
