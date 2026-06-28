import { createClient } from '@supabase/supabase-js';

// Server-only — never import this from a 'use client' component
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);
