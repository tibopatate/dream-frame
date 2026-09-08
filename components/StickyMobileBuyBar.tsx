'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Zap, ArrowRight, Check } from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { triggerFlyToCart } from '@/components/FlyToCart'

interface StickyMobileBuyBarProps {
  product?: {
    id: string
    name: string
    slug: string
    price: number
    imageUrl: string
  }
}

export function StickyMobileBuyBar({ product }: StickyMobileBuyBarProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const addItem = useCart((s) => s.addItem)

  const defaultProduct = product || {
    id: 'real-bugatti-chiron',
    name: 'Bugatti Chiron (2016)',
    slug: 'bugatti-chiron-2016-cadre-3d',
    price: 49.99,
    imageUrl: '/atelier/chiron-wall.jpg',
  }

  useEffect(() => {
    const handleScroll = () => {
      // Afficher seulement quand l'utilisateur a défilé > 350px sur mobile
      if (window.scrollY > 350) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleAddToCart = (e: React.MouseEvent) => {
    triggerFlyToCart(e, { image: defaultProduct.imageUrl, quantity: 1 })
    addItem({
      variantId: `var-${defaultProduct.id}`,
      productId: defaultProduct.id,
      productName: defaultProduct.name,
      slug: defaultProduct.slug,
      brand: 'Bugatti',
      image: defaultProduct.imageUrl,
      price: defaultProduct.price,
      quantity: 1,
    })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-800 p-3 px-4 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] animate-slide-up">
      <div className="flex items-center justify-between gap-3">
        {/* Miniature & Titre */}
        <Link href={`/produit/${defaultProduct.slug}`} className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 flex-shrink-0">
            <Image
              src={defaultProduct.imageUrl}
              alt={defaultProduct.name}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white truncate leading-tight">
              {defaultProduct.name}
            </h4>
            <p className="text-[11px] text-amber-400 font-mono font-bold">
              {defaultProduct.price.toFixed(2)} €{' '}
              <span className="text-[9px] text-neutral-400 font-normal font-sans">· Express 24h</span>
            </p>
          </div>
        </Link>

        {/* Boutons d'Action Rapides */}
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

          <Link
            href="/panier"
            className="px-3.5 py-2.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold rounded-xl transition-all flex items-center gap-1 active:scale-95 shadow-md shadow-amber-400/20"
          >
            <span>Acheter</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
