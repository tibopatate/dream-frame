'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Interactive3DFrame } from '@/components/3d/Interactive3DFrame'
import { ChevronLeft, ChevronRight, Play, Film, Image as ImageIcon, Maximize2, X } from 'lucide-react'

interface ProductGalleryProps {
  images: string[]
  carName: string
  brand: string
  year?: number
  isVintage?: boolean
}

function isVideo(url: string): boolean {
  if (!url) return false
  return /\.(mp4|webm|mov)(\?.*)?$/i.test(url)
}

export function ProductGallery({
  images = [],
  carName,
  brand,
  year = 1987,
  isVintage = true,
}: ProductGalleryProps) {
  // Garantir au moins une image de fallback si vide
  const mediaList = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1200&auto=format&fit=crop'
  ]

  const [activeIdx, setActiveIdx] = useState(0)
  const [fullscreenModal, setFullscreenModal] = useState(false)
  const touchStartX = useState<number | null>(null)
  const touchStartY = useState<number | null>(null)

  const activeMedia = mediaList[activeIdx] || mediaList[0]
  const isCurrentVideo = isVideo(activeMedia)

  const goToPrev = useCallback(() => {
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : mediaList.length - 1))
  }, [mediaList.length])

  const goToNext = useCallback(() => {
    setActiveIdx((prev) => (prev < mediaList.length - 1 ? prev + 1 : 0))
  }, [mediaList.length])

  // Gestion du swipe tactile fluide droite / gauche
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX[1](e.touches[0].clientX)
    touchStartY[1](e.touches[0].clientY)
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX[0] === null || touchStartY[0] === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartX[0]
    const deltaY = e.changedTouches[0].clientY - touchStartY[0]

    // Vérifier que le geste est majoritairement horizontal et supérieur à 40px
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0) {
        goToNext() // Glisser vers la gauche -> image suivante
      } else {
        goToPrev() // Glisser vers la droite -> image précédente
      }
    }
    touchStartX[1](null)
    touchStartY[1](null)
  }

  // Navigation au clavier (flèches gauche/droite)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev()
      if (e.key === 'ArrowRight') goToNext()
      if (e.key === 'Escape') setFullscreenModal(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToPrev, goToNext])

  return (
    <div className="space-y-4 select-none">
      {/* ─── Visualiseur Principal avec support Touch Swipe ─── */}
      <div
        className="relative group touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {isCurrentVideo ? (
          <div className="relative w-full max-w-[440px] mx-auto aspect-[4/3] rounded-3xl overflow-hidden bg-black border border-neutral-800 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <video
              key={activeMedia}
              src={activeMedia}
              autoPlay
              loop
              muted
              playsInline
              controls
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-neutral-700 text-amber-300 text-[10px] font-mono flex items-center gap-1.5">
              <Film className="w-3 h-3 text-amber-400" />
              <span>Vidéo Cadre</span>
            </div>
          </div>
        ) : (
          <Interactive3DFrame
            key={activeMedia}
            imageSrc={activeMedia}
            carName={carName}
            brand={brand}
            year={year}
            isVintage={isVintage}
          />
        )}

        {/* Flèches de navigation Précédent / Suivant si plusieurs médias */}
        {mediaList.length > 1 && (
          <>
            <button
              type="button"
              onClick={goToPrev}
              aria-label="Photo précédente"
              className="absolute left-2 sm:-left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 text-white flex items-center justify-center transition-all shadow-xl hover:scale-110 active:scale-95 z-20 cursor-pointer backdrop-blur-sm"
            >
              <ChevronLeft className="w-5 h-5 text-neutral-200" />
            </button>

            <button
              type="button"
              onClick={goToNext}
              aria-label="Photo suivante"
              className="absolute right-2 sm:-right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 text-white flex items-center justify-center transition-all shadow-xl hover:scale-110 active:scale-95 z-20 cursor-pointer backdrop-blur-sm"
            >
              <ChevronRight className="w-5 h-5 text-neutral-200" />
            </button>
          </>
        )}

        {/* Indicateur Compteur de Photos */}
        {mediaList.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20">
            <span className="px-3 py-1 rounded-full bg-black/85 backdrop-blur-md border border-neutral-800 text-neutral-300 text-[10px] font-mono tracking-widest uppercase">
              {activeIdx + 1} / {mediaList.length}
            </span>
          </div>
        )}
      </div>

      {/* ─── Galerie des Miniatures (Thumbnails) ─── */}
      {mediaList.length > 1 && (
        <div className="pt-2">
          <div className="flex items-center gap-1.5 mb-2 text-[10px] uppercase font-mono tracking-wider text-neutral-400">
            <ImageIcon className="w-3 h-3 text-amber-400" />
            <span>Galerie ({mediaList.length} visuels)</span>
          </div>

          <div className="flex gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar py-1">
            {mediaList.map((media, i) => {
              const isSelected = i === activeIdx
              const isMediaVideo = isVideo(media)

              return (
                <button
                  key={`${media}-${i}`}
                  type="button"
                  onClick={() => setActiveIdx(i)}
                  className={`group relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-neutral-950 transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'ring-2 ring-amber-400 scale-[1.03] shadow-lg shadow-amber-400/20 border-transparent'
                      : 'border border-neutral-800 hover:border-neutral-600 opacity-70 hover:opacity-100'
                  }`}
                >
                  {isMediaVideo ? (
                    <div className="relative w-full h-full flex items-center justify-center bg-neutral-900">
                      <video src={media} className="w-full h-full object-cover" muted />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Play className="w-4 h-4 text-amber-300 fill-amber-300" />
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={media}
                      alt={`Angle ${i + 1} — ${carName}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="80px"
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
