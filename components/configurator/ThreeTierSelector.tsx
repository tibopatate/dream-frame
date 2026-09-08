'use client'

import { ConfigOption } from '@/lib/configurator-data'
import Image from 'next/image'

interface ThreeTierSelectorProps {
  dimensions: ConfigOption[]
  selectedDimensionId: string
  onSelectDimension: (id: string) => void

  cars: ConfigOption[]
  selectedCarId: string
  onSelectCar: (id: string) => void

  scales: ConfigOption[]
  selectedScaleId: string
  onSelectScale: (id: string) => void
}

export function ThreeTierSelector({
  dimensions,
  selectedDimensionId,
  onSelectDimension,
  cars,
  selectedCarId,
  onSelectCar,
  scales,
  selectedScaleId,
  onSelectScale,
}: ThreeTierSelectorProps) {
  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      {/* ─── RANGÉE 1 (EN HAUT) : LE FORMAT DU CADRE ───────────────────────── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
            1. Choisissez la taille du cadre
          </span>
          <span className="text-[10px] font-mono text-amber-400">Glissez horizontalement →</span>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar py-1 snap-x snap-mandatory">
          {dimensions.map((dim) => {
            const isSelected = dim.id === selectedDimensionId
            return (
              <button
                key={dim.id}
                type="button"
                onClick={() => onSelectDimension(dim.id)}
                className={`snap-start flex-shrink-0 px-4 py-3 rounded-xl border text-left transition-all duration-200 flex items-center gap-3 cursor-pointer min-w-[170px] sm:min-w-[190px] ${
                  isSelected
                    ? 'bg-neutral-800 border-amber-400/90 text-white shadow-lg shadow-amber-400/5'
                    : 'bg-neutral-900/90 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'
                }`}
              >
                {/* Icône miniature de proportion cadre */}
                <div
                  className={`w-7 h-9 rounded border flex-shrink-0 flex items-center justify-center text-[7px] font-mono ${
                    isSelected ? 'border-amber-400 bg-amber-400/10 text-amber-300' : 'border-neutral-700 bg-black/40 text-neutral-500'
                  }`}
                >
                  3D
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate text-white">{dim.name}</p>
                  <p className="text-[10px] font-mono text-neutral-400">{dim.subtitle}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ─── RANGÉE 2 (AU MILIEU) : LE MODÈLE AUTOMOBILE ───────────────────── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
            2. Choisissez l'automobile
          </span>
          <span className="text-[10px] font-mono text-amber-400">Glissez horizontalement →</span>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar py-1 snap-x snap-mandatory">
          {cars.map((car) => {
            const isSelected = car.id === selectedCarId
            return (
              <button
                key={car.id}
                type="button"
                onClick={() => onSelectCar(car.id)}
                className={`snap-start flex-shrink-0 p-3 rounded-xl border text-left transition-all duration-200 flex items-center gap-3 cursor-pointer min-w-[210px] sm:min-w-[230px] ${
                  isSelected
                    ? 'bg-neutral-800 border-amber-400/90 text-white shadow-lg shadow-amber-400/5'
                    : 'bg-neutral-900/90 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'
                }`}
              >
                {/* Vignette Photo */}
                <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-black border border-neutral-800 flex-shrink-0">
                  {car.imageUrl && (
                    <Image src={car.imageUrl} alt={car.name} fill className="object-cover" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate text-white">{car.name}</p>
                  <p className="text-[10px] font-mono text-amber-400/90">{car.subtitle}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ─── RANGÉE 3 (EN BAS) : L'ÉCHELLE MINIATURE (1:64, 1:43, 1:24, 1:18) ── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
            3. Choisissez l'échelle
          </span>
          <span className="text-[10px] font-mono text-amber-400">1:18 Disponible</span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1 snap-x snap-mandatory">
          {scales.map((scale) => {
            const isSelected = scale.id === selectedScaleId
            return (
              <button
                key={scale.id}
                type="button"
                onClick={() => onSelectScale(scale.id)}
                className={`snap-start flex-1 min-w-[100px] py-3 px-3 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400 text-black border-amber-400 font-bold shadow-lg shadow-amber-400/10'
                    : 'bg-neutral-900/90 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:text-white'
                }`}
              >
                <span className="block text-sm font-bold font-mono leading-none">{scale.name}</span>
                <span className={`block text-[9px] mt-1 truncate ${isSelected ? 'text-black/80 font-medium' : 'text-neutral-400'}`}>
                  {scale.subtitle}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
