'use server'

import { prisma } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { generateOrderNumber } from '@/lib/order'
import { calculateShipping } from '@/lib/utils'
import { z } from 'zod'

const checkoutSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  firstName: z.string().min(2, "Prénom requis"),
  lastName: z.string().min(2, "Nom requis"),
  phone: z.string().min(10, "Téléphone requis"),
  address: z.string().min(5, "Adresse requise"),
  city: z.string().min(2, "Ville requise"),
  postalCode: z.string().min(5, "Code postal requis"),
  country: z.string().default("FR"),
  cartItems: z.array(z.object({
    variantId: z.string(),
    productId: z.string(),
    productName: z.string(),
    sku: z.string().optional().default('DF-CUSTOM'),
    price: z.number(),
    quantity: z.number().int().positive(),
    formatName: z.string().optional(),
    formatSize: z.string().optional(),
  })).min(1, "Votre panier est vide"),
})

export async function createCheckoutSession(formData: any) {
  try {
    const validated = checkoutSchema.parse(formData)

    // 1. Vérifier le stock pour chaque produit
    for (const item of validated.cartItems) {
      try {
        const variant = await prisma.productVariant.findUnique({
          where: { id: item.variantId },
          select: { stock: true, product: { select: { name: true } } },
        })

        if (variant && variant.stock < item.quantity) {
          return { error: `Stock insuffisant pour le modèle ${variant.product.name}. Il reste ${variant.stock} unités.` }
        }
      } catch {}
    }

    // 2. Calculer les montants
    const subtotal = validated.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shippingCost = calculateShipping(subtotal)
    const total = subtotal + shippingCost
    const taxAmount = parseFloat((total - total / 1.2).toFixed(2))

    // 3. Générer le numéro de commande DF-YYYY-NNNNN
    let orderNumber = 'DF-2026-00050'
    try {
      orderNumber = await generateOrderNumber()
    } catch {
      orderNumber = `DF-2026-${Math.floor(10000 + Math.random() * 90000)}`
    }

    // 4. Créer la commande PENDING dans la DB Prisma ET le data-store local
    let createdOrderId = `ord-${Date.now()}`
    try {
      const order = await prisma.order.create({
        data: {
          orderNumber,
          status: 'PENDING',
          customerEmail: validated.email,
          customerFirstName: validated.firstName,
          customerLastName: validated.lastName,
          customerPhone: validated.phone,
          shippingAddress: validated.address,
          shippingCity: validated.city,
          shippingPostalCode: validated.postalCode,
          shippingCountry: validated.country,
          subtotal,
          shippingCost,
          taxAmount,
          total,
          items: {
            create: validated.cartItems.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              sku: item.sku,
              productName: item.productName,
              unitPrice: item.price,
              quantity: item.quantity,
              total: item.price * item.quantity,
            })),
          },
        },
      })
      createdOrderId = order.id
    } catch {}

    // Sauvegarde miroir dans lib/data-store (garantit la persistance sur disque)
    try {
      const { createOrder } = await import('@/lib/data-store')
      createOrder({
        orderNumber,
        status: 'PENDING',
        customerEmail: validated.email,
        customerFirstName: validated.firstName,
        customerLastName: validated.lastName,
        customerPhone: validated.phone,
        shippingAddress: validated.address,
        shippingCity: validated.city,
        shippingPostalCode: validated.postalCode,
        shippingCountry: validated.country,
        subtotal,
        shippingCost,
        taxAmount,
        total,
        carrier: 'Colissimo Suivi',
        items: validated.cartItems.map((item) => ({
          id: `item-${Date.now()}-${item.sku || 'sku'}`,
          productId: item.productId,
          variantId: item.variantId,
          sku: item.sku || 'DF-CUSTOM',
          productName: item.productName,
          brand: item.productName.split(' ')[0] || 'Dream Frame',
          era: 'MODERN' as const,
          unitPrice: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity,
          formatName: item.formatName,
          formatSize: item.formatSize,
        })),
      })
    } catch {}

    // 5. Créer la session Stripe Checkout
    const rawBaseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const baseUrl = rawBaseUrl.replace(/\/+$/, '')
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: validated.email,
      line_items: [
        ...validated.cartItems.map((item) => ({
          price_data: {
            currency: 'eur',
            product_data: {
              name: item.formatName ? `${item.productName} — ${item.formatName}` : item.productName,
              description: item.formatName
                ? `Cadre d'exception ${item.formatName} (${item.formatSize || ''}) avec miniature 3D et éclairage LED`
                : `Cadre A4 premium avec miniature 3D et LED`,
              metadata: {
                sku: item.sku || 'DF-CUSTOM',
                formatName: item.formatName || 'Standard A4',
                formatSize: item.formatSize || '21 x 29.7 cm',
              },
            },
            unit_amount: Math.round(item.price * 100), // Stripe attend des centimes
          },
          quantity: item.quantity,
        })),
        ...(shippingCost > 0
          ? [
              {
                price_data: {
                  currency: 'eur',
                  product_data: {
                    name: 'Livraison Colissimo Suivi',
                  },
                  unit_amount: Math.round(shippingCost * 100),
                },
                quantity: 1,
              },
            ]
          : []),
      ],
      mode: 'payment',
      success_url: `${baseUrl}/checkout/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/panier`,
      metadata: {
        orderId: createdOrderId,
        orderNumber,
      },
    })

    // Mettre à jour la commande avec la session Stripe
    try {
      await prisma.order.update({
        where: { id: createdOrderId },
        data: { stripeSessionId: session.id },
      })
    } catch {}

    return { url: session.url }
  } catch (error: any) {
    console.error("Create Checkout Session Error:", error)
    if (error instanceof z.ZodError) {
      return { error: error.errors.map((e) => e.message).join(', ') }
    }
    if (error?.message?.includes('Invalid API Key') || error?.message?.includes('sk_test_placeholder')) {
      return {
        error: "Stripe n'est pas encore activé. Collez votre clé secrète Stripe dans l'espace Admin (Paramètres > Connexion Stripe) pour tester les paiements réels.",
      }
    }
    return { error: error.message || "Une erreur est survenue lors de la création de la session de paiement." }
  }
}
