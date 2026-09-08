'use server'

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import {
  addCollaborator,
  deleteCollaborator,
  clearMockOrders,
  StoredCollaborator,
} from '@/lib/data-store'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user) redirect('/admin/login')
}

export async function createCollaboratorAction(formData: {
  name: string
  email: string
  role: 'ADMIN' | 'LOGISTICS' | 'SUPPORT'
}): Promise<{ success: boolean; collaborator?: StoredCollaborator; error?: string }> {
  try {
    await requireAdmin()

    if (!formData.name?.trim() || !formData.email?.trim()) {
      return { success: false, error: 'Nom et adresse email requis' }
    }

    const newCollab = addCollaborator({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      role: formData.role || 'LOGISTICS',
      status: 'ACTIVE',
    })

    revalidatePath('/admin/collaborateurs')
    revalidatePath('/admin/dashboard')

    return { success: true, collaborator: newCollab }
  } catch (err: any) {
    return { success: false, error: err.message || 'Erreur lors de l’ajout du collaborateur' }
  }
}

export async function removeCollaboratorAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin()
    const ok = deleteCollaborator(id)
    revalidatePath('/admin/collaborateurs')
    return { success: ok }
  } catch (err: any) {
    return { success: false, error: err.message || 'Erreur lors de la suppression' }
  }
}

export async function clearMockDataAction(): Promise<{ success: boolean; message?: string }> {
  try {
    await requireAdmin()
    clearMockOrders()
    revalidatePath('/admin/dashboard')
    revalidatePath('/admin/commandes')
    return {
      success: true,
      message: 'Données de test purgées avec succès. Le dashboard affiche désormais 100% de données réelles.',
    }
  } catch (err: any) {
    return { success: false, message: err.message || 'Erreur lors de la purge' }
  }
}
