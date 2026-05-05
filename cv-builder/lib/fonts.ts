// lib/fonts.ts — Font definitions for the CV Builder

import type { FontDefinition } from './types'

export const FONTS: FontDefinition[] = [
  // ── Free fonts (isFree: true) ──────────────────────────────────────────────
  {
    id: 'lato',
    name: 'Lato',
    googleFamily: 'Lato',
    category: 'sans-serif',
    isFree: true,
  },
  {
    id: 'roboto',
    name: 'Roboto',
    googleFamily: 'Roboto',
    category: 'sans-serif',
    isFree: true,
  },
  {
    id: 'open-sans',
    name: 'Open Sans',
    googleFamily: 'Open Sans',
    category: 'sans-serif',
    isFree: true,
  },

  // ── Pro-tier fonts (all usable, no paywall yet) ────────────────────────────
  {
    id: 'montserrat',
    name: 'Montserrat',
    googleFamily: 'Montserrat',
    category: 'sans-serif',
    isFree: false,
  },
  {
    id: 'raleway',
    name: 'Raleway',
    googleFamily: 'Raleway',
    category: 'sans-serif',
    isFree: false,
  },
  {
    id: 'nunito',
    name: 'Nunito',
    googleFamily: 'Nunito',
    category: 'sans-serif',
    isFree: false,
  },
  {
    id: 'ubuntu',
    name: 'Ubuntu',
    googleFamily: 'Ubuntu',
    category: 'sans-serif',
    isFree: false,
  },
  {
    id: 'source-sans-pro',
    name: 'Source Sans Pro',
    googleFamily: 'Source Sans 3',
    category: 'sans-serif',
    isFree: false,
  },
  {
    id: 'merriweather',
    name: 'Merriweather',
    googleFamily: 'Merriweather',
    category: 'serif',
    isFree: false,
  },
  {
    id: 'playfair-display',
    name: 'Playfair Display',
    googleFamily: 'Playfair Display',
    category: 'serif',
    isFree: false,
  },
  {
    id: 'pt-serif',
    name: 'PT Serif',
    googleFamily: 'PT Serif',
    category: 'serif',
    isFree: false,
  },
  {
    id: 'crimson-text',
    name: 'Crimson Text',
    googleFamily: 'Crimson Text',
    category: 'serif',
    isFree: false,
  },
]

/** Look up a font by ID, falling back to Lato if not found */
export function getFont(fontId: string): FontDefinition {
  return FONTS.find((f) => f.id === fontId) ?? FONTS[0]
}
