'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, FileText, PenLine, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import LeftPanel from './LeftPanel'
import RightPanel from './RightPanel'
import SectionManager from './SectionManager'
import { useCVStore } from '@/store/cv-store'
import { normalizeResume } from '@/store/initial-state'
import { useAutosave, waitForSave } from '@/store/autosave'
import { renameResume } from '@/lib/actions/resumes'
import type { CVData } from '@/models/cv.types'

interface Props {
  resumeId: string
  title: string
  data: CVData
}

export default function EditorShell({ resumeId, title: initialTitle, data }: Props) {
  // Load this resume into the (global) editor store before any panel renders.
  const hydrated = useRef(false)
  if (!hydrated.current) {
    useCVStore.setState({ ...normalizeResume(data), activeSectionId: null, activeEntryId: null, activeTab: 'content' })
    hydrated.current = true
  }
  useAutosave(resumeId)

  const [title, setTitle] = useState(initialTitle)
  const savedTitle = useRef(initialTitle)
  const [isManagerOpen, setIsManagerOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit')

  const commitTitle = async () => {
    const next = title.trim()
    if (!next) return setTitle(savedTitle.current)
    if (next === savedTitle.current) return
    const res = await renameResume(resumeId, next)
    if (res.ok) savedTitle.current = next
    else setTitle(savedTitle.current)
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    setDownloadError(null)
    try {
      // The PDF is rendered from saved data, so pending edits go first.
      if (!(await waitForSave())) throw new Error('Your latest changes could not be saved yet.')
      const res = await fetch(`/api/resumes/${resumeId}/pdf`)
      if (!res.ok) throw new Error(await res.text())
      const url = URL.createObjectURL(await res.blob())
      const a = document.createElement('a')
      a.href = url
      a.download = `${(savedTitle.current || 'resume').replace(/\s+/g, '_')}.pdf`
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (err) {
      setDownloadError(err instanceof Error && err.message ? err.message : 'Could not generate the PDF.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div id="editor-shell" className="flex flex-col h-screen overflow-hidden bg-surface">
      {/* ── Top Navigation Bar ─────────────────────────────────────── */}
      <nav
        id="editor-nav"
        className="flex items-center justify-between gap-4 px-4 md:px-6 border-b border-outline-variant/30 bg-surface-container-lowest flex-shrink-0 z-50 shadow-sm h-[60px]"
      >
        <div className="flex items-center gap-2 min-w-0">
          <Link
            href="/app/resumes"
            className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-surface-container text-on-surface-variant hover:text-primary flex-shrink-0"
            title="Back to my resumes"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden md:flex items-center justify-center w-10 h-10 rounded-xl hover:bg-surface-container text-on-surface-variant hover:text-primary flex-shrink-0"
            title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
          </button>
          <input
            aria-label="Resume title"
            value={title}
            maxLength={120}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            className="min-w-0 w-64 max-w-full px-2 py-1.5 rounded-lg bg-transparent font-manrope text-[15px] font-bold text-on-surface border border-transparent hover:border-outline-variant focus:border-primary outline-none truncate"
          />
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {downloadError && <span role="alert" className="hidden sm:block text-[12px] text-error max-w-[280px] truncate">{downloadError}</span>}
          <button
            id="download-pdf-btn"
            onClick={handleDownload}
            disabled={isDownloading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold font-manrope text-white bg-primary hover:bg-primary-container shadow-md transition-all active:scale-95 disabled:opacity-60 disabled:cursor-wait"
          >
            {isDownloading
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating…</>
              : <><Download className="w-4 h-4" />Download PDF</>}
          </button>
        </div>
      </nav>

      {/* ── Mobile Tab Bar ──────────────────────────────────────────── */}
      <div className="md:hidden flex border-b border-outline-variant bg-surface-container-low flex-shrink-0">
        {([['edit', 'Edit', PenLine], ['preview', 'Preview', FileText]] as const).map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => setMobileTab(id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold border-b-2 font-work-sans',
              mobileTab === id ? 'text-primary border-primary bg-secondary-container/20' : 'text-outline border-transparent',
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* ── Main Content Area ───────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden relative">
        <div
          className={cn(
            'h-full overflow-hidden transition-all duration-300 ease-in-out border-r border-outline-variant flex-shrink-0',
            isSidebarOpen ? 'md:w-[440px]' : 'md:w-0 md:border-none',
            mobileTab === 'preview' ? 'hidden md:block' : 'block w-full',
          )}
        >
          <div className="w-full h-full md:w-[440px]">
            <LeftPanel onManageClick={() => setIsManagerOpen(true)} />
          </div>
        </div>

        <div className={cn('flex-1 h-full overflow-hidden min-w-0', mobileTab === 'edit' ? 'hidden md:flex' : 'flex')}>
          <RightPanel />
        </div>
      </div>

      <SectionManager isOpen={isManagerOpen} onClose={() => setIsManagerOpen(false)} />
    </div>
  )
}
