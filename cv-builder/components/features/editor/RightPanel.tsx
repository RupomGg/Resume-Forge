'use client'

import { useDeferredValue, useEffect, useRef, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'
import PagedResume from '@/components/resume/PagedResume'
import { geometry } from '@/components/resume/blocks'
import { useCVStore } from '@/store/cv-store'
import { DATA_KEYS } from '@/store/initial-state'
import AtsBadge from './AtsBadge'
import type { CVData } from '@/models/cv.types'

const PAGE_GAP = 24
const pickData = (s: CVData) => Object.fromEntries(DATA_KEYS.map((k) => [k, s[k]])) as unknown as CVData

export default function RightPanel() {
  // Deferred so typing in the form never waits on re-pagination.
  const data = useDeferredValue(useCVStore(useShallow(pickData)))
  const { pageW, pageH } = geometry(data.design)
  const boxRef = useRef<HTMLDivElement>(null)
  const [boxW, setBoxW] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [pages, setPages] = useState(1)

  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setBoxW(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // zoom 1 = fit the panel width (never above actual size)
  const scale = boxW ? Math.min(1, boxW / pageW) * zoom : 0
  const totalH = pages * pageH + (pages - 1) * PAGE_GAP

  return (
    <div id="right-panel" className="flex-1 flex flex-col overflow-hidden bg-[#E9EDF0]">
      <div className="flex items-center justify-between px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider text-outline flex-shrink-0">
        <span>{data.design.pageSize === 'letter' ? 'Letter' : 'A4'} · {pages} {pages === 1 ? 'page' : 'pages'}</span>
        <AtsBadge data={data} />
        <div className="flex items-center gap-1 bg-white/80 rounded-lg border border-white shadow-sm p-0.5">
          <button aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))} className="p-1.5 rounded hover:bg-surface-container"><Minus className="w-3.5 h-3.5" /></button>
          <button onClick={() => setZoom(1)} className="px-2 tabular-nums hover:text-primary" title="Fit width">{Math.round(scale * 100)}%</button>
          <button aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(2, z + 0.1))} className="p-1.5 rounded hover:bg-surface-container"><Plus className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 pb-10">
        <div ref={boxRef} className="w-full max-w-[860px] mx-auto">
          {scale > 0 && (
            <div className="mx-auto" style={{ width: pageW * scale, height: totalH * scale }}>
              <div className="rf-preview" style={{ width: pageW, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                <PagedResume data={data} pageGap={PAGE_GAP} onPageCount={setPages} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
