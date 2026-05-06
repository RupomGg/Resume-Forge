import SidebarHeader from './SidebarHeader'
import TopTabBar from './TopTabBar'
import SidebarFooter from './SidebarFooter'
import ContentPanel from './ContentPanel'
import CustomizePanel from './CustomizePanel'
import TemplatesPanel from './TemplatesPanel'

import { useCVStore } from '@/store/cv-store'

interface LeftPanelProps {
  onManageClick: () => void
}

export default function LeftPanel({ onManageClick }: LeftPanelProps) {
  const { activeTab } = useCVStore()

  return (
    <aside
      id="left-panel"
      className="flex flex-col h-full bg-surface overflow-hidden flex-shrink-0 transition-all duration-300"
      style={{ width: '100%' }}
    >
      <TopTabBar />
      
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'content' && (
          <>
            <SidebarHeader />
            <ContentPanel onManageClick={onManageClick} />
          </>
        )}
        
        {activeTab === 'customize' && (
          <div className="flex-1 overflow-y-auto">
            <CustomizePanel />
          </div>
        )}
        
        {activeTab === 'templates' && (
          <div className="flex-1 overflow-y-auto">
            <TemplatesPanel />
          </div>
        )}
      </div>

      <SidebarFooter />
    </aside>
  )
}

