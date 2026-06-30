import { type CSSProperties } from 'react'
import { workItems } from '../data/site'
import { colors, fonts } from '../theme/tokens'
import { ImageSlot } from './ImageSlot'

const HATCH =
  'repeating-linear-gradient(45deg,#100d0b,#100d0b 9px,#0c0a09 9px,#0c0a09 18px)'

const section: CSSProperties = {
  position: 'relative',
  padding: '90px 24px 100px',
  maxWidth: 1180,
  margin: '0 auto',
}

const head: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: 16,
  marginBottom: 34,
}

const eyebrow: CSSProperties = {
  fontFamily: fonts.mono,
  fontSize: 11,
  letterSpacing: '.4em',
  color: colors.red,
  textTransform: 'uppercase',
  marginBottom: 10,
}

const grid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4,1fr)',
  gridAutoRows: '185px',
  gap: 12,
  gridAutoFlow: 'dense',
}

const caption: CSSProperties = {
  position: 'absolute',
  left: 0,
  bottom: 0,
  right: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '11px 13px',
  background: 'linear-gradient(0deg,rgba(7,6,5,.92),transparent)',
  pointerEvents: 'none',
  zIndex: 2,
}

export function Work() {
  return (
    <section id="work" style={section}>
      <div style={head}>
        <div>
          <div style={eyebrow}>01 — The Portfolio</div>
          <h2
            style={{
              fontFamily: fonts.display,
              fontWeight: 400,
              fontSize: 'clamp(40px,7vw,76px)',
              lineHeight: 0.9,
              color: colors.cream,
            }}
          >
            Flash &amp;<br />
            Finished Pieces
          </h2>
        </div>
        <p
          style={{
            maxWidth: 340,
            fontSize: 13,
            lineHeight: 1.7,
            color: colors.muted3,
            fontFamily: fonts.mono,
          }}
        >
          // drag your photos straight onto the frames to build the gallery —
          they stick.
        </p>
      </div>

      <div className="work-grid" style={grid}>
        {workItems.map((item) => (
          <div
            key={item.id}
            style={{
              position: 'relative',
              gridColumn: item.col,
              gridRow: item.row,
              overflow: 'hidden',
              border: `1px solid ${colors.line}`,
              background: HATCH,
            }}
          >
            <ImageSlot id={item.id} placeholder={item.placeholder} shape="rect" />
            <div style={caption}>
              <span
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 13,
                  color: colors.ink,
                  letterSpacing: '.06em',
                }}
              >
                {item.title}
              </span>
              <span style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.red }}>
                {item.number}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
