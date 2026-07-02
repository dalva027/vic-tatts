import {
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FormEvent,
} from 'react'
import { site } from '../data/site'
import { colors, fonts } from '../theme/tokens'

interface FormState {
  name: string
  instagram: string
  phone: string
  style: string
  placement: string
  size: string
  date: string
  idea: string
}

const EMPTY: FormState = {
  name: '',
  instagram: '',
  phone: '',
  style: 'Traditional',
  placement: '',
  size: '',
  date: '',
  idea: '',
}

// Resolve the booking API's base URL to an absolute http(s) origin.
//
// If VITE_API_BASE is a bare host ("api.example.com") or "host:port", fetch()
// treats the value's leading token as a custom URL scheme — which makes the
// browser pop up an "open an external app / access other apps on your device"
// prompt instead of sending the request. Forcing https:// (or same-origin when
// unset) guarantees a real HTTP request.
function resolveApiBase(): string {
  const raw = (import.meta.env.VITE_API_BASE ?? '').trim().replace(/\/+$/, '')
  if (raw) {
    return /^https?:\/\//i.test(raw) ? raw : `https://${raw.replace(/^\/+/, '')}`
  }
  // No override configured: localhost in dev, same-origin in production.
  return import.meta.env.DEV ? 'http://localhost:4000' : ''
}

const API_BASE = resolveApiBase()

// A phone we can actually text: allowed characters, and at least 10 digits.
const phoneOk = (v: string) =>
  /^\+?[\d\s\-().]+$/.test(v) && (v.match(/\d/g)?.length ?? 0) >= 10
// Instagram handle, with or without a leading @.
const instagramOk = (v: string) => /^@?[A-Za-z0-9._]{1,30}$/.test(v)

const section: CSSProperties = {
  position: 'relative',
  padding: '90px 24px 100px',
  background: colors.bgAlt,
  borderTop: '1px solid rgba(216,210,196,.08)',
}

const grid: CSSProperties = {
  maxWidth: 1100,
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: '0.85fr 1.15fr',
  gap: 54,
}

const eyebrow: CSSProperties = {
  fontFamily: fonts.mono,
  fontSize: 11,
  letterSpacing: '.4em',
  color: colors.red,
  textTransform: 'uppercase',
  marginBottom: 10,
}

const label: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 7,
  fontSize: 11,
  letterSpacing: '.18em',
  textTransform: 'uppercase',
  color: colors.muted3,
}

const infoRow: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '14px 16px',
  background: colors.bgAlt,
  fontSize: 13,
}

const infoKey: CSSProperties = {
  color: colors.muted3,
  letterSpacing: '.1em',
  textTransform: 'uppercase',
  fontSize: 11,
}

export function BookingForm() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submittedName, setSubmittedName] = useState('')

  const onField = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const name = form.name.trim()
    const instagram = form.instagram.trim()
    const phone = form.phone.trim()
    const idea = form.idea.trim()

    if (!name || !instagram || !phone || !idea) {
      setError('// name, Instagram, phone and the idea are required to send.')
      return
    }
    if (!instagramOk(instagram)) {
      setError('// enter a valid Instagram username (e.g. @yourhandle).')
      return
    }
    if (!phoneOk(phone)) {
      setError('// enter a valid phone number (at least 10 digits).')
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          instagram: instagram.replace(/^@+/, ''),
          phone,
          style: form.style,
          placement: form.placement.trim(),
          size: form.size.trim(),
          date: form.date,
          idea,
        }),
      })
      if (!res.ok) throw new Error('request failed')
      setSubmitted(true)
      setSubmittedName(', ' + name.split(' ')[0])
    } catch {
      setError('// could not send right now — try again, or DM me on Instagram.')
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setSubmitted(false)
    setError(null)
    setForm(EMPTY)
  }

  return (
    <section id="book" style={section}>
      <div className="book-grid" style={grid}>
        {/* Left — pitch + hours */}
        <div>
          <div style={eyebrow}>02 — Get Inked</div>
          <h2
            style={{
              fontFamily: fonts.display,
              fontWeight: 400,
              fontSize: 'clamp(40px,6vw,68px)',
              lineHeight: 0.9,
              color: colors.cream,
              marginBottom: 22,
            }}
          >
            Book the<br />
            Chair
          </h2>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.7,
              color: '#a9a194',
              fontWeight: 300,
              marginBottom: 30,
            }}
          >
            Tell me what you're after. Send a reference, a rough size and where
            it's going. I'll come back to you on Text or Instagram to lock the day and
            the deposit.
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              background: colors.line,
              border: `1px solid ${colors.line}`,
            }}
          >
            {site.hours.map((row) => (
              <div key={row.label} style={infoRow}>
                <span style={infoKey}>{row.label}</span>
                <span
                  style={
                    row.muted
                      ? { color: colors.muted5, fontFamily: fonts.mono }
                      : { color: colors.ink }
                  }
                >
                  {row.value}
                </span>
              </div>
            ))}
            <a
              href={site.igUrl}
              target="_blank"
              rel="noreferrer"
              className="ig-row"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 16px',
                fontSize: 13,
              }}
            >
              <span style={infoKey}>Instagram</span>
              <span style={{ color: colors.red }}>{site.igHandle} →</span>
            </a>
          </div>
        </div>

        {/* Right — form / success */}
        <div style={{ position: 'relative' }}>
          {submitted ? (
            <div
              style={{
                border: `1px solid ${colors.red}`,
                background: 'linear-gradient(160deg,#16100e,#0d0b0a)',
                padding: '48px 40px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: fonts.display,
                  fontSize: 64,
                  color: colors.red,
                  lineHeight: 1,
                  marginBottom: 14,
                }}
              >
                ✦
              </div>
              <h3
                style={{
                  fontFamily: fonts.display,
                  fontWeight: 400,
                  fontSize: 38,
                  color: colors.cream,
                  marginBottom: 14,
                }}
              >
                Request Received
              </h3>
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: '#a9a194',
                  fontWeight: 300,
                  maxWidth: 360,
                  margin: '0 auto 26px',
                }}
              >
                Thanks{submittedName} — your idea is in the book. I'll DM you on
                Instagram within 48 hours to talk through the design and set a
                deposit.
              </p>
              <button
                type="button"
                onClick={resetForm}
                className="btn-outline-red"
                style={{
                  alignSelf: 'center',
                  padding: '12px 26px',
                  fontSize: 13,
                  letterSpacing: '.2em',
                  textTransform: 'uppercase',
                }}
              >
                Send Another
              </button>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              style={{
                border: '1px solid rgba(216,210,196,.14)',
                background: colors.bg,
                padding: 30,
              }}
            >
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 11,
                  letterSpacing: '.3em',
                  color: colors.muted3,
                  textTransform: 'uppercase',
                  borderBottom: '1px solid rgba(216,210,196,.12)',
                  paddingBottom: 14,
                  marginBottom: 22,
                }}
              >
                Consultation Request
              </div>

              <div
                className="form-grid"
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}
              >
                <label style={label}>
                  Name
                  <input
                    className="field"
                    name="name"
                    value={form.name}
                    onChange={onField}
                    placeholder="your name"
                    style={{ letterSpacing: 0 }}
                  />
                </label>
                <label style={label}>
                  Instagram
                  <input
                    className="field"
                    name="instagram"
                    value={form.instagram}
                    onChange={onField}
                    placeholder="@yourhandle"
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    style={{ letterSpacing: 0 }}
                  />
                </label>
                <label style={label}>
                  Phone
                  <input
                    className="field"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={onField}
                    placeholder="+1 555 123 4567"
                    autoComplete="tel"
                    style={{ letterSpacing: 0 }}
                  />
                </label>
                <label style={label}>
                  Style
                  <select
                    className="field field--select"
                    name="style"
                    value={form.style}
                    onChange={onField}
                  >
                    {site.styles.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>
                <label style={label}>
                  Placement
                  <input
                    className="field"
                    name="placement"
                    value={form.placement}
                    onChange={onField}
                    placeholder="arm, ribs, calf…"
                    style={{ letterSpacing: 0 }}
                  />
                </label>
                <label style={label}>
                  Approx. size
                  <input
                    className="field"
                    name="size"
                    value={form.size}
                    onChange={onField}
                    placeholder="e.g. 4 in / palm-sized"
                    style={{ letterSpacing: 0 }}
                  />
                </label>
                <label style={label}>
                  Preferred date
                  <input
                    className="field field--date"
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={onField}
                  />
                </label>
              </div>

              <label style={{ ...label, marginTop: 16 }}>
                The idea
                <textarea
                  className="field field--area"
                  name="idea"
                  value={form.idea}
                  onChange={onField}
                  rows={3}
                  placeholder="describe the piece, references, meaning…"
                  style={{ letterSpacing: 0 }}
                />
              </label>

              {error && (
                <div
                  style={{
                    marginTop: 14,
                    fontSize: 12,
                    color: colors.red,
                    fontFamily: fonts.mono,
                    letterSpacing: '.05em',
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn-fill"
                disabled={submitting}
                style={{
                  marginTop: 22,
                  width: '100%',
                  padding: 16,
                  fontWeight: 600,
                  fontSize: 14,
                  letterSpacing: '.24em',
                  textTransform: 'uppercase',
                  opacity: submitting ? 0.6 : 1,
                  cursor: submitting ? 'wait' : 'pointer',
                }}
              >
                {submitting ? 'Sending…' : 'Send Request →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
