'use client'

import React, { forwardRef, useId } from 'react'
import { ChevronDown, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value'> {
  label?: string
  value?: string
  onChange?: ((value: string) => void) | ((e: React.ChangeEvent<HTMLSelectElement>) => void)
  onValueChange?: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  error?: string
  helpText?: string
  className?: string
  containerClassName?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      value,
      onChange,
      onValueChange,
      options = [],
      placeholder,
      error,
      helpText,
      disabled = false,
      className,
      containerClassName,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const selectId = id || generatedId

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value
      onValueChange?.(val)
      if (onChange) {
        try {
          ;(onChange as any)(val)
        } catch {
          ;(onChange as any)(e)
        }
      }
    }

    return (
      <div className={cn('w-full space-y-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-slate-700 select-none"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            value={value}
            onChange={handleChange}
            disabled={disabled}
            className={cn(
              'w-full appearance-none bg-white text-slate-900 text-sm rounded-lg border transition-all duration-150',
              'px-3.5 py-2 pr-10 cursor-pointer',
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-red-900'
                : 'border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none',
              disabled && 'bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="text-slate-400">
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="text-slate-800 bg-white py-1"
              >
                {option.label}
              </option>
            ))}
          </select>

          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
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

Select.displayName = 'Select'
