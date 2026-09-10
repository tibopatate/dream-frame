'use server'

import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { updateSettings as updateStoreSettings, getSettings } from '@/lib/data-store'
import Stripe from 'stripe'
import fs from 'fs'
import path from 'path'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user) redirect('/admin/login')
}

function updateEnvLocal(key: string, value: string) {
  try {
    const envPath = path.join(process.cwd(), '.env.local')
    let content = ''
    if (fs.existsSync(envPath)) {
      content = fs.readFileSync(envPath, 'utf-8')
    }
    const regex = new RegExp(`^${key}=.*$`, 'm')
    if (regex.test(content)) {
      content = content.replace(regex, `${key}="${value}"`)
    } else {
      content += `\n${key}="${value}"\n`
    }
    fs.writeFileSync(envPath, content, 'utf-8')
    process.env[key] = value
  } catch (err) {
    console.warn('Impossible décriture dans .env.local:', err)
  }
}

export async function updateSettings(
  key: string,
  value: any
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin()

    // 1. Sauvegarde dans le store persistant
    if (key === 'shipping') {
      updateStoreSettings({
        carrier: value.carrier ?? 'Colissimo Suivi',
        shippingCost: value.defaultCostEur ?? 0,
        isShippingFree: value.isAlwaysFree ?? true,
      })
    } else if (key === 'announcement') {
      updateStoreSettings({
        announcementBarText: value.text,
        announcementBarEnabled: value.enabled,
      })
    } else if (key === 'customizer') {
      updateStoreSettings({
        headerLogoPosition: value.headerLogoPosition,
        headerStyle: value.headerStyle,
        announcementBarPosition: value.announcementBarPosition,
        animationsType: value.animationsType,
        animationsSpeed: value.animationsSpeed,
        glowEffectsEnabled: value.glowEffectsEnabled,
      })
    }

    // 2. Sauvegarde Prisma si connecté
    try {
      await prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    } catch {}

    revalidatePath('/admin/parametres')
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Erreur lors de la sauvegarde' }
  }
}

export async function updateAnnouncementBarAction(data: {
  text: string
  enabled: boolean
}): Promise<{ success: boolean; error?: string }> {
  return updateSettings('announcement', data)
}

export async function updateCustomizerAction(data: {
  headerLogoPosition: 'left' | 'center' | 'right'
  headerStyle: 'glass' | 'solid' | 'gold'
  announcementBarPosition: 'top' | 'below'
  animationsType: 'fade-up' | 'hero-zoom' | 'slide-in' | 'none'
  animationsSpeed: 'slow' | 'normal' | 'fast'
  glowEffectsEnabled: boolean
}): Promise<{ success: boolean; error?: string }> {
  return updateSettings('customizer', data)
}

export async function testAndSaveStripeKey(
  secretKey: string
): Promise<{ success: boolean; error?: string; livemode?: boolean; currency?: string }> {
  try {
    await requireAdmin()

    const trimmed = secretKey.trim()
    if (!trimmed.startsWith('sk_live_') && !trimmed.startsWith('sk_test_')) {
      return {
        success: false,
        error: "La clé secrète doit obligatoirement commencer par 'sk_live_' (production) ou 'sk_test_' (test).",
      }
    }

    // Tester la clé directement avec l'API Stripe
    const testStripe = new Stripe(trimmed, {
      apiVersion: '2025-08-27.basil' as any,
    })

    let livemode = trimmed.startsWith('sk_live_')
    let currency = 'EUR'

    try {
      const balance = await testStripe.balance.retrieve()
      livemode = balance.livemode
      currency = balance.available[0]?.currency?.toUpperCase() || 'EUR'
    } catch (stripeErr: any) {
      return {
        success: false,
        error: `Stripe a rejeté la clé : ${stripeErr.message || 'Clé API invalide'}`,
      }
    }

    // 1. Persister dans data-store local
    updateStoreSettings({ stripeSecretKey: trimmed })

    // 2. Mettre à jour .env.local et process.env
    updateEnvLocal('STRIPE_SECRET_KEY', trimmed)

    // 3. Upsert Prisma si disponible
    try {
      await prisma.setting.upsert({
        where: { key: 'stripe_secret' },
        update: { value: { configured: true, livemode, lastTested: new Date().toISOString() } },
        create: { key: 'stripe_secret', value: { configured: true, livemode, lastTested: new Date().toISOString() } },
      })
    } catch {}

    revalidatePath('/admin/parametres')
    revalidatePath('/admin/dashboard')

    return {
      success: true,
      livemode,
      currency,
    }
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Erreur lors du test de connexion Stripe',
    }
  }
}

export async function updateStripePricesAction(data: {
  priceA4: string
  priceA3: string
  priceA2: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin()
    updateStoreSettings({
      stripePriceA4: data.priceA4.trim(),
      stripePriceA3: data.priceA3.trim(),
      stripePriceA2: data.priceA2.trim(),
    })
    revalidatePath('/admin/parametres')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Erreur lors de la sauvegarde' }
  }
}
