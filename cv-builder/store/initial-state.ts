// store/initial-state.ts — Initial/Default data for the CV Store

import { CVData } from '@/models/cv.types'
import { generateId } from '@/lib/utils'
import { TEMPLATES } from '@/lib/templates'

export const DEFAULT_DATA: CVData = {
  personal: {
    fullName: 'Your Name',
    jobTitle: 'Software Engineer',
    email: 'email@example.com',
    phone: '+1 (555) 000-0000',
    location: 'New York, NY',
    website: 'https://yourwebsite.com',
    linkedin: 'https://linkedin.com/in/yourprofile',
    github: 'https://github.com/yourusername',
    photoUrl: null,
    showPhoto: false,
  },
  personalSummaries: [
    {
      id: 'personal-summary',
      title: 'Personal Summary',
      content: '<p>Passionate software engineer with 5+ years of experience building scalable web applications. Proven track record of delivering high-quality products in fast-paced environments.</p>',
      visible: true
    }
  ],
  professionalSummaries: [],
  experience: [
    {
      id: generateId(),
      jobTitle: 'Senior Software Engineer',
      company: 'Acme Corporation',
      location: 'New York, NY',
      startDate: { month: 3, year: 2021 },
      endDate: null,
      currentlyWorking: true,
      description:
        '<ul><li>Led development of core platform features used by 500k+ users</li><li>Reduced API response time by 40% through caching and query optimization</li><li>Mentored 3 junior engineers and conducted code reviews</li></ul>',
      visible: true,
    },
    {
      id: generateId(),
      jobTitle: 'Software Engineer',
      company: 'Tech Startup Inc.',
      location: 'San Francisco, CA',
      startDate: { month: 6, year: 2019 },
      endDate: { month: 2, year: 2021 },
      currentlyWorking: false,
      description:
        '<ul><li>Built and maintained React/Node.js full-stack applications</li><li>Collaborated with design team to implement responsive UIs</li></ul>',
      visible: true,
    },
  ],
  education: [
    {
      id: generateId(),
      degree: 'Bachelor of Science in Computer Science',
      institution: 'State University',
      location: 'Boston, MA',
      startDate: { month: 9, year: 2015 },
      endDate: { month: 5, year: 2019 },
      current: false,
      gpa: '3.8',
      description: '',
      visible: true,
    },
  ],
  research: [],
  training: [],
  references: [],
  skills: {
    displayStyle: 'tags',
    categories: [
      {
        id: generateId(),
        categoryName: 'Programming Languages',
        description: '',
        level: 'none',
        visible: true,
        items: [
          { id: generateId(), skill: 'TypeScript', level: 'expert', visible: true },
          { id: generateId(), skill: 'Python', level: 'advanced', visible: true },
          { id: generateId(), skill: 'Go', level: 'intermediate', visible: true },
        ],
      },
      {
        id: generateId(),
        categoryName: 'Frameworks & Tools',
        description: '',
        level: 'none',
        visible: true,
        items: [
          { id: generateId(), skill: 'React', level: 'expert', visible: true },
          { id: generateId(), skill: 'Next.js', level: 'advanced', visible: true },
          { id: generateId(), skill: 'Node.js', level: 'advanced', visible: true },
        ],
      },
    ],
  },
  languages: [
    { id: generateId(), name: 'English', description: 'Native', visible: true },
    { id: generateId(), name: 'Spanish', description: 'Intermediate', visible: true },
  ],
  projects: [],
  certifications: [],
  awards: [],
  volunteer: [],
  interests: [],
  customSections: [],
  sectionOrder: [
    { id: 'personal', visible: true, label: 'Personal Details' },
    { id: 'personal-summary', visible: true, label: 'Professional Summary' },
    { id: 'experience', visible: true, label: 'Work Experience' },
    { id: 'education', visible: true, label: 'Education' },
    { id: 'skills', visible: true, label: 'Skills' },
    { id: 'languages', visible: true, label: 'Languages' },
    { id: 'interests', visible: true, label: 'Interests' },
    { id: 'research', visible: true, label: 'Research' },
    { id: 'training', visible: true, label: 'Training' },
    { id: 'certifications', visible: true, label: 'Certification' },
    { id: 'references', visible: true, label: 'References' },
  ],
  design: {
    templateId: 'classic',
    fontId: 'lato',
    colorThemeId: 'charcoal',
    customAccentColor: undefined,
    layout: 'one-column',
    pageSize: 'a4',
    dividerStyle: 'thin',
    fontSize: 10,
    lineHeight: 1.4,
    sidebarWidth: 30,
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 15,
    marginRight: 15,
    sectionSpacing: 16,
    language: 'en',
    dateFormat: 'full',
    fontCategory: 'sans-serif',
    colorMode: 'basic',
    colorType: 'accent',
    applyAccentTo: {
      name: true,
      jobTitle: true,
      headings: true,
      headerIcons: false,
      dotsBarsBubbles: true,
      dates: false,
      entrySubtitle: false,
      linkIcons: false,
    },
    layoutVariation: 'classic',
    titleSize: 11,
    subtitleSize: 9,
    subtitleStyle: 'bold',
    subtitlePlacement: 'below-title',
    descriptionIndentation: 0,
    listStyle: 'bullet',
    entryLayoutId: 'layout-4',
    footer: {
      showPageNumbers: true,
      showEmail: false,
      showName: false,
      useCustomFooter: false,
      leftColumn: '{{name}}',
      centerColumn: '{{page}} / {{pages}}',
      rightColumn: '{{email}}',
    },
    headingStyle: 'simple',
    headingCase: 'uppercase',
    headingAlign: 'left',
    headingSize: 10,
    showHeadingIcons: false,

    // Header Styling Defaults
    headerAlignment: 'left',
    detailsArrangement: 'bullet',
    nameSize: 'm',
    nameBold: true,
    nameFontFamily: 'body',
    titleSizeScale: 'm',
    titlePosition: 'inline',
    titleStyle: 'italic',
    showPhoto: true,
    photoGrayscale: false,
    photoPosition: 'left',
    photoSizeScale: 's',
    photoShape: 'circle',

    // Skills Customization Defaults
    skillsLayout: 'grid',
    skillsGridColumns: 3,
    skillsRowSpacing: 'spacious',
    skillsShowRowBullets: true,
    skillsRowSubinfoStyle: 'bracket',
    skillsCompactSeparator: 'bullet',
    skillsCompactSubinfoStyle: 'bracket',
    skillsBubbleSubinfoStyle: 'bracket',
    skillsLevelVisualizer: 'dots',

    // Resume Settings Defaults
    resumeHideEmptySections: true,
    resumeSummaryInHeader: false,
    resumeShowSummaryHeading: true,
    resumeEducationOrder: 'title-first',
    resumeExperienceOrder: 'subtitle-first', // Matching the image's active state "Employer - Job Title" usually implies subtitle first if Job Title is title? 
    // Wait, in the image "Employer - Job Title" is on the right, purple. 
    // Usually title is Job Title. So right button is subtitle-first.
    resumeGroupPromotions: false,
  },
}

export const DATA_KEYS = Object.keys(DEFAULT_DATA) as (keyof CVData)[]

/** Keeps only CVData keys and fills fields added after a resume was stored. */
export function normalizeResume(data: Partial<CVData>): CVData {
  const out = {} as Record<string, unknown>
  for (const k of DATA_KEYS) out[k] = data[k] ?? DEFAULT_DATA[k]
  const d = out as unknown as CVData
  d.personal = { ...DEFAULT_DATA.personal, ...d.personal }
  d.design = {
    ...DEFAULT_DATA.design,
    ...d.design,
    applyAccentTo: { ...DEFAULT_DATA.design.applyAccentTo, ...d.design?.applyAccentTo },
    footer: { ...DEFAULT_DATA.design.footer, ...d.design?.footer },
  }
  return d
}

/** Starting point for a new resume: default structure and design, no sample content. */
export function blankResume(fullName: string, email: string): CVData {
  const base = structuredClone(DEFAULT_DATA)
  return {
    ...base,
    design: { ...base.design, ...TEMPLATES[0].design }, // new resumes start on the Classic ATS template
    personal: {
      fullName, email, jobTitle: '', phone: '', location: '', website: '', linkedin: '', github: '',
      photoUrl: null, showPhoto: true,
    },
    personalSummaries: [{ id: 'personal-summary', title: 'Professional Summary', content: '', visible: true }],
    experience: [],
    education: [],
    skills: { displayStyle: 'tags', categories: [] },
    languages: [],
  }
}
