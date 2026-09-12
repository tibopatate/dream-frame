'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, Truck, ShieldCheck, Sparkles, Package } from 'lucide-react'
import { useCart } from '@/lib/store/cart'

export default function SuccesPage() {
  const { clearCart } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Vider le panier après paiement confirmé
    clearCart()
  }, [clearCart])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#080807] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neutral-700 border-t-amber-400 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <main className="min-h-[80vh] bg-[#080807] text-white flex items-center justify-center px-4 pt-32 sm:pt-40 pb-20">
      <div className="max-w-lg w-full text-center space-y-8">

        {/* Icône de succès animée */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center"
        >
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Halo pulsant */}
            <div className="absolute inset-0 rounded-full bg-emerald-400/10 animate-ping" />
            <div className="absolute inset-2 rounded-full bg-emerald-400/15" />
            <CheckCircle className="relative w-16 h-16 text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.5)]" />
          </div>
        </motion.div>

        {/* Titre */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-3"
        >
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Commande Confirmée
          </h1>
          <p className="text-neutral-400 text-sm font-light leading-relaxed max-w-sm mx-auto">
            Votre cadre Dream Frame est entre nos mains. Vous recevrez un email de confirmation
            avec le numéro de suivi Colissimo dès l&apos;expédition.
          </p>
        </motion.div>

        {/* Étapes de livraison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-4 text-left"
        >
          <h2 className="text-xs tracking-[0.18em] uppercase text-amber-400 text-center">
            Ce qui se passe maintenant
          </h2>
          <div className="space-y-3">
            {[
              {
                icon: CheckCircle,
                step: 'Commande reçue',
                desc: 'Notre équipe prend en charge votre pièce immédiatement.',
                done: true,
              },
              {
                icon: Package,
                step: 'Préparation en atelier',
                desc: 'Contrôle qualité, emballage renforcé antichoc.',
                done: false,
              },
              {
                icon: Truck,
                step: 'Expédition Colissimo',
                desc: 'Sous 24/48h avec numéro de suivi par email.',
                done: false,
              },
            ].map(({ icon: Icon, step, desc, done }, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-emerald-950/60 border border-emerald-800/60' : 'bg-neutral-800 border border-neutral-700'}`}>
                  <Icon className={`w-4 h-4 ${done ? 'text-emerald-400' : 'text-neutral-500'}`} />
                </div>
                <div>
                  <p className={`text-xs font-semibold ${done ? 'text-white' : 'text-neutral-400'}`}>{step}</p>
                  <p className="text-[11px] text-neutral-500 font-light">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Réassurance */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-5 text-xs text-neutral-500"
        >
          <span className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-emerald-400" />
            Livraison Offerte
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            Garanti 2 ans
          </span>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            href="/catalogue"
            className="relative w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-neutral-100 text-black font-bold text-xs uppercase tracking-wider rounded-xl overflow-hidden transition-all shadow-xl shadow-white/10 flex items-center justify-center gap-2 group active:scale-[0.98]"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-black/8 opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-transform duration-700" aria-hidden="true" />
            Explorer la Collection
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-7 py-3.5 border border-neutral-800 hover:border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <span>Retour à l&apos;Accueil</span>
          </Link>
        </motion.div>
      </div>
    </main>
  )
}
