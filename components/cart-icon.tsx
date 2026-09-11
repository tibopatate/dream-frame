'use client'

import { useEffect, useState } from 'react'
import { useCart } from '@/lib/store/cart'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export function CartIcon() {
  const count = useCart((s) => s.count)
  const [bumping, setBumping] = useState(false)

  useEffect(() => {
    const handleBump = () => {
      setBumping(true)
      setTimeout(() => setBumping(false), 500)
    }

    const icon = document.getElementById('header-cart-icon')
    if (icon) {
      icon.addEventListener('dreamframe:cart-bump', handleBump)
      return () => icon.removeEventListener('dreamframe:cart-bump', handleBump)
    }
  }, [])

  return (
    <motion.div
      id="header-cart-icon"
      animate={bumping ? { scale: [1, 1.28, 0.95, 1.05, 1] } : { scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative inline-block"
    >
      <Link
        href="/panier"
        className="relative flex items-center gap-2 bg-white hover:bg-neutral-100 text-black px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-sm"
      >
        <ShoppingBag className="w-4 h-4 text-black" />
        <span className="hidden sm:inline">Panier</span>

        <AnimatePresence mode="wait">
          {count > 0 && (
            <motion.span
              key={count}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="w-5 h-5 rounded-full bg-amber-400 text-black text-[10px] font-black flex items-center justify-center -ml-1 shadow-[0_0_12px_rgba(251,191,36,0.6)]"
            >
              {count}
            </motion.span>
          )}
        </AnimatePresence>
      </Link>

      {/* Anneau d'onde de choc lors de l'atterrissage du projectile */}
      {bumping && (
        <span className="absolute inset-0 rounded-xl ring-4 ring-amber-400/80 animate-ping pointer-events-none" />
      )}
    </motion.div>
  )
}
