'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

const platformColors = {
  Instagram: '#E1306C', TikTok: '#69C9D0', YouTube: '#FF0000',
  X: '#FFFFFF', Twitch: '#9146FF', Facebook: '#1877F2',
  LinkedIn: '#0A66C2', OnlyFans: '#00AFF0', Patreon: '#FF424D',
  Substack: '#FF6719', Spotify: '#1DB954', 'Apple Podcasts': '#FC3C44'
}

export default function UpdateFollowers() {
  const router = useRouter()
  const [socials, setSocials] = useState([])
  const [followers, setFollowers] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadSocials() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data } = await supabase
        .from('social_links')
        .select('*')
        .eq('user_id', user.id)

      if (data) {
        setSocials(data)
        const initial = {}
        data.forEach(s => { initial[s.id] = s.followers || 0 })
        setFollowers(initial)
      }
      setLoading(false)
    }
    loadSocials()
  }, [router])

  async function handleSave() {
    setSaving(true)
    setError('')
    setSaved(false)

    for (const social of socials) {
      const count = parseInt(followers[social.id]) || 0
      await supabase
        .from('social_links')
        .update({ followers: count })
        .eq('id', social.id)
    }

    // Recalculate score
    const { data: { user } } = await supabase.auth.getUser()
    const response = await fetch('/api/calculate-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id })
    })
    const data = await response.json()

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const input = {
    background: 'var(--cc-surface)',
    border: '0.5px solid var(--cc-border-strong)',
    borderRadius: 'var(--cc-radius-sm)',
    color: 'var(--cc-white)',
    fontFamily: 'var(--font-body)',
    fontSize: '16px',
    padding: '12px 14px',
    outline: 'none',
    width: '140px',
    textAlign: 'right',
    fontWeight: 700,
  }

  if (loading) return (
    <div style={{ background: 'var(--cc-black)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'var(--font-display)', color: 'var(--cc-gold)', fontSize: '16px' }}>Loading your socials...</div>
    </div>
  )

  return (
    <div style={{ background: 'var(--cc-black)', minHeight: '100vh', color: 'var(--cc-white)', paddingBottom: '80px' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '0.5px solid var(--cc-border)', background: 'var(--cc-surface)', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: 'var(--cc-gold)', letterSpacing: '-0.02em' }}>CloutCount</Link>
        <Link href="/dashboard" style={{ fontSize: '12px', color: 'var(--cc-muted)' }}>← Back to Dashboard</Link>
      </nav>

      <div style={{ padding: '28px 20px 0', maxWidth: '480px', margin: '0 auto' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cc-gold)', marginBottom: '6px' }}>Update Stats</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>Enter your follower counts.</h1>
        <p style={{ fontSize: '13px', color: 'var(--cc-muted)', lineHeight: 1.6, marginBottom: '8px' }}>Enter your current follower or subscriber count for each platform. Your CloutCount Score updates instantly.</p>

        <div style={{ background: 'var(--cc-gold-dim)', border: '0.5px solid var(--cc-gold-border)', borderRadius: 'var(--cc-radius-sm)', padding: '10px 14px', marginBottom: '24px', fontSize: '11px', color: 'var(--cc-gold)', lineHeight: 1.5 }}>
          Paid platforms (OnlyFans, Patreon, Substack, Spotify, Apple Podcasts) count as <strong>2 points per subscriber</strong>.
        </div>

        {error && (
          <div style={{ background: 'var(--cc-red-dim)', border: '0.5px solid rgba(255,82,82,0.3)', borderRadius: 'var(--cc-radius-sm)', padding: '10px 14px', fontSize: '12px', color: 'var(--cc-red)', marginBottom: '16px' }}>{error}</div>
        )}

        {socials.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--cc-card)', border: '0.5px solid var(--cc-border)', borderRadius: 'var(--cc-radius)' }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>📱</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>No social links added yet</div>
            <div style={{ fontSize: '13px', color: 'var(--cc-muted)', marginBottom: '20px' }}>Go back to your profile setup and add your social media accounts first.</div>
            <Link href="/setup" style={{ display: 'inline-block', background: 'var(--cc-gold)', color: 'var(--cc-black)', border: 'none', borderRadius: 'var(--cc-radius-pill)', fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 800, padding: '12px 24px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Add Social Links</Link>
          </div>
        ) : (
          <>
            {/* FREE PLATFORMS */}
            {socials.filter(s => !s.is_paid).length > 0 && (
              <>
                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cc-muted)', marginBottom: '10px' }}>Free Platforms — 1 pt per follower</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  {socials.filter(s => !s.is_paid).map(s => (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--cc-card)', border: '0.5px solid var(--cc-border)', borderRadius: 'var(--cc-radius-sm)', padding: '12px 14px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: platformColors[s.platform] || '#fff', display: 'inline-block', flexShrink: 0 }}></span>
                      <span style={{ fontSize: '13px', fontWeight: 500, flex: 1 }}>{s.platform}</span>
                      <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: 'var(--cc-radius-pill)', background: 'var(--cc-surface)', color: 'var(--cc-muted)', border: '0.5px solid var(--cc-border)', marginRight: '4px' }}>1×</span>
                      <input
                        style={input}
                        type="number"
                        min="0"
                        placeholder="0"
                        value={followers[s.id] || ''}
                        onChange={e => setFollowers(prev => ({ ...prev, [s.id]: e.target.value }))}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* PAID PLATFORMS */}
            {socials.filter(s => s.is_paid).length > 0 && (
              <>
                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cc-gold)', marginBottom: '10px' }}>Paid Platforms — 2 pts per subscriber</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  {socials.filter(s => s.is_paid).map(s => (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--cc-card)', border: '0.5px solid var(--cc-gold-border)', borderRadius: 'var(--cc-radius-sm)', padding: '12px 14px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: platformColors[s.platform] || '#fff', display: 'inline-block', flexShrink: 0 }}></span>
                      <span style={{ fontSize: '13px', fontWeight: 500, flex: 1 }}>{s.platform}</span>
                      <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: 'var(--cc-radius-pill)', background: 'var(--cc-gold-dim)', color: 'var(--cc-gold)', border: '0.5px solid var(--cc-gold-border)', marginRight: '4px' }}>2×</span>
                      <input
                        style={{ ...input, borderColor: 'var(--cc-gold-border)' }}
                        type="number"
                        min="0"
                        placeholder="0"
                        value={followers[s.id] || ''}
                        onChange={e => setFollowers(prev => ({ ...prev, [s.id]: e.target.value }))}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* SCORE PREVIEW */}
            <div style={{ background: 'var(--cc-card)', border: '0.5px solid var(--cc-border)', borderRadius: 'var(--cc-radius)', padding: '16px', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--cc-gold)' }}></div>
              <div style={{ fontSize: '10px', color: 'var(--cc-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>Estimated CloutCount Score</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 800, color: 'var(--cc-gold)', lineHeight: 1, marginBottom: '4px' }}>
                {socials.reduce((total, s) => {
                  const count = parseInt(followers[s.id]) || 0
                  return total + (count * (s.is_paid ? 2 : 1))
                }, 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--cc-muted)' }}>Updates when you save</div>
            </div>

            {saved && (
              <div style={{ background: 'var(--cc-green-dim)', border: '0.5px solid rgba(46,204,138,0.3)', borderRadius: 'var(--cc-radius-sm)', padding: '12px 14px', fontSize: '13px', color: '#2ECC8A', marginBottom: '16px', textAlign: 'center', fontWeight: 500 }}>
                ✓ Score updated successfully!
              </div>
            )}

            <button onClick={handleSave} disabled={saving} style={{ width: '100%', background: saving ? 'rgba(245,200,66,0.5)' : 'var(--cc-gold)', color: 'var(--cc-black)', border: 'none', borderRadius: 'var(--cc-radius-pill)', fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 800, padding: '14px', letterSpacing: '0.04em', textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer', marginBottom: '10px' }}>
              {saving ? 'Saving & Calculating...' : 'Save & Update My Score'}
            </button>

            <Link href="/dashboard" style={{ display: 'block', textAlign: 'center', background: 'transparent', color: 'var(--cc-muted)', border: '0.5px solid var(--cc-border-strong)', borderRadius: 'var(--cc-radius-pill)', fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700, padding: '13px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Back to Dashboard</Link>
          </>
        )}
      </div>

      {/* BOTTOM NAV */}
      <div style={{ display: 'flex', background: 'var(--cc-surface)', borderTop: '0.5px solid var(--cc-border)', padding: '10px 0 4px', position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50 }}>
        {[['Home', '⊞', '/'], ['Leaderboard', '≡', '/leaderboard'], ['Profile', '○', '/profile'], ['Settings', '⚙', '/settings']].map(([label, icon, href]) => (
          <Link key={label} href={href} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--cc-muted)', fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', padding: '4px 4px 6px' }}>
            <span style={{ fontSize: '18px' }}>{icon}</span>
            {label}
          </Link>
        ))}
      </div>

    </div>
  )
}