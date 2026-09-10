'use client'

import React from 'react'
import { Activity, ChevronRight } from 'lucide-react'
import type { AnalyticsSummary } from '@/lib/analytics-store'

interface RealtimeFeedProps {
  realtime: AnalyticsSummary['realtime']
}

export function RealtimeFeed({ realtime }: RealtimeFeedProps) {
  const activeCount = realtime?.activeVisitors || 0
  const activeList = realtime?.activeList || []

  return (
    <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-slate-700" />
          <h3 className="text-sm font-bold text-slate-900">Activité en temps réel</h3>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          En ligne
        </span>
      </div>

      <div className="flex items-center justify-between p-3 bg-slate-50/70 rounded-xl border border-slate-100">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-slate-900">
              {activeCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              visiteur{activeCount > 1 ? 's' : ''} actuellement
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Sur les 5 dernières minutes</p>
        </div>

        {/* Mini live sparkline */}
        <div className="w-16 h-8 flex items-center">
          <svg viewBox="0 0 64 24" className="w-full h-full overflow-visible">
            <path
              d="M 0,16 Q 16,4 32,12 T 64,8"
              fill="none"
              stroke="#DC2626"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Visitor active list */}
      <div className="space-y-2">
        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
          Dernières pages consultées
        </p>

        {activeList.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            Aucun visiteur actif en ce moment
          </div>
        ) : (
          <div className="space-y-1.5">
            {activeList.map((item, idx) => (
              <div
                key={item.sessionId || idx}
                className="p-2.5 bg-white border border-slate-100 hover:border-slate-200 rounded-xl flex items-center justify-between gap-2 text-xs transition"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 truncate">
                      {item.city}, {item.country}
                    </p>
                    <p className="text-[10px] font-mono text-slate-400 truncate">
                      {item.path}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-slate-400 flex-shrink-0 font-medium">
                  <span>il y a {item.minutesAgo} min</span>
                  <ChevronRight className="w-3 h-3 text-slate-300" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
