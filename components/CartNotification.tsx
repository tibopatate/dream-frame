'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/lib/store/cart'
import Link from 'next/link'
import Image from 'next/image'
import { Check, ShoppingBag, X } from 'lucide-react'

/**
 * CartNotification — Notification d'ajout au panier.
 * Spécification demandée :
 * - Fond blanc
 * - Écriture noire
 * - Forme ronde (rounded-full)
 * - Affiche la quantité ajoutée et l'article
 */
export function CartNotification() {
  const lastNotification = useCart((s) => s.lastNotification)
  const clearNotification = useCart((s) => s.clearNotification)
  const [visible, setVisible] = useState(false)
  const [currentNotif, setCurrentNotif] = useState(lastNotification)

  useEffect(() => {
    if (lastNotification) {
      setCurrentNotif(lastNotification)
      setVisible(true)

      const timer = setTimeout(() => {
        setVisible(false)
        clearNotification()
      }, 3200)

      return () => clearTimeout(timer)
    }
  }, [lastNotification, clearNotification])

  return (
    <AnimatePresence>
      {visible && currentNotif && (
        <motion.div
          initial={{ opacity: 0, y: -28, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 450, damping: 32 }}
          className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-[9999] pointer-events-auto px-3 max-w-[92vw] sm:max-w-md w-auto"
        >
          {/* Bulle / Forme ronde, Fond Blanc, Écriture Noire */}
          <div className="bg-white text-black rounded-full px-4 sm:px-5 py-2.5 sm:py-3 shadow-[0_16px_40px_rgba(0,0,0,0.6)] border border-neutral-200/90 flex items-center gap-3 sm:gap-4 select-none">
            {/* Miniature du cadre ou icône check */}
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 overflow-hidden shadow-inner">
              {currentNotif.image ? (
                <Image
                  src={currentNotif.image}
                  alt={currentNotif.productName}
                  fill
                  className="object-cover"
                />
              ) : (
                <Check className="w-4 h-4 text-white stroke-[2.5]" />
              )}
              {/* Petit badge vert superposé */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white flex items-center justify-center">
                <Check className="w-2 h-2 text-white stroke-[3]" />
              </div>
            </div>

            {/* Texte de la notification : Noir sur Fond Blanc */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center justify-center bg-black text-white text-[10px] font-black px-2 py-0.5 rounded-full leading-none">
                  +{currentNotif.quantity}
                </span>
                <p className="text-xs font-black text-black tracking-tight truncate">
                  Ajouté au panier !
                </p>
              </div>
              <p className="text-[11px] text-neutral-600 font-medium truncate mt-0.5">
                {currentNotif.productName}
              </p>
            </div>

            {/* Bouton Voir le Panier */}
            <Link
              href="/panier"
              onClick={() => setVisible(false)}
              className="flex-shrink-0 bg-neutral-950 hover:bg-neutral-800 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <ShoppingBag className="w-3 h-3" />
              <span>Panier ({currentNotif.totalCount})</span>
            </Link>

            {/* Fermer */}
            <button
              onClick={() => {
                setVisible(false)
                clearNotification()
              }}
              className="p-1 rounded-full text-neutral-400 hover:text-black transition-colors"
              aria-label="Fermer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
