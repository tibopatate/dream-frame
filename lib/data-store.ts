import fs from 'fs'
import path from 'path'
import { MOCK_PRODUCTS } from './mock-data'

const DATA_FILE = path.join(process.cwd(), 'data', 'dreamframe-db.json')

export interface ProductFormat {
  id: string
  name: string
  size: string
  price: number
  stock: number
  isDefault?: boolean
  stripePriceId?: string
}

export const DEFAULT_FORMATS: ProductFormat[] = [
  {
    id: 'fmt-a4',
    name: 'Cadre Format 10×15cm | Dream Frame Officiel',
    size: '10 x 15 cm',
    price: 49.90,
    stock: 10,
    isDefault: true,
    stripePriceId: '',
  },
  {
    id: 'fmt-a3',
    name: 'Cadre Format 30×40cm | Dream Frame Officiel',
    size: '30 x 40 cm',
    price: 149.90,
    stock: 5,
    isDefault: false,
    stripePriceId: '',
  },
  {
    id: 'fmt-a2',
    name: 'Cadre format 40×50cm | Dream Frame Officiel',
    size: '40 x 50 cm',
    price: 249.90,
    stock: 2,
    isDefault: false,
    stripePriceId: '',
  },
]

export interface StoredProduct {
  id: string
  slug: string
  name: string
  brand: string
  description: string
  price: number
  era: 'VINTAGE' | 'MODERN'
  year: number
  isActive: boolean
  isFeatured: boolean
  images: string[]
  stock: number
  stockAlert: number
  sku: string
  stripeProductId?: string
  stripePriceId?: string
  formatName?: string
  formatSize?: string
  formats?: ProductFormat[]
  aspectRatio?: '4:3' | '16:9' | '1:1' | '3:4'
  cropPosition?: { x: number; y: number; zoom: number }
  createdAt: string
}

export interface StoredOrderItem {
  id: string
  productId: string
  variantId: string
  productName: string
  brand: string
  era: 'VINTAGE' | 'MODERN'
  sku: string
  unitPrice: number
  quantity: number
  total: number
  formatName?: string
  formatSize?: string
}

export interface StoredOrder {
  id: string
  orderNumber: string
  status: 'PAID' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'REFUNDED' | 'CANCELLED' | 'PENDING'
  customerEmail: string
  customerFirstName: string
  customerLastName: string
  customerPhone?: string
  shippingAddress: string
  shippingCity: string
  shippingPostalCode: string
  shippingCountry: string
  subtotal: number
  shippingCost: number
  taxAmount: number
  total: number
  stripeSessionId?: string
  stripePaymentIntentId?: string
  invoiceNumber?: string
  trackingNumber?: string
  carrier: string
  internalNote?: string
  createdAt: string
  items: StoredOrderItem[]
}

export interface StoredStockMovement {
  id: string
  variantId: string
  sku: string
  productName: string
  brand: string
  quantity: number
  type: 'SALE' | 'RESTOCK' | 'MANUAL_ADJUSTMENT' | 'RETURN'
  reason?: string
  createdAt: string
}

export interface StoredCollaborator {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'LOGISTICS' | 'SUPPORT'
  status: 'ACTIVE' | 'INVITED'
  createdAt: string
}

export interface StoredSettings {
  stripeSecretKey?: string
  stripeWebhookSecret?: string
  stripePublishableKey?: string
  stripePriceA4?: string
  stripePriceA3?: string
  stripePriceA2?: string
  carrier: string
  shippingCost: number
  isShippingFree: boolean
  announcementBarText?: string
  announcementBarEnabled?: boolean
  adminTheme?: 'light' | 'dark' | 'system'
  realDataOnly?: boolean
  // Personnalisation Boutique Style Shopify
  headerLogoPosition?: 'left' | 'center' | 'right'
  headerStyle?: 'glass' | 'solid' | 'gold'
  headerLogoText?: string
  announcementBarPosition?: 'top' | 'below'
  animationsType?: 'fade-up' | 'hero-zoom' | 'slide-in' | 'none'
  animationsSpeed?: 'slow' | 'normal' | 'fast'
  glowEffectsEnabled?: boolean
  // Panier & Upsells
  cartUpsellsEnabled?: boolean
  cartUpsellChevaletEnabled?: boolean
  cartUpsellMicrofibreEnabled?: boolean
  cartUpsellGiftEnabled?: boolean
  // Hero & Accès direct
  heroBadgeText?: string
  heroTitle?: string
  heroSubtitle?: string
  heroPriceText?: string
  heroCtaPrimaryText?: string
  heroCtaPrimaryLink?: string
  heroCtaSecondaryText?: string
  heroCtaSecondaryLink?: string
  heroImage?: string
  // Piliers de l'Objet (3 Piliers)
  pillarsTitle?: string
  pillarsSubtitle?: string
  pillar1Title?: string
  pillar1Value?: string
  pillar1Desc?: string
  pillar2Title?: string
  pillar2Value?: string
  pillar2Desc?: string
  pillar3Title?: string
  pillar3Value?: string
  pillar3Desc?: string
  // Démonstration Visuelle
  demoTitle?: string
  demoSubtitle?: string
  // Collection & Catalogue
  collectionTitle?: string
  collectionSubtitle?: string
  collectionStartingPrice?: string
  collectionCtaText?: string
  // Section Conception & Fabrication (5 Couches)
  craftSectionEnabled?: boolean
  craftTitle?: string
  craftSubtitle?: string
  craftSectionImage?: string
  // Réassurance (4 Piliers)
  reassurance1Title?: string
  reassurance1Desc?: string
  reassurance2Title?: string
  reassurance2Desc?: string
  reassurance3Title?: string
  reassurance3Desc?: string
  reassurance4Title?: string
  reassurance4Desc?: string
  // Invitation Atelier Sur-Mesure
  configuratorCtaTitle?: string
  configuratorCtaDesc?: string
  configuratorCtaButton?: string
  // Footer & Réseaux Sociaux
  footerNotice?: string
  footerCopyright?: string
  instagramUrl?: string
  tiktokUrl?: string
  heroVideo?: string
}

export interface StoredReview {
  id: string
  productId?: string
  productSlug?: string
  productName?: string
  name: string
  email?: string
  rating: number // 1 to 5
  title?: string
  comment: string
  location?: string
  formatPurchased?: string
  isVerified: boolean
  status: 'APPROVED' | 'PENDING'
  createdAt: string
}

export interface DatabaseSchema {
  products: StoredProduct[]
  orders: StoredOrder[]
  movements: StoredStockMovement[]
  settings: StoredSettings
  collaborators?: StoredCollaborator[]
  reviews?: StoredReview[]
}

function getInitialDatabase(): DatabaseSchema {
  const now = new Date()

  // Produits initiaux basés sur le catalogue
  const products: StoredProduct[] = MOCK_PRODUCTS.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    description: p.description,
    price: p.price,
    era: (p.era as 'VINTAGE' | 'MODERN') || (p.year && p.year < 2000 ? 'VINTAGE' : 'MODERN'),
    year: p.year || 2023,
    isActive: true,
    isFeatured: p.isFeatured || false,
    images: p.images,
    stock: p.variants?.[0]?.stock ?? 12,
    stockAlert: p.variants?.[0]?.stockAlert ?? 3,
    sku: p.variants?.[0]?.sku ?? `DF-${p.brand.toUpperCase()}-001`,
    stripePriceId: '',
    createdAt: new Date(now.getTime() - 86400000 * 30).toISOString(),
  }))

  // Commandes réalistes réparties sur les différentes unités de temps pour tester les graphiques
  const orders: StoredOrder[] = [
    // Aujourd'hui
    {
      id: 'ord-today-1',
      orderNumber: 'DF-2026-00042',
      status: 'PAID',
      customerEmail: 'lucas.bernard@gmail.com',
      customerFirstName: 'Lucas',
      customerLastName: 'Bernard',
      customerPhone: '06 14 22 33 44',
      shippingAddress: '15 Boulevard Haussmann',
      shippingCity: 'Paris',
      shippingPostalCode: '75009',
      shippingCountry: 'FR',
      subtotal: 49.90,
      shippingCost: 0,
      taxAmount: 8.33,
      total: 49.90,
      carrier: 'Colissimo Suivi',
      invoiceNumber: 'DF-2026-00042',
      createdAt: new Date(now.getTime() - 3600000 * 2).toISOString(),
      items: [
        {
          id: 'item-t1',
          productId: 'mock-gt3rs',
          variantId: 'var-gt3rs',
          productName: 'Porsche 911 GT3 RS (992)',
          brand: 'Porsche',
          era: 'MODERN',
          sku: 'DF-PORSCHE-001',
          unitPrice: 49.90,
          quantity: 1,
          total: 49.90,
        },
      ],
    },
    {
      id: 'ord-today-2',
      orderNumber: 'DF-2026-00041',
      status: 'PREPARING',
      customerEmail: 'marc.durand@yahoo.fr',
      customerFirstName: 'Marc',
      customerLastName: 'Durand',
      customerPhone: '07 88 99 11 22',
      shippingAddress: '42 Avenue Jean Médecin',
      shippingCity: 'Nice',
      shippingPostalCode: '06000',
      shippingCountry: 'FR',
      subtotal: 99.98,
      shippingCost: 0,
      taxAmount: 16.66,
      total: 99.98,
      carrier: 'Colissimo Suivi',
      invoiceNumber: 'DF-2026-00041',
      createdAt: new Date(now.getTime() - 3600000 * 5).toISOString(),
      items: [
        {
          id: 'item-t2-1',
          productId: 'mock-f40',
          variantId: 'var-f40',
          productName: 'Ferrari F40 (1987)',
          brand: 'Ferrari',
          era: 'VINTAGE',
          sku: 'DF-FERRARI-001',
          unitPrice: 49.90,
          quantity: 1,
          total: 49.90,
        },
        {
          id: 'item-t2-2',
          productId: 'mock-250gto',
          variantId: 'var-250gto',
          productName: 'Ferrari 250 GTO (1962)',
          brand: 'Ferrari',
          era: 'VINTAGE',
          sku: 'DF-FERRARI-002',
          unitPrice: 49.90,
          quantity: 1,
          total: 49.90,
        },
      ],
    },

    // Hier (J-1)
    {
      id: 'ord-j1-1',
      orderNumber: 'DF-2026-00040',
      status: 'SHIPPED',
      customerEmail: 'julien.roux@outlook.fr',
      customerFirstName: 'Julien',
      customerLastName: 'Roux',
      customerPhone: '06 55 44 33 22',
      shippingAddress: '8 Rue Mercière',
      shippingCity: 'Lyon',
      shippingPostalCode: '69002',
      shippingCountry: 'FR',
      subtotal: 49.90,
      shippingCost: 0,
      taxAmount: 8.33,
      total: 49.90,
      carrier: 'Colissimo Suivi',
      trackingNumber: '6A12398471928',
      invoiceNumber: 'DF-2026-00040',
      createdAt: new Date(now.getTime() - 86400000 * 1).toISOString(),
      items: [
        {
          id: 'item-j1-1',
          productId: 'mock-f40',
          variantId: 'var-f40',
          productName: 'Ferrari F40 (1987)',
          brand: 'Ferrari',
          era: 'VINTAGE',
          sku: 'DF-FERRARI-001',
          unitPrice: 49.90,
          quantity: 1,
          total: 49.90,
        },
      ],
    },

    // J-2
    {
      id: 'ord-j2-1',
      orderNumber: 'DF-2026-00039',
      status: 'DELIVERED',
      customerEmail: 'arthur.petit@gmail.com',
      customerFirstName: 'Arthur',
      customerLastName: 'Petit',
      customerPhone: '06 12 98 76 54',
      shippingAddress: '22 Cours dAlbret',
      shippingCity: 'Bordeaux',
      shippingPostalCode: '33000',
      shippingCountry: 'FR',
      subtotal: 49.90,
      shippingCost: 0,
      taxAmount: 8.33,
      total: 49.90,
      carrier: 'Colissimo Suivi',
      trackingNumber: '6A88992233114',
      invoiceNumber: 'DF-2026-00039',
      createdAt: new Date(now.getTime() - 86400000 * 2).toISOString(),
      items: [
        {
          id: 'item-j2-1',
          productId: 'mock-gt3rs',
          variantId: 'var-gt3rs',
          productName: 'Porsche 911 GT3 RS (992)',
          brand: 'Porsche',
          era: 'MODERN',
          sku: 'DF-PORSCHE-001',
          unitPrice: 49.90,
          quantity: 1,
          total: 49.90,
        },
      ],
    },

    // J-4
    {
      id: 'ord-j4-1',
      orderNumber: 'DF-2026-00038',
      status: 'DELIVERED',
      customerEmail: 'stephane.girard@sfr.fr',
      customerFirstName: 'Stéphane',
      customerLastName: 'Girard',
      shippingAddress: '14 Allée de Tourny',
      shippingCity: 'Bordeaux',
      shippingPostalCode: '33000',
      shippingCountry: 'FR',
      subtotal: 49.90,
      shippingCost: 0,
      taxAmount: 8.33,
      total: 49.90,
      carrier: 'Colissimo Suivi',
      invoiceNumber: 'DF-2026-00038',
      createdAt: new Date(now.getTime() - 86400000 * 4).toISOString(),
      items: [
        {
          id: 'item-j4-1',
          productId: 'mock-revuelto',
          variantId: 'var-revuelto',
          productName: 'Lamborghini Revuelto',
          brand: 'Lamborghini',
          era: 'MODERN',
          sku: 'DF-LAMBO-001',
          unitPrice: 49.90,
          quantity: 1,
          total: 49.90,
        },
      ],
    },

    // J-6
    {
      id: 'ord-j6-1',
      orderNumber: 'DF-2026-00037',
      status: 'DELIVERED',
      customerEmail: 'nicolas.faure@gmail.com',
      customerFirstName: 'Nicolas',
      customerLastName: 'Faure',
      shippingAddress: '5 Place Royale',
      shippingCity: 'Nantes',
      shippingPostalCode: '44000',
      shippingCountry: 'FR',
      subtotal: 99.98,
      shippingCost: 0,
      taxAmount: 16.66,
      total: 99.98,
      carrier: 'Colissimo Suivi',
      invoiceNumber: 'DF-2026-00037',
      createdAt: new Date(now.getTime() - 86400000 * 6).toISOString(),
      items: [
        {
          id: 'item-j6-1',
          productId: 'mock-f40',
          variantId: 'var-f40',
          productName: 'Ferrari F40 (1987)',
          brand: 'Ferrari',
          era: 'VINTAGE',
          sku: 'DF-FERRARI-001',
          unitPrice: 49.90,
          quantity: 2,
          total: 99.98,
        },
      ],
    },

    // J-12
    {
      id: 'ord-j12-1',
      orderNumber: 'DF-2026-00036',
      status: 'DELIVERED',
      customerEmail: 'alexandre.lemoine@free.fr',
      customerFirstName: 'Alexandre',
      customerLastName: 'Lemoine',
      shippingAddress: '19 Rue du Taur',
      shippingCity: 'Toulouse',
      shippingPostalCode: '31000',
      shippingCountry: 'FR',
      subtotal: 49.90,
      shippingCost: 0,
      taxAmount: 8.33,
      total: 49.90,
      carrier: 'Colissimo Suivi',
      invoiceNumber: 'DF-2026-00036',
      createdAt: new Date(now.getTime() - 86400000 * 12).toISOString(),
      items: [
        {
          id: 'item-j12-1',
          productId: 'mock-300sl',
          variantId: 'var-300sl',
          productName: 'Mercedes 300 SL Papillon',
          brand: 'Mercedes',
          era: 'VINTAGE',
          sku: 'DF-MERCEDES-001',
          unitPrice: 49.90,
          quantity: 1,
          total: 49.90,
        },
      ],
    },

    // J-18
    {
      id: 'ord-j18-1',
      orderNumber: 'DF-2026-00035',
      status: 'DELIVERED',
      customerEmail: 'hugo.caron@gmail.com',
      customerFirstName: 'Hugo',
      customerLastName: 'Caron',
      shippingAddress: '3 Quai des Bateliers',
      shippingCity: 'Strasbourg',
      shippingPostalCode: '67000',
      shippingCountry: 'FR',
      subtotal: 49.90,
      shippingCost: 0,
      taxAmount: 8.33,
      total: 49.90,
      carrier: 'Colissimo Suivi',
      invoiceNumber: 'DF-2026-00035',
      createdAt: new Date(now.getTime() - 86400000 * 18).toISOString(),
      items: [
        {
          id: 'item-j18-1',
          productId: 'mock-gt3rs',
          variantId: 'var-gt3rs',
          productName: 'Porsche 911 GT3 RS (992)',
          brand: 'Porsche',
          era: 'MODERN',
          sku: 'DF-PORSCHE-001',
          unitPrice: 49.90,
          quantity: 1,
          total: 49.90,
        },
      ],
    },

    // J-25
    {
      id: 'ord-j25-1',
      orderNumber: 'DF-2026-00034',
      status: 'DELIVERED',
      customerEmail: 'valentin.g@gmail.com',
      customerFirstName: 'Valentin',
      customerLastName: 'Garnier',
      shippingAddress: '12 Rue Saint-Malo',
      shippingCity: 'Rennes',
      shippingPostalCode: '35000',
      shippingCountry: 'FR',
      subtotal: 149.97,
      shippingCost: 0,
      taxAmount: 24.99,
      total: 149.97,
      carrier: 'Colissimo Suivi',
      invoiceNumber: 'DF-2026-00034',
      createdAt: new Date(now.getTime() - 86400000 * 25).toISOString(),
      items: [
        {
          id: 'item-j25-1',
          productId: 'mock-f40',
          variantId: 'var-f40',
          productName: 'Ferrari F40 (1987)',
          brand: 'Ferrari',
          era: 'VINTAGE',
          sku: 'DF-FERRARI-001',
          unitPrice: 49.90,
          quantity: 2,
          total: 99.98,
        },
        {
          id: 'item-j25-2',
          productId: 'mock-gt3rs',
          variantId: 'var-gt3rs',
          productName: 'Porsche 911 GT3 RS (992)',
          brand: 'Porsche',
          era: 'MODERN',
          sku: 'DF-PORSCHE-001',
          unitPrice: 49.90,
          quantity: 1,
          total: 49.90,
        },
      ],
    },
  ]

  const movements: StoredStockMovement[] = [
    {
      id: 'mov-1',
      variantId: 'var-gt3rs',
      sku: 'DF-PORSCHE-001',
      productName: 'Porsche 911 GT3 RS (992)',
      brand: 'Porsche',
      quantity: -1,
      type: 'SALE',
      reason: 'Commande DF-2026-00042',
      createdAt: new Date(now.getTime() - 3600000 * 2).toISOString(),
    },
    {
      id: 'mov-2',
      variantId: 'var-f40',
      sku: 'DF-FERRARI-001',
      productName: 'Ferrari F40 (1987)',
      brand: 'Ferrari',
      quantity: -1,
      type: 'SALE',
      reason: 'Commande DF-2026-00041',
      createdAt: new Date(now.getTime() - 3600000 * 5).toISOString(),
    },
    {
      id: 'mov-3',
      variantId: 'var-f40',
      sku: 'DF-FERRARI-001',
      productName: 'Ferrari F40 (1987)',
      brand: 'Ferrari',
      quantity: 15,
      type: 'RESTOCK',
      reason: 'Arrivage atelier assemblage France',
      createdAt: new Date(now.getTime() - 86400000 * 7).toISOString(),
    },
  ]

  const settings: StoredSettings = {
    carrier: 'Colissimo Suivi',
    shippingCost: 0,
    isShippingFree: true,
    announcementBarText: 'LIVRAISON COLISSIMO SUIVIE 100% OFFERTE · EXPÉDITION 24/48H',
    announcementBarEnabled: true,
    craftSectionImage: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop',
    adminTheme: 'light',
    realDataOnly: true,
    instagramUrl: 'https://www.instagram.com/dreamframe996?stkn=cW9yb2NxOG8wOXFw',
    tiktokUrl: 'https://www.tiktok.com/@dreamframe_officiel',
    heroVideo: '',
  }

  const collaborators: StoredCollaborator[] = [
    {
      id: 'collab-1',
      name: 'Morgan',
      email: 'admin@dreamframe.fr',
      role: 'ADMIN',
      status: 'ACTIVE',
      createdAt: now.toISOString(),
    },
    {
      id: 'collab-2',
      name: 'Frère (Associé)',
      email: 'contact@dreamframe.fr',
      role: 'ADMIN',
      status: 'ACTIVE',
      createdAt: now.toISOString(),
    },
  ]

  const reviews = getInitialReviews()

  return { products, orders, movements, settings, collaborators, reviews }
}

export function getInitialReviews(): StoredReview[] {
  return []
}

const globalForDb = globalThis as unknown as {
  dreamFrameDb?: DatabaseSchema
}

const TMP_FILE = path.join('/tmp', 'dreamframe-db.json')

export function readDatabase(): DatabaseSchema {
  // 1. Cache mémoire global (instantané et réactif dans l'instance)
  if (globalForDb.dreamFrameDb && globalForDb.dreamFrameDb.products && globalForDb.dreamFrameDb.products.length > 0) {
    return globalForDb.dreamFrameDb
  }

  // 2. Essai fichier /tmp (accessible en écriture sur Vercel Serverless)
  try {
    if (fs.existsSync(TMP_FILE)) {
      const data = fs.readFileSync(TMP_FILE, 'utf-8')
      const parsed: DatabaseSchema = JSON.parse(data)
      if (parsed && parsed.products && parsed.products.length > 0) {
        if (!parsed.reviews) parsed.reviews = []
        globalForDb.dreamFrameDb = parsed
        return parsed
      }
    }
  } catch {}

  // 3. Essai fichier local du dépôt
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8')
      const parsed: DatabaseSchema = JSON.parse(data)
      if (parsed && parsed.products && parsed.products.length > 0) {
        if (!parsed.reviews) parsed.reviews = []
        globalForDb.dreamFrameDb = parsed
        return parsed
      }
    }
  } catch (err) {
    console.warn('Error reading local JSON db:', err)
  }

  const initial = getInitialDatabase()
  writeDatabase(initial)
  return initial
}

const LIVE_BLOB_DB_URL = 'https://brbisdc22g6rfsvd.public.blob.vercel-storage.com/dreamframe-db-live.json'

let lastBlobSyncTime = 0
const BLOB_SYNC_GRACE_MS = 2500

export async function syncDatabaseWithCloud(): Promise<DatabaseSchema> {
  // Fast-path: return in-memory cache if synchronized recently
  if (globalForDb.dreamFrameDb && Date.now() - lastBlobSyncTime < BLOB_SYNC_GRACE_MS) {
    return globalForDb.dreamFrameDb
  }

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN
  if (blobToken && !blobToken.includes('CHANGE_ME')) {
    try {
      const res = await fetch(LIVE_BLOB_DB_URL, { cache: 'no-store' })
      if (res.ok) {
        const parsed = await res.json()
        if (parsed && Array.isArray(parsed.products) && parsed.products.length > 0) {
          if (!parsed.reviews) parsed.reviews = []
          globalForDb.dreamFrameDb = parsed
          lastBlobSyncTime = Date.now()
          try {
            fs.writeFileSync(TMP_FILE, JSON.stringify(parsed, null, 2), 'utf-8')
          } catch {}
          return parsed
        }
      }
    } catch (err: any) {
      console.warn('Could not sync DB from Vercel Blob:', err.message)
    }
  }
  return readDatabase()
}

export async function writeDatabaseAsync(db: DatabaseSchema): Promise<void> {
  writeDatabase(db)
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN
  if (blobToken && !blobToken.includes('CHANGE_ME')) {
    try {
      const { put } = await import('@vercel/blob')
      await put('dreamframe-db-live.json', JSON.stringify(db, null, 2), {
        access: 'public',
        addRandomSuffix: false,
      })
    } catch (err: any) {
      console.warn('writeDatabaseAsync Blob error:', err.message)
    }
  }
}

export function writeDatabase(db: DatabaseSchema): void {
  lastBlobSyncTime = 0
  // 1. Mettre à jour le cache mémoire global
  globalForDb.dreamFrameDb = db

  // 2. Écrire dans /tmp (toujours autorisé sur Vercel Serverless)
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(db, null, 2), 'utf-8')
  } catch (err) {
    // ignore
  }

  // 3. Écrire dans le fichier local (développement local)
  try {
    const dir = path.dirname(DATA_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8')
  } catch (err) {
    // ignore EROFS en production serverless
  }

  // 4. Synchronisation Vercel Blob en arrière-plan
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN
  if (blobToken && !blobToken.includes('CHANGE_ME')) {
    import('@vercel/blob').then(({ put }) => {
      put('dreamframe-db-live.json', JSON.stringify(db, null, 2), {
        access: 'public',
        addRandomSuffix: false,
      }).catch((e) => console.warn('Background Blob put error:', e.message))
    }).catch(() => {})
  }
}

// ─── Fonctions CRUD de Haut Niveau pour l'Admin ──────────────────────────────

export function getAllProducts(): StoredProduct[] {
  const db = readDatabase()
  return db.products
}

export function getProductById(id: string): StoredProduct | undefined {
  const db = readDatabase()
  return db.products.find((p) => p.id === id || p.slug === id)
}

export function addProduct(product: Omit<StoredProduct, 'id' | 'createdAt'>): StoredProduct {
  const db = readDatabase()
  const newProduct: StoredProduct = {
    ...product,
    id: `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  db.products.unshift(newProduct)
  writeDatabase(db)
  return newProduct
}

export function updateProduct(id: string, updates: Partial<StoredProduct>): StoredProduct | null {
  const db = readDatabase()
  const index = db.products.findIndex((p) => p.id === id || p.slug === id)
  
  if (index === -1) {
    // Si absent du json persistant, récupérer depuis MOCK_PRODUCTS et créer
    const mock = MOCK_PRODUCTS.find((p) => p.id === id || p.slug === id)
    if (mock) {
      const newProduct: StoredProduct = {
        id: mock.id,
        slug: mock.slug,
        name: mock.name,
        brand: mock.brand,
        description: mock.description,
        price: mock.price,
        era: mock.era || 'MODERN',
        year: mock.year || 2023,
        isActive: mock.isActive,
        isFeatured: mock.isFeatured,
        images: mock.images,
        stock: mock.variants?.[0]?.stock ?? 10,
        stockAlert: mock.variants?.[0]?.stockAlert ?? 3,
        sku: mock.variants?.[0]?.sku ?? `DF-${mock.slug}`,
        ...updates,
        createdAt: updates.createdAt ?? new Date().toISOString(),
      }
      db.products.unshift(newProduct)
      writeDatabase(db)
      return newProduct
    }
    return null
  }

  db.products[index] = { ...db.products[index], ...updates }
  writeDatabase(db)
  return db.products[index]
}

export function deleteProduct(id: string): boolean {
  const db = readDatabase()
  const initialLen = db.products.length
  db.products = db.products.filter((p) => p.id !== id && p.slug !== id)
  writeDatabase(db)
  return db.products.length < initialLen
}

export async function addProductAsync(product: Omit<StoredProduct, 'id' | 'createdAt'>): Promise<StoredProduct> {
  const added = addProduct(product)
  await writeDatabaseAsync(readDatabase())
  return added
}

export async function updateProductAsync(id: string, updates: Partial<StoredProduct>): Promise<StoredProduct | null> {
  const updated = updateProduct(id, updates)
  if (updated) {
    await writeDatabaseAsync(readDatabase())
  }
  return updated
}

export async function deleteProductAsync(id: string): Promise<boolean> {
  const deleted = deleteProduct(id)
  if (deleted) {
    await writeDatabaseAsync(readDatabase())
  }
  return deleted
}

export function adjustProductStock(productIdOrVariantId: string, delta: number, note?: string): number {
  const db = readDatabase()
  const product = db.products.find(
    (p) => p.id === productIdOrVariantId || p.sku === productIdOrVariantId
  )
  if (!product) return 0
  product.stock = Math.max(0, product.stock + delta)

  // Enregistrer le mouvement
  if (!db.movements) db.movements = []
  db.movements.unshift({
    id: `mov-${Date.now()}`,
    variantId: product.id,
    sku: product.sku,
    productName: product.name,
    brand: product.brand,
    quantity: delta,
    type: delta > 0 ? 'RESTOCK' : 'MANUAL_ADJUSTMENT',
    reason: note || (delta > 0 ? 'Réapprovisionnement atelier' : 'Correction manuelle'),
    createdAt: new Date().toISOString(),
  })

  writeDatabase(db)
  return product.stock
}

export function getAllMovements(): StoredStockMovement[] {
  const db = readDatabase()
  return db.movements || []
}

export function getAllOrders(): StoredOrder[] {
  const db = readDatabase()
  return db.orders || []
}

export function createOrder(orderData: Omit<StoredOrder, 'id' | 'createdAt'>): StoredOrder {
  const db = readDatabase()
  const newOrder: StoredOrder = {
    ...orderData,
    id: `ord-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  db.orders.unshift(newOrder)
  writeDatabase(db)
  return newOrder
}

export function getOrderById(id: string): StoredOrder | undefined {
  const db = readDatabase()
  return db.orders.find((o) => o.id === id || o.orderNumber === id)
}

export function updateOrderStatus(
  orderId: string,
  status: StoredOrder['status'],
  extra?: { trackingNumber?: string; carrier?: string; internalNote?: string }
): StoredOrder | null {
  const db = readDatabase()
  const order = db.orders.find((o) => o.id === orderId)
  if (!order) return null

  order.status = status
  if (extra?.trackingNumber) order.trackingNumber = extra.trackingNumber
  if (extra?.carrier) order.carrier = extra.carrier
  if (extra?.internalNote) order.internalNote = extra.internalNote

  writeDatabase(db)
  return order
}

export async function createOrderAsync(orderData: Omit<StoredOrder, 'id' | 'createdAt'>): Promise<StoredOrder> {
  const order = createOrder(orderData)
  await writeDatabaseAsync(readDatabase())
  return order
}

export async function updateOrderStatusAsync(
  orderId: string,
  status: StoredOrder['status'],
  extra?: { trackingNumber?: string; carrier?: string; internalNote?: string }
): Promise<StoredOrder | null> {
  const order = updateOrderStatus(orderId, status, extra)
  if (order) {
    await writeDatabaseAsync(readDatabase())
  }
  return order
}

export function getSettings(): StoredSettings {
  const db = readDatabase()
  return db.settings
}

export function updateSettings(settings: Partial<StoredSettings>): StoredSettings {
  const db = readDatabase()
  db.settings = { ...db.settings, ...settings }
  writeDatabase(db)
  return db.settings
}

export async function updateSettingsAsync(settings: Partial<StoredSettings>): Promise<StoredSettings> {
  const updated = updateSettings(settings)
  await writeDatabaseAsync(readDatabase())
  return updated
}

export function getCollaborators(): StoredCollaborator[] {
  const db = readDatabase()
  if (!db.collaborators || db.collaborators.length === 0) {
    db.collaborators = [
      {
        id: 'collab-1',
        name: 'Morgan',
        email: 'admin@dreamframe.fr',
        role: 'ADMIN',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'collab-2',
        name: 'Frère (Associé)',
        email: 'contact@dreamframe.fr',
        role: 'ADMIN',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      },
    ]
    writeDatabase(db)
  }
  return db.collaborators
}

export function addCollaborator(collab: Omit<StoredCollaborator, 'id' | 'createdAt'>): StoredCollaborator {
  const db = readDatabase()
  if (!db.collaborators) db.collaborators = []
  const newCollab: StoredCollaborator = {
    ...collab,
    id: `collab-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  db.collaborators.push(newCollab)
  writeDatabase(db)
  return newCollab
}

export function deleteCollaborator(id: string): boolean {
  const db = readDatabase()
  if (!db.collaborators) return false
  const initialLen = db.collaborators.length
  db.collaborators = db.collaborators.filter((c) => c.id !== id)
  writeDatabase(db)
  return db.collaborators.length < initialLen
}

export function clearMockOrders(): void {
  const db = readDatabase()
  db.orders = db.orders.filter((o) => !o.id.startsWith('ord-j') && !o.id.startsWith('ord-mock'))
  writeDatabase(db)
}

// ─── CRUD Avis Clients (Reviews) ─────────────────────────────────────────────

export function getAllReviews(options?: {
  productSlug?: string
  productId?: string
  status?: 'APPROVED' | 'PENDING'
}): StoredReview[] {
  const db = readDatabase()
  let list = db.reviews || []

  if (options?.status) {
    list = list.filter((r) => r.status === options.status)
  }
  if (options?.productSlug) {
    list = list.filter((r) => !r.productSlug || r.productSlug === options.productSlug)
  }
  if (options?.productId) {
    list = list.filter((r) => !r.productId || r.productId === options.productId)
  }

  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function addReview(review: Omit<StoredReview, 'id' | 'createdAt'>): StoredReview {
  const db = readDatabase()
  if (!db.reviews) db.reviews = []

  const newReview: StoredReview = {
    ...review,
    id: `rev-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }

  db.reviews.unshift(newReview)
  writeDatabase(db)
  return newReview
}

export function updateReviewStatus(id: string, status: 'APPROVED' | 'PENDING'): StoredReview | null {
  const db = readDatabase()
  if (!db.reviews) return null
  const review = db.reviews.find((r) => r.id === id)
  if (!review) return null
  review.status = status
  writeDatabase(db)
  return review
}

export function deleteReview(id: string): boolean {
  const db = readDatabase()
  if (!db.reviews) return false
  const initialLen = db.reviews.length
  db.reviews = db.reviews.filter((r) => r.id !== id)
  writeDatabase(db)
  return db.reviews.length < initialLen
}

export async function addReviewAsync(review: Omit<StoredReview, 'id' | 'createdAt'>): Promise<StoredReview> {
  const added = addReview(review)
  await writeDatabaseAsync(readDatabase())
  return added
}

export async function updateReviewStatusAsync(id: string, status: 'APPROVED' | 'PENDING'): Promise<StoredReview | null> {
  const updated = updateReviewStatus(id, status)
  if (updated) {
    await writeDatabaseAsync(readDatabase())
  }
  return updated
}

export async function deleteReviewAsync(id: string): Promise<boolean> {
  const deleted = deleteReview(id)
  if (deleted) {
    await writeDatabaseAsync(readDatabase())
  }
  return deleted
}

