'use client'

import React, { forwardRef } from 'react'
import { Loader2, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm border border-transparent',
  secondary:
    'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 shadow-sm',
  ghost:
    'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 border border-transparent',
  danger:
    'bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200 border border-red-100',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-xs px-2.5 py-1.5 gap-1.5 rounded-lg',
  md: 'text-sm px-3.5 py-2 gap-2 rounded-lg',
  lg: 'text-base px-5 py-2.5 gap-2.5 rounded-lg',
}

const iconSizes: Record<ButtonSize, string> = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      icon: Icon,
      iconPosition = 'left',
      children,
      className,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors select-none',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className={cn('animate-spin shrink-0', iconSizes[size])} />
        ) : Icon && iconPosition === 'left' ? (
          <Icon className={cn('shrink-0', iconSizes[size])} />
        ) : null}

        {children}

        {!loading && Icon && iconPosition === 'right' ? (
          <Icon className={cn('shrink-0', iconSizes[size])} />
        ) : null}
      </button>
    )
  }
)

Button.displayName = 'Button'
