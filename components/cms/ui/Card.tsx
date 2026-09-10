'use client'

import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  selected?: boolean
  hovered?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, onClick, selected = false, hovered = false, ...props }, ref) => {
    const isInteractive = Boolean(onClick)

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          'bg-white border border-slate-200 rounded-xl shadow-sm transition-all',
          isInteractive && 'cursor-pointer hover:border-slate-300 hover:shadow-md',
          hovered && 'border-slate-300 shadow-md',
          selected && 'ring-2 ring-red-500 border-red-500',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
