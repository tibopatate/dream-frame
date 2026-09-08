'use client'

import { useState, useEffect } from 'react'
import { Users, Smartphone, Monitor, Globe, Activity } from 'lucide-react'

interface LiveVisitorsWidgetProps {
  variant?: 'compact' | 'badge' | 'card'
}

export function LiveVisitorsWidget({ variant = 'compact' }: LiveVisitorsWidgetProps) {
  const [visitorCount, setVisitorCount] = useState(14)
  const [mobileCount, setMobileCount] = useState(10)
  const [desktopCount, setDesktopCount] = useState(4)
  const [showDetails, setShowDetails] = useState(false)

  // Simulation réaliste de pulsation de trafic (Shopify Live Traffic Style)
  useEffect(() => {
    const interval = setInterval(() => {
      setVisitorCount((prev) => {
        // Fluctuation douce entre 11 et 19 visiteurs
        const delta = Math.floor(Math.random() * 3) - 1 // -1, 0, ou +1
        const next = Math.max(11, Math.min(19, prev + delta))
        const mobile = Math.round(next * 0.7)
        setMobileCount(mobile)
        setDesktopCount(next - mobile)
        return next
      })
    }, 4500)

    return () => clearInterval(interval)
  }, [])

  if (variant === 'badge') {
    return (
      <div className="relative inline-flex items-center">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold transition hover:bg-emerald-500/20 cursor-pointer"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>{visitorCount} en direct</span>
        </button>

        {showDetails && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowDetails(false)} />
            <div className="absolute top-full left-0 mt-2 w-64 p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-2xl z-50 text-xs space-y-3 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-2">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-500" />
                Trafic en direct
              </span>
              <span className="text-[10px] font-mono text-emerald-500 uppercase font-bold">Actif</span>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between text-slate-600 dark:text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <Smartphone className="w-3 h-3 text-slate-400" />
                  Mobile (TikTok / Insta)
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{mobileCount}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <Monitor className="w-3 h-3 text-slate-400" />
                  Ordinateur
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{desktopCount}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-neutral-800 text-[10px] text-slate-400 dark:text-neutral-400">
              <p>📍 Pages actives :</p>
              <p className="mt-0.5 text-slate-700 dark:text-neutral-300 font-mono">
                • 7 sur la Page d&apos;Accueil<br />
                • 4 sur Fiches Produits (Chiron, Huayra)<br />
                • 3 dans l&apos;Atelier Sur-Mesure
              </p>
            </div>
          </div>
        </>
      )}
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white font-mono">
              Visiteurs Actuels en Direct
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
            TEMPS RÉEL
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black font-serif text-slate-900 dark:text-white">
            {visitorCount}
          </span>
          <span className="text-xs text-slate-500 dark:text-neutral-400 font-sans">
            personnes naviguent sur la boutique
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-neutral-800 text-xs">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-neutral-800">
            <Smartphone className="w-4 h-4 text-amber-500" />
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">Mobile</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">{mobileCount}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-neutral-800">
            <Monitor className="w-4 h-4 text-blue-500" />
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">Desktop</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">{desktopCount}</span>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 dark:text-neutral-400 space-y-1">
          <div className="flex justify-between">
            <span>Page d&apos;Accueil</span>
            <span className="font-mono text-slate-900 dark:text-white font-semibold">50%</span>
          </div>
          <div className="flex justify-between">
            <span>Fiches Cadres 3D</span>
            <span className="font-mono text-slate-900 dark:text-white font-semibold">28%</span>
          </div>
          <div className="flex justify-between">
            <span>Configurateur Atelier</span>
            <span className="font-mono text-slate-900 dark:text-white font-semibold">22%</span>
          </div>
        </div>
      </div>
    )
  }

  // Variant Compact par défaut (pour sidebar)
  return (
    <div className="px-4 py-2.5 mx-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
          {visitorCount} en direct
        </span>
      </div>
      <span className="text-[9px] text-emerald-600 dark:text-emerald-400/80 font-mono font-bold uppercase">
        Live
      </span>
    </div>
  )
}
