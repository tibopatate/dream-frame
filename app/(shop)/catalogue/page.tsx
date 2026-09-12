import type { Metadata } from 'next'
import { MOCK_PRODUCTS } from '@/lib/mock-data'
import { getAllProducts } from '@/lib/data-store'
import { prisma, isPrismaConfigured } from '@/lib/db'
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

  // 1. Récupération des vrais produits dynamiques de la boutique
  let baseProducts: any[] = []

  if (isPrismaConfigured()) {
    try {
      const dbProducts = await prisma.product.findMany({
        where: { isActive: true },
        include: { variants: true },
        orderBy: { createdAt: 'desc' },
      })
      if (dbProducts.length > 0) baseProducts = dbProducts
    } catch {}
  }

  if (baseProducts.length === 0) {
    const stored = getAllProducts().filter((p) => p.isActive)
    if (stored.length > 0) {
      baseProducts = stored.map((p) => ({
        ...p,
        variants: [{ id: p.id, stock: p.stock, stockAlert: p.stockAlert, sku: p.sku }],
      }))
    } else {
      baseProducts = MOCK_PRODUCTS
    }
  }

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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 bg-[#080807] text-white">
      {/* En-tête de Collection Épuré avec Bouton Filtrer */}
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

      {/* Grille Produits Épurée avec Achat Rapide intégré */}
      <CatalogueProductGrid products={products} />
    </main>
  )
}
