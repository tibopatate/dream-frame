'use server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { adjustProductStock } from '@/lib/data-store'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user) redirect('/admin/login')
}

export async function adjustStock(
  variantId: string,
  quantityChange: number,
  note?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin()

    // 1. Toujours persister dans data-store local (garantit la persistance sur disque)
    adjustProductStock(variantId, quantityChange, note)

    // 2. Tenter la mise à jour Prisma si connectée
    try {
      await prisma.$transaction(async (tx) => {
        const variant = await tx.productVariant.findUnique({
          where: { id: variantId },
        })

        if (variant) {
          const newStock = Math.max(0, variant.stock + quantityChange)
          await tx.productVariant.update({
            where: { id: variantId },
            data: { stock: newStock },
          })

          await tx.stockMovement.create({
            data: {
              variantId,
              type: 'MANUAL',
              quantity: quantityChange,
              note: note ?? `Ajustement manuel admin (${quantityChange > 0 ? '+' : ''}${quantityChange})`,
            },
          })
        }
      })
    } catch {
      // Si la DB PostgreSQL n'est pas branchée en local, data-store.ts a déjà persisté la donnée
    }

    revalidatePath('/admin/stock')
    revalidatePath('/admin/dashboard')
    revalidatePath('/catalogue')
    revalidatePath('/')

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Erreur lors de la mise à jour du stock' }
  }
}
