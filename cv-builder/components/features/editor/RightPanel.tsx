'use client'

import { useState, useEffect, useRef } from 'react'
import { useCVStore } from '@/store/cv-store'
import { FileText, Eye, Download, Loader2 } from 'lucide-react'
import TemplateRenderer from './TemplateRenderer'
import { generatePdfBlob } from '@/services/api/pdf.service'
import { cn } from '@/lib/utils'
import { useShallow } from 'zustand/react/shallow'

const PAGE_META = {
  a4: { ratio: 1.4142, label: 'A4 (210 × 297 mm)' },
  letter: { ratio: 1.2941, label: 'Letter (8.5 × 11 in)' },
}

export default function RightPanel() {
  const store = useCVStore(useShallow((s) => ({
    design: s.design,
    personal: s.personal,
    experience: s.experience,
    education: s.education,
    projects: s.projects,
    sectionOrder: s.sectionOrder
  })))

  const [previewMode, setPreviewMode] = useState<'ui' | 'pdf'>('ui')
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const pageSize = store.design?.pageSize || 'a4'
  const meta = PAGE_META[pageSize as keyof typeof PAGE_META] || PAGE_META.a4

  // Function to generate PDF blob and URL
  const generatePdfPreview = async () => {
    try {
      setIsGenerating(true)
      const fullState = useCVStore.getState()
      const blob = await generatePdfBlob(fullState as any)
      if (blob) {
        if (pdfUrl) URL.revokeObjectURL(pdfUrl)
        const url = URL.createObjectURL(blob)
        setPdfUrl(url)
      }
    } catch (error) {
      console.error('PDF Generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Debounced PDF generation when design or content changes
  useEffect(() => {
    if (previewMode !== 'pdf') return

    if (timerRef.current) clearTimeout(timerRef.current)
    
    timerRef.current = setTimeout(() => {
      generatePdfPreview()
    }, 1200) // Slightly longer debounce for PDF

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [store, previewMode])

  // Cleanup PDF URL on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl)
    }
  }, [pdfUrl])

  return (
    <div
      id="right-panel"
      className="flex-1 flex flex-col items-center overflow-y-auto py-10 px-8 gap-6 relative bg-[#E9EDF0]"
    >
      {/* Control Bar */}
      <div className="flex items-center gap-4 sticky top-0 z-20">
        {/* Page size label */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 backdrop-blur-md border border-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] flex-shrink-0">
          <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-[11px] font-bold text-on-surface uppercase tracking-wider">{meta.label}</span>
        </div>

        {/* View Toggle */}
        <div className="flex bg-white/80 backdrop-blur-md p-1 rounded-xl border border-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          <button
            onClick={() => setPreviewMode('ui')}
            className={cn(
              "px-4 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-2",
              previewMode === 'ui' ? "bg-primary text-white shadow-md" : "text-outline hover:text-on-surface"
            )}
          >
            <Eye className="w-3.5 h-3.5" />
            UI Preview
          </button>
          <button
            onClick={() => setPreviewMode('pdf')}
            className={cn(
              "px-4 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-2",
              previewMode === 'pdf' ? "bg-primary text-white shadow-md" : "text-outline hover:text-on-surface"
            )}
          >
            <Download className="w-3.5 h-3.5" />
            PDF Preview
          </button>
        </div>
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
        
        {/* Keep UI always rendered but hidden in PDF mode to allow capturing its HTML */}
        <div className={cn("w-full h-full", previewMode !== 'ui' && "hidden")}>
          <TemplateRenderer />
        </div>

        {previewMode === 'pdf' && (
          <div className="w-full h-full relative bg-gray-100 flex flex-col items-center justify-center overflow-hidden">
            {isGenerating && (
              <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-xs font-bold text-primary uppercase tracking-widest">Syncing PDF...</p>
              </div>
            )}
            {pdfUrl ? (
              <iframe src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`} className="w-full h-full border-none" />
            ) : (
              !isGenerating && (
                <div className="flex flex-col items-center gap-4 text-outline">
                  <Download className="w-12 h-12 opacity-20" />
                  <p className="text-sm font-medium">Initializing PDF Preview...</p>
                </div>
              )
            )}
          </div>
        )}
      </div>

      <div className="h-12 flex-shrink-0" />
    </div>
  )
}
