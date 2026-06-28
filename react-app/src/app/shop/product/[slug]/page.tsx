import { notFound } from 'next/navigation'
import { getMergedProducts } from '@/lib/getProducts'
import ProductPageClient from './ProductPageClient'

export const dynamic = 'force-dynamic'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const products = await getMergedProducts()
  const product = products.find(p => p.slug === slug)
  if (!product) notFound()

  const related = products
    .filter(p => p.category === product.category && p.slug !== slug)
    .slice(0, 4)

  return <ProductPageClient product={product} related={related} />
}
