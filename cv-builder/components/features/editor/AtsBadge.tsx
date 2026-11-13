'use client'

import { useState } from 'react'
import { AlertTriangle, ShieldCheck } from 'lucide-react'
import { atsFixAll, atsIssues } from '@/lib/ats'
import { useCVStore } from '@/store/cv-store'
import type { CVData } from '@/models/cv.types'

/** Toolbar badge: ATS status of the resume, with the issues and their one-click fixes. */
export default function AtsBadge({ data }: { data: CVData }) {
  const updateDesign = useCVStore((s) => s.updateDesign)
  const [open, setOpen] = useState(false)
  const issues = atsIssues(data)
  const fixable = issues.filter((i) => i.fix)

  if (!issues.length) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/80 border border-white shadow-sm text-primary">
        <ShieldCheck className="w-3.5 h-3.5" /> ATS-friendly
      </span>
    )
  }
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 shadow-sm text-amber-800 hover:bg-amber-100"
      >
        <AlertTriangle className="w-3.5 h-3.5" /> {issues.length} ATS {issues.length === 1 ? 'issue' : 'issues'}
      </button>
      {open && (
        <div className="absolute z-30 top-full mt-2 left-1/2 -translate-x-1/2 w-80 rounded-xl bg-white border border-outline-variant/50 shadow-xl p-4 normal-case tracking-normal font-normal text-[13px] text-on-surface">
          <ul className="flex flex-col gap-3">
            {issues.map((i) => (
              <li key={i.id} className="flex items-start justify-between gap-3">
                <span>{i.message}</span>
                {i.fix && (
                  <button onClick={() => updateDesign(i.fix!)} className="flex-shrink-0 text-[12px] font-bold text-primary hover:underline">Fix</button>
                )}
              </li>
            ))}
          </ul>
          {fixable.length > 1 && (
            <button
              onClick={() => updateDesign(atsFixAll(issues))}
              className="mt-4 w-full py-2 rounded-lg bg-primary text-white text-[12px] font-bold hover:bg-primary-container"
            >
              Fix all {fixable.length}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
