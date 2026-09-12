'use client'

import { useState } from 'react'
import { Package, Star, Eye, EyeOff, Plus, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface ProductItem {
  id: string
  name: string
  price: string
  brand: string
  active: boolean
  featured: boolean
  stock: number
}

export function ProductsPanel() {
  const [products, setProducts] = useState<ProductItem[]>([
    { id: '1', name: 'Ferrari F40 (1987)', price: '49,90 €', brand: 'Ferrari', active: true, featured: true, stock: 12 },
    { id: '2', name: 'Bugatti Chiron (2016)', price: '49,90 €', brand: 'Bugatti', active: true, featured: true, stock: 8 },
    { id: '3', name: 'Pagani Huayra V12', price: '49,90 €', brand: 'Pagani', active: true, featured: true, stock: 5 },
    { id: '4', name: 'Audi R8 V10 Performance', price: '49,90 €', brand: 'Audi Sport', active: true, featured: true, stock: 15 },
    { id: '5', name: 'Porsche 911 GT3 RS', price: '49,90 €', brand: 'Porsche', active: true, featured: false, stock: 9 },
    { id: '6', name: 'Lamborghini Aventador SVJ', price: '49,90 €', brand: 'Lamborghini', active: true, featured: false, stock: 6 },
    { id: '7', name: 'McLaren P1 Hybrid', price: '49,90 €', brand: 'McLaren', active: true, featured: false, stock: 4 },
    { id: '8', name: 'Aston Martin Valkyrie', price: '49,90 €', brand: 'Aston Martin', active: false, featured: false, stock: 0 },
  ])

  const toggleProductActive = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    )
  }

  const toggleProductFeatured = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-red-600" />
            Produits &amp; Articles
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Activez, mettez en avant ou modifiez vos cadres 3D automobiles.
          </p>
        </div>

        <Link
          href="/admin/produits/nouveau"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nouveau cadre</span>
        </Link>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {products.filter((p) => p.active).length} actifs sur {products.length}
          </span>
          <span className="text-[11px] text-slate-400 font-mono">Formats A4 / A3 / A2</span>
        </div>

        <div className="space-y-2">
          {products.map((p) => (
            <div
              key={p.id}
              className={`p-3 bg-white border rounded-xl transition flex items-center justify-between shadow-xs ${
                p.active ? 'border-slate-200 hover:border-slate-300' : 'border-slate-200/60 opacity-60 bg-slate-50'
              }`}
            >
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-slate-900 truncate">{p.name}</p>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                    {p.brand}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-semibold text-slate-700">{p.price}</span>
                  <span className="text-slate-300">·</span>
                  <span className={`text-[10px] font-medium ${p.stock > 0 ? 'text-emerald-600' : 'text-rose-500 font-bold'}`}>
                    {p.stock > 0 ? `${p.stock} en stock` : 'Rupture'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => toggleProductFeatured(p.id)}
                  className={`p-1.5 rounded-lg border transition cursor-pointer ${
                    p.featured
                      ? 'bg-amber-50 border-amber-200 text-amber-600'
                      : 'border-slate-200 text-slate-400 hover:text-slate-600'
                  }`}
                  title={p.featured ? 'Coup de cœur actif' : 'Mettre en coup de cœur'}
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                </button>

                <button
                  type="button"
                  onClick={() => toggleProductActive(p.id)}
                  className={`p-1.5 rounded-lg border transition cursor-pointer ${
                    p.active
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
                      : 'bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-600'
                  }`}
                  title={p.active ? 'Masquer du site' : 'Afficher sur le site'}
                >
                  {p.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
