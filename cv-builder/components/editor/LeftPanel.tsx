'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import SectionCard from '@/components/ui/SectionCard'

import PersonalInfoForm from './forms/PersonalInfoForm'
import ProfessionalSummaryForm from './forms/ProfessionalSummaryForm'
import WorkExperienceForm from './forms/WorkExperienceForm'
import EducationForm from './forms/EducationForm'
import SkillsForm from './forms/SkillsForm'

import { useCVStore } from '@/lib/store'

const FORM_MAP: Record<string, React.ComponentType> = {
  personal: PersonalInfoForm,
  summary: ProfessionalSummaryForm,
  experience: WorkExperienceForm,
  education: EducationForm,
  skills: SkillsForm,
}

interface LeftPanelProps {
  onManageClick: () => void
}

export default function LeftPanel({ onManageClick }: LeftPanelProps) {
  const { sectionOrder } = useCVStore()
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    personal: true, // open by default
  })

  function toggle(id: string) {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // Filter sections that should be visible in the editor
  const visibleSections = sectionOrder.filter((s) => s.visible)

  return (
    <aside
      id="left-panel"
      className="flex flex-col h-full bg-[#f8f9fa] border-r border-gray-200 overflow-hidden"
      style={{ width: '420px', minWidth: '420px' }}
    >
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white flex-shrink-0">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Sections
        </span>
        <button
          id="manage-sections-btn"
          onClick={onManageClick}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Manage
        </button>
      </div>

      {/* Scrollable section list */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {visibleSections.map((section) => {
          const FormComponent = FORM_MAP[section.id]
          return (
            <SectionCard
              key={section.id}
              title={section.label}
              isOpen={!!openSections[section.id]}
              onToggle={() => toggle(section.id)}
            >
              {FormComponent ? (
                <FormComponent />
              ) : (
                <div className="px-4 py-5">
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-100 rounded-md w-3/4 animate-pulse" />
                    <div className="h-3 bg-gray-100 rounded-md w-full animate-pulse" />
                    <div className="h-3 bg-gray-100 rounded-md w-2/3 animate-pulse" />
                  </div>
                  <p className="text-xs text-gray-400 mt-3 italic">
                    Form for "{section.label}" coming in Phase 12
                  </p>
                </div>
              )}
            </SectionCard>
          )
        })}

        {/* Add Section Button */}
        <button
          id="add-section-btn"
          onClick={onManageClick}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-all duration-200 hover:bg-blue-50"
        >
          <Plus className="w-4 h-4" />
          Add / Manage Sections
        </button>
      </div>
    </aside>
  )
}

