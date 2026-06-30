# El Victtor's Tattoo — Frontend

The web frontend for El Victtor's Tattoo, built with **React + TypeScript + Vite**.
This is the root of what will grow into a larger platform, so the code is
organised for reuse rather than as a single page dump.

## Stack

- React 18 + TypeScript
- Vite 5 (dev server, build, HMR)
- Plain CSS for the global base / keyframes; typed inline style objects for
  component layout. Design tokens live in `src/theme/tokens.ts`.

## Getting started

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
```

Other scripts:

```bash
npm run build    # type-check (tsc -b) + production build to dist/
npm run preview  # serve the production build locally
npm run lint     # type-check only
```

## What's here

| Area | Notes |
| --- | --- |
| **Intro overlay** | **Ink Bleed** entrance animation — "El Victtor's Tattoo" blurs and bleeds into focus behind a radial red wash, then a pulsing CTA reveals. See `src/components/intro/`. |
| **Hero / Marquee** | Animated headline, scroll cue and a looping discipline marquee. |
| **Work gallery** | Drag a photo onto any frame (or click to browse) — it downscales and persists via `localStorage`. See `src/components/ImageSlot.tsx`. |
| **Booking form** | Client-side validated consultation request with a success state. The submit handler is the seam for a real backend / Instagram webhook. |
| **Instagram grid + footer** | Same drag-drop slots for the feed. |
| **Grain + vignette** | Fixed film-grain and vignette overlays for the film-stock look. |

## Project layout

```
frontend/
├── index.html              # Vite entry, Google Fonts
├── public/logo.jpg         # Shop mark (favicon + nav/hero/footer)
└── src/
    ├── main.tsx            # React root
    ├── App.tsx             # Page composition + intro gating
    ├── styles/global.css   # Reset, keyframes, hover/focus utilities, responsive
    ├── theme/tokens.ts      # Colour + font tokens
    ├── data/site.ts        # Copy, links, gallery + form config
    ├── hooks/useImageSlot.ts
    └── components/         # Navbar, Hero, Marquee, Work, BookingForm,
                            # InstagramFeed, Footer, Grain, ImageSlot, intro/
```

## Notes for the platform

- **Content** is centralised in `src/data/site.ts` — copy, links and gallery
  layout can change without touching markup.
- **Dropped images** persist in `localStorage` today; `useImageSlot` is the
  single place to swap in a real upload/CDN backend.
- **Booking submissions** currently resolve to a local success state; wire the
  `onSubmit` handler in `BookingForm.tsx` to your API.
- Honours `prefers-reduced-motion`.

Fonts (Oswald, Pirata One, Special Elite, UnifrakturMaguntia) load from Google
Fonts; the original standalone export bundled them as woff2 for offline use.
