import { auth } from '@/lib/auth'
import { prisma, isPrismaConfigured } from '@/lib/db'
import { getAllOrders, getAllProducts, StoredOrder, StoredProduct } from '@/lib/data-store'
import { DashboardClient } from './dashboard-client'
import Link from 'next/link'
import { ArrowRight, Truck } from 'lucide-react'
import { formatPriceFromDecimal } from '@/lib/utils'

export const metadata = { title: 'Dashboard Analytics — Dream Frame Admin' }

export default async function AdminDashboardPage() {
  let isDbConnected = false
  let orders: StoredOrder[] = []
  let products: StoredProduct[] = []

  // 1. Tenter de charger depuis PostgreSQL Render UNIQUEMENT si la base est configurée
  if (isPrismaConfigured()) {
    try {
      const dbOrders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: { items: true },
      })

      if (dbOrders.length > 0) {
        orders = dbOrders.map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          status: o.status as any,
          customerEmail: o.customerEmail,
          customerFirstName: o.customerFirstName,
          customerLastName: o.customerLastName,
          customerPhone: o.customerPhone || undefined,
          shippingAddress: o.shippingAddress,
          shippingCity: o.shippingCity,
          shippingPostalCode: o.shippingPostalCode,
          shippingCountry: o.shippingCountry,
          subtotal: Number(o.subtotal),
          shippingCost: Number(o.shippingCost),
          taxAmount: Number(o.taxAmount),
          total: Number(o.total),
          carrier: o.carrier || 'Colissimo',
          trackingNumber: o.trackingNumber || undefined,
          invoiceNumber: o.invoiceNumber || undefined,
          internalNote: o.internalNote || undefined,
          createdAt: o.createdAt.toISOString(),
          items: o.items.map((it) => ({
            id: it.id,
            productId: it.productId || 'p-1',
            variantId: it.variantId || 'v-1',
            productName: it.productName,
            brand: 'Porsche',
            era: 'MODERN',
            sku: it.sku || 'DF-DEFAULT',
            unitPrice: Number(it.unitPrice),
            quantity: it.quantity,
            total: Number(it.total),
          })),
        }))
        isDbConnected = true
      }
    } catch {
      isDbConnected = false
    }
  }

  // 2. Si DB PostgreSQL non initialisée, charger le magasin de données réel persistant
  if (orders.length === 0) {
    orders = getAllOrders()
  }
  products = getAllProducts()

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
    <div className="space-y-8 pb-16">
      {/* Composant interactif avec sélection d'unités de temps et graphiques */}
      <DashboardClient
        initialOrders={orders}
        products={products}
        isDbConnected={isDbConnected}
      />

      {/* ─── Dernières Commandes Détaillées ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-white text-sm uppercase tracking-wider">
                Dernières Commandes Passées
              </h2>
              <p className="text-[11px] text-neutral-400 font-light">
                Flux en temps réel des acheteurs et expéditions Colissimo
              </p>
            </div>
            <Link
              href="/admin/commandes"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition flex items-center gap-1"
            >
              Gérer toutes les commandes ({orders.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-neutral-800/80">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-800/40 transition-colors text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <Link
                      href={`/admin/commandes/${order.id}`}
                      className="font-mono font-bold text-white hover:text-amber-400 transition"
                    >
                      {order.orderNumber}
                    </Link>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {new Intl.DateTimeFormat('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      }).format(new Date(order.createdAt))}
                    </span>
                  </div>
                  <p className="text-neutral-400">
                    {order.customerFirstName} {order.customerLastName} ·{' '}
                    <span className="text-neutral-500">{order.customerEmail}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${STATUS_COLORS[order.status] ?? 'text-neutral-400 bg-neutral-800'}`}>
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                  <p className="font-bold text-white text-sm font-mono">
                    {formatPriceFromDecimal(order.total)}
                  </p>
                  <Link
                    href={`/admin/commandes/${order.id}`}
                    className="text-xs text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-xl transition"
                  >
                    Détails
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
