'use client'

import { useCVStore } from '@/store/cv-store'
import { cn } from '@/lib/utils'

export default function SidebarHeader() {
  const { personal, experience, education, skills, projects } = useCVStore()

  // Simple formula for resume strength
  const sections = [
    personal.fullName,
    personal.email,
    experience.length > 0,
    education.length > 0,
    skills.categories.length > 0,
    projects.length > 0
  ]
  const strength = Math.round((sections.filter(Boolean).length / sections.length) * 100)

  const initials = personal.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="bg-surface-container-low/30 p-6 flex flex-col gap-6 flex-shrink-0 border-b border-outline-variant/30">
      {/* User Card */}
      <div className="flex items-center gap-4 group">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl border-2 border-outline-variant/50 flex items-center justify-center bg-secondary-container/50 text-primary font-manrope text-lg font-black overflow-hidden shadow-sm group-hover:border-primary/40 transition-colors duration-300">
            {personal.photoUrl ? (
              <img src={personal.photoUrl} alt={personal.fullName} className="w-full h-full object-cover" />
            ) : (
              initials || '?'
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary border-2 border-surface rounded-lg flex items-center justify-center shadow-sm">
            <div className="w-1.5 h-1.5 bg-surface rounded-full animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-manrope text-[15px] font-bold text-on-surface tracking-tight group-hover:text-primary transition-colors">
            {personal.fullName || 'Your Name'}
          </span>
          <span className="font-work-sans text-[11px] font-medium text-outline truncate max-w-[160px]">
            {personal.email || 'email@example.com'}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between font-work-sans text-[11px] font-bold text-outline uppercase tracking-wider">
          <span className="opacity-80">Profile completion</span>
          <span className="text-primary">{strength}%</span>
        </div>
        <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden shadow-inner p-[1px]">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-1000 ease-in-out shadow-[0_0_8px_rgba(21,66,18,0.4)]"
            style={{ width: `${strength}%` }}
          />
        </div>
      </div>
    </div>
  )
}
