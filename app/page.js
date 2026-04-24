'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [activeTab, setActiveTab] = useState('city')

  const leaderboard = [
    { rank: 1, initials: 'JD', name: 'John Doe', handle: '@johndoe', niche: 'Fitness', location: 'Bentonville, AR', score: 142420, move: '+6', dir: 'up' },
    { rank: 2, initials: 'SR', name: 'Sarah Rose', handle: '@sarahrose', niche: 'Beauty', location: 'Rogers, AR', score: 98840, move: '-1', dir: 'dn' },
    { rank: 3, initials: 'MK', name: 'Mike King', handle: '@mikeking', niche: 'Gaming', location: 'Fayetteville, AR', score: 87200, move: '+3', dir: 'up' },
  ]

  return (
    <div style={{ background: 'var(--cc-black)', minHeight: '100vh', color: 'var(--cc-white)' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '0.5px solid var(--cc-border)', background: 'var(--cc-surface)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: 'var(--cc-gold)', letterSpacing: '-0.02em' }}>CloutCount</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/login" style={{ background: 'transparent', color: 'var(--cc-white)', border: '0.5px solid var(--cc-border-strong)', borderRadius: 'var(--cc-radius-pill)', fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, padding: '7px 16px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Log in</Link>
          <Link href="/signup" style={{ background: 'var(--cc-gold)', color: 'var(--cc-black)', border: 'none', borderRadius: 'var(--cc-radius-pill)', fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, padding: '7px 16px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Claim Rank</Link>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ padding: '48px 20px 32px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--cc-gold-dim)', border: '0.5px solid var(--cc-gold-border)', borderRadius: 'var(--cc-radius-pill)', padding: '5px 14px', fontSize: '11px', fontWeight: 500, color: 'var(--cc-gold)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '20px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--cc-gold)', display: 'inline-block' }}></span>
          Live Social Rankings
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '16px' }}>
          See where you rank<br />on <span style={{ color: 'var(--cc-gold)' }}>every social,</span><br />worldwide.
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--cc-muted)', lineHeight: 1.65, marginBottom: '28px', maxWidth: '320px', margin: '0 auto 28px' }}>
          Paste your social profiles. Get your CloutCount Score. See your rank by city, state, country, and world — updated live.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
          <Link href="/signup" style={{ background: 'var(--cc-gold)', color: 'var(--cc-black)', border: 'none', borderRadius: 'var(--cc-radius-pill)', fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 800, padding: '14px 32px', letterSpacing: '0.04em', textTransform: 'uppercase', width: '100%', maxWidth: '300px', textAlign: 'center', display: 'block' }}>Claim Your Rank</Link>
          <Link href="/leaderboard" style={{ background: 'transparent', color: 'var(--cc-white)', border: '0.5px solid var(--cc-border-strong)', borderRadius: 'var(--cc-radius-pill)', fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, padding: '13px 32px', letterSpacing: '0.04em', textTransform: 'uppercase', width: '100%', maxWidth: '300px', textAlign: 'center', display: 'block' }}>View Leaderboard</Link>
        </div>
      </div>

      {/* SAMPLE RANK CARD */}
      <div style={{ margin: '0 20px 32px', background: 'var(--cc-card)', border: '0.5px solid var(--cc-border)', borderRadius: 'var(--cc-radius)', padding: '16px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--cc-gold)' }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--cc-gold-dim)', border: '1.5px solid var(--cc-gold-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, color: 'var(--cc-gold)' }}>JD</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500 }}>John Doe</div>
              <div style={{ fontSize: '11px', color: 'var(--cc-muted)' }}>@johndoe · Fitness</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: 'var(--cc-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>CloutCount Score</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: 'var(--cc-gold)' }}>142,420</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {[['City', '#12', 'Bentonville'], ['State', '#104', 'Arkansas'], ['Country', '#8,420', 'United States'], ['World', '#182K', 'Worldwide']].map(([label, rank, scope]) => (
            <div key={label} style={{ background: 'var(--cc-surface)', border: '0.5px solid var(--cc-border)', borderRadius: 'var(--cc-radius-sm)', padding: '10px' }}>
              <div style={{ fontSize: '9px', color: 'var(--cc-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '3px' }}>{label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: 'var(--cc-gold)' }}>{rank}</div>
              <div style={{ fontSize: '10px', color: 'var(--cc-muted)', marginTop: '2px' }}>{scope}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ padding: '0 20px 32px' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cc-gold)', marginBottom: '6px' }}>How it works</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, marginBottom: '20px' }}>Your rank in 3 steps.</h2>
        {[
          ['1', 'Create your profile', 'Sign up free. Add your name, location, and niche.'],
          ['2', 'Add your socials', 'Paste your profile URLs. Paid platform subscribers count double.'],
          ['3', 'See your rank live', 'Get your CloutCount Score instantly. Track movement daily, weekly, and monthly.'],
        ].map(([num, title, desc]) => (
          <div key={num} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--cc-gold-dim)', border: '0.5px solid var(--cc-gold-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 800, color: 'var(--cc-gold)', flexShrink: 0 }}>{num}</div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, marginBottom: '3px' }}>{title}</div>
              <div style={{ fontSize: '12px', color: 'var(--cc-muted)', lineHeight: 1.5 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* LEADERBOARD PREVIEW */}
      <div style={{ padding: '0 20px 32px' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cc-gold)', marginBottom: '6px' }}>Leaderboard</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, marginBottom: '16px' }}>See how you stack up.</h2>
        <div style={{ display: 'flex', background: 'var(--cc-surface)', border: '0.5px solid var(--cc-border)', borderRadius: 'var(--cc-radius-pill)', padding: '3px', gap: '2px', marginBottom: '12px' }}>
          {['city', 'state', 'country', 'world'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, background: activeTab === tab ? 'var(--cc-gold)' : 'transparent', color: activeTab === tab ? 'var(--cc-black)' : 'var(--cc-muted)', border: 'none', borderRadius: 'var(--cc-radius-pill)', fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700, padding: '7px 4px', textTransform: 'uppercase', letterSpacing: '0.04em', cursor: 'pointer' }}>{tab}</button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {leaderboard.map((u, i) => (
            <div key={u.rank} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--cc-card)', border: '0.5px solid var(--cc-border)', borderRadius: 'var(--cc-radius-sm)', padding: '10px 12px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, color: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : '#CD7F32', width: '24px', textAlign: 'center' }}>#{u.rank}</div>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--cc-surface)', border: '1px solid var(--cc-border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, color: 'var(--cc-gold)', flexShrink: 0 }}>{u.initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 500 }}>{u.name}</div>
                <div style={{ fontSize: '10px', color: 'var(--cc-muted)' }}>{u.niche} · {u.location}</div>
              </div>
              <span style={{ fontSize: '10px', fontWeight: 500, padding: '2px 7px', borderRadius: 'var(--cc-radius-pill)', background: u.dir === 'up' ? 'var(--cc-green-dim)' : 'var(--cc-red-dim)', color: u.dir === 'up' ? 'var(--cc-green)' : 'var(--cc-red)' }}>{u.dir === 'up' ? '▲' : '▼'} {Math.abs(parseInt(u.move))}</span>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700, color: 'var(--cc-gold)' }}>{u.score.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PRICING */}
      <div style={{ padding: '0 20px 32px' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cc-gold)', marginBottom: '6px' }}>Pricing</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, marginBottom: '16px' }}>Start free. Unlock more.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {[
            { name: 'Free', price: '$0', features: ['Browse leaderboards', 'See your rank'], locked: ['No profile', 'No history'], btn: 'Start Free', href: '/signup', style: {} },
            { name: 'Basic', price: '$1/mo', features: ['Full profile', 'Live ranking', 'Movement tracking', 'Verified badge'], locked: [], btn: 'Upgrade', href: '/signup', featured: true },
            { name: 'Premium', price: '$2/mo', features: ['Everything in Basic', 'Full history', 'Who passed you', 'Watchlists'], locked: [], btn: 'Upgrade', href: '/signup' },
          ].map(plan => (
            <div key={plan.name} style={{ background: 'var(--cc-card)', border: `${plan.featured ? '1px solid var(--cc-gold)' : '0.5px solid var(--cc-border)'}`, borderRadius: 'var(--cc-radius)', padding: '14px 10px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
              {plan.featured && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--cc-gold)' }}></div>}
              <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--cc-muted)', marginBottom: '4px' }}>{plan.name}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>{plan.price}</div>
              <div style={{ height: '0.5px', background: 'var(--cc-border)', margin: '8px 0' }}></div>
              {plan.features.map(f => <div key={f} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', marginTop: '5px', paddingLeft: '12px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, top: '5px', width: '5px', height: '5px', borderRadius: '50%', background: 'var(--cc-green)', display: 'inline-block' }}></span>{f}</div>)}
              {plan.locked?.map(f => <div key={f} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginTop: '5px', paddingLeft: '12px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, top: '5px', width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(255,255,255,0.12)', display: 'inline-block' }}></span>{f}</div>)}
              <div style={{ flex: 1 }}></div>
              <Link href={plan.href} style={{ display: 'block', textAlign: 'center', background: plan.featured ? 'var(--cc-gold)' : 'transparent', color: plan.featured ? 'var(--cc-black)' : 'var(--cc-muted)', border: plan.featured ? 'none' : '0.5px solid var(--cc-border-strong)', borderRadius: 'var(--cc-radius-pill)', fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700, padding: '9px 6px', marginTop: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{plan.btn}</Link>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div style={{ padding: '0 20px 40px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>Ready to see your rank?</h2>
        <p style={{ fontSize: '13px', color: 'var(--cc-muted)', marginBottom: '20px' }}>Join thousands of creators tracking their social influence in real time.</p>
        <Link href="/signup" style={{ display: 'inline-block', background: 'var(--cc-gold)', color: 'var(--cc-black)', border: 'none', borderRadius: 'var(--cc-radius-pill)', fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 800, padding: '14px 32px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Claim Your Rank — It&apos;s Free</Link>
      </div>

      {/* FOOTER */}
      <footer style={{ padding: '24px 20px', borderTop: '0.5px solid var(--cc-border)', background: 'var(--cc-surface)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800, color: 'var(--cc-gold)', marginBottom: '8px' }}>CloutCount</div>
        <div style={{ fontSize: '12px', color: 'var(--cc-muted)', marginBottom: '16px' }}>The world&apos;s social influence leaderboard.</div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {['About', 'Leaderboard', 'Pricing', 'Terms', 'Privacy', 'Contact'].map(link => (
            <Link key={link} href={`/${link.toLowerCase()}`} style={{ fontSize: '11px', color: 'var(--cc-muted)' }}>{link}</Link>
          ))}
        </div>
        <div style={{ marginTop: '16px', fontSize: '10px', color: 'rgba(255,255,255,0.2)' }}>© 2026 CloutCount. All rights reserved.</div>
      </footer>

    </div>
  )
}