'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Calendar, ChevronDown, RefreshCw, Lightbulb } from 'lucide-react'
import { KPICards } from './KPICards'
import { TrafficChart } from './TrafficChart'
import { TrafficDonut } from './TrafficDonut'
import { RealtimeFeed } from './RealtimeFeed'
import { PopularPagesTable } from './PopularPagesTable'
import { CountryStats } from './CountryStats'
import { KeyEventsList } from './KeyEventsList'
import { TechPerformance } from './TechPerformance'
import { TrafficSourcesList } from './TrafficSourcesList'
import type { AnalyticsSummary } from '@/lib/analytics-store'

interface AnalyticsDashboardProps {
  initialData?: AnalyticsSummary | null
}

const PERIOD_LABELS: Record<string, string> = {
  today: "Aujourd'hui",
  yesterday: 'Hier',
  '7d': '7 derniers jours',
  '30d': '30 derniers jours',
  '90d': '90 derniers jours',
  year: 'Cette année',
}

export function AnalyticsDashboard({ initialData }: AnalyticsDashboardProps) {
  const [period, setPeriod] = useState<string>('7d')
  const [data, setData] = useState<AnalyticsSummary | null>(initialData || null)
  const [loading, setLoading] = useState<boolean>(!initialData)
  const [showPeriodMenu, setShowPeriodMenu] = useState(false)

  // Fetch real analytics data from /api/track
  const fetchAnalytics = useCallback(async (selectedPeriod: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/track?period=${selectedPeriod}`)
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
    } catch (err) {
      console.error('Failed to load real analytics:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAnalytics(period)
    // Refresh every 30 seconds for live updates
    const timer = setInterval(() => fetchAnalytics(period), 30_000)
    return () => clearInterval(timer)
  }, [period, fetchAnalytics])

  // Compute displayed date range string
  const getDateRangeString = () => {
    const now = new Date()
    let pastDays = 7
    if (period === 'today') pastDays = 0
    else if (period === 'yesterday') pastDays = 1
    else if (period === '30d') pastDays = 30
    else if (period === '90d') pastDays = 90
    else if (period === 'year') pastDays = 365

    const pastDate = new Date(now.getTime() - pastDays * 24 * 60 * 60 * 1000)
    const format = (d: Date) =>
      d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })

    if (pastDays === 0) return format(now)
    return `${format(pastDate)} → ${format(now)}`
  }

  const hasData = Boolean(data && data.hasData)

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 text-slate-900 space-y-6">
      {/* ─── HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Performance du site
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Suivez en temps réel la performance et l&apos;évolution de votre site vitrine.
          </p>
        </div>

        {/* Period selector & date range */}
        <div className="flex items-center gap-2 relative">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPeriodMenu(!showPeriodMenu)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
            >
              <span>{PERIOD_LABELS[period] || period}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showPeriodMenu && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowPeriodMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-1 divide-y divide-slate-50">
                  {Object.entries(PERIOD_LABELS).map(([k, label]) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => {
                        setPeriod(k)
                        setShowPeriodMenu(false)
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium transition cursor-pointer ${
                        period === k
                          ? 'bg-red-50 text-red-600 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200/80 rounded-xl text-xs text-slate-500 shadow-2xs font-mono">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{getDateRangeString()}</span>
          </div>

          <button
            type="button"
            onClick={() => fetchAnalytics(period)}
            className="p-1.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
            title="Actualiser les statistiques"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-red-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* ─── ROW 1: 4 TOP KPI CARDS ─── */}
      <KPICards
        kpis={
          data?.kpis || {
            uniqueVisitors: 0,
            uniqueVisitorsDiffPercent: null,
            pageViews: 0,
            pageViewsDiffPercent: null,
            avgDurationFormatted: '0m 00s',
            avgDurationSeconds: 0,
            avgDurationDiffPercent: null,
            bounceRate: 0,
            bounceRateDiffPercent: null,
          }
        }
        hasData={hasData}
      />

      {/* ─── MAIN 2-COLUMN LAYOUT (Like Mockup) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN (8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Traffic Chart */}
          <TrafficChart chartData={data?.chartData || []} hasData={hasData} />

          {/* Popular pages & Devices row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PopularPagesTable pages={data?.topPages || []} hasData={hasData} />
            <TrafficDonut
              title="Appareils utilisés"
              subtitle="Répartition des appareils"
              items={data?.deviceStats || []}
              totalLabel="sessions"
              totalCount={data?.kpis?.uniqueVisitors || 0}
              hasData={hasData}
            />
          </div>

          {/* Tech performance & Country stats row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CountryStats countries={data?.countryStats || []} hasData={hasData} />
            <TechPerformance
              performance={
                data?.techPerformance || {
                  loadTimeSeconds: null,
                  uptimePercent: 99.8,
                  pageSpeedGrade: 'A+',
                  hasRealData: false,
                }
              }
            />
          </div>

          {/* Key Events row */}
          <KeyEventsList events={data?.keyEvents || []} hasData={hasData} />

          {/* Conseil du jour box */}
          <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Conseil du jour</p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                {hasData
                  ? 'Vos visiteurs passent en moyenne plus de 2 minutes sur votre configurateur d\'art. Veillez à maintenir une haute résolution sur les photographies de supercars pour maximiser les conversions.'
                  : 'Partagez le lien de votre vitrine sur vos réseaux sociaux (Instagram, TikTok) pour commencer à récolter vos premières métriques réelles.'}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Realtime Live Activity Feed */}
          <RealtimeFeed realtime={data?.realtime || { activeVisitors: 0, activeList: [] }} />

          {/* Traffic Sources Donut */}
          <TrafficDonut
            title="Sources de trafic"
            subtitle="D'où viennent vos visiteurs ?"
            items={data?.trafficSources || []}
            totalLabel="uniques"
            totalCount={data?.kpis?.uniqueVisitors || 0}
            hasData={hasData}
          />

          {/* Traffic Sources Channels List */}
          <TrafficSourcesList sources={data?.trafficSources || []} hasData={hasData} />
        </div>
      </div>
    </div>
  )
}
