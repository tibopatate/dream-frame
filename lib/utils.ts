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
