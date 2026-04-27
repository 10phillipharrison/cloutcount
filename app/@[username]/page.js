import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import ProfileClient from './ProfileClient'

const platformColors = {
  Instagram: '#E1306C', TikTok: '#69C9D0', YouTube: '#FF0000',
  X: '#FFFFFF', Twitch: '#9146FF', Facebook: '#1877F2',
  LinkedIn: '#0A66C2', OnlyFans: '#00AFF0', Patreon: '#FF424D',
  Substack: '#FF6719', Spotify: '#1DB954', 'Apple Podcasts': '#FC3C44'
}

// Server-side data fetch (runs on Vercel, not in browser — fast & SEO-friendly)
async function getProfile(username) {
  // Strip @ if it somehow got included, and reject empty usernames
  const cleanUsername = username.replace(/^@/, '').toLowerCase().trim()
  if (!cleanUsername) return null

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .ilike('username', cleanUsername)
    .single()

  if (!profile) return null

  const { data: socials } = await supabase
    .from('social_links')
    .select('*')
    .eq('user_id', profile.id)
    .order('followers', { ascending: false })

  return { profile, socials: socials || [] }
}

// Dynamic SEO metadata — controls how link previews look on social media
export async function generateMetadata({ params }) {
  const { username } = await params
  const data = await getProfile(username)

  if (!data) {
    return { title: 'Profile not found · CloutCount' }
  }

  const { profile } = data
  const score = profile.cloutcount_score?.toLocaleString() || '0'
  const title = `${profile.display_name} (@${profile.username}) · CloutCount`
  const description = `${profile.display_name} has a CloutCount Score of ${score}. View their full creator stats and rankings.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      url: `https://cloutcount.com/@${profile.username}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function PublicProfile({ params }) {
  const { username } = await params
  const data = await getProfile(username)

  if (!data) notFound()

  const { profile, socials } = data
  const isVerified = profile.plan && profile.plan !== 'free'
  const initials = (profile.display_name || profile.username || 'CC')
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  // Format rank with ordinal suffix (1st, 2nd, 3rd, 4th...)
  const ordinal = (n) => {
    if (!n) return '—'
    const s = ['th', 'st', 'nd', 'rd']
    const v = n % 100
    return n.toLocaleString() + (s[(v - 20) % 10] || s[v] || s[0])
  }

  return (
    <div style={{ background: 'var(--cc-black)', minHeight: '100vh', color: 'var(--cc-white)', paddingBottom: '40px' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '0.5px solid var(--cc-border)', background: 'var(--cc-surface)', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: 'var(--cc-gold)', letterSpacing: '-0.02em' }}>CloutCount</Link>
        <Link href="/signup" style={{ background: 'var(--cc-gold)', color: 'var(--cc-black)', border: 'none', borderRadius: 'var(--cc-radius-pill)', fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 800, padding: '8px 16px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Get Your Score</Link>
      </nav>

      <div style={{ padding: '32px 20px 0', maxWidth: '480px', margin: '0 auto' }}>

        {/* AVATAR + NAME */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.display_name} style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '0.5px solid var(--cc-border-strong)' }} />
          ) : (
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--cc-card)', border: '0.5px solid var(--cc-border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'var(--cc-gold)' }}>{initials}</div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, lineHeight: 1.1 }}>{profile.display_name}</h1>
              {isVerified && (
                <span title="Verified" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '50%', background: 'var(--cc-gold)', color: 'var(--cc-black)', fontSize: '11px', fontWeight: 900, flexShrink: 0 }}>✓</span>
              )}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--cc-muted)' }}>@{profile.username}{profile.niche ? ` · ${profile.niche}` : ''}</div>
            {(profile.city || profile.state || profile.country) && (
              <div style={{ fontSize: '12px', color: 'var(--cc-muted)', marginTop: '2px' }}>
                {[profile.city, profile.state, profile.country].filter(Boolean).join(', ')}
              </div>
            )}
          </div>
        </div>

        {profile.bio && (
          <p style={{ fontSize: '14px', color: 'var(--cc-white)', lineHeight: 1.5, marginBottom: '24px' }}>{profile.bio}</p>
        )}

        {/* PRIVACY GATE */}
        {profile.is_public === false ? (
          <div style={{ background: 'var(--cc-card)', border: '0.5px solid var(--cc-border)', borderRadius: 'var(--cc-radius)', padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>🔒</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>This profile is private</div>
            <div style={{ fontSize: '13px', color: 'var(--cc-muted)' }}>{profile.display_name} hasn't made their score public yet.</div>
          </div>
        ) : (
          <>
            {/* HERO SCORE */}
            <div style={{ background: 'var(--cc-card)', border: '0.5px solid var(--cc-border)', borderRadius: 'var(--cc-radius)', padding: '24px 20px', marginBottom: '20px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--cc-gold)' }}></div>
              <div style={{ fontSize: '10px', color: 'var(--cc-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', fontWeight: 700 }}>CloutCount Score</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '52px', fontWeight: 800, color: 'var(--cc-gold)', lineHeight: 1, marginBottom: '10px', letterSpacing: '-0.02em' }}>
                {(profile.cloutcount_score || 0).toLocaleString()}
              </div>
              <div style={{ display: 'inline-flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {profile.world_rank && (
                  <span style={{ fontSize: '10px', fontWeight: 700, padding: '4px 10px', borderRadius: 'var(--cc-radius-pill)', background: 'var(--cc-gold-dim)', color: 'var(--cc-gold)', border: '0.5px solid var(--cc-gold-border)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {ordinal(profile.world_rank)} Worldwide
                  </span>
                )}
                {profile.country_rank && profile.country && (
                  <span style={{ fontSize: '10px', fontWeight: 700, padding: '4px 10px', borderRadius: 'var(--cc-radius-pill)', background: 'var(--cc-surface)', color: 'var(--cc-muted)', border: '0.5px solid var(--cc-border)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {ordinal(profile.country_rank)} in {profile.country}
                  </span>
                )}
              </div>
            </div>

            {/* RANK BREAKDOWN */}
            {(profile.city_rank || profile.state_rank) && (
              <div style={{ display: 'grid', gridTemplateColumns: profile.city_rank && profile.state_rank ? '1fr 1fr' : '1fr', gap: '8px', marginBottom: '20px' }}>
                {profile.state_rank && profile.state && (
                  <div style={{ background: 'var(--cc-card)', border: '0.5px solid var(--cc-border)', borderRadius: 'var(--cc-radius-sm)', padding: '12px 14px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--cc-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px', fontWeight: 700 }}>State Rank</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800 }}>{ordinal(profile.state_rank)}</div>
                    <div style={{ fontSize: '11px', color: 'var(--cc-muted)', marginTop: '2px' }}>{profile.state}</div>
                  </div>
                )}
                {profile.city_rank && profile.city && (
                  <div style={{ background: 'var(--cc-card)', border: '0.5px solid var(--cc-border)', borderRadius: 'var(--cc-radius-sm)', padding: '12px 14px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--cc-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px', fontWeight: 700 }}>City Rank</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800 }}>{ordinal(profile.city_rank)}</div>
                    <div style={{ fontSize: '11px', color: 'var(--cc-muted)', marginTop: '2px' }}>{profile.city}</div>
                  </div>
                )}
              </div>
            )}

            {/* PLATFORMS */}
            {socials.length > 0 && (
              <>
                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cc-muted)', marginBottom: '10px' }}>Platforms</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                  {socials.map(s => (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--cc-card)', border: `0.5px solid ${s.is_paid ? 'var(--cc-gold-border)' : 'var(--cc-border)'}`, borderRadius: 'var(--cc-radius-sm)', padding: '14px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: platformColors[s.platform] || '#fff', display: 'inline-block', flexShrink: 0 }}></span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>{s.platform}</div>
                        <div style={{ fontSize: '11px', color: 'var(--cc-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.url}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800, color: 'var(--cc-white)' }}>{(s.followers || 0).toLocaleString()}</div>
                        <div style={{ fontSize: '9px', color: s.is_paid ? 'var(--cc-gold)' : 'var(--cc-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>{s.is_paid ? '2× Paid' : 'Followers'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* SHARE + CTA (client component) */}
            <ProfileClient profile={profile} />

            <div style={{ textAlign: 'center', marginTop: '32px', paddingTop: '24px', borderTop: '0.5px solid var(--cc-border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--cc-muted)', marginBottom: '12px' }}>Want your own CloutCount Score?</div>
              <Link href="/signup" style={{ display: 'inline-block', background: 'var(--cc-gold)', color: 'var(--cc-black)', border: 'none', borderRadius: 'var(--cc-radius-pill)', fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 800, padding: '12px 28px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Get Your Score Free</Link>
            </div>
          </>
        )}

      </div>
    </div>
  )
}