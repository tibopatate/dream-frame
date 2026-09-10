'use client'

import React, { useState } from 'react'
import type { AnalyticsSummary } from '@/lib/analytics-store'

interface TrafficChartProps {
  chartData: AnalyticsSummary['chartData']
  hasData: boolean
}

export function TrafficChart({ chartData, hasData }: TrafficChartProps) {
  const [granularity, setGranularity] = useState<'day' | 'week'>('day')
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const width = 640
  const height = 220
  const padding = { top: 20, right: 20, bottom: 30, left: 35 }

  const effectiveWidth = width - padding.left - padding.right
  const effectiveHeight = height - padding.top - padding.bottom

  const maxVal = Math.max(
    ...chartData.map((d) => Math.max(d.visitors, d.pageViews, d.sessions)),
    10
  )

  const getY = (val: number) => {
    return padding.top + effectiveHeight - (val / maxVal) * effectiveHeight
  }

  const getX = (idx: number) => {
    if (chartData.length <= 1) return padding.left + effectiveWidth / 2
    return padding.left + (idx / (chartData.length - 1)) * effectiveWidth
  }

  const buildPath = (key: 'visitors' | 'pageViews' | 'sessions') => {
    if (!chartData || chartData.length === 0) return ''
    const pts = chartData.map((d, i) => `${getX(i).toFixed(1)},${getY(d[key]).toFixed(1)}`)
    return `M ${pts.join(' L ')}`
  }

  const buildAreaPath = (key: 'visitors' | 'pageViews' | 'sessions') => {
    if (!chartData || chartData.length === 0) return ''
    const linePath = buildPath(key)
    const lastX = getX(chartData.length - 1).toFixed(1)
    const firstX = getX(0).toFixed(1)
    const bottomY = (padding.top + effectiveHeight).toFixed(1)
    return `${linePath} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`
  }

  const hoveredData = hoveredIdx !== null ? chartData[hoveredIdx] : null

  return (
    <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Trafic du site</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Évolution des visites et interactions sur la période
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Legend */}
          <div className="hidden sm:flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
              Visiteurs
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
              Pages vues
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              Sessions
            </span>
          </div>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setGranularity('day')}
              className={`px-2 py-1 rounded-md transition cursor-pointer ${
                granularity === 'day' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Jour
            </button>
            <button
              type="button"
              onClick={() => setGranularity('week')}
              className={`px-2 py-1 rounded-md transition cursor-pointer ${
                granularity === 'week' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Semaine
            </button>
          </div>
        </div>
      </div>

      {!hasData ? (
        <div className="h-56 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50 p-6 text-center">
          <p className="text-sm font-bold text-slate-700">Pas encore assez de données de trafic</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Les graphiques se construiront automatiquement au fur et à mesure que les visiteurs parcourent votre vitrine.
          </p>
        </div>
      ) : (
        <div className="relative w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-56 select-none overflow-visible"
          >
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = padding.top + effectiveHeight * ratio
              const labelVal = Math.round(maxVal * (1 - ratio))
              return (
                <g key={ratio}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    stroke="#F1F5F9"
                    strokeWidth="1"
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 3}
                    textAnchor="end"
                    fontSize="9"
                    fill="#94A3B8"
                    fontFamily="monospace"
                  >
                    {labelVal}
                  </text>
                </g>
              )
            })}

            {/* Areas */}
            <path d={buildAreaPath('pageViews')} fill="#FEE2E2" fillOpacity="0.4" />
            <path d={buildAreaPath('visitors')} fill="#DC2626" fillOpacity="0.08" />

            {/* Lines */}
            <path
              d={buildPath('sessions')}
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d={buildPath('pageViews')}
              fill="none"
              stroke="#FCA5A5"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d={buildPath('visitors')}
              fill="none"
              stroke="#DC2626"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Interactive vertical hover line & points */}
            {chartData.map((d, idx) => {
              const cx = getX(idx)
              const cyVis = getY(d.visitors)
              const isHovered = hoveredIdx === idx

              return (
                <g key={idx} className="cursor-pointer">
                  {/* Invisible hit area */}
                  <rect
                    x={cx - effectiveWidth / (chartData.length * 2)}
                    y={padding.top}
                    width={effectiveWidth / chartData.length}
                    height={effectiveHeight}
                    fill="transparent"
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  />

                  {isHovered && (
                    <line
                      x1={cx}
                      y1={padding.top}
                      x2={cx}
                      y2={padding.top + effectiveHeight}
                      stroke="#DC2626"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  )}

                  <circle
                    cx={cx}
                    cy={cyVis}
                    r={isHovered ? 5 : 3}
                    fill="#DC2626"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />

                  {/* X Axis Date labels */}
                  <text
                    x={cx}
                    y={height - 8}
                    textAnchor="middle"
                    fontSize="9"
                    fill={isHovered ? '#0F172A' : '#94A3B8'}
                    fontWeight={isHovered ? 'bold' : 'normal'}
                  >
                    {d.date}
                  </text>
                </g>
              )
            })}
          </svg>

          {/* Floating Tooltip */}
          {hoveredData && hoveredIdx !== null && (
            <div
              className="absolute top-2 bg-slate-900 text-white rounded-xl px-3 py-2 text-xs shadow-xl pointer-events-none transition-all z-20 space-y-1"
              style={{
                left: `${(getX(hoveredIdx) / width) * 100}%`,
                transform: 'translateX(-50%)',
              }}
            >
              <p className="font-bold text-[11px] text-slate-300 border-b border-slate-700 pb-0.5">
                {hoveredData.date}
              </p>
              <div className="flex items-center justify-between gap-4 font-mono text-[11px]">
                <span className="text-red-400">Visiteurs :</span>
                <span className="font-bold">{hoveredData.visitors}</span>
              </div>
              <div className="flex items-center justify-between gap-4 font-mono text-[11px]">
                <span className="text-rose-300">Pages vues :</span>
                <span className="font-bold">{hoveredData.pageViews}</span>
              </div>
              <div className="flex items-center justify-between gap-4 font-mono text-[11px]">
                <span className="text-slate-400">Sessions :</span>
                <span className="font-bold">{hoveredData.sessions}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
