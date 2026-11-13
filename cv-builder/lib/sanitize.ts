import 'server-only'
import sanitizeHtml from 'sanitize-html'
import type { CVData } from '@/models/cv.types'

// Rich-text fields are rendered with dangerouslySetInnerHTML — both in the browser and
// inside the server-side Chromium that prints PDFs — so they are reduced to what the
// TipTap editor can produce before they are stored.
const RICH_KEYS = new Set(['description', 'content'])
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'ul', 'ol', 'li', 'a'],
  allowedAttributes: { a: ['href'], p: ['style'] },
  allowedStyles: { p: { 'text-align': [/^(left|right|center|justify)$/] } },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
}

function walk(value: unknown, key?: string): unknown {
  if (typeof value === 'string') return key && RICH_KEYS.has(key) ? sanitizeHtml(value, OPTIONS) : value
  if (Array.isArray(value)) return value.map((v) => walk(v, key))
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, walk(v, k)]))
  }
  return value
}

export function sanitizeResume(data: CVData): CVData {
  const clean = walk(data) as CVData
  // Photos are embedded data URLs; anything else would be fetched by the PDF renderer.
  if (clean.personal?.photoUrl && !/^data:image\/(png|jpeg|webp);base64,/.test(clean.personal.photoUrl)) {
    clean.personal.photoUrl = null
  }
  return clean
}
