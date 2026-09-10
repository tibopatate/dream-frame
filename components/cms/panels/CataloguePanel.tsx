'use client'

import { useState } from 'react'
import { Grid3X3, Plus, Sparkles, Check, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface CataloguePanelProps {
  onSelectCollectionSection?: () => void
}

export function CataloguePanel({ onSelectCollectionSection }: CataloguePanelProps) {
  const [collections, setCollections] = useState([
    { id: 'all', name: 'Toutes les Créations', count: 9, active: true, tag: 'Catalogue complet' },
    { id: 'vintage', name: 'Légendes Vintage (Avant 2000)', count: 4, active: true, tag: 'Ferrari F40, Countach...' },
    { id: 'modern', name: 'Hypercars Modernes (2000+)', count: 5, active: true, tag: 'Chiron, Huayra, R8...' },
    { id: 'limited', name: 'Série Limitée Atelier', count: 2, active: false, tag: 'Cadres numérotés LED' },
  ])

  const toggleActive = (id: string) => {
    setCollections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-red-600" />
            Catalogue &amp; Collections
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Gérez la structure de vos collections automobiles et leur mise en avant.
          </p>
        </div>
      </div>

      {/* Quick link to customize homepage collection */}
      {onSelectCollectionSection && (
        <button
          type="button"
          onClick={onSelectCollectionSection}
          className="w-full p-3 bg-red-50 border border-red-200 rounded-xl text-left hover:bg-red-100/50 transition cursor-pointer flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-bold text-red-700">Section &quot;Notre Collection&quot; sur l&apos;accueil</p>
            <p className="text-[11px] text-red-600/80">Personnaliser les 4 cadres affichés sur la page principale</p>
          </div>
          <Sparkles className="w-4 h-4 text-red-600 flex-shrink-0" />
        </button>
      )}

      {/* Collections list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Catégories actives</h3>
          <span className="text-[11px] text-slate-400 font-mono">{collections.length} catégories</span>
        </div>

        <div className="space-y-2">
          {collections.map((col) => (
            <div
              key={col.id}
              className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-800">{col.name}</p>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                    {col.count} cadres
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">{col.tag}</p>
              </div>

              <button
                type="button"
                onClick={() => toggleActive(col.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  col.active
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}
              >
                {col.active ? <Check className="w-3 h-3 text-emerald-600" /> : null}
                {col.active ? 'Visible' : 'Masquée'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Manage full catalogue */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
        <h4 className="text-xs font-bold text-slate-800">Gestion détaillée des cadres</h4>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Pour modifier individuellement chaque fiche produit (prix des formats A4/A3/A2, stock disponible, description technique), accédez au catalogue complet.
        </p>
        <div className="pt-2">
          <Link
            href="/admin/produits"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 hover:underline"
          >
            <span>Ouvrir l&apos;inventaire des produits</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
