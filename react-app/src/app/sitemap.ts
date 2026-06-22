import type { MetadataRoute } from 'next';
import { PRODUCTS, CATEGORIES } from '@/data/products';

const BASE = 'https://kyzerrobotics.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/shop', priority: 0.9, changeFrequency: 'daily' },
    { path: '/get-a-quote', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/consultation', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/portfolio', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/blog', priority: 0.8, changeFrequency: 'daily' },
    // Service pages
    { path: '/services/3d-printing', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/services/drone-development', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/services/pcb-design', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/services/prototyping', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/services/industrial-automation', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/services/robotics-solutions', priority: 0.9, changeFrequency: 'monthly' },
    // SEO location pages
    { path: '/locations/3d-printing-pune', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/locations/drone-development-pune', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/locations/robotics-company-pune', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/locations/prototype-manufacturing-india', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/locations/industrial-automation-pune', priority: 0.8, changeFrequency: 'monthly' },
    // Shop categories
    { path: '/shop/drones', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/shop/drone-frames', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/shop/complete-drones', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/shop/electronics', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/shop/electronics/arduino', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/shop/electronics/products', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/shop/3d-printing', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/shop/printing', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/shop/printers-supplies', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/shop/prototyping', priority: 0.7, changeFrequency: 'monthly' },
    // Company
    { path: '/about', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/pricing', priority: 0.6, changeFrequency: 'monthly' },
    // Legal
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/refund-policy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/cancellation', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/shipping-policy', priority: 0.3, changeFrequency: 'yearly' },
  ];

  const productRoutes: MetadataRoute.Sitemap = PRODUCTS.map(p => ({
    url: `${BASE}/shop/product/${p.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map(c => ({
    url: `${BASE}/shop/${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    ...staticRoutes.map(r => ({ url: `${BASE}${r.path}`, lastModified: now, changeFrequency: r.changeFrequency, priority: r.priority })),
    ...categoryRoutes,
    ...productRoutes,
  ];
}
