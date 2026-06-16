'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      background: '#faf9f6', color: '#111', fontFamily: "'DM Sans',sans-serif", padding: '24px',
    }}>
      <img src="/logo.png" alt="Kyzer Robotics" style={{ height: 56, marginBottom: 28 }} />
      <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(30px,6vw,52px)', margin: '0 0 6px' }}>Something went wrong.</h1>
      <p style={{ color: '#666', fontSize: 15, maxWidth: 440, marginBottom: 28 }}>
        An unexpected error occurred. Please try again — if it keeps happening, contact us and we&apos;ll sort it out.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => reset()} style={{ background: '#FF8C35', color: '#111', fontWeight: 600, padding: '12px 22px', borderRadius: 10, border: 'none', cursor: 'pointer' }}>Try again</button>
        <a href="/" style={{ border: '1px solid rgba(0,0,0,0.12)', color: '#111', fontWeight: 500, padding: '12px 22px', borderRadius: 10, textDecoration: 'none' }}>Back home</a>
        <a href="https://wa.me/919049695264" target="_blank" rel="noopener" style={{ border: '1px solid rgba(0,0,0,0.12)', color: '#111', fontWeight: 500, padding: '12px 22px', borderRadius: 10, textDecoration: 'none' }}>WhatsApp us</a>
      </div>
    </div>
  );
}
