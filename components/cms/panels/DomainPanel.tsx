'use client'

import { Globe, ShieldCheck, CheckCircle2, Copy, ExternalLink, ArrowRight } from 'lucide-react'
import { useState } from 'react'

export function DomainPanel() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-6">
      <div>
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Globe className="w-5 h-5 text-red-600" />
          Domaine &amp; Hébergement
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Configuration DNS de votre nom de domaine Namecheap et infrastructure cloud Vercel.
        </p>
      </div>

      {/* Main domain card */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800">Nom de Domaine Principal</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Domaine Officiel
          </span>
        </div>

        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-mono font-bold text-slate-900">dreamframeofficiel.com</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Certificat SSL Vercel automatique (HTTPS 🔒)</p>
          </div>
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
        </div>
      </div>

      {/* DNS Configuration Guide for Namecheap */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Enregistrements DNS Namecheap (Vercel)
          </h3>
          <span className="text-[10px] font-mono text-slate-500">2 Enregistrements</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Supprimez les 2 lignes par défaut de parking (CNAME www et URL Redirect) puis ajoutez ces 2 enregistrements dans votre panneau Namecheap :
        </p>

        <div className="space-y-2 text-xs">
          {/* Record 1: A Record */}
          <div className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 font-bold rounded">A</span>
              <span className="text-slate-500">Host:</span>
              <span className="font-bold text-slate-900">@</span>
              <span className="text-slate-400">→</span>
              <span className="text-slate-500">Value:</span>
              <span className="font-bold text-red-600">76.76.21.21</span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard('76.76.21.21', 'ip')}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded flex items-center gap-1 cursor-pointer transition"
            >
              <Copy className="w-3 h-3" />
              <span>{copied === 'ip' ? 'Copié !' : 'Copier'}</span>
            </button>
          </div>

          {/* Record 2: CNAME Record */}
          <div className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 font-bold rounded">CNAME</span>
              <span className="text-slate-500">Host:</span>
              <span className="font-bold text-slate-900">www</span>
              <span className="text-slate-400">→</span>
              <span className="text-slate-500">Value:</span>
              <span className="font-bold text-slate-900">cname.vercel-dns.com.</span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard('cname.vercel-dns.com.', 'cname')}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded flex items-center gap-1 cursor-pointer transition"
            >
              <Copy className="w-3 h-3" />
              <span>{copied === 'cname' ? 'Copié !' : 'Copier'}</span>
            </button>
          </div>
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
