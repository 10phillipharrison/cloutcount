'use client'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

const niches = ['Fitness','Gaming','Beauty','Music','Comedy','Education','Business','Lifestyle','Tech','Food','Travel','Other']

const platforms = [
  { name: 'Instagram', color: '#E1306C', placeholder: 'instagram.com/yourhandle', paid: false },
  { name: 'TikTok', color: '#69C9D0', placeholder: 'tiktok.com/@yourhandle', paid: false },
  { name: 'YouTube', color: '#FF0000', placeholder: 'youtube.com/@yourhandle', paid: false },
  { name: 'X', color: '#FFFFFF', placeholder: 'x.com/yourhandle', paid: false },
  { name: 'Twitch', color: '#9146FF', placeholder: 'twitch.tv/yourhandle', paid: false },
  { name: 'Facebook', color: '#1877F2', placeholder: 'facebook.com/yourhandle', paid: false },
  { name: 'LinkedIn', color: '#0A66C2', placeholder: 'linkedin.com/in/yourhandle', paid: false },
  { name: 'OnlyFans', color: '#00AFF0', placeholder: 'onlyfans.com/yourhandle', paid: true },
  { name: 'Patreon', color: '#FF424D', placeholder: 'patreon.com/yourhandle', paid: true },
  { name: 'Substack', color: '#FF6719', placeholder: 'substack.com/@yourhandle', paid: true },
  { name: 'Spotify', color: '#1DB954', placeholder: 'open.spotify.com/artist/...', paid: true },
  { name: 'Apple Podcasts', color: '#FC3C44', placeholder: 'podcasts.apple.com/...', paid: true },
]

export default function Setup() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [country, setCountry] = useState('United States')
  const [niche, setNiche] = useState('')
  const [socialLinks, setSocialLinks] = useState({})
  const [visibility, setVisibility] = useState('public')

  function updateSocial(name, value) {
    setSocialLinks(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit() {
    setError('')
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error: profileError } = await supabase.from('profiles').insert({
      id: user.id,
      display_name: displayName,
      username: username.replace('@', '').toLowerCase(),
      bio,
      city,
      state,
      country,
      niche,
      is_public: visibility === 'public',
      plan: 'free',
    })

    if (profileError) {
      setError(profileError.message)
      setLoading(false)
      return
    }

    const socialEntries = Object.entries(socialLinks).filter(([, url]) => url)
    for (const [name, url] of socialEntries) {
      const platform = platforms.find(p => p.name === name)
      await supabase.from('social_links').insert({
        user_id: user.id,
        platform: name,
        url,
        is_paid: platform?.paid || false,
        followers: 0,
        points: 0,
      })
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

  const label = {
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: 'var(--cc-muted)',
    display: 'block',
  }

  const progress = (step / 3) * 100

  return (
    <div style={{ background: 'var(--cc-black)', minHeight: '100vh', color: 'var(--cc-white)' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '0.5px solid var(--cc-border)', background: 'var(--cc-surface)' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: 'var(--cc-gold)', letterSpacing: '-0.02em' }}>CloutCount</Link>
        <span style={{ fontSize: '12px', color: 'var(--cc-muted)' }}>Step {step} of 3</span>
      </nav>

      {/* PROGRESS BAR */}
      <div style={{ height: '3px', background: 'var(--cc-border)' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'var(--cc-gold)', transition: 'width 0.3s ease' }}></div>
      </div>

      <div style={{ padding: '32px 20px 100px', maxWidth: '480px', margin: '0 auto' }}>

        {error && (
          <div style={{ background: 'var(--cc-red-dim)', border: '0.5px solid rgba(255,82,82,0.3)', borderRadius: 'var(--cc-radius-sm)', padding: '10px 14px', fontSize: '12px', color: 'var(--cc-red)', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {/* STEP 1 — PROFILE */}
        {step === 1 && (
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cc-gold)', marginBottom: '6px' }}>Step 1 of 3</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>Build your profile.</h1>
            <p style={{ fontSize: '13px', color: 'var(--cc-muted)', lineHeight: 1.6, marginBottom: '24px' }}>This is what other users will see on the leaderboard.</p>

            <div style={{ marginBottom: '14px' }}>
              <label style={label}>Display name</label>
              <input style={input} type="text" placeholder="John Doe" value={displayName} onChange={e => setDisplayName(e.target.value)} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={label}>Username</label>
              <input style={input} type="text" placeholder="@johndoe" value={username} onChange={e => setUsername(e.target.value)} />
              <div style={{ fontSize: '11px', color: 'var(--cc-muted)', marginTop: '5px' }}>Your public handle on CloutCount</div>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={label}>Bio <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>(optional)</span></label>
              <textarea style={{ ...input, resize: 'none', lineHeight: 1.5 }} rows={3} placeholder="Tell people what you're about..." value={bio} onChange={e => setBio(e.target.value)} />
            </div>

            <div style={{ height: '0.5px', background: 'var(--cc-border)', margin: '20px 0' }}></div>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cc-gold)', marginBottom: '12px' }}>Your Location</div>

            <div style={{ marginBottom: '14px' }}>
              <label style={label}>City</label>
              <input style={input} type="text" placeholder="Bentonville" value={city} onChange={e => setCity(e.target.value)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <div>
                <label style={label}>State / Province</label>
                <input style={input} type="text" placeholder="AR" value={state} onChange={e => setState(e.target.value)} />
              </div>
              <div>
                <label style={label}>Country</label>
                <select style={{ ...input, appearance: 'none', cursor: 'pointer' }} value={country} onChange={e => setCountry(e.target.value)}>
                  {['United States','United Kingdom','Canada','Australia','India','Brazil','Germany','France','Mexico','Philippines','Argentina','Colombia','Spain','Italy','Netherlands','Poland','Turkey','Saudi Arabia','UAE','Nigeria','South Africa','Kenya','Japan','South Korea','China','Indonesia','Vietnam','Thailand','Malaysia','Singapore','New Zealand','Other'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div style={{ height: '0.5px', background: 'var(--cc-border)', margin: '20px 0' }}></div>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cc-gold)', marginBottom: '12px' }}>Your Niche</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {niches.map(n => (
                <button key={n} onClick={() => setNiche(n)} style={{ background: niche === n ? 'var(--cc-gold-dim)' : 'var(--cc-surface)', border: `0.5px solid ${niche === n ? 'var(--cc-gold)' : 'rgba(255,255,255,0.15)'}`, borderRadius: 'var(--cc-radius-sm)', color: niche === n ? 'var(--cc-gold)' : 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 500, padding: '10px 12px', cursor: 'pointer', textAlign: 'left' }}>{n}</button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 — SOCIALS */}
        {step === 2 && (
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cc-gold)', marginBottom: '6px' }}>Step 2 of 3</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>Add your socials.</h1>
            <p style={{ fontSize: '13px', color: 'var(--cc-muted)', lineHeight: 1.6, marginBottom: '16px' }}>Paste your profile URLs. Paid platform subscribers count double.</p>

            <div style={{ background: 'var(--cc-gold-dim)', border: '0.5px solid var(--cc-gold-border)', borderRadius: 'var(--cc-radius-sm)', padding: '10px 14px', marginBottom: '20px', fontSize: '11px', color: 'var(--cc-gold)', lineHeight: 1.5 }}>
              Only add accounts you own. Claiming someone else&apos;s profile results in suspension.
            </div>

            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cc-gold)', marginBottom: '10px' }}>Free Platforms — 1 pt per follower</div>
            {platforms.filter(p => !p.paid).map(p => (
              <div key={p.name} style={{ position: 'relative', marginBottom: '10px' }}>
                <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', width: '8px', height: '8px', borderRadius: '50%', background: p.color, display: 'inline-block' }}></span>
                <input style={{ ...input, marginTop: 0, paddingLeft: '30px', paddingRight: '45px' }} type="url" placeholder={p.placeholder} value={socialLinks[p.name] || ''} onChange={e => updateSocial(p.name, e.target.value)} />
                <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: 'var(--cc-radius-pill)', background: 'var(--cc-surface)', color: 'var(--cc-muted)', border: '0.5px solid var(--cc-border)' }}>1×</span>
              </div>
            ))}

            <div style={{ height: '0.5px', background: 'var(--cc-border)', margin: '16px 0' }}></div>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cc-gold)', marginBottom: '10px' }}>Paid Platforms — 2 pts per subscriber</div>
            {platforms.filter(p => p.paid).map(p => (
              <div key={p.name} style={{ position: 'relative', marginBottom: '10px' }}>
                <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', width: '8px', height: '8px', borderRadius: '50%', background: p.color, display: 'inline-block' }}></span>
                <input style={{ ...input, marginTop: 0, paddingLeft: '30px', paddingRight: '45px' }} type="url" placeholder={p.placeholder} value={socialLinks[p.name] || ''} onChange={e => updateSocial(p.name, e.target.value)} />
                <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: 'var(--cc-radius-pill)', background: 'var(--cc-gold-dim)', color: 'var(--cc-gold)', border: '0.5px solid var(--cc-gold-border)' }}>2×</span>
              </div>
            ))}
          </div>
        )}

        {/* STEP 3 — VISIBILITY */}
        {step === 3 && (
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cc-gold)', marginBottom: '6px' }}>Step 3 of 3</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>Choose your visibility.</h1>
            <p style={{ fontSize: '13px', color: 'var(--cc-muted)', lineHeight: 1.6, marginBottom: '24px' }}>You can change this anytime from settings.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
              {[['public', 'Public', 'Your name and score are visible on all leaderboards.'], ['private', 'Private', 'Blurred on leaderboards. Your rank is still tracked.']].map(([val, title, desc]) => (
                <div key={val} onClick={() => setVisibility(val)} style={{ background: visibility === val ? 'var(--cc-gold-dim)' : 'var(--cc-surface)', border: `0.5px solid ${visibility === val ? 'var(--cc-gold)' : 'rgba(255,255,255,0.15)'}`, borderRadius: 'var(--cc-radius-sm)', padding: '14px 12px', cursor: 'pointer' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>{title}</div>
                  <div style={{ fontSize: '11px', color: visibility === val ? 'rgba(245,200,66,0.7)' : 'var(--cc-muted)', lineHeight: 1.4 }}>{desc}</div>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--cc-card)', border: '0.5px solid var(--cc-border)', borderRadius: 'var(--cc-radius-sm)', padding: '14px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <input type="checkbox" id="ownership" required style={{ marginTop: '3px', accentColor: 'var(--cc-gold)', width: '16px', height: '16px', flexShrink: 0, cursor: 'pointer' }} />
                <label htmlFor="ownership" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, cursor: 'pointer' }}>
                  I confirm all social accounts I added belong to me. Claiming someone else&apos;s account will result in a 7-day suspension for a first offense, 30-day for a second, and a permanent ban for a third.
                </label>
              </div>
            </div>
          </div>
        )}

        {/* NAV BUTTONS */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '32px' }}>
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} style={{ flex: 1, background: 'transparent', color: 'var(--cc-white)', border: '0.5px solid var(--cc-border-strong)', borderRadius: 'var(--cc-radius-pill)', fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700, padding: '13px', letterSpacing: '0.04em', textTransform: 'uppercase', cursor: 'pointer' }}>Back</button>
          )}
          {step < 3 ? (
            <button onClick={() => setStep(step + 1)} style={{ flex: 1, background: 'var(--cc-gold)', color: 'var(--cc-black)', border: 'none', borderRadius: 'var(--cc-radius-pill)', fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 800, padding: '13px', letterSpacing: '0.04em', textTransform: 'uppercase', cursor: 'pointer' }}>
              {step === 1 ? 'Next — Add Socials' : 'Next — Visibility'}
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} style={{ flex: 1, background: loading ? 'rgba(245,200,66,0.5)' : 'var(--cc-gold)', color: 'var(--cc-black)', border: 'none', borderRadius: 'var(--cc-radius-pill)', fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 800, padding: '13px', letterSpacing: '0.04em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Setting up...' : 'Calculate My Rank'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}