'use client'

import { useCVStore } from '@/store/cv-store'
import { Plus, Trash2, X, Wrench, Eye, EyeOff, Edit2 } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import RichTextEditor from '@/components/features/editor/RichTextEditor'

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="font-work-sans text-[12px] font-semibold text-on-surface-variant uppercase tracking-[0.05em] mb-[7px] block">
    {children}
  </label>
)

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full px-[13px] py-[10px] rounded-md border-[1.5px] border-secondary-fixed-dim bg-surface-container-lowest font-work-sans text-sm text-on-surface placeholder:text-outline focus:border-primary focus:ring-[3px] focus:ring-primary/10 outline-none transition-all duration-200"
  />
)

export default function SkillsForm() {
  const { skills, addSkillCategory, removeSkillCategory, updateSkillCategory, activeEntryId, setActiveEntryId } = useCVStore()

  const PROFICIENCY_LEVELS = [
    { value: 'none', label: 'Select skill level' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' },
  ]

  // Find active category
  const activeCategory = skills.categories.find(c => c.id === activeEntryId)

  if (activeCategory) {
    return (
      <div className="flex flex-col gap-4 py-2 animate-in fade-in slide-in-from-top-4 duration-300">
        {/* Back Button */}
        <button 
          onClick={() => setActiveEntryId(null)}
          className="flex items-center gap-2 self-start px-3 py-1.5 rounded-md bg-surface-container hover:bg-surface-container-high font-work-sans text-xs font-bold text-on-surface-variant transition-all group"
        >
          <Plus className="w-3.5 h-3.5 rotate-45 text-outline group-hover:text-primary transition-colors" />
          Back to List
        </button>

        <div className="relative p-6 rounded-xl border border-primary/20 bg-surface-container-lowest shadow-lg">
          <div className="absolute right-4 top-4 flex items-center gap-1 z-10">
            <button
              onClick={() => updateSkillCategory(activeCategory.id, { visible: !activeCategory.visible })}
              className={cn(
                "p-2 rounded-full transition-all",
                activeCategory.visible ? "text-outline hover:text-primary hover:bg-primary/10" : "text-primary bg-primary/5"
              )}
              title={activeCategory.visible ? "Hide Subsection" : "Show Subsection"}
            >
              {activeCategory.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                removeSkillCategory(activeCategory.id)
                setActiveEntryId(null)
              }}
              className="p-2 rounded-full text-outline hover:text-error hover:bg-error-container transition-all"
              title="Remove Subsection"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-6 mt-2">
            <div className="flex flex-col">
              <Label>Skill</Label>
              <Input
                value={activeCategory.categoryName}
                onChange={(e) => updateSkillCategory(activeCategory.id, { categoryName: e.target.value })}
                placeholder="e.g. Programming & Backend"
              />
            </div>

            <div className="flex flex-col">
              <Label>Information / Sub-skills</Label>
              <RichTextEditor
                content={activeCategory.description || ''}
                onChange={(html) => updateSkillCategory(activeCategory.id, { description: html })}
                placeholder="e.g. Python, FastAPI, Django, Node.js..."
              />
            </div>

            <div className="flex flex-col">
              <Label>Skill level</Label>
              <select
                value={activeCategory.level || 'none'}
                onChange={(e) => updateSkillCategory(activeCategory.id, { level: e.target.value as any })}
                className="w-full px-[13px] py-[10px] rounded-md border-[1.5px] border-secondary-fixed-dim bg-surface-container-lowest font-work-sans text-sm text-on-surface outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%23606367%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:18px] bg-[right_12px_center] bg-no-repeat"
              >
                {PROFICIENCY_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 py-2">
      <div className="flex flex-col gap-3">
        {skills.categories.map((cat) => (
          <div 
            key={cat.id} 
            onClick={() => setActiveEntryId(cat.id)}
            className={cn(
              "relative group p-4 rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer",
              !cat.visible && "opacity-60 grayscale-[0.5]"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="font-manrope text-sm font-bold text-on-surface">{cat.categoryName || 'New Category'}</span>
                {cat.level && cat.level !== 'none' && (
                  <span className="font-work-sans text-[11px] text-outline font-medium uppercase tracking-wider">{cat.level}</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    updateSkillCategory(cat.id, { visible: !cat.visible })
                  }}
                  className="p-2 rounded-full text-outline hover:text-primary transition-all"
                >
                  {cat.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <Edit2 className="w-3.5 h-3.5 text-outline group-hover:text-primary transition-colors" />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addSkillCategory}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary hover:bg-primary/5 transition-all font-work-sans text-sm font-bold mt-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add skill entry</span>
        </button>
      </div>
    </div>
  )
}
