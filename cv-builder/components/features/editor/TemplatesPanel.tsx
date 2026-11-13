'use client'

import { useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'
import ResumeThumb from '@/components/resume/ResumeThumb'
import { TEMPLATES } from '@/lib/templates'
import { cn } from '@/lib/utils'
import { useCVStore } from '@/store/cv-store'
import { DATA_KEYS, DEFAULT_DATA } from '@/store/initial-state'
import type { CVData } from '@/models/cv.types'

const CATEGORIES = ['all', 'simple', 'modern', 'creative'] as const
const pickData = (s: CVData) => Object.fromEntries(DATA_KEYS.map((k) => [k, s[k]])) as unknown as CVData

export default function TemplatesPanel() {
  const current = useCVStore(useShallow(pickData))
  const updateDesign = useCVStore((s) => s.updateDesign)
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('all')

  // Preview with the user's own content once they have some; sample content before that.
  const content = current.experience.length || current.education.length ? current : DEFAULT_DATA
  const previews = useMemo(
    () => TEMPLATES.map((t) => ({ t, data: { ...content, design: { ...DEFAULT_DATA.design, ...t.design } } })),
    [content],
  )

  return (
    <div className="p-6 flex flex-col gap-5">
      <div>
        <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">Templates</h3>
        <p className="text-[12px] text-outline mt-1">Every template is free. Pick one, then fine-tune it in Customize.</p>
      </div>

      <div className="flex gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn(
              'px-3 py-1.5 rounded-full text-[11px] font-bold capitalize transition-colors',
              category === c ? 'bg-primary text-white' : 'bg-surface-container text-outline hover:text-on-surface',
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {previews.filter(({ t }) => category === 'all' || t.category === category).map(({ t, data }) => {
          const active = current.design.templateId === t.id
          return (
            <button
              key={t.id}
              onClick={() => updateDesign(t.design)}
              title={t.description}
              className={cn(
                'group text-left rounded-xl border-2 overflow-hidden bg-white transition-all hover:shadow-lg',
                active ? 'border-primary shadow-md' : 'border-outline-variant/40 hover:border-primary/40',
              )}
            >
              <div className="relative">
                <ResumeThumb data={data} width={168} />
                {active && (
                  <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
              <div className="px-3 py-2 border-t border-outline-variant/30">
                <div className="text-[12px] font-bold text-on-surface">{t.name}</div>
                <div className="text-[10px] text-outline capitalize">{t.category}</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
