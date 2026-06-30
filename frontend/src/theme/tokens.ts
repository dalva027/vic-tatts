/**
 * Design tokens for El Victtor's Tattoo.
 *
 * Centralised here so the look stays consistent as this grows into a
 * multi-page platform. Components reference `colors` / `fonts` for the
 * recurring values; one-off shades are kept inline at their call site.
 */

export const colors = {
  /** Page background — near-black, warm. */
  bg: '#0a0908',
  /** Slightly lifted background for alternating sections. */
  bgAlt: '#0d0b0a',
  /** Darker inset background (inputs, deep panels). */
  bgInset: '#120f0d',
  /** Primary body text. */
  ink: '#d8d2c4',
  /** Brightest cream — headings / emphasis. */
  cream: '#e8e2d6',
  /** Signature red. */
  red: '#c20e26',
  /** Deep red used for the engraved drop-shadow. */
  redDark: '#5c0712',
  /** Hot red used for the needle tip glow. */
  redHot: '#ff2a3d',
  /** Muted greys for secondary copy, in descending brightness. */
  muted: '#b0a89b',
  muted2: '#9a9286',
  muted3: '#8c8479',
  muted4: '#7a736a',
  muted5: '#6a635a',
  muted6: '#5e574e',
  /** Hairline border on dark. */
  line: 'rgba(216,210,196,.1)',
} as const

export const fonts = {
  /** Display / headline face. */
  display: "'Pirata One', serif",
  /** Body / UI face. */
  body: "'Oswald', sans-serif",
  /** Typewriter accent for labels and captions. */
  mono: "'Special Elite', monospace",
  /** Blackletter — available for future flash / merch pages. */
  black: "'UnifrakturMaguntia', serif",
} as const

export type Colors = typeof colors
export type Fonts = typeof fonts
