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
  className?: string
}

export function TrafficDonut({
  title,
  subtitle,
  items,
  totalLabel = 'uniques',
  totalCount,
  hasData,
  className = '',
}: TrafficDonutProps) {
  const size = 124
  const strokeWidth = 18
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  // Calculate SVG stroke dashes safely
  let currentOffset = 0
  const totalPercentage = items.reduce((acc, it) => acc + (it.percentage || 0), 0)

  const slices = items.map((it) => {
    // If all percentages are 0 or no data, default to equal or empty track
    const pct = totalPercentage > 0 ? (it.percentage / totalPercentage) * 100 : (100 / items.length)
    const strokeDasharray = `${(pct / 100) * circumference} ${circumference}`
    const strokeDashoffset = -currentOffset
    currentOffset += (pct / 100) * circumference
    return {
      ...it,
      strokeDasharray,
      strokeDashoffset,
    }
  })

  return (
    <div className={`p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>
          {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      {!hasData ? (
        <div className="h-40 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50 p-4 text-center">
          <p className="text-xs font-bold text-slate-600">Aucune donnée disponible</p>
          <p className="text-[10px] text-slate-400 mt-0.5">En attente de premières connexions</p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Donut SVG */}
          <div className="relative w-[124px] h-[124px] flex-shrink-0 flex items-center justify-center">
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

            {/* Total count in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
              <span className="text-base font-extrabold font-mono text-slate-900 leading-none">
                {totalCount.toLocaleString('fr-FR')}
              </span>
              <span className="text-[9px] text-slate-400 mt-1 uppercase font-bold tracking-wider">
                {totalLabel}
              </span>
            </div>
          </div>

          {/* Legend list with ample space and NO text collision */}
          <div className="flex-1 min-w-0 w-full space-y-2">
            {items.map((it, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: it.color }}
                  />
                  <span className="text-slate-600 truncate text-[11px] font-medium">
                    {it.name}
                  </span>
                </div>
                <span className="font-mono font-bold text-slate-900 text-xs flex-shrink-0 text-right">
                  {it.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
