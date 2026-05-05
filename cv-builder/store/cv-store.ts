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
  CustomSection,
  CustomSectionItem,
  DesignSettings,
  SectionId,
} from '@/models/cv.types'

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
      set((state) => { moveItemInArray(state.skills.categories, from, to) }),

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
      set((state) => { moveItemInArray(state.languages, from, to) }),

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
      set((state) => { moveItemInArray(state.projects, from, to) }),

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
    addInterest: (label) =>
      set((state) => {
        state.interests.push({ id: generateId(), label })
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
      set((state) => { moveItemInArray(state.sectionOrder, from, to) }),

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
