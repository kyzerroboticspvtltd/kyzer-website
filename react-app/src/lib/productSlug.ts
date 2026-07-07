export function slugify(str: string): string {
  return String(str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Deterministic slug for a product that only has id/name (no explicit slug field). */
export function productSlug(p: { id: string; name: string; slug?: string }): string {
  return p.slug || `${slugify(p.name)}-${slugify(p.id)}`;
}
