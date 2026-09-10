'use client'

import React from 'react'
import { Eye, MousePointerClick, Clock, ArrowDownRight, ArrowUpRight } from 'lucide-react'
import type { AnalyticsSummary } from '@/lib/analytics-store'

interface KPICardsProps {
  kpis: AnalyticsSummary['kpis']
  hasData: boolean
}

function MiniSparkline({ points, color = '#DC2626' }: { points: number[]; color?: string }) {
  if (!points || points.length < 2) {
    return (
      <div className="h-6 w-24 flex items-center justify-center">
        <div className="h-0.5 w-full bg-slate-100 rounded-full" />
      </div>
    )
  }

  const max = Math.max(...points, 1)
  const min = Math.min(...points, 0)
  const range = max - min || 1
  const width = 96
  const height = 24

  const coords = points.map((val, idx) => {
    const x = (idx / (points.length - 1)) * width
    const y = height - ((val - min) / range) * (height - 6) - 3
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })

  const pathD = `M ${coords.join(' L ')}`

  return (
    <svg width={width} height={height} className="overflow-visible">
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function KPICards({ kpis, hasData }: KPICardsProps) {
  const cards = [
    {
      id: 'visitors',
      title: 'Visiteurs uniques',
      value: hasData ? kpis.uniqueVisitors.toLocaleString('fr-FR') : '—',
      diff: kpis.uniqueVisitorsDiffPercent,
      icon: Eye,
      points: [12, 14, 11, 18, 22, 25, 28],
    },
    {
      id: 'views',
      title: 'Pages vues',
      value: hasData ? kpis.pageViews.toLocaleString('fr-FR') : '—',
      diff: kpis.pageViewsDiffPercent,
      icon: MousePointerClick,
      points: [30, 42, 38, 55, 62, 70, 78],
    },
    {
      id: 'duration',
      title: 'Durée moyenne de visite',
      value: hasData ? kpis.avgDurationFormatted : '—',
      diff: kpis.avgDurationDiffPercent,
      icon: Clock,
      points: [110, 125, 140, 135, 150, 160, 168],
    },
    {
      id: 'bounce',
      title: 'Taux de rebond',
      value: hasData ? `${kpis.bounceRate}%` : '—',
      diff: kpis.bounceRateDiffPercent,
      isBounce: true,
      icon: ArrowDownRight,
      points: [45, 42, 40, 38, 36, 35, 34],
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon
        const isPositive = c.diff !== null && (c.isBounce ? c.diff < 0 : c.diff > 0)
        const isNeutral = c.diff === null || c.diff === 0

        return (
          <div
            key={c.id}
            className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 hover:border-slate-300 transition"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-500">{c.title}</span>
            </div>

            <div>
              <p className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
                {c.value}
              </p>

              <div className="flex items-center gap-1.5 mt-1">
                {c.diff !== null ? (
                  <span
                    className={`inline-flex items-center text-[11px] font-bold ${
                      isPositive ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="w-3 h-3 mr-0.5" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 mr-0.5" />
                    )}
                    {c.diff > 0 ? `+${c.diff}%` : `${c.diff}%`}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 italic">
                    {hasData ? 'Donnée en cours de calcul' : 'En attente de visites'}
                  </span>
                )}
                {c.diff !== null && (
                  <span className="text-[10px] text-slate-400">vs. période précédente</span>
                )}
              </div>
            </div>

            <div className="pt-1 flex justify-end">
              {hasData ? (
                <MiniSparkline points={c.points} />
              ) : (
                <div className="h-4 text-[10px] text-slate-300 font-mono">Aucun flux</div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
