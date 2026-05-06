'use client'

import { useState, useEffect } from 'react'
import { useCVStore } from '@/store/cv-store'
import { 
  X, 
  GripVertical, 
  Eye, 
  EyeOff, 
  Type, 
  Check,
  RotateCcw,
  Trash2,
  Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'
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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// ─── Sortable Item Component ──────────────────────────────────────────────────

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
  } = useSortable({ id: section.id })

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
        "flex items-center gap-3 p-3 bg-surface border rounded-md transition-all",
        isDragging ? "shadow-level-3 border-primary scale-[1.02]" : "border-outline-variant",
        !section.visible && "opacity-50 grayscale-[0.5]"
      )}
    >
      {/* Drag Handle */}
      <div 
        {...attributes} 
        {...listeners} 
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-surface-container rounded text-outline"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Label / Input */}
      <div className="flex-1 min-w-0">
        {isEditing && !isProtected ? (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <input
              autoFocus
              type="text"
              value={tempLabel}
              onChange={(e) => setTempLabel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLabelSubmit()}
              onBlur={handleLabelSubmit}
              className="w-full px-2 py-1 text-[13px] font-semibold border-b-2 border-primary outline-none bg-transparent text-on-surface"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2 group/label">
            <span className={cn(
              "text-[13px] font-semibold text-on-surface truncate",
              !section.visible && "line-through text-outline"
            )}>
              {section.label}
            </span>
            {!isProtected && (
              <button 
                onClick={() => setIsEditing(true)} 
                className="opacity-0 group-hover/label:opacity-100 p-1 text-outline hover:text-primary transition-all"
              >
                <Type className="w-3.5 h-3.5" />
              </button>
            )}
            {isProtected && (
              <span className="text-[10px] font-bold text-outline uppercase tracking-wider bg-surface-container px-1.5 py-0.5 rounded ml-2">
                Fixed
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        {/* Toggle Visibility */}
        {!isProtected && (
          <button
            onClick={() => toggleSection(section.id as any)}
            className={cn(
              "p-2 rounded-md transition-all",
              section.visible 
                ? "text-primary bg-primary/10 hover:bg-primary/20" 
                : "text-outline bg-surface-container-high hover:bg-surface-container-highest"
            )}
            title={section.visible ? "Hide section from resume" : "Show section on resume"}
          >
            {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        )}

        {/* Delete button (for extra summaries or custom sections) */}
        {!isProtected && (
          <button
            onClick={() => {
              if (confirm(`Delete the "${section.label}" section?`)) {
                removeSection(section.id)
              }
            }}
            className="p-2 rounded-md text-outline hover:bg-error-container hover:text-on-error-container transition-all"
            title="Delete section"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Main Manager Component ───────────────────────────────────────────────────

interface SectionManagerProps {
  isOpen: boolean
  onClose: () => void
}

export default function SectionManager({ isOpen, onClose }: SectionManagerProps) {
  const { sectionOrder, reorderSections, addPersonalSummary, addProfessionalSummary, addCustomSection } = useCVStore()
  const [isMounted, setIsMounted] = useState(false)

  // Ensure DnD only renders on client to avoid hydration mismatch
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

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-[4px] z-[60] transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={cn(
          "fixed right-0 top-0 h-full w-[440px] bg-surface shadow-2xl z-[70] flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant bg-surface-container-low sticky top-0 z-10">
          <div>
            <h3 className="text-lg font-bold text-on-surface font-manrope">Manage Sections</h3>
            <p className="text-[11px] text-outline mt-0.5 font-work-sans uppercase tracking-wider">Drag to reorder • Toggle visibility</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-container text-outline hover:text-on-surface transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
          {isMounted ? (
            <DndContext
              id="section-manager-dnd"
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sectionOrder.map(s => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-2">
                  {sectionOrder.map((section) => (
                    <SortableSectionItem key={section.id} section={section} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="space-y-3">
              {sectionOrder.map((section) => (
                <div key={section.id} className="h-14 bg-surface-container rounded-md border border-outline-variant animate-pulse" />
              ))}
            </div>
          )}
        </div>

        {/* Footer — Add New Sections */}
        <div className="p-6 border-t border-outline-variant bg-surface-container-low flex flex-col gap-3">
          <div className="font-work-sans text-[10px] font-bold text-outline uppercase tracking-widest mb-1">
            Add Additional Sections
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={addPersonalSummary}
              className="flex items-center justify-center gap-2 py-3 rounded-md border-[1.5px] border-secondary-fixed-dim bg-surface font-work-sans text-[12px] font-semibold text-on-surface-variant hover:border-primary-container hover:bg-secondary-container hover:text-primary transition-all"
            >
              <Plus className="w-4 h-4" />
              Personal Summary
            </button>
            <button
              onClick={addProfessionalSummary}
              className="flex items-center justify-center gap-2 py-3 rounded-md border-[1.5px] border-secondary-fixed-dim bg-surface font-work-sans text-[12px] font-semibold text-on-surface-variant hover:border-primary-container hover:bg-secondary-container hover:text-primary transition-all"
            >
              <Plus className="w-4 h-4" />
              Prof. Summary
            </button>
            <button
              onClick={addCustomSection}
              className="col-span-2 flex items-center justify-center gap-2 py-3 rounded-md border-[1.5px] border-secondary-fixed-dim bg-surface font-work-sans text-[12px] font-semibold text-on-surface-variant hover:border-primary-container hover:bg-secondary-container hover:text-primary transition-all"
            >
              <Plus className="w-4 h-4" />
              Custom Section
            </button>
          </div>
          
          <button
            onClick={() => {
              if (confirm('Reset all section settings to default?')) {
                // Reset logic here
              }
            }}
            className="mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-md bg-surface-container hover:bg-surface-container-high font-work-sans text-[11px] font-medium text-outline transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restore Defaults
          </button>
        </div>
      </div>
    </>
  )
}

