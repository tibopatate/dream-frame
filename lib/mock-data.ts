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
    id: 'cmtz0fwum0004l904jcdzyop3',
    slug: 'porsche-918-spyder',
    name: 'Porsche 918 Spyder (2015)',
    brand: 'Porsche',
    era: 'MODERN',
    year: 2015,
    description: "Le chef-d'œuvre hybride de Stuttgart en relief 3D sous vitrage acrylique haute définition avec rétroéclairage LED intégré. Fait main en France.",
    price: 49.90,
    isActive: true,
    isFeatured: true,
    images: [
      'https://brbisdc22g6rfsvd.public.blob.vercel-storage.com/1000074340-Yht6vWOelLNIAQ3My66qMboSP0Ngou.jpg',
      'https://brbisdc22g6rfsvd.public.blob.vercel-storage.com/1000074312-ciQH7SC8q27Heuto2l5ilQDjY9JeVc.jpg',
      'https://brbisdc22g6rfsvd.public.blob.vercel-storage.com/1000074358-5tsv2nbhQRbBVCg4JSN9bHlshEXR0J.jpg',
    ],
    variants: [{ id: 'var-porsche-918', sku: 'DF-PORSCHE-918', stock: 5, stockAlert: 2 }],
  },
  {
    id: 'cmtz0dodt0002l904o55hk2mt',
    slug: 'audi-r8',
    name: 'Audi R8 V10 Performance',
    brand: 'Audi',
    era: 'MODERN',
    year: 2018,
    description: "L'icône atmosphérique d'Ingolstadt immortalisée en cadre d'art 3D sous vitrage d'exception avec rétroéclairage LED.",
    price: 49.90,
    isActive: true,
    isFeatured: true,
    images: [
      'https://brbisdc22g6rfsvd.public.blob.vercel-storage.com/1000074344-UFfkSw76hlBDOHG9V2f1fDVF1hFUR6.jpg',
      'https://brbisdc22g6rfsvd.public.blob.vercel-storage.com/1000074290-wVOcwMFdQYJVOF7yQMvz3lPDfmQArn.jpg',
      'https://brbisdc22g6rfsvd.public.blob.vercel-storage.com/1000074356-yiGQT4s3TBJgVUyIKAvhFPQB3cOw0x.jpg',
      'https://brbisdc22g6rfsvd.public.blob.vercel-storage.com/1000074331-YABIiCHffzvwezXPpoi6aknt5cUKod.jpg',
    ],
    variants: [{ id: 'var-audi-r8', sku: 'DF-AUDI-R8', stock: 5, stockAlert: 2 }],
  },
  {
    id: 'cmtyzzzuk0000l904n1nlhhu4',
    slug: 'ferrari-f40-1987',
    name: 'Ferrari F40 (1987) — Cadre 3D',
    brand: 'Ferrari',
    era: 'VINTAGE',
    year: 1987,
    description: "Le mythe intemporel de Maranello en cadre d'artisanat d'exception. V8 Biturbo en relief 3D sous vitrage acrylique haute transparence.",
    price: 49.90,
    isActive: true,
    isFeatured: true,
    images: [
      'https://brbisdc22g6rfsvd.public.blob.vercel-storage.com/1000074241-wgRZ3XxvHtAcH2NoaABtL3K0tnlXFL.jpg',
      'https://brbisdc22g6rfsvd.public.blob.vercel-storage.com/1000074219-CwVVnGj3cqltgmgfmnU553ytSiYGfI.jpg',
      'https://brbisdc22g6rfsvd.public.blob.vercel-storage.com/1000074229-TGotGMk3IfQt1XYoXgIZSZaenYANpf.jpg',
      'https://brbisdc22g6rfsvd.public.blob.vercel-storage.com/WhatsApp%20Video%202026-09-08%20at%2014.08.39-lb02fuGqPolwMGKvHZMMtScI5hOxc2.mp4',
    ],
    variants: [{ id: 'var-f40-std', sku: 'DF-FERRARI-F40-STD', stock: 5, stockAlert: 2 }],
  },
  {
    id: 'cmtyjxs970000i9041p1iabwp',
    slug: 'ferrari-laferrari',
    name: 'Ferrari LaFerrari — Cadre Moyen Collector',
    brand: 'Ferrari',
    era: 'MODERN',
    year: 2013,
    description: "L'hypercar hybride de Maranello en Format Moyen d'Atelier 30 × 40 cm (Échelle 1:24). Lignes sculptées sous vitrage acrylique haute clarté avec éclairage LED.",
    price: 149.90,
    isActive: true,
    isFeatured: true,
    images: [
      'https://brbisdc22g6rfsvd.public.blob.vercel-storage.com/1000074237-DLrB8wZrK6F91n0aiM5MMjwcwtvEuI.jpg',
      'https://brbisdc22g6rfsvd.public.blob.vercel-storage.com/1000074211-n6Iutq4tW8tjyXGxKWldSGFLRPpdgN.jpg',
    ],
    variants: [{ id: 'var-laferrari', sku: 'DF-FERRARI-LAFERRARI', stock: 5, stockAlert: 2 }],
  },
]

