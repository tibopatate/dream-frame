import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Zap, Truck } from 'lucide-react'
import type { Metadata } from 'next'
import { MOCK_PRODUCTS } from '@/lib/mock-data'
import { CatalogueFilterHeader } from '@/components/catalogue/CatalogueFilterHeader'

export const metadata: Metadata = {
  title: 'La Collection d’Art Automobile — Dream Frame',
  description: 'Découvrez notre collection de 8 cadres 3D de supercars. Fait main en France. À partir de 49,99 € · Livraison Colissimo 100% offerte.',
}

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ brand?: string; search?: string; era?: string }>
}

export default async function CataloguePage({ searchParams }: PageProps) {
  const params = await searchParams
  const activeBrand = params.brand || ''
  const activeEra = params.era || ''
  const searchQuery = params.search || ''

  const brands = Array.from(new Set(MOCK_PRODUCTS.map((p) => p.brand))).sort()

  const products = MOCK_PRODUCTS.filter((product) => {
    if (activeBrand && product.brand !== activeBrand) return false
    if (activeEra && product.era !== activeEra) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      )
    }
    return true
  })

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 bg-[#080807] text-white">
      {/* En-tête de Collection Épuré avec Bouton Filtrer */}
      <CatalogueFilterHeader
        totalCount={MOCK_PRODUCTS.length}
        filteredCount={products.length}
        brands={brands}
        activeBrand={activeBrand}
        activeEra={activeEra}
        searchQuery={searchQuery}
        vintageCount={MOCK_PRODUCTS.filter((p) => p.era === 'VINTAGE').length}
        modernCount={MOCK_PRODUCTS.filter((p) => p.era === 'MODERN').length}
      />
      {/* Grille Produits Épurée */}
      {products.length === 0 ? (
        <div className="text-center py-16 bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md mx-auto space-y-3">
          <p className="text-neutral-400 text-xs font-mono uppercase tracking-wider">Aucune pièce ne correspond à votre recherche</p>
          <Link href="/catalogue" className="text-xs text-amber-400 underline inline-block">
            Réinitialiser les critères
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {products.map((product) => {
            const variant = product.variants[0]
            const inStock = (variant?.stock ?? 0) > 0

            return (
              <div
                key={product.id}
                className="group bg-neutral-900/90 border border-neutral-800/90 hover:border-neutral-700 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-lg"
              >
                <Link href={`/produit/${product.slug}`} className="block relative aspect-[4/3] bg-black overflow-hidden">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-950">
                      <Zap className="w-6 h-6 text-neutral-700" />
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md text-amber-400 border border-neutral-800 px-2.5 py-1 rounded-full">
                      {product.brand}
                    </span>
                    <span className="text-[9px] font-mono text-neutral-300 bg-black/80 backdrop-blur-md border border-neutral-800 px-2 py-1 rounded-full">
                      {product.year}
                    </span>
                  </div>

                  {!inStock && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-xs font-mono uppercase tracking-widest text-white border border-neutral-700 px-3 py-1 rounded-full bg-neutral-900">
                        Épuisé
                      </span>
                    </div>
                  )}
                </Link>

                <div className="p-5 space-y-4">
                  <div className="space-y-1">
                    <Link
                      href={`/produit/${product.slug}`}
                      className="font-serif text-lg text-white group-hover:text-amber-300 block truncate transition-colors"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-neutral-400 font-light line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-neutral-800 pt-3">
                    <div>
                      <span className="text-[10px] text-neutral-400 block font-light">
                        À partir de
                      </span>
                      <p className="text-base font-bold text-white font-serif">
                        {product.price.toFixed(2).replace('.', ',')} €
                      </p>
                    </div>

                    <Link
                      href={`/produit/${product.slug}`}
                      className="px-3.5 py-2 bg-white hover:bg-neutral-100 text-black font-semibold text-xs tracking-wider uppercase rounded-xl transition-all shadow-sm flex items-center gap-1"
                    >
                      <span>Voir</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
