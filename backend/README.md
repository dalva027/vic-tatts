# El Victtor's Tattoo — Booking API

A small Express + TypeScript service with one job: when someone submits the
booking form on the site, text the shop owner the customer's details so they can
follow up on Instagram or by phone. SMS is sent through the
[textbee.dev](https://app.textbee.dev/dashboard) Android gateway.

No database and no auth — a booking request is validated and turned straight
into an SMS.

## Setup

```bash
npm install
cp .env.example .env   # then fill in the values
npm run dev
```

The server runs on `http://localhost:4000` by default.

## Environment variables

- `PORT` — server port (default `4000`)
- `CORS_ORIGIN` — the frontend origin allowed to call the API (default
  `http://localhost:5173`)
- `BUSINESS_PHONE` — the shop owner's phone (E.164, e.g. `+15125550123`) that
  receives new-booking texts
- `TEXTBEE_DEVICE_ID` / `TEXTBEE_API_KEY` — textbee.dev credentials. **Leave
  both blank to log SMS previews to the console instead of sending** — handy for
  local development.

## API

- `GET /health` — health check
- `POST /api/bookings` — validate a consultation request and text the owner

### `POST /api/bookings` body

```json
{
  "name": "Jane Doe",
  "instagram": "@jane.doe",
  "phone": "+1 512 555 0123",
  "style": "Traditional",
  "placement": "forearm",
  "size": "palm-sized",
  "date": "2026-08-01",
  "idea": "A traditional rose with fine linework."
}
```

`name`, `instagram`, `phone`, and `idea` are required. `instagram` accepts an
optional leading `@` and allows letters, digits, `.` and `_`. `phone` must
contain at least 10 digits. Everything else is optional.

Success returns `201 { "ok": true }`. Validation errors return
`400 { "error": "Validation failed", "details": [...] }`.
