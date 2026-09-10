'use client'

import { useState, useEffect } from 'react'
import { Users, Smartphone, Monitor, Activity } from 'lucide-react'

interface RealVisitorData {
  total: number
  mobileCount: number
  desktopCount: number
  pageCounts: Record<string, number>
}

export function LiveVisitorsWidget({ variant = 'card' }: { variant?: 'card' | 'compact' | 'badge' }) {
  const [data, setData] = useState<RealVisitorData>({
    total: 1,
    mobileCount: 0,
    desktopCount: 1,
    pageCounts: { '/': 1 },
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchRealVisitors = async () => {
      try {
        const res = await fetch('/api/track')
        if (res.ok) {
          const json = await res.json()
          if (isMounted && json && typeof json.total === 'number') {
            setData(json)
            setLoading(false)
          }
        }
      } catch (err) {
        // silent fail on network glitch
      }
    }

    fetchRealVisitors()
    const interval = setInterval(fetchRealVisitors, 15_000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  const topPages = Object.entries(data.pageCounts || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white font-mono">
            Visiteurs Actuels en Direct (Données Réelles)
          </h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
          ACTIF (5 MIN)
        </span>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-black text-slate-900 dark:text-white">
          {data.total}
        </span>
        <span className="text-xs text-slate-500 dark:text-neutral-400 font-sans">
          {data.total > 1 ? 'personnes naviguent sur la boutique' : 'personne navigue actuellement sur la boutique'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-neutral-800 text-xs">
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-neutral-800">
          <Smartphone className="w-4 h-4 text-amber-500" />
          <div>
            <span className="text-[10px] text-slate-400 block font-mono">Mobile</span>
            <span className="font-bold text-slate-900 dark:text-white font-mono">{data.mobileCount}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-neutral-800">
          <Monitor className="w-4 h-4 text-blue-500" />
          <div>
            <span className="text-[10px] text-slate-400 block font-mono">Desktop</span>
            <span className="font-bold text-slate-900 dark:text-white font-mono">{data.desktopCount}</span>
          </div>
        </div>
      </div>

      {topPages.length > 0 && (
        <div className="text-[11px] text-slate-500 dark:text-neutral-400 space-y-1">
          <p className="text-[10px] font-mono text-neutral-400 uppercase font-semibold">Pages consultées :</p>
          {topPages.map(([pagePath, count]) => (
            <div key={pagePath} className="flex justify-between font-mono">
              <span className="truncate max-w-[200px]">{pagePath === '/' ? "Page d'Accueil" : pagePath}</span>
              <span className="font-semibold text-slate-900 dark:text-white">{count} {count > 1 ? 'actifs' : 'actif'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
