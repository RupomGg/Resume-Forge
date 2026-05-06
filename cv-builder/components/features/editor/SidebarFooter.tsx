'use client'

import { Check, RotateCcw, Save } from 'lucide-react'
import { useCVStore } from '@/store/cv-store'
import { useState, useEffect } from 'react'

export default function SidebarFooter() {
  const reset = useCVStore((s) => s.resetToDefaults)
  const [isSaved, setIsSaved] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null)

  useEffect(() => {
    // Set initial sync time only on client to avoid hydration mismatch
    setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
  }, [])

  const handleSave = () => {
    setIsSaved(true)
    setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    // Simulate save delay
    setTimeout(() => setIsSaved(false), 2000)
  }

  return (
    <div className="bg-surface-container-low border-t border-outline-variant p-4 flex flex-col gap-3 flex-shrink-0">
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
              reset()
            }
          }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-[11px] rounded-md border-[1.5px] border-outline bg-surface font-work-sans text-[13px] font-semibold text-on-surface-variant hover:bg-surface-container hover:border-on-surface-variant transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Discard
        </button>
        <button
          onClick={handleSave}
          className={`flex-[1.2] flex items-center justify-center gap-2 px-5 py-[11px] rounded-md font-manrope text-[13px] font-bold text-surface border-none shadow-level-1 transition-all active:scale-95 ${
            isSaved ? 'bg-secondary' : 'bg-primary-container hover:scale-[1.02] hover:shadow-level-2'
          }`}
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
      
      <div className="flex items-center gap-1.5 font-work-sans text-[11px] text-outline px-1">
        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        <span>Cloud synchronization active • Last sync {lastSyncTime || '--:--'}</span>
      </div>
    </div>
  )
}
