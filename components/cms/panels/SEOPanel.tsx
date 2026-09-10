'use client'

import { useState } from 'react'
import { Search, Globe, Check, Image as ImageIcon } from 'lucide-react'

export function SEOPanel() {
  const [metaTitle, setMetaTitle] = useState('Dream Frame | Site Officiel — Cadres 3D d\'Art Automobile')
  const [metaDesc, setMetaDesc] = useState(
    'Cadres 3D d\'exception pour passionnés d\'automobiles de légende. Miniatures de prestige, rétroéclairage LED intégré et finitions sur-mesure faites à la main en France.'
  )
  const [canonicalUrl, setCanonicalUrl] = useState('https://dreamframe.fr')
  const [indexSearch, setIndexSearch] = useState(true)

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-6">
      <div>
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Search className="w-5 h-5 text-red-600" />
          SEO &amp; Référencement
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Optimisez la visibilité de votre boutique dans les résultats de recherche Google et les partages sociaux.
        </p>
      </div>

      {/* Google Live Search Preview Card */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Aperçu Google Search</h3>
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>dreamframe.fr</span>
            <span className="text-slate-300">›</span>
          </div>
          <p className="text-sm font-semibold text-[#1a0dab] hover:underline cursor-pointer line-clamp-1 leading-snug">
            {metaTitle || 'Titre du site...'}
          </p>
          <p className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
            {metaDesc || 'Description du site dans les moteurs de recherche...'}
          </p>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[10px] uppercase font-bold text-slate-500">Titre de la Page (Balise Title)</label>
            <span className={`text-[10px] font-mono ${metaTitle.length > 60 ? 'text-amber-600' : 'text-slate-400'}`}>
              {metaTitle.length}/60 caractères
            </span>
          </div>
          <input
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[10px] uppercase font-bold text-slate-500">Méta Description</label>
            <span className={`text-[10px] font-mono ${metaDesc.length > 160 ? 'text-amber-600' : 'text-slate-400'}`}>
              {metaDesc.length}/160 caractères
            </span>
          </div>
          <textarea
            value={metaDesc}
            onChange={(e) => setMetaDesc(e.target.value)}
            rows={3}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500 resize-none leading-relaxed"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-slate-500">URL Canonique</label>
          <input
            type="text"
            value={canonicalUrl}
            onChange={(e) => setCanonicalUrl(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>

        {/* Indexation Toggle */}
        <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-800">Indexation par les moteurs de recherche</p>
            <p className="text-[10px] text-slate-400">Autoriser Google et Bing à référencer cette page</p>
          </div>
          <button
            type="button"
            onClick={() => setIndexSearch(!indexSearch)}
            className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${
              indexSearch ? 'bg-red-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                indexSearch ? 'translate-x-4.5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Sitemap & Robots status */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
          <p className="text-[11px] font-bold text-slate-700">Fichiers d&apos;indexation automatiques</p>
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <Check className="w-3.5 h-3.5" /> /sitemap.xml
            </span>
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <Check className="w-3.5 h-3.5" /> /robots.txt
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
