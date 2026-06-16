export default function Loading() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#faf9f6', flexDirection: 'column', gap: 18,
    }}>
      <img src="/logo.png" alt="Kyzer Robotics" style={{ height: 48, opacity: 0.9 }} />
      <div style={{
        width: 34, height: 34, border: '3px solid rgba(255,140,53,0.25)',
        borderTopColor: '#FF8C35', borderRadius: '50%', animation: 'kzspin 0.7s linear infinite',
      }} />
      <style>{`@keyframes kzspin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
