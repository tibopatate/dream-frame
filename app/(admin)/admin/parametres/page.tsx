import { prisma, isPrismaConfigured } from '@/lib/db'
import { SettingsForm } from './settings-form'

export const metadata = { title: 'Paramètres & Intégrations — Dream Frame Admin' }

export default async function AdminParametresPage() {
  let shippingSetting: any = null

  if (isPrismaConfigured()) {
    try {
      shippingSetting = await prisma.setting.findUnique({
        where: { key: 'shipping' },
      })
    } catch {
      shippingSetting = null
    }
  }

  const defaultShipping = {
    freeThresholdEur: 0,
    defaultCostEur: 0,
    carrier: 'Colissimo Suivi',
    isAlwaysFree: true,
  }

  const shipping = shippingSetting?.value
    ? (shippingSetting.value as typeof defaultShipping)
    : defaultShipping

  // Récupération des réglages persistants
  const { getSettings } = await import('@/lib/data-store')
  const stored = getSettings()

  const initialAnnouncement = {
    text: stored.announcementBarText || '✦  LIVRAISON COLISSIMO SUIVIE 100% OFFERTE · EXPÉDITION 24/48H  ✦',
    enabled: stored.announcementBarEnabled !== false,
  }

  const initialCustomizer = {
    headerLogoPosition: (stored.headerLogoPosition || 'left') as 'left' | 'center' | 'right',
    headerStyle: (stored.headerStyle || 'glass') as 'glass' | 'solid' | 'gold',
    announcementBarPosition: (stored.announcementBarPosition || 'top') as 'top' | 'below',
    animationsType: (stored.animationsType || 'fade-up') as 'fade-up' | 'hero-zoom' | 'slide-in' | 'none',
    animationsSpeed: (stored.animationsSpeed || 'normal') as 'slow' | 'normal' | 'fast',
    glowEffectsEnabled: stored.glowEffectsEnabled !== false,
  }

  const envStatus = {
    hasStripeSecret: Boolean(
      (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('CHANGE_ME')) ||
      (stored.stripeSecretKey && stored.stripeSecretKey.startsWith('sk_'))
    ),
    hasStripeWebhook: Boolean(
      process.env.STRIPE_WEBHOOK_SECRET && !process.env.STRIPE_WEBHOOK_SECRET.includes('CHANGE_ME')
    ),
    hasStripePublishable: Boolean(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
        !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.includes('CHANGE_ME')
    ),
    hasDatabaseUrl: Boolean(
      process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('host:5432')
    ),
    hasAuthSecret: Boolean(
      process.env.AUTH_SECRET && !process.env.AUTH_SECRET.includes('change-me')
    ),
  }

  return (
    <div className="p-6 sm:p-10 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
          Paramètres &amp; Personnalisation
        </h1>
        <p className="text-xs mt-1 opacity-70">
          Pilotez vos connexions Stripe, personnalisez le header et contrôlez les animations par section comme sur Shopify
        </p>
      </div>

      <SettingsForm
        initialShipping={shipping}
        initialAnnouncement={initialAnnouncement}
        initialCustomizer={initialCustomizer}
        envStatus={envStatus}
      />
    </div>
  )
}
