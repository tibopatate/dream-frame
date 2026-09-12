'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import {
  PageTreeDocument,
  PageSection,
  SectionType,
  PageTreeSnapshot,
  DeviceMode,
} from '@/lib/page-builder/types'
import { SectionRenderer } from './SectionRenderer'
import { SnapshotsModal } from './SnapshotsModal'
import { ProductImageUploader } from '@/components/admin/ProductImageUploader'
import { isVideoUrl } from '@/lib/utils'
import {
  saveDraftAction,
  publishAction,
  getSnapshotsAction,
  restoreSnapshotAction,
} from '@/app/(admin)/admin/personnalisation/actions'
import {
  GripVertical,
  ChevronLeft,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Monitor,
  Smartphone,
  Undo2,
  Redo2,
  History,
  CheckCircle,
  Loader2,
  ExternalLink,
  Sparkles,
  Layers,
  Package,
  ShieldCheck,
  Zap,
  LayoutTemplate,
  X,
  UploadCloud,
  ImageIcon,
  Info,
  MessageCircleQuestion,
} from 'lucide-react'

const SECTION_TYPE_ICONS: Record<string, any> = {
  hero: Sparkles,
  demo: Zap,
  collection: Package,
  craft: Layers,
  reassurance: ShieldCheck,
  custom_atelier: LayoutTemplate,
  interiors: ImageIcon,
  about: Info,
  faq: MessageCircleQuestion,
}

const AVAILABLE_SECTIONS: { type: SectionType; name: string; desc: string; icon: any }[] = [
  {
    type: 'hero',
    name: 'Hero Supercar',
    desc: 'Grand bandeau photographique avec zoom, titre et 2 boutons',
    icon: Sparkles,
  },
  {
    type: 'demo',
    name: 'Démonstration 3D (LED & Angles)',
    desc: 'Module interactif avec commutateur LED et 3 ambiances d’intérieur',
    icon: Zap,
  },
  {
    type: 'collection',
    name: 'Catalogue Cadres 3D',
    desc: 'Grille des supercars de collection avec prix et bouton d’achat',
    icon: Package,
  },
  {
    type: 'interiors',
    name: 'Galerie Intérieurs',
    desc: 'Laissez-les sublimer votre pièce',
    icon: ImageIcon,
  },
  {
    type: 'craft',
    name: 'Savoir-Faire (5 Couches)',
    desc: 'Présentation de l’ébénisterie, découpe laser et verre HD',
    icon: Layers,
  },
  {
    type: 'reassurance',
    name: 'Engagements & Réassurance',
    desc: 'Livraison offerte, droit de rétractation et fabrication française',
    icon: ShieldCheck,
  },
  {
    type: 'about',
    name: 'Qui sommes-nous',
    desc: 'Histoire de la marque',
    icon: Info,
  },
  {
    type: 'faq',
    name: 'Foire Aux Questions',
    desc: 'Section de questions réponses',
    icon: MessageCircleQuestion,
  },
  {
    type: 'custom_atelier',
    name: 'Atelier Sur-Mesure',
    desc: 'Invitation vers le configurateur interactif',
    icon: LayoutTemplate,
  },
]

export function ShopifyThemeEditor({ initialDocument }: { initialDocument: PageTreeDocument }) {
  const [doc, setDoc] = useState<PageTreeDocument>(initialDocument)
  const [history, setHistory] = useState<PageTreeDocument[]>([])
  const [redoStack, setRedoStack] = useState<PageTreeDocument[]>([])

  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null)

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const [activeDevice, setActiveDevice] = useState<DeviceMode>('desktop')

  const [isDirty, setIsDirty] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null)
  const [publishSuccessMessage, setPublishSuccessMessage] = useState<string | null>(null)

  const [showAddSectionModal, setShowAddSectionModal] = useState(false)
  const [showSnapshotsModal, setShowSnapshotsModal] = useState(false)
  const [snapshots, setSnapshots] = useState<PageTreeSnapshot[]>([])
  const [loadingSnapshots, setLoadingSnapshots] = useState(false)

  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null)

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

  useEffect(() => {
    if (!isDirty) return

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current)
    }

    autosaveTimerRef.current = setTimeout(async () => {
      setIsSavingDraft(true)
      try {
        await saveDraftAction(doc)
        setLastSavedTime(
          new Date().toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
        )
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

  const handleDragStart = (idx: number) => {
    setDraggedIndex(idx)
  }

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    if (dragOverIndex !== idx) setDragOverIndex(idx)
  }

  const handleDrop = (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    const sections = [...doc.sections]
    const [moved] = sections.splice(draggedIndex, 1)
    sections.splice(dropIndex, 0, moved)

    pushHistory({ ...doc, sections })
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleMoveSection = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1
    if (targetIdx < 0 || targetIdx >= doc.sections.length) return
    const sections = [...doc.sections]
    const temp = sections[idx]
    sections[idx] = sections[targetIdx]
    sections[targetIdx] = temp
    pushHistory({ ...doc, sections })
  }

  const handleToggleHide = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const sections = doc.sections.map((sec) =>
      sec.id === id ? { ...sec, hidden: !sec.hidden } : sec
    )
    pushHistory({ ...doc, sections })
  }

  const handleDeleteSection = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (confirm('Voulez-vous supprimer cette section de la page ?')) {
      const sections = doc.sections.filter((sec) => sec.id !== id)
      if (activeSectionId === id) setActiveSectionId(null)
      pushHistory({ ...doc, sections })
    }
  }

  const handleUpdateSectionSettings = (sectionId: string, newSettings: Record<string, any>) => {
    const sections = doc.sections.map((sec) => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          settings: {
            ...sec.settings,
            ...newSettings,
          },
        }
      }
      return sec
    })
    pushHistory({ ...doc, sections })
  }

  const handleAddSection = (type: SectionType) => {
    const tmpl = AVAILABLE_SECTIONS.find((s) => s.type === type)
    const newSection: PageSection = {
      id: `sec-${type}-${Date.now()}`,
      type,
      name: tmpl?.name || type,
      settings: {},
    }

    if (type === 'hero') {
      newSection.settings = {
        badgeText: 'Atelier Français · Cadres Décoratifs Supercars',
        title: "L'art de la supercar, sculpté en relief 3D.",
        subtitle: 'Cadres d’ébénisterie automobile sous vitrage optique anti-UV avec rétroéclairage LED ambré intégré.',
        priceText: 'À partir de 49,99 € · Livraison Colissimo 100% Offerte.',
        primaryBtnText: 'Découvrir la Collection',
        primaryBtnLink: '/catalogue',
        secondaryBtnText: 'Créer mon Dream Frame',
        secondaryBtnLink: '/configurateur',
        bgImage: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=1200&auto=format&fit=crop',
      }
    } else if (type === 'collection') {
      newSection.settings = {
        badge: 'Catalogue Collector',
        title: "Nos Cadres 3D d'Art Automobile",
        startingPrice: '49,99 €',
        category: 'ALL',
        limit: 8,
      }
    }

    pushHistory({ ...doc, sections: [...doc.sections, newSection] })
    setActiveSectionId(newSection.id)
    setShowAddSectionModal(false)
  }

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

  const handleOpenSnapshots = async () => {
    setShowSnapshotsModal(true)
    setLoadingSnapshots(true)
    try {
      const res = await getSnapshotsAction()
      if (res.success) setSnapshots(res.snapshots)
    } finally {
      setLoadingSnapshots(false)
    }
  }

  const handleRestoreSnapshot = async (snapshotId: string) => {
    if (confirm('Restaurer cette version ?')) {
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

  const activeSection = doc.sections.find((s) => s.id === activeSectionId)

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col antialiased">
      {/* ─── TOPBAR SHOPIFY THEME EDITOR ──────────────────────────────────────── */}
      <header className="sticky top-0 z-50 h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 transition flex items-center gap-1.5 text-xs font-semibold"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Quitter</span>
          </Link>

          <div className="h-4 w-px bg-neutral-800" />

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900">Page d&apos;accueil</span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              Thème Actif
            </span>
          </div>
        </div>

        {/* Device Mode Switcher */}
        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveDevice('desktop')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              activeDevice === 'desktop'
                ? 'bg-red-600 text-black font-bold shadow'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Aperçu Ordinateur (Plein Écran)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium hidden sm:inline">Ordinateur</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDevice('mobile')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              activeDevice === 'mobile'
                ? 'bg-red-600 text-black font-bold shadow'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Aperçu Smartphone (390px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
            <button
              type="button"
              disabled={history.length === 0}
              onClick={handleUndo}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 transition cursor-pointer"
              title="Annuler (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={redoStack.length === 0}
              onClick={handleRedo}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 transition cursor-pointer"
              title="Rétablir (Ctrl+Y)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleOpenSnapshots}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 transition flex items-center gap-1.5 text-xs cursor-pointer"
            title="Historique des sauvegardes"
          >
            <History className="w-3.5 h-3.5 text-red-600" />
            <span className="hidden md:inline text-[11px]">Historique</span>
          </button>

          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 transition flex items-center gap-1.5 text-xs font-medium"
            title="Ouvrir la boutique dans un nouvel onglet"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px]">Boutique</span>
          </Link>

          <div className="hidden xl:flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
            {isSavingDraft ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-red-600" />
                <span>Enregistrement...</span>
              </>
            ) : lastSavedTime ? (
              <>
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                <span>Brouillon {lastSavedTime}</span>
              </>
            ) : null}
          </div>

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
                <span>Enregistrer &amp; Publier</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Notification Toast */}
      {publishSuccessMessage && (
        <div className="bg-emerald-500 text-black font-bold text-xs py-2 px-4 text-center flex items-center justify-center gap-2 animate-in slide-in-from-top duration-200 sticky top-14 z-40">
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

      {/* ─── BODY: PERSISTENT SIDEBAR + CANVAS ───────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ─── SIDEBAR GAUCHE PERMANENTE (STYLE SHOPIFY) ────────────────────── */}
        <aside className="w-80 sm:w-96 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col h-[calc(100vh-3.5rem)] sticky top-14 z-30">
          {activeSection ? (
            // ─── NIVEAU 2 : INSPECTEUR DE SECTION SÉLECTIONNÉE ───────────────
            <div className="flex-1 flex flex-col overflow-hidden animate-in slide-in-from-left-4 duration-200">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <button
                  type="button"
                  onClick={() => setActiveSectionId(null)}
                  className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-semibold transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Sections</span>
                </button>
                <span className="text-[10px] font-mono text-red-600 bg-red-600/10 border border-red-600/20 px-2 py-0.5 rounded-full uppercase font-bold">
                  {activeSection.type}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{activeSection.name}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Modifiez les options ci-dessous, le visuel s’actualise instantanément.
                  </p>
                </div>

                {/* HERO SETTINGS */}
                {activeSection.type === 'hero' && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-slate-500 font-bold">Badge en haut</label>
                      <input
                        type="text"
                        value={activeSection.settings.badgeText || ''}
                        onChange={(e) => handleUpdateSectionSettings(activeSection.id, { badgeText: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-slate-500 font-bold">Titre Principal</label>
                      <textarea
                        rows={2}
                        value={activeSection.settings.title || ''}
                        onChange={(e) => handleUpdateSectionSettings(activeSection.id, { title: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-slate-500 font-bold">Sous-titre descriptif</label>
                      <textarea
                        rows={3}
                        value={activeSection.settings.subtitle || ''}
                        onChange={(e) => handleUpdateSectionSettings(activeSection.id, { subtitle: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-slate-500 font-bold">Mention de prix &amp; livraison</label>
                      <input
                        type="text"
                        value={activeSection.settings.priceText || ''}
                        onChange={(e) => handleUpdateSectionSettings(activeSection.id, { priceText: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-600"
                      />
                    </div>

                    <div className="pt-2 border-t border-slate-200 space-y-2">
                      <label className="text-[10px] uppercase font-mono text-slate-500 font-bold block">Image ou Vidéo de fond Hero</label>
                      <ProductImageUploader
                        images={
                          (activeSection.settings.bgVideo || activeSection.settings.bgImage)
                            ? [activeSection.settings.bgVideo || activeSection.settings.bgImage]
                            : []
                        }
                        onChange={(imgs) => {
                          const url = imgs[0] || ''
                          if (!url) {
                            handleUpdateSectionSettings(activeSection.id, { bgImage: '', bgVideo: '' })
                          } else if (isVideoUrl(url)) {
                            handleUpdateSectionSettings(activeSection.id, { bgVideo: url, bgImage: url })
                          } else {
                            handleUpdateSectionSettings(activeSection.id, { bgImage: url, bgVideo: '' })
                          }
                        }}
                        maxImages={1}
                      />
                    </div>

                    <div className="pt-2 border-t border-slate-200 space-y-3">
                      <h4 className="text-[11px] font-bold text-neutral-200">Boutons d&apos;Action</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-1">Bouton 1 Texte</label>
                          <input
                            type="text"
                            value={activeSection.settings.primaryBtnText || ''}
                            onChange={(e) => handleUpdateSectionSettings(activeSection.id, { primaryBtnText: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-1">Bouton 1 Lien</label>
                          <input
                            type="text"
                            value={activeSection.settings.primaryBtnLink || ''}
                            onChange={(e) => handleUpdateSectionSettings(activeSection.id, { primaryBtnLink: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-1">Bouton 2 Texte</label>
                          <input
                            type="text"
                            value={activeSection.settings.secondaryBtnText || ''}
                            onChange={(e) => handleUpdateSectionSettings(activeSection.id, { secondaryBtnText: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-1">Bouton 2 Lien</label>
                          <input
                            type="text"
                            value={activeSection.settings.secondaryBtnLink || ''}
                            onChange={(e) => handleUpdateSectionSettings(activeSection.id, { secondaryBtnLink: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* COLLECTION SETTINGS */}
                {activeSection.type === 'collection' && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-slate-500 font-bold">Titre Collection</label>
                      <input
                        type="text"
                        value={activeSection.settings.title || ''}
                        onChange={(e) => handleUpdateSectionSettings(activeSection.id, { title: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-slate-500 font-bold">Catégorie affichée</label>
                      <select
                        value={activeSection.settings.category || 'ALL'}
                        onChange={(e) => handleUpdateSectionSettings(activeSection.id, { category: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                      >
                        <option value="ALL">Toutes les époques (8 Supercars)</option>
                        <option value="VINTAGE">Légendes Vintage Uniquement</option>
                        <option value="MODERN">Hypercars Modernes Uniquement</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-slate-500 font-bold">Nombre de cadres affichés</label>
                      <select
                        value={activeSection.settings.limit || 8}
                        onChange={(e) => handleUpdateSectionSettings(activeSection.id, { limit: Number(e.target.value) })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono"
                      >
                        <option value={4}>4 Cadres</option>
                        <option value={8}>8 Cadres (Recommandé)</option>
                        <option value={12}>12 Cadres</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* CRAFT SETTINGS */}
                {activeSection.type === 'craft' && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-slate-500 font-bold">Titre de la section</label>
                      <input
                        type="text"
                        value={activeSection.settings.title || ''}
                        onChange={(e) => handleUpdateSectionSettings(activeSection.id, { title: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-slate-500 font-bold">Sous-titre</label>
                      <textarea
                        rows={2}
                        value={activeSection.settings.desc || ''}
                        onChange={(e) => handleUpdateSectionSettings(activeSection.id, { desc: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                      />
                    </div>
                  </div>
                )}

                {/* DEMO SETTINGS */}
                {activeSection.type === 'demo' && (
                  <div className="p-4 rounded-xl bg-white border border-slate-200 text-slate-500 space-y-2">
                    <p className="font-bold text-slate-900">Module 3D Interactif</p>
                    <p className="text-[11px] leading-relaxed">
                      Ce module exclusif permet à vos visiteurs de tester en direct le rétroéclairage LED ambré, d’admirer les 3 angles sous vitrage et de visualiser le cadre dans 3 espaces d’intérieur (Bureau, Salon, Setup).
                    </p>
                  </div>
                )}

                {/* CUSTOM ATELIER SETTINGS */}
                {activeSection.type === 'custom_atelier' && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-slate-500 font-bold">Titre de l&apos;invitation</label>
                      <input
                        type="text"
                        value={activeSection.settings.title || ''}
                        onChange={(e) => handleUpdateSectionSettings(activeSection.id, { title: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-slate-500 font-bold">Texte du bouton CTA</label>
                      <input
                        type="text"
                        value={activeSection.settings.btnText || ''}
                        onChange={(e) => handleUpdateSectionSettings(activeSection.id, { btnText: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleDeleteSection(activeSection.id)}
                    className="w-full py-2.5 px-4 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Supprimer cette section</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // ─── NIVEAU 1 : LISTE DES SECTIONS AVEC GLISSER-DÉPOSER ───────────
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Sections de la page</h3>
                  <p className="text-[11px] text-slate-500">
                    Attrapez la poignée pour déplacer une section plus haut ou plus bas
                  </p>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded">
                  {doc.sections.length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {doc.sections.map((section, idx) => {
                  const Icon = SECTION_TYPE_ICONS[section.type] || LayoutTemplate
                  const isDragged = draggedIndex === idx
                  const isDragOver = dragOverIndex === idx
                  const isHovered = hoveredSectionId === section.id

                  return (
                    <div
                      key={section.id}
                      draggable
                      onDragStart={() => handleDragStart(idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDrop={() => handleDrop(idx)}
                      onMouseEnter={() => setHoveredSectionId(section.id)}
                      onMouseLeave={() => setHoveredSectionId(null)}
                      onClick={() => setActiveSectionId(section.id)}
                      className={`group relative flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                        isDragged
                          ? 'opacity-30 border-dashed border-red-600 bg-red-600/10'
                          : isDragOver
                          ? 'border-red-600 bg-red-600/20 scale-[1.02]'
                          : isHovered
                          ? 'bg-white border-slate-300'
                          : 'bg-white/60 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div
                          className="cursor-grab active:cursor-grabbing text-neutral-500 group-hover:text-red-600 transition"
                          title="Cliquer pour attraper et déplacer la section"
                        >
                          <GripVertical className="w-4 h-4" />
                        </div>

                        <div className="p-1.5 rounded-lg bg-neutral-800 text-red-600">
                          <Icon className="w-3.5 h-3.5" />
                        </div>

                        <div className="truncate">
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-300 transition truncate">
                            {section.name}
                          </h4>
                          <span className="text-[9px] font-mono text-neutral-500 uppercase">
                            {section.type}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMoveSection(idx, 'up')
                            }}
                            className="p-1 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-50 transition"
                            title="Monter"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                        )}

                        {idx < doc.sections.length - 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMoveSection(idx, 'down')
                            }}
                            className="p-1 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-50 transition"
                            title="Descendre"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={(e) => handleToggleHide(section.id, e)}
                          className="p-1 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-50 transition"
                          title={section.hidden ? 'Afficher' : 'Masquer'}
                        >
                          {section.hidden ? (
                            <EyeOff className="w-3 h-3 text-red-600" />
                          ) : (
                            <Eye className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="p-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddSectionModal(true)}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4 text-red-600" />
                  <span>Ajouter une section</span>
                </button>
              </div>
            </div>
          )}
        </aside>

        {/* ─── 2. CANVAS / PREVIEW (LE VRAI SITE RÉEL ET IDENTIQUE) ─────────── */}
        <main className="flex-1 overflow-y-auto bg-slate-100 flex justify-center p-0 relative">
          <div
            className={`transition-all duration-300 bg-[#080807] text-white shadow-2xl ${
              activeDevice === 'mobile'
                ? 'max-w-[390px] border-x border-slate-200 my-8 rounded-3xl overflow-hidden min-h-[844px] shadow-black'
                : 'w-full'
            }`}
          >
            {doc.sections.map((section, idx) => (
              <SectionRenderer
                key={section.id}
                section={section}
                isEditor={true}
                isSelected={activeSectionId === section.id}
                isHovered={hoveredSectionId === section.id}
                onSelect={() => setActiveSectionId(section.id)}
                onHover={(hovering) => setHoveredSectionId(hovering ? section.id : null)}
                onMoveUp={() => handleMoveSection(idx, 'up')}
                onMoveDown={() => handleMoveSection(idx, 'down')}
                onDelete={() => handleDeleteSection(section.id)}
              />
            ))}
          </div>
        </main>
      </div>

      {/* ─── MODALE D'AJOUT DE SECTION ────────────────────────────────────────── */}
      {showAddSectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={() => setShowAddSectionModal(false)} />
          <div className="relative z-10 w-full max-w-lg bg-white border border-slate-300 rounded-2xl shadow-2xl p-6 text-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold">Ajouter une Section</h3>
                <p className="text-xs text-slate-500">
                  Choisissez la section à intégrer sur votre vitrine
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddSectionModal(false)}
                className="p-1 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {AVAILABLE_SECTIONS.map((sec) => {
                const Icon = sec.icon
                return (
                  <button
                    key={sec.type}
                    type="button"
                    onClick={() => handleAddSection(sec.type)}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-slate-200 hover:border-red-600/60 hover:bg-slate-50/80 transition text-left cursor-pointer group"
                  >
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-red-600 group-hover:bg-red-600 group-hover:text-black transition flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-300 transition">
                        {sec.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-tight">{sec.desc}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── MODALE D'HISTORIQUE DE VERSIONS (20 SNAPSHOTS) ───────────────────── */}
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
