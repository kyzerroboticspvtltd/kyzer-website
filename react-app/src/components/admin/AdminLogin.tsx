'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock } from 'lucide-react'

export function AdminLogin({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Incorrect password.'); return }
      onLogin(data.token)
    } catch {
      setError('Network error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f8f6] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#111] mb-4">
            <Lock className="w-5 h-5 text-[#FF8C35]" />
          </div>
          <h1 className="font-['Bebas_Neue',sans-serif] text-[32px] text-[#111] tracking-wide">Admin Panel</h1>
          <p className="text-[13px] text-gray-400 mt-1">Kyzer Robotics — restricted access</p>
        </div>

        <div className="bg-white rounded-2xl border border-black/[0.08] p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-gray-600 mb-1.5">Admin Password</label>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                autoFocus
                required
                className="h-10 bg-[#f8f8f6] border-black/10 text-[14px] rounded-xl focus-visible:ring-[#FF8C35]/30 focus-visible:border-[#FF8C35]"
              />
            </div>
            {error && (
              <p className="text-[13px] text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-[#111] hover:bg-[#FF8C35] hover:text-[#111] text-white rounded-xl text-[14px] font-semibold transition-colors"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>
        </div>
        <p className="text-center text-[11px] text-gray-300 mt-4">kyzerrobotics.com/admin</p>
      </div>
    </div>
  )
}
