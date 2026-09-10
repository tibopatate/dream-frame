'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { CockpitSidebar } from './CockpitSidebar'
import { CockpitTopBar } from './CockpitTopBar'
import { CockpitPreview } from './CockpitPreview'
import { PageSectionsPanel } from './panels/PageSectionsPanel'
import { SectionInspectorPanel } from './panels/SectionInspectorPanel'
import { GlobalStylePanel } from './panels/GlobalStylePanel'
import { DashboardPanel } from './panels/DashboardPanel'
import { SnapshotsModal } from '@/components/page-builder/SnapshotsModal'
import {
  saveDraftAction,
  publishAction,
  getSnapshotsAction,
  restoreSnapshotAction,
} from '@/app/(admin)/admin/personnalisation/actions'
import type { PageTreeDocument, PageTreeSnapshot, PageSection, SectionType } from '@/lib/page-builder/types'

// ─── Add Section Modal ────────────────────────────────────────────────
import {
  ImageIcon,
  Grid3X3,
  Layers,
  Sparkles,
  Settings2,
  FileText,
  HelpCircle,
  Home,
  LayoutTemplate,
  X,
  Plus,
  Compass,
  Search,
  Settings,
  Globe,
  Plug,
  Type as TypeIcon,
} from 'lucide-react'

const AVAILABLE_SECTIONS: { type: SectionType; name: string; desc: string; icon: any }[] = [
  { type: 'hero', name: 'Hero / Bannière', desc: 'Image plein écran avec titre et bouton', icon: ImageIcon },
  { type: 'collection', name: 'Collection', desc: 'Grille de produits / cadres', icon: Grid3X3 },
  { type: 'craft', name: 'Savoir-Faire', desc: 'Processus de fabrication en étapes', icon: Layers },
  { type: 'custom_atelier', name: 'Atelier Sur-Mesure', desc: 'Invitation vers le configurateur', icon: Settings2 },
  { type: 'interiors', name: 'Mise en situation', desc: 'Photos en intérieur', icon: Home },
  { type: 'about', name: 'Qui sommes-nous', desc: 'Présentation de la marque', icon: FileText },
  { type: 'faq', name: 'FAQ', desc: 'Questions fréquentes', icon: HelpCircle },
  { type: 'banner', name: 'Bannière texte', desc: 'Bannière avec message', icon: LayoutTemplate },
]

// ─── Placeholder Panels ───────────────────────────────────────────────
function PlaceholderPanel({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500 mt-1">{desc}</p>
      </div>
      <div className="p-8 bg-white rounded-xl border border-slate-200 text-center">
        <p className="text-sm text-slate-400">Cette fonctionnalité sera disponible prochainement.</p>
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════
// MAIN COCKPIT LAYOUT
// ═════════════════════════════════════════════════════════════════════

interface CockpitLayoutProps {
  initialDocument: PageTreeDocument
}

export function CockpitLayout({ initialDocument }: CockpitLayoutProps) {
  // ─── Core State ─────────────────────────────────────────────────────
  const [doc, setDoc] = useState<PageTreeDocument>(initialDocument)
  const [history, setHistory] = useState<PageTreeDocument[]>([])
  const [redoStack, setRedoStack] = useState<PageTreeDocument[]>([])

  // ─── Navigation ─────────────────────────────────────────────────────
  const [activeCategory, setActiveCategory] = useState('homepage')
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null)
  const [showGlobalStyle, setShowGlobalStyle] = useState(false)

  // ─── Preview ────────────────────────────────────────────────────────
  const [activeDevice, setActiveDevice] = useState<'desktop' | 'mobile'>('desktop')

  // ─── Persistence ────────────────────────────────────────────────────
  const [isDirty, setIsDirty] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null)
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null)

  // ─── Modals ─────────────────────────────────────────────────────────
  const [showAddSection, setShowAddSection] = useState(false)
  const [showSnapshots, setShowSnapshots] = useState(false)
  const [snapshots, setSnapshots] = useState<PageTreeSnapshot[]>([])
  const [loadingSnapshots, setLoadingSnapshots] = useState(false)

  // ─── Drag & Drop ────────────────────────────────────────────────────
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  // ─── Active Section Helper ──────────────────────────────────────────
  const activeSection = activeSectionId
    ? doc.sections.find((s) => s.id === activeSectionId) || null
    : null

  // ─── History Push ───────────────────────────────────────────────────
  const pushState = useCallback((newDoc: PageTreeDocument) => {
    setHistory((prev) => [...prev.slice(-24), doc])
    setRedoStack([])
    setDoc(newDoc)
    setIsDirty(true)

    // Autosave debounce
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current)
    autosaveTimerRef.current = setTimeout(async () => {
      try {
        await saveDraftAction(newDoc)
        setLastSavedTime(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }))
      } catch (err) {
        console.error('Autosave failed:', err)
      }
    }, 1500)
  }, [doc])

  // ─── Undo / Redo ────────────────────────────────────────────────────
  const handleUndo = useCallback(() => {
    if (history.length === 0) return
    const prev = history[history.length - 1]
    setRedoStack((r) => [...r, doc])
    setHistory((h) => h.slice(0, -1))
    setDoc(prev)
    setIsDirty(true)
  }, [history, doc])

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return
    const next = redoStack[redoStack.length - 1]
    setHistory((h) => [...h, doc])
    setRedoStack((r) => r.slice(0, -1))
    setDoc(next)
    setIsDirty(true)
  }, [redoStack, doc])

  // ─── Section Mutations ──────────────────────────────────────────────
  const handleUpdateSectionSettings = useCallback((sectionId: string, updates: Record<string, any>) => {
    const newDoc = {
      ...doc,
      sections: doc.sections.map((s) =>
        s.id === sectionId ? { ...s, settings: { ...s.settings, ...updates } } : s
      ),
    }
    pushState(newDoc)
  }, [doc, pushState])

  const handleToggleSection = useCallback((sectionId: string) => {
    const newDoc = {
      ...doc,
      sections: doc.sections.map((s) =>
        s.id === sectionId ? { ...s, hidden: !s.hidden } : s
      ),
    }
    pushState(newDoc)
  }, [doc, pushState])

  const handleMoveSection = useCallback((index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= doc.sections.length) return
    const next = [...doc.sections]
    ;[next[index], next[targetIndex]] = [next[targetIndex], next[index]]
    pushState({ ...doc, sections: next })
  }, [doc, pushState])

  const handleDeleteSection = useCallback((sectionId: string) => {
    pushState({ ...doc, sections: doc.sections.filter((s) => s.id !== sectionId) })
    if (activeSectionId === sectionId) setActiveSectionId(null)
  }, [doc, pushState, activeSectionId])

  const handleAddSection = useCallback((type: SectionType) => {
    const id = `sec-${type}-${Date.now()}`
    const section = AVAILABLE_SECTIONS.find((s) => s.type === type)
    const newSection: PageSection = {
      id,
      type,
      name: section?.name || type,
      settings: {},
    }
    pushState({ ...doc, sections: [...doc.sections, newSection] })
    setShowAddSection(false)
    setActiveSectionId(id)
  }, [doc, pushState])

  // ─── Drag & Drop Handlers ──────────────────────────────────────────
  const handleDragStart = useCallback((index: number) => setDraggedIndex(index), [])
  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }, [])
  const handleDrop = useCallback((index: number) => {
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }
    const next = [...doc.sections]
    const [moved] = next.splice(draggedIndex, 1)
    next.splice(index, 0, moved)
    pushState({ ...doc, sections: next })
    setDraggedIndex(null)
    setDragOverIndex(null)
  }, [doc, draggedIndex, pushState])

  // ─── Publish ────────────────────────────────────────────────────────
  const handleSavePublish = useCallback(async () => {
    setIsPublishing(true)
    try {
      await publishAction(doc)
      setIsDirty(false)
      setLastSavedTime(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }))
    } catch (err) {
      console.error('Publish failed:', err)
    } finally {
      setIsPublishing(false)
    }
  }, [doc])

  // ─── Snapshots ──────────────────────────────────────────────────────
  const handleShowHistory = useCallback(async () => {
    setLoadingSnapshots(true)
    setShowSnapshots(true)
    try {
      const res = await getSnapshotsAction()
      if (res.success && res.snapshots) {
        setSnapshots(res.snapshots)
      }
    } catch (err) {
      console.error('Failed to load snapshots:', err)
    } finally {
      setLoadingSnapshots(false)
    }
  }, [])

  const handleRestoreSnapshot = useCallback(async (snapshotId: string) => {
    try {
      const res = await restoreSnapshotAction(snapshotId)
      if (res.success && res.document) {
        setDoc(res.document)
        setShowSnapshots(false)
        setIsDirty(true)
      }
    } catch (err) {
      console.error('Restore failed:', err)
    }
  }, [])

  // ─── Category Change ────────────────────────────────────────────────
  const handleCategoryChange = useCallback((category: string) => {
    setActiveCategory(category)
    setActiveSectionId(null)
    setShowGlobalStyle(category === 'design')
  }, [])

  // ─── Beforeunload ───────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])

  // ─── Render Center Panel ────────────────────────────────────────────
  const renderCenterPanel = () => {
    // If a section is selected, show the inspector
    if (activeSection && (activeCategory === 'homepage' || activeCategory === 'catalogue' || activeCategory === 'products')) {
      return (
        <SectionInspectorPanel
          section={activeSection}
          onBack={() => setActiveSectionId(null)}
          onUpdateSettings={handleUpdateSectionSettings}
          onDeleteSection={handleDeleteSection}
        />
      )
    }

    switch (activeCategory) {
      case 'dashboard':
        return <DashboardPanel />
      case 'homepage':
        return (
          <PageSectionsPanel
            sections={doc.sections}
            activeSectionId={activeSectionId}
            hoveredSectionId={hoveredSectionId}
            onSelectSection={setActiveSectionId}
            onHoverSection={setHoveredSectionId}
            onToggleSection={handleToggleSection}
            onMoveSection={handleMoveSection}
            onDeleteSection={handleDeleteSection}
            onAddSection={() => setShowAddSection(true)}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        )
      case 'catalogue':
        return <PlaceholderPanel title="Catalogue / Collection" desc="Gérez vos collections et catégories de cadres." />
      case 'products':
        return <PlaceholderPanel title="Produits / Articles" desc="Ajoutez et modifiez vos produits." />
      case 'pages':
        return <PlaceholderPanel title="Pages statiques" desc="Gérez les pages secondaires de votre site." />
      case 'design':
        return <PlaceholderPanel title="Design & Apparence" desc="Personnalisez le style global de votre site. Utilisez le panneau Style global à droite." />
      case 'navigation':
        return <PlaceholderPanel title="Navigation & Menu" desc="Configurez la navigation de votre site." />
      case 'fonts':
        return <PlaceholderPanel title="Polices & Typographies" desc="Choisissez les polices de votre site." />
      case 'seo':
        return <PlaceholderPanel title="SEO & Référencement" desc="Optimisez votre site pour les moteurs de recherche." />
      case 'settings':
        return <PlaceholderPanel title="Paramètres de base" desc="Nom, logo, coordonnées et paramètres généraux." />
      case 'domain':
        return <PlaceholderPanel title="Domaine & Hébergement" desc="Gérez votre nom de domaine et hébergement." />
      case 'integrations':
        return <PlaceholderPanel title="Intégrations" desc="Connectez des outils externes à votre site." />
      case 'help':
        return <PlaceholderPanel title="Aide & Support" desc="Documentation et guides d'utilisation." />
      default:
        return <DashboardPanel />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* ─── TOP BAR ─── */}
      <CockpitTopBar
        currentPage="Page d'accueil"
        activeDevice={activeDevice}
        onDeviceChange={setActiveDevice}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={history.length > 0}
        canRedo={redoStack.length > 0}
        onSavePublish={handleSavePublish}
        onShowHistory={handleShowHistory}
        isPublishing={isPublishing}
        isDirty={isDirty}
        lastSavedTime={lastSavedTime}
      />

      {/* ─── BODY ─── */}
      <div className="flex-1 flex overflow-hidden">
        {/* 1. SIDEBAR */}
        <CockpitSidebar
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* 2. CENTER PANEL */}
        <div className="w-[420px] flex-shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
          {renderCenterPanel()}
        </div>

        {/* 3. PREVIEW */}
        <CockpitPreview
          sections={doc.sections}
          activeDevice={activeDevice}
          activeSectionId={activeSectionId}
          hoveredSectionId={hoveredSectionId}
          onSelectSection={(id) => {
            setActiveSectionId(id)
            setActiveCategory('homepage')
          }}
          onHoverSection={setHoveredSectionId}
        />

        {/* 4. GLOBAL STYLE (conditional) */}
        {showGlobalStyle && <GlobalStylePanel onClose={() => setShowGlobalStyle(false)} />}
      </div>

      {/* ─── ADD SECTION MODAL ─── */}
      {showAddSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="fixed inset-0" onClick={() => setShowAddSection(false)} />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Ajouter une section</h3>
                <p className="text-xs text-slate-500 mt-0.5">Choisissez un type de section à ajouter.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddSection(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto">
              {AVAILABLE_SECTIONS.map((sec) => {
                const Icon = sec.icon
                return (
                  <button
                    key={sec.type}
                    type="button"
                    onClick={() => handleAddSection(sec.type)}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200 hover:border-red-300 hover:bg-red-50/30 transition text-left cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{sec.name}</p>
                      <p className="text-xs text-slate-400">{sec.desc}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── SNAPSHOTS MODAL ─── */}
      {showSnapshots && (
        <SnapshotsModal
          isOpen={showSnapshots}
          snapshots={snapshots}
          loading={loadingSnapshots}
          onRestore={handleRestoreSnapshot}
          onClose={() => setShowSnapshots(false)}
        />
      )}
    </div>
  )
}
