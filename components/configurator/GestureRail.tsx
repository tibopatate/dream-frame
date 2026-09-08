'use client'

import { useRef, useEffect } from 'react'
import { ConfigOption } from '@/lib/configurator-data'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface GestureRailProps {
  options: ConfigOption[]
  selectedId: string
  onSelect: (id: string) => void
  label: string
  stepNumber: string
}

export function GestureRail({
  options,
  selectedId,
  onSelect,
  label,
  stepNumber,
}: GestureRailProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const currentIndex = Math.max(
    0,
    options.findIndex((o) => o.id === selectedId)
  )

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelect(options[currentIndex - 1].id)
    }
  }

  const handleNext = () => {
    if (currentIndex < options.length - 1) {
      onSelect(options[currentIndex + 1].id)
    }
  }

  // Support clavier flèches gauche/droite
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrev()
    if (e.key === 'ArrowRight') handleNext()
  }

  return (
    <div className="space-y-4 select-none" onKeyDown={handleKeyDown} tabIndex={0}>
      {/* En-tête de l'étape */}
      <div className="flex items-center justify-between border-b border-graphite pb-3">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono tracking-museum text-champagne">
            {stepNumber}
          </span>
          <h3 className="font-gallery-title text-xl tracking-subtle text-porcelain">
            {label}
          </h3>
        </div>

        {/* Commandes tactiles & chevrons rapides */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="w-8 h-8 flex items-center justify-center border border-graphite bg-carbon text-ash hover:text-porcelain hover:border-champagne disabled:opacity-30 disabled:pointer-events-none transition-colors"
            aria-label="Option précédente"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex === options.length - 1}
            className="w-8 h-8 flex items-center justify-center border border-graphite bg-carbon text-ash hover:text-porcelain hover:border-champagne disabled:opacity-30 disabled:pointer-events-none transition-colors"
            aria-label="Option suivante"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Rail défilant fluide / Drag & Snap */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar py-2 px-1 snap-x snap-mandatory"
      >
        {options.map((option, i) => {
          const isSelected = option.id === selectedId

          return (
            <div
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={`snap-center flex-shrink-0 cursor-pointer p-5 transition-all duration-300 w-[240px] sm:w-[260px] flex flex-col justify-between border ${
                isSelected
                  ? 'bg-carbon border-champagne shadow-champagne-glow scale-[1.01]'
                  : 'bg-carbon/60 border-graphite hover:border-ash/40 opacity-70 hover:opacity-100'
              }`}
            >
              {/* Repère numérique */}
              <div className="flex justify-between items-center text-[9px] font-mono tracking-widest text-ash mb-4">
                <span>{String(i + 1).padStart(2, '0')}</span>
                {option.priceDeltaCents > 0 && (
                  <span className="text-champagne font-semibold">
                    +{option.priceDeltaCents / 100} €
                  </span>
                )}
              </div>

              {/* Aperçu visuel spécifique si disponible */}
              {option.imageUrl ? (
                <div className="relative aspect-[16/10] bg-obsidian border border-graphite my-2 overflow-hidden flex items-center justify-center">
                  <img
                    src={option.imageUrl}
                    alt={option.name}
                    className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
                  />
                </div>
              ) : option.texturePattern ? (
                <div className={`h-12 w-full my-2 border ${option.texturePattern}`} />
              ) : null}

              {/* Titre & Description */}
              <div className="space-y-1 mt-3">
                <h4 className="font-gallery-title text-xl text-porcelain leading-tight">
                  {option.name}
                </h4>
                {option.subtitle && (
                  <p className="text-[11px] tracking-subtle text-ash font-medium">
                    {option.subtitle}
                  </p>
                )}
                {option.description && (
                  <p className="text-[10px] text-ash/80 leading-relaxed pt-1 line-clamp-2">
                    {option.description}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
