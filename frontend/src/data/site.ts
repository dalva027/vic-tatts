/**
 * Site content for El Victtor's Tattoo.
 *
 * Kept separate from the components so copy, links and gallery layout can be
 * edited (or, later, served from a CMS / API) without touching markup.
 */

export const site = {
  name: "El Victtor's",
  fullName: "El Victtor's Tattoo",
  tagline: 'Traditional · Blackwork · Flash',
  heroLine:
    'bold lines, solid black, work that ages well. By appointment in the chair.',
  igUrl: 'https://www.instagram.com/elvicttors.tattoo/',
  igHandle: '@elvicttors.tattoo',
  showGrain: true,
  marquee: [
    'Blackwork',
    'Traditional',
    'Flash',
    'Lettering',
    'Cover-ups',
    'Fine Line',
  ],
  hours: [
    { label: 'Hours', value: 'Tue–Sat · 12–8pm', muted: false },
    { label: 'Walk-ins', value: 'Fri & Sat · flash only', muted: false },
    
  ],
  styles: [
    'Traditional',
    'Blackwork',
    'Fine line',
    'Lettering',
    'Flash piece',
    'Cover-up',
    'Custom',
  ],
  copyright: "© 2026 El Victtor's Tattoo — all designs reserved.",
  legal: 'Must be 18+ with valid ID. Deposits non-refundable.',
} as const

export interface WorkItem {
  id: string
  title: string
  number: string
  placeholder: string
  /** CSS grid-column value, e.g. 'span 2'. */
  col: string
  /** CSS grid-row value, e.g. 'span 2'. */
  row: string
}

export const workItems: WorkItem[] = [
  { id: 'work-1', title: 'Anubis', number: '01', placeholder: 'traditional rose // drop photo', col: 'span 2', row: 'span 2' },
  { id: 'work-2', title: 'Lettering',    number: '02', placeholder: 'swallow flash // drop photo',    col: 'span 2', row: 'span 1' },
  { id: 'work-3', title: 'Dagger & Eye',   number: '03', placeholder: 'dagger // drop photo',           col: 'span 1', row: 'span 1' },
  { id: 'work-4', title: 'Fine Line',        number: '04', placeholder: 'lettering // drop photo',        col: 'span 1', row: 'span 1' },
  { id: 'work-5', title: 'Traditional', number: '05', placeholder: 'blackwork sleeve // drop photo', col: 'span 1', row: 'span 2' },
  { id: 'work-6', title: 'Color',   number: '06', placeholder: 'eagle // drop photo',            col: 'span 1', row: 'span 1' },
  { id: 'work-7', title: '11:11',          number: '07', placeholder: 'panther // drop photo',          col: 'span 2', row: 'span 2' },
  { id: 'work-8', title: 'Texas',           number: '08', placeholder: 'anchor // drop photo',           col: 'span 1', row: 'span 1' },
]

export const instagramSlots = [
  { id: 'ig-1', placeholder: 'post 1' },
  { id: 'ig-2', placeholder: 'post 2' },
  { id: 'ig-3', placeholder: 'post 3' },
  { id: 'ig-4', placeholder: 'post 4' },
  { id: 'ig-5', placeholder: 'post 5' },
]
