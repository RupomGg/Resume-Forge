// Turns CVData into a flat list of unbreakable blocks per column.
// PagedResume measures these and distributes them over pages.

import type { CSSProperties, ReactNode } from 'react'
import {
  Mail, Phone, MapPin, Globe, Link as LinkIcon, User, Briefcase, GraduationCap, Award,
  Code, Languages, Users, Star, FileText, Search, Wrench, Milestone,
} from 'lucide-react'
import type { CVData, DesignSettings, MonthYear, SkillLevel } from '@/models/cv.types'
import { formatMonthYear, getFont, getTheme } from '@/lib/utils'

export interface Block {
  key: string
  node: ReactNode
  /** px of trailing space, rendered as padding-bottom so heights stay additive */
  gap: number
  keepWithNext?: boolean
}

interface Entry {
  id: string
  title: string
  subtitle?: string
  date?: string
  location?: string
  description?: string
  link?: string
  extra?: string
}

const MM = 96 / 25.4
const ENTRY_GAP = 9
export const SIDE_SECTIONS = ['skills', 'languages', 'interests', 'certifications', 'awards', 'references']

export const isEmptyHtml = (html?: string | null) => !html || html.replace(/<[^>]*>/g, '').trim() === ''
const stripHtml = (html?: string) => (html ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

// ─── Geometry & CSS variables ────────────────────────────────────────────────

export function geometry(d: DesignSettings) {
  const pageW = d.pageSize === 'letter' ? 816 : 210 * MM
  const pageH = d.pageSize === 'letter' ? 1056 : 297 * MM
  const hasSide = d.layout !== 'one-column'
  const gap = hasSide ? 22 : 0
  const contentW = pageW - (d.marginLeft + d.marginRight) * MM
  const sideW = hasSide ? Math.round((contentW - gap) * (d.sidebarWidth || 30) / 100) : 0
  const mainW = contentW - gap - sideW
  const f = d.footer
  const hasFooter = !!f && (f.useCustomFooter
    ? !!(f.leftColumn || f.centerColumn || f.rightColumn)
    : f.showPageNumbers || f.showEmail || f.showName)
  const footH = hasFooter ? 22 : 0
  // 2px slack absorbs integer rounding of measured block heights
  const availH = pageH - (d.marginTop + d.marginBottom) * MM - footH - 2
  return { pageW, pageH, gap, sideW, mainW, footH, availH, hasSide, hasFooter }
}

const NAME_PT = { xs: 18, s: 22, m: 26, l: 30, xl: 36 }
const JOB_PT = { s: 10, m: 12, l: 14 }
const PHOTO_PX = { xs: 52, s: 68, m: 84, l: 104, xl: 128 }

export function cssVars(d: DesignSettings): CSSProperties {
  const g = geometry(d)
  const theme = getTheme(d.colorThemeId)
  const accent = d.customAccentColor || theme.accentColor
  const on = d.applyAccentTo
  const font = `"${getFont(d.fontId).googleFamily}", Arial, sans-serif`
  const sideColored = g.hasSide && d.layout !== 'two-column'
  const sideSolid = sideColored && d.colorMode === 'advanced'
  const sideLeft = d.layout === 'sidebar-left'
  const sub = d.subtitleStyle
  return {
    '--rf-pw': `${g.pageW}px`, '--rf-ph': `${g.pageH}px`,
    '--rf-mt': `${d.marginTop}mm`, '--rf-mb': `${d.marginBottom}mm`,
    '--rf-ml': `${d.marginLeft}mm`, '--rf-mr': `${d.marginRight}mm`,
    '--rf-gap': `${g.gap}px`, '--rf-main-w': `${g.mainW}px`, '--rf-side-w': `${g.sideW}px`,
    '--rf-sidebg-w': `${g.sideW + g.gap / 2 + (sideLeft ? d.marginLeft : d.marginRight) * MM}px`,
    '--rf-foot-h': `${g.footH}px`,
    '--rf-font': font,
    '--rf-fs': `${d.fontSize || 10}pt`, '--rf-lh': d.lineHeight || 1.4,
    '--rf-accent': accent, '--rf-accent-soft': `${accent}1f`,
    '--rf-text': theme.bodyTextColor, '--rf-muted': '#6b7280',
    '--rf-divider': theme.dividerColor,
    '--rf-divider-c': d.dividerStyle === 'colored' ? accent : theme.dividerColor,
    '--rf-divider-w': d.dividerStyle === 'none' ? '0' : d.dividerStyle === 'thin' ? '0.75pt' : '1.5pt',
    '--rf-side-bg': sideColored ? (sideSolid ? accent : `${accent}14`) : 'transparent',
    '--rf-side-text': sideSolid ? '#ffffff' : 'inherit',
    '--rf-side-heading': sideSolid ? '#ffffff' : (on.headings ? accent : '#111827'),
    '--rf-side-chip': sideSolid ? '#ffffff2e' : `${accent}1f`,
    '--rf-name-fs': `${NAME_PT[d.nameSize] ?? 26}pt`, '--rf-name-fw': d.nameBold ? 700 : 400,
    '--rf-name-color': on.name ? accent : '#111827',
    '--rf-name-font': d.nameFontFamily === 'creative' ? '"Playfair Display", Georgia, serif' : font,
    '--rf-job-fs': `${JOB_PT[d.titleSizeScale] ?? 12}pt`,
    '--rf-job-color': on.jobTitle ? accent : theme.bodyTextColor,
    '--rf-job-style': d.titleStyle === 'italic' ? 'italic' : 'normal',
    '--rf-photo': `${PHOTO_PX[d.photoSizeScale] ?? 68}px`,
    '--rf-ico-color': on.headerIcons ? accent : 'currentColor',
    '--rf-h-fs': `${d.headingSize || 10}pt`, '--rf-h-color': on.headings ? accent : '#111827',
    '--rf-title-fs': `${d.titleSize || 11}pt`, '--rf-title-color': '#111827',
    '--rf-sub-fs': `${d.subtitleSize || 9}pt`,
    '--rf-sub-color': on.entrySubtitle ? accent : theme.bodyTextColor,
    '--rf-sub-fw': sub === 'bold' || sub === 'bold-italic' ? 700 : 400,
    '--rf-sub-style': sub === 'italic' || sub === 'bold-italic' ? 'italic' : 'normal',
    '--rf-date-color': on.dates ? accent : '#6b7280',
    '--rf-link-color': on.linkIcons ? accent : 'inherit',
    '--rf-viz': on.dotsBarsBubbles ? accent : '#374151',
    '--rf-indent': `${d.descriptionIndentation || 0}px`,
    '--rf-list': { none: 'none', bullet: 'disc', dash: '"– "', check: '"✓ "' }[d.listStyle] ?? 'disc',
  } as CSSProperties
}

/** Google Fonts stylesheet URLs the document needs (v1 API tolerates missing weights). */
export function fontUrls(d: DesignSettings): string[] {
  const families = [getFont(d.fontId).googleFamily]
  if (d.nameFontFamily === 'creative') families.push('Playfair Display')
  return families.map((f) =>
    `https://fonts.googleapis.com/css?family=${f.replace(/ /g, '+')}:300,400,400i,500,600,700,700i&display=swap`)
}

// ─── Pieces ──────────────────────────────────────────────────────────────────

const SECTION_ICONS: Record<string, typeof User> = {
  experience: Briefcase, education: GraduationCap, skills: Code, languages: Languages,
  projects: Milestone, certifications: Award, awards: Star, volunteer: Users,
  research: Search, training: Wrench, references: User, interests: Star,
}

function Heading({ id, label, d }: { id: string; label: string; d: DesignSettings }) {
  const Icon = SECTION_ICONS[id] ?? FileText
  return (
    <div className={`rf-hw rf-hw--${d.headingStyle || 'simple'}`}>
      <h2 className={`rf-h rf-h--${d.headingCase} ${d.headingAlign === 'center' ? 'rf-h--center' : ''}`}>
        {d.showHeadingIcons && <Icon className="rf-h-ico" />}
        <span>{label}</span>
      </h2>
    </div>
  )
}

const Rich = ({ html, plain }: { html?: string; plain?: boolean }) =>
  isEmptyHtml(html) ? null : (
    <div className={`rf-rich ${plain ? 'rf-rich--plain' : ''}`} dangerouslySetInnerHTML={{ __html: html! }} />
  )

function EntryView({ e, d }: { e: Entry; d: DesignSettings }) {
  const beside = d.subtitlePlacement === 'beside-title'
  const right = d.subtitlePlacement === 'right-aligned'
  const sub = e.subtitle ? <span className="rf-sub">{e.subtitle}</span> : null
  const date = e.date ? <span className="rf-date">{e.date}</span> : null
  const loc = e.location ? <span className="rf-loc">{e.location}</span> : null
  const title = <h3 className="rf-title">{e.title}{beside && sub}</h3>
  const body = (
    <>
      {e.extra && <div className="rf-muted">{e.extra}</div>}
      {e.link && <div className="rf-link"><a href={`https://${e.link}`}>{e.link}</a></div>}
      <Rich html={e.description} />
    </>
  )
  const layout = d.entryLayoutId

  if (layout === 'layout-2' || layout === 'layout-3') {
    const split = layout === 'layout-3'
    return (
      <div className="rf-split">
        <div className="rf-meta">{date}{!split && loc}</div>
        <div className="rf-grow">{title}{!beside && sub && <div>{sub}</div>}{body}</div>
        {split && loc}
      </div>
    )
  }
  if (right) {
    return (
      <>
        <div className="rf-row">{title}{sub}</div>
        {(date || loc) && <div className="rf-row">{date ?? <span />}{loc}</div>}
        {body}
      </>
    )
  }
  if (layout === 'layout-5') {
    // Academic (Harvard-style): organisation + place, then role + dates
    return (
      <>
        <div className="rf-row">{title}{loc}</div>
        {((!beside && sub) || date) && <div className="rf-row">{beside ? <span /> : sub ?? <span />}{date}</div>}
        {body}
      </>
    )
  }
  if (layout === 'layout-1') {
    const meta = [e.date, e.location].filter(Boolean).join('  |  ')
    return (
      <>
        <div className="rf-row">{title}{meta && <span className="rf-date">{meta}</span>}</div>
        {!beside && sub && <div>{sub}</div>}
        {body}
      </>
    )
  }
  return (
    <>
      <div className="rf-row">{title}{date}</div>
      {((!beside && sub) || loc) && <div className="rf-row">{beside ? <span /> : sub ?? <span />}{loc}</div>}
      {body}
    </>
  )
}

const LEVELS: Record<SkillLevel, number> = { none: 0, beginner: 2, intermediate: 3, advanced: 4, expert: 5 }

function LevelViz({ level, d }: { level: SkillLevel; d: DesignSettings }) {
  const n = LEVELS[level] ?? 0
  if (!n) return null
  if (d.skillsLevelVisualizer === 'text') return <span className="rf-skill-info" style={{ textTransform: 'capitalize' }}>{level}</span>
  if (d.skillsLevelVisualizer === 'bar') return <span className="rf-bar"><i style={{ width: `${n * 20}%` }} /></span>
  return (
    <span className="rf-dots">
      {[1, 2, 3, 4, 5].map((i) => <span key={i} className={`rf-dot ${i <= n ? 'rf-dot--on' : ''}`} />)}
    </span>
  )
}

const withInfo = (name: string, info: string, style: string) =>
  !info ? name : style === 'colon' ? `${name}: ${info}` : style === 'dash' ? `${name} – ${info}` : `${name} (${info})`

interface SimpleItem { id: string; name: string; info: string; level: SkillLevel }

function ItemList({ items, d }: { items: SimpleItem[]; d: DesignSettings }) {
  const layout = d.skillsLayout
  if (layout === 'compact') {
    const sep = { bullet: '  •  ', pipe: '  |  ', comma: ', ' }[d.skillsCompactSeparator] ?? '  •  '
    return <div>{items.map((s) => withInfo(s.name, s.info, d.skillsCompactSubinfoStyle)).join(sep)}</div>
  }
  if (layout === 'bubble') {
    return (
      <div className="rf-bubbles">
        {items.map((s) => <span key={s.id} className="rf-bubble">{withInfo(s.name, s.info, d.skillsBubbleSubinfoStyle)}</span>)}
      </div>
    )
  }
  if (layout === 'rows') {
    return (
      <div
        className={`rf-rows ${d.skillsShowRowBullets ? 'rf-rows--bullets' : ''}`}
        style={{ '--rf-row-gap': d.skillsRowSpacing === 'tight' ? '1pt' : '4pt' } as CSSProperties}
      >
        {items.map((s) => <div key={s.id}>{withInfo(s.name, s.info, d.skillsRowSubinfoStyle)}</div>)}
      </div>
    )
  }
  if (layout === 'level') {
    return (
      <div className="rf-grid" style={{ '--rf-cols': 2 } as CSSProperties}>
        {items.map((s) => (
          <div key={s.id} className="rf-level"><span className="rf-skill-name">{s.name}</span><LevelViz level={s.level} d={d} /></div>
        ))}
      </div>
    )
  }
  return (
    <div className="rf-grid" style={{ '--rf-cols': d.skillsGridColumns || 3 } as CSSProperties}>
      {items.map((s) => (
        <div key={s.id}>
          <div className="rf-skill-name">{s.name}</div>
          {s.info && <div className="rf-skill-info">{s.info}</div>}
        </div>
      ))}
    </div>
  )
}

function Header({ data }: { data: CVData }) {
  const { personal: p, design: d } = data
  // Real links survive into the PDF, where ATS parsers and recruiters can follow them.
  const web = (v: string) => (/^https?:\/\//.test(v) ? v : `https://${v}`)
  const details = [
    { v: p.email, I: Mail, href: `mailto:${p.email}` }, { v: p.phone, I: Phone, href: `tel:${p.phone.replace(/[^\d+]/g, '')}` },
    { v: p.location, I: MapPin, href: '' }, { v: p.website, I: Globe, href: web(p.website) },
    { v: p.linkedin, I: LinkIcon, href: web(p.linkedin) }, { v: p.github, I: LinkIcon, href: web(p.github) },
  ].filter((x) => x.v)
  const arrangement = d.detailsArrangement || 'bullet'
  const icons = ['icon', 'stacked', 'columns'].includes(arrangement)
  const photo = d.showPhoto && p.photoUrl
  const band = d.colorMode === 'advanced' && d.layout === 'one-column'
  const summary = d.resumeSummaryInHeader ? data.personalSummaries.find((s) => s.visible && !isEmptyHtml(s.content)) : null
  const cls = [
    'rf-head',
    d.headerAlignment === 'center' && 'rf-head--center',
    photo && d.photoPosition !== 'left' && `rf-head--photo-${d.photoPosition}`,
    band && 'rf-head--band',
  ].filter(Boolean).join(' ')
  return (
    <div className={cls}>
      {photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt="" className={`rf-photo rf-photo--${d.photoShape} ${d.photoGrayscale ? 'rf-photo--gray' : ''}`} />
      )}
      <div className="rf-head-text">
        <div>
          <h1 className="rf-name">{p.fullName}</h1>
          {p.jobTitle && <div className={`rf-job ${d.titlePosition === 'inline' ? 'rf-job--inline' : ''}`}>{p.jobTitle}</div>}
        </div>
        {details.length > 0 && (
          <div className={`rf-details rf-details--${arrangement}`}>
            {details.map(({ v, I, href }, i) => {
              const text = v.replace(/^https?:\/\/(www\.)?/, '')
              return (
                <span key={i} className="rf-detail">
                  {icons && <I className="rf-ico" />}
                  {href ? <a href={href}>{text}</a> : text}
                </span>
              )
            })}
          </div>
        )}
        {summary && <div className="rf-head-summary"><Rich html={summary.content} plain /></div>}
      </div>
    </div>
  )
}

// ─── Section → entries ───────────────────────────────────────────────────────

function range(d: DesignSettings, start?: MonthYear | null, end?: MonthYear | null, current?: boolean) {
  const a = formatMonthYear(start ?? null, d.dateFormat)
  const b = current ? 'Present' : formatMonthYear(end ?? null, d.dateFormat)
  return [a, b].filter(Boolean).join(' – ')
}

function entriesFor(id: string, data: CVData): Entry[] | null {
  const d = data.design
  const swap = (title: string, subtitle: string, order: string) =>
    order === 'subtitle-first' && subtitle ? { title: subtitle, subtitle: title } : { title, subtitle }
  switch (id) {
    case 'experience':
      return data.experience.filter((e) => e.visible).map((e) => ({
        id: e.id, ...swap(e.jobTitle, e.company, d.resumeExperienceOrder), location: e.location,
        date: range(d, e.startDate, e.endDate, e.currentlyWorking), description: e.description,
      }))
    case 'education':
      return data.education.filter((e) => e.visible).map((e) => ({
        id: e.id, ...swap(e.degree, e.institution, d.resumeEducationOrder), location: e.location,
        date: range(d, e.startDate, e.endDate, e.current), description: e.description,
        extra: e.gpa ? `GPA: ${e.gpa}` : undefined,
      }))
    case 'research':
      return data.research.filter((e) => e.visible).map((e) => ({
        id: e.id, title: e.title, subtitle: e.institution, location: e.location,
        date: range(d, e.startDate, e.endDate, e.current), description: e.description,
      }))
    case 'training':
      return data.training.filter((e) => e.visible).map((e) => ({
        id: e.id, title: e.name, subtitle: e.provider,
        date: range(d, e.startDate, e.endDate, e.current), description: e.description,
      }))
    case 'volunteer':
      return data.volunteer.filter((e) => e.visible).map((e) => ({
        id: e.id, title: e.role, subtitle: e.organization, location: e.location,
        date: range(d, e.startDate, e.endDate, e.current), description: e.description,
      }))
    case 'projects':
      return data.projects.filter((e) => e.visible).map((e) => ({
        id: e.id, title: e.name, subtitle: e.subtitle, date: range(d, e.startDate, e.endDate),
        description: e.description, link: e.url?.replace(/^https?:\/\/(www\.)?/, ''),
        extra: e.technologies?.length ? e.technologies.join(' · ') : undefined,
      }))
    case 'certifications':
      return data.certifications.filter((e) => e.visible).map((e) => ({
        id: e.id, title: e.name, subtitle: e.provider, date: range(d, e.startDate, e.endDate), description: e.description,
      }))
    case 'awards':
      return data.awards.filter((e) => e.visible).map((e) => ({
        id: e.id, title: e.title, subtitle: e.issuer, date: formatMonthYear(e.date, d.dateFormat), description: e.description,
      }))
    case 'references':
      return data.references.filter((e) => e.visible).map((e) => ({
        id: e.id, title: e.name, subtitle: e.position,
        extra: [e.address, e.email, e.phone].filter(Boolean).join(' · ') || undefined,
      }))
    default: {
      const custom = data.customSections.find((s) => s.id === id)
      return custom
        ? custom.items.filter((e) => e.visible).map((e) => ({
            id: e.id, title: e.title, subtitle: e.subtitle, date: e.date, description: e.description,
          }))
        : null
    }
  }
}

const hasText = (e: Entry) => !!(e.title || e.subtitle || !isEmptyHtml(e.description) || e.extra)

// ─── Public: build blocks ────────────────────────────────────────────────────

export function buildBlocks(data: CVData): { main: Block[]; side: Block[] } {
  const d = data.design
  const hasSide = d.layout !== 'one-column'
  const sectionGap = d.sectionSpacing ?? 16
  const main: Block[] = [{ key: 'header', node: <Header data={data} />, gap: sectionGap + 2 }]
  const side: Block[] = []

  for (const s of data.sectionOrder) {
    if (s.id === 'personal' || !s.visible) continue
    const col = (s.column ?? (SIDE_SECTIONS.includes(s.id) ? 'side' : 'main')) === 'side' && hasSide ? side : main
    const heading: Block = { key: `${s.id}:h`, node: <Heading id={s.id} label={s.label} d={d} />, gap: 0, keepWithNext: true }
    const body: Block[] = []

    const summary = data.personalSummaries.find((x) => x.id === s.id) ?? data.professionalSummaries.find((x) => x.id === s.id)
    if (summary) {
      if (d.resumeSummaryInHeader && summary === data.personalSummaries.find((x) => x.visible && !isEmptyHtml(x.content))) continue
      if (summary.visible && !isEmptyHtml(summary.content)) {
        body.push({ key: s.id, node: <Rich html={summary.content} plain />, gap: 0 })
      }
      if (body.length && !d.resumeShowSummaryHeading) { body[0].gap = sectionGap; col.push(body[0]); continue }
    } else if (s.id === 'skills' || s.id === 'languages' || s.id === 'interests') {
      const items: SimpleItem[] = s.id === 'skills'
        ? data.skills.categories.filter((c) => c.visible && c.categoryName.trim())
            .map((c) => ({ id: c.id, name: c.categoryName, info: stripHtml(c.description), level: c.level }))
        : data[s.id as 'languages' | 'interests'].filter((c) => c.visible && c.name.trim())
            .map((c) => ({ id: c.id, name: c.name, info: stripHtml(c.description), level: 'none' as SkillLevel }))
      if (items.length) body.push({ key: s.id, node: <ItemList items={items} d={d} />, gap: 0 })
    } else {
      const entries = (entriesFor(s.id, data) ?? []).filter(hasText)
      entries.forEach((e) => body.push({ key: `${s.id}:${e.id}`, node: <EntryView e={e} d={d} />, gap: ENTRY_GAP }))
    }

    if (!body.length) {
      if (d.resumeHideEmptySections === false) col.push({ ...heading, keepWithNext: false, gap: sectionGap })
      continue
    }
    body[body.length - 1].gap = sectionGap
    col.push(heading, ...body)
  }
  return { main, side }
}
