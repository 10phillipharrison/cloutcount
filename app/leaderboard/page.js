'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function Leaderboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [scope, setScope] = useState('world')
  const [platform, setPlatform] = useState('all')
  const [query, setQuery] = useState('')
  const [currentUser, setCurrentUser] = useState(null)

  const platforms = ['all', 'Instagram', 'TikTok', 'YouTube', 'X', 'Twitch', 'OnlyFans', 'Patreon']
  const platformColors = {
    Instagram: '#E1306C', TikTok: '#69C9D0', YouTube: '#FF0000',
    X: '#FFFFFF', Twitch: '#9146FF', OnlyFans: '#00AFF0', Patreon: '#FF424D'
  }

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)

      let queryBuilder = supabase
        .from('profiles')
        .select('*, social_links(*)')
        .eq('is_public', true)
        .order('cloutcount_score', { ascending: false })
        .limit(50)

      const { data } = await queryBuilder
      setUsers(data || [])
      setLoading(false)
    }
    loadData()
  }, [scope])

  const filtered = users.filter(u => {
    const matchesQuery = !query ||
      u.display_name?.toLowerCase().includes(query.toLowerCase()) ||
      u.username?.toLowerCase().includes(query.toLowerCase())
    const matchesPlatform = platform === 'all' ||
      u.social_links?.some(s => s.platform === platform)
    return matchesQuery && matchesPlatform
  })

  const initials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??'
  const rankColor = (i) => i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : 'var(--cc-muted)'

  return (
    <div style={{ background: 'var(--cc-black)', minHeight: '100vh', color: 'var(--cc-white)', paddingBottom: '80px' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '0.5px solid var(--cc-border)', background: 'var(--cc-surface)', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: 'var(--cc-gold)', letterSpacing: '-0.02em' }}>CloutCount</Link>
        <div style={{ display: 'flex', gap: '10px' }}>
          {currentUser
            ? <Link href="/dashboard" style={{ background: 'var(--cc-gold-dim)', color: 'var(--cc-gold)', border: '0.5px solid var(--cc-gold-border)', borderRadius: 'var(--cc-radius-pill)', fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, padding: '6px 13px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Dashboard</Link>
            : <Link href="/signup" style={{ background: 'var(--cc-gold)', color: 'var(--cc-black)', border: 'none', borderRadius: 'var(--cc-radius-pill)', fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, padding: '7px 16px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Claim Rank</Link>
          }
        </div>
      </nav>

      <div style={{ padding: '20px 20px 0' }}>

        {/* SEARCH */}
        <div style={{ position: 'relative', marginBottom: '10px' }}>
          <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--cc-muted)', fontSize: '14px' }}>🔍</span>
          <input
            type="text"
            placeholder="Search by name or @handle..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ width: '100%', background: 'var(--cc-surface)', border: '0.5px solid var(--cc-border-strong)', borderRadius: 'var(--cc-radius-pill)', color: 'var(--cc-white)', fontFamily: 'var(--font-body)', fontSize: '13px', padding: '11px 38px', outline: 'none' }}
          />
          {query && <button onClick={() => setQuery('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '18px', height: '18px', color: 'var(--cc-muted)', fontSize: '10px', cursor: 'pointer' }}>✕</button>}
        </div>

        {/* SCOPE TABS */}
        <div style={{ display: 'flex', background: 'var(--cc-surface)', border: '0.5px solid var(--cc-border)', borderRadius: 'var(--cc-radius-pill)', padding: '3px', marginBottom: '10px' }}>
          {['city', 'state', 'country', 'world'].map(s => (
            <button key={s} onClick={() => setScope(s)} style={{ flex: 1, background: scope === s ? 'var(--cc-gold)' : 'transparent', color: scope === s ? 'var(--cc-black)' : 'var(--cc-muted)', border: 'none', borderRadius: 'var(--cc-radius-pill)', fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700, padding: '7px 4px', textTransform: 'uppercase', letterSpacing: '0.04em', cursor: 'pointer' }}>{s}</button>
          ))}
        </div>

        {/* PLATFORM TOGGLE */}
        <div style={{ display: 'flex', background: 'var(--cc-surface)', border: '0.5px solid var(--cc-border)', borderRadius: 'var(--cc-radius-pill)', padding: '3px', gap: '2px', overflowX: 'auto', scrollbarWidth: 'none', marginBottom: '12px' }}>
          {platforms.map(p => (
            <button key={p} onClick={() => setPlatform(p)} style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: '5px', background: platform === p ? 'var(--cc-gold)' : 'transparent', color: platform === p ? 'var(--cc-black)' : 'var(--cc-muted)', border: 'none', borderRadius: 'var(--cc-radius-pill)', fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700, padding: '7px 11px', textTransform: 'uppercase', letterSpacing: '0.03em', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {p !== 'all' && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: platformColors[p], display: 'inline-block' }}></span>}
              {p === 'all' ? 'All' : p}
            </button>
          ))}
        </div>

        {/* RESULTS META */}
        <div style={{ fontSize: '11px', color: 'var(--cc-muted)', marginBottom: '10px' }}>
          {query
            ? <span>{filtered.length} result{filtered.length !== 1 ? 's' : ''} for "<span style={{ color: 'var(--cc-gold)' }}>{query}</span>"</span>
            : <span>Showing top creators <span style={{ color: 'var(--cc-gold)' }}>worldwide</span></span>
          }
        </div>

        {/* LEADERBOARD LIST */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--cc-muted)', fontSize: '13px' }}>Loading leaderboard...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', background: 'var(--cc-card)', border: '0.5px solid var(--cc-border)', borderRadius: 'var(--cc-radius)' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px', opacity: 0.3 }}>🔍</div>
            <div style={{ fontSize: '13px', color: 'var(--cc-muted)' }}>No results found{query ? ` for "${query}"` : ''}</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {filtered.map((u, i) => (
              <Link key={u.id} href={`/profile/${u.username}`} style={{ display: 'flex', alignItems: 'center', gap: '9px', background: 'var(--cc-card)', border: '0.5px solid var(--cc-border)', borderRadius: 'var(--cc-radius-sm)', padding: '10px 12px', textDecoration: 'none', color: 'inherit' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, color: rankColor(i), width: '24px', textAlign: 'center', flexShrink: 0 }}>#{i + 1}</div>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--cc-surface)', border: '1px solid var(--cc-border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, color: 'var(--cc-gold)', flexShrink: 0 }}>{initials(u.display_name)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>{u.display_name}</div>
                  <div style={{ fontSize: '10px', color: 'var(--cc-muted)', marginTop: '1px' }}>{u.niche} · {u.city}, {u.state}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, color: 'var(--cc-gold)' }}>{u.cloutcount_score?.toLocaleString() || 0}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <div style={{ display: 'flex', background: 'var(--cc-surface)', borderTop: '0.5px solid var(--cc-border)', padding: '10px 0 4px', position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50 }}>
        {[['Home', '⊞', '/'], ['Leaderboard', '≡', '/leaderboard'], ['Profile', '○', '/profile'], ['Settings', '⚙', '/settings']].map(([label, icon, href]) => (
          <Link key={label} href={href} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: label === 'Leaderboard' ? 'var(--cc-gold)' : 'var(--cc-muted)', fontFamily: 'var(--font-display)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', padding: '4px 4px 6px' }}>
            <span style={{ fontSize: '18px' }}>{icon}</span>
            {label}
          </Link>
        ))}
      </div>

    </div>
  )
}