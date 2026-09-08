export type ConfigOption = {
  id: string
  key: string
  name: string
  subtitle?: string
  description?: string
  priceDeltaCents: number
  imageUrl?: string
  texturePattern?: string
  aspectRatio?: string
  scaleFactor?: number
}

export type ConfiguratorDataSet = {
  dimensions: ConfigOption[]
  finishes: ConfigOption[]
  cars: ConfigOption[]
  scales: ConfigOption[]
}

export const CONFIGURATOR_DATA: ConfiguratorDataSet = {
  dimensions: [
    {
      id: 'dim-square',
      key: '25x25',
      name: 'Carré Minimal',
      subtitle: '25 × 25 cm',
      description: 'Proportions compactes. Idéal en diptyque ou triptyque.',
      priceDeltaCents: 0,
      aspectRatio: '1 / 1',
    },
    {
      id: 'dim-gallery',
      key: '30x40',
      name: 'Classique Galerie',
      subtitle: '30 × 40 cm (A4)',
      description: 'L’équilibre muséal parfait. Mise en scène maîtresse.',
      priceDeltaCents: 2000, // +20 €
      aspectRatio: '3 / 4',
    },
    {
      id: 'dim-panorama',
      key: '50x70',
      name: 'Panorama Grand Format',
      subtitle: '50 × 70 cm',
      description: 'Présence murale imposante pour salon ou bureau de direction.',
      priceDeltaCents: 6000, // +60 €
      aspectRatio: '5 / 7',
    },
  ],

  finishes: [
    {
      id: 'finish-oak',
      key: 'black-oak',
      name: 'Chêne Noir Mat',
      subtitle: 'Bois texturé & profond',
      description: 'Veinage naturel du chêne préservé sous une finition noire satinée.',
      priceDeltaCents: 0,
      texturePattern: 'bg-[#121211] border-[#22211E]',
    },
    {
      id: 'finish-aluminum',
      key: 'brushed-aluminum',
      name: 'Aluminium Brossé',
      subtitle: 'Reflets métalliques froids',
      description: 'Châssis en aluminium usiné à grain micrométrique, inspiré des suspensions de course.',
      priceDeltaCents: 2500, // +25 €
      texturePattern: 'bg-[#1E1E1C] border-[#363430]',
    },
    {
      id: 'finish-carbon',
      key: 'raw-carbon',
      name: 'Fibre de Carbone',
      subtitle: 'Tissage sergé 3K réel',
      description: 'Véritable texture carbone vernie mat, directement issue du monde des supercars.',
      priceDeltaCents: 4500, // +45 €
      texturePattern: 'bg-[#0E0E0D] border-[#2A2926]',
    },
    {
      id: 'finish-white',
      key: 'satin-white',
      name: 'Blanc Céleste',
      subtitle: 'Pureté architecturale',
      description: 'Laque blanche cuite au four. Contraste saisissant sur murs sombres.',
      priceDeltaCents: 1500, // +15 €
      texturePattern: 'bg-[#EAE6DF] text-obsidian border-[#CBC6BC]',
    },
  ],

  cars: [
    {
      id: 'car-f40',
      key: 'ferrari-f40',
      name: 'Ferrari F40',
      subtitle: 'Maranello · 1987',
      description: 'Le dernier chef-d’œuvre validé par Enzo Ferrari. V8 Bi-turbo et aileron mythique.',
      priceDeltaCents: 3000,
      imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 'car-gt3rs',
      key: 'porsche-gt3rs',
      name: 'Porsche 911 GT3 RS',
      subtitle: 'Weissach · 2023',
      description: 'Aérodynamique active et rupteur à 9 000 tr/min. La précision absolue.',
      priceDeltaCents: 2500,
      imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 'car-revuelto',
      key: 'lamborghini-revuelto',
      name: 'Lamborghini Revuelto',
      subtitle: 'Sant’Agata · 2024',
      description: 'Le renouveau du V12 atmosphérique hybride. Lignes furtives et féroces.',
      priceDeltaCents: 3500,
      imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 'car-m4csl',
      key: 'bmw-m4csl',
      name: 'BMW M4 CSL',
      subtitle: 'Munich · 2022',
      description: 'Allègement extrême, feux laser jaunes et esprit compétition hérité du CSL.',
      priceDeltaCents: 1500,
      imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1200&auto=format&fit=crop',
    },
  ],

  scales: [
    {
      id: 'scale-164',
      key: '1-64',
      name: '1 : 64',
      subtitle: 'Bijou discret',
      description: 'Miniature joaillière d’une finesse extrême. Laisse respirer le passe-partout.',
      priceDeltaCents: 0,
      scaleFactor: 0.55,
    },
    {
      id: 'scale-143',
      key: '1-43',
      name: '1 : 43',
      subtitle: 'Équilibre collector',
      description: 'L’échelle de prédilection des maisons d’art et des passionnés exigeants.',
      priceDeltaCents: 1500,
      scaleFactor: 0.78,
    },
    {
      id: 'scale-124',
      key: '1-24',
      name: '1 : 24',
      subtitle: 'Présence sculpturale',
      description: 'Volume spectaculaire. Chaque écope, jante et aileron ressort avec autorité.',
      priceDeltaCents: 3500,
      scaleFactor: 0.95,
    },
    {
      id: 'scale-118',
      key: '1-18',
      name: '1 : 18',
      subtitle: 'Échelle Reine · Ultra Détaillée',
      description: 'Grand format d’exception. Portes ouvrantes, moteur et intérieur visibles.',
      priceDeltaCents: 5500,
      scaleFactor: 1.15,
    },
  ],
}
