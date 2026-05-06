'use client'

import { useCVStore } from '@/store/cv-store'
import { Check, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

const TEMPLATES = [
  { 
    id: 'classic', 
    name: 'Classic Professional', 
    description: 'Traditional layout for conservative industries.',
    color: '#374151',
    tags: ['Traditional', 'Clean'],
    preset: {
      fontId: 'merriweather',
      colorThemeId: 'charcoal',
      layout: 'one-column',
      fontSize: 10,
      sectionSpacing: 16
    }
  },
  { 
    id: 'modern', 
    name: 'Modern Edge', 
    description: 'A contemporary look with bold typography.',
    color: '#1e3a8a',
    tags: ['Bold', 'Trendy'],
    preset: {
      fontId: 'montserrat',
      colorThemeId: 'cobalt-blue',
      layout: 'one-column',
      fontSize: 10,
      sectionSpacing: 20
    }
  },
  { 
    id: 'minimal', 
    name: 'Minimalist', 
    description: 'Ultra-clean design that focuses on content.',
    color: '#9ca3af',
    tags: ['Clean', 'Spacious'],
    preset: {
      fontId: 'lato',
      colorThemeId: 'slate',
      layout: 'one-column',
      fontSize: 9.5,
      sectionSpacing: 24
    }
  },
  { 
    id: 'bold', 
    name: 'Creative Impact', 
    description: 'Make a statement with vibrant accents.',
    color: '#7c3aed',
    tags: ['Creative', 'Vibrant'],
    preset: {
      fontId: 'raleway',
      colorThemeId: 'lavender',
      layout: 'one-column',
      fontSize: 10,
      sectionSpacing: 18
    }
  },
  { 
    id: 'sidebar', 
    name: 'Executive Sidebar', 
    description: 'Dual-column layout for organized sections.',
    color: '#10b981',
    tags: ['Organized', 'Efficient'],
    preset: {
      fontId: 'roboto',
      colorThemeId: 'teal',
      layout: 'sidebar-right',
      fontSize: 9,
      sectionSpacing: 14
    }
  },
]

export default function TemplatesPanel() {
  const { design, updateDesign } = useCVStore()

  const handleSelectTemplate = (template: typeof TEMPLATES[0]) => {
    updateDesign({
      templateId: template.id,
      ...template.preset as any
    })
  }

  return (
    <div className="flex flex-col gap-6 p-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1.5">
        <h3 className="text-[11px] font-bold text-outline uppercase tracking-[0.15em]">Design Library</h3>
        <p className="text-[12px] text-outline italic">Select a template to instantly update your resume design. Your content remains safe.</p>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => handleSelectTemplate(template)}
            className={cn(
              "group relative flex flex-col text-left rounded-2xl border-2 transition-all overflow-hidden",
              design.templateId === template.id 
                ? "border-primary bg-primary/5 ring-4 ring-primary/10" 
                : "border-outline-variant/30 bg-surface hover:border-primary/40 hover:bg-surface-container-low"
            )}
          >
            {/* Template Preview Box */}
            <div className="relative h-40 bg-surface-container flex items-center justify-center">
              <div 
                className="w-24 h-32 rounded shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-2" 
                style={{ backgroundColor: template.color }}
              />
              {design.templateId === template.id && (
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary text-surface flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Template Info */}
            <div className="p-4 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-bold font-manrope text-on-surface">
                  {template.name}
                </span>
                <div className="flex gap-1">
                  {template.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-full bg-secondary-container/30 text-[9px] font-black text-secondary uppercase tracking-tighter">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-outline leading-relaxed line-clamp-2">
                {template.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-secondary-container/10 border border-secondary-container/20 flex gap-3">
        <Info className="w-4 h-4 text-secondary flex-shrink-0" />
        <p className="text-[10px] text-on-secondary-container/80 leading-relaxed font-medium">
          Template selection only changes visual styling. Colors, fonts, and layout rules will be adjusted to match the selected design.
        </p>
      </div>
    </div>
  )
}
