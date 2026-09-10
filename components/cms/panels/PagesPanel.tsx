'use client'

import { useState } from 'react'
import { Files, ExternalLink, Globe, Lock } from 'lucide-react'
import Link from 'next/link'

interface PageItem {
  id: string
  title: string
  slug: string
  status: 'published' | 'draft'
  isSystem?: boolean
  description: string
}

export function PagesPanel() {
  const [pages] = useState<PageItem[]>([
    {
      id: 'home',
      title: 'Page d\'Accueil',
      slug: '/',
      status: 'published',
      isSystem: true,
      description: 'Vitrine principale avec showroom, collection et configurateur.',
    },
    {
      id: 'catalogue',
      title: 'Catalogue Complet',
      slug: '/catalogue',
      status: 'published',
      isSystem: true,
      description: 'Présentation de tous les modèles de cadres 3D disponibles.',
    },
    {
      id: 'configurator',
      title: 'Atelier Sur-Mesure 3D',
      slug: '/configurateur',
      status: 'published',
      isSystem: true,
      description: 'Configurateur sur-mesure pour choisir format, miniature et LED.',
    },
    {
      id: 'cart',
      title: 'Panier & Commande',
      slug: '/panier',
      status: 'published',
      isSystem: true,
      description: 'Tunnel de validation et paiement sécurisé Stripe.',
    },
    {
      id: 'cgv',
      title: 'Conditions Générales de Vente (CGV)',
      slug: '/cgv',
      status: 'published',
      description: 'Mentions contractuelles légales pour le e-commerce français.',
    },
    {
      id: 'privacy',
      title: 'Politique de Confidentialité',
      slug: '/confidentialite',
      status: 'published',
      description: 'Gestion des données personnelles conforme RGPD.',
    },
    {
      id: 'mentions',
      title: 'Mentions Légales',
      slug: '/mentions-legales',
      status: 'published',
      description: 'Informations juridiques de l\'entreprise Dream Frame.',
    },
    {
      id: 'retractation',
      title: 'Droit de Rétractation 14 Jours',
      slug: '/retractation',
      status: 'published',
      description: 'Formulaire et modalités de retour consommateur légal.',
    },
  ])

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-6">
      <div>
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Files className="w-5 h-5 text-red-600" />
          Pages du Site
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Gérez l&apos;ensemble des pages vitrines, techniques et légales de votre boutique.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {pages.length} pages indexées
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <Globe className="w-3 h-3" />
            Toutes en ligne
          </span>
        </div>

        <div className="space-y-2">
          {pages.map((pg) => (
            <div
              key={pg.id}
              className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition flex items-start justify-between gap-3"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-slate-900 truncate">{pg.title}</p>
                  {pg.isSystem && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[9px] font-bold flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      Système
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {pg.description}
                </p>
                <div className="pt-0.5">
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                    {pg.slug}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0 pt-0.5">
                <Link
                  href={pg.slug}
                  target="_blank"
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition"
                  title="Visiter la page"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
