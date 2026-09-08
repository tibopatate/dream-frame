import type { Metadata } from 'next'
import { MOCK_PRODUCTS } from '@/lib/mock-data'
import { CatalogueFilterHeader } from '@/components/catalogue/CatalogueFilterHeader'
import { CatalogueProductGrid } from '@/components/catalogue/CatalogueProductGrid'

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

      {/* Grille Produits Épurée avec Achat Rapide intégré */}
      <CatalogueProductGrid products={products} />
    </main>
  )
}
