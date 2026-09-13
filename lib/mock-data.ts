export interface MockProduct {
  id: string
  slug: string
  name: string
  brand: string
  era: 'VINTAGE' | 'MODERN'
  year: number
  description: string
  price: number // 49.90 € TTC
  isActive: boolean
  isFeatured: boolean
  images: string[]
  variants: {
    id: string
    sku: string
    stock: number
    stockAlert: number
  }[]
}

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: 'fmt-a4-cadre',
    slug: 'cadre-format-10x15cm-dream-frame-officiel',
    name: 'Cadre Format 10×15cm | Dream Frame Officiel',
    brand: 'Dream Frame Atelier',
    era: 'MODERN',
    year: 2024,
    description: "Cadre d'artisanat d'exception au format intime 10 × 15 cm. Finition galerie d'art, vitrage acrylique de précision et rétroéclairage LED ambré 3000K.",
    price: 49.90,
    isActive: true,
    isFeatured: true,
    images: [
      'https://brbisdc22g6rfsvd.public.blob.vercel-storage.com/1000074219-CwVVnGj3cqltgmgfmnU553ytSiYGfI.jpg',
      'https://brbisdc22g6rfsvd.public.blob.vercel-storage.com/1000074229-TGotGMk3IfQt1XYoXgIZSZaenYANpf.jpg',
    ],
    variants: [{ id: 'var-a4-std', sku: 'DF-STANDARD-10X15', stock: 10, stockAlert: 3 }],
  },
  {
    id: 'real-ferrari-moyen',
    slug: 'ferrari-f40-cadre-moyen-collector',
    name: 'Ferrari F40 — Cadre Moyen Collector',
    brand: 'Ferrari',
    era: 'VINTAGE',
    year: 1987,
    description: "Format Moyen d'artisanat 30 × 42 cm. V8 Biturbo sculpté en relief sous vitrage acrylique haute transparence avec module LED ambré 3000K.",
    price: 149.90,
    isActive: true,
    isFeatured: true,
    images: [
      'https://brbisdc22g6rfsvd.public.blob.vercel-storage.com/1000074237-DLrB8wZrK6F91n0aiM5MMjwcwtvEuI.jpg',
      'https://brbisdc22g6rfsvd.public.blob.vercel-storage.com/1000074211-n6Iutq4tW8tjyXGxKWldSGFLRPpdgN.jpg',
    ],
    variants: [{ id: 'var-ferrari-moyen', sku: 'DF-FERRARI-MOYEN-001', stock: 5, stockAlert: 2 }],
  },
  {
    id: 'real-ferrari-f40',
    slug: 'ferrari-f40-1987-cadre-3d',
    name: 'Ferrari F40 (1987) — Grand Cadre Prestige',
    brand: 'Ferrari',
    era: 'VINTAGE',
    year: 1987,
    description: "Le mythe absolu de Maranello en Grand Format d'Exception 50 × 70 cm. V8 Twin-Turbo et aileron légendaire sculptés au millimètre sous vitrage d'exception et rétroéclairage LED ambré.",
    price: 249.90,
    isActive: true,
    isFeatured: true,
    images: [
      'https://brbisdc22g6rfsvd.public.blob.vercel-storage.com/1000074438-NeUYfhCEOmLrJoUn19iHpNsGZZtume.mp4',
      'https://brbisdc22g6rfsvd.public.blob.vercel-storage.com/1000074237-DLrB8wZrK6F91n0aiM5MMjwcwtvEuI.jpg',
    ],
    variants: [{ id: 'var-f40', sku: 'DF-FERRARI-F40', stock: 4, stockAlert: 2 }],
  },
]
