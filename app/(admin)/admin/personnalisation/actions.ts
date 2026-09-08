'use server'

import { updateSettings, StoredSettings } from '@/lib/data-store'
import { revalidatePath } from 'next/cache'

export async function updateCustomizerAction(newSettings: Partial<StoredSettings>) {
  try {
    const updated = updateSettings(newSettings)
    revalidatePath('/')
    revalidatePath('/catalogue')
    revalidatePath('/(shop)', 'layout')
    revalidatePath('/admin/personnalisation')
    return { success: true, settings: updated }
  } catch (err: any) {
    return { success: false, error: err.message || 'Erreur lors de la mise à jour des paramètres' }
  }
}
