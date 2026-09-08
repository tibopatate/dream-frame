import { prisma, isPrismaConfigured } from '@/lib/db'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit2, Package, AlertTriangle, Sparkles, Truck } from 'lucide-react'
import { getAllProducts } from '@/lib/data-store'
import { MOCK_PRODUCTS } from '@/lib/mock-data'

export const metadata = { title: 'Catalogue Cadres — Dream Frame Admin' }

export default async function AdminProduitsPage() {
  let products: any[] = []

  if (isPrismaConfigured()) {
    try {
      const dbProducts = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          variants: { select: { id: true, stock: true, stockAlert: true, sku: true } },
        },
      })
      if (dbProducts.length > 0) {
        products = dbProducts
      }
    } catch {}
  }

  if (products.length === 0) {
    const stored = getAllProducts()
    if (stored.length > 0) {
      products = stored.map((p) => ({
        ...p,
        variants: [{ id: p.id, stock: p.stock, stockAlert: p.stockAlert, sku: p.sku }],
      }))
    } else {
      products = MOCK_PRODUCTS
    }
  }

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
            Catalogue des Cadres
          </h1>
          <p className="text-neutral-400 text-xs mt-1">
            {products.length} modèle{products.length > 1 ? 's' : ''} sous vitrage acrylique et rétroéclairage LED
          </p>
        </div>
        <Link
          href="/admin/produits/nouveau"
          className="px-5 py-3 bg-white hover:bg-neutral-100 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-white/10 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Ajouter un Cadre 3D
        </Link>
      </div>

      {/* Grille Produits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {products.map((product) => {
          const variant = product.variants?.[0]
          const stock = variant?.stock ?? 5
          const stockAlert = variant?.stockAlert ?? 3
          const isLowStock = stock < stockAlert && stock > 0
          const isOutOfStock = stock === 0
          const isVintage = product.era === 'VINTAGE' || (product.year && product.year < 2000)

          return (
            <div
              key={product.id}
              className="bg-neutral-900/80 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 transition-all duration-300 flex flex-col justify-between shadow-lg group"
            >
              {/* Image & Badges */}
              <div className="relative aspect-[4/3] bg-black overflow-hidden">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-neutral-700 bg-neutral-950">
                    <Package className="w-8 h-8" />
                  </div>
                )}

                {/* Status Badges en haut à gauche */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="text-[9px] font-bold bg-black/80 backdrop-blur-md text-amber-400 border border-neutral-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {product.brand}
                  </span>
                  <span className="text-[9px] font-semibold bg-black/70 backdrop-blur-md text-white border border-neutral-800 px-2 py-0.5 rounded-full">
                    {isVintage ? 'Vintage' : 'Moderne'}
                  </span>
                  {isOutOfStock && (
                    <span className="text-[9px] font-bold bg-rose-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Épuisé
                    </span>
                  )}
                  {isLowStock && (
                    <span className="text-[9px] font-bold bg-amber-400 text-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle className="w-2.5 h-2.5" /> {stock} restant{stock > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>

              {/* Contenu & Prix */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm leading-snug line-clamp-1 group-hover:text-amber-300 transition">
                    {product.name}
                  </h3>
                  <p className="text-neutral-400 text-xs line-clamp-2 mt-1 font-light leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                  <div>
                    <span className="text-base font-bold text-white">49,99 €</span>
                    <span className="text-[10px] text-emerald-400 block font-medium">Livraison offerte</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-400 font-mono">
                      Stock : <strong className="text-white">{stock}</strong>
                    </span>
                    <Link
                      href={`/admin/produits/${product.id}`}
                      className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition"
                      title="Modifier"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
