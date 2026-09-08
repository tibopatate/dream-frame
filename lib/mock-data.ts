export interface MockProduct {
  id: string
  slug: string
  name: string
  brand: string
  era: 'VINTAGE' | 'MODERN'
  year: number
  description: string
  price: number // 49.99 € TTC
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
  // ─── LÉGENDES VINTAGE ───────────────────────────────────────────────────────
  {
    id: 'mock-f40',
    slug: 'ferrari-f40-1987-cadre-3d',
    name: 'Ferrari F40 (1987)',
    brand: 'Ferrari',
    era: 'VINTAGE',
    year: 1987,
    description: "Le dernier chef-d’œuvre validé personnellement par Enzo Ferrari. V8 biturbo sauvage, aileron cathédrale légendaire, immortalisé en relief 3D sous vitrine d’exposition avec halo LED ambré.",
    price: 49.99,
    isActive: true,
    isFeatured: true,
    images: ['https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1200&auto=format&fit=crop'],
    variants: [{ id: 'var-f40', sku: 'DF-FERRAR-F40', stock: 6, stockAlert: 2 }],
  },
  {
    id: 'mock-250gto',
    slug: 'ferrari-250-gto-1962-cadre-3d',
    name: 'Ferrari 250 GTO (1962)',
    brand: 'Ferrari',
    era: 'VINTAGE',
    year: 1962,
    description: "L'automobile la plus convoitée et précieuse de l'histoire. Les courbes sculpturales de Sergio Scaglietti sublimées dans un cadre d'ébénisterie noir profond.",
    price: 49.99,
    isActive: true,
    isFeatured: true,
    images: ['https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=1200&auto=format&fit=crop'],
    variants: [{ id: 'var-250gto', sku: 'DF-FERRAR-250GTO', stock: 4, stockAlert: 2 }],
  },
  {
    id: 'mock-300sl',
    slug: 'mercedes-300-sl-papillon-1954-cadre-3d',
    name: 'Mercedes-Benz 300 SL Gullwing (1954)',
    brand: 'Mercedes-Benz',
    era: 'VINTAGE',
    year: 1954,
    description: "Les portes papillon mythiques de la première supercar moderne. Un bijou de technologie des années 50 reproduit avec une précision d’orfèvre.",
    price: 49.99,
    isActive: true,
    isFeatured: false,
    images: ['https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop'],
    variants: [{ id: 'var-300sl', sku: 'DF-MERCED-300SL', stock: 5, stockAlert: 2 }],
  },
  {
    id: 'mock-930turbo',
    slug: 'porsche-911-turbo-3-0-1975-cadre-3d',
    name: 'Porsche 911 Turbo 3.0 « 930 » (1975)',
    brand: 'Porsche',
    era: 'VINTAGE',
    year: 1975,
    description: "L'aileron « queue de baleine », les ailes galbées et le sifflement du turbo. La naissance du mythe 911 Turbo mise en lumière.",
    price: 49.99,
    isActive: true,
    isFeatured: false,
    images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop'],
    variants: [{ id: 'var-930turbo', sku: 'DF-PORSCH-930T', stock: 7, stockAlert: 3 }],
  },

  // ─── SUPERCARS MODERNES ─────────────────────────────────────────────────────
  {
    id: 'mock-sf90',
    slug: 'ferrari-sf90-xx-stradale-cadre-3d',
    name: 'Ferrari SF90 XX Stradale',
    brand: 'Ferrari',
    era: 'MODERN',
    year: 2024,
    description: "1 030 chevaux. La première Ferrari homologuée route issue du programme expérimental XX. Aérodynamique extrême et feux arrière transversaux illuminés.",
    price: 49.99,
    isActive: true,
    isFeatured: true,
    images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop'],
    variants: [{ id: 'var-sf90', sku: 'DF-FERRAR-SF90', stock: 8, stockAlert: 3 }],
  },
  {
    id: 'mock-gt3rs',
    slug: 'porsche-911-gt3-rs-992-cadre-3d',
    name: 'Porsche 911 GT3 RS (992)',
    brand: 'Porsche',
    era: 'MODERN',
    year: 2023,
    description: "Aérodynamisme actif DRS et rupteur strident à 9 000 tr/min. La reine indiscutée de la Nordschleife immortalisée sous verre haute clarté.",
    price: 49.99,
    isActive: true,
    isFeatured: true,
    images: ['https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop'],
    variants: [{ id: 'var-gt3rs', sku: 'DF-PORSCH-GT3RS', stock: 9, stockAlert: 3 }],
  },
  {
    id: 'mock-revuelto',
    slug: 'lamborghini-revuelto-cadre-3d',
    name: 'Lamborghini Revuelto',
    brand: 'Lamborghini',
    era: 'MODERN',
    year: 2024,
    description: "Le hurlement du V12 atmosphérique couplé à trois moteurs électriques. Des arêtes furtives tranchantes sculptées dans le relief 3D.",
    price: 49.99,
    isActive: true,
    isFeatured: false,
    images: ['https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1200&auto=format&fit=crop'],
    variants: [{ id: 'var-revuelto', sku: 'DF-LAMBOR-REVUEL', stock: 5, stockAlert: 2 }],
  },
  {
    id: 'mock-senna',
    slug: 'mclaren-senna-cadre-3d',
    name: 'McLaren Senna',
    brand: 'McLaren',
    era: 'MODERN',
    year: 2020,
    description: "Dédiée à la légende Ayrton Senna. L'appui aérodynamique sculpté par le vent dans la fibre de carbone, mise en scène sous vitrage anti-reflets.",
    price: 49.99,
    isActive: true,
    isFeatured: false,
    images: ['https://images.unsplash.com/photo-1621135802920-133df287f89c?q=80&w=1200&auto=format&fit=crop'],
    variants: [{ id: 'var-senna', sku: 'DF-MCLARE-SENNA', stock: 3, stockAlert: 2 }],
  },
]
