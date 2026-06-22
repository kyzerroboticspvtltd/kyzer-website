'use client'

import { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface Ticket {
  id: string
  name: string
  email: string
  subject: string
  message: string
  submitted_at: string
  status?: string
}

export function AdminTickets({ token }: { token: string }) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin-tickets', { headers: { Authorization: `Bearer ${token}` } })
        if (res.ok) setTickets((await res.json()).tickets ?? [])
      } catch { /* empty */ }
      finally { setLoading(false) }
    }
    load()
  }, [token])

  const filtered = tickets.filter(t => {
    const q = search.toLowerCase()
    return !q || t.name?.toLowerCase().includes(q) || t.subject?.toLowerCase().includes(q)
  })

  if (loading) return <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-14 rounded-2xl" />)}</div>

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h2 className="font-['Bebas_Neue',sans-serif] text-[28px] text-[#111] tracking-wide">Support Tickets</h2>
        <p className="text-[13px] text-gray-400">{tickets.length} tickets</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input placeholder="Search tickets…" value={search} onChange={e => setSearch(e.target.value)}
          className="pl-9 h-10 bg-white border-black/10 rounded-xl text-[13px]" />
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.07] overflow-hidden">
        {!filtered.length ? (
          <div className="py-16 text-center text-[13px] text-gray-400">No support tickets.</div>
        ) : (
          <div className="divide-y divide-black/[0.05]">
            {filtered.map(t => (
              <div key={t.id}>
                <div className="px-5 py-4 flex items-center gap-4 hover:bg-[#fafaf8] cursor-pointer transition-colors"
                  onClick={() => setExpanded(expanded === t.id ? null : t.id)}>
                  <div className="w-9 h-9 rounded-xl bg-[#f4f4f2] flex items-center justify-center text-xl shrink-0">🎫</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#111] truncate">{t.subject}</p>
                    <p className="text-[11px] text-gray-400 font-mono">{t.name} · {t.email}</p>
                  </div>
                  <p className="text-[11px] text-gray-400 shrink-0">{new Date(t.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                </div>
                {expanded === t.id && (
                  <div className="px-5 pb-5 pt-3 bg-[#fafaf9] border-t border-black/[0.05] space-y-3">
                    <p className="text-[13px] text-[#111] leading-relaxed">{t.message}</p>
                    <a href={`mailto:${t.email}?subject=Re: ${t.subject}`}
                      className="inline-flex items-center gap-1 text-[13px] text-[#FF8C35] font-medium hover:underline">
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
