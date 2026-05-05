'use client'

import { useState, useEffect } from 'react'
import { useCVStore } from '@/lib/store'
import { 
  X, 
  GripVertical, 
  Eye, 
  EyeOff, 
  Type, 
  Check,
  RotateCcw
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
  const { toggleSection, updateSectionLabel } = useCVStore()
  const [isEditing, setIsEditing] = useState(false)
  const [tempLabel, setTempLabel] = useState(section.label)

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
    updateSectionLabel(section.id as any, tempLabel)
    setIsEditing(false)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 p-3 bg-white border rounded-xl transition-all",
        isDragging ? "shadow-xl border-blue-400 scale-[1.02]" : "border-gray-100",
        !section.visible && "opacity-60 bg-gray-50/50"
      )}
    >
      {/* Drag Handle */}
      <div 
        {...attributes} 
        {...listeners} 
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded text-gray-400"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Label / Input */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              autoFocus
              type="text"
              value={tempLabel}
              onChange={(e) => setTempLabel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLabelSubmit()}
              onBlur={handleLabelSubmit}
              className="w-full px-2 py-1 text-sm border-b-2 border-blue-500 outline-none bg-transparent"
            />
            <button onClick={handleLabelSubmit} className="text-blue-600">
              <Check className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 truncate">{section.label}</span>
            <button 
              onClick={() => setIsEditing(true)} 
              className="p-1 text-gray-300 hover:text-gray-600 transition-colors"
            >
              <Type className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Toggle Visibility */}
      <button
        onClick={() => toggleSection(section.id as any)}
        className={cn(
          "p-2 rounded-lg transition-all",
          section.visible 
            ? "text-blue-600 bg-blue-50 hover:bg-blue-100" 
            : "text-gray-400 bg-gray-100 hover:bg-gray-200"
        )}
        title={section.visible ? "Hide section" : "Show section"}
      >
        {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </button>
    </div>
  )
}

// ─── Main Manager Component ───────────────────────────────────────────────────

interface SectionManagerProps {
  isOpen: boolean
  onClose: () => void
}

export default function SectionManager({ isOpen, onClose }: SectionManagerProps) {
  const { sectionOrder, reorderSections } = useCVStore()
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
          "fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[60] transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={cn(
          "fixed right-0 top-0 h-full w-[400px] bg-white shadow-2xl z-[70] flex flex-col transition-transform duration-500 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Manage Sections</h3>
            <p className="text-xs text-gray-500 mt-0.5">Drag to reorder, eye to toggle visibility</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
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
                {sectionOrder.map((section) => (
                  <SortableSectionItem key={section.id} section={section} />
                ))}
              </SortableContext>
            </DndContext>
          ) : (
            <div className="space-y-3">
              {sectionOrder.map((section) => (
                <div key={section.id} className="h-14 bg-gray-50 rounded-xl border border-gray-100 animate-pulse" />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={() => {}} // Reset functionality could go here
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Section Settings
          </button>
        </div>
      </div>
    </>
  )
}

