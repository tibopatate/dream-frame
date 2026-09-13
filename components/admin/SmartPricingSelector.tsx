'use client'

import { useState, useEffect } from 'react'
import { FRAME_FORMAT_PRESETS, FrameFormatPreset, getFramePresetByPrice } from '@/lib/frame-formats'
import { Check, Layers, SlidersHorizontal, Sparkles } from 'lucide-react'

interface SmartPricingSelectorProps {
  initialPrice?: number
  initialFormatName?: string
  initialFormatSize?: string
  onChange?: (data: { price: number; formatName: string; formatSize: string }) => void
}

export function SmartPricingSelector({
  initialPrice = 49.90,
  initialFormatName,
  initialFormatSize,
  onChange,
}: SmartPricingSelectorProps) {
  const currentPreset = getFramePresetByPrice(initialPrice)
  const [selectedId, setSelectedId] = useState<string>(currentPreset.id)
  const [price, setPrice] = useState<number>(initialPrice)
  const [formatName, setFormatName] = useState<string>(initialFormatName || currentPreset.name)
  const [formatSize, setFormatSize] = useState<string>(initialFormatSize || currentPreset.innerSize)
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false)

  const handleSelectPreset = (preset: FrameFormatPreset) => {
    setSelectedId(preset.id)
    setPrice(preset.price)
    setFormatName(preset.name)
    setFormatSize(preset.innerSize)
    setIsCustomMode(false)
    onChange?.({
      price: preset.price,
      formatName: preset.name,
      formatSize: preset.innerSize,
    })
  }

  const handleCustomPriceChange = (newPrice: number) => {
    setPrice(newPrice)
    onChange?.({
      price: newPrice,
      formatName,
      formatSize,
    })
  }

  const handleCustomSizeChange = (newSize: string) => {
    setFormatSize(newSize)
    onChange?.({
      price,
      formatName,
      formatSize: newSize,
    })
  }

  return (
    <div className="space-y-4">
      {/* Hidden inputs pour la soumission automatique via FormData */}
      <input type="hidden" name="price" value={price} />
      <input type="hidden" name="formatName" value={formatName} />
      <input type="hidden" name="formatSize" value={formatSize} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-0.5">
          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            Format d&apos;Atelier &amp; Taille de l&apos;Espace dans le Cadre
          </label>
          <p className="text-[11px] text-neutral-400">
            Sélectionnez en 1 clic le format d&apos;exposition. Le prix et la taille intérieure sont configurés automatiquement.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCustomMode(!isCustomMode)}
          className="text-[11px] font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer transition"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{isCustomMode ? 'Revenir aux formats standards' : 'Ajuster manuellement'}</span>
        </button>
      </div>

      {/* Cartes de Sélection Intelligente */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {FRAME_FORMAT_PRESETS.map((preset) => {
          const isSelected = !isCustomMode && selectedId === preset.id

          return (
            <div
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between text-left select-none ${
                isSelected
                  ? 'bg-amber-400/10 border-amber-400 ring-1 ring-amber-400 shadow-lg shadow-amber-400/5'
                  : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/60'
              }`}
            >
              {/* Badge Taille Espace Intérieur */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="space-y-1">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block ${
                    isSelected
                      ? 'bg-amber-400 text-black font-extrabold'
                      : 'bg-neutral-900 text-neutral-300 border border-neutral-800'
                  }`}>
                    Espace : {preset.innerSize}
                  </span>
                  <h4 className="text-xs font-bold text-white">{preset.name}</h4>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition ${
                    isSelected
                      ? 'bg-amber-400 border-amber-400 text-black'
                      : 'border-neutral-700 bg-neutral-900 text-transparent'
                  }`}
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              </div>

              {/* Prix et Échelle */}
              <div className="pt-2 border-t border-neutral-800/80 flex items-baseline justify-between">
                <div>
                  <span className="text-lg sm:text-xl font-black text-white font-mono">
                    {preset.price.toFixed(2).replace('.', ',')} €
                  </span>
                  <span className="text-[10px] text-neutral-400 ml-1">TTC</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-400">
                  {preset.scale}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Mode Sur-Mesure / Ajustement Manuel */}
      {isCustomMode && (
        <div className="p-4 rounded-2xl bg-neutral-950 border border-amber-400/40 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Configuration personnalisée du tarif et des dimensions</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-neutral-400 uppercase font-bold block mb-1">
                Prix Vente (€ TTC)
              </label>
              <input
                type="number"
                step="0.01"
                min={0}
                value={price}
                onChange={(e) => handleCustomPriceChange(parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-[10px] text-neutral-400 uppercase font-bold block mb-1">
                Taille Espace dans le Cadre
              </label>
              <input
                type="text"
                value={formatSize}
                onChange={(e) => handleCustomSizeChange(e.target.value)}
                placeholder="Ex: 10 × 15 cm, 30 × 40 cm..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-[10px] text-neutral-400 uppercase font-bold block mb-1">
                Nom du Format
              </label>
              <input
                type="text"
                value={formatName}
                onChange={(e) => {
                  setFormatName(e.target.value)
                  onChange?.({ price, formatName: e.target.value, formatSize })
                }}
                placeholder="Ex: Petit Cadre Standard"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* Récapitulatif sélectionné */}
      <div className="py-2 px-3 rounded-xl bg-neutral-950/70 border border-neutral-800 flex items-center justify-between text-xs text-neutral-300">
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Espace intérieur dans le cadre configuré : <strong className="text-white font-mono">{formatSize}</strong></span>
        </span>
        <span className="font-mono text-amber-400 font-bold">
          {price.toFixed(2).replace('.', ',')} € TTC
        </span>
      </div>
    </div>
  )
}
