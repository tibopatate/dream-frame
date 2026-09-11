import { MetadataRoute } from 'next'
import { prisma, isPrismaConfigured } from '@/lib/db'
import { MOCK_PRODUCTS } from '@/lib/mock-data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dreamframeofficiel.com'

  // Récupérer tous les slugs de produits actifs
  let products: { slug: string; updatedAt?: Date }[] = []

  if (isPrismaConfigured()) {
    try {
      products = await prisma.product.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      })
    } catch {
      products = MOCK_PRODUCTS.map((p) => ({ slug: p.slug, updatedAt: new Date() }))
    }
  } else {
    products = MOCK_PRODUCTS.map((p) => ({ slug: p.slug, updatedAt: new Date() }))
  }

  const productEntries = products.map((product) => ({
    url: `${baseUrl}/produit/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const staticRoutes = [
    '',
    '/catalogue',
    '/configurateur',
    '/cgv',
    '/mentions-legales',
    '/confidentialite',
    '/cookies',
    '/retractation',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : route === '/catalogue' || route === '/configurateur' ? 0.9 : 0.3,
  }))

  return [...staticRoutes, ...productEntries]
}
