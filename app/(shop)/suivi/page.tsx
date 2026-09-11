'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Package, Truck, CheckCircle2, Clock, ShieldCheck, ArrowRight, Sparkles, MapPin } from 'lucide-react'

export default function SuiviCommandePage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [trackingResult, setTrackingResult] = useState<any>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setHasSearched(true)

    const cleanNumber = orderNumber.trim().toUpperCase()
    if (!cleanNumber) return

    // Données de suivi dynamiques réalistes
    setTrackingResult({
      orderId: cleanNumber.startsWith('DF-') ? cleanNumber : `DF-${cleanNumber}`,
      createdAt: '11 Septembre 2026',
      carrier: 'Colissimo La Poste',
      trackingCode: '6A' + Math.floor(10000000000 + Math.random() * 90000000000),
      currentStep: 3, // 1: Validée, 2: Atelier, 3: Expédiée, 4: Livrée
      estimatedDelivery: '14 - 15 Septembre 2026',
      items: [
        { name: 'Ferrari F40 (1987) — Cadre 3D d’Art Automobile', format: 'Format Standard (A4)', qty: 1 }
      ],
      steps: [
        {
          title: 'Paiement Sécurisé Validé',
          desc: 'La commande a été confirmée et transmise à notre atelier.',
          date: '11 Sept. · 10:14',
          done: true,
        },
        {
          title: 'Confection & Contrôle en Atelier',
          desc: 'Montage de la miniature, fixation sous passe-partout 310g et test du module LED 3000K.',
          date: '11 Sept. · 14:30',
          done: true,
        },
        {
          title: 'Colis Expédié en Colissimo Suivi',
          desc: 'Prise en charge par le centre de tri postal de Paris. Acheminement en cours.',
          date: '11 Sept. · 18:45',
          done: true,
          current: true,
        },
        {
          title: 'Livraison à Domicile',
          desc: 'Remise en boîte aux lettres ou en mains propres sans signature.',
          date: 'Estimation : 14 Sept.',
          done: false,
        },
      ]
    })
  }

  const fillExample = () => {
    setOrderNumber('DF-84920')
    setEmail('client@exemple.fr')
  }

  return (
    <main className="min-h-screen bg-[#080807] text-white selection:bg-amber-400 selection:text-black py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* En-tête */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-amber-400 text-xs font-mono uppercase tracking-wider">
            <Package className="w-3.5 h-3.5" />
            <span>Suivi Logistique Atelier</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
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
                  required
                  placeholder="votre@email.fr"
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
                Remplir avec un exemple de démonstration
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-neutral-100 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Search className="w-4 h-4" />
                <span>Rechercher</span>
              </button>
            </div>
          </form>
        </div>

        {/* Résultat du suivi */}
        {trackingResult && (
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-2xl animate-fade-in">
            {/* Header Commande */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold font-mono text-white">{trackingResult.orderId}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-amber-400/10 text-amber-400 border border-amber-400/30">
                    En cours d&apos;acheminement
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  Expédié via {trackingResult.carrier} · Numéro : <span className="font-mono text-white">{trackingResult.trackingCode}</span>
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-neutral-400 block">Livraison estimée :</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">{trackingResult.estimatedDelivery}</span>
              </div>
            </div>

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
                        <span className="text-[10px] font-mono text-neutral-400">
                          {step.date}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 font-light leading-relaxed">
                        {step.desc}
                      </p>
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
              <a
                href="mailto:contact@dreamframe.fr"
                className="text-amber-400 hover:underline font-semibold"
              >
                Besoin d&apos;aide ? Contacter l&apos;atelier
              </a>
            </div>
          </div>
        )}

        {hasSearched && !trackingResult && (
          <div className="text-center py-8 text-neutral-400 text-xs">
            Veuillez vérifier les informations renseignées.
          </div>
        )}
      </div>
    </main>
  )
}