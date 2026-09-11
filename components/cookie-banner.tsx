'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, X } from 'lucide-react'

/**
 * CookieBanner — Bannière RGPD harmonisée avec le design system Dream Frame.
 * Accessible sur mobile et PC, désactivée dans l'administration.
 */
export function CookieBanner() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Ne jamais afficher dans l'interface admin
    if (pathname?.startsWith('/admin')) {
      setIsOpen(false)
      return
    }

    const consent = localStorage.getItem('dream-frame-cookie-consent')
    if (!consent) {
      const timer = setTimeout(() => setIsOpen(true), 800)
      return () => clearTimeout(timer)
    }
  }, [pathname])

  // Sécurité absolue : pas de bannière dans l'admin
  if (pathname?.startsWith('/admin')) {
    return null
  }

  const accept = () => {
    localStorage.setItem('dream-frame-cookie-consent', 'accepted')
    setIsOpen(false)
  }

  const refuse = () => {
    localStorage.setItem('dream-frame-cookie-consent', 'refused')
    setIsOpen(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-3 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-sm bg-[#0C0C0A]/95 backdrop-blur-xl border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.9)] z-[9999]"
        >
          <div className="flex items-start gap-3">
            {/* Icône */}
            <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center flex-shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </div>

            {/* Texte */}
            <div className="flex-1 space-y-1">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider">
                Respect de votre vie privée
              </h3>
              <p className="text-neutral-500 text-[10px] leading-relaxed font-light">
                Nous utilisons uniquement les cookies strictement nécessaires au fonctionnement du panier
                et du paiement sécurisé. Aucun cookie tiers de tracking.
              </p>
            </div>

            {/* Fermer (= refuser) */}
            <button
              onClick={refuse}
              aria-label="Refuser et fermer"
              className="text-neutral-600 hover:text-white p-1 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-neutral-800/60 text-[10px]">
            <Link href="/cookies" className="text-neutral-600 hover:text-neutral-400 transition-colors hover:underline">
              Politique de cookies
            </Link>
            <div className="flex gap-2">
              <button
                onClick={refuse}
                className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white font-semibold rounded-xl transition-all text-[10px] uppercase tracking-wider"
              >
                Refuser
              </button>
              <button
                onClick={accept}
                className="relative px-4 py-2 bg-white hover:bg-neutral-100 text-black font-bold rounded-xl transition-all overflow-hidden text-[10px] uppercase tracking-wider group active:scale-[0.98]"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-black/8 opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-transform duration-700" aria-hidden="true" />
                Accepter
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
