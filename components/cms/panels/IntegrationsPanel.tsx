'use client'

import { useState } from 'react'
import { Plug, Check, MessageCircle, BarChart3, CreditCard, Instagram } from 'lucide-react'

interface IntegrationItem {
  id: string
  name: string
  category: string
  description: string
  icon: any
  active: boolean
  configKey?: string
  configValue?: string
}

export function IntegrationsPanel() {
  const [integrations, setIntegrations] = useState<IntegrationItem[]>([
    {
      id: 'stripe',
      name: 'Paiements Sécurisés Stripe',
      category: 'Paiement',
      description: 'Encaissement CB / Apple Pay / Google Pay avec 3D-Secure 2.',
      icon: CreditCard,
      active: true,
      configKey: 'Clé Publique Stripe (Publishable Key)',
      configValue: 'pk_live_************************',
    },
    {
      id: 'instagram',
      name: 'Flux Instagram Atelier',
      category: 'Réseaux',
      description: 'Affichage automatique des dernières créations de cadres sur le site.',
      icon: Instagram,
      active: true,
      configKey: 'Compte connecté',
      configValue: '@dreamframe',
    },
    {
      id: 'ga4',
      name: 'Google Analytics 4',
      category: 'Statistiques',
      description: 'Mesure d\'audience, trafic direct et conversions de vente.',
      icon: BarChart3,
      active: true,
      configKey: 'ID de mesure',
      configValue: 'G-DREAMFRAME',
    },
    {
      id: 'whatsapp',
      name: 'Bouton Chat WhatsApp',
      category: 'Service Client',
      description: 'Permet aux clients de contacter directement l\'atelier par messagerie.',
      icon: MessageCircle,
      active: false,
      configKey: 'Numéro WhatsApp Atelier',
      configValue: '+33 6 00 00 00 00',
    },
  ])

  const toggleIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((it) => (it.id === id ? { ...it, active: !it.active } : it))
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-6">
      <div>
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Plug className="w-5 h-5 text-red-600" />
          Intégrations &amp; Services
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Connectez vos outils de paiement, analytics et communication externe.
        </p>
      </div>

      <div className="space-y-3">
        {integrations.map((it) => {
          const Icon = it.icon
          return (
            <div
              key={it.id}
              className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3 hover:border-slate-300 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    it.active ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-900">{it.name}</p>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[9px] font-semibold">
                        {it.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      {it.description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleIntegration(it.id)}
                  className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0 ${
                    it.active ? 'bg-red-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                      it.active ? 'translate-x-4.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {it.configKey && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[10px]">{it.configKey}</span>
                  <span className="font-mono text-slate-700 text-[11px] font-medium">{it.configValue}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
