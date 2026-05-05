// store/initial-state.ts — Initial/Default data for the CV Store

import { CVData } from '@/models/cv.types'
import { generateId } from '@/lib/utils'

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
  summary:
    '<p>Passionate software engineer with 5+ years of experience building scalable web applications. Proven track record of delivering high-quality products in fast-paced environments.</p>',
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
    },
  ],
  skills: {
    displayStyle: 'tags',
    categories: [
      {
        id: generateId(),
        categoryName: 'Programming Languages',
        items: [
          { id: generateId(), skill: 'TypeScript', level: 'expert' },
          { id: generateId(), skill: 'Python', level: 'advanced' },
          { id: generateId(), skill: 'Go', level: 'intermediate' },
        ],
      },
      {
        id: generateId(),
        categoryName: 'Frameworks & Tools',
        items: [
          { id: generateId(), skill: 'React', level: 'expert' },
          { id: generateId(), skill: 'Next.js', level: 'advanced' },
          { id: generateId(), skill: 'Node.js', level: 'advanced' },
        ],
      },
    ],
  },
  languages: [
    { id: generateId(), language: 'English', proficiency: 'native' },
  ],
  projects: [],
  certifications: [],
  awards: [],
  volunteer: [],
  interests: [
    { id: generateId(), label: 'Open Source Contribution' },
    { id: generateId(), label: 'Hiking' },
    { id: generateId(), label: 'Photography' },
  ],
  customSections: [],
  sectionOrder: [
    { id: 'personal', visible: true, label: 'Personal Info' },
    { id: 'summary', visible: true, label: 'Professional Summary' },
    { id: 'experience', visible: true, label: 'Work Experience' },
    { id: 'education', visible: true, label: 'Education' },
    { id: 'skills', visible: true, label: 'Skills' },
    { id: 'languages', visible: true, label: 'Languages' },
    { id: 'projects', visible: true, label: 'Projects' },
    { id: 'certifications', visible: true, label: 'Certifications' },
    { id: 'awards', visible: true, label: 'Awards' },
    { id: 'volunteer', visible: true, label: 'Volunteer' },
    { id: 'interests', visible: true, label: 'Interests' },
    { id: 'custom', visible: false, label: 'Custom Section' },
  ],
  design: {
    templateId: 'classic',
    fontId: 'lato',
    colorThemeId: 'charcoal',
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
  },
}
