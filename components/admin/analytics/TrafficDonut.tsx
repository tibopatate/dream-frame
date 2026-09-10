'use client'

import React from 'react'

interface DonutItem {
  name: string
  count: number
  percentage: number
  color: string
}

interface TrafficDonutProps {
  title: string
  subtitle?: string
  items: DonutItem[]
  totalLabel?: string
  totalCount: number
  hasData: boolean
}

export function TrafficDonut({
  title,
  subtitle,
  items,
  totalLabel = 'uniques',
  totalCount,
  hasData,
}: TrafficDonutProps) {
  const size = 160
  const strokeWidth = 24
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  // Calculate SVG stroke dashes
  let currentOffset = 0
  const slices = items.map((it) => {
    const strokeDasharray = `${(it.percentage / 100) * circumference} ${circumference}`
    const strokeDashoffset = -currentOffset
    currentOffset += (it.percentage / 100) * circumference
    return {
      ...it,
      strokeDasharray,
      strokeDashoffset,
    }
  })

  return (
    <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
      <div>
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      {!hasData ? (
        <div className="h-44 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50 p-4 text-center">
          <p className="text-xs font-bold text-slate-600">Aucune donnée disponible</p>
          <p className="text-[10px] text-slate-400 mt-0.5">En attente de premières connexions</p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Donut SVG */}
          <div className="relative w-40 h-40 flex-shrink-0 flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
              {/* Background track */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke="#F1F5F9"
                strokeWidth={strokeWidth}
              />
              {/* Slices */}
              {slices.map((s, idx) => (
                <circle
                  key={idx}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={s.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={s.strokeDasharray}
                  strokeDashoffset={s.strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              ))}
            </svg>

            {/* Total in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
              <span className="text-lg font-bold font-mono text-slate-900 leading-none">
                {totalCount.toLocaleString('fr-FR')}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">
                {totalLabel}
              </span>
            </div>
          </div>

          {/* Legend list */}
          <div className="flex-1 w-full space-y-2">
            {items.map((it, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: it.color }}
                  />
                  <span className="text-slate-700 truncate font-medium">{it.name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono flex-shrink-0">
                  <span className="font-bold text-slate-900">{it.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
