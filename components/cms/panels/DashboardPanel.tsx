'use client'

import { LayoutDashboard, Clock, Globe, RefreshCw, ArrowRight } from 'lucide-react'

interface DashboardPanelProps {
  onNavigate?: (category: string) => void
  lastSavedTime?: string | null
}

export function DashboardPanel({ onNavigate, lastSavedTime }: DashboardPanelProps) {
  const quickActions = [
    { id: 'homepage', label: 'Modifier la page d\'accueil', desc: 'Personnalisez le contenu et l\'ordre des sections' },
    { id: 'catalogue', label: 'Gestion du catalogue', desc: 'Ajoutez ou modifiez vos collections de cadres' },
    { id: 'design', label: 'Design & Apparence', desc: 'Couleurs, polices et style global' },
    { id: 'navigation', label: 'Navigation & Menu', desc: 'Header sticky et liens de navigation' },
    { id: 'settings', label: 'Paramètres du site', desc: 'Nom, logo, coordonnées et réseaux' },
  ]

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-6">
      <div>
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-red-600" />
          Tableau de Bord
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Vue d&apos;ensemble de votre boutique Dream Frame et raccourcis rapides.
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <span className="text-xs font-bold text-slate-700">Statut du site</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-emerald-600 font-semibold">En ligne</span>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <span className="text-xs font-bold text-slate-700">Publication</span>
          </div>
          <span className="text-xs text-slate-600 font-medium truncate block">
            {lastSavedTime ? `À jour (${lastSavedTime})` : 'En direct'}
          </span>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
              <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <span className="text-xs font-bold text-slate-700">Sauvegarde</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">Automatique</span>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
              <LayoutDashboard className="w-3.5 h-3.5 text-red-600" />
            </div>
            <span className="text-xs font-bold text-slate-700">Catalogue</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">9 cadres actifs</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Accès Rapides</h3>
        <div className="space-y-2">
          {quickActions.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate?.(item.id)}
              className="w-full p-3 bg-white rounded-xl border border-slate-200 hover:border-red-200 hover:bg-red-50/20 transition cursor-pointer text-left flex items-center justify-between group shadow-xs"
            >
              <div>
                <p className="text-xs font-bold text-slate-800 group-hover:text-red-600 transition-colors">
                  {item.label}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
