// Configuration centrale des formats et de l'espace dans le cadre Dream Frame

export interface FrameFormatPreset {
  id: string
  name: string
  label: string
  innerSize: string // Taille exacte de l'espace dans le cadre
  price: number // Prix public TTC
  scale: string
  description: string
  isDefault?: boolean
}

export const FRAME_FORMAT_PRESETS: FrameFormatPreset[] = [
  {
    id: 'fmt-standard-10x15',
    name: 'Petit Cadre Standard',
    label: 'Format 10 × 15 cm',
    innerSize: '10 × 15 cm',
    price: 49.90,
    scale: 'Échelle 1:43 Atelier',
    description: "Format intime pour bureau ou chevet. Espace dans le cadre : 10 × 15 cm.",
    isDefault: true,
  },
  {
    id: 'fmt-collector-30x40',
    name: 'Cadre Moyen Collector',
    label: 'Format 30 × 40 cm',
    innerSize: '30 × 40 cm',
    price: 149.90,
    scale: 'Échelle 1:24 Atelier',
    description: "Format de salon par excellence. Espace dans le cadre : 30 × 40 cm.",
    isDefault: false,
  },
  {
    id: 'fmt-prestige-40x50',
    name: 'Grand Cadre Prestige',
    label: 'Format 40 × 50 cm',
    innerSize: '40 × 50 cm',
    price: 249.90,
    scale: 'Échelle 1:18 Grand Format',
    description: "Grande pièce maîtresse murale d'exposition. Espace dans le cadre : 40 × 50 cm.",
    isDefault: false,
  },
]

/** Retourne le préréglage de format correspondant au prix */
export function getFramePresetByPrice(price: number): FrameFormatPreset {
  const num = Number(price) || 49.90
  if (num >= 200) {
    return FRAME_FORMAT_PRESETS[2] // 40 × 50 cm (249,90 €)
  }
  if (num >= 100) {
    return FRAME_FORMAT_PRESETS[1] // 30 × 40 cm (149,90 €)
  }
  return FRAME_FORMAT_PRESETS[0] // 10 × 15 cm (49,90 €)
}

/** Retourne la taille de l'espace dans le cadre en fonction du prix ou de la valeur enregistrée */
export function getInnerFrameSize(price: number, customSize?: string): string {
  if (customSize && customSize.trim() && customSize !== '21 × 29.7 cm' && customSize !== '30 × 42 cm' && customSize !== '50 × 70 cm') {
    return customSize.trim()
  }
  return getFramePresetByPrice(price).innerSize
}

/** Retourne le nom du format correspondant */
export function getFormatName(price: number, customName?: string): string {
  if (customName && customName.trim()) {
    return customName.trim()
  }
  return getFramePresetByPrice(price).name
}

/** Retourne le badge spécial pour les cadres haut de gamme (149,90 € et 249,90 €) */
export function getSpecialFrameBadge(price: number): 'Grand cadre' | 'Collector' | null {
  const num = Number(price) || 0
  if (num >= 200) {
    return 'Collector'
  }
  if (num >= 100) {
    return 'Grand cadre'
  }
  return null
}

