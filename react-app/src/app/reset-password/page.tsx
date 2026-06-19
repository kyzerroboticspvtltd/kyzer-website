'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const FONT_URL =
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase puts the recovery token in the URL hash — exchange it for a session
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setDone(true);
    setTimeout(() => { window.location.href = '/customer/dashboard'; }, 2000);
  }

  return (
    <>
      <link href={FONT_URL} rel="stylesheet" />
      <div style={{ minHeight: '100vh', background: '#f8f8f6', fontFamily: "'DM Sans', sans-serif" }}>
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 60, borderBottom: '0.5px solid rgba(0,0,0,0.09)', background: '#f8f8f6' }}>
          <a href="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#FF8C35', textDecoration: 'none', letterSpacing: '0.03em' }}>
            KYZER <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.2em', verticalAlign: 'middle', color: '#111' }}>ROBOTICS</span>
          </a>
        </nav>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 60px)', padding: '40px 16px' }}>
          <div style={{ width: '100%', maxWidth: 420 }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: '#FF8C35', letterSpacing: '0.04em' }}>KYZER</div>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.25em', color: '#666', textTransform: 'uppercase', marginTop: 2 }}>Robotics</div>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#111', marginTop: 20, marginBottom: 6, letterSpacing: '0.04em' }}>New Password</h1>
            </div>

            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(0,0,0,0.09)', padding: '32px 28px' }}>
              {done ? (
                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                  <div style={{ fontSize: 44, marginBottom: 12 }}>✅</div>
                  <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#111', marginBottom: 8 }}>Password updated!</h2>
                  <p style={{ fontSize: 14, color: '#666' }}>Redirecting you to your dashboard…</p>
                </div>
              ) : !ready ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <p style={{ fontSize: 14, color: '#666' }}>Verifying reset link…</p>
                </div>
              ) : (
                <>
                  {error && (
                    <div style={{ background: '#fff0f0', border: '1px solid #ffc5c5', borderRadius: 8, padding: '12px 14px', marginBottom: 20, fontSize: 14, color: '#c0392b' }}>
                      {error}
                    </div>
                  )}
                  <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#111', marginBottom: 6 }}>New Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        placeholder="Min. 6 characters"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)', fontSize: 14, color: '#111', background: '#fafaf9', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div style={{ marginBottom: 24 }}>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#111', marginBottom: 6 }}>Confirm Password</label>
                      <input
                        type="password"
                        value={confirm}
                        onChange={e => setConfirm(e.target.value)}
                        required
                        placeholder="Repeat password"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)', fontSize: 14, color: '#111', background: '#fafaf9', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{ width: '100%', padding: '12px', background: loading ? '#ccc' : '#FF8C35', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {loading ? 'Updating…' : 'Update Password'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
