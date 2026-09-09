import type { Metadata } from 'next'
import { getPublishedTree } from '@/lib/page-builder/store'
import { ElementRenderer } from '@/components/page-builder/ElementRenderer'
import { DEFAULT_PAGE_TREE } from '@/lib/page-builder/default-tree'

export const metadata: Metadata = {
  title: "Dream Frame — Art Automobile 3D d'Exception | Atelier France",
  description:
    'Cadres 3D d’art automobile sous vitrage haute définition avec rétroéclairage LED intégré. Fait main en France. À partir de 49,99 € · Livraison Colissimo 100% offerte.',
}

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let doc
  try {
    doc = await getPublishedTree()
  } catch (err) {
    console.error('Error fetching published tree, falling back:', err)
    doc = DEFAULT_PAGE_TREE
  }

  const elements = doc?.elements && doc.elements.length > 0 ? doc.elements : DEFAULT_PAGE_TREE.elements

  return (
    <main className="bg-[#080807] text-white selection:bg-amber-400 selection:text-black overflow-hidden">
      {elements.map((el) => (
        <ElementRenderer key={el.id} element={el} isEditor={false} />
      ))}
    </main>
  )
}
