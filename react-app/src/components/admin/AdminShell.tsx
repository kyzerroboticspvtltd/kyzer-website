'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { AdminDashboard } from './tabs/AdminDashboard'
import { AdminOrders } from './tabs/AdminOrders'
import { AdminShopOrders } from './tabs/AdminShopOrders'
import { AdminQuotes } from './tabs/AdminQuotes'
import { AdminCustomers } from './tabs/AdminCustomers'
import { AdminProducts } from './tabs/AdminProducts'
import { AdminTickets } from './tabs/AdminTickets'
import { AdminSettings } from './tabs/AdminSettings'
import {
  LayoutDashboard, ShoppingBag, Printer, MessageSquare,
  Users, Package, Ticket, Settings, LogOut, Menu, X,
  ChevronRight,
} from 'lucide-react'

type Tab = 'dashboard' | 'shoporders' | 'orders' | 'quotes' | 'customers' | 'products' | 'tickets' | 'settings'

interface NavItem {
  id: Tab
  label: string
  icon: React.ReactNode
  section?: string
  badgeKey?: string
}

const NAV: NavItem[] = [
  { id: 'dashboard',  label: 'Dashboard',      icon: <LayoutDashboard className="w-4 h-4" />, section: 'OVERVIEW' },
  { id: 'shoporders', label: 'Shop Orders',     icon: <ShoppingBag className="w-4 h-4" />,    section: 'SALES' },
  { id: 'orders',     label: '3D Print Orders', icon: <Printer className="w-4 h-4" /> },
  { id: 'quotes',     label: 'Quote Inquiries', icon: <MessageSquare className="w-4 h-4" /> },
  { id: 'customers',  label: 'Customers',       icon: <Users className="w-4 h-4" /> },
  { id: 'products',   label: 'Products',        icon: <Package className="w-4 h-4" />,         section: 'CATALOG' },
  { id: 'tickets',    label: 'Support Tickets', icon: <Ticket className="w-4 h-4" />,          section: 'SUPPORT' },
  { id: 'settings',   label: 'Settings',        icon: <Settings className="w-4 h-4" />,        section: 'SYSTEM' },
]

export function AdminShell({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function SidebarContent() {
    return (
      <nav className="flex flex-col h-full">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-black/[0.06]">
          <span className="font-['Bebas_Neue',sans-serif] text-[22px] text-[#FF8C35] tracking-wide">KYZER</span>
          <span className="text-[10px] font-mono text-gray-400 tracking-widest ml-2 uppercase">Admin</span>
        </div>

        {/* Nav items */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          {NAV.map((item, i) => (
            <div key={item.id}>
              {item.section && (
                <p className="text-[9px] font-mono text-gray-400 tracking-[0.15em] uppercase px-2 mt-4 mb-1.5 first:mt-1">
                  {item.section}
                </p>
              )}
              <button
                onClick={() => { setTab(item.id); setSidebarOpen(false) }}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all mb-0.5',
                  tab === item.id
                    ? 'bg-[#FF8C35] text-[#111]'
                    : 'text-gray-500 hover:bg-[#f4f4f2] hover:text-[#111]'
                )}
              >
                {item.icon}
                {item.label}
              </button>
            </div>
          ))}
        </div>

        {/* Logout */}
        <div className="p-3 border-t border-black/[0.06]">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </nav>
    )
  }

  const activeLabel = NAV.find(n => n.id === tab)?.label ?? ''

  return (
    <div className="min-h-screen bg-[#f8f8f6] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-52 shrink-0 bg-white border-r border-black/[0.07] fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-52 bg-white h-full shadow-xl z-50">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 lg:ml-52 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-black/[0.07] px-4 sm:px-6 h-14 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-[#111]">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5 text-[12px] text-gray-400 font-mono">
            <span>Admin</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#111] font-semibold">{activeLabel}</span>
          </div>
        </header>

        {/* Tab content */}
        <div className="flex-1 p-4 sm:p-6">
          {tab === 'dashboard'  && <AdminDashboard token={token} />}
          {tab === 'shoporders' && <AdminShopOrders token={token} />}
          {tab === 'orders'     && <AdminOrders token={token} />}
          {tab === 'quotes'     && <AdminQuotes token={token} />}
          {tab === 'customers'  && <AdminCustomers token={token} />}
          {tab === 'products'   && <AdminProducts />}
          {tab === 'tickets'    && <AdminTickets token={token} />}
          {tab === 'settings'   && <AdminSettings />}
        </div>
      </main>
    </div>
  )
}
