import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Formatte un prix en euros TTC */
export function formatPrice(amountInCents: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amountInCents / 100)
}

/** Formatte un prix depuis un Decimal Prisma */
export function formatPriceFromDecimal(amount: number | string): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(amount))
}

/** Génère un slug depuis un nom de produit */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/** Calcul des frais de livraison — 100% Gratuite en France */
export function calculateShipping(_subtotalEuros: number): number {
  return 0
}

/** TVA 20% */
export const TAX_RATE = 0.2
export const PRODUCT_PRICE_EUR = 40
export const PRODUCT_PRICE_HT = parseFloat((PRODUCT_PRICE_EUR / (1 + TAX_RATE)).toFixed(2))
export const PRODUCT_TAX_EUR = parseFloat((PRODUCT_PRICE_EUR - PRODUCT_PRICE_HT).toFixed(2))

/** Formatte une date en français */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

/** Tronque un texte */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 3) + '...'
}

/** Vérifie si une URL de média est une vidéo (MP4, WebM, MOV, M4V, OGG) */
export function isVideoUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false
  const clean = url.split('?')[0].split('#')[0].toLowerCase()
  return (
    clean.endsWith('.mp4') ||
    clean.endsWith('.webm') ||
    clean.endsWith('.mov') ||
    clean.endsWith('.m4v') ||
    clean.endsWith('.ogg') ||
    clean.includes('video/')
  )
}

export const DEFAULT_FRAME_IMAGE = 'https://brbisdc22g6rfsvd.public.blob.vercel-storage.com/1000074237-DLrB8wZrK6F91n0aiM5MMjwcwtvEuI.jpg'

/** Retourne de manière garantie une vraie URL d'image statique (jamais une vidéo mp4) */
export function getProductThumbnail(product?: any): string {
  if (!product) return DEFAULT_FRAME_IMAGE
  const images: string[] = Array.isArray(product.images)
    ? product.images
    : product.image
    ? [product.image]
    : []

  const staticImg = images.find((img) => typeof img === 'string' && img.trim() !== '' && !isVideoUrl(img))
  if (staticImg) return staticImg

  return DEFAULT_FRAME_IMAGE
}

/** Réordonne les médias d'un produit pour que les photos soient toujours en premier et les vidéos à la fin */
export function reorderProductImages(images: string[] = []): string[] {
  if (!Array.isArray(images) || images.length <= 1) return images
  const staticImages = images.filter((img) => typeof img === 'string' && !isVideoUrl(img))
  const videoFiles = images.filter((img) => typeof img === 'string' && isVideoUrl(img))
  return [...staticImages, ...videoFiles]
}

