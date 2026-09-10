'use client'

import React, { forwardRef, useId } from 'react'
import { AlertCircle, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  label?: string
  value?: string | number
  onChange?: ((e: React.ChangeEvent<HTMLInputElement>) => void) | ((value: string) => void)
  onValueChange?: (value: string) => void
  placeholder?: string
  type?: string
  error?: string
  helpText?: string
  icon?: LucideIcon
  className?: string
  containerClassName?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      value = '',
      onChange,
      onValueChange,
      placeholder,
      type = 'text',
      error,
      helpText,
      icon: Icon,
      className,
      containerClassName,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const inputId = id || generatedId

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onValueChange?.(e.target.value)
      if (onChange) {
        try {
          ;(onChange as any)(e)
        } catch {
          ;(onChange as any)(e.target.value)
        }
      }
    }

    return (
      <div className={cn('w-full space-y-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-slate-700 select-none"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Icon className="w-4 h-4" />
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'w-full bg-white text-slate-900 placeholder:text-slate-400 text-sm rounded-lg border transition-all duration-150',
              'px-3.5 py-2',
              Icon && 'pl-9',
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-red-900'
                : 'border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none',
              disabled && 'bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200',
              className
            )}
            {...props}
          />
        </div>

        {error ? (
          <p className="flex items-center gap-1 text-xs text-red-600 mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        ) : helpText ? (
          <p className="text-xs text-slate-500 mt-1">{helpText}</p>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'
