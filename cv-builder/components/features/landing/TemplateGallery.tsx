import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic',
    tagline: 'Timeless & traditional',
    headerBg: '#1e3a5f',
    accentColor: '#1e3a5f',
    dividerColor: '#bfdbfe',
    previewLines: ['navy', '#bfdbfe', '#e0e7ef', '#e0e7ef', '#e0e7ef'],
  },
  {
    id: 'modern',
    name: 'Modern',
    tagline: 'Clean & contemporary',
    headerBg: '#111827',
    accentColor: '#2563eb',
    dividerColor: '#bfdbfe',
    previewLines: ['#111827', '#bfdbfe', '#e5e7eb', '#e5e7eb', '#e5e7eb'],
  },
  {
    id: 'minimal',
    name: 'Minimal',
    tagline: 'Pure & understated',
    headerBg: '#f9fafb',
    accentColor: '#6b7280',
    dividerColor: '#e5e7eb',
    previewLines: ['#f3f4f6', '#d1d5db', '#f3f4f6', '#f3f4f6', '#f3f4f6'],
  },
  {
    id: 'bold',
    name: 'Bold',
    tagline: 'Strong & memorable',
    headerBg: '#7c3aed',
    accentColor: '#7c3aed',
    dividerColor: '#ddd6fe',
    previewLines: ['#7c3aed', '#ddd6fe', '#f5f3ff', '#f5f3ff', '#f5f3ff'],
  },
  {
    id: 'sidebar',
    name: 'Sidebar',
    tagline: 'Two-column layout',
    headerBg: '#0f766e',
    accentColor: '#0d9488',
    dividerColor: '#99f6e4',
    previewLines: ['#0f766e', '#99f6e4', '#ecfdf5', '#ecfdf5', '#ecfdf5'],
  },
]

/** Minimal A4-proportioned preview card drawn with divs */
function TemplatePreview({
  template,
}: {
  template: (typeof TEMPLATES)[0]
}) {
  const isSidebar = template.id === 'sidebar'

  return (
    <div
      className="w-full bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm"
      style={{ aspectRatio: '210 / 297' }}
    >
      {isSidebar ? (
        /* Two-column sidebar layout */
        <div className="flex h-full">
          {/* Sidebar */}
          <div
            className="w-[35%] h-full p-2 flex flex-col gap-1.5"
            style={{ backgroundColor: template.accentColor }}
          >
            <div className="w-10 h-10 rounded-full bg-white/20 mx-auto mt-2" />
            <div className="h-1 rounded-full bg-white/30 mt-2" />
            <div className="h-0.5 rounded-full bg-white/20" />
            <div className="h-0.5 rounded-full bg-white/20" />
            <div className="h-1 rounded-full bg-white/30 mt-2" />
            <div className="h-0.5 rounded-full bg-white/20" />
            <div className="h-0.5 rounded-full bg-white/20" />
            <div className="h-0.5 rounded-full bg-white/20" />
          </div>
          {/* Main content */}
          <div className="flex-1 p-2 flex flex-col gap-1.5">
            <div className="h-2.5 rounded bg-gray-800 w-3/4 mt-1" />
            <div className="h-1 rounded bg-gray-300 w-1/2" />
            <div
              className="h-0.5 rounded my-1"
              style={{ backgroundColor: template.dividerColor }}
            />
            <div className="h-1.5 rounded bg-gray-800 w-2/3" />
            <div className="h-0.5 rounded bg-gray-200" />
            <div className="h-0.5 rounded bg-gray-200 w-4/5" />
            <div
              className="h-0.5 rounded my-1"
              style={{ backgroundColor: template.dividerColor }}
            />
            <div className="h-1.5 rounded bg-gray-800 w-2/3" />
            <div className="h-0.5 rounded bg-gray-200" />
            <div className="h-0.5 rounded bg-gray-200 w-3/4" />
          </div>
        </div>
      ) : (
        /* One-column layout */
        <div className="flex flex-col h-full">
          {/* Header block */}
          <div
            className="px-3 py-4 flex flex-col items-center gap-1"
            style={{ backgroundColor: template.headerBg }}
          >
            <div
              className="h-2.5 rounded w-2/3"
              style={{
                backgroundColor:
                  template.id === 'minimal' ? '#374151' : 'rgba(255,255,255,0.9)',
              }}
            />
            <div
              className="h-1 rounded w-1/3"
              style={{
                backgroundColor:
                  template.id === 'minimal' ? '#9ca3af' : 'rgba(255,255,255,0.5)',
              }}
            />
            <div
              className="h-0.5 rounded w-1/2 mt-1"
              style={{
                backgroundColor:
                  template.id === 'minimal' ? '#d1d5db' : 'rgba(255,255,255,0.3)',
              }}
            />
          </div>
          {/* Body */}
          <div className="flex-1 px-3 py-2 flex flex-col gap-1.5">
            <div
              className="h-0.5 rounded"
              style={{ backgroundColor: template.dividerColor }}
            />
            <div
              className="h-1.5 rounded w-1/2"
              style={{ backgroundColor: template.accentColor, opacity: 0.8 }}
            />
            <div className="h-0.5 rounded bg-gray-200 w-4/5" />
            <div className="h-0.5 rounded bg-gray-200 w-3/4" />
            <div className="h-0.5 rounded bg-gray-200 w-4/5 mb-1" />
            <div
              className="h-0.5 rounded"
              style={{ backgroundColor: template.dividerColor }}
            />
            <div
              className="h-1.5 rounded w-2/5"
              style={{ backgroundColor: template.accentColor, opacity: 0.8 }}
            />
            <div className="h-0.5 rounded bg-gray-200 w-4/5" />
            <div className="h-0.5 rounded bg-gray-200 w-3/5" />
            <div className="h-0.5 rounded bg-gray-200 w-4/5 mb-1" />
            <div
              className="h-0.5 rounded"
              style={{ backgroundColor: template.dividerColor }}
            />
            <div
              className="h-1.5 rounded w-1/3"
              style={{ backgroundColor: template.accentColor, opacity: 0.8 }}
            />
            <div className="flex gap-1 flex-wrap mt-0.5">
              {[40, 50, 35, 45].map((w, i) => (
                <div
                  key={i}
                  className="h-1.5 rounded-full"
                  style={{
                    width: `${w}%`,
                    backgroundColor: template.accentColor,
                    opacity: 0.15,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function TemplateGallery() {
  return (
    <section className="bg-white py-24 px-6 md:px-12" id="templates">
      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-14">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-violet-600 mb-3">
          Templates
        </p>
        <h2
          className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Choose your perfect layout.
        </h2>
        <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
          Five hand-crafted templates — each fully customizable with your choice of colors and fonts.
        </p>
      </div>

      {/* Template cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
        {TEMPLATES.map((template) => (
          <div
            key={template.id}
            className="group flex flex-col gap-3"
          >
            {/* Preview card */}
            <div className="relative overflow-hidden rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
              <TemplatePreview template={template} />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center">
                <Link
                  href="/signup"
                  id={`template-use-${template.id}`}
                  className="opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 bg-white text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1"
                >
                  Use this
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Label */}
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'var(--font-body)' }}>
                {template.name}
              </p>
              <p className="text-xs text-gray-400">{template.tagline}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <Link
          href="/signup"
          id="templates-section-cta"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
        >
          Start with any template
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}
