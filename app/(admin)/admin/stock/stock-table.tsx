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
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-neutral-400">
          <thead className="bg-neutral-950 text-neutral-400 font-semibold uppercase tracking-wider border-b border-neutral-800">
            <tr>
              <th className="px-6 py-4">Modèle & Marque</th>
              <th className="px-6 py-4">SKU Atelier</th>
              <th className="px-6 py-4">Seuil Alerte</th>
              <th className="px-6 py-4">Stock Actuel</th>
              <th className="px-6 py-4 text-right">Ajustement Rapide</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/80">
            {items.map((item) => {
              const isLowStock = item.stock < item.stockAlert && item.stock > 0
              const isOutOfStock = item.stock === 0

              return (
                <tr key={item.variantId} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                        {item.brand}
                      </span>
                      <p className="font-bold text-white text-sm">{item.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-neutral-400">{item.sku}</td>
                  <td className="px-6 py-4 font-mono">Seuil &lt; {item.stockAlert}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono font-black text-lg ${
                          isOutOfStock ? 'text-rose-500' : isLowStock ? 'text-amber-400' : 'text-emerald-400'
                        }`}
                      >
                        {item.stock}
                      </span>
                      {isOutOfStock && (
                        <span className="text-[9px] font-bold bg-rose-950/60 text-rose-300 border border-rose-800/60 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Rupture
                        </span>
                      )}
                      {isLowStock && (
                        <span className="text-[9px] font-bold bg-amber-950/60 text-amber-300 border border-amber-800/60 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                          Faible
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      {feedback[item.variantId] && (
                        <span className="text-xs font-bold text-emerald-400 mr-2 animate-fade-in font-mono">
                          {feedback[item.variantId]} ✓
                        </span>
                      )}

                      {/* -5 */}
                      <button
                        type="button"
                        onClick={() => handleQuickAdjust(item.variantId, -5)}
                        disabled={loadingId === item.variantId || item.stock < 5}
                        className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg transition text-xs font-mono disabled:opacity-30 cursor-pointer"
                        title="Retirer 5 unités"
                      >
                        -5
                      </button>

                      {/* -1 */}
                      <button
                        type="button"
                        onClick={() => handleQuickAdjust(item.variantId, -1)}
                        disabled={loadingId === item.variantId || item.stock === 0}
                        className="p-1.5 bg-neutral-800 hover:bg-rose-950/40 hover:text-rose-300 text-neutral-300 rounded-lg transition disabled:opacity-30 cursor-pointer"
                        title="Retirer 1 unité"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      {/* +1 */}
                      <button
                        type="button"
                        onClick={() => handleQuickAdjust(item.variantId, 1)}
                        disabled={loadingId === item.variantId}
                        className="p-1.5 bg-neutral-800 hover:bg-emerald-950/40 hover:text-emerald-300 text-neutral-300 rounded-lg transition cursor-pointer"
                        title="Ajouter 1 unité"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>

                      {/* +5 */}
                      <button
                        type="button"
                        onClick={() => handleQuickAdjust(item.variantId, 5)}
                        disabled={loadingId === item.variantId}
                        className="px-2.5 py-1.5 bg-white hover:bg-neutral-200 text-black font-bold rounded-lg transition text-xs font-mono cursor-pointer shadow-sm"
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
