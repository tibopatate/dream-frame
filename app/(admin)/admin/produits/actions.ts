'use server'

import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { slugify } from '@/lib/utils'
import {
  addProduct as addStoreProduct,
  updateProduct as updateStoreProduct,
  deleteProduct as deleteStoreProduct,
  addProductAsync,
  updateProductAsync,
  deleteProductAsync,
} from '@/lib/data-store'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

// ─── Schéma Zod produit ────────────────────────────────────────────────────

const productSchema = z.object({
  name: z.string().min(3, 'Nom trop court').max(200),
  brand: z.string().min(2),
  description: z.string().min(1, 'Description requise'),
  price: z.preprocess((val) => {
    if (typeof val === 'string') {
      const cleaned = val.trim().replace(',', '.').replace(/[^\d.]/g, '')
      const num = parseFloat(cleaned)
      return isNaN(num) ? 0 : num
    }
    return typeof val === 'number' ? val : 0
  }, z.number().min(0, 'Le prix doit être positif ou nul').default(49.90)),
  isActive: z.coerce.boolean().default(true),
  isFeatured: z.coerce.boolean().default(false),
  stock: z.coerce.number().int().min(0).default(10),
  stockAlert: z.coerce.number().int().min(0).default(3),
  images: z
    .array(
      z.string().min(1, 'Chemin d’image invalide').refine(
        (val) =>
          val.startsWith('/') ||
          val.startsWith('http://') ||
          val.startsWith('https://') ||
          val.startsWith('data:image/'),
        { message: 'Format d’URL ou de chemin d’image invalide' }
      )
    )
    .min(1, 'Au moins 1 image requise'),
  stripePriceId: z.string().optional(),
})

// ─── Helpers ───────────────────────────────────────────────────────────────

async function requireAdmin() {
  const session = await auth()
  if (!session?.user) redirect('/admin/login')
}

function generateSku(brand: string, productCount: number): string {
  const brandCode = brand.toUpperCase().replace(/\s/g, '-').slice(0, 6)
  return `DF-${brandCode}-${String(productCount + 1).padStart(3, '0')}`
}

// ─── Server Actions ─────────────────────────────────────────────────────────

export async function createProduct(
  rawImages: string[],
  formData: FormData
): Promise<{ error?: string }> {
  await requireAdmin()

  const parsed = productSchema.safeParse({
    name: formData.get('name'),
    brand: formData.get('brand'),
    description: formData.get('description'),
    price: formData.get('price'),
    isActive: formData.get('isActive') === 'on',
    isFeatured: formData.get('isFeatured') === 'on',
    stock: formData.get('stock'),
    stockAlert: formData.get('stockAlert'),
    images: rawImages,
    stripePriceId: (formData.get('stripePriceId') as string) || '',
  })

  if (!parsed.success) {
    return { error: parsed.error.errors.map((e) => e.message).join(', ') }
  }

  const data = parsed.data
  const baseSlug = slugify(data.name)
  const sku = generateSku(data.brand, Math.floor(Math.random() * 100))

  // Récupérer les formats personnalisés (49.99€, 150€, 250€)
  let formats = [
    { id: 'fmt-a4', name: 'Standard A4', size: '21 x 29.7 cm', price: 49.90, stock: data.stock, isDefault: true },
    { id: 'fmt-a3', name: 'Grand Format A3 Collector', size: '30 x 42 cm', price: 149.90, stock: 5, isDefault: false },
    { id: 'fmt-a2', name: 'Prestige Galerie A2', size: '50 x 70 cm', price: 249.90, stock: 2, isDefault: false },
  ]
  const rawFormats = formData.get('formatsData')
  if (rawFormats && typeof rawFormats === 'string') {
    try {
      const parsedFormats = JSON.parse(rawFormats)
      if (Array.isArray(parsedFormats) && parsedFormats.length > 0) {
        formats = parsedFormats
      }
    } catch {}
  }

  // Cadrage et Aspect Ratio
  const aspectRatio = (formData.get('aspectRatio') as any) || '4:3'
  let cropPosition = { x: 0, y: 0, zoom: 1.0 }
  const rawCrop = formData.get('cropPosition')
  if (rawCrop && typeof rawCrop === 'string') {
    try {
      cropPosition = JSON.parse(rawCrop)
    } catch {}
  }

  // 1. Tenter Prisma
  try {
    let slug = baseSlug
    let counter = 1
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`
    }

    await prisma.product.create({
      data: {
        slug,
        name: data.name,
        brand: data.brand,
        description: data.description,
        price: data.price,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        images: data.images,
        variants: {
          create: {
            sku,
            stock: data.stock,
            stockAlert: data.stockAlert,
          },
        },
      },
    })
  } catch {
    // 2. Si PostgreSQL n'est pas encore en ligne, enregistrer dans le store persistant Vercel Blob
    await addProductAsync({
      slug: baseSlug,
      name: data.name,
      brand: data.brand,
      description: data.description,
      price: data.price,
      era: data.name.toLowerCase().includes('19') || data.name.toLowerCase().includes('vintage') ? 'VINTAGE' : 'MODERN',
      year: 2023,
      isActive: data.isActive,
      isFeatured: data.isFeatured,
      images: data.images,
      stock: data.stock,
      stockAlert: data.stockAlert,
      sku,
      stripePriceId: data.stripePriceId,
      formats,
      aspectRatio,
      cropPosition,
    })
  }

  revalidatePath('/admin/produits')
  revalidatePath('/catalogue')
  revalidatePath('/')
  revalidatePath('/', 'layout')
  redirect('/admin/produits')
}

export async function syncProductToStripe(params: {
  name: string
  description?: string
  images?: string[]
  formats: { id: string; name: string; size: string; price: number }[]
}): Promise<{ success: boolean; message: string; stripeProductId?: string; formatPrices?: Record<string, string> }> {
  await requireAdmin()
  const { getStripeSecretKey, createStripeClient } = await import('@/lib/stripe')
  const key = getStripeSecretKey()

  if (!key || !key.startsWith('sk_') || key === 'sk_test_placeholder') {
    return {
      success: true,
      message: 'Mode simulation actif. Vos tarifs (49,99€, 150€, 250€) sont enregistrés dans l&apos;atelier. Dès que votre clé Stripe sera configurée dans Paramètres, les produits seront synchronisés en 1 clic.',
    }
  }

  try {
    const client = createStripeClient(key)
    const product = await client.products.create({
      name: params.name,
      description: params.description || `Cadre 3D d'art automobile — ${params.name}`,
      images: params.images && params.images.length > 0 ? [params.images[0]] : undefined,
    })

    const formatPrices: Record<string, string> = {}
    for (const fmt of params.formats) {
      const price = await client.prices.create({
        product: product.id,
        unit_amount: Math.round(fmt.price * 100),
        currency: 'eur',
        nickname: `${fmt.name} (${fmt.size})`,
      })
      formatPrices[fmt.id] = price.id
    }

    return {
      success: true,
      message: `Produit "${params.name}" et ses ${params.formats.length} formats créés avec succès sur votre compte Stripe !`,
      stripeProductId: product.id,
      formatPrices,
    }
  } catch (err: any) {
    return {
      success: false,
      message: `Erreur Stripe : ${err.message || 'Impossible de créer le produit sur Stripe'}`,
    }
  }
}

export async function updateProduct(
  id: string,
  rawImages: string[],
  formData: FormData
): Promise<{ error?: string }> {
  await requireAdmin()

  const parsed = productSchema.safeParse({
    name: formData.get('name'),
    brand: formData.get('brand'),
    description: formData.get('description'),
    price: formData.get('price'),
    isActive: formData.get('isActive') === 'on',
    isFeatured: formData.get('isFeatured') === 'on',
    stock: formData.get('stock'),
    stockAlert: formData.get('stockAlert'),
    images: rawImages,
    stripePriceId: (formData.get('stripePriceId') as string) || '',
  })

  if (!parsed.success) {
    return { error: parsed.error.errors.map((e) => e.message).join(', ') }
  }

  const data = parsed.data

  try {
    const product = await prisma.product.findUniqueOrThrow({
      where: { id },
      include: { variants: true },
    })

    await prisma.$transaction([
      prisma.product.update({
        where: { id },
        data: {
          name: data.name,
          brand: data.brand,
          description: data.description,
          price: data.price,
          isActive: data.isActive,
          isFeatured: data.isFeatured,
          images: data.images,
        },
      }),
      ...(product.variants[0]
        ? [
            prisma.productVariant.update({
              where: { id: product.variants[0].id },
              data: { stock: data.stock, stockAlert: data.stockAlert },
            }),
          ]
        : []),
    ])
  } catch {
    await updateProductAsync(id, {
      name: data.name,
      brand: data.brand,
      description: data.description,
      price: data.price,
      isActive: data.isActive,
      isFeatured: data.isFeatured,
      images: data.images,
      stock: data.stock,
      stockAlert: data.stockAlert,
      stripePriceId: data.stripePriceId,
    })
  }

  revalidatePath('/admin/produits')
  revalidatePath('/catalogue')
  revalidatePath('/')
  revalidatePath('/', 'layout')
  revalidatePath(`/produit/${slugify(data.name)}`)
  redirect('/admin/produits')
}

export async function deleteProduct(id: string): Promise<void> {
  await requireAdmin()
  try {
    await prisma.product.delete({ where: { id } })
  } catch {
    await deleteProductAsync(id)
  }
  revalidatePath('/admin/produits')
  revalidatePath('/catalogue')
  revalidatePath('/')
  revalidatePath('/', 'layout')
}

export async function toggleProductActive(id: string, isActive: boolean): Promise<void> {
  await requireAdmin()
  try {
    await prisma.product.update({ where: { id }, data: { isActive } })
  } catch {
    await updateProductAsync(id, { isActive })
  }
  revalidatePath('/admin/produits')
  revalidatePath('/catalogue')
  revalidatePath('/')
  revalidatePath('/', 'layout')
}
