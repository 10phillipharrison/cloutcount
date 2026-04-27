import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ background: 'var(--cc-black)', minHeight: '100vh', color: 'var(--cc-white)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '64px', fontWeight: 800, color: 'var(--cc-gold)', lineHeight: 1, marginBottom: '12px', letterSpacing: '-0.03em' }}>404</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, marginBottom: '8px', textAlign: 'center' }}>Profile not found</h1>
      <p style={{ fontSize: '14px', color: 'var(--cc-muted)', marginBottom: '24px', textAlign: 'center', maxWidth: '320px', lineHeight: 1.5 }}>
        That username doesn't exist on CloutCount yet. Maybe they haven't claimed it?
      </p>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Link href="/" style={{ background: 'transparent', color: 'var(--cc-white)', border: '0.5px solid var(--cc-border-strong)', borderRadius: 'var(--cc-radius-pill)', fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700, padding: '12px 20px', letterSpacing: '0.04em', textTransform: 'uppercase', textDecoration: 'none' }}>Home</Link>
        <Link href="/signup" style={{ background: 'var(--cc-gold)', color: 'var(--cc-black)', border: 'none', borderRadius: 'var(--cc-radius-pill)', fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 800, padding: '12px 24px', letterSpacing: '0.04em', textTransform: 'uppercase', textDecoration: 'none' }}>Claim Yours</Link>
      </div>
    </div>
  )
}