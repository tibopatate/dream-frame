import { prisma } from '@/lib/db'

/**
 * Génère un numéro de commande au format DF-YYYY-00001
 * Incrémental par année, atomique via transaction Prisma
 */
export async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear()

  const counter = await prisma.orderCounter.upsert({
    where: { year },
    update: { lastNumber: { increment: 1 } },
    create: { year, lastNumber: 1 },
  })

  return `DF-${year}-${String(counter.lastNumber).padStart(5, '0')}`
}

/**
 * Génère un numéro de facture au format DF-YYYY-00001
 * Séparé du numéro de commande, jamais réutilisé (obligatoire fiscal FR)
 */
export async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear()

  const counter = await prisma.invoiceCounter.upsert({
    where: { year },
    update: { lastNumber: { increment: 1 } },
    create: { year, lastNumber: 1 },
  })

  return `DF-${year}-${String(counter.lastNumber).padStart(5, '0')}`
}

/**
 * Décrémente le stock de façon atomique (appelé uniquement depuis le webhook Stripe)
 * Retourne false si stock insuffisant
 */
export async function decrementStockAtomic(
  variantId: string,
  quantity: number,
  orderId: string
): Promise<boolean> {
  try {
    await prisma.$transaction(async (tx) => {
      const variant = await tx.productVariant.findUniqueOrThrow({
        where: { id: variantId },
        select: { stock: true },
      })

      if (variant.stock < quantity) {
        throw new Error(`Stock insuffisant pour le variant ${variantId}`)
      }

      await tx.productVariant.update({
        where: { id: variantId },
        data: { stock: { decrement: quantity } },
      })

      await tx.stockMovement.create({
        data: {
          variantId,
          type: 'ORDER',
          quantity: -quantity,
          orderId,
          note: `Commande ${orderId}`,
        },
      })
    })

    return true
  } catch {
    return false
  }
}

/**
 * Réintègre le stock après remboursement
 */
export async function reintegrateStock(
  variantId: string,
  quantity: number,
  orderId: string,
  note?: string
): Promise<void> {
  await prisma.$transaction([
    prisma.productVariant.update({
      where: { id: variantId },
      data: { stock: { increment: quantity } },
    }),
    prisma.stockMovement.create({
      data: {
        variantId,
        type: 'REFUND',
        quantity: +quantity,
        orderId,
        note: note ?? `Remboursement commande ${orderId}`,
      },
    }),
  ])
}
