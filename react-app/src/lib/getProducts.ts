import { supabaseAdmin } from './supabase-admin';
import { PRODUCTS, type Product } from '@/data/products';
import { productSlug } from './productSlug';

export async function getMergedProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('site_data')
      .select('products')
      .eq('id', 1)
      .single();

    if (error || !data?.products) return PRODUCTS;

    const adminProducts: Product[] = Array.isArray(data.products) ? data.products : [];
    if (adminProducts.length === 0) return PRODUCTS;

    // Admin products override static ones by slug; new slugs are appended.
    // Admin-created products rarely have an explicit `slug`, so derive one
    // deterministically from id/name — every product must resolve to a page.
    const bySlug = new Map<string, Product>(PRODUCTS.map(p => [p.slug, p]));
    for (const p of adminProducts) {
      const slug = productSlug(p);
      bySlug.set(slug, { ...p, slug });
    }
    return Array.from(bySlug.values());
  } catch {
    return PRODUCTS;
  }
}
