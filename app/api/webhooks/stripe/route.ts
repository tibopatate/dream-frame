import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'
import { decrementStockAtomic, generateInvoiceNumber } from '@/lib/order'

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

  // Idempotence : vérifier si l'événement a déjà été traité (processedAt non nul)
  const existingEvent = await (prisma as any).webhookEvent.findUnique({
    where: { id: event.id },
  })

  if (existingEvent?.processedAt) {
    return NextResponse.json({ received: true, message: 'Already processed' })
  }

  // Créer l'entrée initiale si inexistante
  if (!existingEvent) {
    await (prisma as any).webhookEvent.create({
      data: {
        id: event.id,
        type: event.type,
      },
    })
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any
      const orderId = session.metadata?.orderId

      if (!orderId) {
        throw new Error('Missing orderId in Stripe session metadata')
      }

      await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUniqueOrThrow({
          where: { id: orderId },
          include: { items: true },
        })

        if (order.status !== 'PENDING') {
          console.log(`Order ${order.orderNumber} is already in state: ${order.status}`)
          return
        }

        for (const item of order.items) {
          if (item.variantId) {
            const success = await decrementStockAtomic(item.variantId, item.quantity, order.id)
            if (!success) {
              throw new Error(`Stock insuffisant pour le variant ${item.variantId}`)
            }
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

        // Sauvegarde miroir dans le data-store local
        try {
          const { updateOrderStatus } = await import('@/lib/data-store')
          updateOrderStatus(orderId, 'PAID')
        } catch {}

        // Log de réussite
        await (tx as any).integrationLog.create({
          data: {
            service: 'STRIPE',
            action: 'checkout.session.completed',
            status: 'SUCCESS',
            payload: session as object,
          },
        })
      })
    }

    // Marquer comme traité
    await (prisma as any).webhookEvent.update({
      where: { id: event.id },
      data: { processedAt: new Date() },
    })

    return NextResponse.json({ received: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error(`Error processing webhook event ${event.id}:`, message)

    // Log d'échec — on ne remet pas à jour WebhookEvent car processedAt reste null (idempotent retry)
    await (prisma as any).integrationLog.create({
      data: {
        service: 'STRIPE',
        action: event.type,
        status: 'ERROR',
        payload: event as object,
        error: message,
      },
    })

    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 })
  }
}
