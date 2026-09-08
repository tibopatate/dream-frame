'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, X, Sparkles, Check, RotateCcw } from 'lucide-react'

interface CatalogueFilterHeaderProps {
  totalCount: number
  filteredCount: number
  brands: string[]
  activeBrand: string
  activeEra: string
  searchQuery: string
  vintageCount: number
  modernCount: number
}

export function CatalogueFilterHeader({
  totalCount,
  filteredCount,
  brands,
  activeBrand,
  activeEra,
  searchQuery,
  vintageCount,
  modernCount,
}: CatalogueFilterHeaderProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [query, setQuery] = useState(searchQuery)

  const activeFilterCount = (activeBrand ? 1 : 0) + (activeEra ? 1 : 0) + (searchQuery ? 1 : 0)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (query) {
      params.set('search', query)
    } else {
      params.delete('search')
    }
    router.push(`/catalogue?${params.toString()}`)
  }

  const clearAllFilters = () => {
    setQuery('')
    router.push('/catalogue')
  }

  return (
    <div className="space-y-4">
      {/* ─── Range 1: Titre & Bouton Filtrer ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 font-bold">
              Catalogue Officiel
            </span>
            <span className="text-neutral-600">·</span>
            <span className="text-[10px] font-mono text-neutral-400">
              {filteredCount} sur {totalCount} cadres d&apos;art
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            La Collection Dream Frame
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm font-light">
            Miniatures 3D de légende sous vitrage haute définition et rétroéclairage LED intégré.
          </p>
        </div>

        {/* Action Bar: Recherche & Bouton Filtrer */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Recherche */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un modèle..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/60 transition"
            />
          </form>

          {/* Bouton Filtrer */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer flex-shrink-0 ${
              showFilters || activeFilterCount > 0
                ? 'bg-amber-400 border-amber-400 text-black shadow-lg shadow-amber-400/10'
                : 'bg-neutral-900 border-neutral-800 text-white hover:border-neutral-700'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtrer</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ─── Tiroir Dépliable des Filtres ─── */}
      {showFilters && (
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-5 space-y-5 animate-fade-in shadow-xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              Filtres de Collection
            </span>
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-neutral-400 hover:text-white transition flex items-center gap-1 font-light cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 text-amber-400" />
                <span>Réinitialiser les filtres</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Catégories / Époques */}
            <div className="space-y-2">
              <label className="block text-[11px] font-mono uppercase text-neutral-400 tracking-wider">
                Époque &amp; Collection
              </label>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/catalogue"
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    !activeEra
                      ? 'bg-white text-black font-bold'
                      : 'bg-black/60 text-neutral-300 border border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  Tous ({totalCount})
                </Link>
                {vintageCount > 0 && (
                  <Link
                    href="/catalogue?era=VINTAGE"
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      activeEra === 'VINTAGE'
                        ? 'bg-white text-black font-bold'
                        : 'bg-black/60 text-neutral-300 border border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    Légendes Vintage ({vintageCount})
                  </Link>
                )}
                {vintageCount > 0 && modernCount > 0 && (
                  <Link
                    href="/catalogue?era=MODERN"
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      activeEra === 'MODERN'
                        ? 'bg-white text-black font-bold'
                        : 'bg-black/60 text-neutral-300 border border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    Supercars Modernes ({modernCount})
                  </Link>
                )}
                <Link
                  href="/configurateur"
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-400/10 border border-amber-400/30 text-amber-300 hover:bg-amber-400 hover:text-black transition flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Sur-Mesure
                </Link>
              </div>
            </div>

            {/* Sélection de Marques */}
            <div className="space-y-2">
              <label className="block text-[11px] font-mono uppercase text-neutral-400 tracking-wider">
                Marques Automobiles
              </label>
              <div className="flex flex-wrap gap-2">
                {brands.map((b) => {
                  const isActive = activeBrand === b
                  const url = isActive
                    ? (activeEra ? `/catalogue?era=${encodeURIComponent(activeEra)}` : '/catalogue')
                    : `/catalogue?brand=${encodeURIComponent(b)}${activeEra ? `&era=${encodeURIComponent(activeEra)}` : ''}`
                  return (
                    <Link
                      key={b}
                      href={url}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        isActive
                          ? 'bg-amber-400 text-black font-bold'
                          : 'bg-black/60 text-neutral-300 border border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      {b}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tags de Filtres Actifs (si au moins un filtre est actif) */}
      {activeFilterCount > 0 && !showFilters && (
        <div className="flex items-center gap-2 text-xs pt-1 flex-wrap">
          <span className="text-neutral-500 text-[11px]">Filtres actifs :</span>
          {activeEra && (
            <Link
              href={activeBrand ? `/catalogue?brand=${encodeURIComponent(activeBrand)}` : '/catalogue'}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-amber-300 text-[11px]"
            >
              <span>{activeEra === 'VINTAGE' ? 'Légendes Vintage' : 'Supercars Modernes'}</span>
              <X className="w-3 h-3 hover:text-white" />
            </Link>
          )}
          {activeBrand && (
            <Link
              href={activeEra ? `/catalogue?era=${encodeURIComponent(activeEra)}` : '/catalogue'}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-amber-300 text-[11px]"
            >
              <span>{activeBrand}</span>
              <X className="w-3 h-3 hover:text-white" />
            </Link>
          )}
          {searchQuery && (
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-amber-300 text-[11px]"
            >
              <span>« {searchQuery} »</span>
              <X className="w-3 h-3 hover:text-white" />
            </Link>
          )}
          <button
            onClick={clearAllFilters}
            className="text-[11px] text-neutral-500 hover:text-white underline ml-2 cursor-pointer"
          >
            Effacer tout
          </button>
        </div>
      )}
    </div>
  )
}
