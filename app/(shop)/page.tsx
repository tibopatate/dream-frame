import type { Metadata } from 'next'
import { getPublishedTree } from '@/lib/page-builder/store'
import { SectionRenderer } from '@/components/page-builder/SectionRenderer'
import { DEFAULT_PAGE_DOCUMENT } from '@/lib/page-builder/default-sections'
import { getAllProducts, syncDatabaseWithCloud } from '@/lib/data-store'
import { isPrismaConfigured, prisma } from '@/lib/db'
import { MOCK_PRODUCTS } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: "Dream Frame — Art Automobile 3D d'Exception | Atelier France",
  description:
    'Cadres 3D d’art automobile sous vitrage haute définition avec rétroéclairage LED intégré. Fait main en France. À partir de 49,99 € · Livraison Colissimo 100% offerte.',
}

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  await syncDatabaseWithCloud()

  let doc
  try {
    doc = await getPublishedTree()
  } catch (err) {
    console.error('Error fetching published tree, falling back:', err)
    doc = DEFAULT_PAGE_DOCUMENT
  }

  const sections = doc?.sections && doc.sections.length > 0 ? doc.sections : DEFAULT_PAGE_DOCUMENT.sections

  let liveProducts: any[] = []
  if (isPrismaConfigured()) {
    try {
      const dbProducts = await prisma.product.findMany({
        where: { isActive: true },
        include: { variants: true },
        orderBy: { createdAt: 'desc' },
      })
      if (dbProducts.length > 0) liveProducts = dbProducts
    } catch {}
  }

  if (liveProducts.length === 0) {
    try {
      const stored = getAllProducts().filter((p) => p.isActive)
      if (stored.length > 0) {
        liveProducts = stored
      } else {
        liveProducts = MOCK_PRODUCTS
      }
    } catch {
      liveProducts = MOCK_PRODUCTS
    }
  }

  return (
    <main className="bg-[#080807] text-white selection:bg-amber-400 selection:text-black overflow-hidden">
      {sections.map((sec) => (
        <SectionRenderer key={sec.id} section={sec} isEditor={false} liveProducts={liveProducts} />
      ))}
    </main>
  )
}
