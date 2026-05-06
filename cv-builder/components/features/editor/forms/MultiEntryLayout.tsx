'use client'

import React, { useState, useEffect } from 'react'
import { 
  ChevronDown, 
  Trash2, 
  GripVertical, 
  Plus,
  Eye,
  EyeOff,
  Edit2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCVStore } from '@/store/cv-store'
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

interface MultiEntryLayoutProps<T extends { id: string; visible?: boolean }> {
  items: T[]
  onAdd: () => void
  onRemove: (id: string) => void
  onReorder: (from: number, to: number) => void
  onToggleVisibility?: (id: string) => void
  renderSummary: (item: T) => { title: string; subtitle?: string; date?: string }
  renderForm: (item: T) => React.ReactNode
  addButtonText: string
  icon?: any
}

export default function MultiEntryLayout<T extends { id: string; visible?: boolean }>({
  items,
  onAdd,
  onRemove,
  onReorder,
  onToggleVisibility,
  renderSummary,
  renderForm,
  addButtonText,
  icon: Icon,
}: MultiEntryLayoutProps<T>) {
  const { activeEntryId, setActiveEntryId } = useCVStore()
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
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)
      onReorder(oldIndex, newIndex)
    }
  }

  const toggle = (id: string) => {
    setActiveEntryId(activeEntryId === id ? null : id)
  }

  const activeItem = items.find(item => item.id === activeEntryId)

  return (
    <div className="flex flex-col gap-3">
      {isMounted ? (
        activeItem ? (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
            {/* Back Button */}
            <button 
              onClick={() => setActiveEntryId(null)}
              className="flex items-center gap-2 self-start px-3 py-1.5 rounded-md bg-surface-container hover:bg-surface-container-high font-work-sans text-xs font-bold text-on-surface-variant transition-all group"
            >
              <Plus className="w-3.5 h-3.5 rotate-45 text-outline group-hover:text-primary transition-colors" />
              Back to List
            </button>

            {/* Focused Entry Form */}
            <SortableEntry
              item={activeItem}
              isOpen={true}
              onToggle={() => setActiveEntryId(null)}
              onRemove={() => onRemove(activeItem.id)}
              onToggleVisibility={onToggleVisibility}
              renderSummary={renderSummary}
              renderForm={renderForm}
              icon={Icon}
              isFocused={true}
            />
          </div>
        ) : (
          <DndContext
            id={`dnd-${addButtonText.replace(/\s+/g, '-').toLowerCase()}`}
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-2">
                {items.map((item) => (
                  <SortableEntry
                    key={item.id}
                    item={item}
                    isOpen={false}
                    onToggle={() => toggle(item.id)}
                    onRemove={() => onRemove(item.id)}
                    onToggleVisibility={onToggleVisibility}
                    renderSummary={renderSummary}
                    renderForm={renderForm}
                    icon={Icon}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <div key={item.id} className="h-16 bg-surface-container rounded-md border border-outline-variant animate-pulse" />
          ))}
        </div>
      )}

      {!activeEntryId && (
        <button
          onClick={onAdd}
          className="w-full mt-2 flex items-center justify-center gap-2 p-[12px] rounded-md border-[1.5px] border-dashed border-secondary-fixed-dim text-[13px] font-semibold text-on-surface-variant hover:border-primary-container hover:bg-secondary-container hover:text-primary transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          {addButtonText}
        </button>
      )}
    </div>
  )
}

function SortableEntry<T extends { id: string; visible?: boolean }>({
  item,
  isOpen,
  onToggle,
  onRemove,
  onToggleVisibility,
  renderSummary,
  renderForm,
  icon: Icon,
  isFocused = false,
}: {
  item: T
  isOpen: boolean
  onToggle: () => void
  onRemove: () => void
  onToggleVisibility?: (id: string) => void
  renderSummary: (item: T) => { title: string; subtitle?: string; date?: string }
  renderForm: (item: T) => React.ReactNode
  icon?: any
  isFocused?: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled: isFocused })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  }

  const summary = renderSummary(item)
  const visible = item.visible !== false

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("flex flex-col", isDragging && "z-50")}
    >
      {/* Card (Header in Focus Mode) */}
      <div
        onClick={onToggle}
        className={cn(
          "flex items-start gap-[10px] p-[12px_14px] rounded-md border transition-all duration-200 cursor-pointer group",
          isOpen 
            ? "bg-surface-container-lowest border-primary-container border-l-[3px] shadow-level-2" 
            : "bg-surface-container border-outline-variant hover:bg-surface-container-high hover:border-outline shadow-level-0 hover:shadow-level-2",
          !visible && "opacity-[0.45]",
          isDragging && "shadow-level-3 opacity-90",
          isFocused && "cursor-default"
        )}
      >
        {!isFocused && (
          <div
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="mt-1 text-outline-variant hover:text-outline cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="w-4 h-4" />
          </div>
        )}

        <div className="w-8 h-8 rounded-md bg-secondary-container flex items-center justify-center flex-shrink-0">
          {Icon && <Icon className="w-4 h-4 text-secondary" />}
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <span className={cn(
            "font-work-sans text-sm font-semibold text-on-surface truncate",
            !visible && "line-through text-outline"
          )}>
            {summary.title || "Untitled Entry"}
          </span>
          <span className="font-work-sans text-xs text-on-surface-variant truncate">
            {summary.subtitle || summary.date || ""}
          </span>
        </div>

        <div className="flex items-center gap-1 self-center">
          {onToggleVisibility && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleVisibility(item.id)
              }}
              className={cn(
                "w-7 h-7 flex items-center justify-center rounded-sm transition-colors",
                visible ? "text-outline hover:bg-surface-container-high" : "text-outline-variant"
              )}
            >
              {visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="w-7 h-7 flex items-center justify-center rounded-sm text-outline hover:bg-error-container hover:text-on-error-container transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Inline Edit Form */}
      {isOpen && (
        <div className={cn(
          "mt-2 flex flex-col bg-surface-container-lowest border border-primary-container rounded-md shadow-level-2 animate-in slide-in-from-top-2 duration-300 ease-out",
          isFocused ? "p-[20px_22px]" : "p-[16px_18px]"
        )}>
          <div className="flex items-center gap-2 mb-[18px] pb-[12px] border-b border-outline-variant font-work-sans text-xs font-bold text-primary-container uppercase tracking-[0.1em]">
            <Edit2 className="w-3.5 h-3.5" />
            Entry Details
          </div>
          {renderForm(item)}
        </div>
      )}
    </div>
  )
}
