// Templates are presets of DesignSettings — applying one just merges it into the
// resume's design, so everything stays editable in Customize afterwards.
// All templates and fonts are available on every plan.

import type { DesignSettings } from '@/models/cv.types'

export interface TemplatePreset {
  id: string
  name: string
  category: 'simple' | 'modern' | 'creative'
  description: string
  design: Partial<DesignSettings>
}

const base: Partial<DesignSettings> = {
  layout: 'one-column', colorMode: 'basic', customAccentColor: undefined, headerAlignment: 'left',
  headingStyle: 'simple', headingCase: 'uppercase', dividerStyle: 'thin', showHeadingIcons: false,
  entryLayoutId: 'layout-4', subtitlePlacement: 'below-title', subtitleStyle: 'bold',
  detailsArrangement: 'bullet', skillsLayout: 'grid', skillsGridColumns: 3, nameFontFamily: 'body',
  titlePosition: 'below', listStyle: 'bullet', sidebarWidth: 32, nameSize: 'm',
}

const preset = (
  id: string, name: string, category: TemplatePreset['category'], description: string, design: Partial<DesignSettings>,
): TemplatePreset => ({ id, name, category, description, design: { ...base, ...design, templateId: id } })

export const TEMPLATES: TemplatePreset[] = [
  preset('classic', 'Classic', 'simple', 'Single column, quiet rules. Passes every ATS.', {
    fontId: 'lato', colorThemeId: 'charcoal',
  }),
  preset('harvard', 'Harvard', 'simple', 'Centered serif header, the academic standard.', {
    fontId: 'eb-garamond', colorThemeId: 'black', headerAlignment: 'center', headingStyle: 'underlined',
    fontSize: 11, subtitleStyle: 'italic', entryLayoutId: 'layout-4', skillsLayout: 'rows',
  }),
  preset('minimal', 'Minimal', 'simple', 'Lots of air, no decoration.', {
    fontId: 'inter', colorThemeId: 'slate', headingStyle: 'minimal', headingCase: 'capitalize',
    dividerStyle: 'none', skillsLayout: 'compact', detailsArrangement: 'bar', subtitleStyle: 'normal',
  }),
  preset('executive', 'Executive', 'simple', 'Dates in the margin, strong hierarchy.', {
    fontId: 'merriweather', colorThemeId: 'navy', entryLayoutId: 'layout-2', headingStyle: 'double-line',
    nameSize: 'l', skillsLayout: 'compact',
  }),
  preset('modern', 'Modern', 'modern', 'Accent headings with a clean sans.', {
    fontId: 'montserrat', colorThemeId: 'cobalt-blue', headingStyle: 'modern-split', skillsLayout: 'bubble',
    detailsArrangement: 'icon', headingCase: 'capitalize',
  }),
  preset('banner', 'Banner', 'modern', 'Full-width colored header band.', {
    fontId: 'outfit', colorThemeId: 'deep-teal', colorMode: 'advanced', headingStyle: 'side-line',
    detailsArrangement: 'icon', skillsLayout: 'bubble',
  }),
  preset('sidebar', 'Sidebar', 'modern', 'Tinted left column for skills and contact extras.', {
    fontId: 'open-sans', colorThemeId: 'forest-green', layout: 'sidebar-left', headingStyle: 'underlined',
    skillsLayout: 'rows', detailsArrangement: 'stacked', entryLayoutId: 'layout-1',
  }),
  preset('column', 'Two Column', 'modern', 'Balanced two-column layout, no fills.', {
    fontId: 'roboto', colorThemeId: 'graphite', layout: 'two-column', sidebarWidth: 36, headingStyle: 'simple',
    dividerStyle: 'colored', skillsLayout: 'level', detailsArrangement: 'columns',
  }),
  preset('bold', 'Bold', 'creative', 'Solid accent sidebar that stands out in a stack.', {
    fontId: 'raleway', colorThemeId: 'indigo', layout: 'sidebar-right', colorMode: 'advanced', nameSize: 'l',
    headingStyle: 'pill', skillsLayout: 'bubble', detailsArrangement: 'stacked',
  }),
  preset('frame', 'Frame', 'creative', 'Colored page border with boxed headings.', {
    fontId: 'nunito', colorThemeId: 'burgundy', colorMode: 'border', headingStyle: 'boxed',
    headerAlignment: 'center', marginTop: 18, marginBottom: 18, marginLeft: 18, marginRight: 18,
  }),
  preset('editorial', 'Editorial', 'creative', 'Display-serif name and bracketed headings.', {
    fontId: 'lora', colorThemeId: 'terracotta', nameFontFamily: 'creative', nameSize: 'xl',
    headingStyle: 'bracket', headingCase: 'capitalize', entryLayoutId: 'layout-3', subtitleStyle: 'italic',
  }),
  preset('mono', 'Mono', 'creative', 'Monospace, for people who ship code.', {
    fontId: 'ibm-plex-mono', colorThemeId: 'hunter-green', headingStyle: 'zigzag', fontSize: 9,
    skillsLayout: 'compact', skillsCompactSeparator: 'pipe', listStyle: 'dash', detailsArrangement: 'bar',
  }),
]

export const getTemplate = (id: string) => TEMPLATES.find((t) => t.id === id)
