import { useCallback, useEffect, useState } from 'react'

const PREFIX = 'evt:imgslot:'

/**
 * Persist a dropped image (as a data URL) per slot id.
 *
 * Mirrors the source `image-slot.js`, which kept dropped photos in a sidecar
 * so a filled gallery survived reloads. Here we use localStorage — a clean
 * seam to later swap for a real upload/CDN backend on the platform.
 */
export function useImageSlot(id: string) {
  const key = PREFIX + id

  const [src, setSrcState] = useState<string | null>(() => {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  })

  // Keep multiple mounts of the same id (and other tabs) in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) setSrcState(e.newValue)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [key])

  const setSrc = useCallback(
    (value: string | null) => {
      setSrcState(value)
      try {
        if (value) localStorage.setItem(key, value)
        else localStorage.removeItem(key)
      } catch {
        // Quota exceeded or storage blocked — keep the in-memory value so the
        // current session still shows the image.
      }
    },
    [key],
  )

  return [src, setSrc] as const
}

/**
 * Read an image File, downscale it to `maxDim` on its longest edge and return
 * a compact data URL. Keeps localStorage small and parity with the source,
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
      // Prefer WebP; browsers without encode support fall back to PNG via the
      // same call returning a data:image/png URL.
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
