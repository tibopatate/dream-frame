'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  MapPin,
  Loader2,
  AlertCircle,
  Box,
} from 'lucide-react'

export default function SuiviCommandePage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [trackingResult, setTrackingResult] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setHasSearched(true)
    setErrorMessage(null)
    setTrackingResult(null)

    const cleanNumber = orderNumber.trim()
    if (!cleanNumber) return

    setIsLoading(true)
    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: cleanNumber,
          email: email.trim(),
        }),
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        setErrorMessage(data.error || 'Commande introuvable.')
      } else {
        setTrackingResult(data.order)
      }
    } catch (err: any) {
      setErrorMessage('Une erreur réseau est survenue. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
  }

  const fillExample = () => {
    setOrderNumber('DF-84920')
    setEmail('client@exemple.fr')
  }

  return (
    <main className="min-h-screen bg-[#080807] text-white selection:bg-amber-400 selection:text-black pt-32 sm:pt-40 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* En-tête avec marge supérieure adaptée au header fixe */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-amber-400 text-xs font-mono uppercase tracking-wider">
            <Package className="w-3.5 h-3.5" />
            <span>Suivi Logistique Atelier</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-serif">
            Suivre Ma Commande
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-md mx-auto leading-relaxed">
            Consultez en direct l&apos;état d&apos;assemblage en atelier et l&apos;acheminement Colissimo de votre cadre d&apos;art.
          </p>
        </div>

        {/* Formulaire de recherche */}
        <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase text-neutral-400 tracking-wider">
                  Numéro de Commande
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : DF-84920"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl text-white text-sm outline-none transition font-mono uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase text-neutral-400 tracking-wider">
                  Adresse E-mail d&apos;Achat
                </label>
                <input
                  type="email"
                  placeholder="votre@email.fr (optionnel)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl text-white text-sm outline-none transition"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={fillExample}
                className="text-xs text-neutral-500 hover:text-amber-400 underline transition cursor-pointer"
              >
                Remplir avec l&apos;exemple DF-84920
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-neutral-100 disabled:bg-neutral-800 disabled:text-neutral-500 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-neutral-600" />
                    <span>Recherche en cours...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Rechercher</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Message d'erreur */}
        {errorMessage && (
          <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-xl flex items-start gap-3 text-red-300 text-xs animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{errorMessage}</p>
              <p className="text-red-400/80 mt-1">
                Vérifiez votre référence de commande reçue par e-mail ou contactez notre assistance si besoin.
              </p>
            </div>
          </div>
        )}

        {/* Résultat du suivi réel */}
        {trackingResult && (
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-2xl animate-fade-in">
            {/* Header Commande */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold font-mono text-white">{trackingResult.orderId}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase border ${
                      trackingResult.status === 'DELIVERED'
                        ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-300'
                        : trackingResult.status === 'SHIPPED'
                        ? 'bg-sky-950/60 border-sky-800/60 text-sky-300'
                        : 'bg-amber-400/10 border-amber-400/30 text-amber-400'
                    }`}
                  >
                    {trackingResult.status === 'DELIVERED'
                      ? 'Livrée'
                      : trackingResult.status === 'SHIPPED'
                      ? 'Expédiée'
                      : trackingResult.status === 'PROCESSING'
                      ? 'En confection atelier'
                      : 'Commande confirmée'}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  Expédié via {trackingResult.carrier} · Réf. suivi :{' '}
                  <span className="font-mono text-white">{trackingResult.trackingCode}</span>
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-neutral-400 block">Date de commande :</span>
                <span className="text-sm font-bold text-amber-400 font-mono">{trackingResult.createdAt}</span>
              </div>
            </div>

            {/* Articles de la commande */}
            {trackingResult.items && trackingResult.items.length > 0 && (
              <div className="space-y-3 p-4 bg-neutral-950/60 border border-neutral-800/80 rounded-xl">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                  Pièces confectionnées :
                </span>
                <div className="divide-y divide-neutral-800/60">
                  {trackingResult.items.map((item: any, idx: number) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <p className="text-white font-bold">{item.name}</p>
                        <p className="text-[11px] text-neutral-400 font-mono">
                          {item.format} {item.size ? `· ${item.size}` : ''} × {item.qty}
                        </p>
                      </div>
                      <span className="font-mono text-neutral-300 font-semibold">
                        {(item.price * item.qty).toFixed(2).replace('.', ',')} €
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline Étapes */}
            <div className="space-y-6">
              <h3 className="text-xs font-mono uppercase text-neutral-400 tracking-wider">
                Chronologie d&apos;Acheminement
              </h3>

              <div className="space-y-6 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-800">
                {trackingResult.steps.map((step: any, idx: number) => (
                  <div key={idx} className="relative flex items-start gap-4">
                    <div
                      className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        step.current
                          ? 'bg-amber-400 text-black ring-4 ring-amber-400/20 animate-pulse'
                          : step.done
                          ? 'bg-emerald-500 text-white'
                          : 'bg-neutral-800 text-neutral-600'
                      }`}
                    >
                      {step.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-semibold ${step.done ? 'text-white' : 'text-neutral-500'}`}>
                          {step.title}
                        </h4>
                        <span className="text-[10px] font-mono text-neutral-400">{step.date}</span>
                      </div>
                      <p className="text-xs text-neutral-400 font-light leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Réassurance */}
            <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Colis garanti contre la casse et le vol jusqu&apos;à la livraison</span>
              </div>
              <a href="mailto:contact@dreamframe.fr" className="text-amber-400 hover:underline font-semibold">
                Besoin d&apos;aide ? Contacter l&apos;atelier
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}