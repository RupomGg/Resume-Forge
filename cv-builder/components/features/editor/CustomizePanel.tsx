'use client'

import { useState, useEffect } from 'react'
import { useCVStore } from '@/store/cv-store'
import { 
  Globe, 
  Layout as LayoutIcon, 
  ListOrdered, 
  Move, 
  ChevronRight, 
  ChevronLeft,
  Check,
  Columns,
  Square,
  AlignLeft,
  AlignRight,
  GripVertical,
  Eye,
  EyeOff,
  Type,
  Plus,
  Trash2,
  Calendar,
  FileText
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { LayoutType, PageSize, DateFormat, FontCategory, ColorMode, ColorType } from '@/models/cv.types'
import { FONTS } from '@/lib/fonts'
import { COLOR_THEMES } from '@/lib/themes'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// ─── Sub-components for DnD ──────────────────────────────────────────────────

interface SortableSectionItemProps {
  section: { id: string; visible: boolean; label: string }
}

function SortableSectionItem({ section }: SortableSectionItemProps) {
  const { toggleSection, updateSectionLabel, removeSection } = useCVStore()
  const [isEditing, setIsEditing] = useState(false)
  const [tempLabel, setTempLabel] = useState(section.label)

  const isProtected = section.id === 'personal'

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: section.id,
    disabled: isProtected 
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  }

  const handleLabelSubmit = () => {
    if (tempLabel.trim() && tempLabel !== section.label) {
      updateSectionLabel(section.id, tempLabel)
    } else {
      setTempLabel(section.label)
    }
    setIsEditing(false)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 p-3 bg-surface border rounded-xl transition-all mb-2",
        isDragging ? "shadow-lg border-primary scale-[1.02]" : "border-outline-variant/30",
        !section.visible && "opacity-50 grayscale-[0.5]"
      )}
    >
      {/* Drag Handle */}
      {!isProtected ? (
        <div 
          {...attributes} 
          {...listeners} 
          className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-surface-container rounded-lg text-outline"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      ) : (
        <div className="p-1.5 opacity-0">
          <GripVertical className="w-4 h-4" />
        </div>
      )}

      {/* Label / Input */}
      <div className="flex-1 min-w-0">
        {isEditing && !isProtected ? (
          <input
            autoFocus
            type="text"
            value={tempLabel}
            onChange={(e) => setTempLabel(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLabelSubmit()}
            onBlur={handleLabelSubmit}
            className="w-full px-2 py-1 text-[13px] font-bold border-b-2 border-primary outline-none bg-transparent text-on-surface"
          />
        ) : (
          <div className="flex items-center gap-2 group/label">
            <span className={cn(
              "text-[13px] font-bold text-on-surface truncate",
              !section.visible && "line-through text-outline"
            )}>
              {section.label}
            </span>
            {!isProtected && (
              <button 
                onClick={() => setIsEditing(true)} 
                className="opacity-0 group-hover/label:opacity-100 p-1 text-outline hover:text-primary transition-all"
              >
                <Type className="w-3 h-3" />
              </button>
            )}
            {isProtected && (
              <span className="text-[9px] font-black text-primary/60 uppercase tracking-tighter bg-primary/5 px-2 py-0.5 rounded ml-auto">
                Fixed
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        {!isProtected && (
          <button
            onClick={() => toggleSection(section.id as any)}
            className={cn(
              "p-1.5 rounded-lg transition-all",
              section.visible 
                ? "text-primary bg-primary/5 hover:bg-primary/10" 
                : "text-outline bg-surface-container hover:bg-surface-container-high"
            )}
          >
            {section.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

type CustomizeView = 'main' | 'language' | 'layout' | 'order' | 'spacing' | 'fonts' | 'colors'

export default function CustomizePanel() {
  const { design, updateDesign, sectionOrder, reorderSections } = useCVStore()
  const [activeView, setActiveView] = useState<CustomizeView>('main')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = sectionOrder.findIndex((s) => s.id === active.id)
      const newIndex = sectionOrder.findIndex((s) => s.id === over.id)
      reorderSections(oldIndex, newIndex)
    }
  }

  const renderHeader = (title: string) => (
    <div className="flex items-center gap-4 mb-6">
      <button 
        onClick={() => setActiveView('main')}
        className="w-8 h-8 rounded-full bg-surface-container hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-all group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <h3 className="text-sm font-black uppercase tracking-[0.2em] text-on-surface">{title}</h3>
    </div>
  )

  return (
    <div className="h-full flex flex-col bg-surface overflow-hidden">
      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
        
        {/* ─── MAIN MENU ─────────────────────────────────────────────────── */}
        {activeView === 'main' && (
          <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-left-4 duration-300">
            <button
              onClick={() => setActiveView('language')}
              className="flex items-center justify-between p-4 rounded-2xl border border-outline-variant/30 hover:border-primary/40 hover:bg-primary/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-outline group-hover:text-primary group-hover:bg-primary/10 transition-all">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold font-manrope">Language & Region</span>
                  <span className="text-[10px] text-outline">Date formats, page size</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-outline group-hover:text-primary transition-all" />
            </button>

            <button
              onClick={() => setActiveView('fonts')}
              className="flex items-center justify-between p-4 rounded-2xl border border-outline-variant/30 hover:border-primary/40 hover:bg-primary/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-outline group-hover:text-primary group-hover:bg-primary/10 transition-all">
                  <Type className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold font-manrope">Fonts</span>
                  <span className="text-[10px] text-outline">Typography library</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-outline group-hover:text-primary transition-all" />
            </button>

            <button
              onClick={() => setActiveView('colors')}
              className="flex items-center justify-between p-4 rounded-2xl border border-outline-variant/30 hover:border-primary/40 hover:bg-primary/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-outline group-hover:text-primary group-hover:bg-primary/10 transition-all">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-primary to-secondary" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold font-manrope">Colors</span>
                  <span className="text-[10px] text-outline">Palette & accent color</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-outline group-hover:text-primary transition-all" />
            </button>

            <button
              onClick={() => setActiveView('layout')}
              className="flex items-center justify-between p-4 rounded-2xl border border-outline-variant/30 hover:border-primary/40 hover:bg-primary/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-outline group-hover:text-primary group-hover:bg-primary/10 transition-all">
                  <LayoutIcon className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold font-manrope">Layout</span>
                  <span className="text-[10px] text-outline">Column structures</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-outline group-hover:text-primary transition-all" />
            </button>

            <button
              onClick={() => setActiveView('order')}
              className="flex items-center justify-between p-4 rounded-2xl border border-outline-variant/30 hover:border-primary/40 hover:bg-primary/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-outline group-hover:text-primary group-hover:bg-primary/10 transition-all">
                  <ListOrdered className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold font-manrope">Section Order</span>
                  <span className="text-[10px] text-outline">Reorder & visibility</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-outline group-hover:text-primary transition-all" />
            </button>

            <button
              onClick={() => setActiveView('spacing')}
              className="flex items-center justify-between p-4 rounded-2xl border border-outline-variant/30 hover:border-primary/40 hover:bg-primary/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-outline group-hover:text-primary group-hover:bg-primary/10 transition-all">
                  <Move className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold font-manrope">Spacing Controls</span>
                  <span className="text-[10px] text-outline">Margins & sizing</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-outline group-hover:text-primary transition-all" />
            </button>
          </div>
        )}

        {/* ─── LANGUAGE VIEW ─────────────────────────────────────────────── */}
        {activeView === 'language' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {renderHeader('Language & Region')}
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold text-outline uppercase tracking-widest">
                  <Globe className="w-3.5 h-3.5" />
                  Language
                </label>
                <select 
                  value={design.language}
                  onChange={(e) => updateDesign({ language: e.target.value })}
                  className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="en">English (US)</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold text-outline uppercase tracking-widest">
                  <Calendar className="w-3.5 h-3.5" />
                  Date Format
                </label>
                <select 
                  value={design.dateFormat}
                  onChange={(e) => updateDesign({ dateFormat: e.target.value as DateFormat })}
                  className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="full">MM / YYYY (Jan 2024)</option>
                  <option value="short">MM / YY (01/24)</option>
                  <option value="numeric">YYYY-MM (2024-01)</option>
                  <option value="year">YYYY Only (2024)</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold text-outline uppercase tracking-widest">
                  <FileText className="w-3.5 h-3.5" />
                  Page Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['a4', 'letter'].map((size) => (
                    <button
                      key={size}
                      onClick={() => updateDesign({ pageSize: size as PageSize })}
                      className={cn(
                        "py-3 rounded-xl border-2 text-xs font-black uppercase tracking-widest transition-all",
                        design.pageSize === size 
                          ? "border-primary bg-primary/5 text-primary shadow-md" 
                          : "border-outline-variant/30 text-outline hover:border-outline-variant"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── LAYOUT VIEW ───────────────────────────────────────────────── */}
        {activeView === 'layout' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {renderHeader('Page Layout')}
            
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'one-column', name: 'One Column', icon: Square },
                { id: 'sidebar-left', name: 'Two Columns', icon: AlignLeft },
                { id: 'sidebar-right', name: 'Mix Layout', icon: AlignRight },
              ].map((l) => (
                <button
                  key={l.id}
                  onClick={() => updateDesign({ layout: l.id as LayoutType })}
                  className={cn(
                    "flex flex-col items-center justify-center gap-3 aspect-square rounded-2xl border-2 transition-all group",
                    design.layout === l.id 
                      ? "border-primary bg-primary/5 text-primary shadow-lg" 
                      : "border-outline-variant/30 text-outline hover:border-primary/40 hover:bg-primary/5"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                    design.layout === l.id ? "bg-primary text-surface shadow-md" : "bg-surface-container group-hover:text-primary"
                  )}>
                    <l.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-tighter text-center px-1">{l.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─── ORDER VIEW ────────────────────────────────────────────────── */}
        {activeView === 'order' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {renderHeader('Section Order')}
            
            <p className="text-[11px] text-outline mb-6 px-2 italic">Drag sections to reorder. "Personal Details" is fixed at the top.</p>

            <div className="space-y-2 px-1">
              {isMounted ? (
                <DndContext
                  id="section-order-dnd"
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={sectionOrder.map(s => s.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="flex flex-col">
                      {sectionOrder.map((section) => (
                        <SortableSectionItem key={section.id} section={section} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="space-y-3">
                  {sectionOrder.map((section) => (
                    <div key={section.id} className="h-14 bg-surface-container rounded-xl border border-outline-variant/30 animate-pulse" />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── SPACING VIEW ──────────────────────────────────────────────── */}
        {activeView === 'spacing' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {renderHeader('Spacing Controls')}
            
            <div className="space-y-8">
              {/* Font Size */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-outline uppercase tracking-widest">Font Size</span>
                  <span className="text-xs font-black text-primary bg-primary/5 px-2 py-1 rounded-lg">{design.fontSize}pt</span>
                </div>
                <input
                  type="range" min="8" max="14" step="0.5"
                  value={design.fontSize}
                  onChange={(e) => updateDesign({ fontSize: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Line Height */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-outline uppercase tracking-widest">Line Height</span>
                  <span className="text-xs font-black text-primary bg-primary/5 px-2 py-1 rounded-lg">{design.lineHeight}</span>
                </div>
                <input
                  type="range" min="1" max="2" step="0.1"
                  value={design.lineHeight}
                  onChange={(e) => updateDesign({ lineHeight: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Margins */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-outline uppercase tracking-widest">Side Margins</span>
                    <span className="text-[10px] font-black text-primary">{design.marginLeft}mm</span>
                  </div>
                  <input
                    type="range" min="0" max="50"
                    value={design.marginLeft}
                    onChange={(e) => {
                      const v = parseInt(e.target.value)
                      updateDesign({ marginLeft: v, marginRight: v })
                    }}
                    className="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-outline uppercase tracking-widest">Top/Bottom</span>
                    <span className="text-[10px] font-black text-primary">{design.marginTop}mm</span>
                  </div>
                  <input
                    type="range" min="0" max="50"
                    value={design.marginTop}
                    onChange={(e) => {
                      const v = parseInt(e.target.value)
                      updateDesign({ marginTop: v, marginBottom: v })
                    }}
                    className="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>

              {/* Space Between Entries */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-outline uppercase tracking-widest">Entry Spacing</span>
                  <span className="text-xs font-black text-primary bg-primary/5 px-2 py-1 rounded-lg">{design.sectionSpacing}px</span>
                </div>
                <input
                  type="range" min="0" max="100" step="2"
                  value={design.sectionSpacing}
                  onChange={(e) => updateDesign({ sectionSpacing: parseInt(e.target.value) })}
                  className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          </div>
        )}
        {/* ─── FONTS VIEW ────────────────────────────────────────────────── */}
        {activeView === 'fonts' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {renderHeader('Font Library')}
            
            {/* Font Categories */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { id: 'serif', name: 'Serif', label: 'Aa' },
                { id: 'sans-serif', name: 'Sans', label: 'Aa' },
                { id: 'monospace', name: 'Mono', label: 'Aa' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateDesign({ fontCategory: cat.id as FontCategory })}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all group",
                    design.fontCategory === cat.id 
                      ? "border-primary bg-primary/5 text-primary shadow-lg" 
                      : "border-outline-variant/30 text-outline hover:border-outline-variant"
                  )}
                >
                  <span className={cn(
                    "text-2xl mb-1 transition-all",
                    cat.id === 'serif' ? 'font-serif' : cat.id === 'monospace' ? 'font-mono' : 'font-sans',
                    design.fontCategory === cat.id ? "scale-110" : ""
                  )}>{cat.label}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Font Grid */}
            <div className="grid grid-cols-2 gap-3">
              {FONTS.filter(f => f.category === design.fontCategory).map((font) => (
                <button
                  key={font.id}
                  onClick={() => updateDesign({ fontId: font.id })}
                  className={cn(
                    "px-4 py-3 rounded-xl border text-sm font-medium transition-all text-center",
                    design.fontId === font.id 
                      ? "bg-primary text-surface border-primary shadow-md" 
                      : "bg-surface border-outline-variant/30 text-on-surface-variant hover:border-outline-variant"
                  )}
                  style={{ fontFamily: font.googleFamily }}
                >
                  {font.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─── COLORS VIEW ────────────────────────────────────────────────── */}
        {activeView === 'colors' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {renderHeader('Color Settings')}
            
            {/* Color Mode Tabs */}
            <div className="flex items-center gap-6 mb-8 px-2">
              {[
                { id: 'basic', name: 'Basic' },
                { id: 'advanced', name: 'Advanced' },
                { id: 'border', name: 'Border' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => updateDesign({ colorMode: mode.id as ColorMode })}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={cn(
                    "w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all",
                    design.colorMode === mode.id 
                      ? "border-primary bg-primary/5 shadow-inner" 
                      : "border-outline-variant/30 hover:border-outline-variant"
                  )}>
                    <div className={cn(
                      "w-10 h-10 rounded-full transition-all",
                      mode.id === 'basic' ? "bg-primary/20" : mode.id === 'advanced' ? "bg-gradient-to-b from-outline to-surface" : "border-4 border-outline-variant/40"
                    )} />
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest transition-all",
                    design.colorMode === mode.id ? "text-primary" : "text-outline group-hover:text-on-surface-variant"
                  )}>{mode.name}</span>
                </button>
              ))}
            </div>

            {/* Color Type Tabs */}
            <div className="flex items-center gap-6 mb-8 px-2">
              {[
                { id: 'accent', name: 'Accent', icon: Check },
                { id: 'multi', name: 'Multi', icon: Type },
                { id: 'image', name: 'Image', icon: FileText },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => updateDesign({ colorType: type.id as ColorType })}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={cn(
                    "w-14 h-8 rounded-lg border-2 flex items-center justify-center transition-all overflow-hidden",
                    design.colorType === type.id 
                      ? "border-primary bg-primary/5" 
                      : "border-outline-variant/30 hover:border-outline-variant"
                  )}>
                    {type.id === 'accent' ? (
                      <div className="w-full h-full bg-black flex items-center justify-center"><Check className="w-4 h-4 text-white" /></div>
                    ) : type.id === 'multi' ? (
                      <div className="w-full h-full flex">
                        <div className="flex-1 bg-surface flex items-center justify-center"><Type className="w-3.5 h-3.5 text-outline" /></div>
                        <div className="flex-1 bg-outline-variant/40" />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-300 opacity-40" />
                    )}
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest transition-all",
                    design.colorType === type.id ? "text-primary" : "text-outline group-hover:text-on-surface-variant"
                  )}>{type.name}</span>
                </button>
              ))}
            </div>

            {/* Palette */}
            <div className="grid grid-cols-6 gap-3 mb-8">
              {COLOR_THEMES.slice(0, 11).map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => updateDesign({ colorThemeId: theme.id })}
                  className={cn(
                    "w-10 h-10 rounded-full border-2 transition-all relative",
                    design.colorThemeId === theme.id 
                      ? "border-primary scale-110 shadow-md ring-2 ring-primary/20" 
                      : "border-transparent hover:scale-105"
                  )}
                  style={{ backgroundColor: theme.accentColor }}
                >
                  {design.colorThemeId === theme.id && <Check className="absolute inset-0 m-auto w-5 h-5 text-white drop-shadow-md" />}
                </button>
              ))}
              <button className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-500 via-green-500 to-blue-500 animate-spin-slow hover:scale-110 transition-all border-2 border-white shadow-sm" />
            </div>

            {/* Apply Accent Color Checkboxes */}
            <div className="space-y-4 px-2">
              <h4 className="text-[11px] font-black uppercase tracking-[0.15em] text-on-surface mb-4">Apply accent color</h4>
              <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                {[
                  { key: 'name', label: 'Name' },
                  { key: 'dotsBarsBubbles', label: 'Dots/Bars/Bubbles' },
                  { key: 'jobTitle', label: 'Job title' },
                  { key: 'dates', label: 'Dates' },
                  { key: 'headings', label: 'Headings' },
                  { key: 'entrySubtitle', label: 'Entry subtitle' },
                  { key: 'headerIcons', label: 'Header icons' },
                  { key: 'linkIcons', label: 'Link icons' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      updateDesign({
                        applyAccentTo: {
                          ...design.applyAccentTo,
                          [item.key]: !design.applyAccentTo[item.key as keyof typeof design.applyAccentTo]
                        }
                      })
                    }}
                    className="flex items-center gap-3 group text-left"
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                      design.applyAccentTo[item.key as keyof typeof design.applyAccentTo]
                        ? "bg-primary border-primary text-white"
                        : "border-outline-variant group-hover:border-primary"
                    )}>
                      {design.applyAccentTo[item.key as keyof typeof design.applyAccentTo] && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className={cn(
                      "text-[11px] font-medium transition-all",
                      design.applyAccentTo[item.key as keyof typeof design.applyAccentTo] ? "text-on-surface font-bold" : "text-outline group-hover:text-on-surface-variant"
                    )}>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
