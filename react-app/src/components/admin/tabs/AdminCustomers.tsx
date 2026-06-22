'use client'

import { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface Customer {
  id: string
  email: string
  name?: string
  phone?: string
  created_at: string
}

export function AdminCustomers({ token }: { token: string }) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin-customers', { headers: { Authorization: `Bearer ${token}` } })
        if (res.ok) setCustomers((await res.json()).customers ?? [])
      } catch { /* empty */ }
      finally { setLoading(false) }
    }
    load()
  }, [token])

  const filtered = customers.filter(c => {
    const q = search.toLowerCase()
    return !q || c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q)
  })

  if (loading) return <div className="space-y-3">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-14 rounded-2xl" />)}</div>

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h2 className="font-['Bebas_Neue',sans-serif] text-[28px] text-[#111] tracking-wide">Customers</h2>
        <p className="text-[13px] text-gray-400">{customers.length} registered customers</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)}
          className="pl-9 h-10 bg-white border-black/10 rounded-xl text-[13px]" />
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.07] overflow-hidden">
        {!filtered.length ? (
          <div className="py-16 text-center text-[13px] text-gray-400">No customers found.</div>
        ) : (
          <div className="divide-y divide-black/[0.05]">
            {filtered.map(c => {
              const initials = (c.name || c.email).split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
              return (
                <div key={c.id} className="px-5 py-3.5 flex items-center gap-3 hover:bg-[#fafaf8] transition-colors">
                  <div className="w-9 h-9 rounded-full bg-[#fff5ed] border border-[#FF8C35]/20 flex items-center justify-center text-[12px] font-bold text-[#FF8C35] shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[#111]">{c.name || '—'}</p>
                    <p className="text-[11px] text-gray-400 font-mono">{c.email}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {c.phone && <p className="text-[12px] text-gray-500">{c.phone}</p>}
                    <p className="text-[11px] text-gray-400">{new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
