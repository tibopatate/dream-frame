'use server'

import { addReviewAsync, deleteReviewAsync, updateReviewStatusAsync } from '@/lib/data-store'
import { revalidatePath } from 'next/cache'

export async function createAdminReviewAction(formData: {
  name: string
  location?: string
  productName?: string
  formatPurchased?: string
  rating: number
  title: string
  comment: string
}) {
  try {
    const newRev = await addReviewAsync({
      name: formData.name.trim(),
      location: formData.location?.trim() || 'France',
      productName: formData.productName || 'Cadre Dream Frame',
      formatPurchased: formData.formatPurchased || 'Format Standard A4',
      rating: Number(formData.rating) || 5,
      title: formData.title.trim(),
      comment: formData.comment.trim(),
      isVerified: true,
      status: 'APPROVED',
    })

    revalidatePath('/')
    revalidatePath('/admin/avis')
    return { success: true, review: newRev }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function toggleReviewStatusAction(id: string, status: 'APPROVED' | 'PENDING') {
  try {
    const res = await updateReviewStatusAsync(id, status)
    revalidatePath('/')
    revalidatePath('/admin/avis')
    return { success: !!res }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function deleteReviewAction(id: string) {
  try {
    const res = await deleteReviewAsync(id)
    revalidatePath('/')
    revalidatePath('/admin/avis')
    return { success: res }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
