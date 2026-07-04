'use client';

export default function LoadingScreen({ text = 'Loading' }: { text?: string }) {
  return (
    <div
      onClick={e => e.stopPropagation()}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#f8f8f6',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 18,
        fontFamily: "'DM Sans', system-ui, sans-serif",
        cursor: 'default',
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: 8, textAlign: 'center' }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#FF8C35', letterSpacing: '0.06em' }}>KYZER</span>
        <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.2em', color: '#888', verticalAlign: 'middle', marginLeft: 5 }}>ROBOTICS</span>
      </div>

      {/* Track */}
      <div style={{
        position: 'relative',
        width: 200, height: 34,
        background: 'linear-gradient(135deg, #e8e5df, #dedad2)',
        borderRadius: 17,
        overflow: 'hidden',
        boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.12), 0 1px 3px rgba(255,255,255,0.9)',
      }}>
        <div style={{
          position: 'absolute',
          top: 3, left: 3,
          height: 'calc(100% - 6px)',
          borderRadius: 14,
          background: 'linear-gradient(90deg, #FF8C35, #ff6b00, #FF8C35, #ffb347)',
          backgroundSize: '200% 100%',
          boxShadow: '0 0 14px rgba(255,140,53,0.5), inset 0 1px 2px rgba(255,255,255,0.3)',
          animation: 'kzFill 2.4s ease-in-out infinite, kzShimmer 1.8s linear infinite',
        }} />
      </div>

      {/* Text */}
      <div style={{
        fontSize: 14, fontWeight: 600,
        color: '#555', letterSpacing: '0.08em',
        animation: 'kzPulse 1.2s ease-in-out infinite',
        display: 'flex', alignItems: 'center', gap: 1,
      }}>
        {text}
        <span style={{ animation: 'kzBlink 1.5s infinite 0s', opacity: 1 }}>.</span>
        <span style={{ animation: 'kzBlink 1.5s infinite 0.3s', opacity: 1 }}>.</span>
        <span style={{ animation: 'kzBlink 1.5s infinite 0.6s', opacity: 1 }}>.</span>
      </div>

      <style>{`
        @keyframes kzFill {
          0%   { width: 4px; }
          50%  { width: calc(100% - 6px); }
          100% { width: 4px; }
        }
        @keyframes kzShimmer {
          0%   { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
        @keyframes kzPulse {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }
        @keyframes kzBlink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
