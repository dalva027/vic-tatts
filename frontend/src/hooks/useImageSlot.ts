import { useCallback, useSyncExternalStore } from 'react'

/**
 * Read/write the persisted image for a slot.
 *
 * Images live in `public/uploads/` and are indexed by `uploads/manifest.json`
 * (written by the dev-only `image-slot` Vite plugin). Every mount shares one
 * fetched copy of that manifest via an external store, so a filled gallery
 * survives reloads *and* ships with the build — unlike the previous
 * localStorage approach, which only ever existed in the editor's browser.
 *
 * Saving is a developer action: `save()` only reaches the dev endpoint and is
 * a guarded no-op in a production build, where the manifest is read-only.
 */

const MANIFEST_URL = '/uploads/manifest.json'
const SAVE_URL = '/__imageslot/save'
const DELETE_URL = '/__imageslot/delete'

/** localStorage prefix used by the old hook, kept for one-time migration. */
export const LEGACY_PREFIX = 'evt:imgslot:'

type Manifest = Record<string, string>

let manifest: Manifest = {}
let status: 'idle' | 'loading' | 'ready' = 'idle'
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

function ensureLoaded() {
  if (status !== 'idle') return
  status = 'loading'
  fetch(MANIFEST_URL, { cache: 'no-cache' })
    .then((r) => (r.ok ? r.json() : {}))
    .then((data: unknown) => {
      manifest = data && typeof data === 'object' ? (data as Manifest) : {}
    })
    .catch(() => {
      manifest = {}
    })
    .finally(() => {
      status = 'ready'
      emit()
    })
}

function subscribe(callback: () => void) {
  listeners.add(callback)
  ensureLoaded()
  return () => {
    listeners.delete(callback)
  }
}

async function persist(id: string, dataUrl: string | null): Promise<void> {
  // Hard stop in production: there is no endpoint to hit and nothing writable.
  if (!import.meta.env.DEV) {
    throw new Error('Images are read-only outside development')
  }

  if (dataUrl) {
    const res = await fetch(SAVE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, dataUrl }),
    })
    if (!res.ok) throw new Error('save failed')
    const { url } = (await res.json()) as { url: string }
    manifest = { ...manifest, [id]: url }
  } else {
    const res = await fetch(DELETE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (!res.ok) throw new Error('delete failed')
    const next = { ...manifest }
    delete next[id]
    manifest = next
  }
  emit()
}

export interface ImageSlotStore {
  /** Persisted image URL for this slot, or null if empty. */
  src: string | null
  /** False until the manifest has finished loading. */
  ready: boolean
  /** Save a data URL (dev only); pass null to clear. */
  save: (dataUrl: string | null) => Promise<void>
}

export function useImageSlot(id: string): ImageSlotStore {
  const src = useSyncExternalStore(
    subscribe,
    () => manifest[id] ?? null,
    () => null,
  )
  const ready = useSyncExternalStore(
    subscribe,
    () => status === 'ready',
    () => false,
  )
  const save = useCallback(
    (dataUrl: string | null) => persist(id, dataUrl),
    [id],
  )
  return { src, ready, save }
}

/**
 * Read an image File, downscale it to `maxDim` on its longest edge and return
 * a compact data URL. Keeps stored files small and parity with the source,
 * which stored ~1200px WebP frames.
 */
export function fileToScaledDataUrl(
  file: File,
  maxDim = 1200,
  quality = 0.85,
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Not an image file'))
      return
    }
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      const { width, height } = img
      const scale = Math.min(1, maxDim / Math.max(width, height))
      const w = Math.max(1, Math.round(width * scale))
      const h = Math.max(1, Math.round(height * scale))
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas unavailable'))
        return
      }
      ctx.drawImage(img, 0, 0, w, h)
      // Prefer WebP; browsers without encode support fall back to JPEG via the
      // same call returning a data:image/jpeg URL.
      let out = canvas.toDataURL('image/webp', quality)
      if (!out.startsWith('data:image/webp')) {
        out = canvas.toDataURL('image/jpeg', quality)
      }
      resolve(out)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not decode image'))
    }
    img.src = url
  })
}
