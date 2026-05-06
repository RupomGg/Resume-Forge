'use client'

import { ChevronDown, Eye, EyeOff, Trash2, Edit2, AlignLeft, AlignJustify, Underline as UnderlineIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ReactNode, useState, useRef, useEffect } from 'react'

interface SectionCardProps {
  id: string
  title: string
  isOpen: boolean
  onToggle: () => void
  children?: ReactNode
  className?: string
  badge?: string | number
  visible?: boolean
  onVisibilityToggle?: (e: React.MouseEvent) => void
  onDelete?: (e: React.MouseEvent) => void
  onTitleChange?: (newTitle: string) => void
  icon?: any
}

export default function SectionCard({
  id,
  title,
  isOpen,
  onToggle,
  children,
  className,
  badge,
  visible = true,
  onVisibilityToggle,
  onDelete,
  onTitleChange,
  icon: Icon,
}: SectionCardProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState(title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditingTitle])

  const handleTitleSubmit = (e: React.FormEvent | React.FocusEvent) => {
    e.preventDefault()
    if (editedTitle.trim() && editedTitle !== title) {
      onTitleChange?.(editedTitle)
    } else {
      setEditedTitle(title)
    }
    setIsEditingTitle(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleTitleSubmit(e)
    if (e.key === 'Escape') {
      setEditedTitle(title)
      setIsEditingTitle(false)
    }
  }

  return (
    <div
      className={cn(
        'mx-4 my-2 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]',
        isOpen 
          ? 'rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] scale-[1.01]' 
          : 'rounded-xl shadow-sm hover:shadow-md active:scale-[0.99]',
        className
      )}
    >
      {/* Header */}
      <div
        onClick={onToggle}
        className={cn(
          "w-full flex items-center gap-3.5 px-5 py-4 text-left transition-all duration-300 border border-outline-variant/30 cursor-pointer group",
          isOpen 
            ? "bg-surface-container-lowest border-primary border-l-[4px] rounded-t-xl" 
            : "bg-surface/50 hover:bg-surface border-outline-variant/50 hover:border-primary/30 rounded-xl"
        )}
      >
        <div className={cn(
          "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm",
          isOpen ? "bg-primary text-surface rotate-6 shadow-primary/20" : "bg-surface-container text-outline group-hover:bg-secondary-container group-hover:text-primary"
        )}>
          {Icon && (
            <Icon className="w-4.5 h-4.5" />
          )}
        </div>
        
        {isEditingTitle ? (
          <form 
            onSubmit={handleTitleSubmit} 
            className="flex-1 flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              ref={inputRef}
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-surface border-2 border-primary/50 px-3 py-1 rounded-lg text-[13px] font-bold text-on-surface focus:outline-none shadow-inner"
            />
          </form>
        ) : (
          <div 
            className="flex-1 flex items-center gap-2 group/title"
            onDoubleClick={() => onTitleChange && setIsEditingTitle(true)}
          >
            <span className={cn(
              "font-manrope text-[14px] font-bold tracking-tight transition-colors",
              isOpen ? "text-primary" : "text-on-surface",
              !visible && "text-outline/50 line-through"
            )}>
              {title}
            </span>
            {onTitleChange && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditingTitle(true)
                }}
                className="opacity-0 group-hover/title:opacity-100 p-1.5 rounded-lg hover:bg-surface-container transition-all"
                title="Rename section"
              >
                <Edit2 className="w-3 h-3 text-outline" />
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Eye Toggle (Visibility) */}
          {onVisibilityToggle && (
            <button 
              onClick={(e) => {
                e.stopPropagation()
                onVisibilityToggle(e)
              }}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300",
                !visible 
                  ? "text-outline/30 bg-surface-container-high/30" 
                  : "text-outline hover:bg-secondary-container/50 hover:text-primary"
              )}
              title={visible ? "Hide from resume" : "Show on resume"}
            >
              {visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Delete Button */}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(e)
              }}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-outline hover:bg-error-container hover:text-on-error-container transition-all duration-300"
              title="Delete section"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Badge */}
          {badge !== undefined && (
            <span className={cn(
              "min-w-[22px] h-[22px] flex items-center justify-center rounded-lg font-work-sans text-[11px] font-black transition-all duration-300 px-1.5",
              isOpen 
                ? "bg-primary text-surface shadow-sm shadow-primary/20" 
                : "bg-surface-container-highest text-on-surface-variant"
            )}>
              {badge}
            </span>
          )}

          {/* Chevron */}
          <div className={cn(
            "w-6 h-6 flex items-center justify-center transition-all duration-300 rounded-lg",
            isOpen ? "bg-primary/10 text-primary" : "text-outline group-hover:text-primary"
          )}>
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform duration-500",
                isOpen ? "rotate-180" : ""
              )}
            />
          </div>
        </div>
      </div>

      {/* Body */}
      {isOpen && (
        <div className="bg-surface-container-lowest border-t border-outline-variant/20 animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="p-5">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}
