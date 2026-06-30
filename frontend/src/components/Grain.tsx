import { type CSSProperties } from 'react'

// Fractal-noise film grain, generated inline so there's no asset to ship.
const NOISE_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140">' +
  '<filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2"/></filter>' +
  '<rect width="100%" height="100%" filter="url(#n)"/></svg>'

const grainStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  pointerEvents: 'none',
  zIndex: 60,
  opacity: 0.5,
  mixBlendMode: 'overlay',
  backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(NOISE_SVG)}")`,
}

const vignetteStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  pointerEvents: 'none',
  zIndex: 59,
  background:
    'radial-gradient(ellipse at 50% 38%,transparent 40%,rgba(0,0,0,.55) 100%)',
}

export function Grain({ show = true }: { show?: boolean }) {
  return (
    <>
      {show && <div style={grainStyle} aria-hidden />}
      <div style={vignetteStyle} aria-hidden />
    </>
  )
}
