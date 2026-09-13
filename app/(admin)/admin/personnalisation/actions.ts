'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import {
  saveDraftTree,
  publishTree,
  getSnapshots,
  restoreSnapshot,
} from '@/lib/page-builder/store'
import { PageTreeDocument } from '@/lib/page-builder/types'

export async function saveDraftAction(doc: PageTreeDocument) {
  try {
    const ok = await saveDraftTree(doc)
    return { success: ok }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function publishAction(doc: PageTreeDocument) {
  try {
    const res = await publishTree(doc)
    // ONLY revalidate public homepage when user explicitly clicks "Publier"!
    revalidatePath('/')
    revalidatePath('/admin/personnalisation')
    return { success: true, snapshotId: res.snapshotId }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function restoreSnapshotAction(snapshotId: string) {
  try {
    const doc = await restoreSnapshot(snapshotId)
    if (!doc) {
      return { success: false, error: 'Snapshot introuvable' }
    }
    return { success: true, document: doc }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function getSnapshotsAction() {
  try {
    const list = await getSnapshots()
    return { success: true, snapshots: list }
  } catch (err: any) {
    return { success: false, snapshots: [], error: err.message }
  }
}

// ─── Collections Actions ───────────────────────────────────────────────────

export async function getCollectionsAction() {
  try {
    const { getUnifiedCollections } = await import('@/lib/data-store')
    const collections = await getUnifiedCollections()
    return { success: true, collections }
  } catch (err: any) {
    return { success: false, collections: [], error: err.message }
  }
}

export async function saveCollectionAction(data: {
  id?: string
  name: string
  slug?: string
  description?: string
  image?: string
  productIds: string[]
  isActive: boolean
  isFeatured?: boolean
}) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: 'Non autorisé' }
    }

    const { addCollectionAsync, updateCollectionAsync } = await import('@/lib/data-store')
    const slug = data.slug || data.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    if (data.id) {
      const updated = await updateCollectionAsync(data.id, {
        name: data.name,
        slug,
        description: data.description,
        image: data.image,
        productIds: data.productIds,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
      })
      revalidatePath('/collection')
      revalidatePath('/catalogue')
      revalidatePath('/')
      return { success: true, collection: updated || undefined }
    } else {
      const created = await addCollectionAsync({
        name: data.name,
        slug,
        description: data.description,
        image: data.image,
        productIds: data.productIds,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
      })
      revalidatePath('/collection')
      revalidatePath('/catalogue')
      revalidatePath('/')
      return { success: true, collection: created }
    }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function deleteCollectionAction(id: string) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: 'Non autorisé' }
    }

    const { deleteCollectionAsync } = await import('@/lib/data-store')
    const ok = await deleteCollectionAsync(id)
    revalidatePath('/collection')
    revalidatePath('/catalogue')
    revalidatePath('/')
    return { success: ok }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

