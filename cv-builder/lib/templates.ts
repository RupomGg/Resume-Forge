// Templates are presets of DesignSettings — applying one just merges it into the
// resume's design, so everything stays editable in Customize afterwards.
//
// Every template here follows the formats career offices and recruiters recommend for
// applicant tracking systems: one column, standard fonts, plain-text skills, no photo,
// no icons, no filled backgrounds. All templates and fonts are available on every plan.
//
// A template is also a set of independent PARTS (header, headings, entry rows, …), so a
// resume can take each part from a different template — see applyPart / partSource.

import type { AccentColorApplication, DesignSettings } from '@/models/cv.types'

export interface TemplatePreset {
  id: string
  name: string
  /** Where the format comes from / who it suits. */
  description: string
  design: Partial<DesignSettings>
}

const noAccent: AccentColorApplication = {
  name: false, jobTitle: false, headings: false, headerIcons: false,
  dotsBarsBubbles: false, dates: false, entrySubtitle: false, linkIcons: false,
}

// Defines every key of every part, so applying a part always fully replaces it.
const base: Partial<DesignSettings> = {
  // page (only applied with the whole template)
  layout: 'one-column', pageSize: 'a4', showPhoto: false,
  // header
  headerAlignment: 'left', detailsArrangement: 'bullet', nameSize: 'm', nameBold: true,
  nameFontFamily: 'body', titleSizeScale: 'm', titlePosition: 'below', titleStyle: 'normal',
  // headings
  headingStyle: 'simple', headingCase: 'uppercase', headingAlign: 'left', headingSize: 11,
  dividerStyle: 'thin', showHeadingIcons: false,
  // entry rows
  entryLayoutId: 'layout-4', subtitlePlacement: 'below-title', subtitleStyle: 'italic',
  titleSize: 11, subtitleSize: 10.5, listStyle: 'bullet', descriptionIndentation: 0,
  resumeExperienceOrder: 'title-first', resumeEducationOrder: 'subtitle-first', dateFormat: 'short',
  // skills
  skillsLayout: 'rows', skillsGridColumns: 3, skillsRowSpacing: 'tight', skillsShowRowBullets: false,
  skillsRowSubinfoStyle: 'colon', skillsCompactSeparator: 'comma', skillsCompactSubinfoStyle: 'bracket',
  skillsBubbleSubinfoStyle: 'bracket', skillsLevelVisualizer: 'text',
  // font & spacing
  fontId: 'arimo', fontSize: 10.5, lineHeight: 1.35, sectionSpacing: 14,
  marginTop: 15, marginBottom: 15, marginLeft: 16, marginRight: 16,
  // colors
  colorThemeId: 'black', customAccentColor: undefined, colorMode: 'basic', applyAccentTo: noAccent,
}

export const PARTS = {
  header: {
    label: 'Header',
    keys: ['headerAlignment', 'detailsArrangement', 'nameSize', 'nameBold', 'nameFontFamily', 'titleSizeScale', 'titlePosition', 'titleStyle'],
  },
  headings: {
    label: 'Section headings',
    keys: ['headingStyle', 'headingCase', 'headingAlign', 'headingSize', 'dividerStyle', 'showHeadingIcons'],
  },
  entries: {
    label: 'Entry rows',
    keys: ['entryLayoutId', 'subtitlePlacement', 'subtitleStyle', 'titleSize', 'subtitleSize', 'listStyle', 'descriptionIndentation', 'resumeExperienceOrder', 'resumeEducationOrder', 'dateFormat'],
  },
  skills: {
    label: 'Skills',
    keys: ['skillsLayout', 'skillsGridColumns', 'skillsRowSpacing', 'skillsShowRowBullets', 'skillsRowSubinfoStyle', 'skillsCompactSeparator', 'skillsCompactSubinfoStyle', 'skillsBubbleSubinfoStyle', 'skillsLevelVisualizer'],
  },
  type: {
    label: 'Font & spacing',
    keys: ['fontId', 'fontSize', 'lineHeight', 'sectionSpacing', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight'],
  },
  color: {
    label: 'Colors',
    keys: ['colorThemeId', 'customAccentColor', 'colorMode', 'applyAccentTo'],
  },
} as const satisfies Record<string, { label: string; keys: readonly (keyof DesignSettings)[] }>

export type PartId = keyof typeof PARTS
export const PART_IDS = Object.keys(PARTS) as PartId[]

const preset = (id: string, name: string, description: string, design: Partial<DesignSettings>): TemplatePreset =>
  ({ id, name, description, design: { ...base, ...design, templateId: id } })

export const TEMPLATES: TemplatePreset[] = [
  preset('classic', 'Classic', 'The reverse-chronological standard recruiters ask for: left-aligned, ruled headings.', {
    subtitleStyle: 'bold', skillsLayout: 'compact',
  }),
  preset('harvard', 'Harvard', 'After the Harvard career-office format: centered serif header, organisation and place first.', {
    fontId: 'tinos', fontSize: 11, headerAlignment: 'center', headingStyle: 'minimal', headingCase: 'capitalize',
    headingAlign: 'center', headingSize: 12, entryLayoutId: 'layout-5', resumeExperienceOrder: 'subtitle-first',
    dateFormat: 'full', subtitleSize: 11,
  }),
  preset('jake', "Jake's", "After the LaTeX résumé most software engineers use: small-caps ruled headings, pipe-separated contacts.", {
    fontId: 'crimson-pro', fontSize: 11, headerAlignment: 'center', nameSize: 'l', detailsArrangement: 'bar',
    headingCase: 'small-caps', headingSize: 12, subtitleSize: 11,
  }),
  preset('business', 'Business School', 'After MBA career-office formats: uppercase headings on a solid rule, employer and city first.', {
    fontId: 'caladea', headerAlignment: 'center', headingStyle: 'underlined', entryLayoutId: 'layout-5',
    resumeExperienceOrder: 'subtitle-first', detailsArrangement: 'bar',
  }),
  preset('tech', 'Tech', 'One line per role (title | company, dates) to fit more projects on a page.', {
    fontId: 'carlito', fontSize: 11, detailsArrangement: 'bar', entryLayoutId: 'layout-1',
    subtitlePlacement: 'beside-title', subtitleStyle: 'normal', dividerStyle: 'thick',
  }),
  preset('minimal', 'Minimal', 'No rules, generous spacing. Relies on type alone.', {
    fontId: 'inter', fontSize: 10, headingStyle: 'minimal', headingCase: 'capitalize', headingSize: 12,
    subtitleStyle: 'normal', sectionSpacing: 18, lineHeight: 1.45, skillsLayout: 'compact', colorThemeId: 'charcoal',
  }),
  preset('modern', 'Modern', 'Classic structure with one restrained accent colour on name and headings.', {
    fontId: 'lato', colorThemeId: 'navy', applyAccentTo: { ...noAccent, name: true, headings: true },
    headingStyle: 'underlined', subtitleStyle: 'bold', skillsLayout: 'compact', skillsCompactSeparator: 'bullet',
  }),
  preset('executive', 'Executive', 'Larger name and double-ruled headings for senior profiles.', {
    fontId: 'gelasio', nameSize: 'l', headingStyle: 'double-line', subtitleStyle: 'bold', dateFormat: 'full',
    resumeExperienceOrder: 'subtitle-first',
  }),
  preset('compact', 'Compact', 'Tight margins and 9.5pt type to keep long experience on one page.', {
    fontSize: 9.5, lineHeight: 1.25, sectionSpacing: 10, marginTop: 11, marginBottom: 11, marginLeft: 12,
    marginRight: 12, nameSize: 's', headingSize: 10, titleSize: 10, subtitleSize: 9.5, entryLayoutId: 'layout-1',
    subtitlePlacement: 'beside-title', subtitleStyle: 'normal', skillsLayout: 'compact',
  }),
  preset('elegant', 'Elegant', 'Centered small-caps headings in a book serif, with a muted accent.', {
    fontId: 'lora', headerAlignment: 'center', headingCase: 'small-caps', headingAlign: 'center', headingSize: 12,
    colorThemeId: 'burgundy', applyAccentTo: { ...noAccent, name: true, headings: true }, entryLayoutId: 'layout-5',
    resumeExperienceOrder: 'subtitle-first',
  }),
]

export const getTemplate = (id: string) => TEMPLATES.find((t) => t.id === id)

/** The slice of a template's design that belongs to one part. */
export function partOf(design: Partial<DesignSettings>, part: PartId): Partial<DesignSettings> {
  return Object.fromEntries(PARTS[part].keys.map((k) => [k, design[k]]))
}

/** Which template the current design takes this part from, or null when customised. */
export function partSource(design: DesignSettings, part: PartId): string | null {
  const current = JSON.stringify(partOf(design, part))
  return TEMPLATES.find((t) => JSON.stringify(partOf(t.design, part)) === current)?.id ?? null
}
