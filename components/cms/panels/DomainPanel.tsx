'use client'

import { Globe, ShieldCheck, CheckCircle2, ArrowUpRight } from 'lucide-react'

export function DomainPanel() {
  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-6">
      <div>
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Globe className="w-5 h-5 text-red-600" />
          Domaine &amp; Hébergement
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          État de votre domaine personnalisé et infrastructure cloud de production.
        </p>
      </div>

      {/* Main domain card */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800">Nom de Domaine Principal</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Connecté
          </span>
        </div>

        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-mono font-bold text-slate-900">dreamframe.fr</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Certificat SSL Let&apos;s Encrypt actif (HTTPS)</p>
          </div>
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
        </div>
      </div>

      {/* Infrastructure Vercel status */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2.5">
        <h3 className="text-xs font-bold text-slate-800">Infrastructure Cloud Vercel</h3>
        <div className="space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span>Réseau Edge Mondial</span>
            <span className="font-semibold text-emerald-600">Opérationnel</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span>Stockage Média Vercel Blob</span>
            <span className="font-semibold text-emerald-600">Actif</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span>Déploiement Automatique Git</span>
            <span className="font-semibold text-slate-900 font-mono text-[11px]">main branch</span>
          </div>
        </div>
      </div>
    </div>
  )
}
