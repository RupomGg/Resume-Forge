// models/cv.types.ts — Source of truth for all CV Builder data structures

export type SkillLevel = 'none' | 'beginner' | 'intermediate' | 'advanced' | 'expert'
export type LanguageProficiency = 'native' | 'fluent' | 'advanced' | 'intermediate' | 'beginner'
export type SkillDisplayStyle = 'tags' | 'bars' | 'dots' | 'plain'
export type DateFormat = 'full' | 'short' | 'numeric' | 'year'
export type PageSize = 'a4' | 'letter'
export type LayoutType = 'one-column' | 'sidebar-left' | 'sidebar-right'
export type DividerStyle = 'none' | 'thin' | 'thick' | 'colored'
export type SectionId =
  | 'personal' | 'summary' | 'experience' | 'education'
  | 'research' | 'training' | 'references'
  | 'skills' | 'languages' | 'projects' | 'certifications'
  | 'awards' | 'volunteer' | 'interests' | string // string = custom section

export interface MonthYear {
  month: number   // 1–12, 0 = not set
  year: number
}

export interface PersonalInfo {
  fullName: string
  jobTitle: string
  email: string
  phone: string
  location: string
  website: string
  linkedin: string
  github: string
  photoUrl: string | null
  showPhoto: boolean
}

export interface WorkExperience {
  id: string
  jobTitle: string
  company: string
  location: string
  startDate: MonthYear
  endDate: MonthYear | null
  currentlyWorking: boolean
  description: string   // HTML string from TipTap
  visible: boolean
}

export interface Education {
  id: string
  degree: string
  institution: string
  location: string
  startDate: MonthYear
  endDate: MonthYear | null
  current: boolean
  gpa: string
  description: string
  visible: boolean
}

export interface SkillItem {
  id: string
  skill: string
  level: SkillLevel
  visible: boolean
}

export interface SkillCategory {
  id: string
  categoryName: string
  description: string
  level: SkillLevel
  items: SkillItem[] // Keep for backward compatibility for now
  visible: boolean
}

export interface Skills {
  displayStyle: SkillDisplayStyle
  categories: SkillCategory[]
}

export interface LanguageItem {
  id: string
  name: string
  description: string
  visible: boolean
}

export interface Project {
  id: string
  name: string
  subtitle: string
  description: string
  technologies: string[]
  url: string
  startDate: MonthYear | null
  endDate: MonthYear | null
  visible: boolean
}

export interface Certification {
  id: string
  name: string
  provider: string
  startDate: MonthYear | null
  endDate: MonthYear | null
  description: string
  visible: boolean
}

export interface Award {
  id: string
  title: string
  issuer: string
  date: MonthYear | null
  description: string
  visible: boolean
}

export interface Volunteer {
  id: string
  role: string
  organization: string
  location: string
  startDate: MonthYear
  endDate: MonthYear | null
  current: boolean
  description: string
  visible: boolean
}

export interface Research {
  id: string
  title: string
  institution: string
  location: string
  startDate: MonthYear
  endDate: MonthYear | null
  current: boolean
  description: string
  visible: boolean
}

export interface Training {
  id: string
  name: string
  provider: string
  startDate: MonthYear
  endDate: MonthYear | null
  current: boolean
  description: string
  visible: boolean
}

export interface Reference {
  id: string
  name: string
  position: string
  address: string
  email: string
  phone: string
  visible: boolean
}

export interface InterestItem {
  id: string
  name: string
  description: string
  visible: boolean
}

export interface CustomSectionItem {
  id: string
  title: string
  subtitle: string
  date: string
  description: string
  visible: boolean
}

export interface CustomSection {
  id: string
  sectionTitle: string
  items: CustomSectionItem[]
}

export type TextAlignment = 'left' | 'center' | 'right' | 'justify'

export interface CVSection {
  id: SectionId
  visible: boolean
  label: string       // user-editable display name
  alignment?: TextAlignment
  underline?: boolean
}

export interface DesignSettings {
  templateId: string
  fontId: string
  colorThemeId: string
  layout: LayoutType
  pageSize: PageSize
  dividerStyle: DividerStyle
  fontSize: number        // base font size in pt (8–14)
  lineHeight: number      // 1.0–2.0
  sidebarWidth: number    // percentage 25–40
  marginTop: number       // mm
  marginBottom: number    // mm
  marginLeft: number      // mm
  marginRight: number     // mm
  sectionSpacing: number  // px
}

export interface ProfessionalSummary {
  id: string
  title: string
  content: string
  visible: boolean
}

export interface CVData {
  personal: PersonalInfo
  personalSummaries: ProfessionalSummary[] // Multiple allowed
  professionalSummaries: ProfessionalSummary[] // Multiple allowed
  experience: WorkExperience[]
  education: Education[]
  research: Research[]
  training: Training[]
  references: Reference[]
  skills: Skills
  languages: LanguageItem[]
  projects: Project[]
  certifications: Certification[]
  awards: Award[]
  volunteer: Volunteer[]
  interests: InterestItem[]
  customSections: CustomSection[]
  sectionOrder: CVSection[]
  design: DesignSettings
}

export interface FontDefinition {
  id: string
  name: string
  googleFamily: string
  category: 'sans-serif' | 'serif'
  isFree: boolean
}

export interface ColorTheme {
  id: string
  name: string
  accentColor: string
  headerBg: string
  headerText: string
  sectionTitleColor: string
  bodyTextColor: string
  dividerColor: string
}
