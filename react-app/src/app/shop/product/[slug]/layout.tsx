import type { Metadata } from 'next'
import { getMergedProducts } from '@/lib/getProducts'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const products = await getMergedProducts()
  const product = products.find(p => p.slug === slug)
  if (!product) return { title: 'Product Not Found' }
  return {
    title: `${product.name} | Kyzer Robotics`,
    description: product.shortDesc || product.name,
    openGraph: {
      title: product.name,
      description: product.shortDesc || product.name,
      url: `https://kyzerrobotics.com/shop/product/${slug}`,
      images: product.image ? [{ url: product.image }] : undefined,
    },
  }
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children
}
