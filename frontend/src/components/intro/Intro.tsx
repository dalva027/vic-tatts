import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { site } from '../../data/site'
import { colors, fonts } from '../../theme/tokens'
import { INK_BLEED, INTRO_DURATION } from './introAnimations'

const CLOSE_MS = 720

interface IntroProps {
  onDone: () => void
  tagline?: string
}

/**
 * Ink-bleed entrance overlay. "El Victtor's Tattoo" bleeds into focus, then a
 * pulsing CTA reveals once the wash settles.
 */
export function Intro({ onDone, tagline = site.tagline }: IntroProps) {
  const [introReady, setIntroReady] = useState(false)
  const [closing, setClosing] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Reveal the CTA once the bleed has settled.
  useEffect(() => {
    const t = setTimeout(() => setIntroReady(true), INTRO_DURATION)
    return () => clearTimeout(t)
  }, [])

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current)
    },
    [],
  )

  const enter = () => {
    if (closing) return
    setClosing(true)
    closeTimer.current = setTimeout(onDone, CLOSE_MS)
  }

  const overlay: CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 100,
    backgroundColor: '#0a0806',
    backgroundImage: 'radial-gradient(ellipse at 50% 42%,#1a1411,#070605 72%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity .7s ease',
    opacity: closing ? 0 : 1,
    pointerEvents: closing ? 'none' : 'auto',
  }

  // Shared per-word styling. The hidden "sizer" span fixes a stable, single
  // line box (white-space:nowrap keeps "El Victtor's" on one line) while the
  // absolute ink span bleeds within it.
  const wordSmall: CSSProperties = {
    fontFamily: fonts.display,
    fontSize: 'clamp(40px,9vw,108px)',
    lineHeight: 0.9,
    letterSpacing: 1,
    whiteSpace: 'nowrap',
  }
  const wordBig: CSSProperties = {
    fontFamily: fonts.display,
    fontSize: 'clamp(78px,19vw,232px)',
    lineHeight: 0.86,
    letterSpacing: 1,
    whiteSpace: 'nowrap',
  }
  const sizer: CSSProperties = { display: 'block', color: 'transparent', opacity: 0 }
  const inkBase: CSSProperties = { position: 'absolute', left: 0, top: 0, color: colors.red }

  return (
    <div style={overlay}>
      <button
        type="button"
        onClick={enter}
        className="btn-ghost"
        style={{
          position: 'absolute',
          top: 22,
          right: 26,
          fontSize: 11,
          letterSpacing: '.24em',
          textTransform: 'uppercase',
          padding: '9px 16px',
        }}
      >
        Skip ✕
      </button>

      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {/* ink-bleed wash */}
        <div
          style={{
            position: 'absolute',
            inset: '-12% -8%',
            background:
              'radial-gradient(ellipse,rgba(194,14,38,.5),transparent 65%)',
            filter: 'blur(20px)',
            zIndex: 0,
            animation: INK_BLEED.bleed,
          }}
        />

        {/* El Victtor's */}
        <div style={{ position: 'relative', display: 'inline-block', zIndex: 1 }}>
          <span style={{ ...wordSmall, ...sizer }}>{site.name}</span>
          <span
            style={{
              ...wordSmall,
              ...inkBase,
              textShadow: '0 2px 0 #5c0712',
              animation: INK_BLEED.ink1,
            }}
          >
            {site.name}
          </span>
        </div>

        {/* Tattoo */}
        <div style={{ position: 'relative', display: 'inline-block', zIndex: 1 }}>
          <span style={{ ...wordBig, ...sizer }}>Tattoo</span>
          <span
            style={{
              ...wordBig,
              ...inkBase,
              textShadow: '0 3px 0 #5c0712,0 0 36px rgba(194,14,38,.4)',
              animation: INK_BLEED.ink2,
            }}
          >
            Tattoo
          </span>
        </div>
      </div>

      {/* tagline + CTA, revealed once the bleed finishes */}
      <div
        style={{
          position: 'relative',
          marginTop: 30,
          textAlign: 'center',
          transition: 'opacity .6s ease',
          opacity: introReady ? 1 : 0,
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 12,
            letterSpacing: '.4em',
            color: colors.muted2,
            textTransform: 'uppercase',
            marginBottom: 22,
          }}
        >
          {tagline}
        </div>
        <button
          type="button"
          onClick={enter}
          style={{
            padding: '15px 40px',
            background: colors.red,
            color: colors.bg,
            fontWeight: 600,
            fontSize: 14,
            letterSpacing: '.26em',
            textTransform: 'uppercase',
            border: 'none',
            cursor: 'pointer',
            animation: 'pulseBtn 2.2s ease-out infinite',
          }}
        >
          Enter the Shop →
        </button>
      </div>
    </div>
  )
}
