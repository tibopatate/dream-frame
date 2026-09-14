'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Zap, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { isVideoUrl } from '@/lib/utils'

interface ProductRecommendationsProps {
  products: any[]
  title?: string
  subtitle?: string
}

export function ProductRecommendations({
  products,
  title = 'Vous aimeriez peut-être',
  subtitle = "Faites défiler pour explorer d'autres pièces de notre collection",
}: ProductRecommendationsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  if (!products || products.length === 0) return null

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <section className="mt-16 pt-10 border-t border-neutral-800/80">
      {/* En-tête avec titre et flèches de défilement horizontal */}
      <div className="flex items-end justify-between mb-6 gap-4">
        <div className="space-y-1">
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-amber-400 font-semibold">
            Manufacture Dream Frame
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {title}
          </h2>
          <p className="text-xs text-neutral-400 font-light hidden sm:block">
            {subtitle}
          </p>
        </div>

        {/* Contrôles de défilement vers la droite / gauche */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Défiler vers la gauche"
            className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-600 text-neutral-300 hover:text-white flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Défiler vers la droite"
            className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-600 text-neutral-300 hover:text-white flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Rail de défilement horizontal vers la droite */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 scrollbar-none snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        {products.map((p) => {
          const priceNum = Number(p.price) || 49.90
          const primaryImg = p.images?.[0]
          const hoverImg = p.images?.[1]

          return (
            <div
              key={p.id}
              className="w-[230px] sm:w-[260px] shrink-0 snap-start group bg-neutral-900/70 border border-neutral-800/90 hover:border-neutral-700 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-md hover:shadow-xl"
            >
              <Link
                href={`/produit/${p.slug}`}
                className="block relative aspect-[4/3] bg-black overflow-hidden"
              >
                {primaryImg ? (
                  <>
                    {isVideoUrl(primaryImg) ? (
                      <video
                        src={primaryImg}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className={`w-full h-full object-cover transition-all duration-500 ${
                          hoverImg ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-105'
                        }`}
                      />
                    ) : (
                      <Image
                        src={primaryImg}
                        alt={p.name}
                        fill
                        className={`object-cover transition-all duration-500 ${
                          hoverImg ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-105'
                        }`}
                        sizes="260px"
                      />
                    )}
                    {hoverImg && (
                      isVideoUrl(hoverImg) ? (
                        <video
                          src={hoverImg}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 pointer-events-none"
                        />
                      ) : (
                        <Image
                          src={hoverImg}
                          alt={`${p.name} - Vue 2`}
                          fill
                          className="object-cover opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 pointer-events-none"
                          sizes="260px"
                        />
                      )
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-neutral-950">
                    <Zap className="w-5 h-5 text-neutral-700" />
                  </div>
                )}

                {/* Badges discrets */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md text-amber-400 border border-neutral-800 px-2 py-0.5 rounded-full">
                    {p.brand}
                  </span>
                  {p.year && (
                    <span className="text-[9px] font-mono text-neutral-300 bg-black/80 backdrop-blur-md border border-neutral-800 px-2 py-0.5 rounded-full">
                      {p.year}
                    </span>
                  )}
                </div>

                <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-md text-neutral-300 text-[8px] px-2 py-0.5 rounded-full border border-neutral-800 flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 text-amber-400" />
                  LED 3000K
                </div>
              </Link>

              {/* Détails épurés */}
              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <Link
                    href={`/produit/${p.slug}`}
                    className="text-xs font-semibold text-white group-hover:text-amber-300 block truncate transition-colors uppercase tracking-wide"
                  >
                    {p.name}
                  </Link>
                  <p className="text-[10px] text-neutral-400 font-light line-clamp-1 mt-0.5">
                    {p.description || "Sculpture murale haut de gamme"}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-neutral-800/80 pt-2.5">
                  <div>
                    <span className="text-xs font-bold text-white font-mono">
                      {priceNum.toFixed(2).replace('.', ',')} €
                    </span>
                    <span className="text-[9px] text-neutral-500 font-light ml-1">TTC</span>
                  </div>

                  <Link
                    href={`/produit/${p.slug}`}
                    className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    <span>Découvrir</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
