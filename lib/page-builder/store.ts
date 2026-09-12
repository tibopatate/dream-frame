import fs from 'fs'
import path from 'path'
import os from 'os'
import { prisma, isPrismaConfigured } from '@/lib/db'
import { PageTreeDocument, PageTreeSnapshot } from './types'
import { DEFAULT_PAGE_DOCUMENT } from './default-sections'

const DATA_DIR = path.join(process.cwd(), 'data')
const DRAFT_FILE = path.join(DATA_DIR, 'page-tree-draft.json')
const PUBLISHED_FILE = path.join(DATA_DIR, 'page-tree-published.json')
const SNAPSHOTS_FILE = path.join(DATA_DIR, 'page-tree-snapshots.json')

const TMP_DIR = os.tmpdir()
const TMP_DRAFT = path.join(TMP_DIR, 'page-tree-draft.json')
const TMP_PUBLISHED = path.join(TMP_DIR, 'page-tree-published.json')
const TMP_SNAPSHOTS = path.join(TMP_DIR, 'page-tree-snapshots.json')

const PUBLISHED_BLOB_URL = 'https://brbisdc22g6rfsvd.public.blob.vercel-storage.com/page-tree-published-live.json'
const DRAFT_BLOB_URL = 'https://brbisdc22g6rfsvd.public.blob.vercel-storage.com/page-tree-draft-live.json'
const SNAPSHOTS_BLOB_URL = 'https://brbisdc22g6rfsvd.public.blob.vercel-storage.com/page-tree-snapshots-live.json'

const globalForPb = globalThis as unknown as {
  pageBuilderPublished?: PageTreeDocument
  pageBuilderDraft?: PageTreeDocument
  pageBuilderSnapshots?: PageTreeSnapshot[]
}

function ensureDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
  } catch {}
}

function normalizeDocument(doc: any): PageTreeDocument | null {
  if (doc && Array.isArray(doc.sections) && doc.sections.length > 0) {
    return doc as PageTreeDocument
  }
  return null
}

// ─── 1. DRAFT TREE ──────────────────────────────────────────────────────────

export async function getDraftTree(): Promise<PageTreeDocument> {
  // 1. In-memory cache
  if (globalForPb.pageBuilderDraft) {
    return globalForPb.pageBuilderDraft
  }

  // 2. Vercel Blob cloud storage
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN
  if (blobToken && !blobToken.includes('CHANGE_ME')) {
    try {
      const res = await fetch(DRAFT_BLOB_URL, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        const norm = normalizeDocument(data)
        if (norm) {
          globalForPb.pageBuilderDraft = norm
          try {
            fs.writeFileSync(TMP_DRAFT, JSON.stringify(norm, null, 2), 'utf-8')
          } catch {}
          return norm
        }
      }
    } catch (err: any) {
      console.warn('Could not sync Draft Tree from Vercel Blob:', err?.message)
    }
  }

  // 3. /tmp cache
  try {
    if (fs.existsSync(TMP_DRAFT)) {
      const raw = fs.readFileSync(TMP_DRAFT, 'utf-8')
      const parsed = JSON.parse(raw)
      const norm = normalizeDocument(parsed)
      if (norm) {
        globalForPb.pageBuilderDraft = norm
        return norm
      }
    }
  } catch {}

  // 4. Local file
  try {
    if (fs.existsSync(DRAFT_FILE)) {
      const raw = fs.readFileSync(DRAFT_FILE, 'utf-8')
      const parsed = JSON.parse(raw)
      const norm = normalizeDocument(parsed)
      if (norm) {
        globalForPb.pageBuilderDraft = norm
        return norm
      }
    }
  } catch {}

  // 5. PostgreSQL if available
  if (isPrismaConfigured()) {
    try {
      const record = await prisma.setting.findUnique({
        where: { key: 'page_tree_draft' },
      })
      if (record?.value) {
        const norm = normalizeDocument(record.value)
        if (norm) {
          globalForPb.pageBuilderDraft = norm
          return norm
        }
      }
    } catch (err) {
      console.warn('Postgres getDraftTree failed:', err)
    }
  }

  // Fallback to published tree or default
  return await getPublishedTree()
}

export async function saveDraftTree(doc: PageTreeDocument): Promise<boolean> {
  doc.updatedAt = new Date().toISOString()
  globalForPb.pageBuilderDraft = doc

  // 1. /tmp
  try {
    fs.writeFileSync(TMP_DRAFT, JSON.stringify(doc, null, 2), 'utf-8')
  } catch {}

  // 2. Local file
  try {
    ensureDir()
    fs.writeFileSync(DRAFT_FILE, JSON.stringify(doc, null, 2), 'utf-8')
  } catch {}

  // 3. PostgreSQL
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
    } catch (err) {
      console.warn('Postgres saveDraftTree failed:', err)
    }
  }

  // 4. Vercel Blob
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN
  if (blobToken && !blobToken.includes('CHANGE_ME')) {
    try {
      const { put } = await import('@vercel/blob')
      await put('page-tree-draft-live.json', JSON.stringify(doc, null, 2), {
        access: 'public',
        addRandomSuffix: false,
      })
    } catch (err: any) {
      console.warn('saveDraftTree Blob error:', err?.message)
    }
  }

  return true
}

// ─── 2. PUBLISHED TREE ──────────────────────────────────────────────────────

export async function getPublishedTree(): Promise<PageTreeDocument> {
  // 1. In-memory cache
  if (globalForPb.pageBuilderPublished) {
    return globalForPb.pageBuilderPublished
  }

  // 2. Vercel Blob cloud storage
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN
  if (blobToken && !blobToken.includes('CHANGE_ME')) {
    try {
      const res = await fetch(PUBLISHED_BLOB_URL, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        const norm = normalizeDocument(data)
        if (norm) {
          globalForPb.pageBuilderPublished = norm
          try {
            fs.writeFileSync(TMP_PUBLISHED, JSON.stringify(norm, null, 2), 'utf-8')
          } catch {}
          return norm
        }
      }
    } catch (err: any) {
      console.warn('Could not sync Published Tree from Vercel Blob:', err?.message)
    }
  }

  // 3. /tmp cache
  try {
    if (fs.existsSync(TMP_PUBLISHED)) {
      const raw = fs.readFileSync(TMP_PUBLISHED, 'utf-8')
      const parsed = JSON.parse(raw)
      const norm = normalizeDocument(parsed)
      if (norm) {
        globalForPb.pageBuilderPublished = norm
        return norm
      }
    }
  } catch {}

  // 4. Local file
  try {
    if (fs.existsSync(PUBLISHED_FILE)) {
      const raw = fs.readFileSync(PUBLISHED_FILE, 'utf-8')
      const parsed = JSON.parse(raw)
      const norm = normalizeDocument(parsed)
      if (norm) {
        globalForPb.pageBuilderPublished = norm
        return norm
      }
    }
  } catch {}

  // 5. PostgreSQL if available
  if (isPrismaConfigured()) {
    try {
      const record = await prisma.setting.findUnique({
        where: { key: 'page_tree_published' },
      })
      if (record?.value) {
        const norm = normalizeDocument(record.value)
        if (norm) {
          globalForPb.pageBuilderPublished = norm
          return norm
        }
      }
    } catch (err) {
      console.warn('Postgres getPublishedTree failed:', err)
    }
  }

  return DEFAULT_PAGE_DOCUMENT
}

export async function publishTree(doc: PageTreeDocument): Promise<{ success: boolean; snapshotId: string }> {
  doc.updatedAt = new Date().toISOString()
  const snapshotId = `snap-${Date.now()}`

  globalForPb.pageBuilderPublished = doc
  globalForPb.pageBuilderDraft = doc

  // 1. /tmp
  try {
    fs.writeFileSync(TMP_PUBLISHED, JSON.stringify(doc, null, 2), 'utf-8')
    fs.writeFileSync(TMP_DRAFT, JSON.stringify(doc, null, 2), 'utf-8')
  } catch {}

  // 2. Local files
  try {
    ensureDir()
    fs.writeFileSync(PUBLISHED_FILE, JSON.stringify(doc, null, 2), 'utf-8')
    fs.writeFileSync(DRAFT_FILE, JSON.stringify(doc, null, 2), 'utf-8')
  } catch {}

  // 3. PostgreSQL
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
    } catch (err) {
      console.warn('Postgres publish failed:', err)
    }
  }

  // 4. Vercel Blob sync for both published and draft
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN
  if (blobToken && !blobToken.includes('CHANGE_ME')) {
    try {
      const { put } = await import('@vercel/blob')
      await Promise.all([
        put('page-tree-published-live.json', JSON.stringify(doc, null, 2), {
          access: 'public',
          addRandomSuffix: false,
        }),
        put('page-tree-draft-live.json', JSON.stringify(doc, null, 2), {
          access: 'public',
          addRandomSuffix: false,
        }),
      ])
    } catch (err: any) {
      console.warn('publishTree Blob error:', err?.message)
    }
  }

  // 5. Record Snapshot (keep last 20)
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
  if (globalForPb.pageBuilderSnapshots && globalForPb.pageBuilderSnapshots.length > 0) {
    return globalForPb.pageBuilderSnapshots
  }

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN
  if (blobToken && !blobToken.includes('CHANGE_ME')) {
    try {
      const res = await fetch(SNAPSHOTS_BLOB_URL, { cache: 'no-store' })
      if (res.ok) {
        const parsed = await res.json()
        if (Array.isArray(parsed)) {
          globalForPb.pageBuilderSnapshots = parsed
          try {
            fs.writeFileSync(TMP_SNAPSHOTS, JSON.stringify(parsed, null, 2), 'utf-8')
          } catch {}
          return parsed
        }
      }
    } catch {}
  }

  try {
    if (fs.existsSync(TMP_SNAPSHOTS)) {
      const raw = fs.readFileSync(TMP_SNAPSHOTS, 'utf-8')
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        globalForPb.pageBuilderSnapshots = parsed
        return parsed
      }
    }
  } catch {}

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
        globalForPb.pageBuilderSnapshots = parsed
        return parsed
      }
    }
  } catch {}

  return []
}

export async function saveSnapshots(snapshots: PageTreeSnapshot[]): Promise<void> {
  globalForPb.pageBuilderSnapshots = snapshots

  try {
    fs.writeFileSync(TMP_SNAPSHOTS, JSON.stringify(snapshots, null, 2), 'utf-8')
  } catch {}

  try {
    ensureDir()
    fs.writeFileSync(SNAPSHOTS_FILE, JSON.stringify(snapshots, null, 2), 'utf-8')
  } catch {}

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

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN
  if (blobToken && !blobToken.includes('CHANGE_ME')) {
    try {
      const { put } = await import('@vercel/blob')
      await put('page-tree-snapshots-live.json', JSON.stringify(snapshots, null, 2), {
        access: 'public',
        addRandomSuffix: false,
      })
    } catch (err: any) {
      console.warn('saveSnapshots Blob error:', err?.message)
    }
  }
}

export async function restoreSnapshot(snapshotId: string): Promise<PageTreeDocument | null> {
  const snapshots = await getSnapshots()
  const found = snapshots.find((s) => s.id === snapshotId)
  if (!found) return null

  await saveDraftTree(found.document)
  return found.document
}
