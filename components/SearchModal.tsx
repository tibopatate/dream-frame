'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, X, ShoppingBag, ArrowRight, Zap, Loader2 } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { triggerFlyToCart } from '@/components/FlyToCart'

const POPULAR_SEARCHES = ['Porsche', 'Ferrari', 'Bugatti', 'Vintage', 'McLaren']

function isVideoUrl(url?: string): boolean {
  if (!url) return false
  return /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url)
}

export function SearchModal({ className }: { className?: string } = {}) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const addItem = useCartStore((s) => s.addItem)

  // Charger les vrais produits dynamiques du store
  useEffect(() => {
    let isMounted = true
    async function fetchProducts() {
      try {
        setIsLoading(true)
        const res = await fetch('/api/products')
        const data = await res.json()
        if (isMounted && data.products && Array.isArray(data.products)) {
          setProducts(data.products)
        }
      } catch {
        // En cas d'erreur de réseau, garder la liste vide ou existante
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    fetchProducts()
    return () => {
      isMounted = false
    }
  }, [])

  // Raccourci clavier Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      } else if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Filtrage intelligent sur les vrais produits
  const results =
    query.trim() === ''
      ? products.slice(0, 5)
      : products.filter((p) => {
          const q = query.toLowerCase()
          return (
            p.name?.toLowerCase().includes(q) ||
            p.brand?.toLowerCase().includes(q) ||
            p.era?.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q) ||
            (p.year && p.year.toString().includes(q))
          )
        })

  const handleQuickAdd = (product: any, e: React.MouseEvent) => {
    const imgUrl = product.images?.find((img: string) => !isVideoUrl(img)) || product.images?.[0] || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1200&auto=format&fit=crop'
    triggerFlyToCart(e, {
      image: imgUrl,
      quantity: 1,
    })
    addItem({
      variantId: product.variants?.[0]?.id || `var-${product.id}`,
      productId: product.id,
      productName: product.name,
      sku: product.sku || product.variants?.[0]?.sku || `DF-${(product.brand || 'DF').toUpperCase()}-001`,
      price: product.price || 49.90,
      quantity: 1,
      image: imgUrl,
      options: {
        dimensions: product.formatSize || 'A4 (21 x 29.7 cm)',
        ledColor: 'Ambre Chaud 3000K',
      },
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Recherche de modèles"
        className={
          className ||
          'p-2 text-white/90 hover:text-white transition-colors duration-200 cursor-pointer focus:outline-none flex items-center justify-center'
        }
      >
        <Search className="w-5 h-5 stroke-[1.75]" />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-fade-in">
          {/* Backdrop click to close */}
          <div className="fixed inset-0" onClick={() => setIsOpen(false)} />

          {/* Boîte de dialogue */}
          <div className="relative z-10 w-full max-w-2xl bg-[#0e0e0c] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            {/* Barre d'input */}
            <div className="p-4 border-b border-neutral-800 flex items-center gap-3">
              <Search className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher une supercar, une marque (Porsche, Ferrari...)"
                className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder:text-neutral-500 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 text-neutral-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs text-neutral-400 hover:text-white px-2 py-1 rounded-lg bg-neutral-900 border border-neutral-800 font-mono"
              >
                ESC
              </button>
            </div>

            {/* Recherches populaires */}
            <div className="px-4 py-2.5 bg-neutral-950/60 border-b border-neutral-800/60 flex items-center gap-2 overflow-x-auto text-[11px] no-scrollbar">
              <span className="text-neutral-500 font-medium whitespace-nowrap">Suggestions :</span>
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 whitespace-nowrap transition cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>

            {/* Liste des résultats */}
            <div className="p-3 overflow-y-auto divide-y divide-neutral-900 flex-1">
              {results.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <p className="text-sm font-bold text-white">Aucun cadre trouvé pour &quot;{query}&quot;</p>
                  <p className="text-xs text-neutral-400 font-light">
                    Essayez de rechercher par marque (ex : Ferrari, Porsche, Lamborghini) ou par époque (Vintage, Moderne).
                  </p>
                </div>
              ) : (
                results.map((product) => (
                  <div
                    key={product.id}
                    className="p-3 rounded-xl hover:bg-neutral-900/60 transition flex items-center justify-between gap-3 group"
                  >
                    <Link
                      href={`/produit/${product.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3.5 flex-1 min-w-0"
                    >
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 flex-shrink-0">
                        {isVideoUrl(product.images?.[0]) ? (
                          <video
                            src={product.images[0]}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover group-hover:scale-105 transition pointer-events-none"
                          />
                        ) : (
                          <Image
                            src={
                              product.images?.[0] ||
                              'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1200&auto=format&fit=crop'
                            }
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition"
                            sizes="60px"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                            {product.brand}
                          </span>
                          <span className="text-[10px] text-neutral-500 font-mono">
                            {product.year || 'Édition Spéciale'}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-white truncate group-hover:text-amber-300 transition">
                          {product.name}
                        </p>
                        <p className="text-xs font-semibold text-neutral-300">
                          {(Number(product.price) || 49.90).toFixed(2).replace('.', ',')} €{' '}
                          <span className="text-[10px] text-neutral-500 font-normal">· Livraison Offerte</span>
                        </p>
                      </div>
                    </Link>

                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(product, e)}
                      title="Ajouter au panier"
                      className="p-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black transition shadow-sm flex-shrink-0 cursor-pointer active:scale-95"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Pied de modal */}
            <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
              <span>{results.length} modèle(s) disponible(s) · Cadres A4 avec LED</span>
              <Link
                href="/catalogue"
                onClick={() => setIsOpen(false)}
                className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                <span>Voir toute la collection</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
