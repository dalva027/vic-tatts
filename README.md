# El Victtor's Tattoo

The official web platform for **El Victtor's Tattoo** — a single-page studio site with an animated portfolio, a consultation booking flow, and a lightweight API that texts new booking requests straight to the shop owner's phone.

> Traditional · Blackwork · Flash

---

## The Business

El Victtor's is an appointment-based tattoo studio specializing in work that ages well: bold lines, solid black, and clean traditional pieces.

- **Disciplines:** Traditional, Blackwork, Fine Line, Lettering, Flash, Cover-ups, and fully custom work.
- **Hours:** Tuesday–Saturday, 12–8pm. Work is done by appointment in the chair.
- **Walk-ins:** Friday & Saturday, flash designs only.
- **Booking model:** Clients submit a consultation request (idea, style, placement, size, preferred date) through the site. The artist follows up personally by text or Instagram within 48 hours to talk through the design and set a deposit.
- **Instagram:** [@elvicttors.tattoo](https://www.instagram.com/elvicttors.tattoo/) — the studio's primary channel for portfolio updates and client communication.
- **Policies:** Clients must be 18+ with valid ID. Deposits are non-refundable. All designs reserved.

The site is deliberately low-friction for the client and low-overhead for the artist: no accounts, no scheduling engine, no dashboard. A request comes in, the owner gets a text, and the conversation moves to where the studio already lives — text and Instagram.

## How It Works

```
Visitor fills the consultation form
        │
        ▼
React frontend (client-side validation)
        │  POST /api/bookings
        ▼
Express API (Zod validation + rate limiting)
        │
        ▼
textbee.dev Android SMS gateway
        │
        ▼
Shop owner's phone — formatted text with the client's
name, idea, style, placement, size, date, IG handle & phone
```

## Repository Layout

```
vic-tatts/
├── frontend/   # React + TypeScript + Vite single-page site
│   ├── src/
│   │   ├── components/    # Navbar, Hero, Marquee, Work, BookingForm,
│   │   │                  # InstagramFeed, Lightbox, Footer, Grain, intro/
│   │   ├── data/site.ts   # All copy, links, hours & gallery config
│   │   ├── theme/         # Color + font tokens
│   │   └── hooks/         # useImageSlot (gallery image store)
│   ├── plugins/           # Dev-only Vite plugin (gallery image persistence)
│   └── public/uploads/    # Committed portfolio images + manifest.json
└── backend/    # Express + TypeScript booking API
    ├── src/
    │   ├── routes/bookings.ts   # POST /api/bookings
    │   └── services/sms.ts      # textbee.dev SMS integration
    └── api/index.ts             # Vercel serverless entry point
```

## Tech Stack

### Frontend (`frontend/`)

| | |
| --- | --- |
| **Framework** | React 18 + TypeScript 5 |
| **Build tooling** | Vite 5 (`@vitejs/plugin-react`, esbuild/Rollup under the hood) |
| **Styling** | Plain CSS for the global base, keyframes and responsive rules; typed inline style objects for component layout; design tokens centralized in `src/theme/tokens.ts` |
| **Fonts** | Oswald, Pirata One, Special Elite, UnifrakturMaguntia (Google Fonts) |
| **State** | Local React state + `useSyncExternalStore` for the shared gallery manifest — no state library |

### Backend (`backend/`)

| | |
| --- | --- |
| **Runtime** | Node.js, Express 5 + TypeScript 5 (CommonJS) |
| **Validation** | Zod schemas — strict field-level validation with friendly error details |
| **Abuse protection** | `express-rate-limit` (10 requests / 15 min per IP on the booking endpoint) |
| **SMS delivery** | [textbee.dev](https://textbee.dev) Android SMS gateway (REST) |
| **Cross-origin** | `cors` locked to the configured frontend origin |

### Deployment

Both halves deploy to **Vercel**. The backend runs as a single serverless function: `api/index.ts` re-exports the Express app (an Express app is itself a `(req, res)` handler) and a `vercel.json` rewrite routes every request through it, letting Express do its own routing. The app detects the Vercel environment and skips binding a port there; locally it runs as a normal Node server. `trust proxy` is set so rate limiting sees real client IPs behind Vercel's proxy. The frontend ships as a fully static build — portfolio images and their manifest are committed assets, so the live site has no write surface at all.

## Features

### Site Experience

- **"Ink Bleed" intro** — an entrance overlay where the studio name blurs and bleeds into focus behind a radial red wash before revealing the CTA. Page scroll is locked while the overlay is up.
- **Hero + discipline marquee** — animated headline, scroll cue, and an infinite looping marquee of the studio's disciplines.
- **Portfolio grid** — an asymmetric CSS-grid gallery of numbered pieces with a lightbox for full-size viewing.
- **Instagram strip** — a five-slot feed row linking to the studio's Instagram.
- **Film-stock aesthetic** — fixed grain and vignette overlays (`Grain`) over a dark cream/red/ink palette.
- **Accessibility** — honours `prefers-reduced-motion`; focus/hover utilities in the global stylesheet.

### Booking Flow

- Consultation form capturing name, phone, optional Instagram handle, style (from the studio's discipline list), placement, approximate size, preferred date, and a free-text idea.
- **Double validation** — client-side checks for instant feedback (phone must have 10+ digits, IG handle format with or without `@`), mirrored server-side with Zod so the API is safe on its own.
- **Graceful success state** — a personalized confirmation panel that sets the expectation of a follow-up within 48 hours; failures fall back to pointing the client at text/Instagram.
- **Owner notification** — the API formats the request into a compact, skimmable SMS (style, placement, size, preferred date, contact details, idea) and delivers it through textbee.dev. Without gateway credentials configured, messages are logged as console previews so the whole flow can be exercised locally without a device.
- **Resilient by design** — rate-limited endpoint, SMS failures never fail the client's submission, and a missing owner phone number degrades to a logged warning.

### Content & Gallery Management

- **Centralized content** — all copy, hours, links, styles, and gallery layout live in `frontend/src/data/site.ts`, so the words can change (or later move to a CMS) without touching markup.
- **Developer-edited gallery** — during development, portfolio photos are dragged onto any frame (or picked via file dialog). Images are downscaled client-side to ≤1200px WebP, written to `public/uploads/` by a dev-only Vite plugin, and indexed in a committed `manifest.json`. The plugin serializes concurrent writes behind a lock, tidies stale files on replace, and is excluded from production builds — the live site reads the manifest with **no editing endpoint present**.

## API Surface

| Endpoint | Purpose |
| --- | --- |
| `GET /health` | Health check (`{ status: "ok", service: "vic-tattoo-api" }`) |
| `POST /api/bookings` | Validate a consultation request and text the owner. Returns `201 { ok: true }` on success, `400` with Zod details on validation failure. |

Required fields: `name`, `phone` (10+ digits), `idea`. Optional: `instagram` (leading `@` accepted and stripped), `style`, `placement`, `size`, `date`.

---

© 2026 El Victtor's Tattoo — all designs reserved.
