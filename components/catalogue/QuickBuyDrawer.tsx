'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Check, ShoppingBag, ArrowRight, Truck, ShieldCheck, Zap } from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { triggerFlyToCart } from '@/components/FlyToCart'
import type { MockProduct } from '@/lib/mock-data'

interface QuickBuyDrawerProps {
  product: MockProduct | null
  onClose: () => void
}

export function QuickBuyDrawer({ product, onClose }: QuickBuyDrawerProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const addItem = useCart((s) => s.addItem)

  if (!product) return null

  const price = Number(product.price) || 49.90
  const formatName =
    (product as any).formatName ||
    (price >= 200
      ? 'Grand Cadre Prestige'
      : price >= 100
      ? 'Cadre Moyen Collector'
      : 'Petit Cadre Standard')

  const formatSize =
    (product as any).formatSize ||
    (price >= 200
      ? '50 × 70 cm'
      : price >= 100
      ? '30 × 42 cm'
      : '21 × 29.7 cm')

  const handleAddToCart = (e: React.MouseEvent) => {
    triggerFlyToCart(e, { image: product.images[0], quantity })
    addItem({
      variantId: `${product.id}-unique`,
      productId: product.id,
      productName: product.name,
      slug: product.slug,
      brand: product.brand,
      image: product.images[0],
      price,
      quantity,
      formatName,
      formatSize,
    })
    setIsAdded(true)
    setTimeout(() => {
      setIsAdded(false)
      onClose()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0e0e0d] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Bouton Fermer */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-lg bg-neutral-900 border border-neutral-800 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* En-tête Produit */}
        <div className="flex gap-4 items-center">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 flex-shrink-0">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
              {product.brand} · {product.year}
            </span>
            <h3 className="text-lg font-bold text-white truncate">{product.name}</h3>
            <p className="text-xs text-neutral-400 font-light mt-0.5 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              Livraison 100% Offerte
            </p>
          </div>
        </div>

        {/* Format Unique Certifié (Non sélectionnable côté client) */}
        <div className="p-4 bg-black/50 border border-neutral-800 rounded-xl space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
            Format d'Art Unique Certifié
          </span>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">{formatName}</p>
              <p className="text-[11px] text-neutral-400 font-mono">Dimensions : {formatSize}</p>
            </div>
            <span className="text-base font-bold text-amber-400 font-mono">
              {price.toFixed(2).replace('.', ',')} €
            </span>
          </div>
        </div>

        {/* Quantité & Total */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80">
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-400">Quantité :</span>
            <div className="flex items-center border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-2.5 py-1 text-xs text-neutral-400 hover:text-white cursor-pointer"
              >
                -
              </button>
              <span className="px-2 text-xs font-bold text-white">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="px-2.5 py-1 text-xs text-neutral-400 hover:text-white cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-mono">Total TTC</span>
            <span className="text-lg font-bold text-white font-mono">
              {(price * quantity).toFixed(2).replace('.', ',')} €
            </span>
          </div>
        </div>

        {/* Boutons d'Action */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full py-3.5 bg-white hover:bg-neutral-100 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 shadow-lg cursor-pointer active:scale-95"
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Ajouté au panier !</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Ajouter au Panier</span>
              </>
            )}
          </button>

          <Link
            href={`/produit/${product.slug}`}
            className="block text-center text-xs text-neutral-400 hover:text-white py-1 transition underline"
          >
            Voir la fiche produit complète &amp; 3D
          </Link>
        </div>
      </div>
    </div>
  )
}
