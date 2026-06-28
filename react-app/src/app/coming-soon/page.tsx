'use client';

import { useState, useEffect } from 'react';

const FONT_URL =
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';

// Launch: 2026-07-01 at 13:00 IST (UTC+5:30)
const LAUNCH = new Date('2026-07-01T13:00:00+05:30').getTime();

function getTimeLeft() {
  const diff = LAUNCH - Date.now();
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, done: true };
  const totalSecs = Math.floor(diff / 1000);
  const d = Math.floor(totalSecs / 86400);
  const h = Math.floor((totalSecs % 86400) / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  return { d, h, m, s, done: false };
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export default function ComingSoonPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0, done: false });

  const label =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('for') || ''
      : '';

  useEffect(() => {
    setTime(getTimeLeft());
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  async function handleNotify(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/cs-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), product: label || 'Coming Soon' }),
      });
      const d = await res.json();
      setStatus(d.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <>
      <link href={FONT_URL} rel="stylesheet" />
      <div style={{
        minHeight: '100vh',
        background: '#f8f8f6',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'DM Sans', sans-serif",
        padding: '32px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle top border accent */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: 3, background: '#FF8C35',
        }} />

        {/* Faint background texture */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 60% 20%, rgba(255,140,53,0.06) 0%, transparent 55%)',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div style={{ marginBottom: 56, display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Kyzer Robotics"
            style={{
              width: 68,
              height: 68,
              objectFit: 'contain',
              filter: 'brightness(0) saturate(1) invert(55%) sepia(80%) saturate(500%) hue-rotate(346deg) brightness(100%)',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 30, color: '#111', letterSpacing: '0.08em',
            }}>
              KYZER
            </span>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11, fontWeight: 500,
              letterSpacing: '0.26em', color: '#999',
              textTransform: 'uppercase',
            }}>
              Robotics
            </span>
          </div>
        </div>

        {/* Label chip */}
        {label && (
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            color: '#FF8C35', background: 'rgba(255,140,53,0.08)',
            border: '1px solid rgba(255,140,53,0.2)',
            borderRadius: 20, padding: '4px 14px', marginBottom: 20,
            textTransform: 'uppercase', letterSpacing: '0.1em',
          }}>
            {label}
          </div>
        )}

        {/* Heading */}
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(52px, 10vw, 100px)',
          color: '#111',
          letterSpacing: '0.03em',
          textAlign: 'center',
          lineHeight: 1,
          marginBottom: 14,
        }}>
          COMING SOON
        </h1>

        <p style={{
          color: '#777', fontSize: 15, textAlign: 'center',
          maxWidth: 380, lineHeight: 1.75, marginBottom: 44,
        }}>
          We&apos;re working on something exciting. Launching <strong style={{ color: '#111', fontWeight: 600 }}>July 1st at 1 PM.</strong>
        </p>

        {/* Countdown */}
        {!time.done ? (
          <div style={{ display: 'flex', gap: 10, marginBottom: 48, alignItems: 'flex-end', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { val: pad(time.d), label: 'Days' },
              { val: pad(time.h), label: 'Hours' },
              { val: pad(time.m), label: 'Mins' },
              { val: pad(time.s), label: 'Secs' },
            ].map((unit, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 'clamp(44px, 7vw, 68px)',
                    color: '#111',
                    lineHeight: 1,
                    background: '#fff',
                    border: '1.5px solid rgba(0,0,0,0.08)',
                    borderRadius: 12,
                    padding: '10px 18px',
                    minWidth: 82,
                    letterSpacing: '0.04em',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  }}>
                    {unit.val}
                  </div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10, color: '#aaa',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    marginTop: 8,
                  }}>
                    {unit.label}
                  </div>
                </div>
                {i < 3 && (
                  <div style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 44, color: '#ddd',
                    lineHeight: 1, paddingBottom: 26,
                  }}>
                    :
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ marginBottom: 48, color: '#FF8C35', fontFamily: "'Bebas Neue', sans-serif", fontSize: 32 }}>
            WE ARE LIVE!
          </div>
        )}

        {/* Notify form */}
        {status === 'done' ? (
          <div style={{
            background: 'rgba(46,204,113,0.06)', border: '1.5px solid rgba(46,204,113,0.2)',
            borderRadius: 12, padding: '18px 32px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 20, marginBottom: 6, color: '#2ecc71' }}>✓</div>
            <div style={{ color: '#2ecc71', fontWeight: 600, fontSize: 15 }}>You&apos;re on the list!</div>
            <div style={{ color: '#999', fontSize: 13, marginTop: 4 }}>We&apos;ll notify you on launch day.</div>
          </div>
        ) : (
          <form onSubmit={handleNotify} style={{ width: '100%', maxWidth: 440 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  flex: 1, padding: '13px 16px',
                  background: '#fff',
                  border: '1.5px solid rgba(0,0,0,0.1)',
                  borderRadius: 10, color: '#111', fontSize: 14,
                  outline: 'none', fontFamily: "'DM Sans', sans-serif",
                }}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  padding: '13px 24px',
                  background: status === 'loading' ? '#ccc' : '#FF8C35',
                  color: '#111', border: 'none', borderRadius: 10,
                  fontSize: 14, fontWeight: 700,
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                  whiteSpace: 'nowrap',
                  transition: 'background 0.2s',
                }}
              >
                {status === 'loading' ? '...' : 'Notify Me'}
              </button>
            </div>
            {status === 'error' && (
              <p style={{ color: '#e74c3c', fontSize: 13, marginTop: 10, textAlign: 'center' }}>
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        )}

        {/* Bottom strip */}
        <div style={{
          position: 'absolute', bottom: 24,
          fontSize: 11, color: '#ccc',
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '0.08em',
        }}>
          KYZER ROBOTICS PVT. LTD. · PUNE, INDIA
        </div>
      </div>
    </>
  );
}
