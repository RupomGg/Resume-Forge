'use client'

import { useCVStore } from '@/lib/store'
import { Plus, Trash2, GripVertical, Calendar } from 'lucide-react'
import RichTextEditor from '../RichTextEditor'
import { generateId } from '@/lib/utils'

export default function WorkExperienceForm() {
  const { experience, addExperience, updateExperience, removeExperience } = useCVStore()

  const addNew = () => {
    addExperience()
  }

  return (
    <div className="p-4 space-y-6">
      {experience.map((exp, index) => (
        <div 
          key={exp.id} 
          className="relative p-4 rounded-xl border border-gray-100 bg-gray-50/30 space-y-4 group transition-all hover:border-gray-200 hover:shadow-sm"
        >
          {/* Header Actions */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Experience #{index + 1}
            </span>
            <button
              onClick={() => removeExperience(exp.id)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
              title="Delete experience"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Job Title */}
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 ml-1">Job Title</label>
              <input
                type="text"
                value={exp.jobTitle}
                onChange={(e) => updateExperience(exp.id, { jobTitle: e.target.value })}
                placeholder="e.g. Senior Product Designer"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
              />
            </div>

            {/* Company */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 ml-1">Company</label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                placeholder="e.g. Google"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
              />
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 ml-1">Location</label>
              <input
                type="text"
                value={exp.location}
                onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                placeholder="City, Country"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
              />
            </div>

            {/* Start Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 ml-1 flex items-center gap-1.5">
                <Calendar className="w-3 h-3" /> Start Date
              </label>
              <div className="flex gap-2">
                <select
                  value={exp.startDate.month}
                  onChange={(e) => updateExperience(exp.id, { startDate: { ...exp.startDate, month: parseInt(e.target.value) } })}
                  className="w-full px-2 py-2 rounded-lg border border-gray-200 bg-white text-sm outline-none"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('en', { month: 'short' })}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={exp.startDate.year}
                  onChange={(e) => updateExperience(exp.id, { startDate: { ...exp.startDate, year: parseInt(e.target.value) } })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none text-sm"
                />
              </div>
            </div>

            {/* End Date / Current */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 ml-1 flex items-center gap-1.5 justify-between">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" /> End Date
                </div>
                <label className="flex items-center gap-1 text-[10px] font-normal cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={exp.currentlyWorking}
                    onChange={(e) => updateExperience(exp.id, { currentlyWorking: e.target.checked })}
                    className="w-3 h-3 rounded text-blue-600"
                  />
                  Present
                </label>
              </label>
              {!exp.currentlyWorking ? (
                <div className="flex gap-2">
                  <select
                    value={exp.endDate?.month || 1}
                    onChange={(e) => updateExperience(exp.id, { endDate: { month: parseInt(e.target.value), year: exp.endDate?.year || 2024 } })}
                    className="w-full px-2 py-2 rounded-lg border border-gray-200 bg-white text-sm outline-none"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('en', { month: 'short' })}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={exp.endDate?.year || 2024}
                    onChange={(e) => updateExperience(exp.id, { endDate: { month: exp.endDate?.month || 1, year: parseInt(e.target.value) } })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none text-sm"
                  />
                </div>
              ) : (
                <div className="w-full h-[38px] flex items-center px-3 bg-gray-100/50 rounded-lg text-xs text-gray-400 italic">
                  Currently working here
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-gray-600 ml-1">Key Responsibilities</label>
            <RichTextEditor
              content={exp.description}
              onChange={(html) => updateExperience(exp.id, { description: html })}
              placeholder="e.g. Led a team of 4 designers to launch the new mobile app..."
            />
          </div>
        </div>
      ))}

      <button
        onClick={addNew}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm font-medium text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
      >
        <Plus className="w-4 h-4" />
        Add Work Experience
      </button>
    </div>
  )
}
