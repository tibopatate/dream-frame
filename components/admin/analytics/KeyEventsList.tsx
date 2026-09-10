'use client'

import React from 'react'
import { ExternalLink, MousePointer, Eye, FileCheck, Layers } from 'lucide-react'
import type { AnalyticsSummary } from '@/lib/analytics-store'

interface KeyEventsListProps {
  events: AnalyticsSummary['keyEvents']
  hasData: boolean
}

export function KeyEventsList({ events, hasData }: KeyEventsListProps) {
  const icons: Record<string, any> = {
    click_cta: MousePointer,
    view_gallery: Eye,
    submit_contact: FileCheck,
    click_atelier: Layers,
  }

  return (
    <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Événements clés</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Conversions et interactions importantes</p>
        </div>
        <span className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer">
          <span>Voir tout</span>
          <ExternalLink className="w-3 h-3" />
        </span>
      </div>

      {!hasData ? (
        <div className="h-44 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50 p-4 text-center">
          <p className="text-xs font-bold text-slate-600">Aucun événement enregistré</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Les clics CTA et formulaires apparaîtront ici</p>
        </div>
      ) : (
        <div className="space-y-2">
          {events.map((ev) => {
            const Icon = icons[ev.name] || MousePointer
            return (
              <div
                key={ev.name}
                className="p-2.5 bg-slate-50/60 rounded-xl border border-slate-100 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-6 h-6 rounded-lg bg-red-100/70 text-red-600 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3 h-3" />
                  </div>
                  <span className="font-semibold text-slate-800 truncate text-[11px]">
                    {ev.label}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono flex-shrink-0">
                  <span className="font-bold text-slate-900 text-xs">{ev.count}</span>
                  <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-1.5 py-0.2 rounded">
                    +100%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
