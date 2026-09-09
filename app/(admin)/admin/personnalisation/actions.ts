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
