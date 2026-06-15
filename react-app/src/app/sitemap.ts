import type { MetadataRoute } from 'next';

const BASE = 'https://kyzerrobotics.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/get-a-quote', priority: 0.9, changeFrequency: 'monthly' },
    // Shop
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
    { path: '/about', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/pricing', priority: 0.5, changeFrequency: 'monthly' },
    // Legal
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/refund-policy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/cancellation', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/shipping-policy', priority: 0.3, changeFrequency: 'yearly' },
  ];

  return routes.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
