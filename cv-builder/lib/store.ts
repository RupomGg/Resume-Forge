// lib/store.ts — Zustand store with immer middleware for the CV Builder

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { generateId } from './utils'
import type {
  CVData,
  PersonalInfo,
  WorkExperience,
  Education,
  SkillItem,
  SkillCategory,
  SkillDisplayStyle,
  LanguageItem,
  Project,
  Certification,
  Award,
  Volunteer,
  InterestItem,
  CustomSection,
  CustomSectionItem,
  DesignSettings,
  SectionId,
} from './types'

// ─── Default / initial data ────────────────────────────────────────────────────

const DEFAULT_DATA: CVData = {
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

// ─── Store interface ───────────────────────────────────────────────────────────

interface CVStore extends CVData {
  // Personal & Summary
  updatePersonal: (partial: Partial<PersonalInfo>) => void
  updateSummary: (text: string) => void

  // Experience
  addExperience: () => void
  updateExperience: (id: string, partial: Partial<WorkExperience>) => void
  removeExperience: (id: string) => void
  reorderExperience: (from: number, to: number) => void

  // Education
  addEducation: () => void
  updateEducation: (id: string, partial: Partial<Education>) => void
  removeEducation: (id: string) => void
  reorderEducation: (from: number, to: number) => void

  // Skills
  updateSkillsDisplay: (style: SkillDisplayStyle) => void
  addSkillCategory: () => void
  updateSkillCategory: (id: string, partial: Partial<SkillCategory>) => void
  removeSkillCategory: (id: string) => void
  reorderSkillCategories: (from: number, to: number) => void
  addSkillItem: (categoryId: string) => void
  updateSkillItem: (categoryId: string, itemId: string, partial: Partial<SkillItem>) => void
  removeSkillItem: (categoryId: string, itemId: string) => void

  // Languages
  addLanguage: () => void
  updateLanguage: (id: string, partial: Partial<LanguageItem>) => void
  removeLanguage: (id: string) => void
  reorderLanguages: (from: number, to: number) => void

  // Projects
  addProject: () => void
  updateProject: (id: string, partial: Partial<Project>) => void
  removeProject: (id: string) => void
  reorderProjects: (from: number, to: number) => void

  // Certifications
  addCertification: () => void
  updateCertification: (id: string, partial: Partial<Certification>) => void
  removeCertification: (id: string) => void
  reorderCertifications: (from: number, to: number) => void

  // Awards
  addAward: () => void
  updateAward: (id: string, partial: Partial<Award>) => void
  removeAward: (id: string) => void
  reorderAwards: (from: number, to: number) => void

  // Volunteer
  addVolunteer: () => void
  updateVolunteer: (id: string, partial: Partial<Volunteer>) => void
  removeVolunteer: (id: string) => void
  reorderVolunteers: (from: number, to: number) => void

  // Interests
  addInterest: (label: string) => void
  removeInterest: (id: string) => void
  reorderInterests: (from: number, to: number) => void

  // Custom Sections
  addCustomSection: () => void
  updateCustomSection: (id: string, partial: Partial<CustomSection>) => void
  removeCustomSection: (id: string) => void
  addCustomSectionItem: (sectionId: string) => void
  updateCustomSectionItem: (sectionId: string, itemId: string, partial: Partial<CustomSectionItem>) => void
  removeCustomSectionItem: (sectionId: string, itemId: string) => void

  // Section Management
  toggleSection: (id: SectionId) => void
  reorderSections: (from: number, to: number) => void
  updateSectionLabel: (id: SectionId, label: string) => void

  // Design
  updateDesign: (partial: Partial<DesignSettings>) => void

  // Reset
  resetToDefaults: () => void
}

// ─── Helper: move item in array ────────────────────────────────────────────────

function moveItem<T>(arr: T[], from: number, to: number): void {
  const [item] = arr.splice(from, 1)
  arr.splice(to, 0, item)
}

// ─── Store implementation ──────────────────────────────────────────────────────

export const useCVStore = create<CVStore>()(
  immer((set) => ({
    ...DEFAULT_DATA,

    // ── Personal & Summary ────────────────────────────────────────────────────
    updatePersonal: (partial) =>
      set((state) => { Object.assign(state.personal, partial) }),

    updateSummary: (text) =>
      set((state) => { state.summary = text }),

    // ── Experience ────────────────────────────────────────────────────────────
    addExperience: () =>
      set((state) => {
        state.experience.unshift({
          id: generateId(),
          jobTitle: '',
          company: '',
          location: '',
          startDate: { month: 0, year: new Date().getFullYear() },
          endDate: null,
          currentlyWorking: false,
          description: '',
        })
      }),

    updateExperience: (id, partial) =>
      set((state) => {
        const item = state.experience.find((e) => e.id === id)
        if (item) Object.assign(item, partial)
      }),

    removeExperience: (id) =>
      set((state) => {
        state.experience = state.experience.filter((e) => e.id !== id)
      }),

    reorderExperience: (from, to) =>
      set((state) => { moveItem(state.experience, from, to) }),

    // ── Education ─────────────────────────────────────────────────────────────
    addEducation: () =>
      set((state) => {
        state.education.unshift({
          id: generateId(),
          degree: '',
          institution: '',
          location: '',
          startDate: { month: 0, year: new Date().getFullYear() },
          endDate: null,
          current: false,
          gpa: '',
          description: '',
        })
      }),

    updateEducation: (id, partial) =>
      set((state) => {
        const item = state.education.find((e) => e.id === id)
        if (item) Object.assign(item, partial)
      }),

    removeEducation: (id) =>
      set((state) => {
        state.education = state.education.filter((e) => e.id !== id)
      }),

    reorderEducation: (from, to) =>
      set((state) => { moveItem(state.education, from, to) }),

    // ── Skills ────────────────────────────────────────────────────────────────
    updateSkillsDisplay: (style) =>
      set((state) => { state.skills.displayStyle = style }),

    addSkillCategory: () =>
      set((state) => {
        state.skills.categories.push({
          id: generateId(),
          categoryName: 'New Category',
          items: [],
        })
      }),

    updateSkillCategory: (id, partial) =>
      set((state) => {
        const cat = state.skills.categories.find((c) => c.id === id)
        if (cat) Object.assign(cat, partial)
      }),

    removeSkillCategory: (id) =>
      set((state) => {
        state.skills.categories = state.skills.categories.filter((c) => c.id !== id)
      }),

    reorderSkillCategories: (from, to) =>
      set((state) => { moveItem(state.skills.categories, from, to) }),

    addSkillItem: (categoryId) =>
      set((state) => {
        const cat = state.skills.categories.find((c) => c.id === categoryId)
        if (cat) {
          cat.items.push({ id: generateId(), skill: '', level: 'none' })
        }
      }),

    updateSkillItem: (categoryId, itemId, partial) =>
      set((state) => {
        const cat = state.skills.categories.find((c) => c.id === categoryId)
        if (cat) {
          const item = cat.items.find((i) => i.id === itemId)
          if (item) Object.assign(item, partial)
        }
      }),

    removeSkillItem: (categoryId, itemId) =>
      set((state) => {
        const cat = state.skills.categories.find((c) => c.id === categoryId)
        if (cat) {
          cat.items = cat.items.filter((i) => i.id !== itemId)
        }
      }),

    // ── Languages ─────────────────────────────────────────────────────────────
    addLanguage: () =>
      set((state) => {
        state.languages.push({ id: generateId(), language: '', proficiency: 'intermediate' })
      }),

    updateLanguage: (id, partial) =>
      set((state) => {
        const item = state.languages.find((l) => l.id === id)
        if (item) Object.assign(item, partial)
      }),

    removeLanguage: (id) =>
      set((state) => {
        state.languages = state.languages.filter((l) => l.id !== id)
      }),

    reorderLanguages: (from, to) =>
      set((state) => { moveItem(state.languages, from, to) }),

    // ── Projects ──────────────────────────────────────────────────────────────
    addProject: () =>
      set((state) => {
        state.projects.unshift({
          id: generateId(),
          name: '',
          description: '',
          technologies: [],
          url: '',
          startDate: null,
          endDate: null,
        })
      }),

    updateProject: (id, partial) =>
      set((state) => {
        const item = state.projects.find((p) => p.id === id)
        if (item) Object.assign(item, partial)
      }),

    removeProject: (id) =>
      set((state) => {
        state.projects = state.projects.filter((p) => p.id !== id)
      }),

    reorderProjects: (from, to) =>
      set((state) => { moveItem(state.projects, from, to) }),

    // ── Certifications ────────────────────────────────────────────────────────
    addCertification: () =>
      set((state) => {
        state.certifications.unshift({
          id: generateId(),
          name: '',
          issuingOrganization: '',
          issueDate: null,
          expiryDate: null,
          credentialId: '',
          url: '',
        })
      }),

    updateCertification: (id, partial) =>
      set((state) => {
        const item = state.certifications.find((c) => c.id === id)
        if (item) Object.assign(item, partial)
      }),

    removeCertification: (id) =>
      set((state) => {
        state.certifications = state.certifications.filter((c) => c.id !== id)
      }),

    reorderCertifications: (from, to) =>
      set((state) => { moveItem(state.certifications, from, to) }),

    // ── Awards ────────────────────────────────────────────────────────────────
    addAward: () =>
      set((state) => {
        state.awards.unshift({
          id: generateId(),
          title: '',
          issuer: '',
          date: null,
          description: '',
        })
      }),

    updateAward: (id, partial) =>
      set((state) => {
        const item = state.awards.find((a) => a.id === id)
        if (item) Object.assign(item, partial)
      }),

    removeAward: (id) =>
      set((state) => {
        state.awards = state.awards.filter((a) => a.id !== id)
      }),

    reorderAwards: (from, to) =>
      set((state) => { moveItem(state.awards, from, to) }),

    // ── Volunteer ─────────────────────────────────────────────────────────────
    addVolunteer: () =>
      set((state) => {
        state.volunteer.unshift({
          id: generateId(),
          role: '',
          organization: '',
          location: '',
          startDate: { month: 0, year: new Date().getFullYear() },
          endDate: null,
          current: false,
          description: '',
        })
      }),

    updateVolunteer: (id, partial) =>
      set((state) => {
        const item = state.volunteer.find((v) => v.id === id)
        if (item) Object.assign(item, partial)
      }),

    removeVolunteer: (id) =>
      set((state) => {
        state.volunteer = state.volunteer.filter((v) => v.id !== id)
      }),

    reorderVolunteers: (from, to) =>
      set((state) => { moveItem(state.volunteer, from, to) }),

    // ── Interests ─────────────────────────────────────────────────────────────
    addInterest: (label) =>
      set((state) => {
        state.interests.push({ id: generateId(), label })
      }),

    removeInterest: (id) =>
      set((state) => {
        state.interests = state.interests.filter((i) => i.id !== id)
      }),

    reorderInterests: (from, to) =>
      set((state) => { moveItem(state.interests, from, to) }),

    // ── Custom Sections ───────────────────────────────────────────────────────
    addCustomSection: () =>
      set((state) => {
        const id = generateId()
        state.customSections.push({
          id,
          sectionTitle: 'Custom Section',
          items: [],
        })
        state.sectionOrder.push({
          id,
          visible: true,
          label: 'Custom Section',
        })
      }),

    updateCustomSection: (id, partial) =>
      set((state) => {
        const section = state.customSections.find((s) => s.id === id)
        if (section) Object.assign(section, partial)
      }),

    removeCustomSection: (id) =>
      set((state) => {
        state.customSections = state.customSections.filter((s) => s.id !== id)
        state.sectionOrder = state.sectionOrder.filter((s) => s.id !== id)
      }),

    addCustomSectionItem: (sectionId) =>
      set((state) => {
        const section = state.customSections.find((s) => s.id === sectionId)
        if (section) {
          section.items.push({
            id: generateId(),
            title: '',
            subtitle: '',
            date: '',
            description: '',
          })
        }
      }),

    updateCustomSectionItem: (sectionId, itemId, partial) =>
      set((state) => {
        const section = state.customSections.find((s) => s.id === sectionId)
        if (section) {
          const item = section.items.find((i) => i.id === itemId)
          if (item) Object.assign(item, partial)
        }
      }),

    removeCustomSectionItem: (sectionId, itemId) =>
      set((state) => {
        const section = state.customSections.find((s) => s.id === sectionId)
        if (section) {
          section.items = section.items.filter((i) => i.id !== itemId)
        }
      }),

    // ── Section Management ────────────────────────────────────────────────────
    toggleSection: (id) =>
      set((state) => {
        const section = state.sectionOrder.find((s) => s.id === id)
        if (section) section.visible = !section.visible
      }),

    reorderSections: (from, to) =>
      set((state) => { moveItem(state.sectionOrder, from, to) }),

    updateSectionLabel: (id, label) =>
      set((state) => {
        const section = state.sectionOrder.find((s) => s.id === id)
        if (section) section.label = label
      }),

    // ── Design ────────────────────────────────────────────────────────────────
    updateDesign: (partial) =>
      set((state) => { Object.assign(state.design, partial) }),

    // ── Reset ─────────────────────────────────────────────────────────────────
    resetToDefaults: () =>
      set(() => ({ ...DEFAULT_DATA })),
  }))
)
