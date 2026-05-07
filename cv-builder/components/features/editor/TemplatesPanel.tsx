import { useState } from 'react'
import { useCVStore } from '@/store/cv-store'
import { Check, Info, Search, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'
import cvTemplatesData from '@/cv-templates.json'

// Extract templates from JSON
const TEMPLATES = cvTemplatesData.templates
const CATEGORIES = cvTemplatesData.meta.categories

function TemplatePreview({ template }: { template: any }) {
  const accentColor = template.colors['--cv-accent']
  const layout = template.layout.type
  const sidebarPos = template.layout.sidebarPosition
  const headerLayout = template.header.layout

  return (
    <div className="w-full h-full bg-white rounded-md border border-outline-variant/30 overflow-hidden flex flex-col shadow-sm group-hover:shadow-md transition-all duration-300">
      {/* Header Preview */}
      <div 
        className={cn(
          "w-full p-2 border-b border-outline-variant/10",
          headerLayout === 'centered' ? "flex flex-col items-center text-center" : "flex flex-col items-start"
        )}
        style={{ backgroundColor: template.colors['--cv-header-bg'] }}
      >
        <div className="w-2/3 h-1.5 rounded-full mb-1" style={{ backgroundColor: accentColor }} />
        <div className="w-1/3 h-0.5 rounded-full opacity-30" style={{ backgroundColor: template.colors['--cv-header-text'] }} />
        <div className={cn(
          "w-full flex gap-1 mt-1.5",
          headerLayout === 'centered' ? "justify-center" : "justify-start"
        )}>
          <div className="w-1 h-1 rounded-full opacity-20" style={{ backgroundColor: accentColor }} />
          <div className="w-1 h-1 rounded-full opacity-20" style={{ backgroundColor: accentColor }} />
          <div className="w-1 h-1 rounded-full opacity-20" style={{ backgroundColor: accentColor }} />
        </div>
      </div>

      {/* Body Preview */}
      <div className="flex-1 flex w-full p-2 gap-2">
        {/* Sidebar Left */}
        {sidebarPos === 'left' && (
          <div className="w-1/3 h-full flex flex-col gap-2 p-1 rounded-[2px]" style={{ backgroundColor: template.colors['--cv-sidebar-bg'] || '#f8f9fa' }}>
             <div className="w-full h-1 rounded-full opacity-40" style={{ backgroundColor: accentColor }} />
             <div className="space-y-1 mt-1">
                <div className="w-full h-0.5 bg-outline-variant/20 rounded-full" />
                <div className="w-4/5 h-0.5 bg-outline-variant/20 rounded-full" />
             </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 h-full flex flex-col gap-3">
          <div className="space-y-1.5">
            <div className="w-1/2 h-1 rounded-full" style={{ backgroundColor: accentColor, opacity: 0.5 }} />
            <div className="space-y-1">
              <div className="w-full h-0.5 bg-outline-variant/20 rounded-full" />
              <div className="w-full h-0.5 bg-outline-variant/20 rounded-full" />
              <div className="w-3/4 h-0.5 bg-outline-variant/20 rounded-full" />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="w-1/2 h-1 rounded-full" style={{ backgroundColor: accentColor, opacity: 0.5 }} />
            <div className="space-y-1">
              <div className="w-full h-0.5 bg-outline-variant/20 rounded-full" />
              <div className="w-full h-0.5 bg-outline-variant/20 rounded-full" />
            </div>
          </div>
        </div>

        {/* Sidebar Right */}
        {sidebarPos === 'right' && (
          <div className="w-1/3 h-full flex flex-col gap-2 p-1 rounded-[2px]" style={{ backgroundColor: template.colors['--cv-sidebar-bg'] || '#f8f9fa' }}>
             <div className="w-full h-1 rounded-full opacity-40" style={{ backgroundColor: accentColor }} />
             <div className="space-y-1 mt-1">
                <div className="w-full h-0.5 bg-outline-variant/20 rounded-full" />
                <div className="w-4/5 h-0.5 bg-outline-variant/20 rounded-full" />
             </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function TemplatesPanel() {
  const { design, updateDesign } = useCVStore()
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const handleSelectTemplate = (templateId: string) => {
    const template = TEMPLATES.find(t => t.id === templateId)
    if (!template) return

    updateDesign({
      templateId: templateId,
      // Global Layout & Sizing
      layout: template.layout.type as any,
      pageSize: (template.defaultPageSize as any) || 'a4',
      
      // Typography Defaults
      fontId: template.defaultFont,
      fontSize: template.defaultFontSize,
      lineHeight: template.defaultLineHeight,
      
      // Heading Identity
      headingStyle: (template.sections?.titleLayout as any) || 'simple',
      headingCase: template.typography?.sectionTitleTransform === 'uppercase' ? 'uppercase' : 'capitalize',
      headingSize: parseInt(template.typography?.sectionTitleSize || '10') || 10,
      
      // Entry & Subtitle Defaults
      titleSize: parseInt(template.typography?.itemTitleSize || '10') || 10,
      subtitleSize: parseInt(template.typography?.itemSubtitleSize || '9') || 9,
      subtitleStyle: (template.typography?.itemSubtitleStyle as any) || 'italic',
      
      // Skills & Lists
      skillsLayout: (template.skills?.defaultDisplayStyle as any) || 'tag',
      listStyle: (template.sections?.dividerStyle as any) || 'disc',

      // Theme
      colorThemeId: 'modern', 
      customAccentColor: ''
    })
  }

  const filteredTemplates = TEMPLATES.filter(t => {
    const matchesCategory = activeCategory === 'all' || t.category === activeCategory
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="flex flex-col h-full bg-surface">
      {/* Header & Search */}
      <div className="p-6 pb-0 flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">Design Library</h3>
          <p className="text-[12px] text-outline italic">Choose a foundation for your professional identity.</p>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            placeholder="Search templates, styles, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-surface-container border border-outline-variant/30 rounded-2xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveCategory('all')}
            className={cn(
              "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
              activeCategory === 'all' 
                ? "bg-primary text-surface shadow-md" 
                : "bg-surface-container text-outline hover:bg-surface-container-high"
            )}
          >
            All Templates
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                activeCategory === cat 
                  ? "bg-primary text-surface shadow-md" 
                  : "bg-surface-container text-outline hover:bg-surface-container-high"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Template List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
        <div className="grid grid-cols-1 gap-4">
          {filteredTemplates.map((template) => {
            const isSelected = design.templateId === template.id
            const accentColor = template.colors['--cv-accent']

            return (
              <button
                key={template.id}
                onClick={() => handleSelectTemplate(template.id)}
                className={cn(
                  "group relative flex flex-col text-left rounded-3xl border-2 transition-all duration-300 overflow-hidden",
                  isSelected 
                    ? "border-primary bg-primary/[0.02] shadow-xl scale-[1.01]" 
                    : "border-outline-variant/20 bg-surface hover:border-primary/40 hover:shadow-lg"
                )}
              >
                {/* Visual Preview Section */}
                <div className="relative h-48 bg-surface-container-low flex items-center justify-center overflow-hidden">
                  {/* Abstract Representation of the layout */}
                  <div className="absolute inset-0 opacity-10 bg-grid-slate-200 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]" />
                  
                  <div className={cn(
                    "w-32 h-44 transition-all duration-500 group-hover:scale-105 group-hover:-rotate-1 relative",
                    isSelected ? "ring-2 ring-primary rounded-md" : ""
                  )}>
                    <TemplatePreview template={template} />
                  </div>

                  {isSelected && (
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary text-surface flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                      <Check className="w-5 h-5 stroke-[3]" />
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 flex gap-1.5">
                    {template.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2.5 py-1 rounded-lg bg-surface/90 backdrop-blur-sm text-[8px] font-black text-on-surface uppercase tracking-wider shadow-sm border border-outline-variant/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-5 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-black font-manrope text-on-surface tracking-tight">
                      {template.name}
                    </span>
                    <span className="text-[10px] font-bold text-primary/60 uppercase tracking-tighter">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-outline leading-relaxed line-clamp-2 font-medium">
                    {template.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        <div className="py-6 flex items-start gap-3 opacity-60">
          <Info className="w-4 h-4 text-outline shrink-0 mt-0.5" />
          <p className="text-[10px] text-outline leading-relaxed">
            Switching templates instantly re-styles your resume. Manual customizations like custom colors or font sizes may be preserved or adjusted to fit the new design structure.
          </p>
        </div>
      </div>
    </div>
  )
}

