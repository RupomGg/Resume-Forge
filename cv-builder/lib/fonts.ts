// lib/fonts.ts — Font definitions for the CV Builder

import type { FontDefinition } from '@/models/cv.types'

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
    id: 'karla',
    name: 'Karla',
    googleFamily: 'Karla',
    category: 'sans-serif',
    isFree: false,
  },
  {
    id: 'mulish',
    name: 'Mulish',
    googleFamily: 'Mulish',
    category: 'sans-serif',
    isFree: false,
  },
  {
    id: 'titillium-web',
    name: 'Titillium Web',
    googleFamily: 'Titillium Web',
    category: 'sans-serif',
    isFree: false,
  },
  {
    id: 'work-sans',
    name: 'Work Sans',
    googleFamily: 'Work Sans',
    category: 'sans-serif',
    isFree: false,
  },
  {
    id: 'barlow',
    name: 'Barlow',
    googleFamily: 'Barlow',
    category: 'sans-serif',
    isFree: false,
  },
  {
    id: 'jost',
    name: 'Jost',
    googleFamily: 'Jost',
    category: 'sans-serif',
    isFree: false,
  },
  {
    id: 'fira-sans',
    name: 'Fira Sans',
    googleFamily: 'Fira Sans',
    category: 'sans-serif',
    isFree: false,
  },
  {
    id: 'rubik',
    name: 'Rubik',
    googleFamily: 'Rubik',
    category: 'sans-serif',
    isFree: false,
  },
  {
    id: 'asap',
    name: 'Asap',
    googleFamily: 'Asap',
    category: 'sans-serif',
    isFree: false,
  },
  {
    id: 'ibm-plex-sans',
    name: 'IBM Plex Sans',
    googleFamily: 'IBM Plex Sans',
    category: 'sans-serif',
    isFree: false,
  },
  {
    id: 'source-code-pro',
    name: 'Source Code Pro',
    googleFamily: 'Source Code Pro',
    category: 'monospace',
    isFree: false,
  },
  {
    id: 'roboto-mono',
    name: 'Roboto Mono',
    googleFamily: 'Roboto Mono',
    category: 'monospace',
    isFree: true,
  },
]

/** Look up a font by ID, falling back to Lato if not found */
export function getFont(fontId: string): FontDefinition {
  return FONTS.find((f) => f.id === fontId) ?? FONTS[0]
}
