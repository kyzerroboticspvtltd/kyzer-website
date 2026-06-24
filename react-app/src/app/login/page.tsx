'use client';

import { useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithCustomToken, signInWithPopup } from 'firebase/auth';

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
const BTN_OUTLINE: React.CSSProperties = {
  width: '100%', padding: '11px', background: '#fff', color: '#333',
  border: '1px solid rgba(0,0,0,0.15)', borderRadius: 8, fontSize: 14, fontWeight: 500,
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  gap: 10, fontFamily: "'DM Sans', sans-serif",
};
const DIVIDER = (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0 16px' }}>
    <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.1)' }} />
    <span style={{ fontSize: 12, color: '#999' }}>or</span>
    <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.1)' }} />
  </div>
);

function cleanError(msg: string) {
  const code = msg.match(/\(auth\/(.*?)\)/)?.[1];
  const map: Record<string, string> = {
    'too-many-requests': 'Too many attempts. Please try again later.',
    'popup-closed-by-user': 'Sign-in cancelled.',
    'network-request-failed': 'Network error. Check your connection.',
  };
  if (code && map[code]) return map[code];
  return msg.replace('Firebase: ', '').replace(/ \(auth\/.*\)\.?/, '') || 'Sign in failed. Please try again.';
}

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

  function syncUser(user: { uid: string; displayName: string | null; email: string | null }) {
    const name = user.displayName || (user.email ? user.email.split('@')[0] : 'Customer');
    localStorage.setItem('kyzer_current_customer', JSON.stringify({ id: user.uid, name, email: user.email || '' }));
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
      if (!data.ok) throw new Error(data.error || 'Failed to send OTP');
      setSession(data.session);
      setOtpSent(true);
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
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
      if (!data.ok) throw new Error(data.error || 'Invalid OTP');
      const cred = await signInWithCustomToken(auth, data.token);
      syncUser(cred.user);
      window.location.href = redirectTo;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Verification failed');
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError('');
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      syncUser(cred.user);
      window.location.href = redirectTo;
    } catch (err: unknown) {
      setError(cleanError(err instanceof Error ? err.message : 'Google sign in failed'));
    }
  }

  return (
    <>
      <link href={FONT_URL} rel="stylesheet" />
      <div style={{ minHeight: '100vh', background: '#f8f8f6', fontFamily: "'DM Sans', sans-serif" }}>
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 90, borderBottom: '0.5px solid rgba(0,0,0,0.09)', background: '#f8f8f6' }}>
          <a href="/" className="logo-anim" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#FF8C35', textDecoration: 'none', letterSpacing: '0.03em' }}>
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
                {otpSent ? `We sent a code to ${email}` : 'Enter your email to receive a login code.'}
              </p>
            </div>

            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(0,0,0,0.09)', padding: '32px 28px' }}>
              {error && (
                <div style={{ background: '#fff0f0', border: '1px solid #ffc5c5', borderRadius: 8, padding: '12px 14px', marginBottom: 20, fontSize: 14, color: '#c0392b' }}>
                  {error}
                </div>
              )}

              {!otpSent ? (
                /* Step 1: Email input */
                <>
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

                  {DIVIDER}

                  <button type="button" onClick={handleGoogleLogin} style={BTN_OUTLINE}>
                    <svg width="18" height="18" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                    Continue with Google
                  </button>

                  <p style={{ textAlign: 'center', fontSize: 14, color: '#666', marginTop: 16, marginBottom: 0 }}>
                    Don&apos;t have an account?{' '}
                    <a href="/signup" style={{ color: '#FF8C35', textDecoration: 'none', fontWeight: 500 }}>Sign up</a>
                  </p>
                </>
              ) : (
                /* Step 2: OTP input */
                <form onSubmit={handleVerifyOtp}>
                  <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <p style={{ fontSize: 14, color: '#555', margin: '0 0 4px' }}>
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
                        autoFocus={i === 0}
                        onChange={e => handleOtpChange(e.target.value, i)}
                        onKeyDown={e => handleOtpKeyDown(e, i)}
                        onPaste={i === 0 ? handleOtpPaste : undefined}
                        style={{
                          width: 44, height: 52, textAlign: 'center', fontSize: 22, fontWeight: 700,
                          borderRadius: 10, outline: 'none', fontFamily: "'JetBrains Mono', monospace",
                          border: `2px solid ${digit ? '#FF8C35' : 'rgba(0,0,0,0.12)'}`,
                          background: digit ? '#fff7f2' : '#fafaf9',
                          color: '#111',
                          transition: 'border-color 0.15s, background 0.15s',
                        }}
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.join('').length < 6}
                    style={BTN_PRIMARY(loading || otp.join('').length < 6)}
                  >
                    {loading ? 'Verifying…' : 'Verify & Sign In'}
                  </button>

                  <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={loading}
                      style={{ background: 'none', border: 'none', color: '#FF8C35', fontSize: 13, cursor: 'pointer', padding: 0 }}
                    >
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
