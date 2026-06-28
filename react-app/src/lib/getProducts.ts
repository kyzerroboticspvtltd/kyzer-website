import { supabaseAdmin } from './supabase-admin';
import { PRODUCTS, type Product } from '@/data/products';

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

    // Admin products override static ones by slug; new slugs are appended
    const bySlug = new Map<string, Product>(PRODUCTS.map(p => [p.slug, p]));
    for (const p of adminProducts) {
      if (p.slug) bySlug.set(p.slug, p);
    }
    return Array.from(bySlug.values());
  } catch {
    return PRODUCTS;
  }
}
