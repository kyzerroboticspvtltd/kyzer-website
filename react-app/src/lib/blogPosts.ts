import { supabaseAdmin } from './supabase-admin';

export interface BlogPostBlock {
  heading?: string;
  body: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  emoji: string;
  excerpt: string;
  content?: BlogPostBlock[];
  visible?: boolean;
}

/** Admin-authored posts stored in site_data.blogPosts, appended to the static ones by slug. */
export async function getAdminBlogPosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('site_data')
      .select('blogPosts')
      .eq('id', 1)
      .single();
    if (error || !Array.isArray(data?.blogPosts)) return [];
    return (data.blogPosts as BlogPost[]).filter(p => p.visible !== false);
  } catch {
    return [];
  }
}

export async function getAllBlogPosts(staticPosts: BlogPost[]): Promise<BlogPost[]> {
  const admin = await getAdminBlogPosts();
  const bySlug = new Map<string, BlogPost>(staticPosts.map(p => [p.slug, p]));
  for (const p of admin) bySlug.set(p.slug, p);
  return Array.from(bySlug.values()).sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getBlogPostBySlug(slug: string, staticPosts: Record<string, Omit<BlogPost, 'slug'>>): Promise<BlogPost | null> {
  if (staticPosts[slug]) return { slug, ...staticPosts[slug] };
  const admin = await getAdminBlogPosts();
  return admin.find(p => p.slug === slug) || null;
}
