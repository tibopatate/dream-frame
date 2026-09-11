'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Menu, Truck, LayoutDashboard, Instagram } from 'lucide-react'
import { TikTokIcon } from '@/components/icons/TikTokIcon'

interface NavItem {
  href: string
  label: string
  sub: string
  delay: number
  accent?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { href: '/',          label: 'Accueil',             sub: 'Page d’accueil de la boutique', delay: 0 },
  { href: '/catalogue', label: 'La Collection',       sub: 'Toutes nos créations sous cadre', delay: 0.04 },
  { href: '/suivi',     label: 'Suivi de Commande',   sub: 'État d’assemblage & Colissimo', delay: 0.08 },
  { href: '/panier',    label: 'Mon Panier',          sub: 'Vérifier ma commande', delay: 0.12 },
]

const itemVariants = {
  hidden:  { opacity: 0, x: -24 },
  visible: (delay: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
  exit: { opacity: 0, x: -16, transition: { duration: 0.2 } },
}

const overlayVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit:    { opacity: 0, transition: { duration: 0.25 } },
}

const drawerVariants = {
  hidden:  { x: '-100%' },
  visible: { x: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
  exit:    { x: '-100%', transition: { duration: 0.35, ease: [0.76, 0, 0.24, 1] as const } },
}

/**
 * MobileNav — Drawer latéral gauche animé pour mobile.
 * Exposé comme deux sous-composants :
 *   - <MobileNavToggle /> : Bouton hamburger → croix
 *   - <MobileNavDrawer /> : Le panneau lui-même
 * 
 * Le state est partagé via un custom event léger (évite un provider/context
 * pour un composant aussi ponctuel).
 */

const EVENT = 'dreamframe:mobile-nav'

function dispatch(open: boolean) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { open } }))
}

// ─── Toggle Hamburger ─────────────────────────────────────────────────────────

export function MobileNavToggle({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      setOpen((e as CustomEvent).detail.open)
    }
    window.addEventListener(EVENT, handler)
    return () => window.removeEventListener(EVENT, handler)
  }, [])

  const toggle = () => dispatch(!open)

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
      className={
        className ||
        'p-2.5 -ml-2 text-white/90 hover:text-white transition-colors duration-200 group flex items-center justify-center cursor-pointer focus:outline-none'
      }
    >
      <div className="w-6 h-4 flex flex-col justify-between">
        <span
          className={`h-[2px] bg-white rounded-full transition-all duration-300 ${
            open ? 'w-6 rotate-45 translate-y-[7px]' : 'w-6'
          }`}
        />
        <span
          className={`h-[2px] bg-white rounded-full transition-all duration-300 ${
            open ? 'opacity-0' : 'w-4 group-hover:w-6'
          }`}
        />
        <span
          className={`h-[2px] bg-white rounded-full transition-all duration-300 ${
            open ? 'w-6 -rotate-45 -translate-y-[7px]' : 'w-5 group-hover:w-6'
          }`}
        />
      </div>
    </button>
  )
}

// ─── Drawer ───────────────────────────────────────────────────────────────────

export function MobileNavDrawer() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      const isOpen = (e as CustomEvent).detail.open
      setOpen(isOpen)
      // Bloquer le scroll body quand ouvert
      document.body.style.overflow = isOpen ? 'hidden' : ''
    }
    window.addEventListener(EVENT, handler)
    return () => {
      window.removeEventListener(EVENT, handler)
      document.body.style.overflow = ''
    }
  }, [])

  const close = () => dispatch(false)

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={close}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          />

          {/* Drawer */}
          <motion.nav
            key="drawer"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed left-0 top-0 bottom-0 z-50 w-[300px] bg-[#0C0C0A] border-r border-neutral-800 flex flex-col md:hidden overflow-y-auto"
          >
            {/* En-tête du drawer */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800">
              <div>
                <p className="text-base font-bold tracking-tight text-white uppercase">Dream Frame</p>
                <p className="text-[9px] text-amber-400 tracking-[0.2em] uppercase mt-0.5">Art Automobile · 3D</p>
              </div>
              <button
                onClick={close}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all"
                aria-label="Fermer"
              >
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            {/* Bandeau livraison */}
            <div className="flex items-center gap-2 px-6 py-3 border-b border-neutral-800/60 bg-emerald-950/30">
              <Truck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span className="text-[10px] text-emerald-300 tracking-wider uppercase">Livraison Colissimo 100% Offerte</span>
            </div>

            {/* Items de navigation */}
            <div className="flex-1 px-4 py-6 space-y-1">
              <AnimatePresence>
                {NAV_ITEMS.map((item) => (
                  <motion.div
                    key={item.href}
                    custom={item.delay}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <Link
                      href={item.href}
                      onClick={close}
                      className={`flex flex-col px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                        item.accent
                          ? 'bg-neutral-900 border border-amber-400/30 hover:border-amber-400/60 hover:bg-neutral-800'
                          : 'hover:bg-neutral-900 border border-transparent hover:border-neutral-800'
                      }`}
                    >
                      <span className={`text-sm font-semibold flex items-center gap-2 ${item.accent ? 'text-amber-400' : 'text-white group-hover:text-amber-300'} transition-colors`}>
                        {item.accent && <Sparkles className="w-3.5 h-3.5" />}
                        {item.label}
                      </span>
                      <span className="text-[10px] text-neutral-500 mt-0.5">{item.sub}</span>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Réseaux sociaux & Footer drawer */}
            <div className="px-4 py-5 border-t border-neutral-800 space-y-3">
              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider text-center">
                Suivez-nous :
              </p>
              <div className="flex items-center justify-center gap-2">
                <a
                  href="https://www.instagram.com/dreamframe996?stkn=cW9yb2NxOG8wOXFw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-600 text-white text-xs font-semibold flex items-center justify-center gap-2 transition hover:bg-neutral-800"
                >
                  <Instagram className="w-3.5 h-3.5 text-white" />
                  <span>Instagram</span>
                </a>
                <a
                  href="https://www.tiktok.com/@dreamframe_officiel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-600 text-white text-xs font-semibold flex items-center justify-center gap-2 transition hover:bg-neutral-800"
                >
                  <TikTokIcon className="w-3.5 h-3.5 text-white" />
                  <span>TikTok</span>
                </a>
              </div>
              <p className="text-[10px] text-neutral-500 px-4 text-center">
                © {new Date().getFullYear()} Dream Frame — Fait main en France
              </p>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  )
}
