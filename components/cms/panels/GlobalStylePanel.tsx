'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Sparkles } from 'lucide-react'

interface GlobalStylePanelProps {
  onClose?: () => void
}

function ColorSwatch({ label, color, onChange }: { label: string; color: string; onChange: (c: string) => void }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-slate-600">{label}</span>
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg border border-slate-200 shadow-sm cursor-pointer"
          style={{ backgroundColor: color }}
        />
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-600 font-mono focus:outline-none focus:ring-1 focus:ring-red-500"
        />
      </div>
    </div>
  )
}

function StyleSection({ title, defaultOpen, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen ?? false)
  return (
    <div className="border-b border-slate-100">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3.5 text-sm font-semibold text-slate-700 hover:text-slate-900 transition cursor-pointer"
      >
        <span>{title}</span>
        {open ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
      </button>
      {open && <div className="pb-4 space-y-1">{children}</div>}
    </div>
  )
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-slate-600">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${checked ? 'bg-red-600' : 'bg-slate-300'}`}
      >
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  )
}

export function GlobalStylePanel({ onClose }: GlobalStylePanelProps) {
  const [primaryColor, setPrimaryColor] = useState('#DC2626')
  const [secondaryColor, setSecondaryColor] = useState('#080807')
  const [bgColor, setBgColor] = useState('#080807')
  const [fontFamily, setFontFamily] = useState('Montserrat')
  const [spacing, setSpacing] = useState('Moyen')
  const [borderRadius, setBorderRadius] = useState(10)
  const [shadows, setShadows] = useState(true)
  const [animations, setAnimations] = useState(true)
  const [transitions, setTransitions] = useState(true)

  return (
    <div className="w-72 flex-shrink-0 bg-white border-l border-slate-200 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">Style global</h3>
        {onClose && (
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer">
            ✕
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4">
        {/* Couleurs */}
        <StyleSection title="Couleurs" defaultOpen>
          <ColorSwatch label="Primaire" color={primaryColor} onChange={setPrimaryColor} />
          <ColorSwatch label="Secondaire" color={secondaryColor} onChange={setSecondaryColor} />
          <ColorSwatch label="Fond" color={bgColor} onChange={setBgColor} />
        </StyleSection>

        {/* Typographie */}
        <StyleSection title="Typographie" defaultOpen>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-slate-600 font-semibold">{fontFamily}</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-[11px] text-slate-400">(Titres &amp; textes)</p>
        </StyleSection>

        {/* Espacement */}
        <StyleSection title="Espacement">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-slate-600 font-semibold">{spacing}</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-[11px] text-slate-400">(Par défaut)</p>
        </StyleSection>

        {/* Arrondis */}
        <StyleSection title="Arrondis">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-slate-600">{borderRadius}px</span>
            <input
              type="range"
              min={0}
              max={24}
              value={borderRadius}
              onChange={(e) => setBorderRadius(Number(e.target.value))}
              className="w-32 accent-red-600"
            />
          </div>
        </StyleSection>

        {/* Effet visuel */}
        <StyleSection title="Effet visuel" defaultOpen>
          <ToggleRow label="Ombres" checked={shadows} onChange={setShadows} />
          <ToggleRow label="Animations" checked={animations} onChange={setAnimations} />
          <ToggleRow label="Transitions douces" checked={transitions} onChange={setTransitions} />
        </StyleSection>
      </div>

      {/* CTA Card */}
      <div className="p-4 border-t border-slate-100">
        <div className="bg-red-50 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-600" />
            <span className="text-sm font-bold text-red-700">Votre site, votre style</span>
          </div>
          <p className="text-[11px] text-red-600/70 leading-relaxed">
            Personnalisez chaque détail pour une expérience unique.
          </p>
        </div>
      </div>
    </div>
  )
}
