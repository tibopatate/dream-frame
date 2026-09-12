import { prisma } from '@/lib/db'
import { EditProductForm } from './edit-form'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getProductById } from '@/lib/data-store'
import { MOCK_PRODUCTS } from '@/lib/mock-data'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata = { title: 'Modifier le Cadre — Dream Frame Admin' }

export default async function ModifierProduitPage({ params }: Props) {
  const { id } = await params

  let product: any = null

  try {
    product = await prisma.product.findUnique({
      where: { id },
      include: { variants: true },
    })
  } catch {
    product = null
  }

  // 1. Fallback sur le store persistant de la boutique
  if (!product) {
    const stored = getProductById(id)
    if (stored) {
      product = {
        id: stored.id,
        name: stored.name,
        brand: stored.brand,
        description: stored.description,
        price: stored.price,
        isActive: stored.isActive,
        isFeatured: stored.isFeatured,
        images: stored.images,
        variants: [{ stock: stored.stock, stockAlert: stored.stockAlert, id: stored.id }],
      }
    }
  }

  // 2. Fallback sur les données mock de base
  if (!product) {
    const mock = MOCK_PRODUCTS.find((p) => p.id === id || p.slug === id)
    if (mock) {
      product = {
        id: mock.id,
        name: mock.name,
        brand: mock.brand,
        description: mock.description,
        price: mock.price,
        isActive: true,
        isFeatured: true,
        images: mock.images,
        variants: mock.variants,
      }
    }
  }

  if (!product) {
    notFound()
  }

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto space-y-6">
      <Link
        href="/admin/produits"
        className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Retour au catalogue
      </Link>

      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
          Modifier {product.name}
        </h1>
        <p className="text-neutral-400 text-xs mt-1">
          Ajustez les textes, visuels, stock et disponibilité du modèle
        </p>
      </div>

      <EditProductForm product={product} />
    </div>
  )
}
