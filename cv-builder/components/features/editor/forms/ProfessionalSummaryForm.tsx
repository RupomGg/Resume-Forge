'use client'

import { useCVStore } from '@/store/cv-store'
import RichTextEditor from '../RichTextEditor'

export default function ProfessionalSummaryForm() {
  const { summary, updateSummary } = useCVStore()

  return (
    <div className="p-4">
      <p className="text-xs text-gray-500 mb-3">
        Write a short (2-4 sentence) summary of your professional background and key achievements.
      </p>
      <RichTextEditor
        content={summary}
        onChange={updateSummary}
        placeholder="e.g. Results-driven Software Engineer with 5+ years of experience in..."
      />
    </div>
  )
}
