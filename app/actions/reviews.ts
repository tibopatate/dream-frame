'use server'

import { addReview, deleteReview, updateReviewStatus, getAllReviews } from '@/lib/data-store'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const reviewSchema = z.object({
  productSlug: z.string().optional(),
  productId: z.string().optional(),
  productName: z.string().optional(),
  name: z.string().min(2, 'Le prénom ou nom doit comporter au moins 2 caractères'),
  email: z.string().email('Adresse email invalide').optional().or(z.literal('')),
  location: z.string().optional(),
  rating: z.coerce.number().min(1).max(5),
  title: z.string().min(3, 'Veuillez saisir un titre pour votre avis (au moins 3 caractères)'),
  comment: z.string().min(10, 'Votre avis doit comporter au moins 10 caractères'),
  formatPurchased: z.string().optional(),
})

export async function submitReviewAction(formData: {
  productSlug?: string
  productId?: string
  productName?: string
  name: string
  email?: string
  location?: string
  rating: number
  title: string
  comment: string
  formatPurchased?: string
}) {
  try {
    const validated = reviewSchema.parse(formData)

    const newReview = addReview({
      productId: validated.productId,
      productSlug: validated.productSlug,
      productName: validated.productName || 'Cadre d\'exception Dream Frame',
      name: validated.name.trim(),
      email: validated.email || undefined,
      location: validated.location?.trim() || 'France',
      rating: validated.rating,
      title: validated.title.trim(),
      comment: validated.comment.trim(),
      formatPurchased: validated.formatPurchased,
      isVerified: true,
      status: 'APPROVED', // Publié directement pour une satisfaction client immédiate
    })

    if (validated.productSlug) {
      revalidatePath(`/produit/${validated.productSlug}`)
    }
    revalidatePath('/')
    revalidatePath('/admin/avis')

    return { success: true, review: newReview }
  } catch (error: any) {
    return {
      success: false,
      error: error?.errors?.[0]?.message || error.message || 'Une erreur est survenue lors de l\'envoi de votre avis.',
    }
  }
}

export async function toggleReviewStatusAction(id: string, status: 'APPROVED' | 'PENDING') {
  try {
    const updated = updateReviewStatus(id, status)
    revalidatePath('/')
    revalidatePath('/admin/avis')
    return { success: !!updated }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function deleteReviewAction(id: string) {
  try {
    const deleted = deleteReview(id)
    revalidatePath('/')
    revalidatePath('/admin/avis')
    return { success: deleted }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
