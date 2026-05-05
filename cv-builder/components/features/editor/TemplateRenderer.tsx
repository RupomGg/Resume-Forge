'use client'

import { useState, useEffect } from 'react'
import { useCVStore } from '@/store/cv-store'
import { getTheme } from '@/lib/themes'
import { getFont } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Link as LinkIcon, 
  GitBranch 
} from 'lucide-react'

// ─── Helper: Font Loader ──────────────────────────────────────────────────────

function FontLoader({ fontId }: { fontId: string }) {
  const font = getFont(fontId)
  if (!font) return null
  
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      @import url('https://fonts.googleapis.com/css2?family=${font.googleFamily.replace(/ /g, '+')}:wght@300;400;500;600;700;800&display=swap');
    `}} />
  )
}

// ─── Shared Components ────────────────────────────────────────────────────────

const SectionTitle = ({ children, themeId, dividerStyle, templateId }: { children: React.ReactNode, themeId: string, dividerStyle: string, templateId: string }) => {
  const theme = getTheme(themeId)
  
  if (templateId === 'bold') {
    return (
      <div className="mb-5 flex items-center gap-4">
        <h2 className="text-sm font-black uppercase tracking-[0.3em] whitespace-nowrap" style={{ color: theme.accentColor }}>
          {children}
        </h2>
        <div className="flex-1 h-[4px]" style={{ backgroundColor: `${theme.accentColor}20` }} />
      </div>
    )
  }

  if (templateId === 'modern') {
    return (
      <div className="mb-4">
        <h2 
          className="text-sm font-bold uppercase tracking-[0.2em] mb-2 px-3 py-1 inline-block rounded"
          style={{ backgroundColor: `${theme.accentColor}15`, color: theme.accentColor }}
        >
          {children}
        </h2>
        <div className="w-full h-[1px] bg-gray-100" />
      </div>
    )
  }

  if (templateId === 'minimal') {
    return (
      <div className="mb-4 border-l-4 pl-4" style={{ borderColor: theme.accentColor }}>
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900">
          {children}
        </h2>
      </div>
    )
  }

  return (
    <div className="mb-3">
      <h2 
        className="text-sm font-bold uppercase tracking-wider mb-1"
        style={{ color: theme.sectionTitleColor }}
      >
        {children}
      </h2>
      <div 
        className={cn(
          "w-full bg-gray-200",
          dividerStyle === 'thin' ? "h-[1px]" : "h-[2px]"
        )}
        style={{ backgroundColor: theme.dividerColor }}
      />
    </div>
  )
}

// ─── Main Renderer ────────────────────────────────────────────────────────────

export default function TemplateRenderer() {
  const personal = useCVStore((s) => s.personal)
  const summary = useCVStore((s) => s.summary)
  const experience = useCVStore((s) => s.experience)
  const education = useCVStore((s) => s.education)
  const skills = useCVStore((s) => s.skills)
  const design = useCVStore((s) => s.design)
  const sectionOrder = useCVStore((s) => s.sectionOrder)

  const theme = getTheme(design.colorThemeId)
  
  const containerStyle: React.CSSProperties = {
    paddingTop: `${design.marginTop}mm`,
    paddingBottom: `${design.marginBottom}mm`,
    paddingLeft: `${design.marginLeft}mm`,
    paddingRight: `${design.marginRight}mm`,
    fontSize: `${design.fontSize || 10}pt`,
    lineHeight: design.lineHeight || 1.4,
    color: theme.bodyTextColor || '#000000',
    minHeight: '100%',
    backgroundColor: '#ffffff',
  }

  // ── Render Helpers ──────────────────────────────────────────────────────────

  const renderPersonal = () => {
    if (design.templateId === 'bold') {
      return (
        <header className="mb-10 flex gap-8 items-center">
          {personal.photoUrl && (
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl flex-shrink-0" style={{ backgroundColor: theme.accentColor }}>
              <img src={personal.photoUrl} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-5xl font-black uppercase tracking-tighter leading-none mb-2" style={{ color: theme.accentColor }}>
              {personal.fullName}
            </h1>
            <p className="text-xl font-bold text-gray-800 uppercase tracking-widest">{personal.jobTitle}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-[9pt] font-bold text-gray-500">
              {personal.email && <span className="flex items-center gap-1"><Mail width={14} height={14} className="w-3.5 h-3.5" /> {personal.email}</span>}
              {personal.location && <span className="flex items-center gap-1"><MapPin width={14} height={14} className="w-3.5 h-3.5" /> {personal.location}</span>}
            </div>
          </div>
        </header>
      )
    }

    if (design.templateId === 'modern') {
      return (
        <header className="mb-8 flex justify-between items-end border-b-2 pb-6" style={{ borderColor: theme.accentColor }}>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-1" style={{ color: theme.accentColor }}>
              {personal.fullName}
            </h1>
            <p className="text-lg font-medium text-gray-500 uppercase tracking-widest">{personal.jobTitle}</p>
          </div>
          <div className="text-right text-[9pt] space-y-1 text-gray-600 font-medium">
            {personal.email && <p>{personal.email}</p>}
            {personal.phone && <p>{personal.phone}</p>}
            {personal.location && <p>{personal.location}</p>}
          </div>
        </header>
      )
    }

    if (design.templateId === 'minimal') {
      return (
        <header className="mb-10">
          <h1 className="text-3xl font-light tracking-[0.15em] uppercase mb-4" style={{ color: '#000' }}>
            {personal.fullName}
          </h1>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[9pt] text-gray-500 border-t border-b py-3 font-medium">
            {personal.email && <span className="uppercase tracking-widest">{personal.email}</span>}
            {personal.phone && <span className="uppercase tracking-widest">{personal.phone}</span>}
            {personal.location && <span className="uppercase tracking-widest">{personal.location}</span>}
            {personal.website && <span className="uppercase tracking-widest">{personal.website}</span>}
          </div>
        </header>
      )
    }

    return (
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-1" style={{ color: theme.accentColor }}>
          {personal.fullName}
        </h1>
        <p className="text-sm font-medium text-gray-500 mb-3">{personal.jobTitle}</p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[9pt] text-gray-600 font-medium">
          {personal.email && <span className="flex items-center gap-1"><Mail width={12} height={12} className="w-3 h-3" /> {personal.email}</span>}
          {personal.phone && <span className="flex items-center gap-1"><Phone width={12} height={12} className="w-3 h-3" /> {personal.phone}</span>}
          {personal.location && <span className="flex items-center gap-1"><MapPin width={12} height={12} className="w-3 h-3" /> {personal.location}</span>}
          {personal.website && <span className="flex items-center gap-1"><Globe width={12} height={12} className="w-3 h-3" /> {personal.website}</span>}
        </div>
      </header>
    )
  }

  const renderSummary = () => (
    <div className="mb-6">
      <SectionTitle themeId={design.colorThemeId} dividerStyle={design.dividerStyle} templateId={design.templateId}>
        Professional Summary
      </SectionTitle>
      <div 
        className="prose prose-sm max-w-none text-inherit leading-relaxed"
        dangerouslySetInnerHTML={{ __html: summary }} 
      />
    </div>
  )

  const renderExperience = () => (
    <div className="mb-6">
      <SectionTitle themeId={design.colorThemeId} dividerStyle={design.dividerStyle} templateId={design.templateId}>
        Work Experience
      </SectionTitle>
      <div className="space-y-6">
        {experience.map((exp) => (
          <div key={exp.id} className="relative">
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="font-bold text-[11pt] text-gray-900">{exp.jobTitle}</h3>
              <span className="text-[9pt] font-semibold text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                {new Date(0, exp.startDate.month - 1).toLocaleString('en', { month: 'short' })} {exp.startDate.year} — {exp.currentlyWorking ? 'Present' : (exp.endDate?.year ? `${new Date(0, (exp.endDate?.month || 1) - 1).toLocaleString('en', { month: 'short' })} ${exp.endDate?.year}` : 'Present')}
              </span>
            </div>
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-[10pt] font-bold" style={{ color: theme.accentColor }}>{exp.company}</span>
              <span className="text-[9pt] text-gray-500 italic">{exp.location}</span>
            </div>
            <div 
              className="prose prose-sm max-w-none text-inherit"
              dangerouslySetInnerHTML={{ __html: exp.description }} 
            />
          </div>
        ))}
      </div>
    </div>
  )

  const renderEducation = () => (
    <div className="mb-6">
      <SectionTitle themeId={design.colorThemeId} dividerStyle={design.dividerStyle} templateId={design.templateId}>
        Education
      </SectionTitle>
      <div className="space-y-4">
        {education.map((edu) => (
          <div key={edu.id}>
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="font-bold text-[11pt] text-gray-900">{edu.degree}</h3>
              <span className="text-[9pt] text-gray-500">
                {new Date(0, edu.startDate.month - 1).toLocaleString('en', { month: 'short' })} {edu.startDate.year} — {edu.current ? 'Ongoing' : (edu.endDate?.year ? `${new Date(0, (edu.endDate?.month || 1) - 1).toLocaleString('en', { month: 'short' })} ${edu.endDate?.year}` : 'Ongoing')}
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[10pt] font-semibold" style={{ color: theme.accentColor }}>{edu.institution}</span>
              {edu.gpa && <span className="text-[9pt] font-bold text-gray-700">GPA: {edu.gpa}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderSkills = () => (
    <div className="mb-6">
      <SectionTitle themeId={design.colorThemeId} dividerStyle={design.dividerStyle} templateId={design.templateId}>
        Skills
      </SectionTitle>
      <div className="grid grid-cols-1 gap-3">
        {skills.categories.map((cat) => (
          <div key={cat.id} className="flex gap-4">
            <span className="font-bold text-[9pt] w-[140px] flex-shrink-0 uppercase tracking-wider text-gray-500">{cat.categoryName}</span>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5">
              {cat.items.map((item) => (
                <span key={item.id} className="text-[9pt] font-medium bg-gray-50 px-2.5 py-0.5 rounded border border-gray-100 inline-block mr-2 mb-1.5">
                  {item.skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // ── Template Dispatcher ──────────────────────────────────────────────────────

  const renderSection = (id: string) => {
    switch (id) {
      case 'personal': return renderPersonal()
      case 'summary': return renderSummary()
      case 'experience': return renderExperience()
      case 'education': return renderEducation()
      case 'skills': return renderSkills()
      default: return null
    }
  }

  // ── Layout Wrapper ──────────────────────────────────────────────────────────

  const renderWithLayout = () => {
    const isSidebarLayout = design.layout === 'sidebar-left' || design.layout === 'sidebar-right'
    const isLeft = design.layout === 'sidebar-left'
    const visibleSections = sectionOrder.filter(s => s.visible)

    if (isSidebarLayout) {
      // Logic for split layout: Personal info always top, rest split
      const sidebarSectionIds = ['skills', 'education'] // Custom logic could be more flexible
      const mainSections = visibleSections.filter(s => !sidebarSectionIds.includes(s.id) && s.id !== 'personal')
      const sidebarSections = visibleSections.filter(s => sidebarSectionIds.includes(s.id))

      return (
        <div className="flex flex-col h-full">
          {renderPersonal()}
          <div className={cn("flex flex-1 gap-12", isLeft ? "flex-row" : "flex-row-reverse")}>
            <div className="flex-1 space-y-6">
              {mainSections.map(s => <div key={s.id}>{renderSection(s.id)}</div>)}
            </div>
            <div className="w-[30%] space-y-6">
              {sidebarSections.map(s => <div key={s.id}>{renderSection(s.id)}</div>)}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {visibleSections.map(s => <div key={s.id}>{renderSection(s.id)}</div>)}
      </div>
    )
  }

  const font = getFont(design.fontId)

  return (
    <div 
      id="cv-preview-card"
      className="w-full h-full shadow-inner overflow-hidden"
      style={{
        ...containerStyle,
        fontFamily: font ? `'${font.googleFamily}', sans-serif` : 'sans-serif',
      }}
    >
      <FontLoader fontId={design.fontId} />
      {renderWithLayout()}
    </div>
  )
}
