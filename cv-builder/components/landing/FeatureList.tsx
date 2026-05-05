import {
  LayoutTemplate,
  Eye,
  Download,
  GripVertical,
  Palette,
  ShieldCheck,
  Zap,
  Clock,
  Globe,
} from 'lucide-react'

const FEATURES = [
  {
    icon: LayoutTemplate,
    title: '5 Professional Templates',
    description:
      'Choose from Classic, Modern, Minimal, Bold, and Sidebar layouts — each crafted for ATS compatibility and visual impact.',
    accent: '#3b82f6',
    bg: '#eff6ff',
  },
  {
    icon: Eye,
    title: 'Real-time Preview',
    description:
      'See every change instantly in a pixel-perfect live preview — what you see is exactly what gets exported.',
    accent: '#8b5cf6',
    bg: '#f5f3ff',
  },
  {
    icon: Download,
    title: 'One-click PDF Export',
    description:
      'Export a print-ready PDF at any time. No pixelation, no layout shifts — perfectly formatted every time.',
    accent: '#10b981',
    bg: '#ecfdf5',
  },
  {
    icon: GripVertical,
    title: 'Drag & Drop Sections',
    description:
      'Reorder any section with a single drag. Show or hide sections instantly to tailor your CV to each job.',
    accent: '#f59e0b',
    bg: '#fffbeb',
  },
  {
    icon: Palette,
    title: 'Custom Colors & Fonts',
    description:
      '30 curated color themes and 12 font pairings so your CV reflects your personal brand — not a template.',
    accent: '#ec4899',
    bg: '#fdf2f8',
  },
  {
    icon: ShieldCheck,
    title: 'ATS-Friendly Output',
    description:
      'All templates are built with clean, semantic HTML — fully readable by applicant tracking systems.',
    accent: '#0ea5e9',
    bg: '#f0f9ff',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'No heavy frameworks, no loading spinners — your editor is ready in under a second, every time.',
    accent: '#f97316',
    bg: '#fff7ed',
  },
  {
    icon: Clock,
    title: 'Auto-save Always On',
    description:
      'Your work is saved automatically as you type. Close the tab and come back — nothing is ever lost.',
    accent: '#6366f1',
    bg: '#eef2ff',
  },
  {
    icon: Globe,
    title: 'No Account Needed',
    description:
      'Jump straight into the editor. No signup, no email verification, no paywalls — just build your CV.',
    accent: '#14b8a6',
    bg: '#f0fdfa',
  },
]

export default function FeatureList() {
  return (
    <section className="bg-gray-50 py-24 px-6 md:px-12" id="features">
      {/* Section header */}
      <div className="max-w-6xl mx-auto text-center mb-16">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-600 mb-3">
          Why ResumeForge
        </p>
        <h2
          className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Everything you need,
          <br />
          <span className="text-gray-500">nothing you don&apos;t.</span>
        </h2>
        <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
          A focused set of powerful features — built to help you land interviews, not impress investors.
        </p>
      </div>

      {/* Feature grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feature) => {
          const Icon = feature.icon
          return (
            <div
              key={feature.title}
              className="group relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
            >
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: feature.bg }}
              >
                <Icon
                  className="w-5 h-5"
                  style={{ color: feature.accent }}
                  strokeWidth={2}
                />
              </div>

              {/* Title */}
              <h3
                className="text-base font-semibold text-gray-900 mb-2"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                {feature.description}
              </p>

              {/* Hover accent bar */}
              <div
                className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: feature.accent }}
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}
