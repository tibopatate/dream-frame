'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface FlyParticle {
  id: string
  startX: number
  startY: number
  endX: number
  endY: number
  image?: string
  quantity: number
}

/**
 * Déclencheur global de l'animation Fly to Cart
 */
export function triggerFlyToCart(e: React.MouseEvent | { clientX: number; clientY: number }, data?: { image?: string; quantity?: number }) {
  if (typeof window === 'undefined') return

  const clientX = 'clientX' in e ? e.clientX : window.innerWidth / 2
  const clientY = 'clientY' in e ? e.clientY : window.innerHeight / 2

  window.dispatchEvent(
    new CustomEvent('dreamframe:fly-to-cart', {
      detail: {
        x: clientX,
        y: clientY,
        image: data?.image,
        quantity: data?.quantity || 1,
      },
    })
  )
}

/**
 * Composant FlyToCart — Anime un projectile rond blanc avec écriture noire
 * qui s'envole depuis le bouton cliqué directement vers l'icône du Panier dans le header.
 */
export function FlyToCart() {
  const [particles, setParticles] = useState<FlyParticle[]>([])

  useEffect(() => {
    const handleFly = (event: Event) => {
      const customEvent = event as CustomEvent<{ x: number; y: number; image?: string; quantity?: number }>
      const { x, y, image, quantity = 1 } = customEvent.detail

      // Trouver l'icône du panier dans le header
      const cartIcon = document.getElementById('header-cart-icon')
      let endX = window.innerWidth - 60
      let endY = 40

      if (cartIcon) {
        const rect = cartIcon.getBoundingClientRect()
        endX = rect.left + rect.width / 2
        endY = rect.top + rect.height / 2
      }

      const newParticle: FlyParticle = {
        id: `${Date.now()}-${Math.random()}`,
        startX: x,
        startY: y,
        endX,
        endY,
        image,
        quantity,
      }

      setParticles((prev) => [...prev, newParticle])

      // Déclencher le bounce sur l'icône du panier à l'atterrissage
      setTimeout(() => {
        if (cartIcon) {
          cartIcon.dispatchEvent(new CustomEvent('dreamframe:cart-bump'))
        }
      }, 650)
    }

    window.addEventListener('dreamframe:fly-to-cart', handleFly)
    return () => window.removeEventListener('dreamframe:fly-to-cart', handleFly)
  }, [])

  const removeParticle = (id: string) => {
    setParticles((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[999999] overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => {
          // Calculer un point d'inflexion pour une trajectoire en arc courbe dynamique
          const midX = (p.startX + p.endX) / 2 - 40
          const midY = Math.min(p.startY, p.endY) - 80

          return (
            <motion.div
              key={p.id}
              initial={{
                x: p.startX - 18,
                y: p.startY - 18,
                scale: 0.8,
                opacity: 1,
              }}
              animate={{
                x: [p.startX - 18, midX, p.endX - 18],
                y: [p.startY - 18, midY, p.endY - 18],
                scale: [0.8, 1.25, 0.3],
                opacity: [1, 1, 0.9],
              }}
              exit={{ opacity: 0, scale: 0.1 }}
              transition={{
                duration: 0.7,
                ease: [0.2, 0.8, 0.2, 1], // Accélération exponentielle d'atterrissage
              }}
              onAnimationComplete={() => removeParticle(p.id)}
              className="absolute top-0 left-0"
            >
              {/* Bulle ronde, fond blanc, écriture noire */}
              <div className="relative w-9 h-9 rounded-full bg-white text-black font-black text-xs flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.8)] border-2 border-neutral-200">
                {p.image ? (
                  <>
                    <div className="relative w-full h-full rounded-full overflow-hidden">
                      <Image src={p.image} alt="" fill className="object-cover" />
                    </div>
                    <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                      +{p.quantity}
                    </span>
                  </>
                ) : (
                  <span>+{p.quantity}</span>
                )}
                {/* Lueur traînante */}
                <div className="absolute inset-0 rounded-full bg-white/40 blur-md animate-ping" />
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
