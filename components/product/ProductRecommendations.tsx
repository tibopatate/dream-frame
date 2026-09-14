'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Zap, ArrowRight } from 'lucide-react'
import { isVideoUrl } from '@/lib/utils'

interface ProductRecommendationsProps {
  products: any[]
  title?: string
  subtitle?: string
}

export function ProductRecommendations({
  products,
  title = 'Vous aimerez peut-être',
  subtitle = "D'autres sculptures murales d'exception confectionnées à la main dans notre atelier.",
}: ProductRecommendationsProps) {
  if (!products || products.length === 0) return null

  return (
    <section className="mt-20 pt-14 border-t border-neutral-800/80">
      <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
        <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-amber-400 font-semibold">
          Manufacture Dream Frame
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {title}
        </h2>
        <p className="text-xs text-neutral-400 font-light">
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => {
          const priceNum = Number(p.price) || 49.90
          const primaryImg = p.images?.[0]
          const hoverImg = p.images?.[1]

          return (
            <div
              key={p.id}
              className="group bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-2xl"
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
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      )
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-neutral-950">
                    <Zap className="w-6 h-6 text-neutral-700" />
                  </div>
                )}

                {/* Badges d'orfèvrerie */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md text-amber-400 border border-neutral-800 px-2.5 py-1 rounded-full">
                    {p.brand}
                  </span>
                  {p.year && (
                    <span className="text-[9px] font-mono text-neutral-300 bg-black/80 backdrop-blur-md border border-neutral-800 px-2 py-1 rounded-full">
                      {p.year}
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-neutral-300 text-[9px] px-2.5 py-1 rounded-full border border-neutral-800 flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 text-amber-400" />
                  LED 3000K
                </div>
              </Link>

              {/* Détails du modèle */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <Link
                    href={`/produit/${p.slug}`}
                    className="text-sm font-semibold text-white group-hover:text-amber-300 block truncate transition-colors uppercase tracking-wide"
                  >
                    {p.name}
                  </Link>
                  <p className="text-[11px] text-neutral-400 font-light line-clamp-2 leading-relaxed">
                    {p.description || "Sculpture murale haut de gamme avec châssis d'ébénisterie noir."}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-neutral-800/80 pt-3 mt-2">
                  <div>
                    <span className="text-sm font-bold text-white font-mono">
                      {priceNum.toFixed(2).replace('.', ',')} €
                    </span>
                    <span className="text-[10px] text-neutral-500 font-light ml-1">TTC</span>
                  </div>

                  <Link
                    href={`/produit/${p.slug}`}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 hover:text-amber-300 transition-colors"
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
