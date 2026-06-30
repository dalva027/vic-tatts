import { type CSSProperties } from 'react'
import { site } from '../data/site'
import { colors, fonts } from '../theme/tokens'

// Served from /public.
const logo = '/logo.jpg'

const section: CSSProperties = {
  position: 'relative',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding: '120px 24px 70px',
  overflow: 'hidden',
}

const tick: CSSProperties = { width: 34, height: 1, background: colors.red }

export function Hero() {
  return (
    <section style={section}>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 30%,rgba(125,10,24,.22),transparent 55%)',
        }}
      />
      <img
        src={logo}
        alt=""
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 'min(78vw,720px)',
          opacity: 0.05,
          filter: 'grayscale(1) contrast(1.2)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          fontFamily: fonts.mono,
          fontSize: 12,
          letterSpacing: '.42em',
          color: colors.muted2,
          textTransform: 'uppercase',
          marginBottom: 22,
        }}
      >
        <span style={tick} />
        Est. · Traditional Tattoo
        <span style={tick} />
      </div>

      <h1
        style={{
          position: 'relative',
          fontFamily: fonts.display,
          fontWeight: 400,
          lineHeight: 0.82,
          letterSpacing: 1,
          margin: 0,
        }}
      >
        <span
          style={{
            display: 'block',
            fontSize: 'clamp(34px,7vw,86px)',
            color: colors.cream,
          }}
        >
          {site.name}
        </span>
        <span
          style={{
            display: 'block',
            fontSize: 'clamp(70px,17vw,210px)',
            color: colors.red,
            textShadow: '0 3px 0 #5c0712,0 0 40px rgba(194,14,38,.35)',
          }}
        >
          Tattoo
        </span>
      </h1>

      <p
        style={{
          position: 'relative',
          maxWidth: 560,
          margin: '30px auto 0',
          fontSize: 17,
          lineHeight: 1.6,
          color: colors.muted,
          fontWeight: 300,
        }}
      >
        {site.tagline} — {site.heroLine}
      </p>

      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 14,
          justifyContent: 'center',
          marginTop: 38,
        }}
      >
        <a
          href="#book"
          className="btn-fill"
          style={{
            padding: '15px 32px',
            fontWeight: 600,
            fontSize: 14,
            letterSpacing: '.2em',
            textTransform: 'uppercase',
          }}
        >
          Book a Session
        </a>
        <a
          href="#work"
          className="btn-outline"
          style={{
            padding: '15px 32px',
            fontWeight: 500,
            fontSize: 14,
            letterSpacing: '.2em',
            textTransform: 'uppercase',
          }}
        >
          View the Work
        </a>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 26,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          fontFamily: fonts.mono,
          fontSize: 10,
          letterSpacing: '.3em',
          color: colors.muted4,
          textTransform: 'uppercase',
        }}
      >
        Scroll
        <span
          style={{
            fontSize: 18,
            color: colors.red,
            animation: 'cue 1.6s ease-in-out infinite',
          }}
        >
          ↓
        </span>
      </div>
    </section>
  )
}
