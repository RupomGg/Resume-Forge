'use client'

import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface SectionCardProps {
  title: string
  isOpen: boolean
  onToggle: () => void
  children?: ReactNode
  className?: string
  /** Optional: show a badge/count in the header */
  badge?: string | number
}

export default function SectionCard({
  title,
  isOpen,
  onToggle,
  children,
  className,
  badge,
}: SectionCardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-gray-100 rounded-xl overflow-hidden transition-shadow duration-200',
        isOpen && 'shadow-sm',
        className
      )}
    >
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left group hover:bg-gray-50 transition-colors duration-150"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5">
          {/* Accent dot */}
          <span
            className={cn(
              'w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-200',
              isOpen ? 'bg-blue-500' : 'bg-gray-300'
            )}
          />
          <span className="text-sm font-semibold text-gray-800 select-none">
            {title}
          </span>
          {badge !== undefined && (
            <span className="ml-1 text-xs text-gray-400 font-normal">
              ({badge})
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Collapsible body */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-200 ease-in-out',
          isOpen ? 'max-h-[9999px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="border-t border-gray-100">
          {children}
        </div>
      </div>
    </div>
  )
}
