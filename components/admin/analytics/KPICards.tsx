'use client'

import React from 'react'
import { Eye, MousePointerClick, Clock, ArrowDownRight, ArrowUpRight, Coins, Calculator } from 'lucide-react'
import type { AnalyticsSummary } from '@/lib/analytics-store'

interface KPICardsProps {
  kpis: AnalyticsSummary['kpis']
  revenue?: {
    totalCA: number
    ordersCount: number
    avgBasket: number
  }
  hasData: boolean
  onToggleCalculator?: () => void
  isCalculatorOpen?: boolean
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

export function KPICards({
  kpis,
  revenue,
  hasData,
  onToggleCalculator,
  isCalculatorOpen,
}: KPICardsProps) {
  const totalCA = revenue?.totalCA ?? 0
  const ordersCount = revenue?.ordersCount ?? 0
  const hasOrders = ordersCount > 0

  const cards = [
    {
      id: 'revenue',
      title: "Chiffre d'Affaires (CA)",
      value: `${totalCA.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`,
      diff: null,
      subtitle: hasOrders
        ? `${ordersCount} commande${ordersCount > 1 ? 's' : ''} payée${ordersCount > 1 ? 's' : ''}`
        : 'En attente de commandes',
      icon: Coins,
      isRevenue: true,
      points: hasOrders ? [0, totalCA * 0.4, totalCA * 0.7, totalCA] : [],
    },
    {
      id: 'visitors',
      title: 'Visiteurs uniques',
      value: hasData ? kpis.uniqueVisitors.toLocaleString('fr-FR') : '—',
      diff: kpis.uniqueVisitorsDiffPercent,
      subtitle: null,
      icon: Eye,
      isRevenue: false,
      points: [12, 14, 11, 18, 22, 25, 28],
    },
    {
      id: 'views',
      title: 'Pages vues',
      value: hasData ? kpis.pageViews.toLocaleString('fr-FR') : '—',
      diff: kpis.pageViewsDiffPercent,
      subtitle: null,
      icon: MousePointerClick,
      isRevenue: false,
      points: [30, 42, 38, 55, 62, 70, 78],
    },
    {
      id: 'duration',
      title: 'Durée moyenne',
      value: hasData ? kpis.avgDurationFormatted : '—',
      diff: kpis.avgDurationDiffPercent,
      subtitle: null,
      icon: Clock,
      isRevenue: false,
      points: [110, 125, 140, 135, 150, 160, 168],
    },
    {
      id: 'bounce',
      title: 'Taux de rebond',
      value: hasData ? `${kpis.bounceRate}%` : '—',
      diff: kpis.bounceRateDiffPercent,
      subtitle: null,
      isBounce: true,
      icon: ArrowDownRight,
      isRevenue: false,
      points: [45, 42, 40, 38, 36, 35, 34],
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((c) => {
        const Icon = c.icon
        const isPositive = c.diff !== null && (c.isBounce ? c.diff < 0 : c.diff > 0)

        return (
          <div
            key={c.id}
            className={`p-4 bg-white rounded-2xl border shadow-2xs space-y-3 transition flex flex-col justify-between ${
              c.isRevenue
                ? 'border-red-200/90 hover:border-red-300'
                : 'border-slate-200/90 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  c.isRevenue
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-red-50 text-red-600'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate max-w-[130px]">
                {c.title}
              </span>
            </div>

            <div>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-mono">
                {c.value}
              </p>

              <div className="flex items-center gap-1.5 mt-1">
                {c.isRevenue ? (
                  <span className="text-[11px] font-medium text-slate-500 truncate">
                    {c.subtitle}
                  </span>
                ) : c.diff !== null ? (
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
                {!c.isRevenue && c.diff !== null && (
                  <span className="text-[10px] text-slate-400">vs. p. préc.</span>
                )}
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between border-t border-slate-50">
              {c.isRevenue ? (
                onToggleCalculator ? (
                  <button
                    type="button"
                    onClick={onToggleCalculator}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 hover:text-red-700 transition cursor-pointer"
                  >
                    <Calculator className="w-3 h-3" />
                    <span>{isCalculatorOpen ? 'Replier marge' : 'Calculer bénéfice'}</span>
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-400 font-mono">Boutique</span>
                )
              ) : hasData ? (
                <div className="w-full flex justify-end">
                  <MiniSparkline points={c.points} />
                </div>
              ) : (
                <div className="w-full flex justify-end">
                  <span className="h-4 text-[10px] text-slate-300 font-mono">Aucun flux</span>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
