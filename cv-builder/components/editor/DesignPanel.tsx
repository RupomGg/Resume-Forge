'use client'

import { useCVStore } from '@/lib/store'
import { COLOR_THEMES } from '@/lib/themes'
import { FONTS } from '@/lib/fonts'
import { 
  Palette, 
  Type, 
  Layout, 
  Move, 
  ChevronRight, 
  ChevronLeft,
  Check,
  Columns,
  Square,
  AlignLeft,
  AlignRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useRef } from 'react'

const TEMPLATES = [
  { id: 'classic', name: 'Classic', preview: '#374151' },
  { id: 'modern', name: 'Modern', preview: '#1e3a8a' },
  { id: 'minimal', name: 'Minimal', preview: '#9ca3af' },
  { id: 'bold', name: 'Bold', preview: '#7c3aed' },
  { id: 'sidebar', name: 'Sidebar', preview: '#10b981' },
]

const LAYOUTS = [
  { id: 'one-column', name: 'Single', icon: Square },
  { id: 'sidebar-left', name: 'Left Sidebar', icon: AlignLeft },
  { id: 'sidebar-right', name: 'Right Sidebar', icon: AlignRight },
]

export default function DesignPanel({ isOpen }: { isOpen: boolean }) {
  const { design, updateDesign } = useCVStore()
  const [activeTab, setActiveTab] = useState<'template' | 'font' | 'color' | 'layout' | 'spacing'>('template')
  const scrollRef = useRef<HTMLDivElement>(null)

  const tabs = [
    { id: 'template', icon: Palette, label: 'Template' },
    { id: 'font', icon: Type, label: 'Typography' },
    { id: 'color', icon: Palette, label: 'Colors' },
    { id: 'layout', icon: Layout, label: 'Layout' },
    { id: 'spacing', icon: Move, label: 'Spacing' },
  ] as const

  return (
    <div
      id="design-panel"
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[50] transition-all duration-500 ease-in-out shadow-[0_-8px_30px_rgba(0,0,0,0.08)]",
        isOpen ? "h-[320px]" : "h-0 overflow-hidden border-none"
      )}
    >
      <div className="max-w-6xl mx-auto h-full flex">
        {/* Left: Tab Switcher */}
        <div className="w-[180px] border-r border-gray-100 flex flex-col p-4 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                activeTab === tab.id 
                  ? "bg-blue-50 text-blue-600" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right: Content Area */}
        <div className="flex-1 p-8 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 capitalize">{activeTab} Settings</h3>
            <p className="text-xs text-gray-400">Real-time preview enabled</p>
          </div>

          <div className="flex-1 overflow-y-auto pr-4">
            {/* ── Template Content ─────────────────────────────────── */}
            {activeTab === 'template' && (
              <div className="grid grid-cols-5 gap-4">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => updateDesign({ templateId: t.id })}
                    className={cn(
                      "group relative aspect-[3/4] rounded-xl border-2 transition-all p-3 flex flex-col items-center justify-center gap-3",
                      design.templateId === t.id 
                        ? "border-blue-500 bg-blue-50/30 ring-4 ring-blue-100" 
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    <div 
                      className="w-12 h-16 rounded shadow-sm group-hover:scale-110 transition-transform" 
                      style={{ backgroundColor: t.preview }}
                    />
                    <span className="text-xs font-bold text-gray-700">{t.name}</span>
                    {design.templateId === t.id && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* ── Font Content ─────────────────────────────────────── */}
            {activeTab === 'font' && (
              <div className="grid grid-cols-3 gap-3">
                {FONTS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => updateDesign({ fontId: f.id })}
                    className={cn(
                      "flex flex-col p-4 rounded-xl border transition-all text-left group",
                      design.fontId === f.id 
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100" 
                        : "border-gray-100 hover:border-gray-300"
                    )}
                  >
                    <span className="text-sm font-bold text-gray-900">{f.name}</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">{f.category}</span>
                    <p className="text-xs mt-3 text-gray-500 line-clamp-1 opacity-60 group-hover:opacity-100">
                      The quick brown fox jumps over...
                    </p>
                  </button>
                ))}
              </div>
            )}

            {/* ── Color Content ────────────────────────────────────── */}
            {activeTab === 'color' && (
              <div className="grid grid-cols-8 gap-3">
                {COLOR_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => updateDesign({ colorThemeId: theme.id })}
                    className={cn(
                      "group flex flex-col items-center gap-2",
                      design.colorThemeId === theme.id ? "opacity-100" : "opacity-60 hover:opacity-100"
                    )}
                    title={theme.name}
                  >
                    <div 
                      className={cn(
                        "w-10 h-10 rounded-full border-2 transition-all p-0.5",
                        design.colorThemeId === theme.id ? "border-blue-500 scale-110" : "border-transparent"
                      )}
                    >
                      <div 
                        className="w-full h-full rounded-full shadow-inner" 
                        style={{ backgroundColor: theme.accentColor }} 
                      />
                    </div>
                    <span className="text-[10px] font-medium text-gray-500 truncate w-full text-center">{theme.name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* ── Layout Content ───────────────────────────────────── */}
            {activeTab === 'layout' && (
              <div className="grid grid-cols-3 gap-6">
                {LAYOUTS.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => updateDesign({ layout: l.id as any })}
                    className={cn(
                      "p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 group",
                      design.layout === l.id 
                        ? "border-blue-500 bg-blue-50" 
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                      design.layout === l.id ? "bg-blue-600 text-white shadow-lg" : "bg-gray-100 text-gray-400 group-hover:bg-white group-hover:text-gray-600"
                    )}>
                      <l.icon className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-gray-700">{l.name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* ── Spacing Content ──────────────────────────────────── */}
            {activeTab === 'spacing' && (
              <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                {/* Font Size */}
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-semibold text-gray-600 uppercase tracking-widest">
                    <span>Font Size</span>
                    <span className="text-blue-600">{design.fontSize}pt</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="14"
                    step="0.5"
                    value={design.fontSize}
                    onChange={(e) => updateDesign({ fontSize: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Line Height */}
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-semibold text-gray-600 uppercase tracking-widest">
                    <span>Line Height</span>
                    <span className="text-blue-600">{design.lineHeight}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="2"
                    step="0.1"
                    value={design.lineHeight}
                    onChange={(e) => updateDesign({ lineHeight: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Margins */}
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-semibold text-gray-600 uppercase tracking-widest">
                    <span>Page Margins</span>
                    <span className="text-blue-600">{design.marginLeft}mm</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    value={design.marginLeft}
                    onChange={(e) => {
                      const v = parseInt(e.target.value)
                      updateDesign({ 
                        marginLeft: v, 
                        marginRight: v, 
                        marginTop: v, 
                        marginBottom: v 
                      })
                    }}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Section Spacing */}
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-semibold text-gray-600 uppercase tracking-widest">
                    <span>Section Spacing</span>
                    <span className="text-blue-600">{design.sectionSpacing}px</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="48"
                    step="4"
                    value={design.sectionSpacing}
                    onChange={(e) => updateDesign({ sectionSpacing: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
