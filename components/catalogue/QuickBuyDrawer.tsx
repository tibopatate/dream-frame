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

const FORMATS = [
  { id: 'fmt-a4', name: 'Standard A4', size: '21 × 29.7 cm', price: 49.99, scale: '1:24' },
  { id: 'fmt-a3', name: 'Grand Format A3 Collector', size: '30 × 42 cm', price: 150.0, scale: '1:18 Grand Relief' },
  { id: 'fmt-a2', name: 'Prestige Galerie A2', size: '50 × 70 cm', price: 250.0, scale: '1:18 Pièce Maîtresse' },
]

export function QuickBuyDrawer({ product, onClose }: QuickBuyDrawerProps) {
  const [selectedFormat, setSelectedFormat] = useState(FORMATS[0])
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const addItem = useCart((s) => s.addItem)

  if (!product) return null

  const handleAddToCart = (e: React.MouseEvent) => {
    triggerFlyToCart(e, { image: product.images[0], quantity })
    addItem({
      variantId: `${product.id}-${selectedFormat.id}`,
      productId: product.id,
      productName: product.name,
      slug: product.slug,
      brand: product.brand,
      image: product.images[0],
      price: selectedFormat.price,
      quantity,
      formatName: selectedFormat.name,
      formatSize: selectedFormat.size,
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
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-lg bg-neutral-900 border border-neutral-800 transition"
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

        {/* Sélecteur de Formats */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold block">
            Choisir le format
          </label>
          <div className="grid grid-cols-1 gap-2">
            {FORMATS.map((fmt) => {
              const isSelected = selectedFormat.id === fmt.id
              return (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setSelectedFormat(fmt)}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-900 border-amber-400 shadow-sm'
                      : 'bg-black/50 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-white block">{fmt.name}</span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {fmt.size} · {fmt.scale}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-amber-400">
                    {fmt.price.toFixed(2).replace('.', ',')} €
                  </span>
                </button>
              )
            })}
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
                className="px-2.5 py-1 text-xs text-neutral-400 hover:text-white"
              >
                -
              </button>
              <span className="px-2 text-xs font-bold text-white">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="px-2.5 py-1 text-xs text-neutral-400 hover:text-white"
              >
                +
              </button>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-neutral-400 block font-light">Total TTC</span>
            <span className="text-lg font-bold text-white">
              {(selectedFormat.price * quantity).toFixed(2).replace('.', ',')} €
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
