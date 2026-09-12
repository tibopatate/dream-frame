import { prisma } from '@/lib/db'
import { getOrderById, syncDatabaseWithCloud } from '@/lib/data-store'
import { OrderDetails } from './order-details'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata = { title: 'Détail de la commande — Dream Frame Admin' }
export const dynamic = 'force-dynamic'

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params
  await syncDatabaseWithCloud()

  let order: any = null

  // 1. Tenter Prisma
  try {
    order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    })
  } catch {
    order = null
  }

  // 2. Si non trouvé via Prisma, chercher dans le magasin persistant
  if (!order) {
    const stored = getOrderById(id)
    if (stored) {
      order = {
        ...stored,
        createdAt: new Date(stored.createdAt),
      }
    }
  }

  if (!order) {
    notFound()
  }

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6">
      <Link
        href="/admin/commandes"
        className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Retour aux commandes
      </Link>

      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
          Commande {order.orderNumber}
        </h1>
        <p className="text-neutral-400 text-xs mt-1">Gestion de l&apos;expédition Colissimo et pièces comptables</p>
      </div>

      <OrderDetails order={order as any} />
    </div>
  )
}
