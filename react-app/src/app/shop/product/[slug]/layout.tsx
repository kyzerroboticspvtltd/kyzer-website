import type { Metadata } from 'next'
import { getProductBySlug } from '@/data/products'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return { title: 'Product Not Found' }
  return {
    title: `${product.name} | Kyzer Robotics`,
    description: product.shortDesc,
    openGraph: {
      title: product.name,
      description: product.shortDesc,
      url: `https://kyzerrobotics.com/shop/product/${slug}`,
    },
  }
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children
}
