'use client'

import React, { useState } from 'react'
import { ChevronDown, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AccordionItem {
  id?: string
  title: string
  subtitle?: string
  content: React.ReactNode
  defaultOpen?: boolean
  icon?: LucideIcon
  badge?: React.ReactNode
  disabled?: boolean
}

export interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  className?: string
}

export function Accordion({
  items,
  allowMultiple = true,
  className,
}: AccordionProps) {
  const [openIndices, setOpenIndices] = useState<number[]>(() => {
    return items
      .map((item, idx) => (item.defaultOpen ? idx : -1))
      .filter((idx) => idx !== -1)
  })

  const toggleItem = (index: number) => {
    setOpenIndices((prev) => {
      const isOpen = prev.includes(index)
      if (allowMultiple) {
        return isOpen ? prev.filter((i) => i !== index) : [...prev, index]
      } else {
        return isOpen ? [] : [index]
      }
    })
  }

  return (
    <div className={cn('w-full border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm divide-y divide-slate-200', className)}>
      {items.map((item, index) => {
        const isOpen = openIndices.includes(index)
        const ItemIcon = item.icon

        return (
          <div key={item.id || index} className="group">
            <button
              type="button"
              disabled={item.disabled}
              onClick={() => toggleItem(index)}
              className={cn(
                'w-full flex items-center justify-between p-4 text-left transition-colors',
                'hover:bg-slate-50 focus:outline-none focus-visible:bg-slate-50',
                item.disabled && 'opacity-50 cursor-not-allowed hover:bg-white',
                isOpen && 'bg-slate-50/60'
              )}
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                {ItemIcon && (
                  <ItemIcon
                    className={cn(
                      'w-4 h-4 shrink-0 transition-colors',
                      isOpen ? 'text-red-600' : 'text-slate-400 group-hover:text-slate-600'
                    )}
                  />
                )}
                <div className="flex flex-col min-w-0">
                  <span
                    className={cn(
                      'text-sm font-semibold truncate transition-colors',
                      isOpen ? 'text-red-600' : 'text-slate-800'
                    )}
                  >
                    {item.title}
                  </span>
                  {item.subtitle && (
                    <span className="text-xs text-slate-500 mt-0.5 truncate">
                      {item.subtitle}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {item.badge && <div>{item.badge}</div>}
                <ChevronDown
                  className={cn(
                    'w-4 h-4 text-slate-400 transition-transform duration-200 ease-out',
                    isOpen && 'transform rotate-180 text-red-600'
                  )}
                />
              </div>
            </button>

            {/* Smooth transition container */}
            <div
              className={cn(
                'grid transition-[grid-template-rows] duration-200 ease-out',
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              )}
            >
              <div className="overflow-hidden">
                <div className="p-4 pt-1 text-sm text-slate-600 border-t border-slate-100 bg-white">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
