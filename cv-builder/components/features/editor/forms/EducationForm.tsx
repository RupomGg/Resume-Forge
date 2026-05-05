'use client'

import { useCVStore } from '@/store/cv-store'
import { Plus, Trash2, Calendar, GraduationCap } from 'lucide-react'
import RichTextEditor from '../RichTextEditor'
import { generateId } from '@/lib/utils'

export default function EducationForm() {
  const { education, addEducation, updateEducation, removeEducation } = useCVStore()

  const addNew = () => {
    addEducation()
  }

  return (
    <div className="p-4 space-y-6">
      {education.map((edu, index) => (
        <div 
          key={edu.id} 
          className="relative p-4 rounded-xl border border-gray-100 bg-gray-50/30 space-y-4 group transition-all hover:border-gray-200 hover:shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
              <GraduationCap className="w-3 h-3" /> Education #{index + 1}
            </span>
            <button
              onClick={() => removeEducation(edu.id)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 ml-1">Degree / Field of Study</label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                placeholder="e.g. B.S. in Computer Science"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 ml-1">Institution</label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                placeholder="e.g. Stanford University"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 ml-1">GPA (Optional)</label>
              <input
                type="text"
                value={edu.gpa}
                onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                placeholder="e.g. 3.8 / 4.0"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 ml-1 flex items-center gap-1.5">
                <Calendar className="w-3 h-3" /> Start Date
              </label>
              <div className="flex gap-2">
                <select
                  value={edu.startDate.month}
                  onChange={(e) => updateEducation(edu.id, { startDate: { ...edu.startDate, month: parseInt(e.target.value) } })}
                  className="w-full px-2 py-2 rounded-lg border border-gray-200 bg-white text-sm outline-none"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('en', { month: 'short' })}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={edu.startDate.year}
                  onChange={(e) => updateEducation(edu.id, { startDate: { ...edu.startDate, year: parseInt(e.target.value) } })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 ml-1 flex items-center gap-1.5 justify-between">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" /> End Date
                </div>
                <label className="flex items-center gap-1 text-[10px] font-normal cursor-pointer">
                  <input
                    type="checkbox"
                    checked={edu.current}
                    onChange={(e) => updateEducation(edu.id, { current: e.target.checked })}
                    className="w-3 h-3 rounded text-blue-600"
                  />
                  Ongoing
                </label>
              </label>
              {!edu.current ? (
                <div className="flex gap-2">
                  <select
                    value={edu.endDate?.month || 1}
                    onChange={(e) => updateEducation(edu.id, { endDate: { month: parseInt(e.target.value), year: edu.endDate?.year || 2024 } })}
                    className="w-full px-2 py-2 rounded-lg border border-gray-200 bg-white text-sm outline-none"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('en', { month: 'short' })}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={edu.endDate?.year || 2024}
                    onChange={(e) => updateEducation(edu.id, { endDate: { month: edu.endDate?.month || 1, year: parseInt(e.target.value) } })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none text-sm"
                  />
                </div>
              ) : (
                <div className="w-full h-[38px] flex items-center px-3 bg-gray-100/50 rounded-lg text-xs text-gray-400 italic">
                  Currently studying
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-gray-600 ml-1">Relevant Coursework / Activities</label>
            <RichTextEditor
              content={edu.description}
              onChange={(html) => updateEducation(edu.id, { description: html })}
              placeholder="e.g. Dean's List, Lead Developer for University Coding Club..."
            />
          </div>
        </div>
      ))}

      <button
        onClick={addNew}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm font-medium text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
      >
        <Plus className="w-4 h-4" />
        Add Education
      </button>
    </div>
  )
}
