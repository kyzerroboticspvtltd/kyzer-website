/**
 * Server-side order persistence.
 *
 * Writes to the Supabase `orders` table using the service-role key so the
 * server is the source of truth for every order — independent of whether the
 * confirmation email sends or the customer's browser finishes the request.
 *
 * Table shape (see react-app/supabase-setup.sql) — matches the columns the
 * admin panel and public site already use:
 *   id            text primary key
 *   status        text
 *   data          jsonb         -- full order snapshot (order `type` lives here)
 *   submitted_at  timestamptz default now()
 */

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SB_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export interface PersistableOrder {
  id?: string;
  status?: string;
  type?: 'shop' | 'cod' | 'print' | 'quote';
  [key: string]: unknown;
}

/**
 * Upsert an order into Supabase. Never throws — persistence must not break the
 * checkout flow. Returns true on success so callers can log failures.
 */
export async function saveOrder(order: PersistableOrder, type: PersistableOrder['type']): Promise<boolean> {
  if (!SB_URL || !SB_KEY) {
    console.warn('saveOrder skipped: Supabase not configured');
    return false;
  }
  try {
    const id = order.id || `${(type || 'ord').toUpperCase()}-${Date.now()}`;
    const submittedAt = (order.submittedAt as string) || new Date().toISOString();
    // Normalise email casing so it reliably matches the lowercase email stored
    // in the customer's login JWT when "My Orders" looks up their history.
    const email = typeof order.email === 'string' ? order.email.trim().toLowerCase() : order.email;
    const row = {
      id,
      status: order.status || 'new',
      // `type` is kept inside `data` to match the existing table schema used by
      // the public site and admin panel (which read row.data / row.submitted_at).
      data: { ...order, id, type, submittedAt, email },
      submitted_at: submittedAt,
    };
    const r = await fetch(`${SB_URL}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        'apikey': SB_KEY,
        'Authorization': `Bearer ${SB_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify(row),
    });
    if (!r.ok) {
      console.error('saveOrder failed:', r.status, await r.text().catch(() => ''));
      return false;
    }
    return true;
  } catch (err) {
    console.error('saveOrder error:', err);
    return false;
  }
}
