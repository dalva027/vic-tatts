import { type CSSProperties } from 'react'
import { instagramSlots, site } from '../data/site'
import { colors, fonts } from '../theme/tokens'
import { ImageSlot } from './ImageSlot'

const HATCH =
  'repeating-linear-gradient(45deg,#100d0b,#100d0b 9px,#0c0a09 9px,#0c0a09 18px)'

const section: CSSProperties = {
  padding: '90px 24px 100px',
  maxWidth: 1180,
  margin: '0 auto',
}

const grid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(5,1fr)',
  gap: 12,
}

export function InstagramFeed() {
  return (
    <section id="follow" style={section}>
      <div style={{ textAlign: 'center', marginBottom: 38 }}>
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 11,
            letterSpacing: '.4em',
            color: colors.red,
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          03 — The Feed
        </div>
        <a
          href={site.igUrl}
          target="_blank"
          rel="noreferrer"
          className="lnk-heading"
          style={{
            fontFamily: fonts.display,
            fontSize: 'clamp(34px,6vw,60px)',
          }}
        >
          {site.igHandle}
        </a>
      </div>

      <div className="ig-grid" style={grid}>
        {instagramSlots.map((slot) => (
          <div
            key={slot.id}
            style={{
              position: 'relative',
              aspectRatio: '1 / 1',
              overflow: 'hidden',
              border: `1px solid ${colors.line}`,
              background: HATCH,
            }}
          >
            <ImageSlot id={slot.id} placeholder={slot.placeholder} shape="rect" />
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 36 }}>
        <a
          href={site.igUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-outline-red"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '15px 34px',
            fontSize: 14,
            letterSpacing: '.2em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          Follow on Instagram →
        </a>
      </div>
    </section>
  )
}
