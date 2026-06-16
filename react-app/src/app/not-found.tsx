import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found — Kyzer Robotics',
  robots: 'noindex, follow',
};

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      background: '#faf9f6', color: '#111', fontFamily: "'DM Sans',sans-serif", padding: '24px',
    }}>
      <img src="/logo.png" alt="Kyzer Robotics" style={{ height: 56, marginBottom: 28 }} />
      <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(64px,16vw,140px)', lineHeight: 0.9, color: '#FF8C35' }}>404</div>
      <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(28px,5vw,44px)', margin: '8px 0 6px' }}>Lost in the airspace.</h1>
      <p style={{ color: '#666', fontSize: 15, maxWidth: 420, marginBottom: 28 }}>
        The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back on course.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/" style={{ background: '#FF8C35', color: '#111', fontWeight: 600, padding: '12px 22px', borderRadius: 10, textDecoration: 'none' }}>← Back home</Link>
        <Link href="/get-a-quote" style={{ border: '1px solid rgba(0,0,0,0.12)', color: '#111', fontWeight: 500, padding: '12px 22px', borderRadius: 10, textDecoration: 'none' }}>Get a quote</Link>
      </div>
    </div>
  );
}
