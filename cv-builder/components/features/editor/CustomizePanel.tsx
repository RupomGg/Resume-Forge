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
  FileText,
  LayoutGrid,
  AlignCenter,
  AlignJustify,
  Mail,
  User,
  Hash,
  ChevronDown,
  Heading1,
  CaseUpper,
  CaseSensitive,
  Type as TypeIcon,
  Zap,
  Award,
  Info,
  Layers,
  Table,
  Settings,
  Shuffle,
  Group,
  Wrench
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

function SkillLevelBanner() {
  const { skills } = useCVStore()
  const hasLevels = skills.categories.some(cat => 
    (cat.level && cat.level !== 'none') || (cat.items && cat.items.some(item => item.level && item.level !== 'none'))
  )

  if (hasLevels) return null

  return (
    <div id="skillslevelmsg" className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100 animate-in fade-in zoom-in duration-300">
      <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
      <div className="flex flex-col gap-1">
        <p className="text-[11px] font-bold text-blue-900">No levels selected yet</p>
        <p className="text-[10px] font-medium text-blue-700/80 leading-relaxed">
          None of your skills have a proficiency level. Add a level to a skill to make this style visible on your resume.
        </p>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

type CustomizeView = 'main' | 'language' | 'order' | 'spacing' | 'theme-appearance' | 'content-layout' | 'content-entry-layout' | 'footer' | 'headings' | 'header' | 'behavior-display'

export default function CustomizePanel() {
  const { design, updateDesign, sectionOrder, reorderSections } = useCVStore()
  const [activeView, setActiveView] = useState<CustomizeView>('main')
  const [isMounted, setIsMounted] = useState(false)
  const [showAdvancedFooter, setShowAdvancedFooter] = useState(false)
  const [activeFooterField, setActiveFooterField] = useState<'left' | 'center' | 'right'>('left')

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
              onClick={() => setActiveView('theme-appearance')}
              className="flex items-center justify-between p-4 rounded-2xl border border-outline-variant/30 hover:border-primary/40 hover:bg-primary/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-outline group-hover:text-primary group-hover:bg-primary/10 transition-all">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold font-manrope">Theme & Appearance</span>
                  <span className="text-[10px] text-outline">Layout, fonts & color palette</span>
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

            <button
              onClick={() => setActiveView('content-layout')}
              className="flex items-center justify-between p-4 rounded-2xl border border-outline-variant/30 hover:border-primary/40 hover:bg-primary/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-outline group-hover:text-primary group-hover:bg-primary/10 transition-all">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold font-manrope">Content Layout</span>
                  <span className="text-[10px] text-outline">Section & entry styles</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-outline group-hover:text-primary transition-all" />
            </button>

            <button
              onClick={() => setActiveView('header')}
              className="flex items-center justify-between p-4 rounded-2xl border border-outline-variant/30 hover:border-primary/40 hover:bg-primary/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-outline group-hover:text-primary group-hover:bg-primary/10 transition-all">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold font-manrope">Header Styling</span>
                  <span className="text-[10px] text-outline">Layout, photo & info arrangement</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-outline group-hover:text-primary transition-all" />
            </button>

            <button
              onClick={() => setActiveView('headings')}
              className="flex items-center justify-between p-4 rounded-2xl border border-outline-variant/30 hover:border-primary/40 hover:bg-primary/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-outline group-hover:text-primary group-hover:bg-primary/10 transition-all">
                  <Heading1 className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold font-manrope">Section Headings</span>
                  <span className="text-[10px] text-outline">Styles, capitalization & icons</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-outline group-hover:text-primary transition-all" />
            </button>

            <button
              onClick={() => setActiveView('footer')}
              className="flex items-center justify-between p-4 rounded-2xl border border-outline-variant/30 hover:border-primary/40 hover:bg-primary/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-outline group-hover:text-primary group-hover:bg-primary/10 transition-all">
                  <AlignJustify className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold font-manrope">Footer Settings</span>
                  <span className="text-[10px] text-outline">Page numbers & custom text</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-outline group-hover:text-primary transition-all" />
            </button>

            <button
              onClick={() => setActiveView('behavior-display')}
              className="flex items-center justify-between p-4 rounded-2xl border border-outline-variant/30 hover:border-primary/40 hover:bg-primary/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-outline group-hover:text-primary group-hover:bg-primary/10 transition-all">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold font-manrope">Behavior & Display</span>
                  <span className="text-[10px] text-outline">Skills, ordering & visibility</span>
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

        {/* ─── THEME & APPEARANCE VIEW ──────────────────────────────────── */}
        {activeView === 'theme-appearance' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {renderHeader('Theme & Appearance')}
            
            <div className="space-y-12 pb-20">
              {/* SECTION 1: PAGE STRUCTURE */}
              <div className="space-y-6">
                <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                  <Square className="w-3 h-3" />
                  Page Structure
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'one-column', name: 'Standard', icon: Square },
                    { id: 'sidebar-left', name: 'Sidebar L', icon: AlignLeft },
                    { id: 'sidebar-right', name: 'Sidebar R', icon: AlignRight },
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
                      <span className="text-[9px] font-black uppercase tracking-tight text-center px-1 leading-none">{l.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION 2: COLOR SYSTEM */}
              <div className="space-y-8 pt-8 border-t border-outline-variant/10">
                <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-red-500 to-blue-500" />
                  Color System
                </label>

                {/* Color Mode Tabs */}
                <div className="flex items-center gap-6 px-2 overflow-x-auto pb-2 scrollbar-hide">
                  {[
                    { id: 'basic', name: 'Basic' },
                    { id: 'advanced', name: 'Advanced' },
                    { id: 'border', name: 'Border' },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => updateDesign({ colorMode: mode.id as ColorMode })}
                      className="flex flex-col items-center gap-2 group flex-shrink-0"
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
                <div className="flex items-center gap-6 px-2 overflow-x-auto pb-2 scrollbar-hide">
                  {[
                    { id: 'accent', name: 'Accent', icon: Check },
                    { id: 'multi', name: 'Multi', icon: Type },
                    { id: 'image', name: 'Image', icon: FileText },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => updateDesign({ colorType: type.id as ColorType })}
                      className="flex flex-col items-center gap-2 group flex-shrink-0"
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

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-outline">Theme Palette</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-outline uppercase">Custom</span>
                      <div className="relative w-6 h-6 rounded-full border border-outline-variant/30 overflow-hidden shadow-inner">
                        <input 
                          type="color" 
                          value={design.customAccentColor || '#000000'}
                          onChange={(e) => updateDesign({ customAccentColor: e.target.value, colorThemeId: 'custom' })}
                          className="absolute inset-0 w-[150%] h-[150%] -translate-x-[25%] -translate-y-[25%] cursor-pointer border-none p-0 bg-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-6 gap-3">
                    {COLOR_THEMES.slice(0, 11).map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => updateDesign({ colorThemeId: theme.id, customAccentColor: undefined })}
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
                    <button 
                      onClick={() => {
                        // If clicking the rainbow button, set to custom but keep existing custom color or default
                        updateDesign({ colorThemeId: 'custom' });
                      }}
                      className={cn(
                        "w-10 h-10 rounded-full bg-gradient-to-tr from-red-500 via-green-500 to-blue-500 animate-spin-slow hover:scale-110 transition-all border-2 shadow-sm relative",
                        design.colorThemeId === 'custom' ? "border-primary scale-110 ring-2 ring-primary/20" : "border-white"
                      )}
                    >
                      {design.colorThemeId === 'custom' && <Check className="absolute inset-0 m-auto w-5 h-5 text-white drop-shadow-md" />}
                    </button>
                  </div>
                </div>

                {/* Apply Accent Color Checkboxes */}
                <div className="bg-surface-container/30 rounded-2xl p-5 space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-outline">Apply Accent Color To</h4>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                    {[
                      { key: 'name', label: 'Name' },
                      { key: 'dotsBarsBubbles', label: 'Visual Elements' },
                      { key: 'jobTitle', label: 'Job Title' },
                      { key: 'dates', label: 'Dates' },
                      { key: 'headings', label: 'Headings' },
                      { key: 'entrySubtitle', label: 'Subtitles' },
                      { key: 'headerIcons', label: 'Header Icons' },
                      { key: 'linkIcons', label: 'Link Icons' },
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
                          "w-4 h-4 rounded-md border flex items-center justify-center transition-all",
                          design.applyAccentTo[item.key as keyof typeof design.applyAccentTo] 
                            ? "bg-primary border-primary text-white" 
                            : "border-outline-variant group-hover:border-primary"
                        )}>
                          {design.applyAccentTo[item.key as keyof typeof design.applyAccentTo] && <Check className="w-3 h-3" />}
                        </div>
                        <span className={cn(
                          "text-[11px] font-medium transition-colors",
                          design.applyAccentTo[item.key as keyof typeof design.applyAccentTo] ? "text-on-surface font-bold" : "text-outline group-hover:text-on-surface"
                        )}>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 3: TYPOGRAPHY */}
              <div className="space-y-8 pt-8 border-t border-outline-variant/10">
                <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                  <TypeIcon className="w-3 h-3" />
                  Typography Library
                </label>

                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'recommended', name: 'Recs', label: '★' },
                    { id: 'serif', name: 'Serif', label: 'Aa' },
                    { id: 'sans-serif', name: 'Sans', label: 'Aa' },
                    { id: 'monospace', name: 'Mono', label: 'Aa' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => updateDesign({ fontCategory: cat.id as FontCategory })}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all group",
                        design.fontCategory === cat.id 
                          ? "border-primary bg-primary/5 text-primary shadow-lg" 
                          : "border-outline-variant/30 text-outline hover:border-outline-variant"
                      )}
                    >
                      <span className={cn(
                        "text-xl mb-1 transition-all",
                        cat.id === 'recommended' ? 'text-amber-500' : cat.id === 'serif' ? 'font-serif' : cat.id === 'monospace' ? 'font-mono' : 'font-sans',
                        design.fontCategory === cat.id ? "scale-110" : ""
                      )}>{cat.label}</span>
                      <span className="text-[9px] font-bold uppercase tracking-tight">{cat.name}</span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {FONTS.filter(f => design.fontCategory === 'recommended' ? f.isRecommended : f.category === design.fontCategory).map((font) => (
                    <button
                      key={font.id}
                      onClick={() => updateDesign({ fontId: font.id })}
                      className={cn(
                        "px-4 py-3 rounded-xl border text-sm font-medium transition-all text-center relative overflow-hidden",
                        design.fontId === font.id 
                          ? "bg-primary text-surface border-primary shadow-md" 
                          : "bg-surface border-outline-variant/30 text-on-surface-variant hover:border-outline-variant"
                      )}
                      style={{ fontFamily: font.googleFamily }}
                    >
                      {font.name}
                      {font.isRecommended && design.fontCategory !== 'recommended' && (
                        <div className="absolute top-0 right-0 w-6 h-6 bg-amber-500 text-white flex items-center justify-center translate-x-1/2 -translate-y-1/2 rotate-45 shadow-sm">
                          <span className="text-[8px] -rotate-45 mb-1.5 ml-1.5">★</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
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

        {/* ─── CONTENT LAYOUT VIEW ────────────────────────────────────────── */}
        {activeView === 'content-layout' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {renderHeader('Content Layout')}
            
            <div className="space-y-8">
              {/* Layout Variation */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-bold text-outline uppercase tracking-widest">
                  <LayoutIcon className="w-3.5 h-3.5" />
                  Layout Variation
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'classic', name: 'Classic' },
                    { id: 'modern', name: 'Modern' },
                    { id: 'minimal', name: 'Minimal' },
                    { id: 'compact', name: 'Compact' },
                  ].map((v) => (
                    <button
                      key={v.id}
                      onClick={() => updateDesign({ layoutVariation: v.id })}
                      className={cn(
                        "py-3 rounded-xl border-2 text-[11px] font-black uppercase tracking-widest transition-all",
                        design.layoutVariation === v.id 
                          ? "border-primary bg-primary/5 text-primary shadow-md" 
                          : "border-outline-variant/30 text-outline hover:border-outline-variant"
                      )}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Entry Layout Grid */}
              <div className="space-y-4 pt-4 border-t border-outline-variant/30">
                <label className="flex items-center gap-2 text-xs font-bold text-outline uppercase tracking-widest">
                  <LayoutGrid className="w-3.5 h-3.5" />
                  Entry Structure
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { 
                      id: 'layout-1', 
                      name: 'Balanced', 
                      icon: (active: boolean) => (
                        <div className="flex flex-col gap-1 w-full">
                          <div className="flex justify-between items-center gap-1.5">
                            <div className={`h-1 w-2/3 rounded-full ${active ? 'bg-primary' : 'bg-outline-variant'}`} />
                            <div className={`h-1 w-1/4 rounded-full ${active ? 'bg-blue-400' : 'bg-outline-variant/50'}`} />
                          </div>
                          <div className="flex justify-between items-center gap-1.5">
                            <div className={`h-0.5 w-1/2 rounded-full ${active ? 'bg-primary/60' : 'bg-outline-variant/30'}`} />
                            <div className={`h-0.5 w-1/5 rounded-full ${active ? 'bg-blue-300' : 'bg-outline-variant/20'}`} />
                          </div>
                        </div>
                      )
                    },
                    { 
                      id: 'layout-2', 
                      name: 'Metadata', 
                      icon: (active: boolean) => (
                        <div className="flex gap-2 w-full">
                          <div className="w-1/4 flex flex-col gap-1">
                            <div className={`h-1 w-full rounded-full ${active ? 'bg-blue-400' : 'bg-outline-variant/50'}`} />
                            <div className={`h-0.5 w-2/3 rounded-full ${active ? 'bg-blue-300' : 'bg-outline-variant/20'}`} />
                          </div>
                          <div className="flex-1 flex flex-col gap-1">
                            <div className={`h-1 w-full rounded-full ${active ? 'bg-primary' : 'bg-outline-variant'}`} />
                            <div className={`h-0.5 w-3/4 rounded-full ${active ? 'bg-primary/60' : 'bg-outline-variant/30'}`} />
                          </div>
                        </div>
                      )
                    },
                    { 
                      id: 'layout-3', 
                      name: 'Modern Split', 
                      icon: (active: boolean) => (
                        <div className="flex justify-between items-start w-full gap-1.5">
                          <div className={`h-1 w-[20%] rounded-full ${active ? 'bg-blue-400' : 'bg-outline-variant/50'}`} />
                          <div className="flex-1 flex flex-col gap-1">
                            <div className={`h-1 w-[60%] rounded-full ${active ? 'bg-primary' : 'bg-outline-variant'}`} />
                            <div className={`h-0.5 w-[40%] rounded-full ${active ? 'bg-primary/60' : 'bg-outline-variant/30'}`} />
                          </div>
                          <div className={`h-1 w-[20%] rounded-full ${active ? 'bg-blue-400' : 'bg-outline-variant/50'}`} />
                        </div>
                      )
                    },
                    { 
                      id: 'layout-4', 
                      name: 'Standard', 
                      icon: (active: boolean) => (
                        <div className="flex flex-col gap-1 w-full">
                          <div className="flex justify-between items-center gap-1.5">
                            <div className={`h-1 w-1/2 rounded-full ${active ? 'bg-primary' : 'bg-outline-variant'}`} />
                            <div className={`h-1 w-1/4 rounded-full ${active ? 'bg-blue-400' : 'bg-outline-variant/50'}`} />
                          </div>
                          <div className="flex justify-between items-center gap-1.5">
                            <div className={`h-0.5 w-1/3 rounded-full ${active ? 'bg-primary/60' : 'bg-outline-variant/30'}`} />
                            <div className={`h-0.5 w-1/3 rounded-full ${active ? 'bg-blue-300' : 'bg-outline-variant/20'}`} />
                          </div>
                          <div className={`h-0.5 w-full rounded-full ${active ? 'bg-primary/20' : 'bg-outline-variant/10'} mt-0.5`} />
                        </div>
                      )
                    },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => updateDesign({ entryLayoutId: opt.id })}
                      className={cn(
                        "flex flex-col p-2 rounded-xl border-2 transition-all text-center gap-1.5 group relative",
                        design.entryLayoutId === opt.id 
                          ? "border-primary bg-primary/5" 
                          : "border-outline-variant/20 hover:border-outline-variant bg-white"
                      )}
                    >
                      <div className={cn(
                        "w-full h-12 rounded-lg flex items-center justify-center px-3 border transition-all",
                        design.entryLayoutId === opt.id ? "bg-white border-primary/20" : "bg-surface-container border-transparent"
                      )}>
                        {opt.icon(design.entryLayoutId === opt.id)}
                      </div>
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider",
                        design.entryLayoutId === opt.id ? "text-primary" : "text-outline"
                      )}>
                        {opt.name}
                      </span>
                      {design.entryLayoutId === opt.id && (
                        <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center text-white">
                          <Check className="w-2 h-2" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & Subtitle Sizing */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-outline uppercase tracking-widest">Title Size</span>
                    <span className="text-[10px] font-black text-primary">{design.titleSize}pt</span>
                  </div>
                  <input
                    type="range" min="8" max="18" step="0.5"
                    value={design.titleSize}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      const ratio = design.subtitleSize / design.titleSize;
                      updateDesign({ 
                        titleSize: val,
                        subtitleSize: Math.round(val * ratio * 2) / 2
                      });
                    }}
                    className="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-outline uppercase tracking-widest">Subtitle Size</span>
                    <span className="text-[10px] font-black text-primary">{design.subtitleSize}pt</span>
                  </div>
                  <input
                    type="range" min="7" max="14" step="0.5"
                    value={design.subtitleSize}
                    onChange={(e) => updateDesign({ subtitleSize: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>

              {/* Subtitle Style */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-bold text-outline uppercase tracking-widest">
                  <Type className="w-3.5 h-3.5" />
                  Subtitle Style
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'normal', name: 'N' },
                    { id: 'italic', name: 'I', className: 'italic' },
                    { id: 'bold', name: 'B', className: 'font-bold' },
                    { id: 'bold-italic', name: 'BI', className: 'font-bold italic' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => updateDesign({ subtitleStyle: s.id as any })}
                      className={cn(
                        "h-10 rounded-lg border-2 text-sm transition-all",
                        design.subtitleStyle === s.id 
                          ? "border-primary bg-primary/5 text-primary shadow-sm" 
                          : "border-outline-variant/30 text-outline hover:border-outline-variant",
                        s.className
                      )}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subtitle Placement */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-bold text-outline uppercase tracking-widest">
                  Subtitle Placement
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'below-title', name: 'Below' },
                    { id: 'beside-title', name: 'Beside' },
                    { id: 'right-aligned', name: 'Right' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => updateDesign({ subtitlePlacement: p.id as any })}
                      className={cn(
                        "py-2 rounded-full border-2 text-[10px] font-bold uppercase tracking-wider transition-all",
                        design.subtitlePlacement === p.id 
                          ? "border-primary bg-primary text-white shadow-md" 
                          : "border-outline-variant/30 text-outline hover:border-outline-variant"
                      )}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description Indentation */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-outline uppercase tracking-widest">Description Indentation</span>
                  <span className="text-xs font-black text-primary bg-primary/5 px-2 py-1 rounded-lg">{design.descriptionIndentation}px</span>
                </div>
                <input
                  type="range" min="0" max="4" step="1"
                  value={design.descriptionIndentation}
                  onChange={(e) => updateDesign({ descriptionIndentation: parseInt(e.target.value) })}
                  className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* List Style */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-bold text-outline uppercase tracking-widest">
                  <ListOrdered className="w-3.5 h-3.5" />
                  Bullet/List Style
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'none', name: 'None' },
                    { id: 'bullet', name: '•' },
                    { id: 'dash', name: '-' },
                    { id: 'check', name: '✓' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => updateDesign({ listStyle: s.id as any })}
                      className={cn(
                        "h-10 rounded-lg border-2 text-sm font-bold transition-all",
                        design.listStyle === s.id 
                          ? "border-primary bg-primary/5 text-primary shadow-sm" 
                          : "border-outline-variant/30 text-outline hover:border-outline-variant"
                      )}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* ─── FOOTER SETTINGS VIEW ────────────────────────────────────────── */}
        {activeView === 'footer' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {renderHeader('Footer Settings')}

            <div className="space-y-8">
              {/* Quick Toggles */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-bold text-outline uppercase tracking-widest">
                  Quick Toggles
                </label>
                <div className="space-y-3">
                  {[
                    { key: 'showPageNumbers', label: 'Page Numbers', icon: Hash },
                    { key: 'showEmail', label: 'Email Address', icon: Mail },
                    { key: 'showName', label: 'My Full Name', icon: User },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => updateDesign({ 
                        footer: { ...design.footer, [item.key]: !design.footer[item.key as keyof typeof design.footer] } 
                      })}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all",
                        design.footer[item.key as keyof typeof design.footer] 
                          ? "border-primary bg-primary/5 text-primary" 
                          : "border-outline-variant/30 text-outline hover:border-outline-variant"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-4 h-4" />
                        <span className="text-sm font-bold">{item.label}</span>
                      </div>
                      <div className={cn(
                        "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                        design.footer[item.key as keyof typeof design.footer] ? "bg-primary border-primary" : "border-outline-variant/50"
                      )}>
                        {design.footer[item.key as keyof typeof design.footer] && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Settings Toggle */}
              <div className="pt-4 border-t border-outline-variant/30">
                <button
                  onClick={() => setShowAdvancedFooter(!showAdvancedFooter)}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-surface-container transition-all"
                >
                  <span className="text-xs font-bold text-outline uppercase tracking-widest">Advanced Settings</span>
                  <ChevronDown className={cn("w-4 h-4 text-outline transition-transform duration-300", showAdvancedFooter && "rotate-180")} />
                </button>

                {showAdvancedFooter && (
                  <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    {/* Custom Footer Toggle */}
                    <div className="flex items-center justify-between p-4 bg-surface-container rounded-2xl">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold font-manrope">Custom Footer</span>
                        <span className="text-[10px] text-outline">Override automatic content</span>
                      </div>
                      <button
                        onClick={() => updateDesign({ 
                          footer: { ...design.footer, useCustomFooter: !design.footer.useCustomFooter } 
                        })}
                        className={cn(
                          "w-12 h-6 rounded-full p-1 transition-all duration-300",
                          design.footer.useCustomFooter ? "bg-primary" : "bg-outline-variant/50"
                        )}
                      >
                        <div className={cn(
                          "w-4 h-4 bg-white rounded-full transition-all duration-300 transform",
                          design.footer.useCustomFooter ? "translate-x-6" : "translate-x-0"
                        )} />
                      </button>
                    </div>

                    {design.footer.useCustomFooter && (
                      <div className="space-y-6 animate-in zoom-in-95 duration-200">
                        {/* Placeholder Chips */}
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold text-outline uppercase tracking-widest">Placeholder Insert</label>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { label: 'Name', code: '{{name}}' },
                              { label: 'Phone', code: '{{phone}}' },
                              { label: 'Email', code: '{{email}}' },
                              { label: 'Page #', code: '{{page}} / {{pages}}' },
                            ].map((p) => (
                              <button
                                key={p.code}
                                onClick={() => {
                                  const fieldKey = `${activeFooterField}Column` as keyof typeof design.footer
                                  const currentVal = design.footer[fieldKey] as string
                                  updateDesign({
                                    footer: { ...design.footer, [fieldKey]: currentVal + p.code }
                                  })
                                }}
                                className="px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant/30 text-[10px] font-bold text-on-surface hover:border-primary hover:text-primary transition-all"
                              >
                                {p.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Column Editors */}
                        <div className="space-y-4">
                          {[
                            { id: 'left', label: 'Left Column' },
                            { id: 'center', label: 'Center Column' },
                            { id: 'right', label: 'Right Column' },
                          ].map((col) => (
                            <div key={col.id} className="space-y-2">
                              <label className="text-[10px] font-bold text-outline uppercase tracking-widest px-1">{col.label}</label>
                              <textarea
                                value={design.footer[`${col.id}Column` as keyof typeof design.footer] as string}
                                onFocus={() => setActiveFooterField(col.id as any)}
                                onChange={(e) => updateDesign({
                                  footer: { ...design.footer, [`${col.id}Column`]: e.target.value }
                                })}
                                className={cn(
                                  "w-full h-20 p-3 rounded-xl bg-surface border-2 transition-all text-xs resize-none outline-none",
                                  activeFooterField === col.id ? "border-primary shadow-sm" : "border-outline-variant/30"
                                )}
                                placeholder={`Enter ${col.label.toLowerCase()} text...`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── SECTION HEADINGS VIEW ────────────────────────────────────── */}
        {activeView === 'headings' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {renderHeader('Section Headings')}

            <div className="space-y-8">
              {/* Style Presets */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-bold text-outline uppercase tracking-widest">
                  Heading Style
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'simple', name: 'Simple Line', 
                      icon: (active: boolean) => (
                        <div className="flex flex-col gap-1 w-full px-2">
                          <div className={`h-1.5 w-1/2 rounded-full ${active ? 'bg-primary' : 'bg-outline-variant'}`} />
                          <div className={`h-[1px] w-full ${active ? 'bg-primary/30' : 'bg-outline-variant/20'}`} />
                        </div>
                      )
                    },
                    { id: 'boxed', name: 'Boxed', 
                      icon: (active: boolean) => (
                        <div className={`h-6 w-full flex items-center justify-center ${active ? 'bg-primary/10' : 'bg-surface-container'}`}>
                          <div className={`h-1.5 w-1/2 rounded-full ${active ? 'bg-primary' : 'bg-outline-variant/50'}`} />
                        </div>
                      )
                    },
                    { id: 'underlined', name: 'Underlined', 
                      icon: (active: boolean) => (
                        <div className="flex flex-col gap-0.5 w-full px-2">
                          <div className={`h-2 w-2/3 rounded-full ${active ? 'bg-primary' : 'bg-outline-variant'}`} />
                          <div className={`h-1 w-2/3 rounded-full ${active ? 'bg-primary' : 'bg-outline-variant'}`} />
                        </div>
                      )
                    },
                    { id: 'side-line', name: 'Side Line', 
                      icon: (active: boolean) => (
                        <div className="flex items-center gap-2 w-full px-2">
                          <div className={`w-1 h-5 rounded-full ${active ? 'bg-primary' : 'bg-outline-variant'}`} />
                          <div className={`h-1.5 w-1/2 rounded-full ${active ? 'bg-primary' : 'bg-outline-variant'}`} />
                        </div>
                      )
                    },
                    { id: 'minimal', name: 'Minimal', 
                      icon: (active: boolean) => (
                        <div className="flex flex-col gap-1 w-full px-2">
                          <div className={`h-2 w-1/2 rounded-full ${active ? 'bg-primary' : 'bg-outline-variant'}`} />
                        </div>
                      )
                    },
                    { id: 'zigzag', name: 'Zigzag', 
                      icon: (active: boolean) => (
                        <div className="flex flex-col gap-1 w-full px-2">
                          <div className={`h-1.5 w-1/2 rounded-full ${active ? 'bg-primary' : 'bg-outline-variant'}`} />
                          <svg className={`w-full h-1 ${active ? 'text-primary/40' : 'text-outline-variant/30'}`} viewBox="0 0 100 10" preserveAspectRatio="none">
                            <path d="M0 5 L5 0 L10 5 L15 0 L20 5 L25 0 L30 5 L35 0 L40 5 L45 0 L50 5 L55 0 L60 5 L65 0 L70 5 L75 0 L80 5 L85 0 L90 5 L95 0 L100 5" fill="none" stroke="currentColor" strokeWidth="2" />
                          </svg>
                        </div>
                      )
                    },
                    { id: 'decorative', name: 'Decorative', 
                      icon: (active: boolean) => (
                        <div className="flex items-center gap-2 w-full px-2">
                          <div className={`h-1.5 w-1/3 rounded-full ${active ? 'bg-primary' : 'bg-outline-variant'}`} />
                          <div className={`flex-1 h-[1px] ${active ? 'bg-primary/20' : 'bg-outline-variant/20'}`} />
                          <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-primary/40' : 'bg-outline-variant/40'}`} />
                        </div>
                      )
                    },
                    { id: 'double-line', name: 'Double Line', 
                      icon: (active: boolean) => (
                        <div className="flex flex-col gap-1 w-full px-2">
                          <div className={`h-1.5 w-1/2 rounded-full ${active ? 'bg-primary' : 'bg-outline-variant'}`} />
                          <div className="space-y-[1px] w-full">
                            <div className={`h-[1.5px] w-full ${active ? 'bg-primary' : 'bg-outline-variant'}`} />
                            <div className={`h-[0.5px] w-full ${active ? 'bg-primary/40' : 'bg-outline-variant/40'}`} />
                          </div>
                        </div>
                      )
                    },
                    { id: 'pill', name: 'Pill', 
                      icon: (active: boolean) => (
                        <div className={`h-6 px-3 rounded-full flex items-center ${active ? 'bg-primary/10' : 'bg-surface-container'}`}>
                          <div className={`h-1.5 w-1/2 rounded-full ${active ? 'bg-primary' : 'bg-outline-variant/50'}`} />
                        </div>
                      )
                    },
                    { id: 'modern-split', name: 'Modern Split', 
                      icon: (active: boolean) => (
                        <div className="flex items-center gap-2 w-full px-2">
                          <div className={`w-1 h-5 rounded-sm ${active ? 'bg-primary' : 'bg-outline-variant'}`} />
                          <div className={`h-1.5 w-1/3 rounded-full ${active ? 'bg-primary' : 'bg-outline-variant'}`} />
                          <div className={`flex-1 h-[1px] ${active ? 'bg-primary/20' : 'bg-outline-variant/20'}`} />
                        </div>
                      )
                    },
                    { id: 'bracket', name: 'Bracket', 
                      icon: (active: boolean) => (
                        <div className="flex items-center gap-1.5 w-full px-2 justify-center">
                          <span className={`text-lg font-light ${active ? 'text-primary/40' : 'text-outline-variant/40'}`}>[</span>
                          <div className={`h-1.5 w-1/3 rounded-full ${active ? 'bg-primary' : 'bg-outline-variant/50'}`} />
                          <span className={`text-lg font-light ${active ? 'text-primary/40' : 'text-outline-variant/40'}`}>]</span>
                        </div>
                      )
                    },
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={() => updateDesign({ headingStyle: style.id as any })}
                      className={cn(
                        "flex flex-col p-3 rounded-xl border-2 transition-all text-center gap-3 group relative",
                        design.headingStyle === style.id 
                          ? "border-primary bg-primary/5" 
                          : "border-outline-variant/20 hover:border-outline-variant bg-white"
                      )}
                    >
                      <div className={cn(
                        "w-full h-12 rounded-lg flex items-center justify-center border transition-all",
                        design.headingStyle === style.id ? "bg-white border-primary/20 shadow-sm" : "bg-surface-container border-transparent"
                      )}>
                        {style.icon(design.headingStyle === style.id)}
                      </div>
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider",
                        design.headingStyle === style.id ? "text-primary" : "text-outline"
                      )}>
                        {style.name}
                      </span>
                      {design.headingStyle === style.id && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center text-white">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Capitalization */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-bold text-outline uppercase tracking-widest">
                  <CaseUpper className="w-3.5 h-3.5" />
                  Capitalization
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'capitalize', name: 'Capitalize', icon: CaseSensitive },
                    { id: 'uppercase', name: 'Uppercase', icon: CaseUpper },
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => updateDesign({ headingCase: c.id as any })}
                      className={cn(
                        "flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-bold text-xs",
                        design.headingCase === c.id 
                          ? "border-primary bg-primary/5 text-primary shadow-sm" 
                          : "border-outline-variant/30 text-outline hover:border-outline-variant"
                      )}
                    >
                      <c.icon className="w-4 h-4" />
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Heading Size */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="flex items-center gap-2 text-xs font-bold text-outline uppercase tracking-widest">
                    <TypeIcon className="w-3.5 h-3.5" />
                    Heading Size
                  </label>
                  <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-1 rounded-lg">{design.headingSize}pt</span>
                </div>
                <input
                  type="range" min="8" max="18" step="0.5"
                  value={design.headingSize}
                  onChange={(e) => updateDesign({ headingSize: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Icon Style */}
              <div className="pt-4 border-t border-outline-variant/30">
                <button
                  onClick={() => updateDesign({ showHeadingIcons: !design.showHeadingIcons })}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all",
                    design.showHeadingIcons 
                      ? "border-primary bg-primary/5 text-primary shadow-sm" 
                      : "border-outline-variant/30 text-outline hover:border-outline-variant"
                  )}
                >
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-bold font-manrope">Section Icons</span>
                    <span className="text-[10px] text-outline">Show icons next to headings</span>
                  </div>
                  <div className={cn(
                    "w-12 h-6 rounded-full p-1 transition-all duration-300",
                    design.showHeadingIcons ? "bg-primary" : "bg-outline-variant/50"
                  )}>
                    <div className={cn(
                      "w-4 h-4 bg-white rounded-full transition-all duration-300 transform",
                      design.showHeadingIcons ? "translate-x-6" : "translate-x-0"
                    )} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── HEADER STYLING VIEW ────────────────────────────────────────── */}
        {activeView === 'header' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {renderHeader('Header Styling')}
            
            <div className="space-y-8 pb-12">
              {/* 1. Header Layout */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-outline uppercase tracking-widest px-1">Text Alignment</label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'left', name: 'Left', icon: AlignLeft },
                    { id: 'center', name: 'Center', icon: AlignCenter },
                  ].map((align) => (
                    <button
                      key={align.id}
                      onClick={() => updateDesign({ headerAlignment: align.id as any })}
                      className={cn(
                        "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all group",
                        design.headerAlignment === align.id 
                          ? "border-primary bg-primary/5 text-primary shadow-sm" 
                          : "border-outline-variant/30 text-outline hover:border-outline-variant hover:bg-surface-container"
                      )}
                    >
                      <div className={cn(
                        "w-full h-12 rounded-xl flex flex-col gap-1.5 justify-center p-3 border transition-all",
                        design.headerAlignment === align.id ? "bg-white border-primary/20 shadow-inner" : "bg-surface-container border-transparent"
                      )}>
                        <div className={cn("h-1.5 w-2/3 rounded-full", design.headerAlignment === align.id ? "bg-blue-400" : "bg-outline-variant/50", align.id === 'center' && "mx-auto")} />
                        <div className={cn("h-1 w-1/2 rounded-full", design.headerAlignment === align.id ? "bg-blue-300" : "bg-outline-variant/30", align.id === 'center' && "mx-auto")} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest">{align.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Details Arrangement */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-outline uppercase tracking-widest px-1">Details Arrangement</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'stacked', name: 'Stacked Lines' },
                    { id: 'brick', name: 'Brick Layout' },
                    { id: 'columns', name: 'Double Columns' },
                    { id: 'icon', name: 'Icon' },
                    { id: 'bullet', name: 'Bullet' },
                    { id: 'bar', name: 'Bar' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => updateDesign({ detailsArrangement: opt.id as any })}
                      className={cn(
                        "px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider border-2 transition-all",
                        design.detailsArrangement === opt.id
                          ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
                          : "bg-surface border-outline-variant/30 text-outline hover:border-outline-variant"
                      )}
                    >
                      {opt.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Name Styling */}
              <div className="space-y-6 pt-6 border-t border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-outline uppercase tracking-widest">Name Styling</label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={design.nameBold}
                      onChange={(e) => updateDesign({ nameBold: e.target.checked })}
                      className="hidden"
                    />
                    <div className={cn(
                      "w-4 h-4 rounded border-2 transition-all flex items-center justify-center",
                      design.nameBold ? "bg-primary border-primary" : "border-outline-variant group-hover:border-primary"
                    )}>
                      {design.nameBold && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-[10px] font-bold text-outline group-hover:text-primary transition-colors">NAME BOLD</span>
                  </label>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-outline uppercase tracking-[0.2em]">Name Size</span>
                  <div className="flex gap-2">
                    {['xs', 's', 'm', 'l', 'xl'].map((s) => (
                      <button
                        key={s}
                        onClick={() => updateDesign({ nameSize: s as any })}
                        className={cn(
                          "w-10 h-10 rounded-xl border-2 flex items-center justify-center text-[10px] font-black uppercase transition-all",
                          design.nameSize === s
                            ? "border-primary bg-primary/5 text-primary shadow-sm"
                            : "border-outline-variant/30 text-outline hover:border-outline-variant"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'body', name: 'Body Font' },
                    { id: 'creative', name: 'Creative' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => updateDesign({ nameFontFamily: f.id as any })}
                      className={cn(
                        "py-3 rounded-xl border-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                        design.nameFontFamily === f.id
                          ? "border-primary bg-primary text-white shadow-lg shadow-primary/20"
                          : "border-outline-variant/30 text-outline hover:border-outline-variant"
                      )}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Professional Title */}
              <div className="space-y-6 pt-6 border-t border-outline-variant/20">
                <label className="text-xs font-bold text-outline uppercase tracking-widest">Professional Title</label>
                
                <div className="space-y-3">
                   <span className="text-[10px] font-bold text-outline uppercase tracking-[0.2em]">Title Size</span>
                   <div className="flex gap-2">
                    {['s', 'm', 'l'].map((s) => (
                      <button
                        key={s}
                        onClick={() => updateDesign({ titleSizeScale: s as any })}
                        className={cn(
                          "w-10 h-10 rounded-xl border-2 flex items-center justify-center text-[10px] font-black uppercase transition-all",
                          design.titleSizeScale === s
                            ? "border-primary bg-primary/5 text-primary shadow-sm"
                            : "border-outline-variant/30 text-outline hover:border-outline-variant"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                   {[
                    { id: 'inline', name: 'Try Same Line' },
                    { id: 'below', name: 'Below' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => updateDesign({ titlePosition: p.id as any })}
                      className={cn(
                        "py-3 rounded-xl border-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                        design.titlePosition === p.id
                          ? "border-primary bg-primary text-white shadow-lg shadow-primary/20"
                          : "border-outline-variant/30 text-outline hover:border-outline-variant"
                      )}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                   {[
                    { id: 'normal', name: 'Normal' },
                    { id: 'italic', name: 'Italic' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => updateDesign({ titleStyle: s.id as any })}
                      className={cn(
                        "py-3 rounded-xl border-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                        design.titleStyle === s.id
                          ? "border-primary bg-primary/5 text-primary shadow-sm" 
                          : "border-outline-variant/30 text-outline hover:border-outline-variant",
                        s.id === 'italic' && "italic"
                      )}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Photo Customization */}
              <div className="space-y-6 pt-6 border-t border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-outline uppercase tracking-widest">Photo Settings</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={design.showPhoto}
                        onChange={(e) => updateDesign({ showPhoto: e.target.checked })}
                        className="hidden"
                      />
                      <div className={cn(
                        "w-4 h-4 rounded border-2 transition-all flex items-center justify-center",
                        design.showPhoto ? "bg-primary border-primary" : "border-outline-variant group-hover:border-primary"
                      )}>
                        {design.showPhoto && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-[10px] font-bold text-outline group-hover:text-primary transition-colors">SHOW</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={design.photoGrayscale}
                        onChange={(e) => updateDesign({ photoGrayscale: e.target.checked })}
                        className="hidden"
                      />
                      <div className={cn(
                        "w-4 h-4 rounded border-2 transition-all flex items-center justify-center",
                        design.photoGrayscale ? "bg-primary border-primary" : "border-outline-variant group-hover:border-primary"
                      )}>
                        {design.photoGrayscale && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-[10px] font-bold text-outline group-hover:text-primary transition-colors">GRAYSCALE</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-outline uppercase tracking-[0.2em]">Photo Position</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'left', name: 'Left' },
                      { id: 'top', name: 'Top' },
                      { id: 'right', name: 'Right' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        onClick={() => updateDesign({ photoPosition: p.id as any })}
                        className={cn(
                          "py-3 rounded-xl border-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                          design.photoPosition === p.id
                            ? "border-primary bg-primary text-white shadow-lg shadow-primary/20"
                            : "border-outline-variant/30 text-outline hover:border-outline-variant"
                        )}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-outline uppercase tracking-[0.2em]">Photo Size</span>
                  <div className="flex gap-2">
                    {['xs', 's', 'm', 'l', 'xl'].map((s) => (
                      <button
                        key={s}
                        onClick={() => updateDesign({ photoSizeScale: s as any })}
                        className={cn(
                          "w-10 h-10 rounded-xl border-2 flex items-center justify-center text-[10px] font-black uppercase transition-all",
                          design.photoSizeScale === s
                            ? "border-primary bg-primary/5 text-primary shadow-sm"
                            : "border-outline-variant/30 text-outline hover:border-outline-variant"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-outline uppercase tracking-[0.2em]">Photo Shape</span>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'circle', name: 'Circle', class: 'rounded-full' },
                      { id: 'square', name: 'Square', class: 'rounded-none' },
                      { id: 'rounded-square', name: 'Rounded', class: 'rounded-lg' },
                      { id: 'portrait', name: 'Portrait', class: 'rounded-none aspect-[3/4]' },
                      { id: 'rounded-portrait', name: 'R. Portrait', class: 'rounded-lg aspect-[3/4]' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => updateDesign({ photoShape: s.id as any })}
                        className={cn(
                          "flex flex-col items-center gap-3 p-3 rounded-2xl border-2 transition-all group",
                          design.photoShape === s.id 
                            ? "border-primary bg-primary/5 text-primary shadow-sm" 
                            : "border-outline-variant/30 text-outline hover:border-outline-variant hover:bg-surface-container"
                        )}
                      >
                        <div className={cn(
                          "w-full aspect-square border-2 flex items-center justify-center transition-all overflow-hidden",
                          s.class,
                          design.photoShape === s.id ? "bg-white border-primary/20 shadow-inner" : "bg-surface-container border-transparent"
                        )}>
                           <User className={cn("w-1/2 h-1/2", design.photoShape === s.id ? "text-primary/40" : "text-outline-variant/40")} />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-center leading-tight">{s.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── BEHAVIOR & DISPLAY VIEW ────────────────────────────────────── */}
        {activeView === 'behavior-display' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {renderHeader('Behavior & Display')}

            <div className="space-y-10 pb-20">
              {/* SECTION: GLOBAL VISIBILITY */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                  <Eye className="w-3 h-3" />
                  Global Visibility
                </label>
                <div className="flex items-center justify-between p-4 bg-surface-container/50 border border-outline-variant/20 rounded-2xl hover:bg-surface-container transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-outline group-hover:text-primary transition-colors">
                      <EyeOff className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold font-manrope">Hide empty sections</span>
                      <span className="text-[10px] text-outline">Don't show headers for sections with no data</span>
                    </div>
                  </div>
                  <button
                    onClick={() => updateDesign({ resumeHideEmptySections: !design.resumeHideEmptySections })}
                    className={cn(
                      "w-10 h-5 rounded-full p-1 transition-all duration-300",
                      design.resumeHideEmptySections ? "bg-primary" : "bg-outline-variant/50"
                    )}
                  >
                    <div className={cn(
                      "w-3 h-3 bg-white rounded-full transition-all duration-300 transform",
                      design.resumeHideEmptySections ? "translate-x-5" : "translate-x-0"
                    )} />
                  </button>
                </div>
              </div>

              {/* SECTION: SKILLS LAYOUT */}
              <div className="space-y-6">
                <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                  <Wrench className="w-3 h-3" />
                  Skills Layout
                </label>
                
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'grid', name: 'Grid', icon: LayoutGrid },
                      { id: 'rows', name: 'Rows', icon: AlignJustify },
                      { id: 'compact', name: 'Compact', icon: Zap },
                      { id: 'bubble', name: 'Bubble', icon: Layers },
                      { id: 'level', name: 'Level', icon: Award },
                    ].map((l) => (
                      <button
                        key={l.id}
                        onClick={() => updateDesign({ skillsLayout: l.id as any })}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all font-bold text-[11px] uppercase tracking-wider",
                          design.skillsLayout === l.id 
                            ? "bg-primary/5 border-primary text-primary shadow-sm" 
                            : "bg-white border-outline-variant/30 text-outline hover:border-outline-variant"
                        )}
                      >
                        <l.icon className={cn("w-3.5 h-3.5", design.skillsLayout === l.id ? "text-primary" : "text-outline")} />
                        {l.name}
                      </button>
                    ))}
                  </div>

                  {/* Contextual Skill Controls */}
                  <div className="bg-surface-container/30 rounded-2xl p-4 border border-outline-variant/10">
                    {design.skillsLayout === 'grid' && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className="text-xs font-bold text-outline">Column Layout</label>
                        <div className="grid grid-cols-4 gap-3">
                          {[1, 2, 3, 4].map((cols) => (
                            <button
                              key={cols}
                              onClick={() => updateDesign({ skillsGridColumns: cols as any })}
                              className={cn(
                                "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all gap-2",
                                design.skillsGridColumns === cols 
                                  ? "border-primary bg-primary/5 text-primary shadow-sm" 
                                  : "bg-white border-outline-variant/30 text-outline hover:border-outline-variant"
                              )}
                            >
                              <div className="flex gap-0.5">
                                {Array.from({ length: cols }).map((_, i) => (
                                  <div key={i} className={cn("w-1 h-4 rounded-full", design.skillsGridColumns === cols ? "bg-primary" : "bg-outline-variant/50")} />
                                ))}
                              </div>
                              <span className="text-[10px] font-black">{cols} Col</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {design.skillsLayout === 'rows' && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="space-y-4">
                          <label className="text-xs font-bold text-outline">Row Spacing</label>
                          <div className="grid grid-cols-2 gap-3">
                            {[{ id: 'tight', name: 'Tight' }, { id: 'spacious', name: 'Spacious' }].map((s) => (
                              <button
                                key={s.id}
                                onClick={() => updateDesign({ skillsRowSpacing: s.id as any })}
                                className={cn(
                                  "py-2.5 rounded-xl border-2 text-[11px] font-black uppercase tracking-widest transition-all",
                                  design.skillsRowSpacing === s.id ? "border-primary bg-primary/5 text-primary" : "bg-white border-outline-variant/30 text-outline"
                                )}
                              >
                                {s.name}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between py-2 border-t border-outline-variant/10">
                          <span className="text-sm font-bold font-manrope">Show bullets</span>
                          <button
                            onClick={() => updateDesign({ skillsShowRowBullets: !design.skillsShowRowBullets })}
                            className={cn("w-10 h-5 rounded-full p-1 transition-all", design.skillsShowRowBullets ? "bg-primary" : "bg-outline-variant/50")}
                          >
                            <div className={cn("w-3 h-3 bg-white rounded-full transition-all transform", design.skillsShowRowBullets ? "translate-x-5" : "translate-x-0")} />
                          </button>
                        </div>
                      </div>
                    )}

                    {design.skillsLayout === 'compact' && (
                      <div className="space-y-4">
                        <label className="text-xs font-bold text-outline">Item Separator</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[{ id: 'bullet', name: 'Bullet' }, { id: 'pipe', name: 'Pipe' }, { id: 'comma', name: 'Comma' }].map((s) => (
                            <button
                              key={s.id}
                              onClick={() => updateDesign({ skillsCompactSeparator: s.id as any })}
                              className={cn("py-2 rounded-xl border-2 text-[10px] font-black", design.skillsCompactSeparator === s.id ? "border-primary bg-primary text-white" : "bg-white border-outline-variant/30 text-outline")}
                            >
                              {s.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {design.skillsLayout === 'level' && (
                      <div className="space-y-4">
                        <label className="text-xs font-bold text-outline">Visualizer</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[{ id: 'text', name: 'Text' }, { id: 'dots', name: 'Dots' }, { id: 'bar', name: 'Bar' }].map((s) => (
                            <button
                              key={s.id}
                              onClick={() => updateDesign({ skillsLevelVisualizer: s.id as any })}
                              className={cn("py-2 rounded-xl border-2 text-[10px] font-black", design.skillsLevelVisualizer === s.id ? "border-primary bg-primary text-white" : "bg-white border-outline-variant/30 text-outline")}
                            >
                              {s.name}
                            </button>
                          ))}
                        </div>
                        <SkillLevelBanner />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION: SUMMARY BEHAVIOR */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                  <FileText className="w-3 h-3" />
                  Summary Integration
                </label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-surface-container/50 border border-outline-variant/20 rounded-2xl hover:bg-surface-container transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-outline group-hover:text-primary transition-colors">
                        <LayoutIcon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold font-manrope">Display in Header</span>
                        <span className="text-[10px] text-outline">Show summary below contact details</span>
                      </div>
                    </div>
                    <button
                      onClick={() => updateDesign({ resumeSummaryInHeader: !design.resumeSummaryInHeader })}
                      className={cn(
                        "w-10 h-5 rounded-full p-1 transition-all duration-300",
                        design.resumeSummaryInHeader ? "bg-primary" : "bg-outline-variant/50"
                      )}
                    >
                      <div className={cn(
                        "w-3 h-3 bg-white rounded-full transition-all duration-300 transform",
                        design.resumeSummaryInHeader ? "translate-x-5" : "translate-x-0"
                      )} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-surface-container/50 border border-outline-variant/20 rounded-2xl hover:bg-surface-container transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-outline group-hover:text-primary transition-colors">
                        <TypeIcon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold font-manrope">Show Heading</span>
                        <span className="text-[10px] text-outline">Display section title for summary</span>
                      </div>
                    </div>
                    <button
                      onClick={() => updateDesign({ resumeShowSummaryHeading: !design.resumeShowSummaryHeading })}
                      className={cn(
                        "w-10 h-5 rounded-full p-1 transition-all duration-300",
                        design.resumeShowSummaryHeading ? "bg-primary" : "bg-outline-variant/50"
                      )}
                    >
                      <div className={cn(
                        "w-3 h-3 bg-white rounded-full transition-all duration-300 transform",
                        design.resumeShowSummaryHeading ? "translate-x-5" : "translate-x-0"
                      )} />
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION: CONTENT ORDERING */}
              <div className="space-y-6">
                <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                  <Shuffle className="w-3 h-3" />
                  Content Ordering
                </label>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <p className="text-[11px] font-bold text-outline uppercase tracking-wider px-1">Education</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'title-first', name: 'Degree First', sub: 'Degree, Institution' },
                        { id: 'subtitle-first', name: 'Org First', sub: 'Institution, Degree' },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => updateDesign({ resumeEducationOrder: opt.id as any })}
                          className={cn(
                            "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-1",
                            design.resumeEducationOrder === opt.id 
                              ? "border-primary bg-primary/5 text-primary shadow-sm" 
                              : "bg-white border-outline-variant/30 text-outline hover:border-outline-variant"
                          )}
                        >
                          <span className="text-[11px] font-black uppercase">{opt.name}</span>
                          <span className="text-[9px] opacity-60">{opt.sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[11px] font-bold text-outline uppercase tracking-wider px-1">Work Experience</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'title-first', name: 'Role First', sub: 'Job Title, Company' },
                        { id: 'subtitle-first', name: 'Company First', sub: 'Company, Job Title' },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => updateDesign({ resumeExperienceOrder: opt.id as any })}
                          className={cn(
                            "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-1",
                            design.resumeExperienceOrder === opt.id 
                              ? "border-primary bg-primary/5 text-primary shadow-sm" 
                              : "bg-white border-outline-variant/30 text-outline hover:border-outline-variant"
                          )}
                        >
                          <span className="text-[11px] font-black uppercase">{opt.name}</span>
                          <span className="text-[9px] opacity-60">{opt.sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: GROUPING BEHAVIOR */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                  <Group className="w-3 h-3" />
                  Grouping Behavior
                </label>
                <div className="flex items-center justify-between p-4 bg-surface-container/50 border border-outline-variant/20 rounded-2xl hover:bg-surface-container transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-outline group-hover:text-primary transition-colors">
                      <Shuffle className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold font-manrope">Group Promotions</span>
                      <span className="text-[10px] text-outline">Cluster roles under one employer</span>
                    </div>
                  </div>
                  <button
                    onClick={() => updateDesign({ resumeGroupPromotions: !design.resumeGroupPromotions })}
                    className={cn(
                      "w-10 h-5 rounded-full p-1 transition-all duration-300",
                      design.resumeGroupPromotions ? "bg-primary" : "bg-outline-variant/50"
                    )}
                  >
                    <div className={cn(
                      "w-3 h-3 bg-white rounded-full transition-all duration-300 transform",
                      design.resumeGroupPromotions ? "translate-x-5" : "translate-x-0"
                    )} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
