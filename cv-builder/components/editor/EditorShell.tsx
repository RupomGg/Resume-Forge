'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, Download, Wand2, Check, FileText, PenLine } from 'lucide-react'
import { cn } from '@/lib/utils'
import LeftPanel from './LeftPanel'
import RightPanel from './RightPanel'
import DesignPanel from './DesignPanel'
import SectionManager from './SectionManager'
import { useCVStore } from '@/lib/store'
import { downloadPdf } from '@/lib/pdf-utils'

export default function EditorShell() {
  const store = useCVStore()
  const [isDesignOpen, setIsDesignOpen] = useState(false)
  const [isManagerOpen, setIsManagerOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  // Mobile tab: 'edit' | 'preview'
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit')

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      await downloadPdf(store)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div
      id="editor-shell"
      className="flex flex-col h-screen overflow-hidden bg-white"
    >
      {/* ── Top Navigation Bar ─────────────────────────────────────── */}
      <nav
        id="editor-nav"
        className="flex items-center justify-between px-4 border-b border-gray-100 bg-white flex-shrink-0"
        style={{ height: '56px' }}
      >
        {/* Left: Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-gray-900 hidden sm:block tracking-tight">
            ResumeForge
          </span>
        </Link>

        {/* Center: Auto-save indicator (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-400">
          <Check className="w-3.5 h-3.5 text-green-500" />
          All changes saved
        </div>

        {/* Right: Action buttons */}
        <div className="flex items-center gap-2">
          {/* Design toggle */}
          <button
            id="design-panel-toggle"
            onClick={() => setIsDesignOpen((v) => !v)}
            className={cn(
              'hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border',
              isDesignOpen
                ? 'bg-violet-50 text-violet-700 border-violet-200 shadow-sm'
                : 'text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            )}
          >
            <Wand2 className="w-3.5 h-3.5" />
            Design
          </button>

          <button
            id="download-pdf-btn"
            onClick={handleDownload}
            disabled={isDownloading}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.02] disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed",
              isDownloading ? "bg-gray-400" : "bg-gradient-to-r from-blue-600 to-indigo-600"
            )}
          >
            {isDownloading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download PDF</span>
                <span className="sm:hidden">PDF</span>
              </>
            )}
          </button>
        </div>
      </nav>

      {/* ── Mobile Tab Bar ──────────────────────────────────────────── */}
      <div className="md:hidden flex border-b border-gray-100 bg-white flex-shrink-0">
        <button
          id="mobile-tab-edit"
          onClick={() => setMobileTab('edit')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold transition-all duration-200 border-b-2',
            mobileTab === 'edit'
              ? 'text-blue-600 border-blue-500 bg-blue-50'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          )}
        >
          <PenLine className="w-4 h-4" />
          Edit
        </button>
        <button
          id="mobile-tab-preview"
          onClick={() => setMobileTab('preview')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold transition-all duration-200 border-b-2',
            mobileTab === 'preview'
              ? 'text-blue-600 border-blue-500 bg-blue-50'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          )}
        >
          <FileText className="w-4 h-4" />
          Preview
        </button>
      </div>

      {/* ── Main Content Area ───────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        <div
          className={cn(
            'h-full overflow-hidden transition-all duration-200',
            // Desktop: fixed width, always flex
            'md:flex md:flex-shrink-0 md:w-[480px] lg:w-[520px]',
            // Mobile: full width, hidden when on preview tab
            mobileTab === 'preview' ? 'hidden md:flex' : 'flex w-full'
          )}
        >
          <LeftPanel onManageClick={() => setIsManagerOpen(true)} />
        </div>

        {/* Right Panel — hidden on mobile when edit tab is active */}
        <div
          className={cn(
            'flex-1 h-full overflow-hidden',
            // Mobile: hidden when on edit tab
            mobileTab === 'edit' ? 'hidden md:flex' : 'flex'
          )}
        >
          <RightPanel />
        </div>
      </div>

      {/* ── Design Panel (bottom drawer) ─────────────────────────── */}
      <DesignPanel isOpen={isDesignOpen} />

      {/* ── Section Manager (side drawer) ───────────────────────── */}
      <SectionManager 
        isOpen={isManagerOpen} 
        onClose={() => setIsManagerOpen(false)} 
      />
    </div>
  )
}

