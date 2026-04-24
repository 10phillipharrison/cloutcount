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

const feedData = {
  all: [
    { color: '#2ECC8A', text: 'You moved up 6 spots in Arkansas this week.', time: '2 hours ago' },
    { color: '#2ECC8A', text: 'You entered the top 2% worldwide for the first time.', time: 'Yesterday' },
    { color: '#F5C842', text: 'Your paid platform subscribers grew this week.', time: '3 days ago' },
    { color: '#FF5252', text: 'A creator in your niche passed you on the state leaderboard.', time: '4 days ago' },
    { color: '#2ECC8A', text: 'Your total score increased this week.', time: '5 days ago' },
  ]
}

export default function Dashboard() {
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [socials, setSocials] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (!profileData) { router.push('/setup'); return }
      setProfile(profileData)
      const { data: socialsData } = await supabase.from('social_links').select('*').eq('user_id', user.id)
      setSocials(socialsData || [])
      setLoading(false)
    }
    loadData()
  }, [router])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  async function updateScore() {
    setUpdating(true)
    const { data: { user } } = await supabase.auth.getUser()
    const response = await fetch('/api/calculate-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id })
    })
    const data = await response.json()
    if (data.score !== undefined) {
      setProfile(prev => ({
        ...prev,
        cloutcount_score: data.score,
        world_rank: data.world_rank,
        country_rank: data.country_rank,
        state_rank: data.state_rank,
        city_rank: data.city_rank,
      }))
    }
    setUpdating(false)
  }

  if (loading) return (
    <div style={{ background: 'var(--cc-black)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'var(--font-display)', color: 'var(--cc-gold)', fontSize: '16px' }}>Loading your rank...</div>
    </div>
  )

  const totalScore = profile?.cloutcount_score || 0
  const initials = profile?.display_name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??'
  const currentFeed = feedData[activeTab] || feedData.all

  return (
    <div style={{ background: 'var(--cc-black)', minHeight: '100vh', color: 'var(--cc-white)', paddingBottom: '80px' }}>

      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '0.5px solid var(--cc-border)', background: 'var(--cc-surface)', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: 'var(--cc-gold)', letterSpacing: '-0.02em' }}>CloutCount</Link>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Link href="/billing" style={{ background: 'var(--cc-gold-dim)', color: 'var(--cc-gold)', border: '0.5px solid var(--cc-gold-border)', borderRadius: 'var(--cc-radius-pill)', fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, padding: '6px 13px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Upgrade</Link>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--cc-gold-dim)', border: '1.5px solid var(--cc-gold-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, color: 'var(--cc-gold)', cursor: 'pointer' }} onClick={handleSignOut}>{initials}</div>
        </div>
      </nav>

      <div style={{ padding: '20px 20px 0' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--cc-gold-dim)', border: '2px solid var(--cc-gold-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800, color: 'var(--cc-gold)', flexShrink: 0 }}>{initials}</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 800 }}>{profile?.display_name}</div>
            <div style={{ fontSize: '12px', color: 'var(--cc-muted)', marginTop: '2px' }}>@{profile?.username} · {profile?.niche}</div>
            <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
              <span style={{ background: 'rgba(46,204,138,0.1)', color: '#2ECC8A', border: '0.5px solid rgba(46,204,138,0.25)', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--cc-radius-pill)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>✓ Verified</span>
              <span style={{ background: 'var(--cc-gold-dim)', color: 'var(--cc-gold)', border: '0.5px solid var(--cc-gold-border)', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--cc-radius-pill)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Top 2%</span>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cc-gold)', marginBottom: '10px' }}>Score & Rank</div>

        <div style={{ display: 'flex', background: 'var(--cc-surface)', border: '0.5px solid var(--cc-border)', borderRadius: 'var(--cc-radius-pill)', padding: '3px', gap: '2px', overflowX: 'auto', scrollbarWidth: 'none', marginBottom: '14px' }}>
          <button onClick={() => setActiveTab('all')} style={{ flexShrink: 0, background: activeTab === 'all' ? 'var(--cc-gold)' : 'transparent', color: activeTab === 'all' ? 'var(--cc-black)' : 'var(--cc-muted)', border: 'none', borderRadius: 'var(--cc-radius-pill)', fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700, padding: '7px 11px', textTransform: 'uppercase', letterSpacing: '0.03em', cursor: 'pointer', whiteSpace: 'nowrap' }}>All Platforms</button>
          {socials.map(s => (
            <button key={s.platform} onClick={() => setActiveTab(s.platform)} style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: '5px', background: activeTab === s.platform ? 'var(--cc-gold)' : 'transparent', color: activeTab === s.platform ? 'var(--cc-black)' : 'var(--cc-muted)', border: 'none', borderRadius: 'var(--cc-radius-pill)', fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700, padding: '7px 11px', textTransform: 'uppercase', letterSpacing: '0.03em', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: platformColors[s.platform] || '#fff', display: 'inline-block', flexShrink: 0 }}></span>
              {s.platform}
            </button>
          ))}
        </div>

        <div style={{ background: 'var(--cc-card)', border: '0.5px solid var(--cc-border)', borderRadius: 'var(--cc-radius)', padding: '16px', marginBottom: '12px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--cc-gold)' }}></div>
          {activeTab === 'all' ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--cc-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>Total CloutCount Score</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '38px', fontWeight: 800, color: 'var(--cc-gold)', lineHeight: 1 }}>{totalScore.toLocaleString()}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-end' }}>
                  <span style={{ background: 'var(--cc-gold-dim)', color: 'var(--cc-gold)', border: '0.5px solid var(--cc-gold-border)', fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: 'var(--cc-radius-pill)', textTransform: 'uppercase' }}>Top 2%</span>
                  <span style={{ background: 'var(--cc-green-dim)', color: '#2ECC8A', fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: 'var(--cc-radius-pill)' }}>▲ Active</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {[['City', profile?.city_rank, profile?.city], ['State', profile?.state_rank, profile?.state], ['Country', profile?.country_rank, profile?.country], ['World', profile?.world_rank, 'Worldwide']].map(([label, rank, scope]) => (
                  <div key={label} style={{ background: 'var(--cc-surface)', border: '0.5px solid var(--cc-border)', borderRadius: 'var(--cc-radius-sm)', padding: '10px' }}>
                    <div style={{ fontSize: '9px', color: 'var(--cc-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '3px' }}>{label}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '19px', fontWeight: 800, color: 'var(--cc-gold)', lineHeight: 1 }}>#{rank || '—'}</div>
                    <div style={{ fontSize: '10px', color: 'var(--cc-muted)', marginTop: '2px' }}>{scope}</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {socials.filter(s => s.platform === activeTab).map(s => (
                <div key={s.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: platformColors[s.platform] || '#fff', display: 'inline-block' }}></span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800 }}>{s.platform}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: 'var(--cc-radius-pill)', background: s.is_paid ? 'var(--cc-gold-dim)' : 'var(--cc-surface)', color: s.is_paid ? 'var(--cc-gold)' : 'var(--cc-muted)', border: `0.5px solid ${s.is_paid ? 'var(--cc-gold-border)' : 'var(--cc-border)'}` }}>{s.is_paid ? '2× paid' : '1× free'}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                    {[['Followers', s.followers?.toLocaleString() || '0'], ['Points', s.points?.toLocaleString() || '0'], ['Multiplier', s.is_paid ? '2×' : '1×'], ['Status', 'Connected']].map(([label, val]) => (
                      <div key={label} style={{ background: 'var(--cc-surface)', border: '0.5px solid var(--cc-border)', borderRadius: 'var(--cc-radius-sm)', padding: '10px' }}>
                        <div style={{ fontSize: '9px', color: 'var(--cc-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '3px' }}>{label}</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, color: 'var(--cc-gold)' }}>{val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {activeTab === 'all' && socials.length > 0 && (
          <div style={{ marginBottom: '12px' }}>
            {socials.map(s => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--cc-card)', border: '0.5px solid var(--cc-border)', borderRadius: 'var(--cc-radius-sm)', padding: '10px 12px', marginBottom: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: platformColors[s.platform] || '#fff', display: 'inline-block', flexShrink: 0 }}></span>
                <span style={{ fontSize: '13px', fontWeight: 500, flex: 1 }}>{s.platform}</span>
                <span style={{ fontSize: '11px', color: 'var(--cc-muted)', marginRight: '4px' }}>{s.followers?.toLocaleString() || 0}</span>
                <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: 'var(--cc-radius-pill)', background: s.is_paid ? 'var(--cc-gold-dim)' : 'var(--cc-surface)', color: s.is_paid ? 'var(--cc-gold)' : 'var(--cc-muted)', border: `0.5px solid ${s.is_paid ? 'var(--cc-gold-border)' : 'var(--cc-border)'}` }}>{s.is_paid ? '2×' : '1×'}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, color: 'var(--cc-gold)', minWidth: '52px', textAlign: 'right' }}>{s.points?.toLocaleString() || 0}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--cc-gold-dim)', border: '0.5px solid var(--cc-gold-border)', borderRadius: 'var(--cc-radius-sm)' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700, color: 'var(--cc-gold)' }}>Total Score</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, color: 'var(--cc-gold)' }}>{totalScore.toLocaleString()} pts</span>
            </div>
          </div>
        )}

        <div style={{ height: '0.5px', background: 'var(--cc-border)', margin: '16px 0' }}></div>
        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cc-gold)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          Movement Feed
          <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--cc-radius-pill)', background: 'var(--cc-gold-dim)', color: 'var(--cc-gold)', border: '0.5px solid var(--cc-gold-border)', textTransform: 'uppercase' }}>{activeTab === 'all' ? 'All Platforms' : activeTab}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {currentFeed.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: 'var(--cc-card)', border: '0.5px solid var(--cc-border)', borderRadius: 'var(--cc-radius-sm)', padding: '11px 12px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, flexShrink: 0, marginTop: '4px', display: 'inline-block' }}></span>
              <div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{item.text}</div>
                <div style={{ fontSize: '10px', color: 'var(--cc-muted)', marginTop: '3px' }}>{item.time}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ height: '0.5px', background: 'var(--cc-border)', margin: '16px 0' }}></div>
        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cc-gold)', marginBottom: '10px' }}>Quick Actions</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          <button onClick={updateScore} disabled={updating} style={{ background: updating ? 'rgba(245,200,66,0.5)' : 'var(--cc-gold)', color: 'var(--cc-black)', border: 'none', borderRadius: 'var(--cc-radius-sm)', fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', padding: '13px 10px', cursor: updating ? 'not-allowed' : 'pointer' }}>
            {updating ? 'Updating...' : 'Update My Score'}
          </button>
          <Link href="/leaderboard" style={{ display: 'block', textAlign: 'center', background: 'var(--cc-card)', border: '0.5px solid var(--cc-border)', borderRadius: 'var(--cc-radius-sm)', color: 'var(--cc-white)', fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', padding: '13px 10px' }}>View Leaderboard</Link>
          <Link href="/settings" style={{ display: 'block', textAlign: 'center', background: 'var(--cc-card)', border: '0.5px solid var(--cc-border)', borderRadius: 'var(--cc-radius-sm)', color: 'var(--cc-white)', fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', padding: '13px 10px' }}>Edit Profile</Link>
          <Link href="/billing" style={{ display: 'block', textAlign: 'center', background: 'var(--cc-card)', border: '0.5px solid var(--cc-border)', borderRadius: 'var(--cc-radius-sm)', color: 'var(--cc-white)', fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', padding: '13px 10px' }}>Upgrade Plan</Link>
        </div>

      </div>

      <div style={{ display: 'flex', background: 'var(--cc-surface)', borderTop: '0.5px solid var(--cc-border)', padding: '10px 0 4px', position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50 }}>
        {[['Home', '⊞', '/'], ['Leaderboard', '≡', '/leaderboard'], ['Profile', '○', '/profile'], ['Settings', '⚙', '/settings']].map(([label, icon, href]) => (
          <Link key={label} href={href} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: label === 'Dashboard' ? 'var(--cc-gold)' : 'var(--cc-muted)', fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', padding: '4px 4px 6px' }}>
            <span style={{ fontSize: '18px' }}>{icon}</span>
            {label}
          </Link>
        ))}
      </div>

    </div>
  )
}