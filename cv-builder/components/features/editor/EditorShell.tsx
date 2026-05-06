'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, Download, Wand2, Check, FileText, PenLine, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import LeftPanel from './LeftPanel'
import RightPanel from './RightPanel'
import DesignPanel from './DesignPanel'
import SectionManager from './SectionManager'
import { useCVStore } from '@/store/cv-store'
import { downloadPdf } from '@/services/api/pdf.service'

export default function EditorShell() {
  const store = useCVStore()
  const [isDesignOpen, setIsDesignOpen] = useState(false)
  const [isManagerOpen, setIsManagerOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  
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
      className="flex flex-col h-screen overflow-hidden bg-surface"
    >
      {/* ── Top Navigation Bar ─────────────────────────────────────── */}
      <nav
        id="editor-nav"
        className="flex items-center justify-between px-8 border-b border-outline-variant/30 bg-surface-container-lowest/90 backdrop-blur-xl flex-shrink-0 z-50 shadow-sm"
        style={{ height: '68px' }}
      >
        {/* Left: Logo & Sidebar Toggle */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden md:flex items-center justify-center w-10 h-10 rounded-xl hover:bg-surface-container transition-all duration-300 text-on-surface-variant hover:text-primary active:scale-95"
            title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
          </button>

          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 group"
          >
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-500">
              <Sparkles className="w-4.5 h-4.5 text-surface" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[15px] font-black text-on-surface tracking-tight font-manrope">
                ResumeForge
              </span>
              <span className="text-[10px] font-bold text-outline uppercase tracking-[0.15em] font-work-sans mt-0.5 opacity-60">
                PRO EDITION
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Action buttons */}
        <div className="flex items-center gap-4">
          {/* Auto-save indicator */}
          <div className="hidden lg:flex items-center gap-2.5 px-4 py-2 rounded-full bg-secondary-container/20 border border-secondary-container/30 text-[11px] font-bold text-secondary uppercase tracking-wider">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-primary animate-ping absolute opacity-75" />
              <div className="w-2 h-2 rounded-full bg-primary relative" />
            </div>
            Synced
          </div>

          <div className="h-8 w-px bg-outline-variant/40 mx-2 hidden md:block" />

          {/* Design toggle */}
          <button
            id="design-panel-toggle"
            onClick={() => setIsDesignOpen((v) => !v)}
            className={cn(
              'hidden md:inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-bold font-work-sans transition-all duration-300 border shadow-sm active:scale-95',
              isDesignOpen
                ? 'bg-primary text-surface border-primary shadow-lg shadow-primary/25'
                : 'bg-surface border-outline-variant/60 text-on-surface-variant hover:border-primary/50 hover:text-primary hover:bg-surface-container-low'
            )}
          >
            <Wand2 className="w-4 h-4" />
            Appearance
          </button>

          <button
            id="download-pdf-btn"
            onClick={handleDownload}
            disabled={isDownloading}
            className={cn(
              "inline-flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-xs font-bold font-manrope text-surface transition-all duration-300 shadow-md hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100",
              isDownloading ? "bg-outline" : "bg-primary shadow-primary/20 hover:bg-primary-container"
            )}
          >
            {isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-surface/30 border-t-surface rounded-full animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>
      </nav>

      {/* ── Mobile Tab Bar ──────────────────────────────────────────── */}
      <div className="md:hidden flex border-b border-outline-variant bg-surface-container-low flex-shrink-0">
        <button
          onClick={() => setMobileTab('edit')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold transition-all border-b-2 font-work-sans',
            mobileTab === 'edit'
              ? 'text-primary border-primary bg-secondary-container/20'
              : 'text-outline border-transparent'
          )}
        >
          <PenLine className="w-4 h-4" />
          Edit Content
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold transition-all border-b-2 font-work-sans',
            mobileTab === 'preview'
              ? 'text-primary border-primary bg-secondary-container/20'
              : 'text-outline border-transparent'
          )}
        >
          <FileText className="w-4 h-4" />
          Preview
        </button>
      </div>

      {/* ── Main Content Area ───────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar */}
        <div
          className={cn(
            'h-full overflow-hidden transition-all duration-300 ease-in-out border-r border-outline-variant',
            // Desktop width: 30% when open, 0 when closed
            isSidebarOpen ? 'md:w-[30%]' : 'md:w-0 md:border-none',
            // Mobile: full width, hidden when on preview tab
            mobileTab === 'preview' ? 'hidden md:block' : 'block w-full'
          )}
        >
          <div className="w-full h-full min-w-[400px]">
            <LeftPanel onManageClick={() => setIsManagerOpen(true)} />
          </div>
        </div>

        {/* Right Panel — Preview */}
        <div
          className={cn(
            'flex-1 h-full overflow-hidden bg-surface-container',
            // Mobile: hidden when on edit tab
            mobileTab === 'edit' ? 'hidden md:flex' : 'flex'
          )}
        >
          <RightPanel />
        </div>

        {/* Floating Toggle (when sidebar is hidden) */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="hidden md:flex absolute left-4 top-4 z-40 w-10 h-10 rounded-full bg-primary-container text-surface shadow-level-3 items-center justify-center hover:scale-110 transition-all active:scale-100"
            title="Show Sidebar"
          >
            <PanelLeftOpen className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* ── Bottom Drawers ─────────────────────────── */}
      <DesignPanel isOpen={isDesignOpen} />
      <SectionManager 
        isOpen={isManagerOpen} 
        onClose={() => setIsManagerOpen(false)} 
      />
    </div>
  )
}

