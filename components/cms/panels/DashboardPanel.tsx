'use client'

import { LayoutDashboard, Clock, Globe, RefreshCw } from 'lucide-react'

export function DashboardPanel() {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Tableau de bord</h2>
        <p className="text-sm text-slate-500 mt-1">Vue d&apos;ensemble de votre site et raccourcis rapides.</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Globe className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-sm font-semibold text-slate-700">Statut du site</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-emerald-600 font-medium">En ligne</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm font-semibold text-slate-700">Dernière publication</span>
          </div>
          <span className="text-xs text-slate-500">Il y a quelques minutes</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <RefreshCw className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-sm font-semibold text-slate-700">Brouillon</span>
          </div>
          <span className="text-xs text-slate-500">Sauvegardé automatiquement</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-sm font-semibold text-slate-700">Pages</span>
          </div>
          <span className="text-xs text-slate-500">1 page publiée</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-700">Accès rapides</h3>
        <div className="space-y-2">
          {[
            { label: 'Modifier la page d\'accueil', desc: 'Personnalisez le contenu principal' },
            { label: 'Gestion du catalogue', desc: 'Ajoutez ou modifiez vos cadres' },
            { label: 'Design & Apparence', desc: 'Couleurs, polices et style global' },
            { label: 'Paramètres du site', desc: 'Nom, logo, coordonnées' },
          ].map((item) => (
            <div
              key={item.label}
              className="p-3 bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition cursor-pointer"
            >
              <p className="text-sm font-medium text-slate-800">{item.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
