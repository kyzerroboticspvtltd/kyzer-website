'use client'

import { ExternalLink } from 'lucide-react'

const LINKS = [
  { label: 'Supabase Dashboard', url: 'https://supabase.com/dashboard', desc: 'Database, Auth, Storage' },
  { label: 'Vercel Dashboard', url: 'https://vercel.com/kyzer1/kyzer-website', desc: 'Deployments, env vars, logs' },
  { label: 'Razorpay Dashboard', url: 'https://dashboard.razorpay.com', desc: 'Payments, refunds, settlements' },
  { label: 'Upstash Console', url: 'https://console.upstash.com', desc: 'Redis rate limiting' },
  { label: 'Firebase Console', url: 'https://console.firebase.google.com', desc: 'Auth users, phone OTP' },
  { label: 'Resend Dashboard', url: 'https://resend.com', desc: 'Email logs, API keys' },
]

const ROUTES = [
  { method: 'POST', path: '/api/admin-login', desc: 'Admin password auth' },
  { method: 'GET',  path: '/api/admin-stats', desc: 'Dashboard KPIs' },
  { method: 'GET',  path: '/api/admin-orders', desc: 'Shop orders list' },
  { method: 'GET',  path: '/api/admin-quotes', desc: 'Quote inquiries' },
  { method: 'GET',  path: '/api/admin-customers', desc: 'Customer list' },
  { method: 'GET',  path: '/api/admin-tickets', desc: 'Support tickets' },
  { method: 'POST', path: '/api/order-update', desc: 'Update order status' },
  { method: 'POST', path: '/api/publish', desc: 'Publish site content' },
  { method: 'GET',  path: '/api/health-check', desc: 'Security probe' },
]

export function AdminSettings() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="font-['Bebas_Neue',sans-serif] text-[28px] text-[#111] tracking-wide">Settings</h2>
        <p className="text-[13px] text-gray-400">Quick access to external dashboards and API reference.</p>
      </div>

      {/* External links */}
      <div className="bg-white rounded-2xl border border-black/[0.07] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-black/[0.06]">
          <h3 className="text-[13px] font-semibold text-[#111]">External Dashboards</h3>
        </div>
        <div className="divide-y divide-black/[0.05]">
          {LINKS.map(l => (
            <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
              className="px-5 py-3.5 flex items-center justify-between hover:bg-[#fafaf8] transition-colors group">
              <div>
                <p className="text-[13px] font-medium text-[#111] group-hover:text-[#FF8C35] transition-colors">{l.label}</p>
                <p className="text-[11px] text-gray-400">{l.desc}</p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#FF8C35] transition-colors" />
            </a>
          ))}
        </div>
      </div>

      {/* API routes */}
      <div className="bg-white rounded-2xl border border-black/[0.07] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-black/[0.06]">
          <h3 className="text-[13px] font-semibold text-[#111]">API Routes</h3>
        </div>
        <div className="divide-y divide-black/[0.05]">
          {ROUTES.map(r => (
            <div key={r.path} className="px-5 py-3 flex items-center gap-4">
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded shrink-0 ${r.method === 'GET' ? 'bg-blue-50 text-blue-600' : 'bg-[#FF8C35]/15 text-[#FF8C35]'}`}>
                {r.method}
              </span>
              <code className="text-[12px] text-[#111] font-mono flex-1">{r.path}</code>
              <p className="text-[12px] text-gray-400">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
