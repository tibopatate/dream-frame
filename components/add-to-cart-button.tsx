'use client'

import { useCart } from '@/lib/store/cart'
import { ShoppingBag, Check } from 'lucide-react'
import { useState } from 'react'
import { triggerFlyToCart } from '@/components/FlyToCart'

interface AddToCartButtonProps {
  variantId: string
  productId: string
  productName: string
  slug: string
  brand: string
  image: string
  price: number
  stock: number
  formatName?: string
  formatSize?: string
  quantity?: number
}

export function AddToCartButton({
  variantId,
  productId,
  productName,
  slug,
  brand,
  image,
  price = 49.90,
  stock,
  formatName,
  formatSize,
  quantity = 1,
}: AddToCartButtonProps) {
  const addItem = useCart((s) => s.addItem)
  const [added, setAdded] = useState(false)

  if (stock === 0) {
    return (
      <button
        disabled
        className="w-full py-4 bg-neutral-900 text-neutral-500 font-medium uppercase tracking-wider text-xs rounded-xl cursor-not-allowed border border-neutral-800"
      >
        Édition Épuisée
      </button>
    )
  }

  const handleAdd = (e: React.MouseEvent) => {
    // 1. Déclencher le projectile volant vers le panier
    triggerFlyToCart(e, { image, quantity })

    // 2. Ajouter l'article dans le store Zustand
    addItem({
      variantId,
      productId,
      productName,
      slug,
      brand,
      image,
      price,
      quantity,
      formatName,
      formatSize,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const totalPrice = price * quantity

  return (
    <button
      onClick={handleAdd}
      className="w-full h-12 px-6 bg-white hover:bg-neutral-100 text-black font-semibold uppercase tracking-wider text-xs rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg shadow-white/5 active:scale-[0.98] cursor-pointer"
    >
      {added ? (
        <>
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Ajouté au panier</span>
        </>
      ) : (
        <>
          <ShoppingBag className="w-4 h-4 text-black" />
          <span>Ajouter à ma collection · {totalPrice.toFixed(2).replace('.', ',')} €</span>
        </>
      )}
    </button>
  )
}
