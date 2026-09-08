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

export function createStripeClient(customKey?: string): Stripe {
  return new Stripe(customKey || getStripeSecretKey(), {
    apiVersion: '2025-08-27.basil' as any,
    typescript: true,
  })
}

export const stripe = createStripeClient()
