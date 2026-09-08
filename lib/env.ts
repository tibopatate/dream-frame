// ─── Validation Zod de toutes les variables d'environnement au démarrage ───
// Si une variable obligatoire manque, l'app crash explicitement avec un message clair.

import { z } from 'zod'

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL manquante'),

  // Auth.js
  AUTH_SECRET: z.string().min(1, 'AUTH_SECRET manquant'),
  AUTH_URL: z.string().url().optional(),

  // Stripe
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_'),

  // Resend
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY manquante'),
  RESEND_FROM_EMAIL: z.string().email(),

  // Vercel Blob
  BLOB_READ_WRITE_TOKEN: z.string().min(1, 'BLOB_READ_WRITE_TOKEN manquant'),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url(),
  ADMIN_ALERT_EMAIL: z.string().email(),
  CRON_SECRET: z.string().min(1, 'CRON_SECRET manquant'),

  // Optional
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().optional(),
})

// En dev, on autorise des stubs — en prod, on est strict
const _env = process.env.NODE_ENV === 'production'
  ? envSchema.parse(process.env)
  : envSchema.partial().parse(process.env)

export const env = _env as z.infer<typeof envSchema>
