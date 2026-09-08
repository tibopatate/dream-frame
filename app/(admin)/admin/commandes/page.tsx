import { prisma, isPrismaConfigured } from '@/lib/db'
import { getAllOrders, StoredOrder } from '@/lib/data-store'
import { formatPriceFromDecimal, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Search, ShoppingBag, Truck, CheckCircle2, ArrowRight } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{ status?: string; search?: string }>
}

export const metadata = { title: 'Suivi des Commandes — Dream Frame Admin' }

export default async function AdminCommandesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const activeStatus = params.status || ''
  const searchQuery = params.search || ''

  let orders: any[] = []

  // 1. Tenter Prisma uniquement si configuré
  if (isPrismaConfigured()) {
    try {
      const dbOrders = await prisma.order.findMany({
        where: {
          ...(activeStatus ? { status: activeStatus as any } : {}),
          ...(searchQuery
            ? {
                OR: [
                  { orderNumber: { contains: searchQuery, mode: 'insensitive' } },
                  { customerEmail: { contains: searchQuery, mode: 'insensitive' } },
                  { customerFirstName: { contains: searchQuery, mode: 'insensitive' } },
                  { customerLastName: { contains: searchQuery, mode: 'insensitive' } },
                ],
              }
            : {}),
        },
        orderBy: { createdAt: 'desc' },
      })
      if (dbOrders.length > 0) {
        orders = dbOrders
      }
    } catch {}
  }

  // 2. Si vide ou offline, charger depuis le magasin de données réel persistant
  if (orders.length === 0) {
    const storeOrders = getAllOrders()
    orders = storeOrders.filter((o) => {
      if (activeStatus && o.status !== activeStatus) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return (
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q) ||
          o.customerFirstName.toLowerCase().includes(q) ||
          o.customerLastName.toLowerCase().includes(q)
        )
      }
      return true
    })
  }

  const STATUS_LABELS: Record<string, string> = {
    PENDING: 'En attente',
    PAID: 'Payée',
    PREPARING: 'En préparation',
    SHIPPED: 'Expédiée',
    DELIVERED: 'Livrée',
    REFUNDED: 'Remboursée',
    CANCELLED: 'Annulée',
  }

  const STATUS_COLORS: Record<string, string> = {
    PENDING: 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/20',
    PAID: 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20',
    PREPARING: 'text-blue-400 bg-blue-400/10 border border-blue-400/20',
    SHIPPED: 'text-purple-400 bg-purple-400/10 border border-purple-400/20',
    DELIVERED: 'text-green-400 bg-green-400/10 border border-green-400/20',
    REFUNDED: 'text-rose-400 bg-rose-400/10 border border-rose-500/20',
    CANCELLED: 'text-neutral-400 bg-neutral-400/10 border border-neutral-400/20',
  }

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
          Suivi des Commandes
        </h1>
        <p className="text-neutral-400 text-xs mt-1">
          {orders.length} commande{orders.length > 1 ? 's' : ''} répertoriée{orders.length > 1 ? 's' : ''} · Expéditions et étiquettes Colissimo
        </p>
      </div>

      {/* Barre de Recherche et Filtres */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <form method="GET" action="/admin/commandes" className="w-full md:max-w-xs relative">
          {activeStatus && <input type="hidden" name="status" value={activeStatus} />}
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="search"
            name="search"
            defaultValue={searchQuery}
            placeholder="Rechercher email, nom, numéro..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/80 transition"
          />
        </form>

        {/* Boutons de Filtre par Statut */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <Link
            href="/admin/commandes"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              !activeStatus
                ? 'bg-white text-black border-white shadow-sm'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            Toutes
          </Link>
          {Object.entries(STATUS_LABELS).map(([status, label]) => {
            const isActive = activeStatus === status
            const url = `/admin/commandes?status=${status}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`
            return (
              <Link
                key={status}
                href={url}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  isActive
                    ? 'bg-white text-black border-white shadow-sm'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Tableau des Commandes */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-400">
            <thead className="bg-neutral-950 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
              <tr>
                <th className="px-6 py-4">Numéro Commande</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Suivi Colissimo</th>
                <th className="px-6 py-4 text-right">Total</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-neutral-500">
                    Aucune commande trouvée
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/commandes/${order.id}`}
                        className="font-mono font-bold text-white hover:text-amber-400 transition"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-neutral-400">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-white">
                          {order.customerFirstName} {order.customerLastName}
                        </p>
                        <p className="text-neutral-500 text-[10px]">{order.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${STATUS_COLORS[order.status]}`}>
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {order.trackingNumber ? (
                        <span className="font-mono text-[11px] text-neutral-300 flex items-center gap-1">
                          <Truck className="w-3 h-3 text-amber-400" />
                          {order.trackingNumber}
                        </span>
                      ) : (
                        <span className="text-[10px] text-neutral-600 italic">Non renseigné</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-white font-mono">
                      {formatPriceFromDecimal(Number(order.total))}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/commandes/${order.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-xl transition"
                      >
                        Gérer
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
