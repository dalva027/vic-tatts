/**
 * Ink-bleed intro animation config.
 *
 * The two words start blurred and over-spaced with a red glow, then bleed
 * into sharp focus while a radial ink wash blooms behind them.
 */
export const INK_BLEED = {
  /** "El Victtor's" bleeds in first. */
  ink1: 'ib-ink 1.6s ease .4s both',
  /** "Tattoo" follows. */
  ink2: 'ib-ink 1.6s ease 1.7s both',
  /** Radial red wash behind the wordmark. */
  bleed: 'ib-bleed 2.6s ease .3s both',
} as const

/** How long the bleed runs before the "Enter the Shop" CTA reveals (ms). */
export const INTRO_DURATION = 3500
