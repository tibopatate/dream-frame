'use client'

import React from 'react'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import type { AnalyticsSummary } from '@/lib/analytics-store'

interface PopularPagesTableProps {
  pages: AnalyticsSummary['topPages']
  hasData: boolean
}

export function PopularPagesTable({ pages, hasData }: PopularPagesTableProps) {
  // Page car visual hints for luxury automobile theme
  const pageSubtitles: Record<string, string> = {
    '/': 'Accueil',
    '/catalogue': 'Catalogue complet',
    '/collection-ferrari': 'Collection Ferrari',
    '/galerie': 'Galerie d\'art 3D',
    '/savoir-faire': 'Savoir-faire atelier',
    '/configurateur': 'Atelier Sur-Mesure',
    '/contact': 'Contact atelier',
    '/panier': 'Panier commande',
  }

  return (
    <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Pages les plus visitées</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Classement des pages par nombre de vues</p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 transition"
        >
          <span>Voir tout</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {!hasData || pages.length === 0 ? (
        <div className="h-44 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50 p-4 text-center">
          <p className="text-xs font-bold text-slate-600">Aucune page consultée pour le moment</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Les données apparaîtront après les premières visites</p>
        </div>
      ) : (
        <div className="space-y-2">
          {pages.map((pg, idx) => (
            <div
              key={pg.path}
              className="p-2.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-3 text-xs transition"
            >
              {/* Left: Rank + Thumbnail + Title */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span className="w-4 text-center font-bold text-slate-400 font-mono text-xs flex-shrink-0">
                  {idx + 1}
                </span>

                {/* Dark Luxury Frame Thumbnail */}
                <div className="w-8 h-8 rounded-lg bg-[#080807] border border-neutral-800 flex items-center justify-center flex-shrink-0 shadow-2xs overflow-hidden">
                  <span className="text-[9px] font-mono font-bold text-red-500">DF</span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-900 truncate leading-tight">{pg.path}</p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5 font-medium">
                    {pageSubtitles[pg.path] || pg.title}
                  </p>
                </div>
              </div>

              {/* Right: Views + Percentage Bar */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right min-w-[3rem]">
                  <span className="font-mono font-bold text-slate-900 text-xs block leading-tight">
                    {pg.views.toLocaleString('fr-FR')}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium">vues</span>
                </div>

                <div className="w-16 flex-shrink-0">
                  <div className="flex justify-end text-[10px] font-mono font-bold text-slate-700 mb-0.5">
                    {pg.percentage}%
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-600 rounded-full"
                      style={{ width: `${Math.min(100, Math.max(8, pg.percentage))}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
