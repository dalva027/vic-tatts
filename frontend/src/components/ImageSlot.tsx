import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type DragEvent,
} from 'react'
import {
  fileToScaledDataUrl,
  LEGACY_PREFIX,
  useImageSlot,
} from '../hooks/useImageSlot'
import { useLightbox } from './Lightbox'
import './ImageSlot.css'

type Shape = 'rect' | 'rounded' | 'circle' | 'pill'
type Fit = 'cover' | 'contain'

/** Editing (drop/browse/replace/clear) is a developer-only feature. */
const EDITABLE = import.meta.env.DEV

export interface ImageSlotProps {
  /** Stable persistence key — every slot on the page needs a distinct id. */
  id: string
  placeholder?: string
  /** Label used as the lightbox caption and image alt text once filled. */
  title?: string
  shape?: Shape
  fit?: Fit
  className?: string
  style?: CSSProperties
}

/**
 * Image placeholder for the gallery.
 *
 * In development it is user-fillable — drag a photo onto it (or click to
 * browse) and it is saved to `public/uploads/` so it ships with the build. On
 * the live site it is read-only: filled slots open in the lightbox, empty ones
 * simply show the frame. A dark-themed React port of the source
 * `image-slot.js`.
 */
export function ImageSlot({
  id,
  placeholder = 'Drop an image',
  title,
  shape = 'rect',
  fit = 'cover',
  className = '',
  style,
}: ImageSlotProps) {
  const { src, ready, save } = useImageSlot(id)
  const [over, setOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const migratedRef = useRef(false)
  const inputId = useId()
  const lightbox = useLightbox()

  const view = useCallback(() => {
    if (src) lightbox?.open({ src, alt: title || placeholder, caption: title })
  }, [src, title, placeholder, lightbox])

  const store = useCallback(
    async (dataUrl: string | null, failMsg: string) => {
      setError(null)
      setBusy(true)
      try {
        await save(dataUrl)
      } catch {
        setError(failMsg)
      } finally {
        setBusy(false)
      }
    },
    [save],
  )

  const ingest = useCallback(
    async (file: File | undefined | null) => {
      if (!file) return
      try {
        const dataUrl = await fileToScaledDataUrl(file)
        await store(dataUrl, '// could not save that image')
      } catch {
        setError('// that file is not an image')
      }
    },
    [store],
  )

  // One-time migration: images picked with the old localStorage hook are moved
  // into the real store the first time this slot renders empty in dev.
  useEffect(() => {
    if (!EDITABLE || !ready || src || migratedRef.current) return
    let legacy: string | null = null
    try {
      legacy = localStorage.getItem(LEGACY_PREFIX + id)
    } catch {
      // storage blocked — nothing to migrate
    }
    if (!legacy || !legacy.startsWith('data:image/')) return
    migratedRef.current = true
    save(legacy)
      .then(() => {
        try {
          localStorage.removeItem(LEGACY_PREFIX + id)
        } catch {
          // ignore — the manifest is now the source of truth regardless
        }
      })
      .catch(() => {})
  }, [ready, src, id, save])

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      setOver(false)
      void ingest(e.dataTransfer.files?.[0])
    },
    [ingest],
  )

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
    setOver(true)
  }, [])

  const onDragLeave = useCallback((e: DragEvent) => {
    // Ignore bubbling from children.
    if (e.currentTarget === e.target) setOver(false)
  }, [])

  const browse = useCallback(() => inputRef.current?.click(), [])

  const shapeClass =
    shape === 'circle'
      ? 'slot--circle'
      : shape === 'pill'
        ? 'slot--pill'
        : shape === 'rounded'
          ? 'slot--rounded'
          : ''

  // Interactive when there's something to view, or (in dev) something to fill.
  const interactive = Boolean(src) || EDITABLE
  const activate = src ? view : EDITABLE ? browse : undefined

  const dragProps = EDITABLE
    ? {
        onDrop,
        onDragOver,
        onDragEnter: onDragOver,
        onDragLeave,
      }
    : {}

  return (
    <div
      className={`slot ${shapeClass} ${className}`.trim()}
      data-over={over}
      data-filled={Boolean(src)}
      style={src ? { cursor: 'zoom-in', ...style } : style}
      onClick={activate}
      {...dragProps}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={
        src
          ? `View ${title || placeholder} full size`
          : EDITABLE
            ? placeholder
            : undefined
      }
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                activate?.()
              }
            }
          : undefined
      }
    >
      {src ? (
        <img
          className={`slot__img slot__img--${fit}`}
          src={src}
          alt={placeholder}
          draggable={false}
        />
      ) : EDITABLE ? (
        <div className="slot__empty">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.6" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          <span className="slot__cap">{placeholder}</span>
          <span className="slot__hint">drop · or click</span>
        </div>
      ) : null}

      {EDITABLE && <div className="slot__ring" />}

      {EDITABLE && src && (
        <div className="slot__ctl">
          <button
            type="button"
            disabled={busy}
            onClick={(e) => {
              e.stopPropagation()
              browse()
            }}
          >
            Replace
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={(e) => {
              e.stopPropagation()
              void store(null, '// could not clear image')
            }}
          >
            Clear
          </button>
        </div>
      )}

      {error && <div className="slot__err">{error}</div>}

      {EDITABLE && (
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            void ingest(e.target.files?.[0])
            e.target.value = ''
          }}
        />
      )}
    </div>
  )
}
