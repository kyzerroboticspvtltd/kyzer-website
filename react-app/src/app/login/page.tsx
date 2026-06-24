'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const FONT_URL =
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';

const INPUT: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  border: '1px solid rgba(0,0,0,0.12)', fontSize: 14, color: '#111',
  background: '#fafaf9', outline: 'none', boxSizing: 'border-box',
};
const BTN_PRIMARY = (disabled: boolean): React.CSSProperties => ({
  width: '100%', padding: '12px', background: disabled ? '#ccc' : '#FF8C35',
  color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600,
  cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif",
});

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/customer/dashboard';

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [session, setSession] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (otpSent) setTimeout(() => otpRefs.current[0]?.focus(), 100);
  }, [otpSent]);

  function handleOtpChange(val: string, idx: number) {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[idx] = digit;
    setOtp(next);
    if (digit && idx < 5) otpRefs.current[idx + 1]?.focus();
  }

  function handleOtpKeyDown(e: React.KeyboardEvent, idx: number) {
    if (e.key === 'Backspace') {
      if (otp[idx]) {
        const next = [...otp]; next[idx] = ''; setOtp(next);
      } else if (idx > 0) {
        otpRefs.current[idx - 1]?.focus();
      }
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    const next = ['', '', '', '', '', ''];
    digits.forEach((d, i) => { next[i] = d; });
    setOtp(next);
    otpRefs.current[Math.min(digits.length, 5)]?.focus();
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/send-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Failed to send code');
      setSession(data.session);
      setOtpSent(true);
      setOtp(['', '', '', '', '', '']);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send code');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e?: React.FormEvent) {
    e?.preventDefault();
    const code = otp.join('');
    if (code.length < 6) return;
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/verify-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp: code, session }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Invalid code');
      const cred = await signInWithCustomToken(auth, data.token);
      const name = cred.user.email?.split('@')[0] || 'Customer';
      localStorage.setItem('kyzer_current_customer', JSON.stringify({
        id: cred.user.uid, name, email: cred.user.email || '',
      }));
      window.location.href = redirectTo;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Verification failed');
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <link href={FONT_URL} rel="stylesheet" />
      <div style={{ minHeight: '100vh', background: '#f8f8f6', fontFamily: "'DM Sans', sans-serif" }}>
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 90, borderBottom: '0.5px solid rgba(0,0,0,0.09)', background: '#f8f8f6' }}>
          <a href="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#FF8C35', textDecoration: 'none', letterSpacing: '0.03em' }}>
            KYZER <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.2em', verticalAlign: 'middle', color: '#111' }}>ROBOTICS</span>
          </a>
          <a href="/" style={{ fontSize: 13, color: '#666', textDecoration: 'none' }}>← Back to home</a>
        </nav>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 90px)', padding: '40px 16px' }}>
          <div style={{ width: '100%', maxWidth: 420 }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: '#FF8C35', letterSpacing: '0.04em' }}>KYZER</div>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.25em', color: '#666', textTransform: 'uppercase', marginTop: 2 }}>Robotics</div>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#111', marginTop: 20, marginBottom: 6, letterSpacing: '0.04em' }}>Sign In</h1>
              <p style={{ fontSize: 14, color: '#666', margin: 0 }}>
                {otpSent ? `Code sent to ${email}` : 'Enter your email to receive a login code.'}
              </p>
            </div>

            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(0,0,0,0.09)', padding: '32px 28px' }}>
              {error && (
                <div style={{ background: '#fff0f0', border: '1px solid #ffc5c5', borderRadius: 8, padding: '12px 14px', marginBottom: 20, fontSize: 14, color: '#c0392b' }}>
                  {error}
                </div>
              )}

              {!otpSent ? (
                <form onSubmit={handleSendOtp}>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#111', marginBottom: 6 }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      autoComplete="email"
                      style={INPUT}
                    />
                  </div>
                  <button type="submit" disabled={loading || !email.trim()} style={BTN_PRIMARY(loading || !email.trim())}>
                    {loading ? 'Sending code…' : 'Send Login Code'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp}>
                  <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <p style={{ fontSize: 14, color: '#555', margin: '0 0 8px' }}>
                      Code sent to <strong>{email}</strong>
                    </p>
                    <button
                      type="button"
                      onClick={() => { setOtpSent(false); setOtp(['','','','','','']); setError(''); }}
                      style={{ background: 'none', border: 'none', color: '#FF8C35', fontSize: 13, cursor: 'pointer', padding: 0 }}
                    >
                      Change email
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={el => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(e.target.value, i)}
                        onKeyDown={e => handleOtpKeyDown(e, i)}
                        onPaste={i === 0 ? handleOtpPaste : undefined}
                        style={{
                          width: 44, height: 52, textAlign: 'center', fontSize: 22, fontWeight: 700,
                          borderRadius: 10, outline: 'none', fontFamily: "'JetBrains Mono', monospace",
                          border: `2px solid ${digit ? '#FF8C35' : 'rgba(0,0,0,0.12)'}`,
                          background: digit ? '#fff7f2' : '#fafaf9',
                          color: '#111', transition: 'border-color 0.15s, background 0.15s',
                        }}
                      />
                    ))}
                  </div>

                  <button type="submit" disabled={loading || otp.join('').length < 6} style={BTN_PRIMARY(loading || otp.join('').length < 6)}>
                    {loading ? 'Verifying…' : 'Verify & Sign In'}
                  </button>

                  <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <button type="button" onClick={handleSendOtp} disabled={loading}
                      style={{ background: 'none', border: 'none', color: '#FF8C35', fontSize: 13, cursor: 'pointer', padding: 0 }}>
                      Resend code
                    </button>
                  </div>
                </form>
              )}
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
