'use client'

import { useState, useEffect, useMemo } from 'react'
import { useCVStore } from '@/store/cv-store'
import { getTheme } from '@/lib/themes'
import { getFont, FONTS } from '@/lib/fonts'
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
import cvTemplatesData from '@/cv-templates.json'

// ─── Helper: Font Loader ──────────────────────────────────────────────────────

function FontLoader({ fontId, googleFamily }: { fontId?: string, googleFamily?: string }) {
  const family = googleFamily || (fontId ? getFont(fontId)?.googleFamily : null)
  if (!family) return null
  
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      @import url('https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@100;200;300;400;500;600;700;800;900&display=swap');
    `}} />
  )
}

// ─── Helper: Style Injector ───────────────────────────────────────────────────

function StyleInjector({ tokens, templateId }: { tokens: Record<string, string>, templateId: string }) {
  if (!tokens) return null
  
  const cssVariables = Object.entries(tokens)
    .map(([key, value]) => `${key}: ${value} !important;`)
    .join('\n      ')

  return (
    <style dangerouslySetInnerHTML={{ __html: `
      #cv-preview-card {
        ${cssVariables}
      }
      
      #cv-preview-card .section-title {
        color: var(--cv-section-title) !important;
      }
      
      #cv-preview-card .item-title {
        color: var(--cv-accent) !important;
      }
      
      #cv-preview-card .body-text {
        color: var(--cv-body-text) !important;
      }
      
      #cv-preview-card .muted-text {
        color: var(--cv-muted-text) !important;
      }
      
      #cv-preview-card .name-text {
        color: var(--cv-header-text) !important;
      }
      
      #cv-preview-card .job-title-text {
        color: var(--cv-header-subtitle) !important;
      }
    `}} />
  )
}

const resolvePlaceholders = (text: string, personal: any) => {
  if (!text) return ''
  return text
    .replace(/{{name}}/g, personal.fullName || '')
    .replace(/{{email}}/g, personal.email || '')
    .replace(/{{phone}}/g, personal.phone || '')
    .replace(/{{page}}/g, '1') 
    .replace(/{{pages}}/g, '1')
}

const Footer = ({ design, personal, template }: { design: any, personal: any, template?: any }) => {
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

  if (!leftContent && !centerContent && !rightContent) return null

  return (
    <div 
      className="mt-8 pt-4 border-t border-gray-100 flex justify-between items-end text-[8pt] text-gray-400"
      style={{ 
        fontFamily: 'inherit',
        marginTop: `${design.marginBottom}mm`,
        borderColor: 'var(--cv-divider, #f1f1f1)'
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

const SectionTitle = ({ children, sectionId, design, template }: { 
  children: React.ReactNode, 
  sectionId: string,
  design: any,
  template?: any
}) => {
  const style = design.headingStyle || 'simple'
  const textCase = design.headingCase === 'uppercase' ? 'uppercase' : 'none'
  const size = `${design.headingSize || template?.typography?.sectionTitleSize || 10}pt`
  const weight = template?.typography?.sectionTitleWeight || '700'
  const letterSpacing = template?.typography?.sectionTitleLetterSpacing || '0.05em'
  
  const headingColor = 'var(--cv-section-title)'
  
  const renderText = () => (
    <div className="flex items-center gap-2">
      {design.showHeadingIcons && (
        <div className="w-[1.2em] h-[1.2em] shrink-0" style={{ color: 'var(--cv-accent)' }}>
          {getSectionIcon(sectionId)}
        </div>
      )}
      <h2 
        className={cn(
          "section-title tracking-wider",
          textCase === 'uppercase' ? "uppercase" : "capitalize"
        )}
        style={{ 
          color: headingColor, 
          fontSize: size,
          fontWeight: weight,
          letterSpacing: letterSpacing
        }}
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
          style={{ backgroundColor: 'var(--cv-accent-light, rgba(0,0,0,0.05))' }}
        >
          {renderText()}
        </div>
      </div>
    )
  }

  if (style === 'underlined' || template?.sections?.titleUnderline) {
    return (
      <div className="mb-4 border-b-2" style={{ borderColor: 'var(--cv-accent)' }}>
        <div className="pb-1">{renderText()}</div>
      </div>
    )
  }

  if (style === 'side-line' || template?.sections?.titleBorderLeft) {
    return (
      <div className="mb-4 flex items-center gap-3">
        <div 
          className="w-1.5 h-6 rounded-full" 
          style={{ 
            backgroundColor: 'var(--cv-accent)',
            width: template?.sections?.titleBorderLeftWidth || '4px'
          }} 
        />
        {renderText()}
      </div>
    )
  }

  if (style === 'zigzag') {
    return (
      <div className="mb-4">
        {renderText()}
        <svg className="w-24 h-1 mt-1 opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none" style={{ color: 'var(--cv-accent)' }}>
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
          <div className="w-full h-[2px]" style={{ backgroundColor: 'var(--cv-accent)' }} />
          <div className="w-full h-[1px] opacity-30" style={{ backgroundColor: 'var(--cv-accent)' }} />
        </div>
      </div>
    )
  }

  if (style === 'pill') {
    return (
      <div className="mb-4">
        <div className="inline-flex items-center px-5 py-1.5 rounded-full" style={{ backgroundColor: 'var(--cv-accent-light)' }}>
          {renderText()}
        </div>
      </div>
    )
  }

  if (style === 'modern-split') {
    return (
      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-1 h-6 rounded-full" style={{ backgroundColor: 'var(--cv-accent)' }} />
          {renderText()}
        </div>
        <div className="flex-1 h-[1px] opacity-20" style={{ backgroundColor: 'var(--cv-divider)' }} />
      </div>
    )
  }

  if (style === 'bracket') {
    return (
      <div className="mb-4 flex items-center gap-2">
        <span className="text-2xl font-extralight opacity-30 select-none" style={{ color: 'var(--cv-accent)' }}>[</span>
        {renderText()}
        <span className="text-2xl font-extralight opacity-30 select-none" style={{ color: 'var(--cv-accent)' }}>]</span>
      </div>
    )
  }

  if (style === 'decorative') {
    return (
      <div className="mb-4 flex items-center gap-4">
        {renderText()}
        <div className="flex-1 h-[1px] opacity-20" style={{ backgroundColor: 'var(--cv-divider)' }} />
        <div className="w-2 h-2 rounded-full opacity-40" style={{ backgroundColor: 'var(--cv-accent)' }} />
      </div>
    )
  }

  return (
    <div className="mb-4">
      {renderText()}
      <div 
        className={cn(
          "w-full mt-1.5",
          design.dividerStyle === 'thin' ? "h-[1px]" : "h-[2px]"
        )}
        style={{ backgroundColor: 'var(--cv-divider)' }}
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

const EntryLayout = ({ 
  title, 
  subtitle, 
  date, 
  location, 
  description, 
  design, 
  template,
  reverseOrder = false
}: { 
  title: string, 
  subtitle?: string, 
  date?: string, 
  location?: string, 
  description?: string, 
  design: any, 
  template?: any,
  reverseOrder?: boolean
}) => {
  const titleColor = design.applyAccentTo.jobTitle ? 'var(--cv-accent)' : 'var(--cv-body-text)'
  const subtitleColor = design.applyAccentTo.entrySubtitle ? 'var(--cv-accent)' : 'var(--cv-body-text)'
  const dateColor = design.applyAccentTo.dates ? 'var(--cv-accent)' : 'var(--cv-muted-text)'

  const titleSize = `${design.titleSize || template?.typography?.itemTitleSize || 10}pt`
  const subtitleSize = `${design.subtitleSize || template?.typography?.itemSubtitleSize || 9}pt`
  const subtitleStyle = design.subtitleStyle || template?.typography?.itemSubtitleStyle || 'italic'
  const isSubtitleBold = design.subtitleStyle === 'bold' || design.subtitleStyle === 'bold-italic'
  const isSubtitleItalic = design.subtitleStyle === 'italic' || design.subtitleStyle === 'bold-italic'

  const displayTitle = !reverseOrder ? title : (subtitle || title)
  const displaySubtitle = !reverseOrder ? subtitle : (subtitle ? title : undefined)

  const renderSubtitle = () => displaySubtitle && (
    <span 
      className={cn("leading-tight", isSubtitleBold && "font-bold", isSubtitleItalic && "italic")} 
      style={{ 
        color: subtitleColor, 
        fontSize: subtitleSize
      }}
    >
      {displaySubtitle}
    </span>
  )

  const renderDate = () => date && (
    <span 
      className="font-semibold whitespace-nowrap"
      style={{ 
        color: dateColor, 
        fontSize: template?.typography?.dateSize || `${design.fontSize * 0.9}pt` 
      }}
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
      style={{ 
        paddingLeft: `${design.descriptionIndentation}px`,
        fontSize: template?.typography?.bodySize || 'inherit'
      }}
      dangerouslySetInnerHTML={{ __html: description }} 
    />
  )

  const renderTitleBlock = (fullWidth = false) => (
    <div className={cn(fullWidth ? "w-full" : "flex-1")}>
      <h3 
        className="item-title font-bold leading-tight" 
        style={{ 
          color: titleColor, 
          fontSize: titleSize,
          fontWeight: template?.typography?.itemTitleWeight || '700'
        }}
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

  if (layoutId === 'layout-3') {
    return (
      <div className="entry-item mb-6">
        <div className="flex gap-4">
          <div className="w-[110px] shrink-0 pt-0.5">
            {renderDate()}
          </div>
          <div className="flex-1">
            {renderTitleBlock(true)}
            {design.subtitlePlacement === 'right-aligned' && (
              <div className="mt-0.5">{renderSubtitle()}</div>
            )}
            {renderDescription()}
          </div>
          <div className="w-1/4 text-right pt-0.5 shrink-0">
            {renderLocation()}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="entry-item mb-6">
      <div className="flex justify-between items-baseline gap-4">
        <h3 
          className="item-title font-bold leading-tight flex-1" 
          style={{ 
            color: titleColor, 
            fontSize: titleSize,
            fontWeight: template?.typography?.itemTitleWeight || '700'
          }}
        >
          {displayTitle}
        </h3>
        <div className="shrink-0">
          {renderDate()}
        </div>
      </div>
      {(displaySubtitle || location) && (
        <div className="flex justify-between items-baseline mt-0.5 gap-4">
          <div className="flex-1">
            {design.subtitlePlacement !== 'below-title' && design.subtitlePlacement !== 'beside-title' && renderSubtitle()}
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

  const activeTemplate = useMemo(() => {
    return cvTemplatesData.templates.find(t => t.id === design.templateId)
  }, [design.templateId])

  const themeColors = useMemo(() => {
    const baseTheme = getTheme(design.colorThemeId)
    const customAccent = design.colorThemeId === 'custom' ? design.customAccentColor : null

    // Use template colors ONLY if we are in the default 'modern' theme 
    // AND a template is active. This allows user to override template colors 
    // by picking a different theme in the Customize panel.
    if (activeTemplate && design.colorThemeId === 'modern') {
      return activeTemplate.colors
    }

    const tokens: Record<string, string> = {
      '--cv-accent': customAccent || baseTheme.accentColor,
      '--cv-accent-light': `${customAccent || baseTheme.accentColor}1a`,
      '--cv-header-bg': baseTheme.headerBg,
      '--cv-header-text': baseTheme.headerText,
      '--cv-header-subtitle': design.applyAccentTo.headings ? (customAccent || baseTheme.accentColor) : baseTheme.sectionTitleColor,
      '--cv-section-title': design.applyAccentTo.headings ? (customAccent || baseTheme.accentColor) : baseTheme.sectionTitleColor,
      '--cv-body-text': baseTheme.bodyTextColor,
      '--cv-muted-text': '#6b7280',
      '--cv-divider': customAccent || baseTheme.dividerColor,
      '--cv-page-bg': '#ffffff',
    }
    return tokens
  }, [activeTemplate, design.colorThemeId, design.customAccentColor, design.applyAccentTo.headings])

  const activeFontFamily = useMemo(() => {
    if (activeTemplate && !design.fontId) {
      const font = FONTS.find(f => f.id === activeTemplate.defaultFont)
      return font?.googleFamily || 'Inter'
    }
    return getFont(design.fontId)?.googleFamily || 'Inter'
  }, [activeTemplate, design.fontId])

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
    fontSize: `${design.fontSize || activeTemplate?.defaultFontSize || 10}pt`,
    lineHeight: design.lineHeight || activeTemplate?.defaultLineHeight || 1.4,
    fontFamily: `"${activeFontFamily}", sans-serif`,
    ...themeColors as any
  }

  const formatMonthYear = (date: { month: number, year: number }) => 
    `${new Date(0, date.month - 1).toLocaleString('en', { month: 'short' })} ${date.year}`

  const renderPersonal = () => {
    const header = (activeTemplate?.header || {}) as any
    const alignment = header.layout === 'centered' ? 'center' : (header.layout === 'left-aligned' ? 'left' : design.headerAlignment)
    const isSplit = header.layout === 'split'
    
    const nameColor = 'var(--cv-header-text, var(--cv-accent))'
    const jobTitleColor = 'var(--cv-header-subtitle, var(--cv-muted-text))'
    
    const nameStyles = {
      fontSize: activeTemplate?.typography?.nameSize || '2.5rem',
      fontWeight: activeTemplate?.typography?.nameWeight || '800',
      textTransform: activeTemplate?.typography?.nameTransform || 'none' as any,
      letterSpacing: activeTemplate?.typography?.nameLetterSpacing || 'tight',
      color: nameColor,
      lineHeight: '1.1'
    }

    const details = [
      { id: 'email', value: personal.email, icon: Mail },
      { id: 'phone', value: personal.phone, icon: Phone },
      { id: 'location', value: personal.location, icon: MapPin },
      { id: 'website', value: personal.website, icon: Globe },
    ].filter(d => d.value)

    const separator = header.contactSeparator || ' • '

    const renderContactInfo = () => (
      <div className={cn(
        "flex flex-wrap gap-x-3 gap-y-1 text-[9pt] font-medium opacity-80",
        alignment === 'center' ? "justify-center" : "justify-start"
      )}>
        {details.map((d, i) => (
          <span key={d.id} className="flex items-center gap-1.5 whitespace-nowrap">
            <d.icon width={12} height={12} className="opacity-60" style={{ color: 'var(--cv-accent)' }} />
            {d.value}
            {i < details.length - 1 && <span className="opacity-40 ml-1">{separator}</span>}
          </span>
        ))}
      </div>
    )

    return (
      <header className={cn(
        "mb-8 flex flex-col transition-all duration-300",
        alignment === 'center' ? "text-center items-center" : "text-left items-start",
        header.paddingBottom ? `pb-[${header.paddingBottom}]` : "pb-4"
      )}>
        {isSplit ? (
          <div className="w-full flex justify-between items-end gap-6 pb-4">
            <div className="flex-1 text-left">
              <h1 className="name-text" style={nameStyles}>{personal.fullName}</h1>
              {personal.jobTitle && (
                <p 
                  className="job-title-text mt-1"
                  style={{ 
                    color: jobTitleColor, 
                    fontSize: activeTemplate?.typography?.jobTitleSize || '1rem',
                    fontWeight: activeTemplate?.typography?.jobTitleWeight || '500',
                    fontStyle: activeTemplate?.typography?.jobTitleStyle || 'normal'
                  }}
                >
                  {personal.jobTitle}
                </p>
              )}
            </div>
            <div className="flex-1 text-right max-w-[40%]">
              {renderContactInfo()}
            </div>
          </div>
        ) : (
          <>
            <h1 className="name-text" style={nameStyles}>{personal.fullName}</h1>
            {personal.jobTitle && (
              <p 
                className="job-title-text mt-1"
                style={{ 
                  color: jobTitleColor, 
                  fontSize: activeTemplate?.typography?.jobTitleSize || '1rem',
                  fontWeight: activeTemplate?.typography?.jobTitleWeight || '500',
                  fontStyle: activeTemplate?.typography?.jobTitleStyle || 'normal'
                }}
              >
                {personal.jobTitle}
              </p>
            )}
            <div className="mt-3 w-full">
              {renderContactInfo()}
            </div>
          </>
        )}

        {header.showDividerBelow && (
          <div 
            className="w-full mt-4" 
            style={{ 
              height: header.dividerThickness || '1px', 
              backgroundColor: header.dividerColor || 'var(--cv-divider)',
              opacity: 0.6
            }} 
          />
        )}
      </header>
    )
  }

  // ── Section Renderers ──────────────────────────────────────────────────────

  function renderProfessionalSummary(id: string, label: string) {
    const s = professionalSummaries.find(ps => ps.id === id)
    if (!s) return null
    return (
      <div className="mb-6">
        <SectionTitle sectionId={id} design={design} template={activeTemplate}>{label}</SectionTitle>
        <div className="prose prose-sm max-w-none text-inherit leading-relaxed" dangerouslySetInnerHTML={{ __html: s.content }} />
      </div>
    )
  }

  function renderPersonalSummary(id: string, label: string) {
    const s = personalSummaries.find(ps => ps.id === id)
    if (!s) return null
    return (
      <div className="mb-6">
        <SectionTitle sectionId={id} design={design} template={activeTemplate}>{label}</SectionTitle>
        <div className="prose prose-sm max-w-none text-inherit leading-relaxed" dangerouslySetInnerHTML={{ __html: s.content }} />
      </div>
    )
  }

  function renderExperience(label: string) {
    return (
      <div className="mb-6">
        <SectionTitle sectionId="experience" design={design} template={activeTemplate}>{label}</SectionTitle>
        <div className="space-y-6">
          {experience.filter(e => e.visible).map(exp => (
            <EntryLayout 
              key={exp.id}
              title={exp.jobTitle}
              subtitle={exp.company}
              date={`${formatMonthYear(exp.startDate)} — ${exp.currentlyWorking ? 'Present' : (exp.endDate?.year ? formatMonthYear(exp.endDate) : 'Present')}`}
              location={exp.location}
              description={exp.description}
              design={design}
              template={activeTemplate}
            />
          ))}
        </div>
      </div>
    )
  }

  function renderEducation(label: string) {
    return (
      <div className="mb-6">
        <SectionTitle sectionId="education" design={design} template={activeTemplate}>{label}</SectionTitle>
        <div className="space-y-6">
          {education.filter(e => e.visible).map(edu => (
            <EntryLayout 
              key={edu.id}
              title={edu.degree}
              subtitle={edu.institution}
              date={`${formatMonthYear(edu.startDate)} — ${edu.current ? 'Present' : (edu.endDate?.year ? formatMonthYear(edu.endDate) : 'Present')}`}
              location={edu.location}
              description={edu.description}
              design={design}
              template={activeTemplate}
            />
          ))}
        </div>
      </div>
    )
  }

  function renderSkills(label: string) {
    const skillStyle = activeTemplate?.skills?.defaultDisplayStyle || design.skillsLayout || 'tag'
    
    return (
      <div className="mb-6 w-full">
        <SectionTitle sectionId="skills" design={design} template={activeTemplate}>{label}</SectionTitle>
        <div className="flex flex-col gap-5 w-full">
          {skills.categories.filter(c => c.visible).map(cat => (
            <div key={cat.id} className="flex flex-col gap-2 w-full">
              <h4 
                className="font-bold text-[9pt] uppercase tracking-wider" 
                style={{ color: 'var(--cv-accent)', opacity: 0.8 }}
              >
                {cat.categoryName}
              </h4>
              <div className={cn(
                "flex flex-wrap gap-2 w-full",
                skillStyle === 'bar' && "flex-col gap-3"
              )}>
                {cat.items.filter(i => i.visible).map(item => {
                  if (skillStyle === 'tag') {
                    return (
                      <span 
                        key={item.id} 
                        className="px-3 py-1 rounded-md text-[9pt] font-medium transition-all"
                        style={{ 
                          backgroundColor: 'var(--cv-tag-bg, #f3f4f6)', 
                          color: 'var(--cv-tag-text, #374151)',
                          borderRadius: activeTemplate?.skills?.tagBorderRadius || '6px'
                        }}
                      >
                        {item.skill}
                      </span>
                    )
                  }
                  
                  if (skillStyle === 'dot') {
                    const levelsMap = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 }
                    const count = levelsMap[item.level as keyof typeof levelsMap] || 0
                    return (
                      <div key={item.id} className="flex justify-between items-center w-full max-w-[250px]">
                        <span className="text-[9.5pt] font-medium">{item.skill}</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map(i => (
                            <div 
                              key={i} 
                              className="rounded-full" 
                              style={{ 
                                width: activeTemplate?.skills?.dotSize || '6px', 
                                height: activeTemplate?.skills?.dotSize || '6px',
                                backgroundColor: i <= count ? 'var(--cv-accent)' : 'var(--cv-divider)' 
                              }} 
                            />
                          ))}
                        </div>
                      </div>
                    )
                  }

                  if (skillStyle === 'bar') {
                    const levelsMap = { beginner: '25%', intermediate: '50%', advanced: '75%', expert: '100%' }
                    const width = levelsMap[item.level as keyof typeof levelsMap] || '50%'
                    return (
                      <div key={item.id} className="flex flex-col gap-1 w-full max-w-[300px]">
                        <div className="flex justify-between text-[9pt] font-medium">
                          <span>{item.skill}</span>
                          <span className="opacity-50 italic">{item.level}</span>
                        </div>
                        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500" 
                            style={{ 
                              width, 
                              backgroundColor: 'var(--cv-accent)',
                              height: activeTemplate?.skills?.barHeight || '4px'
                            }} 
                          />
                        </div>
                      </div>
                    )
                  }

                  // Default: Plain
                  return (
                    <span key={item.id} className="text-[10pt] after:content-[','] last:after:content-[''] mr-1">
                      {item.skill}
                    </span>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  function renderLanguages(label: string) {
    return (
      <div className="mb-6">
        <SectionTitle sectionId="languages" design={design} template={activeTemplate}>{label}</SectionTitle>
        <div className="flex flex-wrap gap-4">
          {languages.filter(l => l.visible).map(lang => (
            <div key={lang.id} className="flex flex-col">
              <span className="font-bold text-[10pt]">{lang.name}</span>
              <span className="text-[9pt] opacity-60">{lang.description}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  function renderProjects(label: string) {
    return (
      <div className="mb-6">
        <SectionTitle sectionId="projects" design={design} template={activeTemplate}>{label}</SectionTitle>
        <div className="space-y-6">
          {projects.filter(p => p.visible).map(proj => (
            <EntryLayout 
              key={proj.id}
              title={proj.name}
              subtitle={proj.subtitle}
              date={proj.startDate ? `${formatMonthYear(proj.startDate)} — ${proj.endDate ? formatMonthYear(proj.endDate) : 'Present'}` : undefined}
              description={proj.description}
              design={design}
              template={activeTemplate}
            />
          ))}
        </div>
      </div>
    )
  }

  function renderCertifications(label: string) {
    return (
      <div className="mb-6">
        <SectionTitle sectionId="certifications" design={design} template={activeTemplate}>{label}</SectionTitle>
        <div className="space-y-4">
          {certifications.filter(c => c.visible).map(cert => (
            <EntryLayout 
              key={cert.id}
              title={cert.name}
              subtitle={cert.provider}
              date={cert.startDate ? `${formatMonthYear(cert.startDate)} — ${cert.endDate ? formatMonthYear(cert.endDate) : 'Present'}` : undefined}
              description={cert.description}
              design={design}
              template={activeTemplate}
            />
          ))}
        </div>
      </div>
    )
  }

  function renderAwards(label: string) {
    return (
      <div className="mb-6">
        <SectionTitle sectionId="awards" design={design} template={activeTemplate}>{label}</SectionTitle>
        <div className="space-y-4">
          {awards.filter(a => a.visible).map(award => (
            <div key={award.id} className="flex justify-between items-baseline gap-4">
              <div className="flex-1">
                <h4 className="font-bold text-[10pt] text-gray-800">{award.title}</h4>
                <p className="text-[9pt] text-gray-600">{award.issuer}</p>
                {award.description && <p className="text-[8.5pt] text-gray-500 mt-1">{award.description}</p>}
              </div>
              {award.date && <span className="text-[9pt] text-gray-400 shrink-0">{formatMonthYear(award.date)}</span>}
            </div>
          ))}
        </div>
      </div>
    )
  }

  function renderVolunteer(label: string) {
    return (
      <div className="mb-6">
        <SectionTitle sectionId="volunteer" design={design} template={activeTemplate}>{label}</SectionTitle>
        <div className="space-y-6">
          {volunteer.filter(v => v.visible).map(vol => (
            <EntryLayout 
              key={vol.id}
              title={vol.role}
              subtitle={vol.organization}
              date={`${formatMonthYear(vol.startDate)} — ${vol.current ? 'Present' : (vol.endDate?.year ? formatMonthYear(vol.endDate) : 'Present')}`}
              location={vol.location}
              description={vol.description}
              design={design}
              template={activeTemplate}
            />
          ))}
        </div>
      </div>
    )
  }

  function renderResearch(label: string) {
    return (
      <div className="mb-6">
        <SectionTitle sectionId="research" design={design} template={activeTemplate}>{label}</SectionTitle>
        <div className="space-y-6">
          {research.filter(r => r.visible).map(res => (
            <EntryLayout 
              key={res.id}
              title={res.title}
              subtitle={res.institution}
              date={`${formatMonthYear(res.startDate)} — ${res.current ? 'Present' : (res.endDate?.year ? formatMonthYear(res.endDate) : 'Present')}`}
              location={res.location}
              description={res.description}
              design={design}
              template={activeTemplate}
            />
          ))}
        </div>
      </div>
    )
  }

  function renderTraining(label: string) {
    return (
      <div className="mb-6">
        <SectionTitle sectionId="training" design={design} template={activeTemplate}>{label}</SectionTitle>
        <div className="space-y-6">
          {training.filter(t => t.visible).map(tr => (
            <EntryLayout 
              key={tr.id}
              title={tr.name}
              subtitle={tr.provider}
              date={`${formatMonthYear(tr.startDate)} — ${tr.current ? 'Present' : (tr.endDate?.year ? formatMonthYear(tr.endDate) : 'Present')}`}
              description={tr.description}
              design={design}
              template={activeTemplate}
            />
          ))}
        </div>
      </div>
    )
  }

  function renderInterests(label: string) {
    return (
      <div className="mb-6">
        <SectionTitle sectionId="interests" design={design} template={activeTemplate}>{label}</SectionTitle>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {interests.filter(i => i.visible).map(interest => (
            <div key={interest.id} className="flex flex-col">
              <span className="font-bold text-[10pt] text-gray-800">{interest.name}</span>
              <span className="text-[8.5pt] text-gray-500">{interest.description}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  function renderReferences(label: string) {
    return (
      <div className="mb-6">
        <SectionTitle sectionId="references" design={design} template={activeTemplate}>{label}</SectionTitle>
        <div className="grid grid-cols-2 gap-8">
          {references.filter(r => r.visible).map(ref => (
            <div key={ref.id} className="space-y-1">
              <h4 className="font-bold text-[10pt] text-gray-800">{ref.name}</h4>
              <p className="text-[9pt] text-gray-600 font-medium">{ref.position}</p>
              <div className="text-[8.5pt] text-gray-500 space-y-0.5 pt-1">
                {ref.address && <p>{ref.address}</p>}
                {ref.email && <p className="flex items-center gap-1.5"><Mail width={10} height={10} /> {ref.email}</p>}
                {ref.phone && <p className="flex items-center gap-1.5"><Phone width={10} height={10} /> {ref.phone}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  function renderSection(id: string, label: string) {
    if (id.startsWith('prof-summary-')) return <div key={id}>{renderProfessionalSummary(id, label)}</div>
    if (id.startsWith('pers-summary-') || id === 'personal-summary') return <div key={id}>{renderPersonalSummary(id, label)}</div>

    switch (id) {
      case 'experience': return <div key={id}>{renderExperience(label)}</div>
      case 'education': return <div key={id}>{renderEducation(label)}</div>
      case 'skills': return <div key={id}>{renderSkills(label)}</div>
      case 'languages': return <div key={id}>{renderLanguages(label)}</div>
      case 'projects': return <div key={id}>{renderProjects(label)}</div>
      case 'certifications': return <div key={id}>{renderCertifications(label)}</div>
      case 'awards': return <div key={id}>{renderAwards(label)}</div>
      case 'volunteer': return <div key={id}>{renderVolunteer(label)}</div>
      case 'interests': return <div key={id}>{renderInterests(label)}</div>
      case 'references': return <div key={id}>{renderReferences(label)}</div>
      case 'research': return <div key={id}>{renderResearch(label)}</div>
      case 'training': return <div key={id}>{renderTraining(label)}</div>
      default: return null
    }
  }

  // ── Render Main ────────────────────────────────────────────────────────────

  // ── Render Main ────────────────────────────────────────────────────────────

  const layoutType = design.layout || activeTemplate?.layout?.type || 'one-column'
  const isTemplateLayout = activeTemplate?.layout?.type === layoutType
  
  const sidebarPosition = isTemplateLayout 
    ? (activeTemplate?.layout?.sidebarPosition || (layoutType === 'sidebar-left' ? 'left' : layoutType === 'sidebar-right' ? 'right' : 'none'))
    : (layoutType === 'sidebar-left' ? 'left' : layoutType === 'sidebar-right' ? 'right' : 'none')

  const sidebarSections = isTemplateLayout 
    ? (activeTemplate?.sidebar?.sections || [])
    : (sidebarPosition !== 'none' ? ['skills', 'languages', 'interests', 'references'] : [])

  const sidebarStyle: React.CSSProperties = {
    backgroundColor: activeTemplate?.colors['--cv-sidebar-bg'] || 'transparent',
    padding: activeTemplate?.sidebar?.padding || '0',
    borderRight: sidebarPosition === 'left' ? (activeTemplate?.decorations?.sidebarBorder || 'none') : 'none',
    borderLeft: sidebarPosition === 'right' ? (activeTemplate?.decorations?.sidebarBorder || 'none') : 'none',
  }

  return (
    <div 
      id="cv-preview-card"
      className={cn(
        "bg-white shadow-2xl mx-auto origin-top transition-all duration-500 overflow-hidden",
        design.pageSize === 'a4' ? "aspect-[210/297]" : "aspect-[8.5/11]"
      )}
      style={{ 
        ...containerStyle,
        width: '100%',
        backgroundColor: activeTemplate?.colors['--cv-page-bg'] || '#ffffff'
      }}
    >
      <FontLoader googleFamily={activeFontFamily} />
      <StyleInjector tokens={themeColors as any} templateId={design.templateId} />
      <ListStyles style={design.listStyle} />
      
      {renderPersonal()}

      <div className={cn(
        "grid h-full",
        (layoutType === 'two-column' || sidebarPosition !== 'none') 
          ? (sidebarPosition === 'left' ? "grid-cols-[1fr_2fr]" : "grid-cols-[2fr_1fr]") 
          : "grid-cols-1"
      )}
      style={{ gap: activeTemplate?.sections?.sectionSpacing || '2rem' }}
      >
        {/* Sidebar (if on left) */}
        {sidebarPosition === 'left' && (
          <div className="space-y-6 h-full" style={sidebarStyle}>
            {sectionOrder
              .filter(s => s.visible && hasSectionContent(s.id) && sidebarSections.includes(s.id))
              .map((section) => renderSection(section.id, section.label))}
          </div>
        )}

        {/* Main Content */}
        <div 
          className="space-y-8"
          style={{ 
            padding: sidebarPosition !== 'none' ? '0' : ((activeTemplate?.sections as any)?.mainPadding || '0')
          }}
        >
          {sectionOrder
            .filter(s => s.visible && hasSectionContent(s.id) && !sidebarSections.includes(s.id))
            .map((section) => renderSection(section.id, section.label))}
        </div>

        {/* Sidebar (if on right) */}
        {sidebarPosition === 'right' && (
          <div className="space-y-6 h-full" style={sidebarStyle}>
            {sectionOrder
              .filter(s => s.visible && hasSectionContent(s.id) && sidebarSections.includes(s.id))
              .map((section) => renderSection(section.id, section.label))}
          </div>
        )}
      </div>

      <Footer design={design} personal={personal} template={activeTemplate} />
    </div>
  )
}
