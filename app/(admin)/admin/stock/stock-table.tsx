'use client'

import { adjustStock } from './actions'
import { useState } from 'react'
import { Plus, Minus, AlertTriangle, Check, Loader2 } from 'lucide-react'

interface StockTableProps {
  initialItems: {
    id: string
    name: string
    brand: string
    variantId: string
    sku: string
    stock: number
    stockAlert: number
  }[]
}

export function StockTable({ initialItems }: StockTableProps) {
  const [items, setItems] = useState(initialItems)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Record<string, string>>({})

  const handleQuickAdjust = async (variantId: string, delta: number) => {
    setLoadingId(variantId)

    const res = await adjustStock(variantId, delta)

    // Que la DB soit active ou en fallback local, on met à jour l'état visuel immédiatement
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.variantId === variantId
          ? { ...item, stock: Math.max(0, item.stock + delta) }
          : item
      )
    )

    setFeedback({
      ...feedback,
      [variantId]: delta > 0 ? `+${delta}` : `${delta}`,
    })
    setTimeout(() => {
      setFeedback((prev) => ({ ...prev, [variantId]: '' }))
    }, 2000)

    setLoadingId(null)
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">Modèle &amp; Marque</th>
              <th className="px-6 py-4">SKU Atelier</th>
              <th className="px-6 py-4">Seuil Alerte</th>
              <th className="px-6 py-4">Stock Actuel</th>
              <th className="px-6 py-4 text-right">Ajustement Rapide</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => {
              const isLowStock = item.stock < item.stockAlert && item.stock > 0
              const isOutOfStock = item.stock === 0

              return (
                <tr key={item.variantId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                        {item.brand}
                      </span>
                      <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-400">{item.sku}</td>
                  <td className="px-6 py-4 font-mono text-slate-500">Seuil &lt; {item.stockAlert}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono font-black text-lg ${
                          isOutOfStock ? 'text-rose-600' : isLowStock ? 'text-amber-600' : 'text-emerald-600'
                        }`}
                      >
                        {item.stock}
                      </span>
                      {isOutOfStock && (
                        <span className="text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Rupture
                        </span>
                      )}
                      {isLowStock && (
                        <span className="text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          Faible
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      {feedback[item.variantId] && (
                        <span className="text-xs font-bold text-emerald-600 mr-2 font-mono">
                          {feedback[item.variantId]} ✓
                        </span>
                      )}

                      {/* -5 */}
                      <button
                        type="button"
                        onClick={() => handleQuickAdjust(item.variantId, -5)}
                        disabled={loadingId === item.variantId || item.stock < 5}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition text-xs font-mono disabled:opacity-30 cursor-pointer"
                        title="Retirer 5 unités"
                      >
                        -5
                      </button>

                      {/* -1 */}
                      <button
                        type="button"
                        onClick={() => handleQuickAdjust(item.variantId, -1)}
                        disabled={loadingId === item.variantId || item.stock === 0}
                        className="p-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 rounded-lg transition disabled:opacity-30 cursor-pointer"
                        title="Retirer 1 unité"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      {/* +1 */}
                      <button
                        type="button"
                        onClick={() => handleQuickAdjust(item.variantId, 1)}
                        disabled={loadingId === item.variantId}
                        className="p-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-700 rounded-lg transition disabled:opacity-30 cursor-pointer"
                        title="Ajouter 1 unité"
                      >
                        {loadingId === item.variantId ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Plus className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* +5 */}
                      <button
                        type="button"
                        onClick={() => handleQuickAdjust(item.variantId, 5)}
                        disabled={loadingId === item.variantId}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition text-xs font-mono disabled:opacity-30 cursor-pointer"
                        title="Ajouter 5 unités"
                      >
                        +5
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
