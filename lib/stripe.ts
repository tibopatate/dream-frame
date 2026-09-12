import Stripe from 'stripe'
import { getSettings } from './data-store'

export function getStripeSecretKey(): string {
  const envKey = process.env.STRIPE_SECRET_KEY
  if (envKey && !envKey.includes('CHANGE_ME') && envKey.startsWith('sk_')) {
    return envKey
  }
  try {
    const settings = getSettings()
    if (settings.stripeSecretKey && settings.stripeSecretKey.startsWith('sk_')) {
      return settings.stripeSecretKey
    }
  } catch {}
  return 'sk_test_placeholder'
}

let cachedStripe: Stripe | null = null
let cachedKey: string = ''

export function createStripeClient(customKey?: string): Stripe {
  return new Stripe(customKey || getStripeSecretKey(), {
    apiVersion: '2025-08-27.basil' as any,
    typescript: true,
  })
}

export function getStripe(): Stripe {
  const currentKey = getStripeSecretKey()
  if (!cachedStripe || cachedKey !== currentKey) {
    cachedKey = currentKey
    cachedStripe = createStripeClient(currentKey)
  }
  return cachedStripe
}

// Proxy dynamique permettant d'utiliser `stripe.xxx` avec toujours la dernière clé valide
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const client = getStripe()
    const value = (client as any)[prop]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  },
})

