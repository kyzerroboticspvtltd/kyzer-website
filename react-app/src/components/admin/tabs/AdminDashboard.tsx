'use client'

import { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp, ShoppingBag, Users, Printer, Eye } from 'lucide-react'

interface Stats {
  totalRevenue: number
  shopOrders: number
  printOrders: number
  customers: number
  recentOrders: RecentOrder[]
  csVisits?: { total: number; today: number; week: number }
}

interface RecentOrder {
  id: string
  name: string
  total: number
  status: string
  type: 'shop' | 'print'
  date: string
}

const STATUS_COLOR: Record<string, string> = {
  new: 'bg-[#FF8C35] text-white',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
}

function KpiCard({ label, value, icon, sub, highlight }: { label: string; value: string | number; icon: React.ReactNode; sub?: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${highlight ? 'bg-[#FF8C35]/8 border-[#FF8C35]/25' : 'bg-white border-black/[0.07]'}`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-[11px] font-mono text-gray-400 tracking-widest uppercase">{label}</p>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${highlight ? 'bg-[#FF8C35] text-white' : 'bg-[#f4f4f2] text-gray-500'}`}>
          {icon}
        </div>
      </div>
      <p className="font-['Bebas_Neue',sans-serif] text-[36px] leading-none text-[#111]">{value}</p>
      {sub && <p className="text-[11px] text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

export function AdminDashboard({ token }: { token: string }) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin-stats', { headers: { Authorization: `Bearer ${token}` } })
        if (res.ok) setStats(await res.json())
      } catch { /* show empty */ }
      finally { setLoading(false) }
    }
    load()
  }, [token])

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
      </div>
      <Skeleton className="h-28 rounded-2xl" />
      <Skeleton className="h-72 rounded-2xl" />
    </div>
  )

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="font-['Bebas_Neue',sans-serif] text-[28px] text-[#111] tracking-wide">Dashboard</h2>
        <p className="text-[13px] text-gray-400">Welcome back. Here's what's happening.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Revenue" value={stats ? `₹${(stats.totalRevenue).toLocaleString('en-IN')}` : '—'} icon={<TrendingUp className="w-4 h-4" />} highlight />
        <KpiCard label="Shop Orders" value={stats?.shopOrders ?? '—'} icon={<ShoppingBag className="w-4 h-4" />} />
        <KpiCard label="3D Orders" value={stats?.printOrders ?? '—'} icon={<Printer className="w-4 h-4" />} />
        <KpiCard label="Customers" value={stats?.customers ?? '—'} icon={<Users className="w-4 h-4" />} />
      </div>

      {/* Coming Soon Visitors */}
      <div className="bg-white rounded-2xl border border-black/[0.07] p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-[#f4f4f2] flex items-center justify-center text-gray-500">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#111]">Coming Soon — Visitor Traffic</p>
            <p className="text-[11px] text-gray-400">Unique sessions that landed on the coming soon page</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-[#f8f8f6] rounded-xl">
            <p className="font-['Bebas_Neue',sans-serif] text-[32px] leading-none text-[#111]">{stats?.csVisits?.today ?? 0}</p>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mt-1">Today</p>
          </div>
          <div className="text-center p-3 bg-[#f8f8f6] rounded-xl">
            <p className="font-['Bebas_Neue',sans-serif] text-[32px] leading-none text-[#111]">{stats?.csVisits?.week ?? 0}</p>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mt-1">Last 7 days</p>
          </div>
          <div className="text-center p-3 bg-[#FF8C35]/8 border border-[#FF8C35]/20 rounded-xl">
            <p className="font-['Bebas_Neue',sans-serif] text-[32px] leading-none text-[#111]">{stats?.csVisits?.total ?? 0}</p>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mt-1">All Time</p>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-black/[0.07] overflow-hidden">
        <div className="px-5 py-4 border-b border-black/[0.06]">
          <h3 className="text-[14px] font-semibold text-[#111]">Recent Orders</h3>
        </div>
        {!stats?.recentOrders?.length ? (
          <div className="px-5 py-12 text-center text-[13px] text-gray-400">No orders yet.</div>
        ) : (
          <div className="divide-y divide-black/[0.05]">
            {stats.recentOrders.map(order => (
              <div key={order.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-[#fafaf8] transition-colors">
                <div className="w-8 h-8 rounded-xl bg-[#f4f4f2] flex items-center justify-center text-[16px] shrink-0">
                  {order.type === 'shop' ? '🛒' : '🖨️'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[#111] truncate">{order.name}</p>
                  <p className="text-[11px] text-gray-400 font-mono">{order.id} · {order.date}</p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${STATUS_COLOR[order.status] ?? 'bg-gray-100 text-gray-500'}`}>
                  {order.status}
                </span>
                <p className="text-[14px] font-semibold text-[#111] whitespace-nowrap">₹{order.total.toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
