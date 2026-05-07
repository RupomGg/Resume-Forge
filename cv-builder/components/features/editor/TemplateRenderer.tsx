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

const SectionTitle = ({ children, themeId, dividerStyle, templateId, applyAccentTo }: { 
  children: React.ReactNode, 
  themeId: string, 
  dividerStyle: string, 
  templateId: string,
  applyAccentTo: any 
}) => {
  const theme = getTheme(themeId)
  const headingColor = applyAccentTo?.headings ? theme.accentColor : theme.sectionTitleColor
  
  if (templateId === 'bold') {
    return (
      <div className="mb-5 flex items-center gap-4">
        <h2 
          className="text-sm font-black uppercase tracking-[0.3em] whitespace-nowrap"
          style={{ color: headingColor }}
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
          style={{ backgroundColor: `${theme.accentColor}15`, color: headingColor }}
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
        <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: headingColor }}>
          {children}
        </h2>
      </div>
    )
  }

  return (
    <div className="mb-3">
      <h2 
        className="text-sm font-bold uppercase tracking-wider mb-1"
        style={{ color: headingColor }}
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

const ListStyles = ({ style }: { style: string }) => {
  let listStyleType = 'disc'
  if (style === 'dash') listStyleType = '"- "'
  if (style === 'check') listStyleType = '"✓ "'
  if (style === 'none') listStyleType = 'none'

  return (
    <style dangerouslySetInnerHTML={{ __html: `
      #cv-preview-card .description-content ul { 
        list-style-type: ${listStyleType} !important; 
        padding-left: 1.2em !important;
      }
      #cv-preview-card .description-content li {
        margin-bottom: 0.25em;
      }
    `}} />
  )
}

const VariationStyles = ({ variation }: { variation: string }) => {
  if (variation === 'compact') {
    return (
      <style dangerouslySetInnerHTML={{ __html: `
        #cv-preview-card.compact-mode .entry-item { margin-bottom: 0.75rem !important; }
        #cv-preview-card.compact-mode .description-content { margin-top: 0.25rem !important; }
        #cv-preview-card.compact-mode h3 { line-height: 1.1 !important; }
        #cv-preview-card.compact-mode .mb-6 { margin-bottom: 1rem !important; }
      `}} />
    )
  }
  if (variation === 'modern') {
    return (
      <style dangerouslySetInnerHTML={{ __html: `
        #cv-preview-card.modern-mode .entry-item { 
          border-left: 2px solid #e5e7eb; 
          padding-left: 1rem;
          margin-bottom: 1.5rem;
        }
      `}} />
    )
  }
  return null
}

const EntryLayout = ({ 
  title, 
  subtitle, 
  date, 
  location, 
  description, 
  design, 
  theme 
}: { 
  title: string, 
  subtitle?: string, 
  date?: string, 
  location?: string, 
  description?: string, 
  design: any, 
  theme: any 
}) => {
  const titleColor = design.applyAccentTo.jobTitle ? theme.accentColor : '#111827'
  const subtitleColor = design.applyAccentTo.entrySubtitle ? theme.accentColor : '#1f2937'
  const dateColor = design.applyAccentTo.dates ? theme.accentColor : '#6b7280'
  
  const subtitleStyles = cn(
    design.subtitleStyle === 'italic' && 'italic',
    design.subtitleStyle === 'bold' && 'font-bold',
    design.subtitleStyle === 'bold-italic' && 'font-bold italic'
  )

  const renderSubtitle = () => subtitle && (
    <span 
      className={cn("leading-tight", subtitleStyles)} 
      style={{ color: subtitleColor, fontSize: `${design.subtitleSize}pt` }}
    >
      {subtitle}
    </span>
  )

  const renderDate = () => date && (
    <span 
      className="font-semibold whitespace-nowrap"
      style={{ color: dateColor, fontSize: `${design.fontSize * 0.9}pt` }}
    >
      {date}
    </span>
  )

  const layoutId = design.entryLayoutId || 'layout-4'

  const renderLocation = () => location && (
    <span className="text-gray-500 italic" style={{ fontSize: `${design.fontSize * 0.9}pt` }}>
      {location}
    </span>
  )

  const renderDescription = () => description && (
    <div 
      className="description-content prose prose-sm max-w-none text-inherit mt-2"
      style={{ paddingLeft: `${design.descriptionIndentation}px` }}
      dangerouslySetInnerHTML={{ __html: description }} 
    />
  )

  const renderTitleBlock = (fullWidth = false) => (
    <div className={cn(fullWidth ? "w-full" : "flex-1")}>
      <h3 
        className="font-bold leading-tight" 
        style={{ color: titleColor, fontSize: `${design.titleSize}pt` }}
      >
        {title}
        {design.subtitlePlacement === 'beside-title' && subtitle && (
          <>
            <span className="mx-2 text-gray-300 font-normal">|</span>
            {renderSubtitle()}
          </>
        )}
      </h3>
      {design.subtitlePlacement === 'below-title' && (
        <div className="mt-0.5">{renderSubtitle()}</div>
      )}
    </div>
  )

  // ─── Layout Implementations ──────────────────────────────────────────────────

  if (layoutId === 'layout-1') {
    return (
      <div className="entry-item mb-4">
        <div className="flex justify-between items-start gap-6">
          <div className="flex-1">
            {renderTitleBlock(true)}
            {renderDescription()}
          </div>
          <div className="flex flex-col items-end text-right shrink-0 min-w-[120px] pt-1">
            {renderDate()}
            {renderLocation()}
            {design.subtitlePlacement === 'right-aligned' && (
              <div className="mt-1">{renderSubtitle()}</div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (layoutId === 'layout-2') {
    return (
      <div className="entry-item mb-4 flex gap-6">
        <div className="w-1/4 shrink-0 flex flex-col pt-1">
          {renderDate()}
          {renderLocation()}
        </div>
        <div className="flex-1">
          {renderTitleBlock(true)}
          {design.subtitlePlacement === 'right-aligned' && (
             <div className="mt-0.5">{renderSubtitle()}</div>
          )}
          {renderDescription()}
        </div>
      </div>
    )
  }

  if (layoutId === 'layout-3') {
    return (
      <div className="entry-item mb-6">
        <div className="flex gap-4">
          {/* Left: Date */}
          <div className="w-[110px] shrink-0 pt-0.5">
            {renderDate()}
          </div>

          {/* Center: Title, Subtitle, Description */}
          <div className="flex-1">
            {renderTitleBlock(true)}
            {design.subtitlePlacement === 'right-aligned' && (
              <div className="mt-0.5">{renderSubtitle()}</div>
            )}
            {renderDescription()}
          </div>

          {/* Right: Location */}
          <div className="w-1/4 text-right pt-0.5 shrink-0">
            {renderLocation()}
          </div>
        </div>
      </div>
    )
  }

  // Default: layout-4 (Stacked List / 2x2 Grid)
  return (
    <div className="entry-item mb-6">
      <div className="flex justify-between items-baseline gap-4">
        <h3 
          className="font-bold leading-tight flex-1" 
          style={{ color: titleColor, fontSize: `${design.titleSize}pt` }}
        >
          {title}
        </h3>
        <div className="shrink-0">
          {renderDate()}
        </div>
      </div>
      {(subtitle || location) && (
        <div className="flex justify-between items-baseline mt-0.5 gap-4">
          <div className="flex-1">
            {renderSubtitle()}
          </div>
          <div className="shrink-0 text-right">
            {renderLocation()}
          </div>
        </div>
      )}
      {renderDescription()}
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
      case 'personal': return true
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
    backgroundColor: '#ffffff',
  }

  const formatMonthYear = (date: { month: number, year: number }) => 
    `${new Date(0, date.month - 1).toLocaleString('en', { month: 'short' })} ${date.year}`

  // ── Render Helpers ──────────────────────────────────────────────────────────

  const renderPersonal = () => {
    const nameColor = design.applyAccentTo.name ? theme.accentColor : '#000000'
    const jobTitleColor = design.applyAccentTo.jobTitle ? theme.accentColor : '#4b5563'
    const iconColor = design.applyAccentTo.headerIcons ? theme.accentColor : '#9ca3af'

    if (design.templateId === 'bold') {
      return (
        <header className="mb-10 flex gap-8 items-center">
          {personal.photoUrl && (
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl flex-shrink-0" style={{ backgroundColor: theme.accentColor }}>
              <img src={personal.photoUrl} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-5xl font-black uppercase tracking-tighter leading-none mb-2" style={{ color: nameColor }}>
              {personal.fullName}
            </h1>
            <p className="text-xl font-bold uppercase tracking-widest" style={{ color: jobTitleColor }}>{personal.jobTitle}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-[9pt] font-bold text-gray-500">
              {personal.email && <span className="flex items-center gap-1"><Mail width={14} height={14} className="w-3.5 h-3.5" style={{ color: iconColor }} /> {personal.email}</span>}
              {personal.location && <span className="flex items-center gap-1"><MapPin width={14} height={14} className="w-3.5 h-3.5" style={{ color: iconColor }} /> {personal.location}</span>}
            </div>
          </div>
        </header>
      )
    }

    if (design.templateId === 'modern') {
      return (
        <header className="mb-8 flex justify-between items-end border-b-2 pb-6" style={{ borderColor: theme.accentColor }}>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-1" style={{ color: nameColor }}>
              {personal.fullName}
            </h1>
            <p className="text-lg font-medium uppercase tracking-widest" style={{ color: jobTitleColor }}>{personal.jobTitle}</p>
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
          <h1 className="text-3xl font-light tracking-[0.15em] uppercase mb-1" style={{ color: nameColor }}>
            {personal.fullName}
          </h1>
          <p className="text-sm font-medium tracking-[0.2em] uppercase mb-4" style={{ color: jobTitleColor }}>{personal.jobTitle}</p>
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
        <h1 className="text-3xl font-bold mb-1" style={{ color: nameColor }}>
          {personal.fullName}
        </h1>
        <p className="text-sm font-medium mb-3" style={{ color: jobTitleColor }}>{personal.jobTitle}</p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[9pt] text-gray-600 font-medium">
          {personal.email && <span className="flex items-center gap-1"><Mail width={12} height={12} className="w-3 h-3" style={{ color: iconColor }} /> {personal.email}</span>}
          {personal.phone && <span className="flex items-center gap-1"><Phone width={12} height={12} className="w-3 h-3" style={{ color: iconColor }} /> {personal.phone}</span>}
          {personal.location && <span className="flex items-center gap-1"><MapPin width={12} height={12} className="w-3 h-3" style={{ color: iconColor }} /> {personal.location}</span>}
          {personal.website && <span className="flex items-center gap-1"><Globe width={12} height={12} className="w-3 h-3" style={{ color: iconColor }} /> {personal.website}</span>}
        </div>
      </header>
    )
  }

  const renderPersonalSummary = (id: string, label: string) => {
    const summary = personalSummaries.find(ps => ps.id === id)
    if (!summary || !summary.visible) return null

    return (
      <div className="mb-6">
        <SectionTitle themeId={design.colorThemeId} dividerStyle={design.dividerStyle} templateId={design.templateId} applyAccentTo={design.applyAccentTo}>
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
        <SectionTitle themeId={design.colorThemeId} dividerStyle={design.dividerStyle} templateId={design.templateId} applyAccentTo={design.applyAccentTo}>
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
      <SectionTitle themeId={design.colorThemeId} dividerStyle={design.dividerStyle} templateId={design.templateId} applyAccentTo={design.applyAccentTo}>
        {label}
      </SectionTitle>
      <div className="space-y-5">
        {experience.filter(exp => exp.visible).map((exp) => (
          <EntryLayout
            key={exp.id}
            title={exp.jobTitle}
            subtitle={exp.company}
            date={`${formatMonthYear(exp.startDate)} — ${exp.currentlyWorking ? 'Present' : (exp.endDate?.year ? formatMonthYear(exp.endDate) : 'Present')}`}
            location={exp.location}
            description={exp.description}
            design={design}
            theme={theme}
          />
        ))}
      </div>
    </div>
  )

  const renderEducation = (label: string) => (
    <div className="mb-6">
      <SectionTitle themeId={design.colorThemeId} dividerStyle={design.dividerStyle} templateId={design.templateId} applyAccentTo={design.applyAccentTo}>
        {label}
      </SectionTitle>
      <div className="space-y-5">
        {education.filter(edu => edu.visible).map((edu) => (
          <EntryLayout
            key={edu.id}
            title={edu.degree}
            subtitle={edu.institution}
            date={`${formatMonthYear(edu.startDate)} — ${edu.current ? 'Ongoing' : (edu.endDate?.year ? formatMonthYear(edu.endDate) : 'Ongoing')}`}
            location={edu.location}
            description={edu.description}
            design={design}
            theme={theme}
          />
        ))}
      </div>
    </div>
  )

  const renderSkills = (label: string) => (
    <div className="mb-6">
      <SectionTitle themeId={design.colorThemeId} dividerStyle={design.dividerStyle} templateId={design.templateId} applyAccentTo={design.applyAccentTo}>
        {label}
      </SectionTitle>
      <div className="grid grid-cols-1 gap-4">
        {skills.categories.filter(c => c.visible).map((cat) => (
          <div key={cat.id} className="flex flex-col gap-1">
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-[10pt] uppercase tracking-wider" style={{ color: design.applyAccentTo.jobTitle ? theme.accentColor : '#111827' }}>
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
      <SectionTitle themeId={design.colorThemeId} dividerStyle={design.dividerStyle} templateId={design.templateId} applyAccentTo={design.applyAccentTo}>
        {label}
      </SectionTitle>
      <div className="space-y-5">
        {research.filter(res => res.visible).map((res) => (
          <EntryLayout
            key={res.id}
            title={res.title}
            subtitle={res.institution}
            date={`${formatMonthYear(res.startDate)} — ${res.current ? 'Present' : (res.endDate?.year ? formatMonthYear(res.endDate) : 'Present')}`}
            location={res.location}
            description={res.description}
            design={design}
            theme={theme}
          />
        ))}
      </div>
    </div>
  )

  const renderTraining = (label: string) => (
    <div className="mb-6">
      <SectionTitle themeId={design.colorThemeId} dividerStyle={design.dividerStyle} templateId={design.templateId} applyAccentTo={design.applyAccentTo}>
        {label}
      </SectionTitle>
      <div className="space-y-5">
        {training.filter(t => t.visible).map((trn) => (
          <EntryLayout
            key={trn.id}
            title={trn.name}
            subtitle={trn.provider}
            date={`${formatMonthYear(trn.startDate)} — ${trn.current ? 'Present' : (trn.endDate?.year ? formatMonthYear(trn.endDate) : 'Present')}`}
            description={trn.description}
            design={design}
            theme={theme}
          />
        ))}
      </div>
    </div>
  )

  const renderCertifications = (label: string) => (
    <div className="mb-6">
      <SectionTitle themeId={design.colorThemeId} dividerStyle={design.dividerStyle} templateId={design.templateId} applyAccentTo={design.applyAccentTo}>
        {label}
      </SectionTitle>
      <div className="space-y-5">
        {certifications.filter(c => c.visible).map((cert) => (
          <EntryLayout
            key={cert.id}
            title={cert.name}
            subtitle={cert.provider}
            date={cert.startDate ? `${formatMonthYear(cert.startDate)} ${cert.endDate ? `— ${formatMonthYear(cert.endDate)}` : ''}` : undefined}
            description={cert.description}
            design={design}
            theme={theme}
          />
        ))}
      </div>
    </div>
  )

  const renderReferences = (label: string) => {
    return (
      <div className="mb-6">
        <SectionTitle themeId={design.colorThemeId} dividerStyle={design.dividerStyle} templateId={design.templateId} applyAccentTo={design.applyAccentTo}>
          {label}
        </SectionTitle>
        <div className="grid grid-cols-2 gap-6">
          {references.filter(r => r.visible).map((ref) => (
            <div key={ref.id}>
              <h3 className="font-bold text-[11pt]" style={{ color: design.applyAccentTo.jobTitle ? theme.accentColor : '#111827' }}>{ref.name}</h3>
              <p className="text-[10pt] font-semibold" style={{ color: design.applyAccentTo.entrySubtitle ? theme.accentColor : '#1f2937' }}>{ref.position}</p>
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
        <SectionTitle themeId={design.colorThemeId} dividerStyle={design.dividerStyle} templateId={design.templateId} applyAccentTo={design.applyAccentTo}>
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
        <SectionTitle themeId={design.colorThemeId} dividerStyle={design.dividerStyle} templateId={design.templateId} applyAccentTo={design.applyAccentTo}>
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
      <SectionTitle themeId={design.colorThemeId} dividerStyle={design.dividerStyle} templateId={design.templateId} applyAccentTo={design.applyAccentTo}>
        {label}
      </SectionTitle>
      <div className="space-y-6">
        {projects.filter(p => p.visible).map((project) => (
          <EntryLayout
            key={project.id}
            title={project.name}
            subtitle={project.subtitle}
            date={project.startDate ? `${formatMonthYear(project.startDate)} — ${project.endDate ? formatMonthYear(project.endDate) : 'Present'}` : undefined}
            description={project.description}
            design={design}
            theme={theme}
          />
        ))}
      </div>
    </div>
  )

  const renderAwards = (label: string) => (
    <div className="mb-6">
      <SectionTitle themeId={design.colorThemeId} dividerStyle={design.dividerStyle} templateId={design.templateId} applyAccentTo={design.applyAccentTo}>
        {label}
      </SectionTitle>
      <div className="space-y-5">
        {awards.filter(a => a.visible).map((award) => (
          <EntryLayout
            key={award.id}
            title={award.title}
            subtitle={award.issuer}
            date={award.date ? formatMonthYear(award.date) : undefined}
            description={award.description}
            design={design}
            theme={theme}
          />
        ))}
      </div>
    </div>
  )

  const renderVolunteer = (label: string) => (
    <div className="mb-6">
      <SectionTitle themeId={design.colorThemeId} dividerStyle={design.dividerStyle} templateId={design.templateId} applyAccentTo={design.applyAccentTo}>
        {label}
      </SectionTitle>
      <div className="space-y-6">
        {volunteer.filter(v => v.visible).map((vol) => (
          <EntryLayout
            key={vol.id}
            title={vol.role}
            subtitle={vol.organization}
            date={`${formatMonthYear(vol.startDate)} — ${vol.current ? 'Present' : (vol.endDate?.year ? formatMonthYear(vol.endDate) : 'Present')}`}
            location={vol.location}
            description={vol.description}
            design={design}
            theme={theme}
          />
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
      case 'awards': return renderAwards(label)
      case 'volunteer': return renderVolunteer(label)
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
      const sidebarSectionIds = ['skills', 'education']
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
      className={cn(
        "w-full h-full shadow-inner overflow-hidden",
        design.layoutVariation === 'compact' && "compact-mode",
        design.layoutVariation === 'modern' && "modern-mode",
        design.layoutVariation === 'minimal' && "minimal-mode"
      )}
      style={{
        ...containerStyle,
        fontFamily: font ? `'${font.googleFamily}', sans-serif` : 'sans-serif',
      }}
    >
      <FontLoader fontId={design.fontId} />
      <ListStyles style={design.listStyle} />
      <VariationStyles variation={design.layoutVariation} />
      {renderWithLayout()}
    </div>
  )
}
