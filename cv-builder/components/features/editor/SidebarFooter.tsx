'use client'

import { AlertCircle, Check, Loader2 } from 'lucide-react'
import { useSaveStatus } from '@/store/autosave'

export default function SidebarFooter() {
  const { status, error } = useSaveStatus()
  return (
    <div className="bg-surface-container-low border-t border-outline-variant px-5 py-3 flex items-center gap-2 font-work-sans text-[12px] text-outline flex-shrink-0" role="status">
      {status === 'saved' && <><Check className="w-3.5 h-3.5 text-primary" /> All changes saved</>}
      {(status === 'saving' || status === 'unsaved') && <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…</>}
      {status === 'error' && <><AlertCircle className="w-3.5 h-3.5 text-error" /> <span className="text-error">{error ?? 'Could not save.'} Your next edit will retry.</span></>}
    </div>
  )
}
