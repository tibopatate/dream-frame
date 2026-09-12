import { NextResponse } from 'next/server'
import { prisma, isPrismaConfigured } from '@/lib/db'
import { getAllOrders, syncDatabaseWithCloud } from '@/lib/data-store'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const rawNumber = (body.orderNumber || '').trim().toUpperCase()
    const rawEmail = (body.email || '').trim().toLowerCase()

    if (!rawNumber) {
      return NextResponse.json({ error: 'Veuillez saisir un numéro de commande.' }, { status: 400 })
    }

    await syncDatabaseWithCloud()

    let matchedOrder: any = null

    // 1. Chercher dans PostgreSQL / Prisma
    if (isPrismaConfigured()) {
      try {
        const order = await prisma.order.findFirst({
          where: {
            OR: [
              { orderNumber: rawNumber },
              { orderNumber: rawNumber.startsWith('DF-') ? rawNumber : `DF-${rawNumber}` },
              { id: rawNumber },
            ],
          },
          include: {
            items: true,
          },
        })

        if (order) {
          if (!rawEmail || order.customerEmail.toLowerCase() === rawEmail) {
            matchedOrder = {
              id: order.id,
              orderNumber: order.orderNumber,
              customerEmail: order.customerEmail,
              status: order.status,
              carrier: (order as any).carrier || 'Colissimo La Poste Suivi',
              trackingNumber: (order as any).trackingNumber || null,
              createdAt: order.createdAt.toISOString(),
              total: Number(order.total),
              items: ((order as any).items || []).map((item: any) => ({
                name: item.productName || 'Cadre d’Art Automobile 3D',
                format: item.formatName || 'Format Standard A4',
                size: item.formatSize || '21 × 29.7 cm',
                qty: item.quantity,
                price: Number(item.unitPrice),
              })),
            }
          }
        }
      } catch {}
    }

    // 2. Chercher dans lib/data-store (JSON / Vercel Blob)
    if (!matchedOrder) {
      const allOrders = getAllOrders()
      const found = allOrders.find((o) => {
        const num = o.orderNumber.toUpperCase()
        const id = o.id.toUpperCase()
        const target = rawNumber.startsWith('DF-') ? rawNumber : `DF-${rawNumber}`
        const numMatch = num === rawNumber || num === target || id === rawNumber
        if (!numMatch) return false
        if (rawEmail) {
          return o.customerEmail.toLowerCase() === rawEmail
        }
        return true
      })

      if (found) {
        matchedOrder = {
          id: found.id,
          orderNumber: found.orderNumber,
          customerEmail: found.customerEmail,
          status: found.status,
          carrier: found.carrier || 'Colissimo La Poste Suivi',
          trackingNumber: found.trackingNumber || null,
          createdAt: found.createdAt,
          total: found.total,
          items: found.items.map((item) => ({
            name: item.productName,
            format: item.formatName || 'Format Standard A4',
            size: item.formatSize || '21 × 29.7 cm',
            qty: item.quantity,
            price: item.unitPrice,
          })),
        }
      }
    }

    if (!matchedOrder) {
      return NextResponse.json(
        {
          error:
            rawEmail
              ? `Aucune commande trouvée pour le numéro ${rawNumber} associé à l'e-mail ${rawEmail}.`
              : `Aucune commande trouvée pour la référence ${rawNumber}.`,
        },
        { status: 404 }
      )
    }

    // Élaborer les étapes de suivi selon le statut réel
    const createdDate = new Date(matchedOrder.createdAt)
    const formattedCreatedDate = createdDate.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

    const statusMap: Record<string, number> = {
      PENDING: 1,
      PAID: 1,
      PROCESSING: 2,
      SHIPPED: 3,
      DELIVERED: 4,
      CANCELLED: 0,
      REFUNDED: 0,
    }

    const currentStepIndex = statusMap[matchedOrder.status] ?? 1

    const steps = [
      {
        title: 'Paiement Sécurisé Validé',
        desc: 'La commande a été confirmée et transmise à notre atelier artisanal.',
        date: formattedCreatedDate,
        done: currentStepIndex >= 1,
        current: currentStepIndex === 1,
      },
      {
        title: 'Confection & Contrôle en Atelier',
        desc: 'Montage minutieux de la miniature automobile, fixation sous passe-partout 310g et banc d’essai du rétroéclairage LED.',
        date: currentStepIndex >= 2 ? 'Atelier Dream Frame' : 'En attente d’assemblage',
        done: currentStepIndex >= 2,
        current: currentStepIndex === 2,
      },
      {
        title: 'Colis Expédié en Colissimo Suivi',
        desc: matchedOrder.trackingNumber
          ? `Numéro de suivi Colissimo : ${matchedOrder.trackingNumber}. Prise en charge par le centre postal.`
          : 'Génération du bordereau Colissimo Suivi et remise au transporteur postal.',
        date: currentStepIndex >= 3 ? 'Acheminement en cours' : 'Estimation 24/48h après confection',
        done: currentStepIndex >= 3,
        current: currentStepIndex === 3,
      },
      {
        title: 'Livraison à Domicile',
        desc: 'Remise en boîte aux lettres ou en mains propres sans signature dans un emballage ultra-sécurisé anti-choc.',
        date: currentStepIndex === 4 ? 'Colis Livré' : 'Livraison sous 48h à 72h',
        done: currentStepIndex === 4,
        current: currentStepIndex === 4,
      },
    ]

    return NextResponse.json({
      success: true,
      order: {
        orderId: matchedOrder.orderNumber,
        status: matchedOrder.status,
        createdAt: formattedCreatedDate,
        carrier: matchedOrder.carrier,
        trackingCode: matchedOrder.trackingNumber || 'En cours d’attribution',
        currentStep: currentStepIndex,
        total: matchedOrder.total,
        items: matchedOrder.items,
        steps,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erreur interne' }, { status: 500 })
  }
}
