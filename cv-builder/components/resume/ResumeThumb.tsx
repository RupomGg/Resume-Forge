'use client'

import type { CVData } from '@/models/cv.types'
import PagedResume from './PagedResume'
import { geometry } from './blocks'

/** First page of a resume, scaled down to `width` px. Not interactive. */
export default function ResumeThumb({ data, width }: { data: CVData; width: number }) {
  const { pageW, pageH } = geometry(data.design)
  const scale = width / pageW
  return (
    <div style={{ width, height: pageH * scale, overflow: 'hidden', background: '#fff' }} aria-hidden>
      <div style={{ width: pageW, transform: `scale(${scale})`, transformOrigin: 'top left', pointerEvents: 'none' }}>
        <PagedResume data={data} maxPages={1} />
      </div>
    </div>
  )
}
