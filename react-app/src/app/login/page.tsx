'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const FONT_URL =
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';

function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectTo = searchParams.get('redirect') || '/customer/dashboard';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) {
      setError(authError.message);
    } else {
      window.location.href = redirectTo;
    }
  }

  async function handleGoogleLogin() {
    setError('');
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + redirectTo },
    });
    if (authError) setError(authError.message);
  }

  return (
    <>
      <link href={FONT_URL} rel="stylesheet" />
      <div style={{ minHeight: '100vh', background: '#f8f8f6', fontFamily: "'DM Sans', sans-serif" }}>
        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 60, borderBottom: '0.5px solid rgba(0,0,0,0.09)', background: '#f8f8f6' }}>
          <a href="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#FF8C35', textDecoration: 'none', letterSpacing: '0.03em' }}>
            KYZER <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.2em', verticalAlign: 'middle', color: '#111' }}>ROBOTICS</span>
          </a>
          <a href="/" style={{ fontSize: 13, color: '#666', textDecoration: 'none' }}>← Back to home</a>
        </nav>

        {/* Main */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 60px)', padding: '40px 16px' }}>
          <div style={{ width: '100%', maxWidth: 420 }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: '#FF8C35', letterSpacing: '0.04em' }}>KYZER</div>
              <div style={{ fontSize: 11, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, letterSpacing: '0.25em', color: '#666', textTransform: 'uppercase', marginTop: 2 }}>Robotics</div>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#111', marginTop: 20, marginBottom: 6, letterSpacing: '0.04em' }}>Sign In</h1>
              <p style={{ fontSize: 14, color: '#666', margin: 0 }}>Welcome back! Sign in to your account.</p>
            </div>

            {/* Card */}
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(0,0,0,0.09)', padding: '32px 28px' }}>
              {error && (
                <div style={{ background: '#fff0f0', border: '1px solid #ffc5c5', borderRadius: 8, padding: '12px 14px', marginBottom: 20, fontSize: 14, color: '#c0392b' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#111', marginBottom: 6 }}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)', fontSize: 14, color: '#111', background: '#fafaf9', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 500, color: '#111' }}>Password</label>
                    <a href="/forgot-password" style={{ fontSize: 12, color: '#FF8C35', textDecoration: 'none' }}>Forgot password?</a>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)', fontSize: 14, color: '#111', background: '#fafaf9', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{ width: '100%', padding: '12px', background: loading ? '#ccc' : '#FF8C35', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                >
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0 16px' }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.1)' }} />
                <span style={{ fontSize: 12, color: '#999' }}>or</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.1)' }} />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                style={{ width: '100%', padding: '11px', background: '#fff', color: '#333', border: '1px solid rgba(0,0,0,0.15)', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: "'DM Sans', sans-serif" }}
              >
                <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
                Continue with Google
              </button>

              <p style={{ textAlign: 'center', fontSize: 14, color: '#666', marginTop: 16, marginBottom: 0 }}>
                Don&apos;t have an account?{' '}
                <a href="/signup" style={{ color: '#FF8C35', textDecoration: 'none', fontWeight: 500 }}>Sign up</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f8f8f6' }} />}>
      <LoginForm />
    </Suspense>
  );
}
