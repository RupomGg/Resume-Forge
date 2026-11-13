'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Copy, Plus, Trash2 } from 'lucide-react'
import ResumeThumb from '@/components/resume/ResumeThumb'
import { createResume, deleteResume, duplicateResume } from '@/lib/actions/resumes'
import { normalizeResume } from '@/store/initial-state'
import type { CVData } from '@/models/cv.types'

interface Item { id: string; title: string; data: CVData; updatedAt: string }

const THUMB_W = 220

export default function ResumeGrid({ resumes, limit }: { resumes: Item[]; limit: number | null }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const atLimit = limit !== null && resumes.length >= limit

  const run = (action: () => Promise<{ ok: boolean; error?: string; data?: unknown }>, open = false) =>
    startTransition(async () => {
      setError(null)
      const res = await action()
      if (!res.ok) return setError(res.error ?? 'Something went wrong.')
      if (open && typeof res.data === 'string') router.push(`/app/resumes/${res.data}`)
      else router.refresh()
    })

  return (
    <div className="max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-manrope text-2xl font-bold text-on-surface">My resumes</h1>
          <p className="mt-1 text-[14px] text-outline">
            {limit === null ? `${resumes.length} resumes` : `${resumes.length} of ${limit} resumes used on the free plan`}
          </p>
        </div>
        <button
          onClick={() => run(() => createResume(), true)}
          disabled={pending || atLimit}
          title={atLimit ? 'Delete a resume to create a new one' : undefined}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-manrope text-[13px] font-bold hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" /> New resume
        </button>
      </div>

      {error && <p role="alert" className="mt-4 text-[13px] text-error bg-error-container/50 rounded-lg px-3 py-2">{error}</p>}

      {resumes.length === 0 ? (
        <div className="mt-10 rounded-2xl border-2 border-dashed border-outline-variant p-12 text-center">
          <p className="font-manrope text-lg font-bold text-on-surface">No resumes yet</p>
          <p className="mt-1 text-[14px] text-outline">Create your first one — every template and font is included.</p>
          <button
            onClick={() => run(() => createResume(), true)}
            disabled={pending}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-manrope text-[13px] font-bold hover:bg-primary-container disabled:opacity-50"
          >
            <Plus className="w-4 h-4" /> Create resume
          </button>
        </div>
      ) : (
        <ul className="mt-8 grid gap-6" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${THUMB_W}px, 1fr))` }}>
          {resumes.map((r) => (
            <li key={r.id} className="group" style={{ maxWidth: THUMB_W + 2 }}>
              <Link
                href={`/app/resumes/${r.id}`}
                className="block rounded-xl overflow-hidden border border-outline-variant/50 bg-white shadow-sm hover:shadow-lg hover:border-primary/40 transition-all"
              >
                <ResumeThumb data={normalizeResume(r.data)} width={THUMB_W} />
              </Link>
              <div className="mt-2.5 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link href={`/app/resumes/${r.id}`} className="block text-[14px] font-bold text-on-surface truncate hover:text-primary">{r.title}</Link>
                  <p className="text-[12px] text-outline">Edited {new Date(r.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div className="flex gap-0.5 flex-shrink-0">
                  <button
                    onClick={() => run(() => duplicateResume(r.id))}
                    disabled={pending || atLimit}
                    title={atLimit ? 'Resume limit reached' : 'Duplicate'}
                    aria-label={`Duplicate ${r.title}`}
                    className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-primary/10 disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => confirm(`Delete "${r.title}"? This cannot be undone.`) && run(() => deleteResume(r.id))}
                    disabled={pending}
                    title="Delete"
                    aria-label={`Delete ${r.title}`}
                    className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error-container/40"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
