'use client';

import { useState, useRef } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
} from 'firebase/auth';
import { supabase } from '@/lib/supabase';

const FONT_URL =
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';

const INPUT = { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)', fontSize: 14, color: '#111', background: '#fafaf9', outline: 'none', boxSizing: 'border-box' } as React.CSSProperties;
const BTN_PRIMARY = (disabled: boolean): React.CSSProperties => ({ width: '100%', padding: '12px', background: disabled ? '#ccc' : '#FF8C35', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif" });
const BTN_OUTLINE: React.CSSProperties = { width: '100%', padding: '11px', background: '#fff', color: '#333', border: '1px solid rgba(0,0,0,0.15)', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: "'DM Sans', sans-serif" };
const DIVIDER = <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0 16px' }}><div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.1)' }} /><span style={{ fontSize: 12, color: '#999' }}>or</span><div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.1)' }} /></div>;

type Tab = 'email' | 'phone';

function cleanFirebaseError(msg: string) {
  const code = msg.match(/\(auth\/(.*?)\)/)?.[1];
  const codeMessages: Record<string, string> = {
    'email-already-in-use': 'An account with this email already exists.',
    'weak-password': 'Password is too weak. Use at least 6 characters.',
    'invalid-email': 'Invalid email address.',
    'operation-not-allowed': 'This sign-in method is not enabled. Please contact support.',
    'too-many-requests': 'Too many attempts. Please try again later.',
    'network-request-failed': 'Network error. Check your connection.',
    'popup-closed-by-user': 'Sign-in cancelled.',
    'invalid-phone-number': 'Invalid phone number.',
    'invalid-verification-code': 'Incorrect OTP. Please try again.',
    'session-expired': 'OTP expired. Please request a new one.',
  };
  if (code && codeMessages[code]) return codeMessages[code];
  return msg.replace('Firebase: ', '').replace(/ \(auth\/.*\)\.?/, '') || 'Sign up failed. Please try again.';
}

export default function SignupPage() {
  const [tab, setTab] = useState<Tab>('email');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Email fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Phone OTP fields
  const [phone, setPhone] = useState('');
  const [phoneName, setPhoneName] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  async function handleGoogleSignup() {
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await supabase.from('customers').upsert(
        { id: user.uid, name: user.displayName || '', email: user.email || '', address: [] },
        { onConflict: 'id' }
      );
      window.location.href = '/customer/dashboard';
    } catch (err: unknown) {
      setError(cleanFirebaseError(err instanceof Error ? err.message : 'Google sign up failed'));
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      await supabase.from('customers').upsert(
        { id: result.user.uid, name, email, address: [] },
        { onConflict: 'id' }
      );
      window.location.href = '/customer/dashboard';
    } catch (err: unknown) {
      setError(cleanFirebaseError(err instanceof Error ? err.message : 'Sign up failed'));
    } finally {
      setLoading(false);
    }
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const formatted = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`;
    if (formatted.replace(/\D/g, '').length < 10) { setError('Enter a valid phone number.'); return; }
    setLoading(true);
    try {
      if (!recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current = new RecaptchaVerifier(auth, recaptchaRef.current!, { size: 'invisible' });
      }
      const result = await signInWithPhoneNumber(auth, formatted, recaptchaVerifierRef.current);
      setConfirmation(result);
      setOtpSent(true);
    } catch (err: unknown) {
      recaptchaVerifierRef.current?.clear();
      recaptchaVerifierRef.current = null;
      setError(cleanFirebaseError(err instanceof Error ? err.message : 'Failed to send OTP'));
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!confirmation) return;
    setLoading(true);
    try {
      const result = await confirmation.confirm(otp);
      const user = result.user;
      if (phoneName) await updateProfile(user, { displayName: phoneName });
      await supabase.from('customers').upsert(
        { id: user.uid, name: phoneName || user.phoneNumber || '', email: '', address: [] },
        { onConflict: 'id' }
      );
      window.location.href = '/customer/dashboard';
    } catch (err: unknown) {
      setError(cleanFirebaseError(err instanceof Error ? err.message : 'Invalid OTP'));
    } finally {
      setLoading(false);
    }
  }

  const TAB_STYLE = (active: boolean): React.CSSProperties => ({
    flex: 1, padding: '9px 0', fontSize: 13, fontWeight: 600, border: 'none', borderRadius: 6,
    background: active ? '#FF8C35' : 'transparent', color: active ? '#fff' : '#888',
    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s',
  });

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

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 60px)', padding: '40px 16px' }}>
          <div style={{ width: '100%', maxWidth: 420 }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: '#FF8C35', letterSpacing: '0.04em' }}>KYZER</div>
              <div style={{ fontSize: 11, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, letterSpacing: '0.25em', color: '#666', textTransform: 'uppercase', marginTop: 2 }}>Robotics</div>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#111', marginTop: 20, marginBottom: 6, letterSpacing: '0.04em' }}>Create Account</h1>
              <p style={{ fontSize: 14, color: '#666', margin: 0 }}>Join Kyzer Robotics today.</p>
            </div>

            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(0,0,0,0.09)', padding: '32px 28px' }}>
              {/* Tab switcher */}
              <div style={{ display: 'flex', background: '#f3f3f1', borderRadius: 8, padding: 3, marginBottom: 24 }}>
                <button style={TAB_STYLE(tab === 'email')} onClick={() => { setTab('email'); setError(''); setOtpSent(false); }}>Email</button>
                <button style={TAB_STYLE(tab === 'phone')} onClick={() => { setTab('phone'); setError(''); setOtpSent(false); }}>Phone / OTP</button>
              </div>

              {error && (
                <div style={{ background: '#fff0f0', border: '1px solid #ffc5c5', borderRadius: 8, padding: '12px 14px', marginBottom: 20, fontSize: 14, color: '#c0392b' }}>
                  {error}
                </div>
              )}

              {tab === 'email' && (
                <form onSubmit={handleEmailSubmit}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#111', marginBottom: 6 }}>Full Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Rahul Sharma" style={INPUT} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#111', marginBottom: 6 }}>Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" style={INPUT} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#111', marginBottom: 6 }}>Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min. 6 characters" style={INPUT} />
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#111', marginBottom: 6 }}>Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder="Repeat password" style={INPUT} />
                  </div>
                  <button type="submit" disabled={loading} style={BTN_PRIMARY(loading)}>
                    {loading ? 'Creating account…' : 'Create Account'}
                  </button>
                </form>
              )}

              {tab === 'phone' && !otpSent && (
                <form onSubmit={handleSendOtp}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#111', marginBottom: 6 }}>Full Name</label>
                    <input type="text" value={phoneName} onChange={e => setPhoneName(e.target.value)} placeholder="Rahul Sharma" style={INPUT} />
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#111', marginBottom: 6 }}>Phone Number</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div style={{ padding: '10px 12px', background: '#f3f3f1', borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)', fontSize: 14, color: '#555', whiteSpace: 'nowrap' }}>🇮🇳 +91</div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        required
                        placeholder="9876543210"
                        style={{ ...INPUT, flex: 1 }}
                      />
                    </div>
                    <p style={{ fontSize: 12, color: '#999', marginTop: 6, marginBottom: 0 }}>We&apos;ll send a 6-digit OTP to this number.</p>
                  </div>
                  <div ref={recaptchaRef} />
                  <button type="submit" disabled={loading} style={BTN_PRIMARY(loading)}>
                    {loading ? 'Sending OTP…' : 'Send OTP'}
                  </button>
                </form>
              )}

              {tab === 'phone' && otpSent && (
                <form onSubmit={handleVerifyOtp}>
                  <p style={{ fontSize: 14, color: '#555', marginBottom: 20, marginTop: 0 }}>
                    OTP sent to <strong>+91 {phone}</strong>.{' '}
                    <button type="button" onClick={() => { setOtpSent(false); setOtp(''); setError(''); }} style={{ background: 'none', border: 'none', color: '#FF8C35', fontSize: 14, cursor: 'pointer', padding: 0 }}>Change number</button>
                  </p>
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#111', marginBottom: 6 }}>Enter OTP</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      required
                      placeholder="6-digit code"
                      style={{ ...INPUT, letterSpacing: '0.2em', textAlign: 'center', fontSize: 20 }}
                      autoFocus
                    />
                  </div>
                  <button type="submit" disabled={loading || otp.length < 6} style={BTN_PRIMARY(loading || otp.length < 6)}>
                    {loading ? 'Verifying…' : 'Verify & Create Account'}
                  </button>
                </form>
              )}

              {DIVIDER}

              <button type="button" onClick={handleGoogleSignup} style={BTN_OUTLINE}>
                <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
                Continue with Google
              </button>

              <p style={{ textAlign: 'center', fontSize: 14, color: '#666', marginTop: 16, marginBottom: 0 }}>
                Already have an account?{' '}
                <a href="/login" style={{ color: '#FF8C35', textDecoration: 'none', fontWeight: 500 }}>Sign in</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

