'use server'

import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { reintegrateStock } from '@/lib/order'
import { updateOrderStatus as updateStoreOrderStatus, updateOrderStatusAsync } from '@/lib/data-store'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user) redirect('/admin/login')
}

export async function updateOrderStatus(
  orderId: string,
  status: any,
  shippingData?: { trackingNumber?: string; carrier?: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin()

    // 1. Tenter via Prisma
    try {
      await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUniqueOrThrow({
          where: { id: orderId },
          include: { items: true },
        })

        const dataToUpdate: any = { status }

        if (status === 'SHIPPED') {
          dataToUpdate.shippedAt = new Date()
          if (shippingData?.trackingNumber) {
            dataToUpdate.trackingNumber = shippingData.trackingNumber
          }
          if (shippingData?.carrier) {
            dataToUpdate.carrier = shippingData.carrier
          }
        } else if (status === 'DELIVERED') {
          dataToUpdate.deliveredAt = new Date()
        }

        await tx.order.update({
          where: { id: orderId },
          data: dataToUpdate,
        })

        if (status === 'REFUNDED' && order.status !== 'REFUNDED') {
          for (const item of order.items) {
            if (item.variantId) {
              await reintegrateStock(item.variantId, item.quantity, order.id)
            }
          }
        }
      })
    } catch {
      // 2. Si PostgreSQL n'est pas encore en ligne, enregistrer dans le store persistant Vercel Blob
      await updateOrderStatusAsync(orderId, status, {
        trackingNumber: shippingData?.trackingNumber,
        carrier: shippingData?.carrier,
      })
    }

    revalidatePath(`/admin/commandes/${orderId}`)
    revalidatePath('/admin/commandes')
    revalidatePath('/admin/dashboard')

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Erreur de mise à jour' }
  }
}

export async function updateInternalNote(
  orderId: string,
  note: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin()

    try {
      await prisma.order.update({
        where: { id: orderId },
        data: { internalNote: note },
      })
    } catch {
      await updateOrderStatusAsync(orderId, 'PAID', { internalNote: note })
    }

    revalidatePath(`/admin/commandes/${orderId}`)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Erreur' }
  }
}
