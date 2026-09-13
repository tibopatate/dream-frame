import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getUnifiedCollections, getUnifiedProducts } from '@/lib/data-store'
import { CatalogueProductGrid } from '@/components/catalogue/CatalogueProductGrid'
import { Layers, ArrowRight, Sparkles, Check } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Les Collections d’Art Automobile — Dream Frame Officiel',
  description:
    'Découvrez les collections exclusives de cadres 3D Dream Frame : Collection Ferrari Maranello, Grands Formats Prestige, et Formats Collector assemblés en France avec rétroéclairage LED.',
  alternates: {
    canonical: 'https://dreamframeofficiel.com/collection',
  },
}

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ col?: string }>
}

export default async function CollectionPage({ searchParams }: PageProps) {
  const params = await searchParams
  const activeColSlug = params.col || ''

  const [allCollections, allProducts] = await Promise.all([
    getUnifiedCollections(),
    getUnifiedProducts(),
  ])

  const activeCollections = allCollections.filter((c) => c.isActive)
  const currentCollection = activeCollections.find((c) => c.slug === activeColSlug || c.id === activeColSlug)

  const displayedProducts = currentCollection
    ? allProducts.filter((p: any) =>
        currentCollection.productIds.includes(p.id) || currentCollection.productIds.includes(p.slug)
      )
    : allProducts

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40 pb-20 space-y-12 bg-[#080807] text-white min-h-screen">
      {/* ─── En-tête de la Page Collections ─── */}
      <div className="space-y-4 border-b border-neutral-800/80 pb-8">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 font-bold">
            Atelier France · Séries d&apos;Élite
          </span>
          <span className="text-neutral-600">·</span>
          <span className="text-[10px] font-mono text-neutral-400">
            {activeCollections.length} Univers Disponibles
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
          {currentCollection ? currentCollection.name : 'Nos Collections d’Art Automobile'}
        </h1>

        <p className="text-neutral-400 text-xs sm:text-sm font-light max-w-2xl leading-relaxed">
          {currentCollection?.description
            ? currentCollection.description
            : "Chaque collection rassemble des pièces d'exception minutieusement assemblées à la main dans notre atelier français sous vitrage optique avec rétroéclairage LED intégré."}
        </p>

        {/* ─── Onglets Sélecteurs de Collections ─── */}
        <div className="flex flex-wrap items-center gap-2 pt-3">
          <Link
            href="/collection"
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
              !activeColSlug
                ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
            }`}
          >
            Toutes les Collections ({allProducts.length})
          </Link>

          {activeCollections.map((col) => {
            const isSelected = activeColSlug === col.slug || activeColSlug === col.id
            const count = col.productIds?.length || 0
            return (
              <Link
                key={col.id}
                href={`/collection?col=${col.slug}`}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                }`}
              >
                <span>{col.name}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-black/20 text-black' : 'bg-neutral-800 text-neutral-400'
                }`}>
                  {count}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ─── Grille des Cartes Collections (si vue globale) ─── */}
      {!currentCollection && activeCollections.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {activeCollections.map((col) => {
            const count = col.productIds?.length || 0
            return (
              <Link
                key={col.id}
                href={`/collection?col=${col.slug}`}
                className="group relative flex flex-col justify-between rounded-2xl overflow-hidden border border-neutral-800/80 hover:border-amber-400/50 bg-neutral-950 p-5 transition-all duration-500 shadow-xl aspect-[4/5]"
              >
                {/* Image de fond */}
                <div className="absolute inset-0 z-0">
                  {col.image ? (
                    <Image
                      src={col.image}
                      alt={col.name}
                      fill
                      className="object-cover brightness-[0.4] group-hover:scale-105 group-hover:brightness-[0.48] transition-all duration-700"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-900" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>

                {/* Tag supérieur */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-amber-400 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-neutral-800">
                    {count} modèle{count > 1 ? 's' : ''}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-amber-400 transition-colors">
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* Titre & Description */}
                <div className="relative z-10 space-y-1">
                  <h3 className="text-base font-bold text-white uppercase tracking-wider group-hover:text-amber-300 transition-colors">
                    {col.name}
                  </h3>
                  {col.description && (
                    <p className="text-[11px] text-neutral-300 font-light line-clamp-2 leading-relaxed">
                      {col.description}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* ─── Grille des Cadres de la Collection Sélectionnée ─── */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-400">
            {currentCollection ? `Pièces de la ${currentCollection.name}` : 'Toutes les Pièces d’Art Disponibles'}
          </h2>
          <span className="text-xs font-mono text-amber-400">
            {displayedProducts.length} modèle{displayedProducts.length > 1 ? 's' : ''}
          </span>
        </div>

        {displayedProducts.length > 0 ? (
          <CatalogueProductGrid products={displayedProducts} />
        ) : (
          <div className="py-20 text-center text-neutral-500 space-y-3">
            <p className="text-sm font-light">Aucun cadre n&apos;est encore associé à cette collection.</p>
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 text-xs text-amber-400 hover:underline"
            >
              <span>Voir tout le catalogue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}

