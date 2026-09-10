'use client'

import React from 'react'
import { ExternalLink } from 'lucide-react'
import type { AnalyticsSummary } from '@/lib/analytics-store'

interface CountryStatsProps {
  countries: AnalyticsSummary['countryStats']
  hasData: boolean
}

export function CountryStats({ countries, hasData }: CountryStatsProps) {
  const flags: Record<string, string> = {
    FR: '🇫🇷',
    CH: '🇨🇭',
    BE: '🇧🇪',
    CA: '🇨🇦',
    US: '🇺🇸',
    GB: '🇬🇧',
    DE: '🇩🇪',
    IT: '🇮🇹',
    ES: '🇪🇸',
    MC: '🇲🇨',
    LU: '🇱🇺',
  }

  return (
    <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Utilisateurs par pays</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Top 5 des pays</p>
        </div>
        <span className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer">
          <span>Voir tout</span>
          <ExternalLink className="w-3 h-3" />
        </span>
      </div>

      {!hasData || countries.length === 0 ? (
        <div className="h-44 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50 p-4 text-center">
          <p className="text-xs font-bold text-slate-600">Données géographiques indisponibles</p>
          <p className="text-[10px] text-slate-400 mt-0.5">La géolocalisation Edge apparaîtra avec les visiteurs</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* World map stylized graphic */}
          <div className="h-14 w-full rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100/80 p-2 overflow-hidden">
            <svg viewBox="0 0 200 60" className="w-full h-full opacity-40">
              <ellipse cx="60" cy="28" rx="28" ry="16" fill="#F87171" fillOpacity="0.4" />
              <ellipse cx="140" cy="30" rx="35" ry="18" fill="#DC2626" fillOpacity="0.4" />
              <circle cx="100" cy="22" r="8" fill="#DC2626" />
              <circle cx="55" cy="25" r="4" fill="#DC2626" />
              <circle cx="145" cy="32" r="5" fill="#DC2626" />
            </svg>
          </div>

          <div className="space-y-2.5">
            {countries.map((c) => (
              <div key={c.country} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm flex-shrink-0">{flags[c.countryCode] || '🌐'}</span>
                    <span className="font-semibold text-slate-800 truncate text-[11px]">{c.country}</span>
                  </div>
                  <span className="font-mono text-slate-900 font-bold text-xs flex-shrink-0">{c.percentage}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600 rounded-full"
                    style={{ width: `${Math.min(100, Math.max(5, c.percentage))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
