'use client'

import { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface Quote {
  id: string
  name: string
  email: string
  phone?: string
  service?: string
  message: string
  submitted_at: string
  budget?: string
}

export function AdminQuotes({ token }: { token: string }) {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin-quotes', { headers: { Authorization: `Bearer ${token}` } })
        if (res.ok) setQuotes((await res.json()).quotes ?? [])
      } catch { /* empty */ }
      finally { setLoading(false) }
    }
    load()
  }, [token])

  const filtered = quotes.filter(q => {
    const s = search.toLowerCase()
    return !s || q.name?.toLowerCase().includes(s) || q.email?.toLowerCase().includes(s)
  })

  if (loading) return <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}</div>

  return (
    <div className="space-y-5 max-w-5xl">
      <div>
        <h2 className="font-['Bebas_Neue',sans-serif] text-[28px] text-[#111] tracking-wide">Quote Inquiries</h2>
        <p className="text-[13px] text-gray-400">{quotes.length} total inquiries</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}
          className="pl-9 h-10 bg-white border-black/10 rounded-xl text-[13px]" />
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.07] overflow-hidden">
        {!filtered.length ? (
          <div className="py-16 text-center text-[13px] text-gray-400">No quote inquiries yet.</div>
        ) : (
          <div className="divide-y divide-black/[0.05]">
            {filtered.map(q => (
              <div key={q.id}>
                <div className="px-5 py-4 flex items-center gap-4 hover:bg-[#fafaf8] cursor-pointer transition-colors"
                  onClick={() => setExpanded(expanded === q.id ? null : q.id)}>
                  <div className="w-9 h-9 rounded-xl bg-[#fff5ed] flex items-center justify-center text-xl shrink-0">💬</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#111]">{q.name}</p>
                    <p className="text-[11px] text-gray-400 font-mono">{q.service || 'General'} · {q.email}</p>
                  </div>
                  <p className="text-[11px] text-gray-400 shrink-0">{new Date(q.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                </div>

                {expanded === q.id && (
                  <div className="px-5 pb-5 bg-[#fafaf9] border-t border-black/[0.05] space-y-3 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      {[['Phone', q.phone || '—'], ['Budget', q.budget || '—'], ['Service', q.service || '—']].map(([l, v]) => (
                        <div key={l}>
                          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-0.5">{l}</p>
                          <p className="text-[13px] text-[#111]">{v}</p>
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">Message</p>
                      <p className="text-[13px] text-[#111] leading-relaxed">{q.message}</p>
                    </div>
                    <a href={`mailto:${q.email}?subject=Re: Your quote inquiry`}
                      className="inline-flex items-center gap-1.5 text-[13px] text-[#FF8C35] font-medium hover:underline">
                      Reply via email →
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
