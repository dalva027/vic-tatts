import { type CSSProperties } from 'react'
import { site } from '../data/site'
import { fonts } from '../theme/tokens'

const wrap: CSSProperties = {
  borderTop: '1px solid rgba(216,210,196,.1)',
  borderBottom: '1px solid rgba(216,210,196,.1)',
  background: '#0d0b0a',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  padding: '14px 0',
}

const track: CSSProperties = {
  display: 'inline-block',
  fontFamily: fonts.display,
  fontSize: 26,
  letterSpacing: 1,
  color: '#3a352e',
  animation: 'mq 22s linear infinite',
}

const SEP = '  ✦  '

export function Marquee() {
  // One segment, repeated so the -50% translate loops seamlessly.
  const segment = site.marquee.join(SEP) + SEP
  return (
    <div style={wrap} aria-hidden>
      <div style={track}>
        {segment}
        {segment}
      </div>
    </div>
  )
}
