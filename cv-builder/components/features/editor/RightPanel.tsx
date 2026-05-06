'use client'

import { useCVStore } from '@/store/cv-store'
import { FileText } from 'lucide-react'
import TemplateRenderer from './TemplateRenderer'

const PAGE_META = {
  a4: { ratio: 1.4142, label: 'A4 (210 × 297 mm)' },
  letter: { ratio: 1.2941, label: 'Letter (8.5 × 11 in)' },
}

export default function RightPanel() {
  const design = useCVStore((s) => s.design)
  const pageSize = design?.pageSize || 'a4'
  const meta = PAGE_META[pageSize as keyof typeof PAGE_META] || PAGE_META.a4

  return (
    <div
      id="right-panel"
      className="flex-1 flex flex-col items-center overflow-y-auto py-10 px-8 gap-6 relative bg-[#E9EDF0]"
    >
      {/* Page size label */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 backdrop-blur-md border border-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] flex-shrink-0 animate-in fade-in zoom-in duration-500">
        <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
          <FileText className="w-3.5 h-3.5 text-primary" />
        </div>
        <span className="text-[11px] font-bold text-on-surface uppercase tracking-wider">{meta.label}</span>
      </div>

      {/* CV Preview Card */}
      <div
        id="cv-preview-container"
        className="w-full flex-shrink-0 relative bg-white group transition-all duration-500 ease-out"
        style={{
          maxWidth: '840px',
          aspectRatio: `1 / ${meta.ratio || 1.4142}`,
          boxShadow: '0 20px 80px rgba(0,0,0,0.12), 0 5px 20px rgba(0,0,0,0.05)',
          border: '1px solid rgba(0,0,0,0.03)',
        }}
      >
        {/* Subtle shadow overlay for depth */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.01)]" />
        
        <TemplateRenderer />
      </div>

      <div className="h-12 flex-shrink-0" />
    </div>
  )
}


