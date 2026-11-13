'use client'

import { useMemo } from 'react'
import { Check } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'
import ResumeThumb from '@/components/resume/ResumeThumb'
import { PART_IDS, PARTS, TEMPLATES, getTemplate, partOf, partSource } from '@/lib/templates'
import { cn } from '@/lib/utils'
import { useCVStore } from '@/store/cv-store'
import { DATA_KEYS, DEFAULT_DATA } from '@/store/initial-state'
import type { CVData } from '@/models/cv.types'

const pickData = (s: CVData) => Object.fromEntries(DATA_KEYS.map((k) => [k, s[k]])) as unknown as CVData

export default function TemplatesPanel() {
  const current = useCVStore(useShallow(pickData))
  const updateDesign = useCVStore((s) => s.updateDesign)

  // Preview with the user's own content once they have some; sample content before that.
  const content = current.experience.length || current.education.length ? current : DEFAULT_DATA
  const previews = useMemo(
    () => TEMPLATES.map((t) => ({ t, data: { ...content, design: { ...DEFAULT_DATA.design, ...t.design } } })),
    [content],
  )

  // Which template each part of the current design comes from (null = customised).
  const sources = PART_IDS.map((p) => partSource(current.design, p))
  const whole = sources.every((s) => s && s === sources[0]) ? sources[0] : null

  return (
    <div className="p-6 flex flex-col gap-7">
      <section className="flex flex-col gap-4">
        <div>
          <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">ATS-friendly templates</h3>
          <p className="text-[12px] text-outline mt-1">
            Single column, standard fonts, plain-text skills. Every template is free.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {previews.map(({ t, data }) => (
            <button
              key={t.id}
              onClick={() => updateDesign(t.design)}
              title={t.description}
              className={cn(
                'group text-left rounded-xl border-2 overflow-hidden bg-white transition-all hover:shadow-lg',
                whole === t.id ? 'border-primary shadow-md' : 'border-outline-variant/40 hover:border-primary/40',
              )}
            >
              <div className="relative">
                <ResumeThumb data={data} width={168} />
                {whole === t.id && (
                  <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
              <div className="px-3 py-2 border-t border-outline-variant/30">
                <div className="text-[12px] font-bold text-on-surface">{t.name}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">Mix &amp; match</h3>
          <p className="text-[12px] text-outline mt-1">
            Take each part of your resume from a different template — for example Harvard&apos;s rows with Jake&apos;s headings.
          </p>
        </div>
        <div className="flex flex-col gap-2.5">
          {PART_IDS.map((part, i) => (
            <label key={part} className="flex items-center justify-between gap-3 text-[13px] font-semibold text-on-surface">
              {PARTS[part].label}
              <select
                value={sources[i] ?? ''}
                onChange={(e) => {
                  const t = getTemplate(e.target.value)
                  if (t) updateDesign(partOf(t.design, part))
                }}
                className="w-40 px-2.5 py-1.5 rounded-lg border border-outline-variant bg-white text-[13px] font-normal outline-none focus:border-primary"
              >
                {sources[i] === null && <option value="" disabled>Custom</option>}
                {TEMPLATES.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </label>
          ))}
        </div>
      </section>
    </div>
  )
}
