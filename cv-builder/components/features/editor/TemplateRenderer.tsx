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

import { useShallow } from 'zustand/react/shallow'

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
        <h2 
          className="text-sm font-black uppercase tracking-[0.3em] whitespace-nowrap"
          style={{ color: theme.accentColor }}
        >
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
  const {
    personal,
    personalSummaries,
    professionalSummaries,
    experience,
    education,
    research,
    training,
    references,
    languages,
    interests,
    projects,
    certifications,
    awards,
    volunteer,
    skills,
    design,
    sectionOrder
  } = useCVStore(useShallow((s) => ({
    personal: s.personal,
    personalSummaries: s.personalSummaries,
    professionalSummaries: s.professionalSummaries,
    experience: s.experience,
    education: s.education,
    research: s.research,
    training: s.training,
    references: s.references,
    languages: s.languages,
    interests: s.interests,
    projects: s.projects,
    certifications: s.certifications,
    awards: s.awards,
    volunteer: s.volunteer,
    skills: s.skills,
    design: s.design,
    sectionOrder: s.sectionOrder,
  })))

  const theme = getTheme(design.colorThemeId)

  // ─── Visibility Logic ───────────────────────────────────────────────────────
  
  const isEmptyHTML = (html: string) => {
    if (!html) return true
    const stripped = html.replace(/<[^>]*>/g, '').trim()
    return stripped.length === 0
  }

  const hasSectionContent = (id: string): boolean => {
    // Helper to check if any object in array has at least one non-empty value
    const hasData = (arr: any[]) => arr.some(item => 
      Object.entries(item).some(([key, val]) => {
        if (key === 'id' || key === 'visible') return false
        if (typeof val === 'string') return val.trim().length > 0
        if (typeof val === 'object' && val !== null) {
          if ('month' in val || 'year' in val) return (val as any).year > 0
          return Object.values(val).some(v => typeof v === 'string' && v.trim().length > 0)
        }
        return false
      })
    )

    if (id.startsWith('prof-summary-')) {
      const s = professionalSummaries.find(ps => ps.id === id)
      return !!s && !isEmptyHTML(s.content)
    }
    if (id.startsWith('pers-summary-') || id === 'personal-summary') {
      const s = personalSummaries.find(ps => ps.id === id)
      return !!s && !isEmptyHTML(s.content)
    }

    switch (id) {
      case 'personal': return true // Always show header
      case 'experience': return hasData(experience)
      case 'education': return hasData(education)
      case 'research': return hasData(research)
      case 'training': return hasData(training)
      case 'projects': return hasData(projects)
      case 'certifications': return hasData(certifications)
      case 'awards': return hasData(awards)
      case 'volunteer': return hasData(volunteer)
      case 'references': return hasData(references)
      case 'languages': return hasData(languages)
      case 'interests': return hasData(interests)
      case 'skills': 
        return skills.categories.some(c => c.categoryName.trim().length > 0 || !isEmptyHTML(c.description))
      default: return false
    }
  }
  
  const containerStyle: React.CSSProperties = {
    paddingTop: `${design.marginTop}mm`,
    paddingBottom: `${design.marginBottom}mm`,
    paddingLeft: `${design.marginLeft}mm`,
    paddingRight: `${design.marginRight}mm`,
    fontSize: `${design.fontSize || 10}pt`,
    lineHeight: design.lineHeight || 1.4,
    color: theme.bodyTextColor || '#000000',
    minHeight: '100%',
    backgroundColor: '#ffffff', // CV must always be pure white regardless of website theme
  }

  const formatMonthYear = (date: { month: number, year: number }) => 
    `${new Date(0, date.month - 1).toLocaleString('en', { month: 'short' })} ${date.year}`

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

  const renderPersonalSummary = (id: string, label: string) => {
    const summary = personalSummaries.find(ps => ps.id === id)
    if (!summary || !summary.visible) return null

    return (
      <div className="mb-6">
        <SectionTitle themeId={design.colorThemeId} dividerStyle={design.dividerStyle} templateId={design.templateId}>
          {label}
        </SectionTitle>
        <div 
          className="prose prose-sm max-w-none text-inherit leading-relaxed"
          dangerouslySetInnerHTML={{ __html: summary.content }} 
        />
      </div>
    )
  }

  const renderProfessionalSummary = (id: string, label: string) => {
    const summary = professionalSummaries.find(ps => ps.id === id)
    if (!summary || !summary.visible) return null
    
    return (
      <div className="mb-6">
        <SectionTitle themeId={design.colorThemeId} dividerStyle={design.dividerStyle} templateId={design.templateId}>
          {label}
        </SectionTitle>
        <div 
          className="prose prose-sm max-w-none text-inherit leading-relaxed"
          dangerouslySetInnerHTML={{ __html: summary.content }} 
        />
      </div>
    )
  }

  const renderExperience = (label: string) => (
    <div className="mb-6">
      <SectionTitle themeId={design.colorThemeId} dividerStyle={design.dividerStyle} templateId={design.templateId}>
        {label}
      </SectionTitle>
      <div className="space-y-6">
        {experience.map((exp) => (
          <div key={exp.id} className="relative">
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="font-bold text-[11pt] text-gray-900">{exp.jobTitle}</h3>
              <span className="text-[9pt] font-semibold text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                {formatMonthYear(exp.startDate)} — {exp.currentlyWorking ? 'Present' : (exp.endDate?.year ? formatMonthYear(exp.endDate) : 'Present')}
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

  const renderEducation = (label: string) => (
    <div className="mb-6">
      <SectionTitle themeId={design.colorThemeId} dividerStyle={design.dividerStyle} templateId={design.templateId}>
        {label}
      </SectionTitle>
      <div className="space-y-4">
        {education.map((edu) => (
          <div key={edu.id}>
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="font-bold text-[11pt] text-gray-900">{edu.degree}</h3>
              <span className="text-[9pt] text-gray-500">
                {formatMonthYear(edu.startDate)} — {edu.current ? 'Ongoing' : (edu.endDate?.year ? formatMonthYear(edu.endDate) : 'Ongoing')}
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[10pt] font-semibold" style={{ color: theme.accentColor }}>{edu.institution}</span>
              {edu.gpa && <span className="text-[9pt] font-bold text-gray-700">GPA: {edu.gpa}</span>}
            </div>
            {edu.description && (
              <div 
                className="prose prose-sm max-w-none text-inherit mt-2"
                dangerouslySetInnerHTML={{ __html: edu.description }} 
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const renderSkills = (label: string) => (
    <div className="mb-6">
      <SectionTitle themeId={design.colorThemeId} dividerStyle={design.dividerStyle} templateId={design.templateId}>
        {label}
      </SectionTitle>
      <div className="grid grid-cols-1 gap-4">
        {skills.categories.filter(c => c.visible).map((cat) => (
          <div key={cat.id} className="flex flex-col gap-1">
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-[10pt] uppercase tracking-wider" style={{ color: theme.accentColor }}>
                {cat.categoryName}
              </span>
              {cat.level && cat.level !== 'none' && (
                <span className="text-[8pt] font-semibold text-gray-400 italic capitalize">
                  {cat.level}
                </span>
              )}
            </div>
            <div 
              className="prose prose-sm max-w-none text-[9pt] text-inherit leading-relaxed"
              dangerouslySetInnerHTML={{ __html: cat.description }} 
            />
          </div>
        ))}
      </div>
    </div>
  )

  const renderResearch = (label: string) => (
    <div className="mb-6">
      <SectionTitle themeId={design.colorThemeId} dividerStyle={design.dividerStyle} templateId={design.templateId}>
        {label}
      </SectionTitle>
      <div className="space-y-6">
        {research.map((res) => (
          <div key={res.id} className="relative">
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="font-bold text-[11pt] text-gray-900">{res.title}</h3>
              <span className="text-[9pt] font-semibold text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                {formatMonthYear(res.startDate)} — {res.current ? 'Present' : (res.endDate?.year ? formatMonthYear(res.endDate) : 'Present')}
              </span>
            </div>
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-[10pt] font-bold" style={{ color: theme.accentColor }}>{res.institution}</span>
              <span className="text-[9pt] text-gray-500 italic">{res.location}</span>
            </div>
            <div 
              className="prose prose-sm max-w-none text-inherit"
              dangerouslySetInnerHTML={{ __html: res.description }} 
            />
          </div>
        ))}
      </div>
    </div>
  )

  const renderTraining = (label: string) => (
    <div className="mb-6">
      <SectionTitle themeId={design.colorThemeId} dividerStyle={design.dividerStyle} templateId={design.templateId}>
        {label}
      </SectionTitle>
      <div className="space-y-4">
        {training.filter(t => t.visible).map((trn) => (
          <div key={trn.id}>
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="font-bold text-[11pt] text-gray-900">{trn.name}</h3>
              <span className="text-[9pt] font-semibold text-gray-500">
                {formatMonthYear(trn.startDate)} — {trn.current ? 'Present' : (trn.endDate?.year ? formatMonthYear(trn.endDate) : 'Present')}
              </span>
            </div>
            <div className="mb-2">
              <span className="text-[10pt] font-semibold" style={{ color: theme.accentColor }}>{trn.provider}</span>
            </div>
            {trn.description && (
              <div 
                className="prose prose-sm max-w-none text-inherit leading-relaxed"
                dangerouslySetInnerHTML={{ __html: trn.description }} 
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const renderCertifications = (label: string) => {
    return (
      <div className="mb-6">
        <SectionTitle themeId={design.colorThemeId} dividerStyle={design.dividerStyle} templateId={design.templateId}>
          {label}
        </SectionTitle>
        <div className="space-y-4">
          {certifications.filter(c => c.visible).map((cert) => (
            <div key={cert.id}>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-[11pt] text-gray-900">{cert.name}</h3>
                {cert.startDate && (
                  <span className="text-[9pt] font-semibold text-gray-500">
                    {formatMonthYear(cert.startDate)} {cert.endDate && `— ${formatMonthYear(cert.endDate)}`}
                  </span>
                )}
              </div>
              <div className="mb-2">
                <span className="text-[10pt] font-semibold" style={{ color: theme.accentColor }}>{cert.provider}</span>
              </div>
              {cert.description && (
                <div 
                  className="prose prose-sm max-w-none text-inherit leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: cert.description }} 
                />
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderReferences = (label: string) => {
    return (
      <div className="mb-6">
        <SectionTitle themeId={design.colorThemeId} dividerStyle={design.dividerStyle} templateId={design.templateId}>
          {label}
        </SectionTitle>
        <div className="grid grid-cols-2 gap-6">
          {references.filter(r => r.visible).map((ref) => (
            <div key={ref.id}>
              <h3 className="font-bold text-[11pt] text-gray-900 mb-1">{ref.name}</h3>
              <p className="text-[10pt] font-semibold" style={{ color: theme.accentColor }}>{ref.position}</p>
              <div className="text-[9pt] text-gray-600 mt-1 space-y-0.5">
                {ref.address && <p>{ref.address}</p>}
                {ref.email && <p>{ref.email}</p>}
                {ref.phone && <p>{ref.phone}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderLanguages = (label: string) => {
    return (
      <div className="mb-6">
        <SectionTitle themeId={design.colorThemeId} dividerStyle={design.dividerStyle} templateId={design.templateId}>
          {label}
        </SectionTitle>
        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
          {languages.filter(l => l.visible).map((lang) => (
            <div key={lang.id} className="flex justify-between items-baseline border-b border-gray-100 pb-1">
              <span className="font-bold text-[10pt] text-gray-800">{lang.name}</span>
              <span className="text-[9pt] text-gray-500 italic">{lang.description}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderInterests = (label: string) => {
    return (
      <div className="mb-6">
        <SectionTitle themeId={design.colorThemeId} dividerStyle={design.dividerStyle} templateId={design.templateId}>
          {label}
        </SectionTitle>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {interests.filter(i => i.visible).map((int) => (
            <div key={int.id} className="flex flex-col">
              <span className="font-bold text-[10pt] text-gray-800">{int.name}</span>
              {int.description && <span className="text-[8pt] text-gray-500">{int.description}</span>}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderProjects = (label: string) => (
    <div className="mb-6">
      <SectionTitle themeId={design.colorThemeId} dividerStyle={design.dividerStyle} templateId={design.templateId}>
        {label}
      </SectionTitle>
      <div className="space-y-6">
        {projects.filter(p => p.visible).map((project) => (
          <div key={project.id} className="relative">
            <div className="flex justify-between items-baseline mb-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[11pt] text-gray-900">{project.name}</h3>
                {project.url && (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-[8pt] text-primary hover:underline">
                    (Link)
                  </a>
                )}
              </div>
              {project.startDate && (
                <span className="text-[9pt] font-semibold text-gray-500">
                  {formatMonthYear(project.startDate)} — {project.endDate ? formatMonthYear(project.endDate) : 'Present'}
                </span>
              )}
            </div>
            {project.subtitle && (
              <div className="text-[10pt] font-semibold mb-2" style={{ color: theme.accentColor }}>
                {project.subtitle}
              </div>
            )}
            <div 
              className="prose prose-sm max-w-none text-inherit leading-relaxed"
              dangerouslySetInnerHTML={{ __html: project.description }} 
            />
          </div>
        ))}
      </div>
    </div>
  )

  // ── Template Dispatcher ──────────────────────────────────────────────────────

  const renderSection = (id: string, label: string) => {
    if (id.startsWith('prof-summary-')) return renderProfessionalSummary(id, label)
    if (id.startsWith('pers-summary-')) return renderPersonalSummary(id, label)

    switch (id) {
      case 'personal': return renderPersonal()
      case 'personal-summary': return renderPersonalSummary(id, label)
      case 'experience': return renderExperience(label)
      case 'education': return renderEducation(label)
      case 'research': return renderResearch(label)
      case 'training': return renderTraining(label)
      case 'projects': return renderProjects(label)
      case 'skills': return renderSkills(label)
      case 'certifications': return renderCertifications(label)
      case 'references': return renderReferences(label)
      case 'languages': return renderLanguages(label)
      case 'interests': return renderInterests(label)
      default: return null
    }
  }

  // ── Layout Wrapper ──────────────────────────────────────────────────────────

  const renderWithLayout = () => {
    const isSidebarLayout = design.layout === 'sidebar-left' || design.layout === 'sidebar-right'
    const isLeft = design.layout === 'sidebar-left'
    const visibleSections = sectionOrder.filter(s => s.visible && hasSectionContent(s.id))

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
              {mainSections.map(s => <div key={s.id}>{renderSection(s.id, s.label)}</div>)}
            </div>
            <div className="w-[30%] space-y-6">
              {sidebarSections.map(s => <div key={s.id}>{renderSection(s.id, s.label)}</div>)}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {visibleSections.map(s => <div key={s.id}>{renderSection(s.id, s.label)}</div>)}
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
