import {
  useCallback,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type DragEvent,
} from 'react'
import { fileToScaledDataUrl, useImageSlot } from '../hooks/useImageSlot'
import { useLightbox } from './Lightbox'
import './ImageSlot.css'

type Shape = 'rect' | 'rounded' | 'circle' | 'pill'
type Fit = 'cover' | 'contain'

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
 * User-fillable image placeholder. Drag a photo onto it (or click to browse)
 * and it sticks across reloads. A faithful, dark-themed React port of the
 * source `image-slot.js` component used throughout the original page.
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
  const [src, setSrc] = useImageSlot(id)
  const [over, setOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()
  const lightbox = useLightbox()

  const view = useCallback(() => {
    if (src) lightbox?.open({ src, alt: title || placeholder, caption: title })
  }, [src, title, placeholder, lightbox])

  const ingest = useCallback(
    async (file: File | undefined | null) => {
      if (!file) return
      try {
        setError(null)
        const dataUrl = await fileToScaledDataUrl(file)
        setSrc(dataUrl)
      } catch {
        setError('// that file is not an image')
      }
    },
    [setSrc],
  )

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

  return (
    <div
      className={`slot ${shapeClass} ${className}`.trim()}
      data-over={over}
      data-filled={Boolean(src)}
      style={src ? { cursor: 'zoom-in', ...style } : style}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragEnter={onDragOver}
      onDragLeave={onDragLeave}
      onClick={src ? view : browse}
      role="button"
      tabIndex={0}
      aria-label={
        src ? `View ${title || placeholder} full size` : placeholder
      }
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          if (src) view()
          else browse()
        }
      }}
    >
      {src ? (
        <img
          className={`slot__img slot__img--${fit}`}
          src={src}
          alt={placeholder}
          draggable={false}
        />
      ) : (
        <div className="slot__empty">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.6" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          <span className="slot__cap">{placeholder}</span>
          <span className="slot__hint">drop · or click</span>
        </div>
      )}

      <div className="slot__ring" />

      {src && (
        <div className="slot__ctl">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              browse()
            }}
          >
            Replace
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setSrc(null)
            }}
          >
            Clear
          </button>
        </div>
      )}

      {error && <div className="slot__err">{error}</div>}

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
    </div>
  )
}
