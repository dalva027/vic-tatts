import { type CSSProperties } from 'react'
import { site } from '../data/site'
import { colors, fonts } from '../theme/tokens'

// Served from /public.
const logo = '/logo.jpg'

const footer: CSSProperties = {
  borderTop: '1px solid rgba(216,210,196,.1)',
  background: colors.bgAlt,
  padding: '54px 24px 40px',
}

const top: CSSProperties = {
  maxWidth: 1100,
  margin: '0 auto',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 28,
}

const legalRow: CSSProperties = {
  maxWidth: 1100,
  margin: '34px auto 0',
  paddingTop: 18,
  borderTop: '1px solid rgba(216,210,196,.07)',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  gap: 10,
  fontSize: 11,
  color: colors.muted6,
  fontFamily: fonts.mono,
  letterSpacing: '.08em',
}

export function Footer() {
  return (
    <footer style={footer}>
      <div style={top}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <img
            src={logo}
            alt={site.fullName}
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              border: `1.5px solid ${colors.red}`,
              objectFit: 'cover',
            }}
          />
          <div>
            <div
              style={{
                fontFamily: fonts.display,
                fontSize: 30,
                color: colors.cream,
                lineHeight: 0.95,
              }}
            >
              {site.fullName}
            </div>
            <div
              style={{
                fontFamily: fonts.mono,
                fontSize: 11,
                letterSpacing: '.25em',
                color: colors.muted4,
                textTransform: 'uppercase',
                marginTop: 4,
              }}
            >
              Traditional · Blackwork · Flash
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 26,
            fontSize: 12,
            letterSpacing: '.22em',
            textTransform: 'uppercase',
          }}
        >
          <a href="#work" className="lnk-foot">
            Work
          </a>
          <a href="#book" className="lnk-foot">
            Book
          </a>
          <a href={site.igUrl} target="_blank" rel="noreferrer" className="lnk-foot">
            Instagram
          </a>
        </div>
      </div>
      <div style={legalRow}>
        <span>{site.copyright}</span>
        <span>{site.legal}</span>
      </div>
    </footer>
  )
}
