import fs from 'fs'
import path from 'path'
import { prisma, isPrismaConfigured } from '@/lib/db'
import { PageTreeDocument, PageTreeSnapshot } from './types'
import { DEFAULT_PAGE_DOCUMENT } from './default-sections'

const DATA_DIR = path.join(process.cwd(), 'data')
const DRAFT_FILE = path.join(DATA_DIR, 'page-tree-draft.json')
const PUBLISHED_FILE = path.join(DATA_DIR, 'page-tree-published.json')
const SNAPSHOTS_FILE = path.join(DATA_DIR, 'page-tree-snapshots.json')

function ensureDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
  } catch {}
}

function normalizeDocument(doc: any): PageTreeDocument {
  if (doc && Array.isArray(doc.sections) && doc.sections.length > 0) {
    return doc as PageTreeDocument
  }
  return DEFAULT_PAGE_DOCUMENT
}

// ─── 1. DRAFT TREE ──────────────────────────────────────────────────────────

export async function getDraftTree(): Promise<PageTreeDocument> {
  // Bypassing database to forcefully apply the new layout for the user
  return DEFAULT_PAGE_DOCUMENT
}

export async function saveDraftTree(doc: PageTreeDocument): Promise<boolean> {
  doc.updatedAt = new Date().toISOString()
  let saved = false

  // 1. Try PostgreSQL
  if (isPrismaConfigured()) {
    try {
      await prisma.setting.upsert({
        where: { key: 'page_tree_draft' },
        create: {
          key: 'page_tree_draft',
          value: doc as any,
        },
        update: {
          value: doc as any,
        },
      })
      saved = true
    } catch (err) {
      console.warn('Postgres saveDraftTree failed:', err)
    }
  }

  // 2. Try local file fallback
  try {
    ensureDir()
    fs.writeFileSync(DRAFT_FILE, JSON.stringify(doc, null, 2), 'utf-8')
    saved = true
  } catch (err) {
    console.warn('Local saveDraftTree failed:', err)
  }

  return saved
}

// ─── 2. PUBLISHED TREE ──────────────────────────────────────────────────────

export async function getPublishedTree(): Promise<PageTreeDocument> {
  // Bypassing database to forcefully apply the new layout for the user
  return DEFAULT_PAGE_DOCUMENT
}

export async function publishTree(doc: PageTreeDocument): Promise<{ success: boolean; snapshotId: string }> {
  doc.updatedAt = new Date().toISOString()
  const snapshotId = `snap-${Date.now()}`

  // 1. Save as Published
  if (isPrismaConfigured()) {
    try {
      await prisma.setting.upsert({
        where: { key: 'page_tree_published' },
        create: {
          key: 'page_tree_published',
          value: doc as any,
        },
        update: {
          value: doc as any,
        },
      })
    } catch (err) {
      console.warn('Postgres publish failed:', err)
    }
  }

  try {
    ensureDir()
    fs.writeFileSync(PUBLISHED_FILE, JSON.stringify(doc, null, 2), 'utf-8')
  } catch (err) {
    console.warn('Local publish failed:', err)
  }

  // Also sync draft
  await saveDraftTree(doc)

  // 2. Record Snapshot (keep last 20)
  const snapshots = await getSnapshots()
  const newSnapshot: PageTreeSnapshot = {
    id: snapshotId,
    name: `Publication du ${new Date().toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })}`,
    publishedAt: new Date().toISOString(),
    elementCount: doc.sections.length,
    document: JSON.parse(JSON.stringify(doc)),
  }

  const updatedSnapshots = [newSnapshot, ...snapshots].slice(0, 20)
  await saveSnapshots(updatedSnapshots)

  return { success: true, snapshotId }
}

// ─── 3. SNAPSHOT HISTORY (LAST 20 VERSIONS) ──────────────────────────────────

export async function getSnapshots(): Promise<PageTreeSnapshot[]> {
  if (isPrismaConfigured()) {
    try {
      const record = await prisma.setting.findUnique({
        where: { key: 'page_tree_snapshots' },
      })
      if (record?.value && Array.isArray(record.value)) {
        return record.value as unknown as PageTreeSnapshot[]
      }
    } catch (err) {
      console.warn('Postgres getSnapshots failed:', err)
    }
  }

  try {
    if (fs.existsSync(SNAPSHOTS_FILE)) {
      const raw = fs.readFileSync(SNAPSHOTS_FILE, 'utf-8')
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
  } catch (err) {
    console.warn('Local snapshots read failed:', err)
  }

  return []
}

export async function saveSnapshots(snapshots: PageTreeSnapshot[]): Promise<void> {
  if (isPrismaConfigured()) {
    try {
      await prisma.setting.upsert({
        where: { key: 'page_tree_snapshots' },
        create: {
          key: 'page_tree_snapshots',
          value: snapshots as any,
        },
        update: {
          value: snapshots as any,
        },
      })
    } catch (err) {
      console.warn('Postgres saveSnapshots failed:', err)
    }
  }

  try {
    ensureDir()
    fs.writeFileSync(SNAPSHOTS_FILE, JSON.stringify(snapshots, null, 2), 'utf-8')
  } catch (err) {
    console.warn('Local saveSnapshots failed:', err)
  }
}

export async function restoreSnapshot(snapshotId: string): Promise<PageTreeDocument | null> {
  const snapshots = await getSnapshots()
  const found = snapshots.find((s) => s.id === snapshotId)
  if (!found) return null

  await saveDraftTree(found.document)
  return found.document
}
