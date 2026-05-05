'use client'

import { useCVStore } from '@/lib/store'
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
      className="flex-1 flex flex-col items-center overflow-y-auto py-8 px-6 gap-4 relative bg-[#c8cdd4]"
    >
      {/* Page size label */}
      <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-white/90 px-3 py-1.5 rounded-full shadow flex-shrink-0">
        <FileText className="w-3.5 h-3.5 text-gray-400" />
        {meta.label}
      </div>

      {/* CV Preview Card */}
      <div
        id="cv-preview-container"
        className="w-full flex-shrink-0 relative bg-white"
        style={{
          maxWidth: '800px',
          aspectRatio: `1 / ${meta.ratio || 1.4142}`,
          boxShadow: '0 10px 50px rgba(0,0,0,0.2)',
          border: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <TemplateRenderer />
      </div>

      <div className="h-8 flex-shrink-0" />
    </div>
  )
}


