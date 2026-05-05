// lib/utils.ts — Shared utility functions for the CV Builder

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { v4 as uuidv4 } from 'uuid'
import { format } from 'date-fns'
import type { MonthYear, DateFormat, FontDefinition, ColorTheme } from './types'
import { FONTS, getFont as _getFont } from './fonts'
import { COLOR_THEMES, getTheme as _getTheme } from './themes'

// ─── Class name merging ────────────────────────────────────────────────────────

/** Merge Tailwind CSS classes safely using clsx + tailwind-merge */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

// ─── ID generation ─────────────────────────────────────────────────────────────

/** Generate a short unique ID using uuid v4 */
export function generateId(): string {
  return uuidv4()
}

// ─── Date formatting ──────────────────────────────────────────────────────────

const MONTH_NAMES = [
  '', // index 0 placeholder
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const MONTH_SHORT = [
  '',
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

/**
 * Format a MonthYear object using the specified format:
 * - 'full'    → "January 2024"
 * - 'short'   → "Jan 2024"
 * - 'numeric' → "01/2024"
 * - 'year'    → "2024"
 */
export function formatMonthYear(date: MonthYear | null, fmt: DateFormat = 'short'): string {
  if (!date) return ''
  const { month, year } = date

  if (!year) return ''

  switch (fmt) {
    case 'full':
      return month > 0 ? `${MONTH_NAMES[month]} ${year}` : `${year}`
    case 'short':
      return month > 0 ? `${MONTH_SHORT[month]} ${year}` : `${year}`
    case 'numeric':
      return month > 0 ? `${String(month).padStart(2, '0')}/${year}` : `${year}`
    case 'year':
      return `${year}`
    default:
      return month > 0 ? `${MONTH_SHORT[month]} ${year}` : `${year}`
  }
}

// ─── Font & theme lookups ──────────────────────────────────────────────────────

/** Look up a font definition by its ID */
export function getFont(fontId: string): FontDefinition {
  return _getFont(fontId)
}

/** Look up a color theme by its ID */
export function getTheme(themeId: string): ColorTheme {
  return _getTheme(themeId)
}

// ─── Misc helpers ─────────────────────────────────────────────────────────────

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Convert a base-64 data URL to a Blob for file operations */
export function dataUrlToBlob(dataUrl: string): Blob {
  const [header, data] = dataUrl.split(',')
  const mime = header.match(/:(.*?);/)?.[1] ?? 'image/png'
  const bytes = atob(data)
  const arr = new Uint8Array(bytes.length)
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i)
  return new Blob([arr], { type: mime })
}

/** Re-export arrays for convenience */
export { FONTS, COLOR_THEMES }
