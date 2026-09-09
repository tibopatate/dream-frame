import { PageTreeDocument, PageSection } from './types'

export const DEFAULT_PAGE_SECTIONS: PageSection[] = [
  {
    id: 'sec-hero',
    type: 'hero',
    name: 'Hero Showroom Bugatti Chiron',
    settings: {
      badgeText: "L'ART DE CAPTURER",
      title: "L'EXCEPTIONNEL",
      subtitle: "DES VOITURES DE LÉGENDE, ENCADRÉES POUR L'ÉTERNITÉ.",
      priceText: '',
      primaryBtnText: 'Visiter notre galerie',
      primaryBtnLink: '#collection',
      secondaryBtnText: 'Notre collection passionnée',
      secondaryBtnLink: '/catalogue',
      bgImage: '/images/hero-chiron-showroom.jpg',
      zoomAnimation: false,
      showBrands: false,
      showReassuranceBadges: false,
    },
  },
  {
    id: 'sec-collection',
    type: 'collection',
    name: 'Notre Collection (Galerie d\'Art Automobile)',
    settings: {
      badge: '',
      title: 'NOTRE COLLECTION',
      startingPrice: '49,99 €',
      category: 'ALL',
      limit: 4,
    },
  },
  {
    id: 'sec-craft',
    type: 'craft',
    name: 'Savoir-Faire (Anatomie 5 Couches)',
    settings: {
      badge: 'Exigence Artisanale',
      title: "L'Anatomie d'une Pièce d'Exception",
      desc: '5 couches de matériaux nobles minutieusement assemblées dans notre atelier en France.',
      layer1Title: "Papier d'Art 310g",
      layer1Desc: 'Canson Rag Photographique pur coton, résistant plus de 100 ans.',
      layer2Title: 'Découpe Laser Micron',
      layer2Desc: 'Ailerons, jantes et galbes découpés sans aucune bavure.',
      layer3Title: 'Passe-Partout Biseauté',
      layer3Desc: 'Biseau 45° taillé à la main dans un carton de conservation sans acide.',
      layer4Title: 'Module LED 3000K',
      layer4Desc: 'Éclairage blanc chaud basse consommation pour sublimer la silhouette.',
      layer5Title: 'Vitrage Acrylique HD',
      layer5Desc: 'Transmittance optique 99,2% et cadre aluminium anodisé noir.',
    },
  },
  {
    id: 'sec-reassurance',
    type: 'reassurance',
    name: 'Engagements & Réassurance',
    settings: {
      item1Title: 'Livraison 100% Offerte',
      item1Desc: 'Colissimo Suivi 48h en France avec emballage renforcé anti-choc.',
      item2Title: 'Droit de Rétractation 14 Jours',
      item2Desc: 'Retour simple et sécurisé conformément à la législation française.',
      item3Title: 'LED & Fixations Incluses',
      item3Desc: 'Chaque pièce arrive prête à poser sur un meuble ou à accrocher au mur.',
      item4Title: 'Manufacture & Contrôle Unitaire',
      item4Desc: 'Chaque cadre est inspecté individuellement avant son expédition.',
    },
  },
  {
    id: 'sec-custom',
    type: 'custom_atelier',
    name: 'Atelier Sur-Mesure (Invitation)',
    settings: {
      badge: 'Configuration Personnalisée',
      title: 'Un modèle précis ? Une échelle spécifique ?',
      desc: 'Composez votre cadre idéal : dimensions (A4, A3, A2), modèle automobile et échelle miniature. Notre configurateur live vous permet de visualiser votre projet instantanément.',
      btnText: "Accéder à l'Atelier Sur-Mesure",
      btnLink: '/configurateur',
    },
  },
]

export const DEFAULT_PAGE_DOCUMENT: PageTreeDocument = {
  schemaVersion: 1,
  updatedAt: new Date().toISOString(),
  sections: DEFAULT_PAGE_SECTIONS,
  elements: [],
}
