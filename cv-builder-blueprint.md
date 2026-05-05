# CV Builder — Agent Build Blueprint
> Next.js + TypeScript + Tailwind CSS + Puppeteer
> Free tier only · No AI · No pricing · Full editor + templates + PDF export
> This document is a step-by-step build plan for an AI coding agent.
> Each phase is self-contained. Complete phases in order. Do not skip ahead.

---

## How to Use This Document

- Every **Phase** is a discrete unit of work the agent can execute without needing context from future phases
- Every phase has an **Agent Prompt** — paste it directly into the agent to start that phase
- The agent prompt includes all constraints, file paths, and acceptance criteria
- Phases build on each other — always complete the previous phase before starting the next
- When a phase is done, verify the acceptance criteria before moving on

---

## Project Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 14+ |
| Language | TypeScript | 5+ |
| Styling | Tailwind CSS | 3+ |
| State | Zustand | 4+ |
| PDF | Puppeteer | 21+ |
| Rich Text | TipTap | 2+ |
| Drag & Drop | @dnd-kit/core | 6+ |
| Fonts | next/font (Google Fonts) | built-in |
| Icons | Lucide React | latest |
| Date handling | date-fns | 3+ |

---

## Folder Structure (Final Target)

```
cv-builder/
├── app/
│   ├── layout.tsx                  # Root layout, font loading
│   ├── page.tsx                    # Landing / home page
│   ├── editor/
│   │   └── page.tsx                # Main editor page
│   └── api/
│       └── export-pdf/
│           └── route.ts            # Puppeteer PDF generation endpoint
├── components/
│   ├── editor/
│   │   ├── EditorShell.tsx         # Two-panel layout wrapper
│   │   ├── LeftPanel.tsx           # Form input panel
│   │   ├── RightPanel.tsx          # Live preview panel
│   │   ├── DesignPanel.tsx         # Font/color/layout controls (bottom bar)
│   │   └── sections/
│   │       ├── PersonalInfoForm.tsx
│   │       ├── WorkExperienceForm.tsx
│   │       ├── EducationForm.tsx
│   │       ├── SkillsForm.tsx
│   │       ├── LanguagesForm.tsx
│   │       ├── ProjectsForm.tsx
│   │       ├── CertificationsForm.tsx
│   │       ├── AwardsForm.tsx
│   │       ├── VolunteerForm.tsx
│   │       ├── InterestsForm.tsx
│   │       └── CustomSectionForm.tsx
│   ├── preview/
│   │   ├── CVPreview.tsx           # Scaled preview wrapper
│   │   └── templates/
│   │       ├── TemplateClassic.tsx
│   │       ├── TemplateModern.tsx
│   │       ├── TemplateMinimal.tsx
│   │       ├── TemplateBold.tsx
│   │       └── TemplateSidebar.tsx
│   ├── ui/
│   │   ├── RichTextEditor.tsx      # TipTap wrapper
│   │   ├── SectionCard.tsx         # Collapsible section container
│   │   ├── DraggableList.tsx       # dnd-kit wrapper
│   │   ├── ColorPicker.tsx
│   │   ├── FontSelector.tsx
│   │   └── Toggle.tsx
│   └── landing/
│       ├── Hero.tsx
│       ├── TemplateGallery.tsx
│       └── FeatureList.tsx
├── lib/
│   ├── store.ts                    # Zustand global store
│   ├── types.ts                    # All TypeScript interfaces
│   ├── fonts.ts                    # Font definitions
│   ├── themes.ts                   # Color theme definitions
│   └── utils.ts                    # Helper functions
├── public/
│   └── template-thumbs/            # Template preview images
└── styles/
    └── cv-print.css                # Print-specific styles for PDF
```

---

## Data Models (Source of Truth)

> The agent must implement these exact interfaces in `lib/types.ts` before anything else.
> All components and the store derive from these types.

```typescript
// lib/types.ts

export type SkillLevel = 'none' | 'beginner' | 'intermediate' | 'advanced' | 'expert'
export type LanguageProficiency = 'native' | 'fluent' | 'advanced' | 'intermediate' | 'beginner'
export type SkillDisplayStyle = 'tags' | 'bars' | 'dots' | 'plain'
export type DateFormat = 'full' | 'short' | 'numeric' | 'year'
export type PageSize = 'a4' | 'letter'
export type LayoutType = 'one-column' | 'sidebar-left' | 'sidebar-right'
export type DividerStyle = 'none' | 'thin' | 'thick' | 'colored'
export type SectionId =
  | 'personal' | 'summary' | 'experience' | 'education'
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
}

export interface SkillItem {
  id: string
  skill: string
  level: SkillLevel
}

export interface SkillCategory {
  id: string
  categoryName: string
  items: SkillItem[]
}

export interface Skills {
  displayStyle: SkillDisplayStyle
  categories: SkillCategory[]
}

export interface LanguageItem {
  id: string
  language: string
  proficiency: LanguageProficiency
}

export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  url: string
  startDate: MonthYear | null
  endDate: MonthYear | null
}

export interface Certification {
  id: string
  name: string
  issuingOrganization: string
  issueDate: MonthYear | null
  expiryDate: MonthYear | null
  credentialId: string
  url: string
}

export interface Award {
  id: string
  title: string
  issuer: string
  date: MonthYear | null
  description: string
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
}

export interface InterestItem {
  id: string
  label: string
}

export interface CustomSectionItem {
  id: string
  title: string
  subtitle: string
  date: string
  description: string
}

export interface CustomSection {
  id: string
  sectionTitle: string
  items: CustomSectionItem[]
}

export interface CVSection {
  id: SectionId
  visible: boolean
  label: string       // user-editable display name
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

export interface CVData {
  personal: PersonalInfo
  summary: string
  experience: WorkExperience[]
  education: Education[]
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
```

---

## Phase Overview

| # | Phase | Output | Est. Complexity |
|---|---|---|---|
| 1 | Project Setup | Bootstrapped repo, deps installed, folder structure | Low |
| 2 | Data Layer | Types, store, fonts, themes | Low |
| 3 | Landing Page | Home page with hero + template gallery | Medium |
| 4 | Editor Shell | Two-panel layout, navigation, responsive shell | Medium |
| 5 | Personal Info Form | First full form section with live preview wiring | Medium |
| 6 | All Other Section Forms | Remaining 10 section forms | High |
| 7 | Section Manager | Show/hide, reorder, rename sections | Medium |
| 8 | Design Panel | Font, color, layout, spacing controls | Medium |
| 9 | Templates (5) | Five complete CV template renderers | High |
| 10 | Live Preview | Scaled iframe preview with real-time sync | Medium |
| 11 | PDF Export | Puppeteer API route + download button | High |
| 12 | Import CV | PDF/DOCX/text paste import flow | High |
| 13 | Polish & QA | Responsiveness, empty states, UX details | Medium |

---

---

# PHASE 1 — Project Setup

## What This Phase Does
Bootstraps the Next.js 14 project with all dependencies, folder structure, Tailwind config, and base layout. Nothing visual yet — just the correct foundation every subsequent phase builds on.

## Deliverables
- Working `npm run dev` with no errors
- All dependencies installed
- Folder structure created (empty files/folders in place)
- Tailwind configured with custom design tokens
- Base `layout.tsx` with font loading
- `.env.local` template

## Constraints
- Use App Router (not Pages Router)
- Do NOT use `src/` directory
- Use `@/*` import alias
- Do not install any AI or payment libraries
- Do not scaffold any UI yet — just structure

## Agent Prompt

```
You are setting up a new Next.js 14 CV builder project from scratch.

TASK: Bootstrap the project with the exact stack and structure below. Do not build any UI. Do not write any page content. Only set up the foundation.

STACK:
- Next.js 14 (App Router, no src/ dir, @/* alias)
- TypeScript 5
- Tailwind CSS 3
- Zustand 4 (state management)
- @dnd-kit/core + @dnd-kit/sortable (drag and drop)
- @tiptap/react + @tiptap/starter-kit + @tiptap/extension-placeholder (rich text)
- puppeteer (PDF generation — install as regular dependency, not dev)
- lucide-react (icons)
- date-fns (date formatting)
- uuid (generating unique IDs)
- clsx + tailwind-merge (className utilities)

STEP 1 — Run this exact command:
npx create-next-app@latest cv-builder --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --yes

STEP 2 — Install all additional dependencies:
npm install zustand @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder puppeteer lucide-react date-fns uuid clsx tailwind-merge

STEP 3 — Create ALL folders listed below (create an empty .gitkeep in each):
- app/editor/
- app/api/export-pdf/
- components/editor/sections/
- components/preview/templates/
- components/ui/
- components/landing/
- lib/
- public/template-thumbs/
- styles/

STEP 4 — Create these empty files (just the file, no content yet):
- lib/types.ts
- lib/store.ts
- lib/fonts.ts
- lib/themes.ts
- lib/utils.ts
- styles/cv-print.css
- app/editor/page.tsx
- app/api/export-pdf/route.ts
- components/editor/EditorShell.tsx
- components/editor/LeftPanel.tsx
- components/editor/RightPanel.tsx
- components/editor/DesignPanel.tsx
- components/preview/CVPreview.tsx
- components/ui/RichTextEditor.tsx
- components/ui/SectionCard.tsx
- components/ui/DraggableList.tsx
- components/ui/ColorPicker.tsx
- components/ui/FontSelector.tsx
- components/ui/Toggle.tsx

STEP 5 — Update tailwind.config.ts to add these custom tokens inside the theme.extend block:
- colors.cv-accent: 'var(--cv-accent)' 
- colors.cv-header: 'var(--cv-header)'
- fontFamily.display: ['var(--font-display)', 'sans-serif']
- fontFamily.body: ['var(--font-body)', 'sans-serif']
- spacing add: 'A4' with value '297mm', 'letter' with value '279.4mm'

STEP 6 — Create .env.local with:
NEXT_PUBLIC_APP_URL=http://localhost:3000

STEP 7 — Verify npm run dev starts without errors.

ACCEPTANCE CRITERIA:
- npm run dev runs with no TypeScript or ESLint errors
- All folders and empty files exist at the correct paths
- tailwind.config.ts has the custom tokens
- No UI has been built — app/ pages can be blank "coming soon" placeholders
```

---

---

# PHASE 2 — Data Layer

## What This Phase Does
Implements the complete TypeScript type system, the Zustand store with all state and actions, font definitions, color theme definitions, and utility functions. This is the entire data brain of the app.

## Deliverables
- `lib/types.ts` — all interfaces (from Data Models section above)
- `lib/store.ts` — Zustand store with full CVData state + all CRUD actions
- `lib/fonts.ts` — all 12 font definitions (3 free, 9 pro-tier — label all but treat all as available for now since there's no paywall)
- `lib/themes.ts` — 30 color theme objects
- `lib/utils.ts` — helper functions (cn, formatDate, generateId, formatMonthYear)

## Constraints
- The store must use Zustand with immer middleware for nested updates
- Every section must have add/update/remove/reorder actions
- Default CVData must have sample placeholder content so the preview is never empty on first load
- All 30 color themes must have all 6 color properties (accentColor, headerBg, headerText, sectionTitleColor, bodyTextColor, dividerColor)

## Agent Prompt

```
You are implementing the complete data layer for a CV builder app built with Next.js 14 + TypeScript + Zustand.

CONTEXT: The project is already set up. You are filling in lib/types.ts, lib/store.ts, lib/fonts.ts, lib/themes.ts, and lib/utils.ts. Do not touch any component files or pages.

STEP 1 — lib/types.ts
Implement ALL of the following interfaces exactly as specified. Do not add or remove any fields:

[Copy in the entire Data Models section verbatim from this blueprint]

STEP 2 — lib/fonts.ts
Create and export a FONTS array of 12 font objects. Each object has:
  id: string (slug, e.g. "lato")
  name: string (display name)
  googleFamily: string (exact Google Fonts family name)
  category: 'sans-serif' | 'serif'
  isFree: boolean (first 3 are free, remaining 9 are false — but all are usable now)

The 12 fonts in order:
  lato, roboto, open-sans (free)
  montserrat, raleway, nunito, ubuntu, source-sans-pro, merriweather, playfair-display, pt-serif, crimson-text (all isFree: false but still usable)

STEP 3 — lib/themes.ts
Create and export a COLOR_THEMES array of 30 theme objects. Each object has:
  id: string
  name: string
  accentColor: string (hex)
  headerBg: string (hex)
  headerText: string (hex)
  sectionTitleColor: string (hex)
  bodyTextColor: string (hex)
  dividerColor: string (hex)

Include themes covering: black, charcoal, slate, navy, cobalt-blue, sky-blue, teal, forest-green, olive, sage, coral, terracotta, saffron, amber, burgundy, rose, lavender, indigo, midnight, silver, warm-white, cream, blush-pink, hunter-green, deep-teal, steel-blue, muted-gold, soft-coral, mocha, graphite.

STEP 4 — lib/utils.ts
Implement these exact utility functions:
  cn(...classes): string  — merge Tailwind classes using clsx + tailwind-merge
  generateId(): string — returns a short unique ID using uuid v4
  formatMonthYear(date: MonthYear, format: DateFormat): string — formats a MonthYear object using date-fns
  getFont(fontId: string): FontDefinition — looks up font from FONTS array
  getTheme(themeId: string): ColorTheme — looks up theme from COLOR_THEMES array

STEP 5 — lib/store.ts
Create a Zustand store using immer middleware. The store holds state of type CVData.

The store must export:
  useCVStore() hook

The store state is the full CVData object with these DEFAULTS:
  personal: filled with placeholder values (e.g. name: "Your Name", email: "email@example.com")
  summary: a placeholder 2-sentence professional summary
  experience: one placeholder work experience entry
  education: one placeholder education entry
  skills: two categories with 3 skills each, displayStyle: 'tags'
  languages: one entry (English, native)
  projects: empty array
  certifications: empty array
  awards: empty array
  volunteer: empty array
  interests: 3 placeholder interest items
  customSections: empty array
  sectionOrder: all 12 sections listed in order, all visible: true, with default labels
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
    sectionSpacing: 16
  }

The store must expose these actions:
  updatePersonal(partial: Partial<PersonalInfo>): void
  updateSummary(text: string): void
  addExperience(): void  — adds a blank experience with a new generateId()
  updateExperience(id: string, partial: Partial<WorkExperience>): void
  removeExperience(id: string): void
  reorderExperience(from: number, to: number): void
  [same pattern for: Education, SkillCategory, SkillItem, Language, Project, Certification, Award, Volunteer, Interest, CustomSection]
  updateSkillsDisplay(style: SkillDisplayStyle): void
  toggleSection(id: SectionId): void
  reorderSections(from: number, to: number): void
  updateSectionLabel(id: SectionId, label: string): void
  updateDesign(partial: Partial<DesignSettings>): void
  resetToDefaults(): void

ACCEPTANCE CRITERIA:
- No TypeScript errors in any lib/ file
- Store correctly initializes with default placeholder data
- All actions compile correctly
- Importing useCVStore in any component gives typed access to all state and actions
```

---

---

# PHASE 3 — Landing Page

## What This Phase Does
Builds the public-facing home page. Clean, professional design. Shows the product value, template previews, and a CTA to open the editor. No auth — clicking "Start Building" just goes to /editor.

## Deliverables
- `app/page.tsx` — landing page
- `components/landing/Hero.tsx`
- `components/landing/TemplateGallery.tsx`
- `components/landing/FeatureList.tsx`
- Navigation bar (inline in layout or separate component)

## Design Direction
Refined, editorial. Dark navy/charcoal background on hero. Clean white content sections. Generous whitespace. Typography-led — headline is large and confident. Template thumbnails are shown as cards in a horizontal scroll or grid.

## Constraints
- No auth, no login, no signup
- "Start Building Free" button links to `/editor`
- Template gallery shows all 5 template names with placeholder thumbnail cards (actual rendered templates come in Phase 9)
- Must be fully responsive (mobile + desktop)
- Use Google Fonts loaded via next/font

## Agent Prompt

```
You are building the landing page for a free CV builder web app called [your app name].

CONTEXT: Next.js 14 App Router project, Tailwind CSS, TypeScript. The editor lives at /editor. There is no auth — clicking "Start Building" goes directly to /editor.

DESIGN DIRECTION:
- Dark hero section (bg: #0F0F0F or deep navy #0D1B2A), large bold headline, subheadline, CTA button
- Below hero: white/light background, feature highlights, template preview gallery
- Font pairing: Use next/font to load a distinctive display font for headings (e.g. DM Serif Display or Sora) and a clean sans for body (e.g. DM Sans or Plus Jakarta Sans)
- The design should feel confident, professional, and modern — not startup-generic
- Use generous whitespace, subtle borders, and understated color accents

STEP 1 — Update app/layout.tsx:
- Load two Google fonts via next/font/google
- Apply font CSS variables (--font-display, --font-body) to the html element
- Set default background and text colors
- Keep the layout clean: no header/footer here — the landing page will handle its own nav

STEP 2 — Build components/landing/Hero.tsx:
- Full-viewport height dark section
- Navigation bar: app logo/name left, "Start Building →" button right (links to /editor)
- Center: large headline (e.g. "Build a resume that gets you hired"), subheadline (1 sentence), primary CTA button "Start Building Free →" (links to /editor)
- Below CTA: small social proof line: "Free forever · No watermarks · No account needed"
- Add a subtle animated gradient or noise texture on the dark background for depth (CSS only)

STEP 3 — Build components/landing/FeatureList.tsx:
- 3-column grid of feature cards
- Features to show: "50+ Professional Templates", "Real-time Preview", "PDF Export", "Drag & Drop Sections", "Custom Colors & Fonts", "ATS-Friendly Output"
- Each card: icon (use Lucide), feature name, 1-sentence description
- Clean white cards with subtle border and hover effect

STEP 4 — Build components/landing/TemplateGallery.tsx:
- Section heading: "Choose from 5 beautiful templates"
- Horizontal scrollable row of 5 template cards
- Each card: placeholder colored rectangle (aspect ratio of A4 page, ~210:297), template name below, "Use this →" button that links to /editor?template=[templateId]
- Template names and IDs: classic, modern, minimal, bold, sidebar
- Each template card has a different accent color so they're visually distinct

STEP 5 — Assemble app/page.tsx:
Import Hero, FeatureList, TemplateGallery in order. Add a simple footer: "© 2025 [App Name] · Free CV Builder"

ACCEPTANCE CRITERIA:
- npm run dev shows the landing page with no errors
- "Start Building Free" navigates to /editor (page can be blank for now)
- All 3 sections render correctly on desktop (1280px) and mobile (375px)
- No TypeScript errors
- Google Fonts load correctly
```

---

---

# PHASE 4 — Editor Shell

## What This Phase Does
Builds the two-panel editor layout — the core UI chrome of the app. Left panel = form inputs. Right panel = live CV preview. Bottom bar = design controls. This phase is layout only — no actual form content yet, just the shell with placeholder content.

## Deliverables
- `app/editor/page.tsx`
- `components/editor/EditorShell.tsx` — overall layout
- `components/editor/LeftPanel.tsx` — left scrollable form area
- `components/editor/RightPanel.tsx` — right preview area
- `components/editor/DesignPanel.tsx` — bottom design bar (collapsed by default)
- Top navigation bar with: app name, template switcher button, Download PDF button, auto-save indicator

## Layout Spec
```
┌─────────────────────────────────────────────────────┐
│  NAV: Logo    [Switch Template]   [↓ Download PDF]  │  height: 56px, sticky
├──────────────────────┬──────────────────────────────┤
│                      │                              │
│   LEFT PANEL         │   RIGHT PANEL                │
│   w: 420px fixed     │   flex-1, bg: gray-100       │
│   bg: white          │   centered CV preview        │
│   overflow-y: scroll │   overflow-y: scroll         │
│                      │                              │
├──────────────────────┴──────────────────────────────┤
│  DESIGN PANEL (collapsible bottom drawer)           │  height: 0 collapsed, 200px open
└─────────────────────────────────────────────────────┘
```

## Constraints
- Editor layout must be `height: 100vh`, no page scroll — only panels scroll internally
- Left panel width is fixed at 420px on desktop, full-width on mobile (tabs switch between form/preview on mobile)
- Right panel background is a neutral gray — the CV preview floats as a white card in center
- The Download PDF button is always visible in the top nav
- Design panel is a bottom drawer — clicking "Design" in nav toggles it open/closed
- Read the `?template=` query param from the URL and set it as the initial templateId in the store

## Agent Prompt

```
You are building the editor shell for a CV builder. This is the layout chrome only — no form sections yet. Left panel shows placeholder text. Right panel shows a placeholder white box (the CV preview comes in a later phase).

CONTEXT: Next.js 14 App Router, TypeScript, Tailwind CSS. Zustand store is at lib/store.ts and exports useCVStore. The editor lives at app/editor/page.tsx.

STEP 1 — app/editor/page.tsx:
- Mark this as a client component ("use client")
- Read the `template` query param using useSearchParams()
- On mount, if template param exists, call store's updateDesign({ templateId: template })
- Render <EditorShell />

STEP 2 — components/editor/EditorShell.tsx:
- Full screen layout: flex-col, h-screen, overflow-hidden
- Top: sticky nav bar (56px height) — see nav spec below
- Middle: flex-row, flex-1, overflow-hidden
  - Left: <LeftPanel /> — fixed width 420px, full height, overflow-y-auto, white bg, border-r
  - Right: <RightPanel /> — flex-1, full height, overflow-y-auto, bg-gray-100
- Bottom: <DesignPanel /> — conditionally shown, 0px or 200px height, transition animated
- State: local useState for isDesignPanelOpen

STEP 3 — Nav bar (inside EditorShell):
- Left: app logo/name (text, links to /)
- Center: auto-save indicator — show "All changes saved ✓" in muted text (static for now — will be wired in Phase 13)
- Right: two buttons:
  1. "Design ✦" — toggles the design panel open/closed
  2. "↓ Download PDF" — primary button, onClick calls window.print() as a placeholder (real export comes in Phase 11)

STEP 4 — components/editor/LeftPanel.tsx:
- Render a scrollable list of section cards
- For now, just render 8 placeholder <SectionCard> components with titles: "Personal Info", "Summary", "Work Experience", "Education", "Skills", "Languages", "Projects", "More Sections"
- Import SectionCard from components/ui/SectionCard.tsx
- Add a "+ Add Section" button at the bottom of the list

STEP 5 — components/editor/RightPanel.tsx:
- Centered column layout with top/bottom padding
- Render a white box — aspect ratio of A4 page (210:297), max-width 640px, shadow-lg
- Inside the box: placeholder text "CV Preview — coming in Phase 10"
- Below the white box: small text showing current page size from store design settings

STEP 6 — components/editor/DesignPanel.tsx:
- A horizontal scrollable bar with 4 sections separated by dividers:
  1. "Template" — placeholder row of 5 colored chips labeled with template names
  2. "Font" — placeholder text showing current fontId from store
  3. "Color" — placeholder row of 6 colored circles
  4. "Spacing" — placeholder text "Spacing controls"
- This is a skeleton — real controls come in Phase 8

STEP 7 — components/ui/SectionCard.tsx:
- Props: title: string, isOpen: boolean, onToggle: () => void, children: ReactNode
- Renders a collapsible card: header with title + chevron icon, body that shows/hides with animation
- Use Tailwind transition for the collapse animation
- Subtle border, slightly rounded corners, white background

ACCEPTANCE CRITERIA:
- /editor page loads and shows the two-panel layout at full viewport height
- Left panel scrolls independently, right panel scrolls independently
- Nav bar stays fixed at top
- Clicking "Design ✦" toggles the bottom design panel open and closed with animation
- No TypeScript errors
- Mobile: left and right panels stack, with tab buttons to switch between "Edit" and "Preview"
```

---

---

# PHASE 5 — Personal Info Form

## What This Phase Does
Implements the first and most important form section — Personal Information. This is the gold standard implementation that all other form sections will follow. It includes full form fields, photo upload, and is wired to the store so changes appear live.

## Deliverables
- `components/editor/sections/PersonalInfoForm.tsx` — complete form
- `components/ui/RichTextEditor.tsx` — TipTap rich text component (used in summary and all description fields)
- `components/ui/Toggle.tsx` — reusable toggle switch

## Fields to Implement
Full Name, Job Title, Email, Phone, Location, Website, LinkedIn URL, GitHub URL, Photo upload (show/hide toggle), Professional Summary (rich text)

## Constraints
- Every field change must call `store.updatePersonal()` immediately (controlled inputs)
- Photo upload: accept image/*, store as base64 data URL in the store (no server upload needed)
- Rich text editor (TipTap) supports: bold, italic, bullet lists, ordered lists — nothing else
- The form must look polished: label above input, subtle borders, focus rings, helper text where useful
- All inputs are uncontrolled-looking but controlled by the store (value comes from store, onChange updates store)

## Agent Prompt

```
You are implementing the Personal Info form section for a CV builder.

CONTEXT: Next.js 14, TypeScript, Tailwind CSS, Zustand store (useCVStore from lib/store.ts). TipTap is installed. All TypeScript types are in lib/types.ts.

STEP 1 — components/ui/Toggle.tsx:
Build a reusable toggle switch component.
Props: checked: boolean, onChange: (val: boolean) => void, label?: string
Render: a pill-shaped toggle (like iOS switch) using pure Tailwind CSS. No external library.
Clicking it calls onChange(!checked).

STEP 2 — components/ui/RichTextEditor.tsx:
Build a TipTap rich text editor wrapper component.
Props: value: string (HTML), onChange: (html: string) => void, placeholder?: string
- Initialize TipTap with StarterKit and Placeholder extension
- Show a simple toolbar above the editor area with these buttons: Bold (B), Italic (I), Bullet List, Ordered List
- Each toolbar button uses the TipTap editor.chain().focus() API
- Active toolbar buttons should look highlighted
- Editor area: min-height 120px, border, rounded, padding, focus outline
- On every editor update, call onChange(editor.getHTML())
- When value prop changes externally, sync it to the editor using editor.commands.setContent()

STEP 3 — components/editor/sections/PersonalInfoForm.tsx:
Mark as "use client". Import useCVStore. Destructure personal and updatePersonal from the store.

Build a form with these fields in this order:
  1. Full Name — text input, full width
  2. Job Title — text input, full width  
  3. Two-column row: Email (left), Phone (right)
  4. Location — text input, full width
  5. Website — text input with "https://" prefix label
  6. Two-column row: LinkedIn URL (left), GitHub URL (right)
  7. Photo section:
     - "Show Photo" toggle (calls updatePersonal({ showPhoto: !personal.showPhoto }))
     - If showPhoto is true: show a file input that accepts images
     - On file select: read as base64 using FileReader, call updatePersonal({ photoUrl: base64string })
     - If photoUrl exists, show a small 60px circular preview of the photo
     - Show a "Remove" button that calls updatePersonal({ photoUrl: null })
  8. Professional Summary label + RichTextEditor component
     - value comes from store.summary
     - onChange calls store.updateSummary(html)

Every text input:
  - value={personal.fieldName}
  - onChange={e => updatePersonal({ fieldName: e.target.value })}
  - className: consistent Tailwind styling (border, rounded-md, px-3, py-2, text-sm, focus ring, full width)

Wrap the whole form in a <div> with padding. Do not wrap in a <form> tag (no submit needed).

STEP 4 — Wire it into LeftPanel.tsx:
Replace the "Personal Info" placeholder SectionCard content with <PersonalInfoForm />.

ACCEPTANCE CRITERIA:
- Every field change immediately updates the store
- Photo upload shows preview and can be removed
- Rich text editor renders with working bold/italic/list toolbar
- Toggle component works for showPhoto
- No TypeScript errors
- Form looks clean and professional with consistent spacing
```

---

---

# PHASE 6 — All Other Section Forms

## What This Phase Does
Implements all remaining 10 form sections. Each section follows the exact same pattern established in Phase 5. This is the largest phase — implement each section one at a time.

## Sections to Implement (in order)
1. WorkExperienceForm
2. EducationForm
3. SkillsForm (with category management + display style selector)
4. LanguagesForm
5. ProjectsForm
6. CertificationsForm
7. AwardsForm
8. VolunteerForm
9. InterestsForm
10. CustomSectionForm

## Shared Sub-Component: DateRangePicker
Every section that has dates needs a reusable `components/ui/DateRangePicker.tsx` component:
- Props: startDate, endDate, currentlyWorking, onStartChange, onEndChange, onCurrentChange
- Two month/year selectors (dropdown for month 1–12, text input for year)
- "Currently working here" checkbox that disables the end date fields

## Constraints
- Each section displays a list of items + "Add [item]" button at the bottom
- Each item in the list is a collapsible card with a drag handle (⠿) and delete button (trash icon)
- The delete button shows a confirmation (just `window.confirm()` is fine for MVP)
- All form changes call the corresponding store action immediately
- Rich text fields (description) use the RichTextEditor from Phase 5

## Agent Prompt

```
You are implementing all remaining content section forms for a CV builder. The pattern is established — follow it exactly for each section.

CONTEXT: Next.js 14, TypeScript, Tailwind CSS, Zustand store, all types in lib/types.ts, all store actions already exist. RichTextEditor and Toggle components exist from Phase 5. Build one section at a time.

SHARED PATTERN FOR EVERY SECTION:
Every form section that has a list of items must:
1. Show the existing items from the store as a vertical list
2. Each item renders in a collapsible card with:
   - Header: drag handle icon (⠿) + item title (e.g. company name) + delete button
   - Body (when expanded): all the fields for that item
   - Clicking delete calls window.confirm("Delete this item?") then calls the store remove action
3. "Add [Item]" button at the bottom calls the store add action
4. All field changes immediately call the store update action with the item's id

STEP 1 — components/ui/DateRangePicker.tsx:
Props:
  startDate: MonthYear
  endDate: MonthYear | null
  currentLabel?: string (default: "I currently work here")
  isCurrent: boolean
  onStartChange: (d: MonthYear) => void
  onEndChange: (d: MonthYear | null) => void
  onCurrentChange: (v: boolean) => void

Render:
  - Row with "From" label, month dropdown (Jan-Dec), year input (4-digit number)
  - Row with "To" label, month dropdown, year input — disabled if isCurrent is true
  - Checkbox: "I currently work here" — when checked, clears endDate and disables To fields
  - Format dates as MonthYear objects ({month: number, year: number})

STEP 2 — WorkExperienceForm.tsx:
Fields per item: Job Title, Company, Location, DateRangePicker (currentlyWorking), Description (RichTextEditor)
Store actions: addExperience, updateExperience(id, partial), removeExperience(id)
Item header title: shows job title + " at " + company name

STEP 3 — EducationForm.tsx:
Fields per item: Degree, Institution, Location, DateRangePicker (current), GPA (optional), Description (RichTextEditor)
Store actions: addEducation, updateEducation, removeEducation
Item header title: shows degree + " — " + institution

STEP 4 — SkillsForm.tsx:
This section has two levels: categories and items within categories.

Top of form: "Display Style" selector — 4 buttons (Tags, Bars, Dots, Plain) that call updateSkillsDisplay(style)

Categories:
- Each category is a collapsible card showing the category name and its skill items
- Category header: editable category name input, delete category button
- Inside category: list of skill rows — each row has skill name input + level dropdown (None, Beginner, Intermediate, Advanced, Expert) + delete button
- "+ Add Skill" button inside each category
- "+ Add Category" button at the bottom of all categories

Store actions: addSkillCategory, updateSkillCategory, removeSkillCategory, addSkillItem(categoryId), updateSkillItem(categoryId, itemId, partial), removeSkillItem(categoryId, itemId)

STEP 5 — LanguagesForm.tsx:
Fields per item: Language name input, Proficiency dropdown (Native, Fluent, Advanced, Intermediate, Beginner)
Store actions: addLanguage, updateLanguage, removeLanguage
Item header title: shows language name

STEP 6 — ProjectsForm.tsx:
Fields per item: Project Name, Description (RichTextEditor), Technologies (tag input — type and press Enter to add tags, click x to remove), URL, Date range (no "current" checkbox)
Store actions: addProject, updateProject, removeProject
Item header title: shows project name

STEP 7 — CertificationsForm.tsx:
Fields per item: Name, Issuing Organization, Issue Date (month/year), Expiry Date (month/year, optional), Credential ID, URL
Store actions: addCertification, updateCertification, removeCertification
Item header title: shows name + " — " + organization

STEP 8 — AwardsForm.tsx:
Fields per item: Title, Issuer, Date (month/year), Description (RichTextEditor)
Store actions: addAward, updateAward, removeAward

STEP 9 — VolunteerForm.tsx:
Fields per item: Role, Organization, Location, DateRangePicker (current), Description (RichTextEditor)
Store actions: addVolunteer, updateVolunteer, removeVolunteer

STEP 10 — InterestsForm.tsx:
A simple tag-input style form — no cards.
Shows existing interests as pill chips with an × to remove.
A text input at the bottom: type interest name and press Enter to add it.
Store actions: addInterest (takes label string), removeInterest(id)

STEP 11 — CustomSectionForm.tsx:
Top of form: Section title input (this updates the sectionOrder label for this section via updateSectionLabel)
Items per custom section: Title, Subtitle, Date (text input, free-form), Description (RichTextEditor)
Store actions: addCustomSectionItem, updateCustomSectionItem, removeCustomSectionItem

STEP 12 — Wire everything into LeftPanel.tsx:
Import all form components. Replace each placeholder SectionCard with the real form:
  - "Personal Info" → PersonalInfoForm (already done in Phase 5)
  - "Work Experience" → WorkExperienceForm
  - "Education" → EducationForm
  - "Skills" → SkillsForm
  - "Languages" → LanguagesForm
  - "Projects" → ProjectsForm
  - "More Sections" expander → Certifications, Awards, Volunteer, Interests, Custom Section

ACCEPTANCE CRITERIA:
- Every section renders its form fields from the store
- Adding an item creates a new card with blank fields
- Editing any field updates the store immediately
- Deleting an item removes it from the store after confirm
- No TypeScript errors in any section form component
- DateRangePicker works correctly for all sections that use it
```

---

---

# PHASE 7 — Section Manager

## What This Phase Does
Implements the section visibility toggles, drag-to-reorder, and section label editing. Users can show/hide sections, drag them into a custom order, and rename section titles.

## Deliverables
- `components/ui/DraggableList.tsx` — reusable dnd-kit sortable list wrapper
- Section manager UI inside LeftPanel — a dedicated "Manage Sections" panel
- Visual feedback for dragging

## Constraints
- Use @dnd-kit/sortable for the sortable list
- The section order in the store (`sectionOrder`) is the source of truth
- Hidden sections should still show in the manager (with a dimmed/disabled look) but not render in the CV preview
- Renaming a section title only changes the display label, not the section ID
- Dragging must have a visible drag handle (⠿ icon) and smooth animation

## Agent Prompt

```
You are implementing section management (visibility, ordering, renaming) for a CV builder.

CONTEXT: @dnd-kit/core and @dnd-kit/sortable are installed. The Zustand store has: sectionOrder: CVSection[], toggleSection(id), reorderSections(from, to), updateSectionLabel(id, label). Types are in lib/types.ts.

STEP 1 — components/ui/DraggableList.tsx:
Build a generic drag-and-drop sortable list using @dnd-kit/sortable.
Props:
  items: Array<{ id: string }> — any array of objects with an id
  onReorder: (from: number, to: number) => void
  renderItem: (item: any, index: number, dragHandleProps: any) => ReactNode

Internals:
- Use DndContext with PointerSensor, KeyboardSensor, closestCenter strategy
- Use SortableContext with verticalListSortingStrategy
- Each item is wrapped in a useSortable hook
- The drag handle (⠿ icon) gets the dragHandleProps (attributes + listeners)
- On DragEnd: calculate from/to indexes from active/over IDs, call onReorder
- Show a subtle opacity-50 style on the dragging item (DragOverlay is optional)

STEP 2 — Section Manager UI:
Add a "Manage Sections" button/link at the top of LeftPanel (below the nav tabs, above the section list).
Clicking it toggles a full-height overlay panel on top of the left panel showing the section manager.

The section manager shows:
- Heading: "Manage Sections"
- Back button (closes the manager, returns to normal left panel)
- A DraggableList of all sections from store.sectionOrder
  Each section row shows:
  - Drag handle (⠿) on the left
  - Section display name (editable inline — click to edit, blur to save via updateSectionLabel)
  - Eye icon toggle on the right: eye-open if visible, eye-off if hidden (calls toggleSection(id))
  - Hidden sections: full row is opacity-50
- Below the list: a note "Drag to reorder · Click eye to show/hide"

STEP 3 — Wire reordering to the store:
When DraggableList calls onReorder(from, to), call store.reorderSections(from, to).
The LeftPanel must then render section form cards in the same order as store.sectionOrder (filtered to visible only).

STEP 4 — Filter CV Preview:
The RightPanel (and later the templates) must only render sections where visible === true, in the order defined by sectionOrder.

ACCEPTANCE CRITERIA:
- Dragging sections in the manager reorders them in the left panel immediately
- Toggling visibility hides/shows the section card in the left panel
- Renaming a section: clicking the label makes it an editable input, blur saves it
- The store's sectionOrder updates correctly on every reorder
- No TypeScript errors
- Drag interaction feels smooth with correct visual feedback
```

---

---

# PHASE 8 — Design Panel

## What This Phase Does
Implements the full design customization controls in the bottom drawer: template switcher, font selector, color theme picker, layout selector, page size toggle, spacing sliders, and divider style selector.

## Deliverables
- `components/editor/DesignPanel.tsx` — fully functional
- `components/ui/FontSelector.tsx`
- `components/ui/ColorPicker.tsx`

## Constraints
- Every control change calls `store.updateDesign({ ... })` immediately
- The right panel preview must respond to all design changes in real time
- Font selector must show the font name rendered in the actual font (use Google Fonts loaded via a style tag or CSS @import)
- Color picker is a grid of colored circles — clicking one sets the theme. No free-form hex input for MVP.
- Spacing controls are sliders with a numeric label showing current value

## Agent Prompt

```
You are implementing the design controls panel for a CV builder.

CONTEXT: The store exposes design: DesignSettings and updateDesign(partial). All 12 fonts are in lib/fonts.ts. All 30 color themes are in lib/themes.ts. The DesignPanel is a bottom drawer that's already wired to open/close in EditorShell.

STEP 1 — components/ui/ColorPicker.tsx:
Props: value: string (themeId), onChange: (themeId: string) => void
Render: import COLOR_THEMES from lib/themes.ts
Show all themes as a scrollable horizontal row of circle swatches (32px diameter).
Each circle's background = theme.accentColor.
Selected circle has a 2px ring offset border in the same color.
Hovering shows a tooltip with the theme name.
Clicking calls onChange(theme.id).

STEP 2 — components/ui/FontSelector.tsx:
Props: value: string (fontId), onChange: (fontId: string) => void
Render: import FONTS from lib/fonts.ts
Show as a dropdown-style select or a scrollable row of font chips.
Each option renders the font name in its own font face (inject a Google Fonts link for each font into the document head on mount using useEffect).
Selecting calls onChange(font.id).
Recommended: render as a custom dropdown with each option showing the font name in that font.

STEP 3 — components/editor/DesignPanel.tsx:
Build the full design panel as a horizontal scrollable bar divided into 5 sections:

SECTION A — "Template":
Row of 5 small template thumbnails (colored rectangles, aspect A4, ~80px wide).
Each shows template name below. Clicking calls updateDesign({ templateId }).
Selected template has a highlighted border.
Templates: classic, modern, minimal, bold, sidebar.

SECTION B — "Font":
Label "Font". Render <FontSelector> wired to design.fontId and updateDesign.
Below it: two sliders:
  - "Size" — range 8–14, step 0.5, value: design.fontSize, label shows value+"pt"
  - "Spacing" — range 1.0–2.0, step 0.1, value: design.lineHeight, label shows value

SECTION C — "Color":
Label "Color". Render <ColorPicker> wired to design.colorThemeId and updateDesign.
Show the current theme name below the picker.

SECTION D — "Layout":
Label "Layout". Three icon buttons for layout types:
  - One-column (single bar icon)
  - Sidebar Left (two bars, thick left)
  - Sidebar Right (two bars, thick right)
Clicking sets design.layout. Selected button is highlighted.
Below: page size toggle — two buttons "A4" and "Letter", calling updateDesign({ pageSize }).

SECTION E — "Spacing":
Label "Spacing". Four sliders:
  - "Margins" — range 5–30, value: design.marginTop (apply to all 4 margins equally for simplicity)
  - "Sections" — range 4–32, value: design.sectionSpacing
  - "Sidebar" — range 25–40, value: design.sidebarWidth, only active when layout !== one-column
Divider style: 4 buttons (None / Thin / Thick / Colored) calling updateDesign({ dividerStyle }).

STEP 4 — Apply font to preview:
In RightPanel.tsx, use a useEffect that watches design.fontId. When it changes:
- Find the font in FONTS array
- Inject or update a <link> tag in document.head loading that Google Font
- Set a CSS variable --cv-body-font on the preview container

STEP 5 — Apply color theme to preview:
In RightPanel.tsx, use a useEffect that watches design.colorThemeId. When it changes:
- Find the theme in COLOR_THEMES array
- Set CSS variables on the preview container: --cv-accent, --cv-header-bg, --cv-header-text, --cv-section-title, --cv-body-text, --cv-divider

ACCEPTANCE CRITERIA:
- Changing font updates the preview font in real time
- Changing color theme updates preview colors in real time
- All sliders show the current value and update the store on change
- Changing layout type updates the design.layout in the store
- No TypeScript errors
- Panel scrolls horizontally if content overflows
```

---

---

# PHASE 9 — Templates (5 Complete Renderers)

## What This Phase Does
Implements 5 complete CV template renderer components. These are pure display components — they receive the full CVData and DesignSettings and render a perfectly styled CV. This is the most visual phase.

## Templates to Build

| ID | Name | Layout | Character |
|---|---|---|---|
| `classic` | Classic | One-column | Times-style serif header, ruled section dividers, traditional |
| `modern` | Modern | One-column | Clean sans, bold colored section titles, generous whitespace |
| `minimal` | Minimal | One-column | Ultra-minimal, no color, thin rules, let content breathe |
| `bold` | Bold | One-column | Large name banner, strong typography hierarchy, accent color blocks |
| `sidebar` | Sidebar | Sidebar-left | Two-column, contact/skills in sidebar, experience in main |

## Constraints
- All templates are pure React components — no data fetching, no hooks (except for CSS variable reading)
- Templates use CSS variables for all colors (--cv-accent, --cv-header-bg, etc.) — not hardcoded values
- Templates use the font from design.fontId via CSS variable --cv-body-font
- The rendered output must look identical when served to Puppeteer for PDF (no browser-specific hacks)
- All text must be real selectable text (no SVG text or canvas)
- Page dimensions: exactly 210mm × 297mm (A4) or 215.9mm × 279.4mm (Letter) — use mm units in the template root div
- Respect design.marginTop/Bottom/Left/Right in mm
- Respect design.fontSize as the base font size (body text)
- Respect design.sectionSpacing between sections
- Handle the case where a section is hidden (check sectionOrder visibility)
- Handle empty sections gracefully (don't render the section at all if the items array is empty)

## Agent Prompt

```
You are building 5 complete CV template renderer components for a CV builder app.

CONTEXT: Templates are pure display React components. They receive props: data: CVData (full store state). They read design settings from data.design. CSS variables for colors and font are already injected by the RightPanel (from Phase 8). Types are in lib/types.ts.

SHARED REQUIREMENTS FOR ALL TEMPLATES:

1. Root element: <div style={{ width: '210mm', minHeight: '297mm', backgroundColor: '#fff', fontFamily: 'var(--cv-body-font, sans-serif)', fontSize: data.design.fontSize + 'pt', lineHeight: data.design.lineHeight, padding: `${data.design.marginTop}mm ${data.design.marginRight}mm ${data.design.marginBottom}mm ${data.design.marginLeft}mm` }}>

2. Section visibility check: Before rendering any section, check:
   const isVisible = (id: SectionId) => data.sectionOrder.find(s => s.id === id)?.visible ?? true
   If !isVisible(id), return null for that section.

3. Section label lookup:
   const getLabel = (id: SectionId) => data.sectionOrder.find(s => s.id === id)?.label ?? id

4. Divider rendering based on design.dividerStyle:
   - 'none': no element
   - 'thin': <hr style={{ border: 'none', borderTop: '0.5px solid var(--cv-divider)' }} />
   - 'thick': <hr style={{ border: 'none', borderTop: '2px solid var(--cv-divider)' }} />
   - 'colored': <hr style={{ border: 'none', borderTop: '2px solid var(--cv-accent)' }} />

5. Date formatting: use formatMonthYear from lib/utils.ts. Use data.design settings if a dateFormat property is added later — for now use 'short' format (Jan 2023).

6. Rich text rendering: description fields are HTML strings from TipTap. Render with <div dangerouslySetInnerHTML={{ __html: item.description }} /> with appropriate CSS to style ul/li/strong/em.

---

BUILD EACH TEMPLATE:

TEMPLATE 1 — components/preview/templates/TemplateClassic.tsx:
- Header: centered, name in a large serif-style (font-size: 2em, font-weight: 700), job title below in muted text, then contact info in one horizontal line separated by · symbols
- If showPhoto, render circular photo 72px on the right side of the header
- Section titles: uppercase, letter-spacing: 0.1em, font-size: 0.75em, color: var(--cv-section-title), followed by a full-width divider
- Experience/Education items: job title bold, company in italic, dates right-aligned on the same line, description below
- Skills: render based on displayStyle — tags as inline pills, plain as comma list, bars as labeled progress bars, dots as ●●●○○ pattern
- Spacing between sections: data.design.sectionSpacing in pixels

TEMPLATE 2 — components/preview/templates/TemplateModern.tsx:
- Header: left-aligned, name very large (2.5em) in a bold sans, job title below in accent color, contact info as a row of icon+text pairs (use text icons like ✉ ☎ 📍)
- Section titles: bold, medium size, color: var(--cv-section-title), NO uppercase, with a left border accent (4px solid var(--cv-accent)) 
- Experience items: job title + dates on same line (flex space-between), company name below in accent color, description below
- Modern clean feel with generous section spacing

TEMPLATE 3 — components/preview/templates/TemplateMinimal.tsx:
- Header: name left-aligned in a clean medium-weight font, nothing bold or dramatic, contact info as a muted row below
- No colors whatsoever — all text is #000 or #555, all dividers are #e0e0e0
- Section titles: all-caps, tiny (0.65em), letter-spacing: 0.2em, color #999
- Extreme whitespace — section spacing is 1.5× whatever design.sectionSpacing is set to
- Skills: plain text only, comma-separated

TEMPLATE 4 — components/preview/templates/TemplateBold.tsx:
- Header: full-width banner block with bg: var(--cv-header-bg), color: var(--cv-header-text), name very large (3em) bold, job title below, contact info at bottom of banner in a smaller row
- Section titles: large (1em), font-weight 700, color var(--cv-accent), no dividers — spacing handles separation
- Experience items: structured and dense, company name in accent color, everything else neutral
- Strong typography hierarchy — clear visual weight between each level

TEMPLATE 5 — components/preview/templates/TemplateSidebar.tsx:
- Two-column layout using CSS Grid: sidebar width = data.design.sidebarWidth + "%", main = rest
- Sidebar (left): bg: var(--cv-header-bg), color: var(--cv-header-text), full height. Contains: photo (if enabled), name, job title, contact info, skills, languages
- Main (right): white bg. Contains: summary, experience, education, projects, certifications, awards, volunteer
- Sidebar section titles: small, uppercase, accent color (or white if header-bg is dark)
- Handle sectionOrder — if a section is assigned to the sidebar, show it there; otherwise show in main. For MVP: always put skills/languages in sidebar, rest in main.

STEP — Export all templates:
Create components/preview/templates/index.ts that exports a TEMPLATES map:
  export const TEMPLATES: Record<string, React.ComponentType<{ data: CVData }>> = {
    classic: TemplateClassic,
    modern: TemplateModern,
    minimal: TemplateMinimal,
    bold: TemplateBold,
    sidebar: TemplateSidebar,
  }

ACCEPTANCE CRITERIA:
- All 5 templates render without TypeScript errors
- Each template visually looks distinct and reflects its design character
- Changing color theme via CSS variables updates all templates correctly
- Section visibility respected — hidden sections don't render
- Empty arrays handled — empty experience/education/etc. don't leave blank gaps
- Rich text HTML renders correctly (bullet points, bold, italic)
- Skills display styles all work in all templates
```

---

---

# PHASE 10 — Live Preview

## What This Phase Does
Wires the right panel to render the actual selected template using live store data. The preview is a scaled-down version of the full A4 CV inside a scrollable panel. Changes in the form update the preview within milliseconds.

## Deliverables
- `components/preview/CVPreview.tsx` — scaled preview wrapper
- RightPanel.tsx updated to render CVPreview
- CSS variables properly injected based on current design settings

## Constraints
- The A4 page (210mm = ~794px at 96dpi) must be scaled to fit the right panel width
- Use CSS `transform: scale()` to shrink the full-size template to fit the panel
- The template itself is always rendered at full A4 size — only the wrapper scales it
- Scaling must be dynamic (window resize recalculates the scale factor)
- The preview must update within 100–200ms of any store change (Zustand handles this automatically since all template components read from the store)

## Agent Prompt

```
You are implementing the live CV preview panel for a CV builder.

CONTEXT: 5 template components exist at components/preview/templates/. They receive { data: CVData } as props. TEMPLATES map is exported from components/preview/templates/index.ts. The store (useCVStore) holds all CVData including design settings. Color themes are in lib/themes.ts. Fonts are in lib/fonts.ts.

STEP 1 — components/preview/CVPreview.tsx:
Mark as "use client".
Import useCVStore. Get data from the store (the entire CVData object: const data = useCVStore(state => state)).
Import TEMPLATES from the templates index.

Scaling logic:
- A4 width in pixels at screen resolution = 794px
- The preview container has a measured pixel width (use a ref + ResizeObserver or useEffect with window.resize)
- scale factor = containerWidth / 794
- Apply to the template wrapper: style={{ transform: `scale(${scale})`, transformOrigin: 'top center', width: '794px', height: 'auto' }}
- The outer container: overflow: hidden, width: 100%, height: scaled height (794px * scale * pageHeightRatio)

Color variable injection:
- useEffect watching data.design.colorThemeId
- Find theme in COLOR_THEMES
- Set CSS variables on the preview container div:
  style={{ '--cv-accent': theme.accentColor, '--cv-header-bg': theme.headerBg, ... } as React.CSSProperties}

Font variable injection:
- useEffect watching data.design.fontId
- Find font in FONTS
- Inject a Google Fonts <link> into document.head if not already present
- Set --cv-body-font CSS variable on the container

Template selection:
- const TemplateComponent = TEMPLATES[data.design.templateId] ?? TEMPLATES['classic']
- Render: <TemplateComponent data={data} />

STEP 2 — Update components/editor/RightPanel.tsx:
Replace the placeholder white box with <CVPreview />.
Keep the container background as bg-gray-100.
Add padding around the CVPreview so the white CV floats with breathing room.
Below the preview: show "Page 1 of ~N" estimate (rough: just show "A4" or "Letter" for now).

STEP 3 — Zoom controls (bonus but recommended):
Add two small buttons above the preview area in RightPanel: "–" and "+" and a percentage label.
These control a zoom multiplier (default 1.0, range 0.5–1.5, step 0.1).
Multiply the computed scale by this zoom multiplier.

ACCEPTANCE CRITERIA:
- Right panel shows the actual selected template rendered with real store data
- Changing any form field updates the preview without any user action (automatic via Zustand subscription)
- Changing template in DesignPanel switches the rendered template in real time
- Changing color theme updates all CSS variable colors in the preview
- Changing font updates the font in the preview
- Preview is correctly scaled to fit the right panel width
- No TypeScript errors
```

---

---

# PHASE 11 — PDF Export

## What This Phase Does
Implements server-side PDF generation using Puppeteer. When the user clicks "Download PDF", the CV data is sent to an API route, Puppeteer renders the full template at A4 size, and returns a PDF binary for download.

## Deliverables
- `app/api/export-pdf/route.ts` — POST endpoint that accepts CVData and returns a PDF
- A dedicated render page for Puppeteer: `app/cv-render/page.tsx` — renders the template fullscreen with no editor chrome
- Download button wired in the editor nav

## Constraints
- The Puppeteer page must load the same template components used in the preview — not a separate HTML string
- Puppeteer renders the app's own `/cv-render?data=[encoded]` page (or POST with data in session/cookie)
- PDF must be exactly A4 (210mm × 297mm) or Letter depending on design.pageSize
- Fonts must be embedded — Puppeteer handles this automatically when the page loads Google Fonts
- The API route should be a Next.js Route Handler (not Pages API)
- The download triggers a file download in the browser with filename: `[FirstName]-[LastName]-CV.pdf`

## Agent Prompt

```
You are implementing server-side PDF export using Puppeteer for a Next.js CV builder.

CONTEXT: Next.js 14 App Router, TypeScript. Puppeteer is installed. The CVData type is in lib/types.ts. Templates are React components. The goal: user clicks Download → POST to /api/export-pdf with CVData → Puppeteer renders the CV → returns PDF binary → browser downloads it.

STRATEGY:
Because Puppeteer renders a real browser page, we need a special render-only page in the Next.js app that shows just the CV (no editor chrome). We'll encode the CVData in a way Puppeteer can pass it to this page.

STEP 1 — app/cv-render/page.tsx:
This is a special page only accessed by Puppeteer (not linked anywhere in the UI).
- It reads CVData from a global window variable OR from a query parameter (use a compact approach: store the data in a server-side temporary key passed as a ?key= param)
- For simplicity in MVP: accept a `?data=` query param with base64-encoded JSON of CVData
- Render ONLY the template component — no nav, no panels, no editor chrome
- The page root must have: width: 210mm (or letter), margin: 0, padding: 0, background: white
- Load Google Fonts via a <link> tag based on the data.design.fontId
- Apply CSS variables for color theme based on data.design.colorThemeId

STEP 2 — app/api/export-pdf/route.ts:
Create a POST handler.
Request body: { data: CVData }

Handler logic:
1. Parse the CVData from the request body
2. Encode it as base64 JSON: const encoded = Buffer.from(JSON.stringify(cvData)).toString('base64')
3. Build the render URL: process.env.NEXT_PUBLIC_APP_URL + '/cv-render?data=' + encoded
4. Launch Puppeteer:
   const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
5. Open a new page
6. Set viewport to A4: await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 })
7. Navigate to the render URL: await page.goto(renderUrl, { waitUntil: 'networkidle0' })
8. Wait for fonts to load: await page.evaluateHandle('document.fonts.ready')
9. Generate PDF:
   const pdf = await page.pdf({
     format: cvData.design.pageSize === 'a4' ? 'A4' : 'Letter',
     printBackground: true,
     margin: { top: 0, right: 0, bottom: 0, left: 0 }
   })
10. Close browser
11. Return the PDF with headers:
   Content-Type: application/pdf
   Content-Disposition: attachment; filename="[FirstName]-[LastName]-CV.pdf"

STEP 3 — Wire the Download button in EditorShell nav:
Replace the placeholder window.print() with a real handler:
async function handleDownload() {
  setIsDownloading(true) // show loading state on button
  const data = useCVStore.getState() // get full store state
  const response = await fetch('/api/export-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data })
  })
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${data.personal.fullName.replace(' ', '-')}-CV.pdf`
  a.click()
  URL.revokeObjectURL(url)
  setIsDownloading(false)
}

Show loading state on the button while isDownloading is true ("Generating PDF...").

STEP 4 — styles/cv-print.css:
Add a global CSS file used only by the /cv-render page:
- * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
- body { margin: 0; padding: 0; }
- @page { margin: 0; size: A4; }
Import this file in the cv-render page layout.

ACCEPTANCE CRITERIA:
- Clicking Download PDF shows "Generating PDF..." on the button
- After 2–5 seconds, the browser downloads a .pdf file
- The PDF renders the CV at full A4 size with correct fonts and colors
- PDF text is selectable (not rasterized image)
- PDF filename = "FirstName-LastName-CV.pdf"
- No TypeScript errors in route.ts
- API route handles errors gracefully (500 response with error message)
```

---

---

# PHASE 12 — Import CV

## What This Phase Does
Lets users import an existing CV to prefill the editor. Supports: PDF upload, DOCX upload, plain text paste. For MVP, use simple text extraction — no AI parsing.

## Deliverables
- Import modal/drawer component
- PDF text extraction (using pdfjs-dist or sending to API)
- DOCX text extraction (using mammoth.js)
- Plain text paste parser
- Basic field mapping from extracted text to CVData

## Constraints
- Import is best-effort — it pre-fills what it can, user fixes the rest
- Never overwrite existing data without user confirmation
- Show a confirmation step: "We found this content. Import it?" before applying
- This is one of the hardest phases — keep the parser simple, don't over-engineer

## Agent Prompt

```
You are implementing CV import functionality for a CV builder. Keep the parser simple — this is not an AI feature. Extract text and do basic heuristic mapping.

CONTEXT: Next.js 14, TypeScript, Zustand store. mammoth is available (install it: npm install mammoth). For PDF parsing, install pdfjs-dist: npm install pdfjs-dist.

STEP 1 — Install dependencies:
npm install mammoth pdfjs-dist

STEP 2 — Create lib/importParser.ts:
This file contains the text extraction and basic parsing logic.

Function 1: async extractTextFromPDF(file: File): Promise<string>
- Use pdfjs-dist to load the PDF and extract text page by page
- Join all page text with newlines
- Return the full text string

Function 2: async extractTextFromDOCX(file: File): Promise<string>
- Convert file to ArrayBuffer
- Use mammoth.extractRawText({ arrayBuffer }) to get plain text
- Return result.value

Function 3: parseResumeText(text: string): Partial<CVData>
- This is a heuristic parser. It does NOT need to be perfect.
- Look for common patterns:
  - Email: regex for email pattern → populate personal.email
  - Phone: regex for phone numbers → populate personal.phone
  - Name: usually the first line of the document if it's short (< 5 words) → populate personal.fullName
  - LinkedIn: look for "linkedin.com/" in text → populate personal.linkedin
  - GitHub: look for "github.com/" in text → populate personal.github
  - Website: look for other URLs → populate personal.website
  - Everything else: create one WorkExperience item with the full text as description (user will sort it out)
- Return a Partial<CVData> with whatever was found

STEP 3 — Create an Import Modal component: components/editor/ImportModal.tsx:
Three tabs: "Upload PDF", "Upload DOCX", "Paste Text"

"Upload PDF" tab:
- File input accepting .pdf
- On file select: call extractTextFromPDF, then parseResumeText
- Show a preview of the extracted text in a scrollable box
- "Import this" button applies the parsed data to the store

"Upload DOCX" tab:
- Same flow but with extractTextFromDOCX

"Paste Text" tab:
- A large textarea where user pastes their CV text
- "Parse" button calls parseResumeText on the textarea value
- Show a preview of what was found
- "Import this" button applies to store

Confirmation step (same for all tabs):
Before applying to store, show a summary:
  "Found: Full Name ✓, Email ✓, Phone ✓, 1 work experience (raw text)"
  Two buttons: "Import (replaces current)" and "Cancel"
  If user confirms, call the appropriate store actions to set the found data.

STEP 4 — Add Import button to editor:
In EditorShell nav, add a secondary button "↑ Import CV" that opens the ImportModal.
Use a local state isImportOpen in EditorShell to control the modal.

ACCEPTANCE CRITERIA:
- Uploading a PDF extracts its text and shows it in the preview box
- Uploading a DOCX extracts its text and shows it in the preview box
- Pasting text works in the textarea
- Detected fields (email, phone, name) are shown in the confirmation summary
- Confirming import updates the store with found data
- No TypeScript errors
- User can cancel without any data being changed
```

---

---

# PHASE 13 — Polish & QA

## What This Phase Does
Final pass — adds all the small things that make the product feel finished and trustworthy. Empty states, loading states, auto-save indicator, error handling, responsiveness, keyboard accessibility.

## Checklist

### Empty States
- Each section form: if no items, show a friendly message + prominent "Add [item]" button
- Right panel: if personal.fullName is empty, show a "Fill in your details →" prompt
- Template gallery: all 5 templates show real previews

### Loading States
- Download button: "Generating PDF..." with a spinner during export
- Import: "Extracting text..." during file processing

### Auto-save Indicator
- Wire the nav bar auto-save indicator
- Use a Zustand middleware or useEffect to detect store changes
- Show: "Saving..." for 500ms after any change, then "All changes saved ✓"
- Persist CV data to localStorage using Zustand persist middleware so data survives page refresh

### Responsiveness
- Mobile (< 768px): left panel and right panel stack. Show tabs: "Edit" | "Preview"
- Tablet (768px–1024px): reduce left panel to 360px
- Design panel: on mobile, show as a full-screen modal instead of bottom drawer

### Error Handling
- PDF export failure: show an error toast notification
- Import failure: show an error message in the import modal
- Invalid data: graceful fallback (don't crash)

### Accessibility
- All buttons have aria-labels
- Toggle components have role="switch" and aria-checked
- Drag handles have aria-grabbed state
- Focus management: opening a modal moves focus inside it

### Performance
- Memoize template components with React.memo to avoid unnecessary re-renders
- Debounce store updates from text inputs by 150ms (so every keystroke doesn't hammer Zustand)
- Lazy-load template components so the initial bundle is smaller

## Agent Prompt

```
You are doing the final polish pass on a CV builder application. All core features are implemented. Your job is to add production-quality finishing touches.

CONTEXT: Next.js 14, TypeScript, Tailwind CSS, Zustand store. All components exist. Do not redesign anything — only add what is listed below.

STEP 1 — Persist data to localStorage:
In lib/store.ts, add Zustand persist middleware wrapping the store.
Persist key: 'cv-builder-data'
This means refreshing the page restores the user's CV data.
Add a "Reset to default" button somewhere in the editor (e.g. in the Design panel or a settings menu) that calls store.resetToDefaults() and clears localStorage.

STEP 2 — Auto-save indicator:
In EditorShell.tsx, add a useEffect that watches the entire store state.
When any change occurs:
  1. Set saveStatus = 'saving'
  2. After 800ms, set saveStatus = 'saved'
Display in the nav bar:
  - 'saving': gray text "Saving..." with a subtle spinning icon
  - 'saved': green text "All changes saved ✓"
  - (default): nothing shown

STEP 3 — Empty states:
In each section form (WorkExperienceForm, EducationForm, etc.):
  If the items array is empty, render instead of the list:
  A centered box with an icon (from Lucide), a message like "No work experience added yet", and a prominent "+ Add Work Experience" button.

In RightPanel.tsx:
  If personal.fullName is empty or === "Your Name" (the default), overlay a subtle banner:
  "👈 Fill in your details on the left to see your CV come to life"

STEP 4 — Error handling for PDF export:
In the download handler in EditorShell, wrap in try/catch.
On error: show a small toast notification (build a simple Toast component: fixed bottom-right, fades in/out, shows error message for 4 seconds).

STEP 5 — Mobile responsive layout:
In EditorShell.tsx, add responsive behavior:
- On mobile (use a useEffect checking window.innerWidth or Tailwind's md: prefix):
  - Show two tabs at the top: "Edit" and "Preview"
  - "Edit" tab: show only LeftPanel (full width)
  - "Preview" tab: show only RightPanel (full width)
  - Hide DesignPanel on mobile, or make it a floating button that opens a full-screen modal
- On desktop: two-panel layout as built in Phase 4

STEP 6 — Performance: debounce text inputs:
In PersonalInfoForm and all section forms, wrap onChange handlers for text inputs in a 150ms debounce.
Use a local useState for the input value, and debounce the store.update call.
This prevents re-rendering the entire template on every keystroke.

STEP 7 — Memoize templates:
Wrap all 5 template components in React.memo().
In the store, use shallow equality for the Zustand selector in CVPreview to avoid unnecessary re-renders.
Import { shallow } from 'zustand/shallow' and use it: const data = useCVStore(state => ({ ... }), shallow)

STEP 8 — Final checklist before delivery:
- Run npm run build — fix ALL TypeScript and ESLint errors until build succeeds
- Run npm run dev — click through every feature manually
- Test: add an experience item, see it in preview, download PDF, verify PDF looks correct
- Test: upload a PDF, verify import flow
- Test: switch all 5 templates, change colors, change fonts
- Test: reorder sections, hide a section, verify it's gone from preview and PDF

ACCEPTANCE CRITERIA:
- npm run build completes with 0 errors and 0 warnings
- Page refresh restores all CV data (localStorage persistence)
- Auto-save indicator shows correctly after edits
- All empty states show friendly messages with action buttons
- PDF export error shows a toast notification
- Mobile: Edit/Preview tabs work correctly
- All 5 templates render in both the preview and the exported PDF
```

---

---

## Summary: Build Order & Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Data Layer) ← everything depends on types and store
    ↓
Phase 3 (Landing)    ← can be built independently after Phase 1
    ↓
Phase 4 (Editor Shell)
    ↓
Phase 5 (Personal Info Form) ← establishes the pattern
    ↓
Phase 6 (All Section Forms) ← depends on Phase 5 pattern
    ↓
Phase 7 (Section Manager) ← depends on Phase 6
    ↓
Phase 8 (Design Panel) ← depends on Phase 2 (fonts/themes)
    ↓
Phase 9 (Templates) ← depends on Phase 2 (types) and Phase 8 (CSS vars)
    ↓
Phase 10 (Live Preview) ← depends on Phase 9
    ↓
Phase 11 (PDF Export) ← depends on Phase 10
    ↓
Phase 12 (Import) ← can be done anytime after Phase 2
    ↓
Phase 13 (Polish) ← always last
```

---

## Critical Rules for the Agent at All Times

1. **Never skip a phase.** Each phase's output is required by the next.
2. **Never touch files outside the current phase's scope.** Only modify what is listed in Deliverables.
3. **Always check types.** Every component must have fully typed props. No `any` unless explicitly noted.
4. **Never hardcode data.** Colors, fonts, templates — always from lib/themes.ts, lib/fonts.ts, lib/types.ts.
5. **Store is the only source of truth.** No local state for CV content — only for UI state (open/closed panels, loading flags).
6. **One component per file.** No barrel files with multiple component definitions.
7. **Run the build after every phase.** Fix all TypeScript errors before moving to the next phase.
8. **CSS variables, not hardcoded hex.** All color values in templates use `var(--cv-*)`.
9. **Check acceptance criteria before declaring a phase complete.** Every criterion must be verified.
10. **When in doubt, reference lib/types.ts.** It is the single source of truth for all data shapes.

---

*Blueprint version: 1.0 — May 2026*
*Stack: Next.js 14 · TypeScript · Tailwind CSS · Zustand · Puppeteer*
*Scope: Free MVP · No AI · No auth · No pricing*
