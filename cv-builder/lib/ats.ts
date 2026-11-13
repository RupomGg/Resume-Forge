// Checks a resume against what applicant tracking systems are known to mis-read.
// Each issue that is a design choice carries the design patch that removes it.

import type { CVData, DesignSettings } from '@/models/cv.types'

export interface AtsIssue {
  id: string
  message: string
  fix?: Partial<DesignSettings>
}

export function atsIssues(data: CVData): AtsIssue[] {
  const d = data.design
  const p = data.personal
  const issues: AtsIssue[] = []
  const add = (cond: unknown, id: string, message: string, fix?: Partial<DesignSettings>) => {
    if (cond) issues.push({ id, message, fix })
  }

  add(d.layout !== 'one-column', 'columns',
    'Two-column layouts are often read out of order. Use a single column.', { layout: 'one-column' })
  add(d.showPhoto && p.photoUrl, 'photo',
    'Photos are ignored by parsers and discouraged by most employers.', { showPhoto: false })
  add(d.colorMode === 'advanced', 'fill',
    'Text on a coloured background can be dropped when the file is converted to plain text.', { colorMode: 'basic' })
  add(d.skillsLayout === 'level' && d.skillsLevelVisualizer !== 'text', 'levels',
    'Skill levels drawn as dots or bars are invisible to parsers. Show them as text.', { skillsLevelVisualizer: 'text' })
  add(d.fontSize < 9, 'size', 'Body text under 9pt is hard to read once printed.', { fontSize: 10 })
  add(d.footer.useCustomFooter, 'footer',
    'Parsers usually skip footers, so nothing important should live there.', { footer: { ...d.footer, useCustomFooter: false } })
  add(!p.email.trim(), 'email', 'Add an email address — it is the first field a parser looks for.')
  add(!p.phone.trim(), 'phone', 'Add a phone number.')
  add(!data.experience.some((e) => e.visible) && !data.education.some((e) => e.visible), 'content',
    'Add work experience or education; parsers expect at least one of them.')
  return issues
}

/** One patch that clears every issue that has a design fix. */
export const atsFixAll = (issues: AtsIssue[]): Partial<DesignSettings> =>
  Object.assign({}, ...issues.map((i) => i.fix ?? {}))
