'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
  className?: string
  id?: string
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className,
  id,
}: ToggleProps) {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked)
    }
  }

  const toggleElement = (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={handleToggle}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2',
        checked ? 'bg-red-600' : 'bg-slate-300',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0',
          'transition-transform duration-200 ease-in-out',
          checked ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  )

  if (!label && !description) {
    return toggleElement
  }

  return (
    <div
      onClick={handleToggle}
      className={cn(
        'inline-flex items-start gap-3 select-none',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      )}
    >
      {toggleElement}
      <div className="flex flex-col text-sm">
        {label && (
          <span className="font-medium text-slate-800 leading-snug">{label}</span>
        )}
        {description && (
          <span className="text-xs text-slate-500 mt-0.5 leading-snug">
            {description}
          </span>
        )}
      </div>
    </div>
  )
}
