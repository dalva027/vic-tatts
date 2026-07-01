import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { site } from '../data/site'
import { fonts } from '../theme/tokens'

const SEP = '  ✦  '
// Seconds to scroll one segment's width — keeps the speed constant at any size.
const PER_SEGMENT_SECONDS = 22

const wrap: CSSProperties = {
  position: 'relative',
  borderTop: '1px solid rgba(216,210,196,.1)',
  borderBottom: '1px solid rgba(216,210,196,.1)',
  background: '#0d0b0a',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  padding: '14px 0',
}

const text: CSSProperties = {
  fontFamily: fonts.display,
  fontSize: 26,
  letterSpacing: 1,
  color: '#3a352e',
}

const track: CSSProperties = {
  ...text,
  display: 'inline-block',
  willChange: 'transform',
}

// Off-screen copy of a single segment, used to measure its rendered width.
const probe: CSSProperties = {
  ...text,
  position: 'absolute',
  top: 0,
  left: 0,
  visibility: 'hidden',
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
}

export function Marquee() {
  const segment = site.marquee.join(SEP) + SEP
  const wrapRef = useRef<HTMLDivElement>(null)
  const probeRef = useRef<HTMLSpanElement>(null)
  const [copies, setCopies] = useState(2)

  // Repeat the segment enough to overflow the viewport, so each of the two
  // duplicated halves fully covers it. Without this, wide screens reveal the
  // track's end and a gap before it snaps back at the -50% loop point.
  useLayoutEffect(() => {
    const wrapEl = wrapRef.current
    const probeEl = probeRef.current
    if (!wrapEl || !probeEl) return
    const measure = () => {
      const segW = probeEl.getBoundingClientRect().width
      const wrapW = wrapEl.getBoundingClientRect().width
      if (segW > 0) setCopies(Math.max(2, Math.ceil(wrapW / segW) + 1))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(wrapEl)
    ro.observe(probeEl) // re-measure once the display font finishes loading
    return () => ro.disconnect()
  }, [segment])

  // Two identical halves back to back → translateX(-50%) loops seamlessly.
  const half = segment.repeat(copies)
  const duration = copies * PER_SEGMENT_SECONDS

  return (
    <div style={wrap} aria-hidden ref={wrapRef}>
      <div style={{ ...track, animation: `mq ${duration}s linear infinite` }}>
        {half}
        {half}
      </div>
      <span ref={probeRef} style={probe}>
        {segment}
      </span>
    </div>
  )
}
