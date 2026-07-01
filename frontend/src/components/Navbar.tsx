import { type CSSProperties } from 'react'
import { site } from '../data/site'
import { colors, fonts } from '../theme/tokens'

// Served from /public.
const logo = '/logo.jpg'

const nav: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 50,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 30px',
  background:
    'linear-gradient(180deg,rgba(10,9,8,.92),rgba(10,9,8,.55) 70%,transparent)',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  borderBottom: '1px solid rgba(216,210,196,.07)',
}

const brand: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
}

const logoImg: CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: '50%',
  border: `1.5px solid ${colors.red}`,
  objectFit: 'cover',
}

const linkRow: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 30,
  fontSize: 13,
  letterSpacing: '.22em',
  textTransform: 'uppercase',
}

export function Navbar() {
  return (
    <nav style={nav}>
      <a href="#top" style={brand}>
        <img src={logo} alt={site.fullName} style={logoImg} />
        <span
          style={{
            fontFamily: fonts.display,
            fontSize: 22,
            letterSpacing: '.5px',
            color: colors.cream,
            lineHeight: 1,
          }}
        >
          {site.fullName}
        </span>
      </a>
      <div className="nav-links" style={linkRow}>
        <a href="#work" className="lnk nav-text">
          Work
        </a>
        <a href="#book" className="lnk nav-text">
          Book
        </a>
        <a
          href={site.igUrl}
          target="_blank"
          rel="noreferrer"
          className="lnk nav-text"
        >
          Instagram
        </a>
        <a
          href="#book"
          className="btn-fill"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '9px 18px',
            fontWeight: 600,
            letterSpacing: '.18em',
          }}
        >
          Get Inked
        </a>
      </div>
    </nav>
  )
}
