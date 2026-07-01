import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { colors, fonts } from '../theme/tokens'

export interface LightboxItem {
  src: string
  alt: string
  /** Optional caption shown under the image. */
  caption?: string
}

interface LightboxApi {
  open: (item: LightboxItem) => void
}

const LightboxContext = createContext<LightboxApi | null>(null)

/** Trigger the full-size viewer. Returns null outside a provider (no-op). */
export function useLightbox(): LightboxApi | null {
  return useContext(LightboxContext)
}

/**
 * App-level image viewer. Any image (e.g. a filled ImageSlot) can call
 * `open()` to expand it full-size over a dimmed backdrop. Rendered at the app
 * root so it escapes the galleries' `overflow:hidden` frames.
 */
export function LightboxProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<LightboxItem | null>(null)
  const open = useCallback((next: LightboxItem) => setItem(next), [])
  const close = useCallback(() => setItem(null), [])

  useEffect(() => {
    if (!item) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    document.body.classList.add('scroll-lock')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.classList.remove('scroll-lock')
    }
  }, [item, close])

  return (
    <LightboxContext.Provider value={{ open }}>
      {children}
      {item && <LightboxOverlay item={item} onClose={close} />}
    </LightboxContext.Provider>
  )
}

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 200,
  background: 'rgba(7,6,5,.93)',
  backdropFilter: 'blur(5px)',
  WebkitBackdropFilter: 'blur(5px)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 18,
  padding: '6vh 6vw',
  cursor: 'zoom-out',
  animation: 'lb-fade .2s ease',
}

function LightboxOverlay({ item, onClose }: { item: LightboxItem; onClose: () => void }) {
  return (
    <div
      style={overlayStyle}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.caption || item.alt}
    >
      <button
        type="button"
        onClick={onClose}
        className="btn-ghost"
        style={{
          position: 'absolute',
          top: 22,
          right: 26,
          fontSize: 11,
          letterSpacing: '.24em',
          textTransform: 'uppercase',
          padding: '9px 16px',
        }}
      >
        Close ✕
      </button>

      <img
        src={item.src}
        alt={item.alt}
        draggable={false}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '88vw',
          maxHeight: item.caption ? '80vh' : '86vh',
          objectFit: 'contain',
          border: `1px solid ${colors.line}`,
          boxShadow: '0 24px 80px rgba(0,0,0,.7)',
          cursor: 'default',
          animation: 'lb-zoom .28s cubic-bezier(.2,.7,.2,1) both',
        }}
      />

      {item.caption && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            fontFamily: fonts.mono,
            fontSize: 12,
            letterSpacing: '.18em',
            textTransform: 'uppercase',
            color: colors.muted2,
            cursor: 'default',
          }}
        >
          {item.caption}
        </div>
      )}
    </div>
  )
}
