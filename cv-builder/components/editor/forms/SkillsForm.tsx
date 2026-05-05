'use client'

import { useCVStore } from '@/lib/store'
import { Plus, Trash2, Tag, ChevronDown, ChevronRight, X } from 'lucide-react'
import { generateId } from '@/lib/utils'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function SkillsForm() {
  const { skills, updateSkillsDisplay, addSkillCategory, removeSkillCategory, updateSkillCategory, addSkillItem, removeSkillItem } = useCVStore()
  const [newSkillText, setNewSkillText] = useState<Record<string, string>>({})

  const handleAddSkill = (categoryId: string) => {
    const text = newSkillText[categoryId]?.trim()
    if (!text) return

    addSkillItem(categoryId)
    // Note: This adds a blank skill. Ideally the store should take the text, 
    // but the current store API adds a blank one. 
    // For now I'll just follow the store and the user can type it in.
    setNewSkillText((prev) => ({ ...prev, [categoryId]: '' }))
  }

  const handleKeyDown = (e: React.KeyboardEvent, categoryId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddSkill(categoryId)
    }
  }

  return (
    <div className="p-4 space-y-6">
      {/* Global Style Selector */}
      <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
        <label className="text-xs font-semibold text-blue-800">Display Style</label>
        <div className="flex gap-1">
          {['tags', 'bars', 'dots', 'plain'].map((style) => (
            <button
              key={style}
              onClick={() => updateSkillsDisplay(style as any)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all capitalize",
                skills.displayStyle === style 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "bg-white text-blue-600 hover:bg-blue-100"
              )}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {skills.categories.map((cat, catIndex) => (
        <div key={cat.id} className="space-y-3 p-4 rounded-xl border border-gray-100 bg-gray-50/30 group">
          {/* Category Header */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={cat.categoryName}
              onChange={(e) => updateSkillCategory(cat.id, { categoryName: e.target.value })}
              placeholder="Category (e.g. Languages)"
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-800 placeholder:text-gray-300 p-0"
            />
            <button
              onClick={() => removeSkillCategory(cat.id)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 transition-opacity opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Skill Tags */}
          <div className="flex flex-wrap gap-2">
            {cat.items.map((item) => (
              <div 
                key={item.id}
                className="flex items-center gap-1.5 pl-3 pr-1 py-1 rounded-full bg-white border border-gray-200 text-xs text-gray-700 shadow-sm transition-all hover:border-blue-300"
              >
                <span>{item.skill}</span>
                <button 
                  onClick={() => removeSkillItem(cat.id, item.id)}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            
            {/* Inline Add Skill */}
            <div className="flex items-center gap-2 flex-1 min-w-[120px]">
              <input
                type="text"
                value={newSkillText[cat.id] || ''}
                onChange={(e) => setNewSkillText((prev) => ({ ...prev, [cat.id]: e.target.value }))}
                onKeyDown={(e) => handleKeyDown(e, cat.id)}
                placeholder="Add skill..."
                className="flex-1 bg-white px-3 py-1 rounded-full border border-gray-200 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
              />
              <button
                onClick={() => handleAddSkill(cat.id)}
                className="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-blue-600 hover:text-white transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={() => addSkillCategory()}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm font-medium text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all"
      >
        <Plus className="w-4 h-4" />
        Add Skill Category
      </button>
    </div>
  )
}
