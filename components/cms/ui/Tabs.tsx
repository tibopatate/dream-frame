'use client'

import React from 'react'
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TabItem {
  id: string
  label: string
  icon?: LucideIcon
  badge?: React.ReactNode
  disabled?: boolean
}

export interface TabsProps {
  tabs: TabItem[]
  activeTab: string
  onChange: (tabId: string) => void
  className?: string
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn('w-full border-b border-slate-200', className)}>
      <nav
        role="tablist"
        className="flex items-center space-x-1 -mb-px overflow-x-auto no-scrollbar"
        aria-label="Tabs"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          const TabIcon = tab.icon

          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              aria-selected={isActive}
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={cn(
                'group inline-flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-all select-none whitespace-nowrap',
                'focus:outline-none focus-visible:text-red-600 focus-visible:border-red-600',
                isActive
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300',
                tab.disabled && 'opacity-40 cursor-not-allowed hover:text-slate-500 hover:border-transparent'
              )}
            >
              {TabIcon && (
                <TabIcon
                  className={cn(
                    'w-4 h-4 transition-colors',
                    isActive ? 'text-red-600' : 'text-slate-400 group-hover:text-slate-600'
                  )}
                />
              )}
              <span>{tab.label}</span>

              {tab.badge && (
                <span className="ml-1 inline-flex items-center">
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
