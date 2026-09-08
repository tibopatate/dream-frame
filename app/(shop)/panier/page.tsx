'use client'

import { useCart } from '@/lib/store/cart'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, RefreshCw, Truck, ShieldCheck, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function PanierPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotal, count } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-[#080807] text-white">
        <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
      </div>
    )
  }

  const total = subtotal

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center space-y-6 bg-[#080807] text-white">
        <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-7 h-7 text-neutral-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-serif text-white">Votre collection est vide</h1>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-sm mx-auto font-light leading-relaxed">
            Parcourez notre collection officielle ou créez une pièce sur-mesure dans notre atelier.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <Link
            href="/catalogue"
            className="inline-flex items-center justify-center bg-white hover:bg-neutral-100 text-black font-semibold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all shadow-lg"
          >
            Explorer la Collection
          </Link>
          <Link
            href="/configurateur"
            className="inline-flex items-center justify-center border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 mr-2" />
            L'Atelier Sur-Mesure
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10 bg-[#080807] text-white">
      <div className="border-b border-neutral-800 pb-4 flex items-baseline justify-between">
        <h1 className="text-2xl sm:text-4xl font-serif text-white">Votre Panier</h1>
        <span className="text-xs text-neutral-400 uppercase tracking-wider font-mono">
          {count} Pièce{count > 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Liste des pièces */}
        <div className="lg:col-span-8 space-y-6">
          {/* Bandeau Livraison 100% Offerte */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5 flex items-center gap-3 shadow-md">
            <Truck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div className="text-xs">
              <span className="text-white font-bold uppercase tracking-wider block">
                Livraison Colissimo Suivie 100% Offerte
              </span>
              <span className="text-neutral-400 font-light text-[11px]">
                Emballage renforcé antichoc · Expédition sous 24/48h avec numéro de suivi.
              </span>
            </div>
          </div>

          {/* Cartes Articles Arrondies */}
          <div className="border border-neutral-800 rounded-2xl divide-y divide-neutral-800/80 bg-neutral-900/60 overflow-hidden shadow-lg">
            {items.map((item) => (
              <div key={item.variantId} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-black border border-neutral-800 overflow-hidden flex-shrink-0">
                  <Image src={item.image} alt={item.productName} fill className="object-cover" />
                </div>

                <div className="flex-1 min-w-0 text-center sm:text-left space-y-1">
                  <p className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                    {item.brand}
                  </p>
                  <Link
                    href={`/produit/${item.slug}`}
                    className="font-serif text-base sm:text-lg text-white hover:text-amber-300 block truncate transition-colors"
                  >
                    {item.productName}
                  </Link>
                  {item.formatName ? (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-medium text-amber-400">
                        {item.formatName}
                      </span>
                      {item.formatSize && (
                        <span className="text-[11px] text-neutral-400 font-mono">
                          ({item.formatSize})
                        </span>
                      )}
                      <span className="text-[10px] text-neutral-500">· Vitrage HD & LED</span>
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-400 font-light">Pièce sous vitrage HD · Rétroéclairage LED</p>
                  )}
                </div>

                {/* Sélecteur de quantité moderne */}
                <div className="flex items-center gap-1 bg-black border border-neutral-800 rounded-lg p-1">
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                    className="w-7 h-7 rounded flex items-center justify-center hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-7 text-center text-xs font-mono text-white">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                    className="w-7 h-7 rounded flex items-center justify-center hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Prix & Suppression */}
                <div className="text-center sm:text-right space-y-1">
                  <p className="font-bold text-white text-base">
                    {formatPrice(item.price * item.quantity * 100)}
                  </p>
                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="text-neutral-500 hover:text-rose-400 transition-colors inline-flex items-center gap-1 text-[10px] uppercase tracking-wider"
                  >
                    <Trash2 className="w-3 h-3" />
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={clearCart}
            className="text-xs text-neutral-500 hover:text-white transition font-light"
          >
            Vider le panier
          </button>
        </div>

        {/* Synthèse de commande */}
        <div className="lg:col-span-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 sm:p-7 space-y-6 shadow-xl">
          <h2 className="font-semibold uppercase tracking-wider text-white text-xs">
            Détail de la commande
          </h2>

          <div className="space-y-3 text-xs border-b border-neutral-800 pb-4">
            <div className="flex justify-between text-neutral-300">
              <span>Sous-total ({count} article{count > 1 ? 's' : ''})</span>
              <span className="text-white font-semibold">{formatPrice(subtotal * 100)}</span>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span>Livraison Colissimo</span>
              <span className="text-emerald-400 font-bold uppercase">100% Offerte</span>
            </div>
            <div className="flex justify-between text-[11px] text-neutral-400 pt-1">
              <span>TVA incluse (20%)</span>
              <span>{formatPrice((subtotal - subtotal / 1.2) * 100)}</span>
            </div>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-xs uppercase tracking-wider text-neutral-400">Total TTC</span>
            <span className="font-serif text-3xl font-bold text-white">{formatPrice(total * 100)}</span>
          </div>

          <Link
            href="/checkout"
            className="w-full py-4 bg-white hover:bg-neutral-100 text-black font-semibold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-white/10"
          >
            Passer la commande
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="border border-neutral-800 rounded-xl bg-black/40 p-4 space-y-2 text-xs text-neutral-400 font-light">
            <div className="flex items-center gap-2 text-neutral-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Paiement 100% sécurisé via Stripe</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400">✓</span>
              <span>Garantie satisfait ou remboursé 14 jours</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
