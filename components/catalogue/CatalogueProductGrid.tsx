'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ShoppingBag, Zap } from 'lucide-react'
import type { MockProduct } from '@/lib/mock-data'
import { QuickBuyDrawer } from '@/components/catalogue/QuickBuyDrawer'

interface CatalogueProductGridProps {
  products: MockProduct[]
}

export function CatalogueProductGrid({ products }: CatalogueProductGridProps) {
  const [quickBuyProduct, setQuickBuyProduct] = useState<MockProduct | null>(null)

  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md mx-auto space-y-3">
        <p className="text-neutral-400 text-xs font-mono uppercase tracking-wider">
          Aucune pièce ne correspond à votre recherche
        </p>
        <Link href="/catalogue" className="text-xs text-amber-400 underline inline-block">
          Réinitialiser les critères
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
        {products.map((product, idx) => {
          const variant = product.variants[0]
          const inStock = (variant?.stock ?? 0) > 0

          return (
            <div
              key={product.id}
              className="group bg-neutral-900/90 border border-neutral-800/90 hover:border-neutral-700 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-lg"
            >
              {/* Visuel du cadre */}
              <Link
                href={`/produit/${product.slug}`}
                className="block relative aspect-[4/3] bg-black overflow-hidden"
              >
                {product.images[0] ? (
                  <>
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className={`object-cover transition-all duration-500 ${
                        product.images[1] ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-105'
                      }`}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    {product.images[1] && (
                      <Image
                        src={product.images[1]}
                        alt={`${product.name} - Vue 2`}
                        fill
                        className="object-cover opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 pointer-events-none"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    )}
                  </>
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

                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-neutral-300 text-[9px] px-2.5 py-1 rounded-full border border-neutral-800 flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 text-amber-400" />
                  LED intégrée
                </div>

                {!inStock && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-xs font-mono uppercase tracking-widest text-white border border-neutral-700 px-3 py-1 rounded-full bg-neutral-900">
                      Épuisé
                    </span>
                  </div>
                )}
              </Link>

              {/* Informations & CTA */}
              <div className="p-5 space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold block">
                    0{idx + 1} — {product.brand.toUpperCase()}
                  </span>
                  <Link
                    href={`/produit/${product.slug}`}
                    className="text-base text-white group-hover:text-amber-300 block truncate transition-colors"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-neutral-400 font-light line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Prix & Boutons d'Action */}
                <div className="flex items-center justify-between border-t border-neutral-800 pt-3">
                  <div>
                    <span className="text-[10px] text-neutral-400 block font-light">
                      À partir de
                    </span>
                    <p className="text-base font-bold text-white ">
                      {product.price.toFixed(2).replace('.', ',')} €
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Bouton Achat Rapide avec choix de formats */}
                    <button
                      type="button"
                      onClick={() => setQuickBuyProduct(product)}
                      title="Achat Rapide"
                      className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-xl border border-neutral-700 transition active:scale-95 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>

                    {/* Bouton Voir la Fiche Complète */}
                    <Link
                      href={`/produit/${product.slug}`}
                      className="px-3 py-2 bg-white hover:bg-neutral-100 text-black font-bold text-[11px] tracking-wider uppercase rounded-xl transition-all shadow-sm flex items-center gap-1 active:scale-95"
                    >
                      <span>VOIR LE FRAME</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Drawer d'achat rapide */}
      <QuickBuyDrawer
        product={quickBuyProduct}
        onClose={() => setQuickBuyProduct(null)}
      />
    </>
  )
}
