'use client'

import { Layout, FileText, Palette, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TabItemProps {
  id: string
  label: string
  icon: any
  isActive: boolean
  onClick: () => void
}

function TabItem({ id, label, icon: Icon, isActive, onClick }: TabItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 px-6 py-3 font-work-sans text-[13px] font-bold transition-all duration-300 relative group",
        isActive 
          ? "text-primary" 
          : "text-outline hover:text-on-surface hover:bg-surface-container-high/50"
      )}
    >
      <Icon className={cn("w-3.5 h-3.5 transition-transform duration-300", isActive ? "text-primary scale-110" : "text-outline group-hover:scale-110")} />
      {label}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary transition-all duration-300 transform origin-left",
        isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0 group-hover:scale-x-50 group-hover:opacity-30"
      )} />
    </button>
  )
}

export default function TopTabBar() {
  const activeTab = 'content'

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Layout },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'customize', label: 'Customize', icon: Palette },
  ]

  return (
    <div className="bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/30 flex flex-row flex-shrink-0 sticky top-0 z-10 shadow-sm">
      {tabs.map((tab) => (
        <TabItem
          key={tab.id}
          {...tab}
          isActive={activeTab === tab.id}
          onClick={() => {}} 
        />
      ))}
    </div>
  )
}
