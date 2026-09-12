import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { prisma, isPrismaConfigured } from '@/lib/db'
import { decrementStockAtomic, generateInvoiceNumber } from '@/lib/order'
import {
  updateOrderStatusAsync,
  getOrderById,
  getAllOrders,
  adjustProductStock,
  writeDatabaseAsync,
  readDatabase,
} from '@/lib/data-store'

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const sig = headersList.get('stripe-signature')

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error(`⚠️ Webhook signature verification failed:`, message)
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 })
  }

  // Idempotence : si Prisma est configuré, vérifier si déjà traité
  if (isPrismaConfigured()) {
    try {
      const existingEvent = await (prisma as any).webhookEvent.findUnique({
        where: { id: event.id },
      })

      if (existingEvent?.processedAt) {
        return NextResponse.json({ received: true, message: 'Already processed' })
      }

      if (!existingEvent) {
        await (prisma as any).webhookEvent.create({
          data: {
            id: event.id,
            type: event.type,
          },
        })
      }
    } catch {}
  }

  try {
    // 1. Session de paiement terminée avec succès (Immédiat ou Asynchrone)
    if (
      event.type === 'checkout.session.completed' ||
      event.type === 'checkout.session.async_payment_succeeded'
    ) {
      const session = event.data.object as any
      const orderId = session.metadata?.orderId

      // Si le paiement est bien validé
      if (session.payment_status === 'paid' && orderId) {
        // A. Mise à jour immédiate et synchro Vercel Blob
        try {
          const updatedOrder = await updateOrderStatusAsync(orderId, 'PAID', {
            internalNote: `Paiement Stripe validé (${session.id})`,
          })

          // Décrémenter le stock local pour chaque article
          if (updatedOrder && updatedOrder.items) {
            for (const item of updatedOrder.items) {
              const prodId = item.productId || item.sku
              if (prodId) {
                adjustProductStock(prodId, -item.quantity, `Vente en ligne commande ${updatedOrder.orderNumber}`)
              }
            }
            await writeDatabaseAsync(readDatabase())
          }
        } catch (storeErr) {
          console.warn('Erreur mise à jour data-store cloud:', storeErr)
        }

        // B. Mise à jour transactionnelle Prisma si connecté
        if (isPrismaConfigured()) {
          try {
            await prisma.$transaction(async (tx) => {
              const order = await tx.order.findUnique({
                where: { id: orderId },
                include: { items: true },
              })

              if (order && order.status === 'PENDING') {
                for (const item of order.items) {
                  if (item.variantId) {
                    try {
                      await decrementStockAtomic(item.variantId, item.quantity, order.id)
                    } catch {}
                  }
                }

                const invoiceNumber = await generateInvoiceNumber()

                await tx.order.update({
                  where: { id: orderId },
                  data: {
                    status: 'PAID',
                    stripePaymentIntentId: session.payment_intent as string,
                    invoiceNumber,
                  },
                })
              }
            })
          } catch (dbErr) {
            console.warn('Prisma transaction notice:', dbErr)
          }
        }
      }
    }

    // 2. Échec du paiement différé
    if (event.type === 'checkout.session.async_payment_failed') {
      const session = event.data.object as any
      const orderId = session.metadata?.orderId
      if (orderId) {
        await updateOrderStatusAsync(orderId, 'CANCELLED', { internalNote: 'Paiement asynchrone Stripe échoué' })
        if (isPrismaConfigured()) {
          try {
            await prisma.order.update({
              where: { id: orderId },
              data: { status: 'CANCELLED' },
            })
          } catch {}
        }
      }
    }

    // 3. Session expirée sans paiement (abandon de panier)
    if (event.type === 'checkout.session.expired') {
      const session = event.data.object as any
      const orderId = session.metadata?.orderId
      if (orderId) {
        await updateOrderStatusAsync(orderId, 'CANCELLED', { internalNote: 'Session Stripe Checkout expirée sans paiement' })
        if (isPrismaConfigured()) {
          try {
            await prisma.order.update({
              where: { id: orderId },
              data: { status: 'CANCELLED' },
            })
          } catch {}
        }
      }
    }

    // 4. Remboursement effectué depuis le Dashboard Stripe
    if (event.type === 'charge.refunded') {
      const charge = event.data.object as any
      const paymentIntentId = charge.payment_intent as string
      if (paymentIntentId) {
        const orders = getAllOrders()
        const matched = orders.find(
          (o) => o.stripePaymentIntentId === paymentIntentId || (o as any).stripeSessionId === charge.id
        )
        if (matched) {
          await updateOrderStatusAsync(matched.id, 'REFUNDED', { internalNote: 'Commande remboursée sur Stripe' })
        }
        if (isPrismaConfigured()) {
          try {
            await prisma.order.updateMany({
              where: { stripePaymentIntentId: paymentIntentId },
              data: { status: 'REFUNDED' },
            })
          } catch {}
        }
      }
    }

    // Marquer comme traité dans Prisma si configuré
    if (isPrismaConfigured()) {
      try {
        await (prisma as any).webhookEvent.update({
          where: { id: event.id },
          data: { processedAt: new Date() },
        })
      } catch {}
    }

    return NextResponse.json({ received: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error(`Error processing webhook event ${event.id}:`, message)

    if (isPrismaConfigured()) {
      try {
        await (prisma as any).integrationLog.create({
          data: {
            service: 'STRIPE',
            action: event.type,
            status: 'ERROR',
            payload: event as object,
            error: message,
          },
        })
      } catch {}
    }

    return NextResponse.json({ received: true, note: 'Processed with fallback' })
  }
}
