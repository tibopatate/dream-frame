'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import {
  PageTreeDocument,
  PageElement,
  ElementType,
  DeviceMode,
  ElementStyles,
  PageTreeSnapshot,
} from '@/lib/page-builder/types'
import { ElementRenderer } from './ElementRenderer'
import { FloatingToolbar } from './FloatingToolbar'
import { InsertMenu } from './InsertMenu'
import { SnapshotsModal } from './SnapshotsModal'
import {
  saveDraftAction,
  publishAction,
  getSnapshotsAction,
  restoreSnapshotAction,
} from '@/app/(admin)/admin/personnalisation/actions'
import {
  Monitor,
  Tablet,
  Smartphone,
  Undo2,
  Redo2,
  Eye,
  EyeOff,
  History,
  CheckCircle,
  Loader2,
  Plus,
  ArrowLeft,
  UploadCloud,
  Sparkles,
  ExternalLink,
} from 'lucide-react'

// ─── TREE UTILITIES ──────────────────────────────────────────────────────────

function findElement(elements: PageElement[], id: string): PageElement | null {
  for (const el of elements) {
    if (el.id === id) return el
    if (el.children) {
      const found = findElement(el.children, id)
      if (found) return found
    }
  }
  return null
}

function findParent(elements: PageElement[], id: string): PageElement | null {
  for (const el of elements) {
    if (el.children?.some((c) => c.id === id)) {
      return el
    }
    if (el.children) {
      const p = findParent(el.children, id)
      if (p) return p
    }
  }
  return null
}

function findBreadcrumbs(elements: PageElement[], id: string): { id: string; label: string }[] {
  const path: { id: string; label: string }[] = []

  function search(curr: PageElement[]): boolean {
    for (const el of curr) {
      const label = el.type.toUpperCase()
      if (el.id === id) {
        path.push({ id: el.id, label })
        return true
      }
      if (el.children) {
        if (search(el.children)) {
          path.unshift({ id: el.id, label })
          return true
        }
      }
    }
    return false
  }

  search(elements)
  return path
}

function updateElementInTree(
  elements: PageElement[],
  id: string,
  updater: (el: PageElement) => PageElement
): PageElement[] {
  return elements.map((el) => {
    if (el.id === id) {
      return updater(el)
    }
    if (el.children) {
      return {
        ...el,
        children: updateElementInTree(el.children, id, updater),
      }
    }
    return el
  })
}

function deleteElementFromTree(elements: PageElement[], id: string): PageElement[] {
  return elements
    .filter((el) => el.id !== id)
    .map((el) => {
      if (el.children) {
        return {
          ...el,
          children: deleteElementFromTree(el.children, id),
        }
      }
      return el
    })
}

function duplicateElementInTree(elements: PageElement[], id: string): PageElement[] {
  const result: PageElement[] = []

  for (const el of elements) {
    if (el.id === id) {
      result.push(el)
      const cloned: PageElement = JSON.parse(JSON.stringify(el))
      cloned.id = `${el.type}-${Date.now()}`
      if (cloned.content) cloned.content = `${cloned.content} (Copie)`
      result.push(cloned)
    } else {
      if (el.children) {
        result.push({
          ...el,
          children: duplicateElementInTree(el.children, id),
        })
      } else {
        result.push(el)
      }
    }
  }

  return result
}

function moveElementInTree(
  elements: PageElement[],
  id: string,
  direction: 'up' | 'down'
): PageElement[] {
  const idx = elements.findIndex((el) => el.id === id)
  if (idx !== -1) {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1
    if (targetIdx < 0 || targetIdx >= elements.length) return elements
    const next = [...elements]
    const temp = next[idx]
    next[idx] = next[targetIdx]
    next[targetIdx] = temp
    return next
  }

  return elements.map((el) => {
    if (el.children) {
      return {
        ...el,
        children: moveElementInTree(el.children, id, direction),
      }
    }
    return el
  })
}

function insertSiblingInTree(
  elements: PageElement[],
  targetId: string,
  position: 'before' | 'after',
  newEl: PageElement
): PageElement[] {
  const idx = elements.findIndex((el) => el.id === targetId)
  if (idx !== -1) {
    const next = [...elements]
    const insertIdx = position === 'before' ? idx : idx + 1
    next.splice(insertIdx, 0, newEl)
    return next
  }

  return elements.map((el) => {
    if (el.children) {
      return {
        ...el,
        children: insertSiblingInTree(el.children, targetId, position, newEl),
      }
    }
    return el
  })
}

function createDefaultElement(type: ElementType): PageElement {
  const id = `${type}-${Date.now()}`

  switch (type) {
    case 'heading':
      return {
        id,
        type: 'heading',
        tag: 'h2',
        content: 'Nouveau Titre d’Exception',
        styles: {
          color: '#ffffff',
          fontSize: '36px',
          fontWeight: '800',
          textAlign: 'center',
          marginTop: '16px',
          marginBottom: '16px',
        },
      }
    case 'text':
      return {
        id,
        type: 'text',
        content: 'Texte descriptif de présentation de vos cadres d’artisanat automobile.',
        styles: {
          color: '#d4d4d8',
          fontSize: '15px',
          lineHeight: '1.6',
          textAlign: 'center',
          maxWidth: '600px',
        },
      }
    case 'button':
      return {
        id,
        type: 'button',
        content: 'Commander Maintenant',
        href: '/catalogue',
        styles: {
          backgroundColor: '#ffffff',
          color: '#000000',
          fontSize: '13px',
          fontWeight: '800',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          paddingTop: '14px',
          paddingBottom: '14px',
          paddingLeft: '28px',
          paddingRight: '28px',
          borderRadius: '12px',
          display: 'inline-flex',
        },
      }
    case 'image':
      return {
        id,
        type: 'image',
        src: '/atelier/chiron-wall.jpg',
        alt: 'Supercar Dream Frame',
        styles: {
          width: '100%',
          maxWidth: '800px',
          aspectRatio: '16/9',
          borderRadius: '16px',
          objectFit: 'cover',
        },
      }
    case 'badge':
      return {
        id,
        type: 'badge',
        content: 'Fait Main en France · Pièce Unique',
        styles: {
          display: 'inline-flex',
          paddingTop: '6px',
          paddingBottom: '6px',
          paddingLeft: '14px',
          paddingRight: '14px',
          borderRadius: '9999px',
          backgroundColor: 'rgba(245, 158, 11, 0.15)',
          borderColor: 'rgba(245, 158, 11, 0.4)',
          borderWidth: '1px',
          borderStyle: 'solid',
          color: '#fbbf24',
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        },
      }
    case 'product-list':
      return {
        id,
        type: 'product-list',
        productListConfig: {
          category: 'ALL',
          limit: 8,
          sortBy: 'featured',
        },
        styles: {
          width: '100%',
          maxWidth: '1200px',
          marginTop: '32px',
          marginBottom: '32px',
        },
      }
    case 'container':
      return {
        id,
        type: 'container',
        styles: {
          width: '100%',
          maxWidth: '1100px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          paddingTop: '24px',
          paddingBottom: '24px',
        },
        children: [],
      }
    case 'section':
      return {
        id,
        type: 'section',
        styles: {
          width: '100%',
          backgroundColor: '#0c0c0b',
          paddingTop: '64px',
          paddingBottom: '64px',
          paddingLeft: '24px',
          paddingRight: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        },
        children: [],
      }
    case 'divider':
      return {
        id,
        type: 'divider',
        styles: {
          width: '100%',
          maxWidth: '600px',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: '1px',
          borderStyle: 'solid',
          marginTop: '32px',
          marginBottom: '32px',
        },
      }
    default:
      return {
        id,
        type,
        styles: {},
      }
  }
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

interface WebflowEditorProps {
  initialDocument: PageTreeDocument
}

export function WebflowEditor({ initialDocument }: WebflowEditorProps) {
  // Document state
  const [doc, setDoc] = useState<PageTreeDocument>(initialDocument)
  const [history, setHistory] = useState<PageTreeDocument[]>([])
  const [redoStack, setRedoStack] = useState<PageTreeDocument[]>([])

  // Editor UI state
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [activeDevice, setActiveDevice] = useState<DeviceMode>('desktop')
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  // Status & persistence state
  const [isDirty, setIsDirty] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null)
  const [publishSuccessMessage, setPublishSuccessMessage] = useState<string | null>(null)

  // Modals
  const [showInsertMenu, setShowInsertMenu] = useState(false)
  const [insertTarget, setInsertTarget] = useState<{ targetId: string; position: 'before' | 'after' } | null>(null)
  const [showSnapshotsModal, setShowSnapshotsModal] = useState(false)
  const [snapshots, setSnapshots] = useState<PageTreeSnapshot[]>([])
  const [loadingSnapshots, setLoadingSnapshots] = useState(false)

  // Autosave timeout ref
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null)

  // ─── 1. RECORD HISTORY FOR UNDO / REDO ────────────────────────────────────

  const pushHistory = useCallback(
    (newDoc: PageTreeDocument) => {
      setHistory((prev) => [...prev.slice(-25), doc])
      setRedoStack([])
      setDoc(newDoc)
      setIsDirty(true)
    },
    [doc]
  )

  const handleUndo = useCallback(() => {
    if (history.length === 0) return
    const prev = history[history.length - 1]
    setRedoStack((r) => [doc, ...r])
    setHistory((h) => h.slice(0, -1))
    setDoc(prev)
    setIsDirty(true)
  }, [history, doc])

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return
    const next = redoStack[0]
    setHistory((h) => [...h, doc])
    setRedoStack((r) => r.slice(1))
    setDoc(next)
    setIsDirty(true)
  }, [redoStack, doc])

  // ─── 2. AUTOSAVE EFFECT ───────────────────────────────────────────────────

  useEffect(() => {
    if (!isDirty) return

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current)
    }

    autosaveTimerRef.current = setTimeout(async () => {
      setIsSavingDraft(true)
      try {
        await saveDraftAction(doc)
        setLastSavedTime(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
        setIsDirty(false)
      } catch (err) {
        console.error('Autosave error:', err)
      } finally {
        setIsSavingDraft(false)
      }
    }, 1500)

    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current)
    }
  }, [doc, isDirty])

  // ─── 3. PREVENT UNLOAD IF DIRTY ───────────────────────────────────────────

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  // ─── 4. GLOBAL KEYBOARD SHORTCUTS ─────────────────────────────────────────

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement
      const isTyping =
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        activeEl?.getAttribute('contenteditable') === 'true'

      // Undo (Ctrl+Z / Cmd+Z)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        if (!isTyping) {
          e.preventDefault()
          handleUndo()
        }
      }

      // Redo (Ctrl+Y / Cmd+Shift+Z)
      if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        if (!isTyping) {
          e.preventDefault()
          handleRedo()
        }
      }

      // Save Draft (Ctrl+S / Cmd+S)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        saveDraftAction(doc)
        setLastSavedTime(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }))
        setIsDirty(false)
      }

      // Duplicate (Ctrl+D / Cmd+D)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        if (selectedId && !isTyping) {
          e.preventDefault()
          const next = duplicateElementInTree(doc.elements, selectedId)
          pushHistory({ ...doc, elements: next })
        }
      }

      // Delete (Delete / Backspace)
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId && !isTyping) {
        e.preventDefault()
        const next = deleteElementFromTree(doc.elements, selectedId)
        setSelectedId(null)
        pushHistory({ ...doc, elements: next })
      }

      // Escape to deselect
      if (e.key === 'Escape') {
        setSelectedId(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [doc, selectedId, handleUndo, handleRedo, pushHistory])

  // ─── 5. ELEMENT ACTIONS ───────────────────────────────────────────────────

  const handleUpdateStyles = (styles: Partial<ElementStyles>, isMobileOverride: boolean = false) => {
    if (!selectedId) return

    const updated = updateElementInTree(doc.elements, selectedId, (el) => {
      if (isMobileOverride) {
        return {
          ...el,
          responsiveStyles: {
            ...el.responsiveStyles,
            mobile: {
              ...el.responsiveStyles?.mobile,
              ...styles,
            },
          },
        }
      } else {
        return {
          ...el,
          styles: {
            ...el.styles,
            ...styles,
          },
        }
      }
    })

    pushHistory({ ...doc, elements: updated })
  }

  const handleUpdateElement = (partial: Partial<PageElement>) => {
    if (!selectedId) return
    const updated = updateElementInTree(doc.elements, selectedId, (el) => ({
      ...el,
      ...partial,
    }))
    pushHistory({ ...doc, elements: updated })
  }

  const handleUpdateContent = (id: string, newContent: string) => {
    const updated = updateElementInTree(doc.elements, id, (el) => ({
      ...el,
      content: newContent,
    }))
    pushHistory({ ...doc, elements: updated })
  }

  const handleDeleteSelected = () => {
    if (!selectedId) return
    const updated = deleteElementFromTree(doc.elements, selectedId)
    setSelectedId(null)
    pushHistory({ ...doc, elements: updated })
  }

  const handleDuplicateSelected = () => {
    if (!selectedId) return
    const updated = duplicateElementInTree(doc.elements, selectedId)
    pushHistory({ ...doc, elements: updated })
  }

  const handleMoveSelected = (direction: 'up' | 'down') => {
    if (!selectedId) return
    const updated = moveElementInTree(doc.elements, selectedId, direction)
    pushHistory({ ...doc, elements: updated })
  }

  const handleToggleHideSelected = () => {
    if (!selectedId) return
    const updated = updateElementInTree(doc.elements, selectedId, (el) => ({
      ...el,
      hidden: !el.hidden,
    }))
    pushHistory({ ...doc, elements: updated })
  }

  const handleOpenInsertSibling = (targetId: string, position: 'before' | 'after') => {
    setInsertTarget({ targetId, position })
    setShowInsertMenu(true)
  }

  const handleInsertElementType = (type: ElementType) => {
    const newEl = createDefaultElement(type)

    if (insertTarget) {
      const updated = insertSiblingInTree(
        doc.elements,
        insertTarget.targetId,
        insertTarget.position,
        newEl
      )
      pushHistory({ ...doc, elements: updated })
      setSelectedId(newEl.id)
    } else {
      // Append to bottom
      pushHistory({ ...doc, elements: [...doc.elements, newEl] })
      setSelectedId(newEl.id)
    }

    setInsertTarget(null)
  }

  // ─── 6. PUBLISH ACTION ────────────────────────────────────────────────────

  const handlePublish = async () => {
    setIsPublishing(true)
    setPublishSuccessMessage(null)

    try {
      const res = await publishAction(doc)
      if (res.success) {
        setIsDirty(false)
        setPublishSuccessMessage('Page d’accueil publiée avec succès sur la boutique !')
        setTimeout(() => setPublishSuccessMessage(null), 4000)
      } else {
        alert('Erreur lors de la publication : ' + res.error)
      }
    } catch (err: any) {
      alert('Erreur : ' + err.message)
    } finally {
      setIsPublishing(false)
    }
  }

  // ─── 7. SNAPSHOTS HISTORY ─────────────────────────────────────────────────

  const handleOpenSnapshots = async () => {
    setShowSnapshotsModal(true)
    setLoadingSnapshots(true)
    try {
      const res = await getSnapshotsAction()
      if (res.success) {
        setSnapshots(res.snapshots)
      }
    } finally {
      setLoadingSnapshots(false)
    }
  }

  const handleRestoreSnapshot = async (snapshotId: string) => {
    if (confirm('Restaurer cette version dans l’éditeur ? Les modifications non publiées seront remplacées.')) {
      setLoadingSnapshots(true)
      try {
        const res = await restoreSnapshotAction(snapshotId)
        if (res.success && res.document) {
          pushHistory(res.document)
          setShowSnapshotsModal(false)
        }
      } finally {
        setLoadingSnapshots(false)
      }
    }
  }

  // Current selected element
  const selectedElement = selectedId ? findElement(doc.elements, selectedId) : null
  const breadcrumbs = selectedId ? findBreadcrumbs(doc.elements, selectedId) : []

  // Device width calculation
  const deviceWidthClass =
    activeDevice === 'mobile'
      ? 'max-w-[390px] border-x border-neutral-800 shadow-2xl rounded-3xl overflow-hidden my-6 min-h-screen'
      : activeDevice === 'tablet'
      ? 'max-w-[768px] border-x border-neutral-800 shadow-2xl rounded-2xl overflow-hidden my-6 min-h-screen'
      : 'w-full'

  return (
    <div className="min-h-screen bg-[#050504] text-white flex flex-col antialiased selection:bg-amber-400 selection:text-black">
      {/* ─── TOPBAR DE L'ÉDITEUR WEBFLOW / FRAMER ───────────────────────────────── */}
      <header className="sticky top-0 z-40 h-14 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/90 px-4 flex items-center justify-between gap-3">
        {/* Gauche : Retour & Titre */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Éditeur In-Page
            </span>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full hidden md:inline">
              Framer Engine v1.0
            </span>
          </div>
        </div>

        {/* Centre : Switcher Responsive (Desktop / Tablette / Mobile) */}
        <div className="flex items-center bg-neutral-900/90 border border-neutral-800 rounded-xl p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setActiveDevice('desktop')}
            className={`p-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              activeDevice === 'desktop'
                ? 'bg-amber-400 text-black font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="Aperçu Ordinateur (Plein Écran)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden sm:inline">Bureau</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDevice('tablet')}
            className={`p-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              activeDevice === 'tablet'
                ? 'bg-amber-400 text-black font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="Aperçu Tablette (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden sm:inline">Tablette</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDevice('mobile')}
            className={`p-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer relative ${
              activeDevice === 'mobile'
                ? 'bg-amber-400 text-black font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="Aperçu Smartphone (390px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Droite : Undo/Redo, Snapshots, Mode Aperçu, Publier */}
        <div className="flex items-center gap-2">
          {/* Undo / Redo */}
          <div className="hidden md:flex items-center gap-1 border-r border-neutral-800 pr-2">
            <button
              type="button"
              disabled={history.length === 0}
              onClick={handleUndo}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 transition cursor-pointer"
              title="Annuler (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={redoStack.length === 0}
              onClick={handleRedo}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 transition cursor-pointer"
              title="Rétablir (Ctrl+Y)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Snapshots / Version History */}
          <button
            type="button"
            onClick={handleOpenSnapshots}
            className="p-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition flex items-center gap-1.5 text-xs cursor-pointer"
            title="Historique des publications (Snapshots)"
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline text-[11px]">Historique</span>
          </button>

          {/* Mode Aperçu (Eye toggle) */}
          <button
            type="button"
            onClick={() => {
              setIsPreviewMode(!isPreviewMode)
              setSelectedId(null)
            }}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
              isPreviewMode
                ? 'bg-amber-400 text-black border-amber-400 font-bold'
                : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-300'
            }`}
            title="Masquer les outils pour voir le site comme un visiteur"
          >
            {isPreviewMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isPreviewMode ? 'Éditer' : 'Aperçu'}</span>
          </button>

          {/* Autosave badge */}
          <div className="hidden xl:flex items-center gap-1.5 text-[10px] font-mono text-neutral-400">
            {isSavingDraft ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
                <span>Enregistrement...</span>
              </>
            ) : lastSavedTime ? (
              <>
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                <span>Brouillon {lastSavedTime}</span>
              </>
            ) : null}
          </div>

          {/* Bouton Publier sur la boutique */}
          <button
            type="button"
            disabled={isPublishing}
            onClick={handlePublish}
            className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-400/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
          >
            {isPublishing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Publication...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Publier</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Success Notification Bar */}
      {publishSuccessMessage && (
        <div className="bg-emerald-500 text-black font-bold text-xs py-2 px-4 text-center flex items-center justify-center gap-2 animate-in slide-in-from-top duration-200">
          <CheckCircle className="w-4 h-4" />
          <span>{publishSuccessMessage}</span>
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="underline ml-2 flex items-center gap-1 text-[11px] font-mono"
          >
            Voir la boutique en direct <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* ─── CANVAS AREA ──────────────────────────────────────────────────────── */}
      <div
        className="flex-1 overflow-x-hidden flex justify-center bg-[#050504] relative"
        onClick={() => {
          if (!isPreviewMode) setSelectedId(null)
        }}
      >
        <div className={`${deviceWidthClass} transition-all duration-300 bg-[#080807] shadow-black`}>
          {doc.elements.map((element) => (
            <ElementRenderer
              key={element.id}
              element={element}
              isEditor={!isPreviewMode}
              selectedId={selectedId}
              hoveredId={hoveredId}
              activeDevice={activeDevice}
              onSelect={(id, e) => {
                setSelectedId(id)
              }}
              onHover={(id) => setHoveredId(id)}
              onUpdateContent={handleUpdateContent}
              onInsertSibling={handleOpenInsertSibling}
              onDeleteElement={(id) => {
                const next = deleteElementFromTree(doc.elements, id)
                setSelectedId(null)
                pushHistory({ ...doc, elements: next })
              }}
              onDuplicateElement={(id) => {
                const next = duplicateElementInTree(doc.elements, id)
                pushHistory({ ...doc, elements: next })
              }}
              onMoveElement={(id, dir) => {
                const next = moveElementInTree(doc.elements, id, dir)
                pushHistory({ ...doc, elements: next })
              }}
            />
          ))}

          {/* Add Section at bottom */}
          {!isPreviewMode && (
            <div className="p-12 text-center border-t border-dashed border-neutral-800/80">
              <button
                type="button"
                onClick={() => {
                  setInsertTarget(null)
                  setShowInsertMenu(true)
                }}
                className="px-6 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Ajouter un bloc à la page</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── FLOATING TOOLBAR (ATTACHED TO SELECTED ELEMENT) ─────────────────── */}
      {!isPreviewMode && selectedElement && (
        <FloatingToolbar
          element={selectedElement}
          breadcrumbs={breadcrumbs}
          activeDevice={activeDevice}
          onUpdateStyles={handleUpdateStyles}
          onUpdateElement={handleUpdateElement}
          onSelectElement={(id) => setSelectedId(id)}
          onDelete={handleDeleteSelected}
          onDuplicate={handleDuplicateSelected}
          onMove={handleMoveSelected}
          onToggleHide={handleToggleHideSelected}
          onClose={() => setSelectedId(null)}
        />
      )}

      {/* ─── INSERT MODAL ────────────────────────────────────────────────────── */}
      <InsertMenu
        isOpen={showInsertMenu}
        onClose={() => {
          setShowInsertMenu(false)
          setInsertTarget(null)
        }}
        onSelectType={handleInsertElementType}
      />

      {/* ─── SNAPSHOTS HISTORY MODAL ─────────────────────────────────────────── */}
      <SnapshotsModal
        isOpen={showSnapshotsModal}
        snapshots={snapshots}
        loading={loadingSnapshots}
        onClose={() => setShowSnapshotsModal(false)}
        onRestore={handleRestoreSnapshot}
      />
    </div>
  )
}
