'use client'

import React from 'react'
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
          <p className="text-xs text-slate-500 mt-0.5">Top 5 des pays d&apos;origine des visiteurs</p>
        </div>
      </div>

      {!hasData || countries.length === 0 ? (
        <div className="h-44 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50 p-4 text-center">
          <p className="text-xs font-bold text-slate-600">Données géographiques indisponibles</p>
          <p className="text-[10px] text-slate-400 mt-0.5">La géolocalisation Edge apparaîtra avec les visiteurs</p>
        </div>
      ) : (
        <div className="space-y-3">
          {countries.map((c) => (
            <div key={c.country} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{flags[c.countryCode] || '🌐'}</span>
                  <span className="font-semibold text-slate-800">{c.country}</span>
                </div>
                <span className="font-mono text-slate-600 font-bold">{c.percentage}%</span>
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
      )}
    </div>
  )
}
