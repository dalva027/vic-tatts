import type { Plugin } from 'vite'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { promises as fs } from 'node:fs'
import path from 'node:path'

/**
 * Dev-only image store for <ImageSlot>.
 *
 * The gallery is edited by the developer, not by visitors: while `vite dev`
 * runs, dropping/replacing a photo POSTs it here and we write a real file into
 * `public/uploads/` plus a `manifest.json` mapping slot id -> URL. Those files
 * are committed and shipped with the build, so the live (static) site simply
 * reads the manifest and shows the images — with no editing endpoint present.
 *
 * This is the "real backend" seam the old localStorage hook hinted at, scoped
 * to the only place edits should ever happen: a developer's machine.
 */

const SAVE = '/__imageslot/save'
const DELETE = '/__imageslot/delete'
const MAX_BODY = 24 * 1024 * 1024 // 24 MB — scaled data URLs are far smaller
const ID_RE = /^[a-zA-Z0-9_-]{1,64}$/

const MIME_EXT: Record<string, string> = {
  'image/webp': 'webp',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/avif': 'avif',
}
// Any extension we might have written for an id, so replace/clear can tidy up.
const KNOWN_EXTS = ['webp', 'jpg', 'jpeg', 'png', 'gif', 'avif']

/**
 * Serialize file + manifest mutations. Requests arrive concurrently (a fresh
 * gallery can fire a dozen saves at once) and each rewrites the shared
 * manifest, so an unguarded read-modify-write loses entries.
 */
let queue: Promise<unknown> = Promise.resolve()
function withLock<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task)
  queue = run.then(
    () => undefined,
    () => undefined,
  )
  return run
}

export function imageSlotDevPlugin(): Plugin {
  let uploadsDir = ''
  let manifestPath = ''

  return {
    name: 'image-slot-dev-store',
    apply: 'serve', // never part of the production build

    configResolved(config) {
      uploadsDir = path.join(config.publicDir, 'uploads')
      manifestPath = path.join(uploadsDir, 'manifest.json')
    },

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.method !== 'POST' || (req.url !== SAVE && req.url !== DELETE)) {
          return next()
        }

        try {
          const body = (await readJsonBody(req)) as {
            id?: unknown
            dataUrl?: unknown
          }
          const id = typeof body.id === 'string' ? body.id : ''
          if (!ID_RE.test(id)) return send(res, 400, { error: 'invalid id' })

          if (req.url === DELETE) {
            await withLock(async () => {
              await fs.mkdir(uploadsDir, { recursive: true })
              await removeExisting(uploadsDir, id)
              const manifest = await readManifest(manifestPath)
              delete manifest[id]
              await writeManifest(manifestPath, manifest)
            })
            return send(res, 200, { ok: true })
          }

          const dataUrl = typeof body.dataUrl === 'string' ? body.dataUrl : ''
          const match = /^data:(image\/[a-z0-9.+-]+);base64,([\s\S]+)$/i.exec(
            dataUrl,
          )
          if (!match) return send(res, 400, { error: 'invalid dataUrl' })

          const ext = MIME_EXT[match[1].toLowerCase()]
          if (!ext) return send(res, 400, { error: 'unsupported image type' })

          const buffer = Buffer.from(match[2], 'base64')
          const filename = `${id}.${ext}`
          // `?v=` busts the browser cache since the filename is stable per id.
          const url = `/uploads/${filename}?v=${Date.now()}`
          await withLock(async () => {
            await fs.mkdir(uploadsDir, { recursive: true })
            await removeExisting(uploadsDir, id) // drop any prior extension
            await fs.writeFile(path.join(uploadsDir, filename), buffer)
            const manifest = await readManifest(manifestPath)
            manifest[id] = url
            await writeManifest(manifestPath, manifest)
          })
          return send(res, 200, { url })
        } catch (err) {
          server.config.logger.error(
            `[image-slot] ${(err as Error).message}`,
          )
          return send(res, 500, { error: 'save failed' })
        }
      })
    },
  }
}

function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    let size = 0
    req.on('data', (chunk: Buffer) => {
      size += chunk.length
      if (size > MAX_BODY) {
        reject(new Error('payload too large'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      try {
        const text = Buffer.concat(chunks).toString('utf8')
        resolve(text ? JSON.parse(text) : {})
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
  })
}

async function readManifest(file: string): Promise<Record<string, string>> {
  try {
    const raw = await fs.readFile(file, 'utf8')
    const data: unknown = JSON.parse(raw)
    return data && typeof data === 'object'
      ? (data as Record<string, string>)
      : {}
  } catch {
    return {}
  }
}

async function writeManifest(file: string, manifest: Record<string, string>) {
  // Stable key order keeps the committed diff readable.
  const ordered = Object.fromEntries(
    Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)),
  )
  await fs.writeFile(file, JSON.stringify(ordered, null, 2) + '\n', 'utf8')
}

async function removeExisting(dir: string, id: string) {
  await Promise.all(
    KNOWN_EXTS.map((ext) =>
      fs.rm(path.join(dir, `${id}.${ext}`), { force: true }),
    ),
  )
}

function send(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}
