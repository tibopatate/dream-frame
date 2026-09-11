'use client'

import { useCart } from '@/lib/store/cart'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, RefreshCw, Truck, ShieldCheck, Sparkles, Gift, Tag, Check, PlusCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

const UPSELL_PRODUCTS = [
  {
    id: 'acc-cable-2m',
    name: 'Câble USB 2m Noir Tressé Renforcé',
    desc: 'Longueur idéale pour alimentation murale discrète sans tension.',
    price: 9.90,
    image: '/atelier/WhatsApp Image 2026-09-08 at 13.45.24.jpeg',
  },
  {
    id: 'acc-chevalet-alu',
    name: 'Chevalet de Table Aluminium Noir Mat',
    desc: 'Exposition élégante sur bureau, commode ou bibliothèque.',
    price: 14.90,
    image: '/atelier/WhatsApp Image 2026-09-08 at 13.45.27.jpeg',
  },
  {
    id: 'acc-microfibre',
    name: 'Chiffonnette Optique Microfibre Atelier',
    desc: 'Nettoyage anti-statique sans rayure du vitrage acrylique HD.',
    price: 4.90,
    image: '/atelier/WhatsApp Image 2026-09-08 at 13.45.30.jpeg',
  },
]

export default function PanierPage() {
  const { items, addItem, updateQuantity, removeItem, clearCart, subtotal, count } = useCart()
  const [mounted, setMounted] = useState(false)
  const [isGift, setIsGift] = useState(false)
  const [giftMessage, setGiftMessage] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [discountPercent, setDiscountPercent] = useState(0)
  const [promoError, setPromoError] = useState('')
  const [promoSuccess, setPromoSuccess] = useState('')

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

  const computedSubtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0)
  const computedCount = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0)
  const baseSubtotal = subtotal > 0 ? subtotal : computedSubtotal
  const finalCount = count > 0 ? count : computedCount

  // Calculs additionnels (Cadeau & Code Promo)
  const giftPrice = isGift ? 4.90 : 0
  const discountAmount = discountPercent > 0 ? (baseSubtotal * discountPercent) : 0
  const finalTotal = Math.max(0, baseSubtotal + giftPrice - discountAmount)

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault()
    setPromoError('')
    setPromoSuccess('')
    const code = promoCode.trim().toUpperCase()
    if (!code) return

    if (code === 'DREAM10' || code === 'BIENVENUE10' || code === 'PASSION') {
      setDiscountPercent(0.10)
      setPromoSuccess('Code appliqué : -10% sur votre commande')
    } else {
      setPromoError('Code promo non valide ou expiré')
    }
  }

  const handleAddUpsell = (upsell: typeof UPSELL_PRODUCTS[0]) => {
    addItem({
      variantId: `upsell-${upsell.id}`,
      productId: upsell.id,
      productName: upsell.name,
      slug: 'accessoires',
      brand: 'Atelier Dream Frame',
      image: upsell.image,
      price: upsell.price,
      quantity: 1,
    })
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center space-y-6 bg-[#080807] text-white">
        <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-7 h-7 text-neutral-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl text-white">Votre collection est vide</h1>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-sm mx-auto font-light leading-relaxed">
            Parcourez notre collection officielle de cadres 3D d&apos;art automobile.
          </p>
        </div>
        <div className="flex justify-center pt-2">
          <Link
            href="/catalogue"
            className="inline-flex items-center justify-center bg-white hover:bg-neutral-100 text-black font-semibold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all shadow-lg"
          >
            Explorer la Collection
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 bg-[#080807] text-white">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-6 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Mon Panier</h1>
        <span className="text-xs text-neutral-400 uppercase tracking-wider font-mono">
          {finalCount} Pièce{finalCount > 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Colonne gauche : Articles + Emballage Cadeau + Upsell */}
        <div className="lg:col-span-8 space-y-8">
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

          {/* Cartes Articles */}
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
                    href={item.slug && item.slug !== 'accessoires' ? `/produit/${item.slug}` : '/catalogue'}
                    className="text-base sm:text-lg text-white hover:text-amber-300 block truncate transition-colors"
                  >
                    {item.productName}
                  </Link>
                  {item.formatName ? (
                    <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
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
                    <p className="text-xs text-neutral-400 font-light">Accessoire d&apos;artisanat officiel</p>
                  )}
                </div>

                {/* Sélecteur de quantité */}
                <div className="flex items-center gap-1 bg-black border border-neutral-800 rounded-lg p-1">
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                    className="w-7 h-7 rounded flex items-center justify-center hover:bg-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-7 text-center text-xs font-mono text-white">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                    className="w-7 h-7 rounded flex items-center justify-center hover:bg-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer"
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
                    className="text-neutral-500 hover:text-rose-400 transition-colors inline-flex items-center gap-1 text-[10px] uppercase tracking-wider cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Option Cadeau Prestige */}
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-5 space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isGift}
                onChange={(e) => setIsGift(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-neutral-700 bg-neutral-950 text-amber-400 focus:ring-amber-400 cursor-pointer accent-amber-400"
              />
              <div className="space-y-0.5">
                <span className="text-sm font-semibold text-white flex items-center gap-2">
                  <Gift className="w-4 h-4 text-amber-400" />
                  Offrir ce cadre — Emballage Cadeau Luxe &amp; Ruban (+4,90 €)
                </span>
                <p className="text-xs text-neutral-400 font-light">
                  Papier cadeau noir mat texturé, sceau de cire d&apos;atelier et carte de vœux manuscrite.
                </p>
              </div>
            </label>

            {isGift && (
              <div className="pt-2 pl-7 space-y-1.5 animate-fade-in">
                <label className="block text-xs font-mono uppercase text-neutral-400 tracking-wider">
                  Votre mot personnalisé manuscrit :
                </label>
                <textarea
                  rows={2}
                  maxLength={180}
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  placeholder="Ex : Joyeux anniversaire Lucas ! Pour sublimer ton bureau avec cette F40 légendaire."
                  className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl text-white text-xs outline-none transition resize-none"
                />
              </div>
            )}
          </div>

          {/* Upsell Compléments d'Atelier */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Complétez votre pièce d&apos;art
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {UPSELL_PRODUCTS.map((upsell) => {
                const alreadyInCart = items.some((i) => i.productId === upsell.id)
                return (
                  <div
                    key={upsell.id}
                    className="p-4 rounded-xl border border-neutral-800/80 bg-neutral-900/40 hover:border-neutral-700 transition flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-white leading-snug">
                        {upsell.name}
                      </h4>
                      <p className="text-[11px] text-neutral-400 leading-relaxed font-light line-clamp-2">
                        {upsell.desc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60">
                      <span className="text-xs font-bold text-amber-400 font-mono">
                        {upsell.price.toFixed(2).replace('.', ',')} €
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddUpsell(upsell)}
                        disabled={alreadyInCart}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition flex items-center gap-1 cursor-pointer ${
                          alreadyInCart
                            ? 'bg-neutral-800 text-neutral-500 cursor-default'
                            : 'bg-white hover:bg-neutral-200 text-black active:scale-95 shadow'
                        }`}
                      >
                        {alreadyInCart ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span>Ajouté</span>
                          </>
                        ) : (
                          <>
                            <PlusCircle className="w-3 h-3" />
                            <span>Ajouter</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <button
            onClick={clearCart}
            className="text-xs text-neutral-500 hover:text-white transition font-light cursor-pointer"
          >
            Vider le panier
          </button>
        </div>

        {/* Colonne droite : Synthèse de commande & Code Promo */}
        <div className="lg:col-span-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 sm:p-7 space-y-6 shadow-xl sticky top-24">
          <h2 className="font-semibold uppercase tracking-wider text-white text-xs">
            Détail de la commande
          </h2>

          <div className="space-y-3 text-xs border-b border-neutral-800 pb-4">
            <div className="flex justify-between text-neutral-300">
              <span>Sous-total ({finalCount} article{finalCount > 1 ? 's' : ''})</span>
              <span className="text-white font-semibold">{formatPrice(baseSubtotal * 100)}</span>
            </div>

            {isGift && (
              <div className="flex justify-between text-amber-300">
                <span>Option Emballage Cadeau Luxe</span>
                <span className="font-semibold">+4,90 €</span>
              </div>
            )}

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Remise Code Promo (-10%)</span>
                <span>-{formatPrice(discountAmount * 100)}</span>
              </div>
            )}

            <div className="flex justify-between text-neutral-300">
              <span>Livraison Colissimo</span>
              <span className="text-emerald-400 font-bold uppercase">100% Offerte</span>
            </div>
            <div className="flex justify-between text-[11px] text-neutral-400 pt-1">
              <span>TVA incluse (20%)</span>
              <span>{formatPrice((finalTotal - finalTotal / 1.2) * 100)}</span>
            </div>
          </div>

          {/* Formulaire Code Promo */}
          <form onSubmit={handleApplyPromo} className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Code promo (ex: DREAM10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl text-white text-xs outline-none transition font-mono uppercase"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs rounded-xl transition cursor-pointer"
              >
                Appliquer
              </button>
            </div>
            {promoSuccess && (
              <p className="text-[11px] text-emerald-400 font-medium">{promoSuccess}</p>
            )}
            {promoError && (
              <p className="text-[11px] text-rose-400 font-medium">{promoError}</p>
            )}
          </form>

          <div className="flex justify-between items-baseline pt-2 border-t border-neutral-800">
            <span className="text-xs uppercase tracking-wider text-neutral-400">Total TTC</span>
            <span className="text-3xl font-bold text-white">{formatPrice(finalTotal * 100)}</span>
          </div>

          <Link
            href="/checkout"
            className="w-full py-4 bg-white hover:bg-neutral-100 text-black font-semibold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-white/10 active:scale-98"
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
            <div className="flex items-center gap-2">
              <span className="text-amber-400">✓</span>
              <span>Expédition sous 24/48h depuis la France</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
