'use client'

import { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'

interface Order {
  id: string
  status: string
  submitted_at: string
  data: {
    name?: string
    email?: string
    orderId?: string
    total?: number
    paymentMethod?: string
    items?: { name: string; qty: number; price: number | string }[]
    address?: string
  }
}

const STATUS_COLOR: Record<string, string> = {
  new: 'bg-[#FF8C35]/15 text-[#FF8C35]',
  processing: 'bg-blue-50 text-blue-600',
  shipped: 'bg-purple-50 text-purple-600',
  completed: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-600',
}

const STATUSES = ['new', 'processing', 'shipped', 'completed', 'cancelled']

export function AdminShopOrders({ token }: { token: string }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => { loadOrders() }, [])

  async function loadOrders() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin-orders', { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders ?? [])
      }
    } catch { /* empty */ }
    finally { setLoading(false) }
  }

  async function updateStatus(orderId: string, status: string) {
    setUpdating(orderId)
    try {
      await fetch('/api/order-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderId, status }),
      })
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
    } catch { /* ignore */ }
    finally { setUpdating(null) }
  }

  const filtered = orders.filter(o => {
    const q = search.toLowerCase()
    return !q || o.data.name?.toLowerCase().includes(q) || o.data.email?.toLowerCase().includes(q) || o.data.orderId?.toLowerCase().includes(q)
  })

  if (loading) return <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}</div>

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-['Bebas_Neue',sans-serif] text-[28px] text-[#111] tracking-wide">Shop Orders</h2>
          <p className="text-[13px] text-gray-400">{orders.length} total orders</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input placeholder="Search by name, email, order ID…" value={search} onChange={e => setSearch(e.target.value)}
          className="pl-9 h-10 bg-white border-black/10 rounded-xl text-[13px]" />
      </div>

      {/* Orders list */}
      <div className="bg-white rounded-2xl border border-black/[0.07] overflow-hidden">
        {!filtered.length ? (
          <div className="py-16 text-center text-[13px] text-gray-400">No orders found.</div>
        ) : (
          <div className="divide-y divide-black/[0.05]">
            {filtered.map(order => {
              const isOpen = expanded === order.id
              return (
                <div key={order.id}>
                  <div
                    className="px-5 py-4 flex items-center gap-4 hover:bg-[#fafaf8] cursor-pointer transition-colors"
                    onClick={() => setExpanded(isOpen ? null : order.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-[13px] font-semibold text-[#111]">{order.data.name || '—'}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${STATUS_COLOR[order.status] ?? 'bg-gray-100 text-gray-500'}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 font-mono">{order.data.orderId || order.id} · {order.data.email}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[14px] font-bold text-[#111]">₹{(order.data.total || 0).toLocaleString('en-IN')}</p>
                      <p className="text-[11px] text-gray-400">{new Date(order.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div className="px-5 pb-5 bg-[#fafaf9] border-t border-black/[0.05]">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        {/* Items */}
                        <div>
                          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-2">Items</p>
                          {order.data.items?.map((item, i) => (
                            <div key={i} className="flex justify-between text-[13px] py-1 border-b border-black/[0.05] last:border-0">
                              <span className="text-[#111]">{item.name} × {item.qty}</span>
                              <span className="text-gray-500">₹{Number(item.price).toLocaleString('en-IN')}</span>
                            </div>
                          ))}
                        </div>

                        {/* Details */}
                        <div className="space-y-3">
                          <div>
                            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">Delivery Address</p>
                            <p className="text-[13px] text-[#111] leading-relaxed">{order.data.address || '—'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">Payment</p>
                            <p className="text-[13px] text-[#111]">{order.data.paymentMethod === 'cod' ? '📦 Cash on Delivery' : '💳 Online Payment'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1.5">Update Status</p>
                            <Select value={order.status} onValueChange={val => val && updateStatus(order.id, val)}>
                              <SelectTrigger className="h-9 text-[13px] bg-white border-black/10 rounded-xl w-44" disabled={updating === order.id}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {STATUSES.map(s => <SelectItem key={s} value={s} className="text-[13px] capitalize">{s}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
