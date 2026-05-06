'use client'

import { useState } from 'react'
import { 
  User, 
  AlignLeft, 
  Briefcase, 
  Wrench, 
  Folder, 
  Star, 
  GraduationCap, 
  FileBadge,
  Award,
  Heart,
  Globe,
  Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import SectionCard from '@/components/ui/SectionCard'
import SidebarHeader from './SidebarHeader'
import TopTabBar from './TopTabBar'
import SidebarFooter from './SidebarFooter'

import { 
  WorkExperienceForm, 
  EducationForm, 
  ResearchForm, 
  TrainingForm,
  PersonalSummaryForm,
  ProfessionalSummaryForm,
  ProjectForm,
  LanguageForm,
  InterestForm,
  CertificationForm,
  ReferenceForm
} from './forms/EntrySections'
import PersonalInfoForm from './forms/PersonalInfoForm'
import SkillsForm from './forms/SkillsForm'

import { useCVStore } from '@/store/cv-store'

const FORM_MAP: Record<string, React.ComponentType> = {
  personal: PersonalInfoForm,
  experience: WorkExperienceForm,
  education: EducationForm,
  research: ResearchForm,
  training: TrainingForm,
  projects: ProjectForm,
  skills: SkillsForm,
  languages: LanguageForm,
  interests: InterestForm,
  certifications: CertificationForm,
  references: ReferenceForm,
}

const ICON_MAP: Record<string, any> = {
  personal: User,
  experience: Briefcase,
  skills: Wrench,
  projects: Folder,
  research: Star,
  education: GraduationCap,
  certifications: FileBadge,
  awards: Award,
  volunteer: Heart,
  languages: Globe,
  interests: Heart,
}

interface LeftPanelProps {
  onManageClick: () => void
}

export default function LeftPanel({ onManageClick }: LeftPanelProps) {
  const { 
    sectionOrder, 
    toggleSection, 
    removeSection,
    updateSectionLabel,
    activeSectionId,
    setActiveSectionId,
    updateSectionStyle,
    experience, education, research, training, skills, projects, certifications, awards, volunteer, languages, interests 
  } = useCVStore()

  const toggle = (id: string) => {
    setActiveSectionId(activeSectionId === id ? null : id)
  }

  const handleDeleteSection = (id: string) => {
    if (confirm(`Are you sure you want to delete the "${id}" section? This will remove all its data.`)) {
      removeSection(id)
      if (activeSectionId === id) setActiveSectionId(null)
    }
  }

  const getBadgeCount = (id: string) => {
    switch(id) {
      case 'experience': return experience.length
      case 'education': return education.length
      case 'research': return research.length
      case 'training': return training.length
      case 'skills': return skills.categories.length
      case 'projects': return projects.length
      case 'certifications': return certifications.length
      case 'awards': return awards.length
      case 'volunteer': return volunteer.length
      case 'languages': return languages.length
      case 'interests': return interests.length
      default: return undefined
    }
  }

  const activeSection = sectionOrder.find(s => s.id === activeSectionId)

  return (
    <aside
      id="left-panel"
      className="flex flex-col h-full bg-surface overflow-hidden flex-shrink-0 transition-all duration-300"
      style={{ width: '100%' }}
    >
      <TopTabBar />
      <SidebarHeader />

      {/* Scrollable Section List */}
      <div 
        id="left-panel-scroll"
        className="flex-1 overflow-y-auto pt-2 pb-4"
      >
        {activeSection ? (
          <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-300">
            {/* Focus Mode Header */}
            <div className="px-5 py-4 flex items-center justify-between border-b border-outline-variant mb-4 bg-surface-container-low/50">
              <button 
                onClick={() => setActiveSectionId(null)}
                className="flex items-center gap-2 font-work-sans text-[13px] font-bold text-primary hover:text-primary-container transition-colors group"
              >
                <div className="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-3.5 h-3.5 rotate-45" />
                </div>
                Back to Sections
              </button>
              <div className="flex items-center gap-2">
                {!activeSection.visible && (
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-[10px] font-bold text-outline uppercase tracking-wider">
                    Hidden
                  </span>
                )}
                <span className="font-manrope text-[11px] font-bold text-outline uppercase tracking-widest">
                  Editing Section
                </span>
              </div>
            </div>

            {/* The Active Section Card (Always open in focus mode) */}
            <SectionCard
              id={activeSection.id}
              title={activeSection.label}
              icon={ICON_MAP[activeSection.id] || (activeSection.id.startsWith('pers-summary-') || activeSection.id === 'personal-summary' || activeSection.id.startsWith('prof-summary-') ? AlignLeft : ICON_MAP['custom'])}
              isOpen={true}
              onToggle={() => setActiveSectionId(null)}
              badge={getBadgeCount(activeSection.id)}
              visible={activeSection.visible}
              onVisibilityToggle={activeSection.id !== 'personal' ? (e) => {
                e.stopPropagation()
                toggleSection(activeSection.id)
              } : undefined}
              onDelete={activeSection.id !== 'personal' ? () => handleDeleteSection(activeSection.id) : undefined}
              onTitleChange={activeSection.id !== 'personal' ? (newTitle) => updateSectionLabel(activeSection.id, newTitle) : undefined}
              className={cn("mx-4 !shadow-none", !activeSection.visible && "opacity-75")}
            >
              {(() => {
                let FormComponent = FORM_MAP[activeSection.id]
                // Dynamic lookup for summaries
                if (!FormComponent) {
                  if (activeSection.id.startsWith('prof-summary-')) {
                    FormComponent = ProfessionalSummaryForm
                  } else if (activeSection.id.startsWith('pers-summary-') || activeSection.id === 'personal-summary') {
                    FormComponent = PersonalSummaryForm
                  }
                }
                
                return FormComponent ? (
                  <div className="p-2">
                    <FormComponent />
                  </div>
                ) : (
                  <div className="p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4">
                      <Plus className="w-8 h-8 text-outline-variant" />
                    </div>
                    <p className="font-work-sans text-sm text-outline italic">
                      Form for "{activeSection.label}" coming soon
                    </p>
                  </div>
                )
              })()}
            </SectionCard>
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            {/* Personal Group */}
            <div className="font-work-sans text-[11px] font-semibold text-outline uppercase tracking-[0.08em] px-5 py-[14px] pb-[6px]">
              Personal Information
            </div>
            {sectionOrder.filter(s => s.id === 'personal' || s.id === 'personal-summary' || s.id.startsWith('pers-summary-')).map((section) => (
              <SectionCard
                key={section.id}
                id={section.id}
                title={section.label}
                icon={ICON_MAP[section.id] || (section.id.startsWith('pers-summary-') || section.id === 'personal-summary' ? AlignLeft : ICON_MAP['custom'])}
                isOpen={false}
                onToggle={() => toggle(section.id)}
                visible={section.visible}
                onVisibilityToggle={section.id !== 'personal' ? (e) => {
                  e.stopPropagation()
                  toggleSection(section.id)
                } : undefined}
                onDelete={section.id !== 'personal' ? () => handleDeleteSection(section.id) : undefined}
                onTitleChange={section.id !== 'personal' ? (newTitle) => updateSectionLabel(section.id, newTitle) : undefined}
                className={!section.visible ? "opacity-50" : ""}
              />
            ))}

            {/* Content Group */}
            <div className="font-work-sans text-[11px] font-semibold text-outline uppercase tracking-[0.08em] px-5 py-[14px] pb-[6px] mt-4">
              Resume Sections
            </div>
            {sectionOrder.filter(s => !['personal', 'personal-summary'].includes(s.id) && !s.id.startsWith('pers-summary-')).map((section) => (
              <SectionCard
                key={section.id}
                id={section.id}
                title={section.label}
                icon={ICON_MAP[section.id] || (section.id.startsWith('prof-summary-') ? AlignLeft : ICON_MAP['custom'])}
                isOpen={false}
                onToggle={() => toggle(section.id)}
                badge={getBadgeCount(section.id)}
                visible={section.visible}
                onVisibilityToggle={(e) => {
                  e.stopPropagation()
                  toggleSection(section.id)
                }}
                onDelete={() => handleDeleteSection(section.id)}
                onTitleChange={(newTitle) => updateSectionLabel(section.id, newTitle)}
                className={!section.visible ? "opacity-50" : ""}
              />
            ))}
          </div>
        )}
      </div>

      <SidebarFooter />

      {/* Add Section Button (Only show when not in focus mode) */}
      {!activeSectionId && (
        <div className="p-[10px_12px_14px] bg-surface">
          <button
            onClick={onManageClick}
            className="w-full flex items-center justify-center gap-2 p-[11px] rounded-md border-[1.5px] border-dashed border-secondary-fixed-dim bg-none font-work-sans text-[13px] font-semibold text-on-surface-variant hover:border-primary-container hover:bg-secondary-container hover:text-primary transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            Add Section
          </button>
        </div>
      )}
    </aside>
  )
}

