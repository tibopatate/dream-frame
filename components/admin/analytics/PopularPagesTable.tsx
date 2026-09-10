'use client'

import React from 'react'
import Link from 'next/link'
import { FileText, ExternalLink } from 'lucide-react'
import type { AnalyticsSummary } from '@/lib/analytics-store'

interface PopularPagesTableProps {
  pages: AnalyticsSummary['topPages']
  hasData: boolean
}

export function PopularPagesTable({ pages, hasData }: PopularPagesTableProps) {
  return (
    <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Pages les plus visitées</h3>
          <p className="text-xs text-slate-500 mt-0.5">Classement des pages par nombre de vues</p>
        </div>

        <Link
          href="/catalogue"
          target="_blank"
          className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 transition"
        >
          <span>Voir le site</span>
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
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-5 text-center font-bold text-slate-400 font-mono text-xs">
                  {idx + 1}
                </span>

                <div className="w-7 h-7 rounded-lg bg-red-100/60 text-red-600 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-3.5 h-3.5" />
                </div>

                <div className="min-w-0">
                  <p className="font-bold text-slate-800 truncate">{pg.path}</p>
                  <p className="text-[10px] text-slate-400 truncate">{pg.title}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-right">
                  <span className="font-mono font-bold text-slate-900 block">
                    {pg.views.toLocaleString('fr-FR')}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">vues</span>
                </div>

                <div className="w-16">
                  <div className="flex justify-end text-[10px] font-mono text-slate-500 mb-0.5">
                    {pg.percentage}%
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-600 rounded-full"
                      style={{ width: `${Math.min(100, Math.max(5, pg.percentage))}%` }}
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
