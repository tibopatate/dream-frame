'use client'

import React from 'react'
import { Zap, ShieldCheck, Gauge, ExternalLink } from 'lucide-react'
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
          <p className="text-[11px] text-slate-400 mt-0.5">Vitesse et stabilité de votre site</p>
        </div>
        <span className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer">
          <span>Voir le détail</span>
          <ExternalLink className="w-3 h-3" />
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {/* Load time */}
        <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 flex flex-col items-center text-center justify-between min-h-[96px]">
          <div className="text-red-500">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <p className="text-base font-extrabold font-mono text-slate-900 leading-none">
              {performance.loadTimeSeconds !== null ? `${performance.loadTimeSeconds} s` : '1.8 s'}
            </p>
            <p className="text-[10px] text-slate-400 font-medium mt-1">Chargement</p>
          </div>
          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.2 rounded-full">
            -28%
          </span>
        </div>

        {/* Uptime */}
        <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 flex flex-col items-center text-center justify-between min-h-[96px]">
          <div className="text-emerald-500">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="text-base font-extrabold font-mono text-slate-900 leading-none">
              {performance.uptimePercent}%
            </p>
            <p className="text-[10px] text-slate-400 font-medium mt-1">Uptime</p>
          </div>
          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.2 rounded-full">
            +0.4%
          </span>
        </div>

        {/* PageSpeed */}
        <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 flex flex-col items-center text-center justify-between min-h-[96px]">
          <div className="text-blue-500">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <p className="text-base font-extrabold font-mono text-slate-900 leading-none">
              {performance.pageSpeedGrade}
            </p>
            <p className="text-[10px] text-slate-400 font-medium mt-1">PageSpeed</p>
          </div>
          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.2 rounded-full">
            +12%
          </span>
        </div>
      </div>
    </div>
  )
}
