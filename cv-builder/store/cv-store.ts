// store/cv-store.ts — Zustand store for the CV Builder

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { generateId } from '@/lib/utils'
import { moveItemInArray } from '@/services/cv/cv.utils'
import { DEFAULT_DATA } from './initial-state'
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
  Research,
  Training,
  Reference,
  InterestItem,
  ProfessionalSummary,
  CustomSection,
  CustomSectionItem,
  DesignSettings,
  SectionId,
  TextAlignment,
  EditorTab,
} from '@/models/cv.types'

interface CVStore extends CVData {
  // Personal & Summary
  updatePersonal: (partial: Partial<PersonalInfo>) => void
  addPersonalSummary: () => void
  updatePersonalSummary: (id: string, partial: Partial<ProfessionalSummary>) => void
  removePersonalSummary: (id: string) => void

  // Professional Summaries (Multi-instance)
  addProfessionalSummary: () => void
  updateProfessionalSummary: (id: string, partial: Partial<ProfessionalSummary>) => void
  removeProfessionalSummary: (id: string) => void

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

  // Research
  addResearch: () => void
  updateResearch: (id: string, partial: Partial<Research>) => void
  removeResearch: (id: string) => void
  reorderResearch: (from: number, to: number) => void

  // Training
  addTraining: () => void
  updateTraining: (id: string, partial: Partial<Training>) => void
  removeTraining: (id: string) => void
  reorderTraining: (from: number, to: number) => void

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
  addInterest: () => void
  updateInterest: (id: string, partial: Partial<InterestItem>) => void
  removeInterest: (id: string) => void
  reorderInterests: (from: number, to: number) => void

  // References
  addReference: () => void
  updateReference: (id: string, partial: Partial<Reference>) => void
  removeReference: (id: string) => void
  reorderReferences: (from: number, to: number) => void

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
  removeSection: (id: string) => void
  updateSectionLabel: (id: SectionId, label: string) => void
  updateSectionStyle: (id: SectionId, style: { alignment?: TextAlignment; underline?: boolean }) => void
  toggleEntryVisibility: (sectionId: SectionId, entryId: string) => void

  // Focus Mode
  activeSectionId: string | null
  activeEntryId: string | null
  setActiveSectionId: (id: string | null) => void
  setActiveEntryId: (id: string | null) => void

  // Design
  updateDesign: (partial: Partial<DesignSettings>) => void

  // Tab Management
  activeTab: EditorTab
  setActiveTab: (tab: EditorTab) => void

  // Reset
  resetToDefaults: () => void
}

export const useCVStore = create<CVStore>()(
  immer((set) => ({
    ...DEFAULT_DATA,
    activeSectionId: null,
    activeEntryId: null,
    activeTab: 'content',

    setActiveTab: (tab) =>
      set((state) => {
        state.activeTab = tab
      }),

    setActiveSectionId: (id) =>
      set((state) => {
        state.activeSectionId = id
        state.activeEntryId = null // Reset entry when switching sections
      }),

    setActiveEntryId: (id) =>
      set((state) => {
        state.activeEntryId = id
      }),

    // ── Personal & Summary ────────────────────────────────────────────────────
    updatePersonal: (partial) =>
      set((state) => { Object.assign(state.personal, partial) }),

    addPersonalSummary: () =>
      set((state) => {
        const id = `pers-summary-${generateId()}`
        state.personalSummaries.push({
          id,
          title: 'Personal Summary',
          content: '',
          visible: true,
        })
        state.sectionOrder.push({
          id,
          visible: true,
          label: 'Personal Summary',
        })
      }),

    updatePersonalSummary: (id, partial) =>
      set((state) => {
        const item = state.personalSummaries.find((s) => s.id === id)
        if (item) Object.assign(item, partial)
        if (partial.title) {
          const section = state.sectionOrder.find(s => s.id === id)
          if (section) section.label = partial.title
        }
      }),

    removePersonalSummary: (id) =>
      set((state) => {
        state.personalSummaries = state.personalSummaries.filter((s) => s.id !== id)
        state.sectionOrder = state.sectionOrder.filter((s) => s.id !== id)
      }),

    addProfessionalSummary: () =>
      set((state) => {
        const id = `prof-summary-${generateId()}`
        state.professionalSummaries.push({
          id,
          title: 'Professional Summary',
          content: '',
          visible: true,
        })
        state.sectionOrder.push({
          id,
          visible: true,
          label: 'Professional Summary',
        })
      }),

    updateProfessionalSummary: (id, partial) =>
      set((state) => {
        const item = state.professionalSummaries.find((s) => s.id === id)
        if (item) Object.assign(item, partial)
        // Also sync label in sectionOrder if title changed
        if (partial.title) {
          const section = state.sectionOrder.find(s => s.id === id)
          if (section) section.label = partial.title
        }
      }),

    removeProfessionalSummary: (id) =>
      set((state) => {
        state.professionalSummaries = state.professionalSummaries.filter((s) => s.id !== id)
        state.sectionOrder = state.sectionOrder.filter((s) => s.id !== id)
      }),

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
          visible: true,
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
      set((state) => { moveItemInArray(state.experience, from, to) }),

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
          visible: true,
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
      set((state) => { moveItemInArray(state.education, from, to) }),

    // ── Research ──────────────────────────────────────────────────────────────
    addResearch: () =>
      set((state) => {
        state.research.unshift({
          id: generateId(),
          title: '',
          institution: '',
          location: '',
          startDate: { month: 0, year: new Date().getFullYear() },
          endDate: null,
          current: false,
          description: '',
          visible: true,
        })
      }),

    updateResearch: (id, partial) =>
      set((state) => {
        const item = state.research.find((r) => r.id === id)
        if (item) Object.assign(item, partial)
      }),

    removeResearch: (id) =>
      set((state) => {
        state.research = state.research.filter((r) => r.id !== id)
      }),

    reorderResearch: (from, to) =>
      set((state) => { moveItemInArray(state.research, from, to) }),

    // ── Training ──────────────────────────────────────────────────────────────
    addTraining: () =>
      set((state) => {
        state.training.unshift({
          id: generateId(),
          name: '',
          provider: '',
          startDate: { month: 0, year: new Date().getFullYear() },
          endDate: null,
          current: false,
          description: '',
          visible: true,
        })
      }),

    updateTraining: (id, partial) =>
      set((state) => {
        const item = state.training.find((t) => t.id === id)
        if (item) Object.assign(item, partial)
      }),

    removeTraining: (id) =>
      set((state) => {
        state.training = state.training.filter((t) => t.id !== id)
      }),

    reorderTraining: (from, to) =>
      set((state) => { moveItemInArray(state.training, from, to) }),

    // ── References ────────────────────────────────────────────────────────────
    addReference: () =>
      set((state) => {
        state.references.push({
          id: generateId(),
          name: '',
          position: '',
          address: '',
          email: '',
          phone: '',
          visible: true,
        })
      }),

    updateReference: (id, partial) =>
      set((state) => {
        const item = state.references.find((r) => r.id === id)
        if (item) Object.assign(item, partial)
      }),

    removeReference: (id) =>
      set((state) => {
        state.references = state.references.filter((r) => r.id !== id)
      }),

    reorderReferences: (from, to) =>
      set((state) => { moveItemInArray(state.references, from, to) }),

    // ── Skills ────────────────────────────────────────────────────────────────
    updateSkillsDisplay: (style) =>
      set((state) => { state.skills.displayStyle = style }),

    addSkillCategory: () =>
      set((state) => {
        state.skills.categories.push({
          id: generateId(),
          categoryName: 'New Category',
          description: '',
          level: 'none',
          items: [],
          visible: true,
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
      set((state) => { moveItemInArray(state.skills.categories, from, to) }),

    addSkillItem: (categoryId) =>
      set((state) => {
        const cat = state.skills.categories.find((c) => c.id === categoryId)
        if (cat) {
          cat.items.push({ id: generateId(), skill: '', level: 'none', visible: true })
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
        state.languages.push({ id: generateId(), name: '', description: '', visible: true })
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
      set((state) => { moveItemInArray(state.languages, from, to) }),

    // ── Projects ──────────────────────────────────────────────────────────────
    addProject: () =>
      set((state) => {
        state.projects.unshift({
          id: generateId(),
          name: '',
          subtitle: '',
          description: '',
          technologies: [],
          url: '',
          startDate: null,
          endDate: null,
          visible: true,
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
      set((state) => { moveItemInArray(state.projects, from, to) }),

    // ── Certifications ────────────────────────────────────────────────────────
    addCertification: () =>
      set((state) => {
        state.certifications.unshift({
          id: generateId(),
          name: '',
          provider: '',
          startDate: null,
          endDate: null,
          description: '',
          visible: true,
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
      set((state) => { moveItemInArray(state.certifications, from, to) }),

    // ── Awards ────────────────────────────────────────────────────────────────
    addAward: () =>
      set((state) => {
        state.awards.unshift({
          id: generateId(),
          title: '',
          issuer: '',
          date: null,
          description: '',
          visible: true,
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
      set((state) => { moveItemInArray(state.awards, from, to) }),

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
          visible: true,
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
      set((state) => { moveItemInArray(state.volunteer, from, to) }),

    // ── Interests ─────────────────────────────────────────────────────────────
    addInterest: () =>
      set((state) => {
        state.interests.push({ id: generateId(), name: '', description: '', visible: true })
      }),

    updateInterest: (id, partial) =>
      set((state) => {
        const item = state.interests.find((i) => i.id === id)
        if (item) Object.assign(item, partial)
      }),

    removeInterest: (id) =>
      set((state) => {
        state.interests = state.interests.filter((i) => i.id !== id)
      }),

    reorderInterests: (from, to) =>
      set((state) => { moveItemInArray(state.interests, from, to) }),

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
            visible: true,
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
        // Cannot hide 'personal' (Personal Details)
        if (id === 'personal') return

        const section = state.sectionOrder.find((s) => s.id === id)
        if (section) section.visible = !section.visible
      }),

    reorderSections: (from, to) =>
      set((state) => {
        // Personal Details (index 0) is fixed and cannot be reordered
        if (from === 0 || to === 0) return
        moveItemInArray(state.sectionOrder, from, to)
      }),

    removeSection: (id) =>
      set((state) => {
        // Prevent removing 'personal' (Personal Details)
        if (id === 'personal') return

        state.sectionOrder = state.sectionOrder.filter((s) => s.id !== id)
        // Also remove from customSections or summaries if it's one of those
        state.customSections = state.customSections.filter((s) => s.id !== id)
        state.professionalSummaries = state.professionalSummaries.filter((s) => s.id !== id)
        state.personalSummaries = state.personalSummaries.filter((s) => s.id !== id)
      }),

    updateSectionLabel: (id, label) =>
      set((state) => {
        // Cannot rename 'personal' (Personal Details)
        if (id === 'personal') return
        const section = state.sectionOrder.find((s) => s.id === id)
        if (section) {
          section.label = label
          // Sync internal titles
          const profSum = state.professionalSummaries.find(ps => ps.id === id)
          if (profSum) profSum.title = label
          const persSum = state.personalSummaries.find(ps => ps.id === id)
          if (persSum) persSum.title = label
        }
      }),

    updateSectionStyle: (id, style) =>
      set((state) => {
        const section = state.sectionOrder.find((s) => s.id === id)
        if (section) {
          if (style.alignment !== undefined) section.alignment = style.alignment
          if (style.underline !== undefined) section.underline = style.underline
        }
      }),
    
    toggleEntryVisibility: (sectionId, entryId) =>
      set((state) => {
        const list = state[sectionId as keyof CVData]
        if (Array.isArray(list)) {
          const entry = (list as any[]).find((e) => e.id === entryId)
          if (entry) entry.visible = !entry.visible
        }
      }),

    // ── Design ────────────────────────────────────────────────────────────────
    updateDesign: (partial) =>
      set((state) => { Object.assign(state.design, partial) }),

    // ── Reset ─────────────────────────────────────────────────────────────────
    resetToDefaults: () =>
      set(() => ({ ...DEFAULT_DATA })),
  }))
)
