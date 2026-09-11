import { prisma, isPrismaConfigured } from '@/lib/db'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { MOCK_PRODUCTS } from '@/lib/mock-data'
import { Interactive3DFrame } from '@/components/3d/Interactive3DFrame'
import { ProductPurchaseSection } from '@/components/ProductPurchaseSection'
import { ProductReviewsSection } from '@/components/reviews/ProductReviewsSection'
import { getProductById, DEFAULT_FORMATS, getAllReviews } from '@/lib/data-store'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  let product = null

  if (isPrismaConfigured()) {
    try {
      product = await prisma.product.findUnique({
        where: { slug, isActive: true },
        select: { name: true, description: true, images: true },
      })
    } catch (error) {
      product = MOCK_PRODUCTS.find((p) => p.slug === slug) || null
    }
  } else {
    product = MOCK_PRODUCTS.find((p) => p.slug === slug) || null
  }

  if (!product) return {}

  return {
    title: `${product.name} — Cadre 3D d'Exception | Dream Frame`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  }
}

export async function generateStaticParams() {
  if (isPrismaConfigured()) {
    try {
      const products = await prisma.product.findMany({
        where: { isActive: true },
        select: { slug: true },
      })
      return products.map((p) => ({ slug: p.slug }))
    } catch (error) {
      return MOCK_PRODUCTS.map((p) => ({ slug: p.slug }))
    }
  }
  return MOCK_PRODUCTS.map((p) => ({ slug: p.slug }))
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  let product: any = null

  if (isPrismaConfigured()) {
    try {
      product = await prisma.product.findUnique({
        where: { slug, isActive: true },
        include: { variants: true },
      })
    } catch (error) {
      product = null
    }
  }

  // Fallback data-store puis mock
  const stored = getProductById(slug)
  if (!product && stored) {
    product = {
      ...stored,
      variants: [{ id: stored.id, sku: stored.sku, stock: stored.stock, price: stored.price }],
    }
  }

  if (!product) {
    product = MOCK_PRODUCTS.find((p) => p.slug === slug)
  }

  if (!product) notFound()

  // S'assurer que les formats sont présents (formats personnalisés du produit ou formats par défaut A4 49,99€, A3 150€, A2 250€)
  const productFormats = stored?.formats && stored.formats.length > 0 ? stored.formats : DEFAULT_FORMATS

  const variant = product.variants?.[0]
  const isVintage = product.era === 'VINTAGE' || product.year < 2000

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images || [],
    description: product.description,
    sku: variant?.sku || product.slug,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Dream Frame',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      lowPrice: '49.90',
      highPrice: '249.90',
      offerCount: productFormats.length,
      availability: (variant?.stock ?? 10) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Dream Frame',
      },
    },
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 bg-[#080807] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      {/* Fil d'Ariane Moderne */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-8 font-light">
        <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
        <span className="text-neutral-700">/</span>
        <Link href="/catalogue" className="hover:text-white transition-colors">La Collection</Link>
        <span className="text-neutral-700">/</span>
        <span className="text-amber-400 font-medium">{product.brand}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* ─── Visuel 3D Interactif ─── */}
        <div className="lg:col-span-7 space-y-6">
          <Interactive3DFrame
            imageSrc={product.images[0] || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop'}
            carName={product.name}
            brand={product.brand}
            year={product.year || 1987}
            isVintage={isVintage}
          />

          {/* Galerie de détails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
              {product.images.map((img: string, i: number) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 cursor-pointer">
                  <Image src={img} alt={`Angle ${i + 1}`} fill className="object-cover" sizes="80px" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ─── Informations d'Achat ─── */}
        <div className="lg:col-span-5 space-y-6">
          {/* Titre & Époque */}
          <div className="space-y-2 border-b border-neutral-800 pb-5">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 text-xs font-mono uppercase tracking-widest">
                {product.brand} · ATELIER FRANCE
              </span>
              <span className="text-xs font-mono text-neutral-400 bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-full">
                {product.year || 'Collection'}
              </span>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl text-white leading-tight">
                {product.name}
              </h1>
              <p className="text-[10px] font-mono tracking-[0.25em] text-neutral-400 uppercase mt-1">
                3D ART FRAME · SCULPTURE MURALE
              </p>
            </div>
            {variant?.sku && (
              <p className="text-xs text-neutral-400 font-mono tracking-wider">SKU : {variant.sku}</p>
            )}
          </div>

          {/* Bloc d'Achat & Choix de Formats Dynamiques (Standard A4 49,99€, Grand A3 150€, Prestige A2 250€) */}
          <ProductPurchaseSection
            product={{
              id: product.id,
              name: product.name,
              brand: product.brand,
              slug: product.slug,
              images: product.images || [],
              description: product.description,
              price: product.price || 49.99,
              sku: variant?.sku,
              stock: variant?.stock ?? 10,
              formats: productFormats,
            }}
          />

          {/* Description */}
          <div className="space-y-2 border-t border-neutral-800 pt-5">
            <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-400">Histoire & Conception</h2>
            <p className="text-neutral-300 text-sm leading-relaxed font-light">{product.description}</p>
          </div>
        </div>
      </div>

      {/* ─── Section Avis Clients Certifiés & Témoignages d'Atelier ─── */}
      <ProductReviewsSection
        productSlug={product.slug}
        productName={product.name}
        productId={product.id}
        initialReviews={
          getAllReviews({ productSlug: slug, status: 'APPROVED' }).length > 0
            ? getAllReviews({ productSlug: slug, status: 'APPROVED' })
            : getAllReviews({ status: 'APPROVED' })
        }
      />
    </main>
  )
}
