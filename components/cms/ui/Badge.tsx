'use client'

import React from 'react'
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'count'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  children?: React.ReactNode
  icon?: LucideIcon
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-700 border border-slate-200',
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  danger: 'bg-red-50 text-red-600 border border-red-100',
  info: 'bg-blue-50 text-blue-700 border border-blue-200',
  count: 'bg-red-600 text-white font-semibold border border-transparent',
}

export function Badge({
  variant = 'default',
  children,
  icon: Icon,
  className,
  ...props
}: BadgeProps) {
  const isCount = variant === 'count'

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-full select-none',
        isCount
          ? 'text-[11px] min-w-[18px] h-[18px] px-1.5 leading-none'
          : 'text-xs px-2.5 py-0.5 gap-1.5',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {Icon && !isCount && <Icon className="w-3.5 h-3.5 shrink-0" />}
      {children}
    </span>
  )
}
