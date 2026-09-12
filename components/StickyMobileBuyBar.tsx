'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, ArrowRight, Check, Sparkles } from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { triggerFlyToCart } from '@/components/FlyToCart'

interface StickyMobileBuyBarProps {
  product?: {
    id: string
    name: string
    slug: string
    brand?: string
    price: number
    imageUrl: string
  }
}

export function StickyMobileBuyBar({ product }: StickyMobileBuyBarProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const pathname = usePathname()
  const addItem = useCart((s) => s.addItem)

  useEffect(() => {
    const handleScroll = () => {
      // Afficher quand l'utilisateur a défilé > 320px sur mobile
      if (window.scrollY > 320) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Ne pas afficher sur panier, checkout, catalogue ou admin
  if (
    pathname?.startsWith('/panier') ||
    pathname?.startsWith('/checkout') ||
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/catalogue') ||
    pathname?.startsWith('/configurateur')
  ) {
    return null
  }

  // Si on est sur une page produit et aucun produit spécifique n'est passé au layout,
  // ne pas afficher une fausse voiture hardcodée (la page produit a déjà son sélecteur de format)
  if (pathname?.startsWith('/produit') && !product) {
    return null
  }

  if (!isVisible) return null

  // Cas 1 : Produit spécifique passé en prop
  if (product) {
    const handleAddToCart = (e: React.MouseEvent) => {
      triggerFlyToCart(e, { image: product.imageUrl, quantity: 1 })
      addItem({
        variantId: `var-${product.id}`,
        productId: product.id,
        productName: product.name,
        slug: product.slug,
        brand: product.brand || 'Dream Frame',
        image: product.imageUrl,
        price: product.price,
        quantity: 1,
      })
      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 2000)
    }

    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-800 p-3 px-4 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between gap-3">
          <Link href={`/produit/${product.slug}`} className="flex items-center gap-2.5 min-w-0">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 flex-shrink-0">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white truncate leading-tight">
                {product.name}
              </h4>
              <p className="text-[11px] text-amber-400 font-mono font-bold">
                À partir de {product.price.toFixed(2).replace('.', ',')} €
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleAddToCart}
              className="px-3.5 py-2.5 bg-white hover:bg-neutral-100 text-black text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 active:scale-95 shadow-md shadow-white/10"
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ajouté</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Panier</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Cas 2 : Sur Homepage — Invitation claire vers le catalogue
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-800 p-3 px-4 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold text-white truncate">
            Collection Dream Frame
          </p>
          <p className="text-[11px] text-amber-400 font-mono">
            À partir de 49,90 € · Livraison Offerte
          </p>
        </div>

        <Link
          href="/catalogue"
          className="px-4 py-2.5 bg-white hover:bg-neutral-100 text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 active:scale-95 shadow-md shadow-white/10 flex-shrink-0"
        >
          <span>Découvrir</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
