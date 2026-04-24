'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  async function handleSignUp(e) {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/setup')
  }

  const input = {
    width: '100%', background: 'var(--cc-surface)', border: '0.5px solid var(--cc-border-strong)',
    borderRadius: 'var(--cc-radius-sm)', color: 'var(--cc-white)', fontFamily: 'var(--font-body)',
    fontSize: '14px', padding: '12px 14px', outline: 'none', marginTop: '6px',
  }

  if (submitted) return (
    <div style={{ background: 'var(--cc-black)', minHeight: '100vh', color: 'var(--cc-white)' }}>
      <nav style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', borderBottom: '0.5px solid var(--cc-border)', background: 'var(--cc-surface)' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: 'var(--cc-gold)', letterSpacing: '-0.02em' }}>CloutCount</Link>
      </nav>
      <div style={{ padding: '60px 20px', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--cc-gold-dim)', border: '1.5px solid var(--cc-gold-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '28px' }}>📧</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginBottom: '10px' }}>Check your email.</h1>
        <p style={{ fontSize: '13px', color: 'var(--cc-muted)', lineHeight: 1.7, marginBottom: '24px' }}>
          We sent a confirmation link to <span style={{ color: 'var(--cc-gold)', fontWeight: 500 }}>{email}</span>.<br /><br />
          Click the link in that email to confirm your account and complete your profile setup.
        </p>
        <div style={{ background: 'var(--cc-card)', border: '0.5px solid var(--cc-border)', borderRadius: 'var(--cc-radius)', padding: '16px', textAlign: 'left', marginBottom: '24px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--cc-gold)', marginBottom: '10px' }}>What happens next</div>
          {['Check your inbox for an email from CloutCount', 'Click the confirmation link in the email', 'You\'ll be taken to set up your profile', 'Then your rank gets calculated'].map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--cc-gold-dim)', border: '0.5px solid var(--cc-gold-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 800, color: 'var(--cc-gold)', flexShrink: 0 }}>{i + 1}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, paddingTop: '2px' }}>{step}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '11px', color: 'var(--cc-muted)', lineHeight: 1.6 }}>
          Can&apos;t find the email? Check your spam folder.<br />
          <button onClick={() => setSubmitted(false)} style={{ background: 'none', border: 'none', color: 'var(--cc-gold)', fontSize: '11px', cursor: 'pointer', padding: 0, marginTop: '4px' }}>Try a different email address</button>
        </p>
      </div>
    </div>
  )

  return (
    <div style={{ background: 'var(--cc-black)', minHeight: '100vh', color: 'var(--cc-white)' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '0.5px solid var(--cc-border)', background: 'var(--cc-surface)' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: 'var(--cc-gold)', letterSpacing: '-0.02em' }}>CloutCount</Link>
        <Link href="/login" style={{ fontSize: '12px', color: 'var(--cc-muted)' }}>Already have an account? <span style={{ color: 'var(--cc-gold)' }}>Log in</span></Link>
      </nav>
      <div style={{ padding: '40px 20px', maxWidth: '400px', margin: '0 auto' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cc-gold)', marginBottom: '6px' }}>Step 1 of 4</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>Claim your rank.</h1>
        <p style={{ fontSize: '13px', color: 'var(--cc-muted)', lineHeight: 1.6, marginBottom: '28px' }}>Create your free account and find out where you stand worldwide.</p>
        {error && <div style={{ background: 'var(--cc-red-dim)', border: '0.5px solid rgba(255,82,82,0.3)', borderRadius: 'var(--cc-radius-sm)', padding: '10px 14px', fontSize: '12px', color: 'var(--cc-red)', marginBottom: '16px' }}>{error}</div>}
        <form onSubmit={handleSignUp}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--cc-muted)' }}>Email address</label>
            <input style={input} type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--cc-muted)' }}>Password</label>
            <input style={input} type="password" placeholder="Min. 8 characters" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--cc-muted)' }}>Confirm password</label>
            <input style={input} type="password" placeholder="Repeat your password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', background: loading ? 'rgba(245,200,66,0.5)' : 'var(--cc-gold)', color: 'var(--cc-black)', border: 'none', borderRadius: 'var(--cc-radius-pill)', fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 800, padding: '14px', letterSpacing: '0.04em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
          <p style={{ fontSize: '11px', color: 'var(--cc-muted)', textAlign: 'center', lineHeight: 1.6, marginTop: '14px' }}>
            By signing up you agree to our <Link href="/terms" style={{ color: 'var(--cc-gold)' }}>Terms of Service</Link> and <Link href="/privacy" style={{ color: 'var(--cc-gold)' }}>Privacy Policy</Link>.
          </p>
        </form>
      </div>
    </div>
  )
}