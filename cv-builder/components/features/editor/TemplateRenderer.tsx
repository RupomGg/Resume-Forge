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
  GitBranch,
  User,
  Briefcase,
  GraduationCap,
  Award,
  BookOpen,
  Code,
  Languages,
  Users,
  Star,
  FileText,
  Search,
  Wrench,
  Milestone
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

const resolvePlaceholders = (text: string, personal: any) => {
  if (!text) return ''
  return text
    .replace(/{{name}}/g, personal.fullName || '')
    .replace(/{{email}}/g, personal.email || '')
    .replace(/{{phone}}/g, personal.phone || '')
    .replace(/{{page}}/g, '1') // Mock for preview
    .replace(/{{pages}}/g, '1') // Mock for preview
}

const Footer = ({ design, personal }: { design: any, personal: any }) => {
  const { footer } = design
  if (!footer) return null

  const leftContent = footer.useCustomFooter 
    ? resolvePlaceholders(footer.leftColumn, personal)
    : (footer.showName ? personal.fullName : '')

  const centerContent = footer.useCustomFooter
    ? resolvePlaceholders(footer.centerColumn, personal)
    : (footer.showPageNumbers ? '1 / 1' : '')

  const rightContent = footer.useCustomFooter
    ? resolvePlaceholders(footer.rightColumn, personal)
    : (footer.showEmail ? personal.email : '')

  // Don't render if all empty
  if (!leftContent && !centerContent && !rightContent) return null

  return (
    <div 
      className="mt-8 pt-4 border-t border-gray-100 flex justify-between items-end text-[8pt] text-gray-400"
      style={{ 
        fontFamily: 'inherit',
        marginTop: `${design.marginBottom}mm` // Use margin bottom as spacing
      }}
    >
      <div className="flex-1 text-left whitespace-pre-line">{leftContent}</div>
      <div className="flex-1 text-center whitespace-pre-line">{centerContent}</div>
      <div className="flex-1 text-right whitespace-pre-line">{rightContent}</div>
    </div>
  )
}

const getSectionIcon = (id: string) => {
  switch (id) {
    case 'personal': return <User className="w-full h-full" />
    case 'summary': case 'personal-summary': return <FileText className="w-full h-full" />
    case 'experience': return <Briefcase className="w-full h-full" />
    case 'education': return <GraduationCap className="w-full h-full" />
    case 'skills': return <Code className="w-full h-full" />
    case 'languages': return <Languages className="w-full h-full" />
    case 'projects': return <Milestone className="w-full h-full" />
    case 'certifications': return <Award className="w-full h-full" />
    case 'awards': return <Star className="w-full h-full" />
    case 'volunteer': return <Users className="w-full h-full" />
    case 'research': return <Search className="w-full h-full" />
    case 'training': return <Wrench className="w-full h-full" />
    case 'references': return <User className="w-full h-full" />
    case 'interests': return <Star className="w-full h-full" />
    default: return <FileText className="w-full h-full" />
  }
}

const SectionTitle = ({ children, sectionId, design }: { 
  children: React.ReactNode, 
  sectionId: string,
  design: any
}) => {
  const theme = getTheme(design.colorThemeId)
  const headingColor = design.applyAccentTo?.headings ? theme.accentColor : theme.sectionTitleColor
  const style = design.headingStyle || 'simple'
  const textCase = design.headingCase || 'uppercase'
  const size = design.headingSize || 10
  
  const renderText = () => (
    <div className="flex items-center gap-2">
      {design.showHeadingIcons && (
        <div className="w-[1.2em] h-[1.2em] shrink-0" style={{ color: theme.accentColor }}>
          {getSectionIcon(sectionId)}
        </div>
      )}
      <h2 
        className={cn(
          "font-bold tracking-wider",
          textCase === 'uppercase' ? "uppercase" : "capitalize"
        )}
        style={{ color: headingColor, fontSize: `${size}pt` }}
      >
        {children}
      </h2>
    </div>
  )

  if (style === 'boxed') {
    return (
      <div className="mb-4">
        <div 
          className="w-full px-4 py-1.5 flex justify-center items-center" 
          style={{ backgroundColor: '#f1f1f1' }}
        >
          {renderText()}
        </div>
      </div>
    )
  }

  if (style === 'underlined') {
    return (
      <div className="mb-4 border-b-2" style={{ borderColor: theme.accentColor }}>
        <div className="pb-1">{renderText()}</div>
      </div>
    )
  }

  if (style === 'side-line') {
    return (
      <div className="mb-4 flex items-center gap-3">
        <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: theme.accentColor }} />
        {renderText()}
      </div>
    )
  }

  if (style === 'minimal') {
    return <div className="mb-4">{renderText()}</div>
  }

  if (style === 'zigzag') {
    return (
      <div className="mb-4">
        {renderText()}
        <svg className="w-24 h-1 mt-1 opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none" style={{ color: theme.accentColor }}>
          <path d="M0 5 L5 0 L10 5 L15 0 L20 5 L25 0 L30 5 L35 0 L40 5 L45 0 L50 5 L55 0 L60 5 L65 0 L70 5 L75 0 L80 5 L85 0 L90 5 L95 0 L100 5" fill="none" stroke="currentColor" strokeWidth="3" />
        </svg>
      </div>
    )
  }

  if (style === 'double-line') {
    return (
      <div className="mb-4">
        {renderText()}
        <div className="space-y-[2px] mt-1.5">
          <div className="w-full h-[2px]" style={{ backgroundColor: theme.accentColor }} />
          <div className="w-full h-[1px] opacity-30" style={{ backgroundColor: theme.accentColor }} />
        </div>
      </div>
    )
  }

  if (style === 'pill') {
    return (
      <div className="mb-4">
        <div className="inline-flex items-center px-5 py-1.5 rounded-full" style={{ backgroundColor: `${theme.accentColor}15` }}>
          {renderText()}
        </div>
      </div>
    )
  }

  if (style === 'modern-split') {
    return (
      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-1 h-6 rounded-full" style={{ backgroundColor: theme.accentColor }} />
          {renderText()}
        </div>
        <div className="flex-1 h-[1px] opacity-20" style={{ backgroundColor: headingColor }} />
      </div>
    )
  }

  if (style === 'bracket') {
    return (
      <div className="mb-4 flex items-center gap-2">
        <span className="text-2xl font-extralight opacity-30 select-none" style={{ color: theme.accentColor }}>[</span>
        {renderText()}
        <span className="text-2xl font-extralight opacity-30 select-none" style={{ color: theme.accentColor }}>]</span>
      </div>
    )
  }

  if (style === 'decorative') {
    return (
      <div className="mb-4 flex items-center gap-4">
        {renderText()}
        <div className="flex-1 h-[1px] opacity-20" style={{ backgroundColor: headingColor }} />
        <div className="w-2 h-2 rounded-full opacity-40" style={{ backgroundColor: theme.accentColor }} />
      </div>
    )
  }

  // Default / Simple Line
  return (
    <div className="mb-4">
      {renderText()}
      <div 
        className={cn(
          "w-full mt-1.5",
          design.dividerStyle === 'thin' ? "h-[1px]" : "h-[2px]"
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
  theme,
  reverseOrder = false
}: { 
  title: string, 
  subtitle?: string, 
  date?: string, 
  location?: string, 
  description?: string, 
  design: any, 
  theme: any,
  reverseOrder?: boolean
}) => {
  const titleColor = design.applyAccentTo.jobTitle ? theme.accentColor : '#111827'
  const subtitleColor = design.applyAccentTo.entrySubtitle ? theme.accentColor : '#1f2937'
  const dateColor = design.applyAccentTo.dates ? theme.accentColor : '#6b7280'
  
  const subtitleStyles = cn(
    design.subtitleStyle === 'italic' && 'italic',
    design.subtitleStyle === 'bold' && 'font-bold',
    design.subtitleStyle === 'bold-italic' && 'font-bold italic'
  )

  const displayTitle = !reverseOrder ? title : (subtitle || title)
  const displaySubtitle = !reverseOrder ? subtitle : (subtitle ? title : undefined)

  const renderSubtitle = () => displaySubtitle && (
    <span 
      className={cn("leading-tight", subtitleStyles)} 
      style={{ color: subtitleColor, fontSize: `${design.subtitleSize}pt` }}
    >
      {displaySubtitle}
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

  const renderLocation = () => location && design.resumeShowLocation && (
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
        {displayTitle}
        {design.subtitlePlacement === 'beside-title' && displaySubtitle && (
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
          {displayTitle}
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

  const baseTheme = getTheme(design.colorThemeId)
  const theme = design.colorThemeId === 'custom' && design.customAccentColor 
    ? { ...baseTheme, accentColor: design.customAccentColor, dividerColor: design.customAccentColor }
    : baseTheme

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
    
    const alignment = design.headerAlignment || 'left'
    const arrangement = design.detailsArrangement || 'bullet'
    const nameSizeScale = design.nameSize || 'm'
    const titleSizeScale = design.titleSizeScale || 'm'
    const photoSizeScale = design.photoSizeScale || 's'
    const photoPosition = design.photoPosition || 'left'
    const photoShape = design.photoShape || 'circle'

    // Size Maps (Approximate Tailwind classes for preview, but will be pixel-perfect in PDF)
    const nameSizeMap = { xs: 'text-2xl', s: 'text-3xl', m: 'text-4xl', l: 'text-5xl', xl: 'text-6xl' }
    const titleSizeMap = { s: 'text-sm', m: 'text-base', l: 'text-lg' }
    const photoSizeMap = { xs: 'w-16 h-16', s: 'w-24 h-24', m: 'w-32 h-32', l: 'w-40 h-40', xl: 'w-48 h-48' }

    const photoClasses = cn(
      photoSizeMap[photoSizeScale as keyof typeof photoSizeMap],
      photoShape === 'circle' && 'rounded-full',
      photoShape === 'square' && 'rounded-none',
      photoShape === 'rounded-square' && 'rounded-xl',
      photoShape === 'portrait' && 'rounded-none aspect-[3/4] h-auto',
      photoShape === 'rounded-portrait' && 'rounded-xl aspect-[3/4] h-auto',
      design.photoGrayscale && 'grayscale',
      "overflow-hidden shrink-0 shadow-sm border border-gray-100"
    )

    const renderPhoto = () => personal.photoUrl && design.showPhoto && (
      <div className={photoClasses} style={{ backgroundColor: `${theme.accentColor}10` }}>
        <img src={personal.photoUrl} alt="" className="w-full h-full object-cover" />
      </div>
    )

    const details = [
      { id: 'email', value: personal.email, icon: Mail },
      { id: 'phone', value: personal.phone, icon: Phone },
      { id: 'location', value: personal.location, icon: MapPin },
      { id: 'website', value: personal.website, icon: Globe },
    ].filter(d => d.value)

    const renderDetails = () => {
      const isIconArrangement = arrangement === 'icon'
      
      return (
        <div className={cn(
          "flex flex-wrap text-[9pt] font-medium text-gray-500",
          alignment === 'center' ? "justify-center" : "justify-start",
          arrangement === 'stacked' ? "flex-col gap-1" : "gap-x-4 gap-y-1",
          arrangement === 'columns' && "grid grid-cols-2 gap-x-8"
        )}>
          {details.map((d, i) => (
            <span key={d.id} className="flex items-center gap-1.5 whitespace-nowrap">
              {(isIconArrangement || arrangement === 'brick') && (
                <d.icon width={12} height={12} className="w-3 h-3" style={{ color: iconColor }} />
              )}
              {d.value}
              {arrangement === 'bullet' && i < details.length - 1 && (
                <span className="ml-3 text-gray-300 select-none">•</span>
              )}
              {arrangement === 'bar' && i < details.length - 1 && (
                <span className="ml-3 text-gray-300 select-none">|</span>
              )}
            </span>
          ))}
        </div>
      )
    }

    const nameClasses = cn(
      "font-black tracking-tight leading-none",
      nameSizeMap[nameSizeScale as keyof typeof nameSizeMap],
      !design.nameBold && "font-normal",
      design.nameFontFamily === 'creative' && "font-serif" 
    )

    const titleClasses = cn(
      "font-bold uppercase tracking-widest",
      titleSizeMap[titleSizeScale as keyof typeof titleSizeMap],
      design.titleStyle === 'italic' && "italic"
    )

    const textContent = (
      <div className={cn(
        "flex-1 flex flex-col gap-2",
        alignment === 'center' ? "text-center items-center" : "text-left items-start"
      )}>
        <div className={cn(
          "flex flex-wrap items-baseline gap-x-4",
          alignment === 'center' ? "justify-center" : "justify-start",
          design.titlePosition === 'below' && "flex-col"
        )}>
          <h1 className={nameClasses} style={{ color: nameColor }}>
            {personal.fullName}
          </h1>
          {personal.jobTitle && (
            <p className={titleClasses} style={{ color: jobTitleColor }}>
              {personal.jobTitle}
            </p>
          )}
        </div>
        <div className="mt-1">
          {renderDetails()}
        </div>
        
        {/* Summary in Header integration */}
        {design.resumeSummaryInHeader && (
          <div className="mt-4 pt-4 border-t border-gray-100/50 opacity-80 text-[9pt] leading-relaxed italic max-w-2xl">
            {(() => {
              const summary = professionalSummaries.find(ps => ps.visible) || personalSummaries.find(ps => ps.visible)
              return summary ? <div dangerouslySetInnerHTML={{ __html: summary.content }} /> : null
            })()}
          </div>
        )}
      </div>
    )

    return (
      <header className={cn(
        "mb-10 flex gap-8",
        photoPosition === 'top' ? "flex-col items-center" : "items-center",
        photoPosition === 'right' && "flex-row-reverse",
        alignment === 'center' && photoPosition === 'top' && "text-center"
      )}>
        {renderPhoto()}
        {textContent}
      </header>
    )
  }

  const renderPersonalSummary = (id: string, label: string) => {
    const summary = personalSummaries.find(ps => ps.id === id)
    if (!summary || !summary.visible) return null

    return (
      <div className="mb-6">
        <SectionTitle sectionId={id} design={design}>
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
    if (!summary || !summary.visible || design.resumeSummaryInHeader) return null
    
    return (
      <div className="mb-6">
        {design.resumeShowSummaryHeading && (
          <SectionTitle sectionId={id} design={design}>
            {label}
          </SectionTitle>
        )}
        <div 
          className="prose prose-sm max-w-none text-inherit leading-relaxed"
          dangerouslySetInnerHTML={{ __html: summary.content }} 
        />
      </div>
    )
  }

  const renderExperience = (label: string) => {
    const visibleExp = experience.filter(exp => exp.visible)

    if (design.resumeGroupPromotions) {
      // Group by company while preserving original order
      const grouped: { company: string, roles: typeof experience }[] = []
      visibleExp.forEach(exp => {
        const existing = grouped.find(g => g.company === exp.company)
        if (existing) {
          existing.roles.push(exp)
        } else {
          grouped.push({ company: exp.company, roles: [exp] })
        }
      })

      return (
        <div className="mb-6">
          <SectionTitle sectionId="experience" design={design}>
            {label}
          </SectionTitle>
          <div className="space-y-6">
            {grouped.map((group, idx) => (
              <div key={`${group.company}-${idx}`} className="group-item">
                <div className="flex justify-between items-baseline mb-2 border-b border-gray-50 pb-1">
                  <h3 className="font-bold text-[11pt]" style={{ color: design.applyAccentTo.entrySubtitle ? theme.accentColor : '#111827' }}>
                    {group.company}
                  </h3>
                  {group.roles[0].location && (
                    <span className="text-[9pt] text-gray-500 italic">{group.roles[0].location}</span>
                  )}
                </div>
                <div className="space-y-5 ml-4 border-l-2 border-gray-50 pl-4">
                  {group.roles.map((role) => (
                    <div key={role.id} className="role-item">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-[10pt] text-gray-800" style={{ color: design.applyAccentTo.jobTitle ? theme.accentColor : undefined }}>
                          {role.jobTitle}
                        </span>
                        <span className="text-[9pt] text-gray-500 font-medium">
                          {formatMonthYear(role.startDate)} — {role.currentlyWorking ? 'Present' : (role.endDate?.year ? formatMonthYear(role.endDate) : 'Present')}
                        </span>
                      </div>
                      <div 
                        className="description-content prose prose-sm max-w-none text-inherit mt-1.5 opacity-90"
                        dangerouslySetInnerHTML={{ __html: role.description }} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="mb-6">
        <SectionTitle sectionId="experience" design={design}>
          {label}
        </SectionTitle>
        <div className="space-y-5">
          {visibleExp.map((exp) => (
            <EntryLayout
              key={exp.id}
              title={exp.jobTitle}
              subtitle={exp.company}
              date={`${formatMonthYear(exp.startDate)} — ${exp.currentlyWorking ? 'Present' : (exp.endDate?.year ? formatMonthYear(exp.endDate) : 'Present')}`}
              location={exp.location}
              description={exp.description}
              design={design}
              theme={theme}
              reverseOrder={design.resumeExperienceOrder === 'subtitle-first'}
            />
          ))}
        </div>
      </div>
    )
  }

  const renderEducation = (label: string) => (
    <div className="mb-6">
      <SectionTitle sectionId="education" design={design}>
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
            reverseOrder={design.resumeEducationOrder === 'subtitle-first'}
          />
        ))}
      </div>
    </div>
  )

  const renderSkillLevel = (level: string) => {
    if (!level || level === 'none') return null
    const visualizer = design.skillsLevelVisualizer || 'dots'
    const color = design.applyAccentTo.dotsBarsBubbles ? theme.accentColor : '#cbd5e1'

    if (visualizer === 'text') {
      return <span className="text-[8pt] font-semibold text-gray-400 italic capitalize">{level}</span>
    }

    if (visualizer === 'dots') {
      const levelsMap = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 }
      const count = levelsMap[level as keyof typeof levelsMap] || 0
      return (
        <div className="flex gap-1 items-center">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: i <= count ? color : '#e2e8f0' }} />
          ))}
        </div>
      )
    }

    if (visualizer === 'bar') {
      const levelsMap = { beginner: '25%', intermediate: '50%', advanced: '75%', expert: '100%' }
      const width = levelsMap[level as keyof typeof levelsMap] || '0%'
      return (
        <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width, backgroundColor: color }} />
        </div>
      )
    }

    return null
  }

  const getSubinfoSeparator = (style: string) => {
    switch (style) {
      case 'colon': return ': '
      case 'dash': return ' - '
      case 'bracket': return ' ('
      default: return ': '
    }
  }

  const getSubinfoEnd = (style: string) => {
    return style === 'bracket' ? ')' : ''
  }

  const renderSkills = (label: string) => {
    const layout = design.skillsLayout || 'grid'
    
    return (
      <div className="mb-6">
        <SectionTitle sectionId="skills" design={design}>
          {label}
        </SectionTitle>
        
        {layout === 'grid' && (
          <div className={cn(
            "grid gap-4",
            design.skillsGridColumns === 1 && "grid-cols-1",
            design.skillsGridColumns === 2 && "grid-cols-2",
            design.skillsGridColumns === 3 && "grid-cols-3",
            design.skillsGridColumns === 4 && "grid-cols-4"
          )}>
            {skills.categories.filter(c => c.visible).map((cat) => (
              <div key={cat.id} className="flex flex-col gap-1">
                <span className="font-bold text-[9pt] uppercase tracking-wider" style={{ color: design.applyAccentTo.jobTitle ? theme.accentColor : '#111827' }}>
                  {cat.categoryName}
                </span>
                <div className="text-[9pt] text-gray-600 leading-relaxed">
                  {cat.items.filter(i => i.visible).map((item, i, arr) => (
                    <span key={item.id}>
                      {item.skill}{i < arr.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {layout === 'rows' && (
          <div className={cn(
            "flex flex-col",
            design.skillsRowSpacing === 'tight' ? "gap-1.5" : "gap-3"
          )}>
            {skills.categories.filter(c => c.visible).map((cat) => (
              <div key={cat.id} className="flex items-start gap-2">
                {design.skillsShowRowBullets && <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-300 shrink-0" />}
                <div className="flex flex-wrap gap-x-1 items-baseline">
                  <span className="font-bold text-[9pt]" style={{ color: design.applyAccentTo.jobTitle ? theme.accentColor : '#111827' }}>
                    {cat.categoryName}
                    {cat.items.length > 0 && getSubinfoSeparator(design.skillsRowSubinfoStyle)}
                  </span>
                  <span className="text-[9pt] text-gray-600">
                    {cat.items.filter(i => i.visible).map(i => i.skill).join(', ')}
                    {cat.items.length > 0 && getSubinfoEnd(design.skillsRowSubinfoStyle)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {layout === 'compact' && (
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {skills.categories.filter(c => c.visible).map((cat, i, arr) => (
              <div key={cat.id} className="flex items-baseline gap-1">
                <span className="font-bold text-[9pt]" style={{ color: design.applyAccentTo.jobTitle ? theme.accentColor : '#111827' }}>
                  {cat.categoryName}
                  {cat.items.length > 0 && getSubinfoSeparator(design.skillsCompactSubinfoStyle)}
                </span>
                <span className="text-[9pt] text-gray-600">
                  {cat.items.filter(item => item.visible).map(item => item.skill).join(', ')}
                  {cat.items.length > 0 && getSubinfoEnd(design.skillsCompactSubinfoStyle)}
                </span>
                {i < arr.length - 1 && (
                  <span className="text-gray-300 ml-2">
                    {design.skillsCompactSeparator === 'bullet' && '•'}
                    {design.skillsCompactSeparator === 'pipe' && '|'}
                    {design.skillsCompactSeparator === 'comma' && ','}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {layout === 'bubble' && (
          <div className="flex flex-wrap gap-2">
            {skills.categories.filter(c => c.visible).map((cat) => (
              <div 
                key={cat.id} 
                className="px-3 py-1 rounded-full border border-gray-100 flex items-baseline gap-1"
                style={{ backgroundColor: `${theme.accentColor}08` }}
              >
                <span className="font-bold text-[8pt] uppercase tracking-wider" style={{ color: theme.accentColor }}>
                  {cat.categoryName}
                  {cat.items.length > 0 && getSubinfoSeparator(design.skillsBubbleSubinfoStyle)}
                </span>
                <span className="text-[8pt] text-gray-600">
                  {cat.items.filter(i => i.visible).map(i => i.skill).join(', ')}
                  {cat.items.length > 0 && getSubinfoEnd(design.skillsBubbleSubinfoStyle)}
                </span>
              </div>
            ))}
          </div>
        )}

        {layout === 'level' && (
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            {skills.categories.filter(c => c.visible).flatMap(cat => cat.items.filter(i => i.visible)).map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b border-gray-50 pb-2">
                <span className="font-bold text-[9pt] text-gray-800">{item.skill}</span>
                {renderSkillLevel(item.level)}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderResearch = (label: string) => (
    <div className="mb-6">
      <SectionTitle sectionId="research" design={design}>
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
      <SectionTitle sectionId="training" design={design}>
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
      <SectionTitle sectionId="certifications" design={design}>
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
        <SectionTitle sectionId="references" design={design}>
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
        <SectionTitle sectionId="languages" design={design}>
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
        <SectionTitle sectionId="interests" design={design}>
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
      <SectionTitle sectionId="projects" design={design}>
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
      <SectionTitle sectionId="awards" design={design}>
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
      <SectionTitle sectionId="volunteer" design={design}>
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
    const visibleSections = sectionOrder.filter(s => {
      if (!s.visible) return false
      if (design.resumeHideEmptySections && !hasSectionContent(s.id)) return false
      return true
    })

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
      <Footer design={design} personal={personal} />
    </div>
  )
}
