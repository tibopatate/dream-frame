import { PrismaClient } from '@prisma/client'
import { slugify } from '../lib/utils'

const prisma = new PrismaClient()

const BRANDS = [
  'Porsche', 'Ferrari', 'Lamborghini', 'BMW', 'Audi',
  'Mercedes', 'Nissan', 'Bugatti', 'McLaren', 'Pagani',
  'Koenigsegg', 'Aston Martin', 'Bentley', 'Maserati',
  'Alfa Romeo', 'Honda', 'Mitsubishi', 'Subaru', 'Ford', 'Chevrolet',
]

const MODELS: Record<string, { model: string; description: string }> = {
  Porsche: {
    model: '911 GT3 RS (992)',
    description: "Le summum de la performance atmosphérique. Le 911 GT3 RS 992 incarne 60 ans de savoir-faire Porsche sur circuit, immortalisé en relief 3D sous verre HD avec éclairage LED ambiant.",
  },
  Ferrari: {
    model: 'SF90 Stradale',
    description: "La puissance hybride de Maranello : 1 000 ch sous un capot d'exception. La Ferrari SF90 Stradale en miniature 1:24 sur fond carbone, encadrée avec élégance.",
  },
  Lamborghini: {
    model: 'Revuelto V12',
    description: "L'héritière des V12 légendaires de Sant'Agata Bolognese. Le Lamborghini Revuelto en cadre 3D rétro-éclairé — une pièce d'art pour les passionnés d'absolu.",
  },
  BMW: {
    model: 'M4 CSL (G82)',
    description: "La référence absolue du Motorsport bavarois. Le BMW M4 CSL en relief 3D avec détails fibre carbone authentiques — la quintessence de la performance road-legal.",
  },
  Audi: {
    model: 'R8 V10 Performance',
    description: "Le dernier V10 atmosphérique d'Ingolstadt, un mythe moderne. L'Audi R8 V10 Performance en miniature sous vitrine acrylique HD.",
  },
  Mercedes: {
    model: 'AMG GT R "Green Hell"',
    description: "La bête née au Nürburgring. La Mercedes-AMG GT R en Green Hell Magno encadrée en 3D — chaque détail, du diffuseur aux étriers, sculpté avec précision.",
  },
  Nissan: {
    model: 'GT-R NISMO (R35)',
    description: "Godzilla. Deux mots qui résument des décennies de domination. Le Nissan GT-R NISMO R35 en cadre 3D, hommage au tueur de supercars japonais par excellence.",
  },
  Bugatti: {
    model: 'Chiron Super Sport',
    description: "Dix-neuf cents chevaux, la vitesse sans limite. La Bugatti Chiron Super Sport en cadre de luxe avec accents dorés — pour ceux qui ne font aucun compromis.",
  },
  McLaren: {
    model: '720S Spider',
    description: "Aérodynamisme et légèreté à l'état pur. La McLaren 720S Spider en relief 3D sous verre HD — l'hypercar britannique dans toute sa splendeur.",
  },
  Pagani: {
    model: 'Huayra Tricolore',
    description: "Un chef-d'œuvre d'artisanat italien. La Pagani Huayra Tricolore, pièce unique reproduite en miniature 1:24 sous cadre vitré de collection.",
  },
  Koenigsegg: {
    model: 'Agera RS',
    description: "La voiture de production la plus rapide du monde. La Koenigsegg Agera RS en cadre 3D rétro-éclairé — l'audace suédoise encadrée pour l'éternité.",
  },
  'Aston Martin': {
    model: 'Valkyrie AMR Pro',
    description: "Une F1 pour route homologuée. L'Aston Martin Valkyrie AMR Pro en miniature sous verre acrylique — l'alliance ultime entre tradition britannique et technologie RedBull Racing.",
  },
  Bentley: {
    model: 'Continental GT Speed',
    description: "Le Grand Tourisme par excellence. La Bentley Continental GT Speed en cadre 3D premium — l'élégance britannique à son paroxysme.",
  },
  Maserati: {
    model: 'MC20 Cielo',
    description: "Le renouveau du trident de Modène. La Maserati MC20 Cielo en relief 3D sous verre HD — la renaissance d'une icône italienne.",
  },
  'Alfa Romeo': {
    model: '8C Competizione',
    description: "La beauté italienne absolue. L'Alfa Romeo 8C Competizione en miniature sous cadre vitré — un design Pininfarina immortalisé en 3D.",
  },
  Honda: {
    model: 'NSX Type R (NA1)',
    description: "La légende japonaise née avec Ayrton Senna. La Honda NSX Type R en cadre 3D — le génie ingéniérique nippon à l'état pur.",
  },
  Mitsubishi: {
    model: 'Lancer Evolution X FQ-400',
    description: "Le roi des routes mouillées, l'icône du WRC. La Mitsubishi Lancer Evolution X FQ-400 en relief 3D — la culture JDM sublimée.",
  },
  Subaru: {
    model: 'Impreza 22B STi',
    description: "Trois cents exemplaires seulement pour le monde entier. La Subaru Impreza 22B STi en miniature — une pièce de collection rare encadrée avec soin.",
  },
  Ford: {
    model: 'GT (2022)',
    description: "L'Américaine qui a humilié Ferrari au Mans. La Ford GT 2022 en cadre 3D rétro-éclairé — la revanche d'une nation encadrée pour l'éternité.",
  },
  Chevrolet: {
    model: 'Corvette C8 Z06',
    description: "La Corvette Mid-Engine, nouvelle génération d'une légende. La Chevrolet Corvette C8 Z06 en miniature 1:24 sous verre HD.",
  },
}

// Images placeholder Unsplash en attendant le shooting (toutes automobiles premium)
const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=1200&auto=format&fit=crop',
]

async function main() {
  console.log('🌱 Seed Dream Frame — début...')

  // 1. Créer l'admin
  const admin = await prisma.user.upsert({
    where: { email: 'morgan@dreamframe.fr' },
    update: {},
    create: {
      email: 'morgan@dreamframe.fr',
      name: 'Morgan',
      role: 'ADMIN',
    },
  })
  console.log(`✅ Admin créé: ${admin.email}`)

  // 2. Créer les 20 produits
  for (let i = 0; i < BRANDS.length; i++) {
    const brand = BRANDS[i]
    const { model, description } = MODELS[brand]
    const name = `${brand} ${model} — Cadre 3D`
    const slug = slugify(`${brand}-${model}`)
    const sku = `DF-${brand.toUpperCase().replace(/\s/g, '-').slice(0, 6)}-${String(i + 1).padStart(3, '0')}`
    const image = PLACEHOLDER_IMAGES[i % PLACEHOLDER_IMAGES.length]
    const isFeatured = i < 4 // Les 4 premiers sont featured

    const product = await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        name,
        brand,
        description,
        price: 40.00,
        isActive: true,
        isFeatured,
        images: [image],
        variants: {
          create: {
            sku,
            stock: 10,
            stockAlert: 5,
          },
        },
      },
    })
    console.log(`✅ Produit: ${product.name} (slug: ${product.slug})`)
  }

  // 3. Compteurs
  await prisma.orderCounter.upsert({
    where: { year: new Date().getFullYear() },
    update: {},
    create: { year: new Date().getFullYear(), lastNumber: 0 },
  })
  await prisma.invoiceCounter.upsert({
    where: { year: new Date().getFullYear() },
    update: {},
    create: { year: new Date().getFullYear(), lastNumber: 0 },
  })

  // 4. Settings par défaut
  await prisma.setting.upsert({
    where: { key: 'shipping' },
    update: {},
    create: {
      key: 'shipping',
      value: { freeThresholdEur: 80, defaultCostEur: 5.9, carrier: 'Colissimo' },
    },
  })

  console.log('🎉 Seed terminé — 20 produits Dream Frame créés !')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
