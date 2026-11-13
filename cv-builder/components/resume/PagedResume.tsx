'use client'

// Renders a resume as real pages. Blocks are measured off-screen at true size, then
// distributed greedily over pages. The editor preview and /print use this same component.

import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { CVData } from '@/models/cv.types'
import { buildBlocks, cssVars, fontUrls, geometry, type Block } from './blocks'
import './resume.css'

// ponytail: a single block taller than a page is clipped, not split. Split rich text
// by paragraph/list item if users report cut-off entries.
function paginate(blocks: Block[], heights: number[], avail: number): number[][] {
  const pages: number[][] = [[]]
  let used = 0
  blocks.forEach((b, i) => {
    let need = (heights[i] ?? 0) - b.gap
    if (b.keepWithNext && blocks[i + 1]) need = (heights[i] ?? 0) + (heights[i + 1] ?? 0) - blocks[i + 1].gap
    if (used > 0 && used + need > avail) { pages.push([]); used = 0 }
    pages[pages.length - 1].push(i)
    used += heights[i] ?? 0
  })
  return pages
}

const wrap = (b: Block) => (
  <div key={b.key} data-b className="rf-b" style={{ paddingBottom: b.gap }}>{b.node}</div>
)

function footerText(tpl: string, data: CVData, page: number, pages: number) {
  return tpl
    .replace(/{{\s*name\s*}}/g, data.personal.fullName)
    .replace(/{{\s*email\s*}}/g, data.personal.email)
    .replace(/{{\s*page\s*}}/g, String(page))
    .replace(/{{\s*pages\s*}}/g, String(pages))
}

interface Props {
  data: CVData
  /** Only render the first N pages (thumbnails). */
  maxPages?: number
  /** Gap in px between pages (0 for print). */
  pageGap?: number
  onPageCount?: (n: number) => void
}

export default function PagedResume({ data, maxPages, pageGap = 0, onPageCount }: Props) {
  const d = data.design
  const g = geometry(d)
  const { main, side } = useMemo(() => buildBlocks(data), [data])
  const measureRef = useRef<HTMLDivElement>(null)
  const [heights, setHeights] = useState<{ main: number[]; side: number[] } | null>(null)

  useLayoutEffect(() => {
    const el = measureRef.current
    if (!el) return
    const read = () => {
      const col = (name: string) =>
        Array.from(el.querySelectorAll<HTMLElement>(`[data-col="${name}"] > [data-b]`)).map((n) => n.offsetHeight)
      const next = { main: col('main'), side: col('side') }
      setHeights((prev) => (prev && JSON.stringify(prev) === JSON.stringify(next) ? prev : next))
    }
    read()
    // Catches late reflows: web fonts arriving, photo decoding.
    const ro = new ResizeObserver(read)
    el.querySelectorAll('[data-b]').forEach((n) => ro.observe(n))
    return () => ro.disconnect()
  }, [main, side])

  const pages = useMemo(() => {
    if (!heights) return []
    const m = paginate(main, heights.main, g.availH)
    const s = side.length ? paginate(side, heights.side, g.availH) : []
    return Array.from({ length: Math.max(m.length, s.length) }, (_, i) => ({ main: m[i] ?? [], side: s[i] ?? [] }))
  }, [heights, main, side, g.availH])

  const count = pages.length
  useLayoutEffect(() => { if (count) onPageCount?.(count) }, [count, onPageCount])

  const f = d.footer
  const foot = (i: number) => {
    const cols = f.useCustomFooter
      ? [f.leftColumn, f.centerColumn, f.rightColumn]
      : [f.showName ? '{{name}}' : '', f.showPageNumbers ? '{{page}} / {{pages}}' : '', f.showEmail ? '{{email}}' : '']
    return (
      <div className="rf-foot">
        {cols.map((c, k) => <div key={k}>{footerText(c ?? '', data, i + 1, count)}</div>)}
      </div>
    )
  }

  const sideLeft = d.layout === 'sidebar-left'
  const shown = maxPages ? pages.slice(0, maxPages) : pages

  return (
    <div
      className={`rf ${d.colorMode === 'border' ? 'rf--border' : ''}`}
      style={{ ...cssVars(d), position: 'relative', display: 'flex', flexDirection: 'column', gap: pageGap }}
      data-rf-pages={count}
    >
      {fontUrls(d).map((href) => <link key={href} rel="stylesheet" href={href} />)}

      <div ref={measureRef} className="rf-measure" aria-hidden>
        <div data-col="main" className="rf-col rf-col--main">{main.map(wrap)}</div>
        {g.hasSide && <div data-col="side" className="rf-col rf-col--side">{side.map(wrap)}</div>}
      </div>

      {shown.map((p, i) => {
        const mainCol = <div key="m" className="rf-col rf-col--main">{p.main.map((k) => wrap(main[k]))}</div>
        const sideCol = g.hasSide && <div key="s" className="rf-col rf-col--side">{p.side.map((k) => wrap(side[k]))}</div>
        return (
          <div key={i} className="rf-page">
            {g.hasSide && <div className="rf-sidebg" style={sideLeft ? { left: 0 } : { right: 0 }} />}
            <div className="rf-cols">{sideLeft ? [sideCol, mainCol] : [mainCol, sideCol]}</div>
            {g.hasFooter && foot(i)}
          </div>
        )
      })}
    </div>
  )
}
