'use client'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    router.push('/dashboard')
  }

  const input = {
    width: '100%',
    background: 'var(--cc-surface)',
    border: '0.5px solid var(--cc-border-strong)',
    borderRadius: 'var(--cc-radius-sm)',
    color: 'var(--cc-white)',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    padding: '12px 14px',
    outline: 'none',
    marginTop: '6px',
  }

  return (
    <div style={{ background: 'var(--cc-black)', minHeight: '100vh', color: 'var(--cc-white)' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '0.5px solid var(--cc-border)', background: 'var(--cc-surface)' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: 'var(--cc-gold)', letterSpacing: '-0.02em' }}>CloutCount</Link>
        <Link href="/signup" style={{ fontSize: '12px', color: 'var(--cc-muted)' }}>No account? <span style={{ color: 'var(--cc-gold)' }}>Sign up free</span></Link>
      </nav>

      {/* FORM */}
      <div style={{ padding: '40px 20px', maxWidth: '400px', margin: '0 auto' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cc-gold)', marginBottom: '6px' }}>Welcome back</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>Log back in.</h1>
        <p style={{ fontSize: '13px', color: 'var(--cc-muted)', lineHeight: 1.6, marginBottom: '28px' }}>Pick up right where you left off and check your latest rank.</p>

        {error && (
          <div style={{ background: 'var(--cc-red-dim)', border: '0.5px solid rgba(255,82,82,0.3)', borderRadius: 'var(--cc-radius-sm)', padding: '10px 14px', fontSize: '12px', color: 'var(--cc-red)', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--cc-muted)' }}>Email address</label>
            <input style={input} type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div style={{ marginBottom: '8px' }}>
            <label style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--cc-muted)' }}>Password</label>
            <input style={input} type="password" placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div style={{ marginBottom: '24px', textAlign: 'right' }}>
            <Link href="/forgot-password" style={{ fontSize: '12px', color: 'var(--cc-gold)' }}>Forgot password?</Link>
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', background: loading ? 'rgba(245,200,66,0.5)' : 'var(--cc-gold)', color: 'var(--cc-black)', border: 'none', borderRadius: 'var(--cc-radius-pill)', fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 800, padding: '14px', letterSpacing: '0.04em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: 'var(--cc-muted)' }}>
            No account yet? <Link href="/signup" style={{ color: 'var(--cc-gold)', fontWeight: 500 }}>Sign up free</Link>
          </div>
        </form>
      </div>
    </div>
  )
}