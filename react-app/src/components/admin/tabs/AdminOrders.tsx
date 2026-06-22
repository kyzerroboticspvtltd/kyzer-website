'use client'

import { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface PrintOrder {
  id: string
  name: string
  email: string
  phone?: string
  material: string
  color?: string
  quantity: number
  price?: number
  notes?: string
  fileUrl?: string
  status: string
  submitted_at: string
}

const STATUS_COLOR: Record<string, string> = {
  new: 'bg-[#FF8C35]/15 text-[#FF8C35]',
  reviewing: 'bg-yellow-50 text-yellow-700',
  printing: 'bg-blue-50 text-blue-600',
  ready: 'bg-purple-50 text-purple-600',
  completed: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-600',
}

export function AdminOrders({ token }: { token: string }) {
  const [orders, setOrders] = useState<PrintOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin-print-orders', { headers: { Authorization: `Bearer ${token}` } })
        if (res.ok) setOrders((await res.json()).orders ?? [])
      } catch { /* empty */ }
      finally { setLoading(false) }
    }
    load()
  }, [token])

  const filtered = orders.filter(o => {
    const q = search.toLowerCase()
    return !q || o.name?.toLowerCase().includes(q) || o.email?.toLowerCase().includes(q)
  })

  if (loading) return <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}</div>

  return (
    <div className="space-y-5 max-w-5xl">
      <div>
        <h2 className="font-['Bebas_Neue',sans-serif] text-[28px] text-[#111] tracking-wide">3D Print Orders</h2>
        <p className="text-[13px] text-gray-400">{orders.length} total orders</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)}
          className="pl-9 h-10 bg-white border-black/10 rounded-xl text-[13px]" />
      </div>

      <div className="bg-white rounded-2xl border border-black/[0.07] overflow-hidden">
        {!filtered.length ? (
          <div className="py-16 text-center text-[13px] text-gray-400">No print orders yet.</div>
        ) : (
          <div className="divide-y divide-black/[0.05]">
            {filtered.map(order => (
              <div key={order.id}>
                <div className="px-5 py-4 flex items-center gap-4 hover:bg-[#fafaf8] cursor-pointer transition-colors"
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                  <div className="w-9 h-9 rounded-xl bg-[#f4f4f2] flex items-center justify-center text-xl shrink-0">🖨️</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-[13px] font-semibold text-[#111]">{order.name}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${STATUS_COLOR[order.status] ?? 'bg-gray-100 text-gray-500'}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 font-mono">{order.material} · {order.email}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {order.price ? <p className="text-[14px] font-bold text-[#111]">₹{order.price.toLocaleString('en-IN')}</p> : <p className="text-[12px] text-gray-400 italic">Quote pending</p>}
                    <p className="text-[11px] text-gray-400">{new Date(order.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                  </div>
                </div>

                {expanded === order.id && (
                  <div className="px-5 pb-5 bg-[#fafaf9] border-t border-black/[0.05] grid grid-cols-2 gap-4 mt-4">
                    {[
                      ['Material', order.material],
                      ['Color', order.color || '—'],
                      ['Quantity', String(order.quantity)],
                      ['Phone', order.phone || '—'],
                      ['Email', order.email],
                      ['Notes', order.notes || '—'],
                    ].map(([label, val]) => (
                      <div key={label}>
                        <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
                        <p className="text-[13px] text-[#111]">{val}</p>
                      </div>
                    ))}
                    {order.fileUrl && (
                      <div className="col-span-2">
                        <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">File</p>
                        <a href={order.fileUrl} target="_blank" rel="noopener noreferrer"
                          className="text-[13px] text-[#FF8C35] underline">Download file</a>
                      </div>
                    )}
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
