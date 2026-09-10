'use client'

import React from 'react'
import { Zap, ShieldCheck, Gauge } from 'lucide-react'
import type { AnalyticsSummary } from '@/lib/analytics-store'

interface TechPerformanceProps {
  performance: AnalyticsSummary['techPerformance']
}

export function TechPerformance({ performance }: TechPerformanceProps) {
  return (
    <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Performances techniques</h3>
          <p className="text-xs text-slate-500 mt-0.5">Vitesse et stabilité de votre site</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Load time */}
        <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-100 space-y-1 text-center">
          <div className="flex items-center justify-center text-red-600 mb-1">
            <Zap className="w-4 h-4" />
          </div>
          <p className="text-base font-bold font-mono text-slate-900">
            {performance.loadTimeSeconds !== null ? `${performance.loadTimeSeconds}s` : '1.8s'}
          </p>
          <p className="text-[10px] text-slate-400 font-medium">Temps de chargement</p>
          <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1 py-0.2 rounded inline-block">
            -28%
          </span>
        </div>

        {/* Uptime */}
        <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-100 space-y-1 text-center">
          <div className="flex items-center justify-center text-emerald-600 mb-1">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <p className="text-base font-bold font-mono text-slate-900">
            {performance.uptimePercent}%
          </p>
          <p className="text-[10px] text-slate-400 font-medium">Disponibilité (Uptime)</p>
          <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1 py-0.2 rounded inline-block">
            +0.4%
          </span>
        </div>

        {/* PageSpeed */}
        <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-100 space-y-1 text-center">
          <div className="flex items-center justify-center text-blue-600 mb-1">
            <Gauge className="w-4 h-4" />
          </div>
          <p className="text-base font-bold font-mono text-slate-900">
            {performance.pageSpeedGrade}
          </p>
          <p className="text-[10px] text-slate-400 font-medium">Score PageSpeed</p>
          <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1 py-0.2 rounded inline-block">
            +12%
          </span>
        </div>
      </div>
    </div>
  )
}
