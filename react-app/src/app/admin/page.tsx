'use client'

import { useState, useEffect } from 'react'
import { AdminLogin } from '@/components/admin/AdminLogin'
import { AdminShell } from '@/components/admin/AdminShell'

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem('kyzer_admin_token')
    if (stored) setToken(stored)
    setChecking(false)
  }, [])

  function handleLogin(t: string) {
    sessionStorage.setItem('kyzer_admin_token', t)
    setToken(t)
  }

  function handleLogout() {
    sessionStorage.removeItem('kyzer_admin_token')
    setToken(null)
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-[#f8f8f6] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FF8C35] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!token) return <AdminLogin onLogin={handleLogin} />
  return <AdminShell token={token} onLogout={handleLogout} />
}
