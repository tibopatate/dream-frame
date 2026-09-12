import { PageTreeDocument, PageSection } from './types'

export const DEFAULT_PAGE_SECTIONS: PageSection[] = [
  {
    id: 'sec-hero',
    type: 'hero',
    name: "Hero Showroom d'Exception",
    settings: {
      badgeText: "L'ART DE CAPTURER",
      title: "L'EXCEPTIONNEL",
      subtitle: "DES VOITURES DE LÉGENDE, ENCADRÉES POUR L'ÉTERNITÉ.",
      priceText: '',
      primaryBtnText: 'Visiter notre galerie',
      primaryBtnLink: '#collection',
      secondaryBtnText: 'Notre collection passionnée',
      secondaryBtnLink: '/catalogue',
      bgImage: '',
      bgVideo: '',
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
    id: 'sec-interiors',
    type: 'interiors',
    name: 'Laissez-les sublimer votre pièce',
    settings: {
      title: 'Laissez les sublimer votre pièce',
      desc: 'Découvrez comment nos cadres d’exception s’intègrent parfaitement dans tout type d’intérieur.',
    },
  },
  {
    id: 'sec-about',
    type: 'about',
    name: 'Qui sommes nous',
    settings: {
      title: 'Qui sommes-nous ?',
      desc: 'Dream Frame est né d\'une passion commune pour l\'automobile et l\'artisanat français. Nous concevons et assemblons chaque cadre à la main dans notre atelier, avec une exigence de qualité absolue.',
    },
  },
  {
    id: 'sec-faq',
    type: 'faq',
    name: 'Foire Aux Questions',
    settings: {
      title: 'Questions Fréquentes',
      q1: 'Quels sont les délais de livraison ?',
      a1: 'Chaque cadre étant assemblé à la main à la demande, il faut compter 4 à 6 jours ouvrés pour la fabrication et l\'expédition.',
      q2: 'Comment s\'alimente le rétroéclairage LED ?',
      a2: 'Nos cadres sont fournis avec une batterie discrète rechargeable par USB-C, garantissant un rendu propre sans câble apparent.',
      q3: 'Puis-je commander un modèle spécifique ?',
      a3: 'Oui, notre atelier sur-mesure vous permet de configurer le cadre avec le véhicule de votre choix.',
    },
  },
]

export const DEFAULT_PAGE_DOCUMENT: PageTreeDocument = {
  schemaVersion: 1,
  updatedAt: new Date().toISOString(),
  sections: DEFAULT_PAGE_SECTIONS,
  elements: [],
}
