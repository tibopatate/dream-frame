import { prisma, isPrismaConfigured } from '@/lib/db'
import { StockTable } from './stock-table'
import { ArrowLeftRight, Calendar } from 'lucide-react'
import { getAllProducts, getAllMovements, syncDatabaseWithCloud } from '@/lib/data-store'

export const metadata = { title: 'Gestion des Stocks — Dream Frame Admin' }
export const dynamic = 'force-dynamic'

export default async function AdminStockPage() {
  await syncDatabaseWithCloud()
  let stockItems: any[] = []
  let recentMovements: any[] = []

  if (isPrismaConfigured()) {
    try {
      const products = await prisma.product.findMany({
        orderBy: { brand: 'asc' },
        include: {
          variants: {
            select: {
              id: true,
              sku: true,
              stock: true,
              stockAlert: true,
            },
          },
        },
      })

      if (products.length > 0) {
        stockItems = products
          .filter((p) => p.variants[0] !== undefined)
          .map((p) => ({
            id: p.id,
            name: p.name,
            brand: p.brand,
            variantId: p.variants[0].id,
            sku: p.variants[0].sku,
            stock: p.variants[0].stock,
            stockAlert: p.variants[0].stockAlert,
          }))
      }

      recentMovements = await prisma.stockMovement.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          variant: {
            select: {
              sku: true,
              product: {
                select: { name: true, brand: true },
              },
            },
          },
        },
      }).catch(() => [])
    } catch {}
  }

  // Fallback instantané sur le data-store local persistant
  if (stockItems.length === 0) {
    const stored = getAllProducts()
    stockItems = stored.map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      variantId: p.id,
      sku: p.sku,
      stock: p.stock,
      stockAlert: p.stockAlert,
    }))
  }

  if (recentMovements.length === 0) {
    const storedMovs = getAllMovements()
    recentMovements = storedMovs.slice(0, 10).map((m) => ({
      id: m.id,
      quantity: m.quantity,
      type: m.type,
      createdAt: new Date(m.createdAt),
      reason: m.reason,
      variant: {
        sku: m.sku,
        product: { name: m.productName, brand: m.brand },
      },
    }))
  }

  const MOVEMENT_LABELS: Record<string, string> = {
    SALE: 'Vente (commande)',
    ORDER: 'Vente (commande)',
    REFUND: 'Réintégration (retour)',
    RETURN: 'Retour client',
    RESTOCK: 'Réapprovisionnement atelier',
    MANUAL_ADJUSTMENT: 'Correction manuelle',
    MANUAL: 'Correction manuelle',
  }

  const MOVEMENT_COLORS: Record<string, string> = {
    SALE: 'text-rose-400 bg-rose-500/10 border border-rose-500/20',
    ORDER: 'text-rose-400 bg-rose-500/10 border border-rose-500/20',
    REFUND: 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20',
    RESTOCK: 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20',
    RETURN: 'text-yellow-400 bg-yellow-500/10 border border-yellow-500/20',
    MANUAL_ADJUSTMENT: 'text-blue-400 bg-blue-500/10 border border-blue-500/20',
    MANUAL: 'text-blue-400 bg-blue-500/10 border border-blue-500/20',
  }

  return (
    <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
          Gestion des Stocks
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Ajustez en direct le niveau d&apos;unités disponibles pour chaque modèle de cadre
        </p>
      </div>

      {/* Table principale */}
      <StockTable initialItems={stockItems} />

      {/* Historique des mouvements */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-red-600" />
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              Historique Récent des Flux
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Dernières opérations</span>
        </div>

        <div className="divide-y divide-slate-100">
          {recentMovements.length === 0 ? (
            <p className="p-6 text-slate-400 text-xs text-center">Aucun mouvement de stock enregistré</p>
          ) : (
            recentMovements.map((m) => {
              const change = m.quantity
              const isPositive = change > 0

              return (
                <div key={m.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs hover:bg-slate-50 transition">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900">
                      {m.variant?.product?.brand} {m.variant?.product?.name}
                    </p>
                    <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                      <span className="font-mono text-slate-400">{m.variant?.sku}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {new Intl.DateTimeFormat('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }).format(new Date(m.createdAt))}
                      </span>
                      {m.reason && <span>· {m.reason}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${MOVEMENT_COLORS[m.type] || 'text-slate-500 bg-slate-100'}`}>
                      {MOVEMENT_LABELS[m.type] || m.type}
                    </span>
                    <span
                      className={`font-black text-sm px-2.5 py-1 rounded-xl ${
                        isPositive ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-rose-700 bg-rose-50 border border-rose-200'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {change}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
