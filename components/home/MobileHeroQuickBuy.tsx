'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Check, ShoppingBag, Truck, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { triggerFlyToCart } from '@/components/FlyToCart'

const FEATURED_MODELS = [
  {
    id: 'prod-porsche-gt3rs',
    variantId: 'var-gt3rs',
    name: 'Porsche 911 GT3 RS (992)',
    shortName: 'GT3 RS',
    brand: 'Porsche',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1000&auto=format&fit=crop',
    price: 49.99,
    sku: 'DF-PORSCHE-001',
  },
  {
    id: 'prod-ferrari-f40',
    variantId: 'var-f40',
    name: 'Ferrari F40 (1987)',
    shortName: 'Ferrari F40',
    brand: 'Ferrari',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1000&auto=format&fit=crop',
    price: 49.99,
    sku: 'DF-FERRARI-001',
  },
  {
    id: 'prod-lambo-revuelto',
    variantId: 'var-revuelto',
    name: 'Lamborghini Revuelto V12',
    shortName: 'Revuelto',
    brand: 'Lamborghini',
    image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=1000&auto=format&fit=crop',
    price: 49.99,
    sku: 'DF-LAMBO-001',
  },
]

export function MobileHeroQuickBuy() {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  const activeModel = FEATURED_MODELS[selectedIdx]

  const handleAddToCart = (e: React.MouseEvent) => {
    // 1. Particule Fly-to-Cart vers l'icône du panier
    triggerFlyToCart(e, {
      image: activeModel.image,
      quantity: 1,
    })

    // 2. Ajouter au panier Zustand
    addItem({
      variantId: activeModel.variantId,
      productId: activeModel.id,
      productName: activeModel.name,
      sku: activeModel.sku,
      price: activeModel.price,
      quantity: 1,
      image: activeModel.image,
      options: {
        dimensions: 'A4 (21 x 29.7 cm)',
        ledColor: 'Ambre Chaud 3000K',
      },
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="w-full sm:hidden mt-3 px-0.5">
      {/* Sélecteur compact de modèle en pilules ultra-fines */}
      <div className="flex items-center justify-center gap-1 mb-2">
        {FEATURED_MODELS.map((mod, idx) => (
          <button
            key={mod.id}
            type="button"
            onClick={() => {
              setSelectedIdx(idx)
              setAdded(false)
            }}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide transition-all ${
              selectedIdx === idx
                ? 'bg-amber-400 text-black shadow-sm'
                : 'bg-black/50 text-neutral-300 border border-white/10 hover:text-white'
            }`}
          >
            {mod.shortName}
          </button>
        ))}
      </div>

      {/* Carte Produit Épurée & Compacte */}
      <div className="bg-black/70 backdrop-blur-lg border border-white/10 rounded-xl p-2.5 shadow-xl">
        <div className="flex items-center gap-2.5">
          {/* Miniature compacte */}
          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-neutral-900 border border-white/10 flex-shrink-0">
            <Image
              src={activeModel.image}
              alt={activeModel.name}
              fill
              className="object-cover"
              sizes="60px"
            />
            <span className="absolute bottom-0.5 right-0.5 bg-black/85 px-1 py-0.2 rounded text-[7px] text-amber-400 font-bold">
              LED
            </span>
          </div>

          {/* Info modèle & prix */}
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-amber-400 font-mono uppercase tracking-wider">
                {activeModel.brand}
              </span>
              <span className="text-xs font-black text-white">49,99 €</span>
            </div>
            <h3 className="text-xs font-bold text-white truncate leading-snug">
              {activeModel.name}
            </h3>
            <p className="text-[9px] text-neutral-400 flex items-center gap-1 mt-0.5">
              <Truck className="w-2.5 h-2.5 text-amber-400" />
              Livraison Offerte · Atelier France
            </p>
          </div>
        </div>

        {/* Boutons d'Action Rapide en ligne compacte */}
        <div className="grid grid-cols-2 gap-1.5 pt-2 mt-1.5 border-t border-white/10">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full py-2 px-2 bg-white/95 hover:bg-white text-black font-bold text-[11px] uppercase tracking-wider rounded-lg transition flex items-center justify-center gap-1 shadow-xs active:scale-[0.98]"
          >
            {added ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Ajouté</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3" />
                <span>Au Panier</span>
              </>
            )}
          </button>

          <Link
            href="/panier"
            className="w-full py-2 px-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-[11px] uppercase tracking-wider rounded-lg transition flex items-center justify-center gap-1 active:scale-[0.98]"
          >
            <span>Commander</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
