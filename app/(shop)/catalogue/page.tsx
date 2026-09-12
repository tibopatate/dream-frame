import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getUnifiedProducts } from '@/lib/data-store'
import { CatalogueFilterHeader } from '@/components/catalogue/CatalogueFilterHeader'
import { CatalogueProductGrid } from '@/components/catalogue/CatalogueProductGrid'

export const metadata: Metadata = {
  title: 'La Collection d’Art Automobile — Dream Frame Officiel',
  description: 'Explorez la collection officielle de cadres 3D d’art automobile Dream Frame : Ferrari F40, Porsche GT3 RS, Bugatti Chiron, Pagani. Fait main en France avec rétroéclairage LED.',
  alternates: {
    canonical: 'https://dreamframeofficiel.com/catalogue',
  },
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

  // Récupération de l'intégralité des cadres de la boutique (Collection complète unifiée)
  const baseProducts = await getUnifiedProducts()

  const brands = Array.from(new Set(baseProducts.map((p: any) => p.brand))).sort()

  const products = baseProducts.filter((product: any) => {
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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40 pb-20 space-y-8 bg-[#080807] text-white min-h-screen">
      {/* En-tête de Collection Épuré avec Bouton Filtrer */}
      <Suspense fallback={<div className="h-20 animate-pulse bg-neutral-900 rounded-2xl" />}>
        <CatalogueFilterHeader
          totalCount={baseProducts.length}
          filteredCount={products.length}
          brands={brands}
          activeBrand={activeBrand}
          activeEra={activeEra}
          searchQuery={searchQuery}
          vintageCount={baseProducts.filter((p: any) => p.era === 'VINTAGE' || (p.year && p.year < 2000)).length}
          modernCount={baseProducts.filter((p: any) => p.era === 'MODERN' || !p.year || p.year >= 2000).length}
        />
      </Suspense>

      {/* Grille Produits Épurée avec Achat Rapide intégré */}
      <CatalogueProductGrid products={products} />
    </main>
  )
}
