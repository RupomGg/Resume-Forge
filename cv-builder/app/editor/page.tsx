'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCVStore } from '@/store/cv-store'
import EditorShell from '@/components/features/editor/EditorShell'

/** Inner component — must be inside <Suspense> because it uses useSearchParams */
function EditorInner() {
  const searchParams = useSearchParams()
  const updateDesign = useCVStore((s) => s.updateDesign)

  useEffect(() => {
    const template = searchParams.get('template')
    const validTemplates = ['classic', 'modern', 'minimal', 'bold', 'sidebar']
    if (template && validTemplates.includes(template)) {
      updateDesign({ templateId: template })
    }
  }, [searchParams, updateDesign])

  return <EditorShell />
}

/** Loading skeleton shown while Suspense resolves */
function EditorSkeleton() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 animate-pulse" />
        <p className="text-sm text-gray-400 animate-pulse">Loading editor…</p>
      </div>
    </div>
  )
}

export default function EditorPage() {
  return (
    <Suspense fallback={<EditorSkeleton />}>
      <EditorInner />
    </Suspense>
  )
}
