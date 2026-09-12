'use client'

import { useCart } from '@/lib/store/cart'
import { formatPrice } from '@/lib/utils'
import { createCheckoutSession } from './actions'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Loader2, CreditCard, ShieldCheck, Truck } from 'lucide-react'

function isVideoUrl(url?: string): boolean {
  if (!url) return false
  return /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url)
}

export default function CheckoutPage() {
  const { items, subtotal, count } = useCart()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'FR',
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-[#080807] text-white">
        <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center space-y-6 bg-[#080807] text-white">
        <h1 className="text-2xl text-white">Votre panier est vide</h1>
        <Link href="/catalogue" className="text-xs uppercase tracking-wider text-amber-400 underline">
          Retourner au catalogue
        </Link>
      </div>
    )
  }

  const computedSubtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0)
  const computedCount = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0)
  const finalSubtotal = subtotal > 0 ? subtotal : computedSubtotal
  const finalCount = count > 0 ? count : computedCount
  const total = finalSubtotal

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const cartItemsData = items.map((item) => ({
      variantId: item.variantId,
      productId: item.productId,
      productName: item.productName,
      sku: item.slug,
      price: item.price,
      quantity: item.quantity,
      formatName: item.formatName,
      formatSize: item.formatSize,
    }))

    const result = await createCheckoutSession({
      ...formData,
      cartItems: cartItemsData,
    })

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else if (result.url) {
      window.location.href = result.url
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 bg-[#080807] text-white">
      <Link
        href="/panier"
        className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-white mb-8 transition font-light"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour au panier
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Formulaire de livraison */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-6 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="border-b border-neutral-800 pb-5">
              <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400">
                Commande Sécurisée
              </span>
              <h1 className="text-2xl sm:text-3xl text-white mt-1">Adresse de livraison</h1>
              <p className="text-neutral-400 text-xs mt-1 font-light">Achat immédiat invité — Sans création de mot de passe</p>
            </div>

            {error && (
              <div className="p-4 bg-rose-950/50 border border-rose-800/80 rounded-xl text-rose-300 text-xs">
                ⚠️ {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-neutral-300">
                Adresse e-mail (pour confirmation & facture)
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="nom@exemple.com"
                className="w-full bg-black/60 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition"
              />
            </div>

            {/* Prénom / Nom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-neutral-300">
                  Prénom
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Jean"
                  className="w-full bg-black/60 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-neutral-300">
                  Nom
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Dupont"
                  className="w-full bg-black/60 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition"
                />
              </div>
            </div>

            {/* Téléphone */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-neutral-300">
                Numéro de téléphone (pour suivi Colissimo)
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="06 12 34 56 78"
                className="w-full bg-black/60 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition"
              />
            </div>

            {/* Adresse */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-neutral-300">
                Adresse de livraison
              </label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="12 rue de la Paix"
                className="w-full bg-black/60 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition"
              />
            </div>

            {/* Ville / Code Postal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-neutral-300">
                  Ville
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Paris"
                  className="w-full bg-black/60 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-neutral-300">
                  Code postal
                </label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="75001"
                  className="w-full bg-black/60 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition"
                />
              </div>
            </div>

            {/* CGV */}
            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                required
                id="cgv"
                className="mt-1 w-4 h-4 border-neutral-800 rounded bg-black text-white focus:ring-white"
              />
              <label htmlFor="cgv" className="text-xs text-neutral-400 font-light leading-normal">
                J'accepte les{' '}
                <Link href="/cgv" target="_blank" className="text-white underline">
                  Conditions Générales de Vente
                </Link>{' '}
                et certifie que l'adresse de livraison se situe en France métropolitaine.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white hover:bg-neutral-100 disabled:opacity-50 text-black font-semibold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 shadow-xl shadow-white/10 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  Connexion bancaire Stripe...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Procéder au paiement ({formatPrice(total * 100)})
                </>
              )}
            </button>
          </form>
        </div>

        {/* Récapitulatif latéral */}
        <div className="lg:col-span-5 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 sm:p-7 space-y-6 shadow-xl">
          <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
            <h2 className="font-semibold uppercase tracking-wider text-white text-xs">
              Articles commandés
            </h2>
            <span className="text-xs text-neutral-400">
              {finalCount} article{finalCount > 1 ? 's' : ''}
            </span>
          </div>

          <div className="divide-y divide-neutral-800/80 max-h-[320px] overflow-y-auto no-scrollbar">
            {items.map((item) => (
              <div key={item.variantId} className="py-3.5 flex gap-3.5 items-center">
                <div className="relative w-12 h-12 rounded-lg bg-neutral-950 border border-neutral-800 overflow-hidden flex-shrink-0">
                  {isVideoUrl(item.image) ? (
                    <video
                      src={item.image}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={
                        item.image ||
                        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1200&auto=format&fit=crop'
                      }
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-semibold truncate">{item.productName}</p>
                  <p className="text-neutral-400 text-[10px] font-mono">
                    Qté : {item.quantity} · {formatPrice(item.price * 100)}
                  </p>
                </div>
                <p className="font-bold text-white text-xs font-mono">{formatPrice(item.price * item.quantity * 100)}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2.5 text-xs border-t border-neutral-800 pt-4">
            <div className="flex justify-between text-neutral-300">
              <span>Sous-total</span>
              <span className="text-white font-semibold">{formatPrice(finalSubtotal * 100)}</span>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span>Livraison Colissimo</span>
              <span className="text-emerald-400 font-bold uppercase">100% Offerte</span>
            </div>
          </div>

          <div className="flex justify-between items-baseline border-t border-neutral-800 pt-4">
            <span className="text-xs uppercase tracking-wider text-neutral-400">Total TTC</span>
            <span className="text-2xl font-bold text-white">{formatPrice(total * 100)}</span>
          </div>

          <div className="border border-neutral-800 rounded-xl bg-black/40 p-4 space-y-2 text-xs text-neutral-400 font-light">
            <div className="flex items-center gap-2 text-neutral-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Audit bancaire & cryptage 256-bit par Stripe</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-400" />
              <span>Colis numéroté remis sans signature</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
