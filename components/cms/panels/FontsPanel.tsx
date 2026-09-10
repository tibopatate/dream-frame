'use client'

import { useState } from 'react'
import { Type, Check } from 'lucide-react'

interface FontOption {
  id: string
  name: string
  category: string
  sample: string
  fontFamily: string
}

export function FontsPanel() {
  const [fonts] = useState<FontOption[]>([
    { id: 'poppins', name: 'Poppins', category: 'Sans-serif moderne', sample: 'L\'ART DE CAPTURER L\'EXCEPTIONNEL', fontFamily: 'Poppins, sans-serif' },
    { id: 'montserrat', name: 'Montserrat', category: 'Géométrique luxe', sample: 'AUTOMOBILE D\'ART & CADRES 3D', fontFamily: 'Montserrat, sans-serif' },
    { id: 'inter', name: 'Inter', category: 'Néo-grotesque neutre', sample: 'Manufacture française de prestige', fontFamily: 'Inter, sans-serif' },
    { id: 'syne', name: 'Syne', category: 'Design affirmé contemporain', sample: 'FERRARI F40 ÉDITION LIMITÉE', fontFamily: 'Syne, sans-serif' },
    { id: 'cinzel', name: 'Cinzel', category: 'Serif classique romain', sample: 'ATELIER DE MAÎTRE ÉBÉNISTE', fontFamily: 'Cinzel, serif' },
  ])

  const [selectedFont, setSelectedFont] = useState('poppins')
  const [uppercaseHeadings, setUppercaseHeadings] = useState(true)
  const [letterSpacing, setLetterSpacing] = useState('wide')

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-6">
      <div>
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Type className="w-5 h-5 text-red-600" />
          Polices &amp; Typographies
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Harmonisez l&apos;identité visuelle du site avec une typographie haut de gamme uniforme.
        </p>
      </div>

      {/* Font list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Famille Principale</h3>
          <span className="text-[11px] text-slate-400 font-mono">1 seule police recommandée</span>
        </div>

        <div className="space-y-2.5">
          {fonts.map((f) => {
            const isSelected = selectedFont === f.id
            return (
              <div
                key={f.id}
                onClick={() => setSelectedFont(f.id)}
                className={`p-3.5 bg-white border rounded-xl transition cursor-pointer shadow-xs ${
                  isSelected
                    ? 'border-red-500 ring-2 ring-red-500/10 bg-red-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900">{f.name}</span>
                    <span className="text-[10px] text-slate-400 ml-2">({f.category})</span>
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <p
                  className="mt-2 text-sm text-slate-800 tracking-wider truncate"
                  style={{ fontFamily: f.fontFamily }}
                >
                  {f.sample}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Typographic rules */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Règles de style</h3>

        <div className="space-y-2">
          <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800">Titres en Majuscules (Uppercase)</p>
              <p className="text-[10px] text-slate-400">Style galerie d&apos;art automobile premium</p>
            </div>
            <button
              type="button"
              onClick={() => setUppercaseHeadings(!uppercaseHeadings)}
              className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${
                uppercaseHeadings ? 'bg-red-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                  uppercaseHeadings ? 'translate-x-4.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-800">Espacement des Lettres (Tracking)</p>
              <span className="text-xs font-mono text-slate-500 uppercase">{letterSpacing}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {[
                { label: 'Normal', value: 'normal' },
                { label: 'Espacé', value: 'wide' },
                { label: 'Ultra-Large', value: 'widest' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setLetterSpacing(opt.value)}
                  className={`py-1.5 px-2 text-center rounded-lg border text-xs transition cursor-pointer ${
                    letterSpacing === opt.value
                      ? 'border-red-500 bg-red-50 text-red-600 font-semibold'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
