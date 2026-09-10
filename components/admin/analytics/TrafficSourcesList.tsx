'use client'

import React from 'react'
import { Globe, Compass, Instagram, Youtube, HelpCircle } from 'lucide-react'
import type { AnalyticsSummary } from '@/lib/analytics-store'

interface TrafficSourcesListProps {
  sources: AnalyticsSummary['trafficSources']
  hasData: boolean
}

export function TrafficSourcesList({ sources, hasData }: TrafficSourcesListProps) {
  const iconMap: Record<string, any> = {
    'Recherche organique': Globe,
    'Google Search': Globe,
    'Accès direct': Compass,
    'Réseaux sociaux': Instagram,
    'Instagram': Instagram,
    'YouTube': Youtube,
    'Référents': Globe,
    'Autres': HelpCircle,
  }

  return (
    <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Sources de visiteurs</h3>
          <p className="text-xs text-slate-500 mt-0.5">Campagnes et canaux d&apos;acquisition</p>
        </div>
      </div>

      {!hasData ? (
        <div className="h-44 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50 p-4 text-center">
          <p className="text-xs font-bold text-slate-600">Aucune source identifiée</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Les référents et réseaux s&apos;afficheront ici</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sources.map((src) => {
            const Icon = iconMap[src.name] || Globe
            return (
              <div key={src.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-semibold text-slate-800">{src.name}</span>
                  </div>
                  <span className="font-mono text-slate-700 font-bold">{src.percentage}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600 rounded-full"
                    style={{ width: `${Math.min(100, Math.max(4, src.percentage))}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
