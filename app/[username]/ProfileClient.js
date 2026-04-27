'use client'
import { useState } from 'react'

export default function ProfileClient({ profile }) {
  const [copied, setCopied] = useState(false)
  const profileUrl = `https://cloutcount.com/${profile.username}`
  const shareText = `Check out ${profile.display_name}'s CloutCount Score: ${(profile.cloutcount_score || 0).toLocaleString()}`

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = profileUrl
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function shareOnX() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(profileUrl)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  function shareNative() {
    if (navigator.share) {
      navigator.share({
        title: `${profile.display_name} on CloutCount`,
        text: shareText,
        url: profileUrl,
      }).catch(() => {})
    } else {
      copyLink()
    }
  }

  const btn = {
    flex: 1,
    background: 'transparent',
    color: 'var(--cc-white)',
    border: '0.5px solid var(--cc-border-strong)',
    borderRadius: 'var(--cc-radius-pill)',
    fontFamily: 'var(--font-display)',
    fontSize: '11px',
    fontWeight: 700,
    padding: '12px 8px',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  }

  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
      <button onClick={copyLink} style={{ ...btn, background: copied ? 'var(--cc-gold)' : 'transparent', color: copied ? 'var(--cc-black)' : 'var(--cc-white)', borderColor: copied ? 'var(--cc-gold)' : 'var(--cc-border-strong)' }}>
        {copied ? '✓ Copied' : '⎘ Copy Link'}
      </button>
      <button onClick={shareOnX} style={btn}>
        Share on X
      </button>
      <button onClick={shareNative} style={btn}>
        ⇪ Share
      </button>
    </div>
  )
}