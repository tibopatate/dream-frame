'use client'

import React, { useRef, useId } from 'react'
import { cn } from '@/lib/utils'

export interface ColorPickerProps {
  label?: string
  value: string
  onChange: (color: string) => void
  presets?: string[]
  disabled?: boolean
  className?: string
  helpText?: string
}

const DEFAULT_PRESETS = [
  '#DC2626', // Dream Frame Red
  '#B91C1C', // Deep Red
  '#080807', // Dark Obsidian
  '#1E293B', // Slate 800
  '#475569', // Slate 600
  '#94A3B8', // Slate 400
  '#F1F5F9', // Slate 100
  '#FFFFFF', // White
]

function normalizeHex(hex: string): string {
  if (!hex) return '#000000'
  let clean = hex.trim()
  if (!clean.startsWith('#')) {
    clean = `#${clean}`
  }
  return clean
}

function isValidHex(hex: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex)
}

export function ColorPicker({
  label,
  value,
  onChange,
  presets = DEFAULT_PRESETS,
  disabled = false,
  className,
  helpText,
}: ColorPickerProps) {
  const id = useId()
  const nativeInputRef = useRef<HTMLInputElement>(null)

  const normalizedValue = normalizeHex(value || '#DC2626')
  const validColorForPicker = isValidHex(normalizedValue)
    ? normalizedValue.length === 4
      ? `#${normalizedValue[1]}${normalizedValue[1]}${normalizedValue[2]}${normalizedValue[2]}${normalizedValue[3]}${normalizedValue[3]}`
      : normalizedValue
    : '#DC2626'

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newVal = e.target.value
    if (!newVal.startsWith('#')) {
      newVal = `#${newVal}`
    }
    onChange(newVal)
  }

  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleCircleClick = () => {
    if (!disabled && nativeInputRef.current) {
      nativeInputRef.current.click()
    }
  }

  return (
    <div className={cn('w-full space-y-2', className)}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-slate-700 select-none"
        >
          {label}
        </label>
      )}

      {/* Main input row: Preview circle + Hex text input */}
      <div className="flex items-center gap-2">
        {/* Hidden native picker */}
        <input
          ref={nativeInputRef}
          type="color"
          value={validColorForPicker}
          onChange={handleNativeChange}
          disabled={disabled}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        />

        {/* Clickable color preview circle */}
        <button
          type="button"
          disabled={disabled}
          onClick={handleCircleClick}
          title="Ouvrir le sélecteur de couleur"
          className={cn(
            'relative w-9 h-9 shrink-0 rounded-full border border-slate-200 shadow-sm transition-transform active:scale-95',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2',
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-slate-400'
          )}
          style={{ backgroundColor: normalizedValue }}
        >
          {/* Subtle inner shadow for light colors */}
          <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/10" />
        </button>

        {/* Hex code input */}
        <div className="relative flex-1">
          <input
            id={id}
            type="text"
            value={value}
            onChange={handleTextChange}
            disabled={disabled}
            placeholder="#DC2626"
            maxLength={9}
            className={cn(
              'w-full bg-white text-slate-900 placeholder:text-slate-400 font-mono text-xs uppercase rounded-lg border border-slate-200',
              'px-3 py-2 transition-all duration-150',
              'focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none',
              disabled && 'bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200'
            )}
          />
        </div>
      </div>

      {/* Preset swatches row */}
      {presets.length > 0 && (
        <div className="pt-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            {presets.map((preset) => {
              const isSelected =
                normalizedValue.toLowerCase() === preset.toLowerCase()
              return (
                <button
                  key={preset}
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange(preset)}
                  title={preset}
                  className={cn(
                    'relative w-6 h-6 rounded-full border border-slate-200 transition-all active:scale-90',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500',
                    isSelected
                      ? 'ring-2 ring-red-500 ring-offset-1 border-transparent scale-110 z-10'
                      : 'hover:scale-105',
                    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  )}
                  style={{ backgroundColor: preset }}
                >
                  <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/10" />
                </button>
              )
            })}
          </div>
        </div>
      )}

      {helpText && <p className="text-xs text-slate-500 mt-1">{helpText}</p>}
    </div>
  )
}
