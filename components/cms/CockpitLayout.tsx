'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { CockpitSidebar } from './CockpitSidebar'
import { CockpitTopBar } from './CockpitTopBar'
import { CockpitPreview } from './CockpitPreview'
import { PageSectionsPanel } from './panels/PageSectionsPanel'
import { SectionInspectorPanel } from './panels/SectionInspectorPanel'
import { GlobalStylePanel } from './panels/GlobalStylePanel'
import { DashboardPanel } from './panels/DashboardPanel'
import { AnalyticsDashboard } from '@/components/admin/analytics/AnalyticsDashboard'
import { CataloguePanel } from './panels/CataloguePanel'
import { ProductsPanel } from './panels/ProductsPanel'
import { PagesPanel } from './panels/PagesPanel'
import { NavigationPanel } from './panels/NavigationPanel'
import { FontsPanel } from './panels/FontsPanel'
import { SEOPanel } from './panels/SEOPanel'
import { SettingsPanel } from './panels/SettingsPanel'
import { DomainPanel } from './panels/DomainPanel'
import { IntegrationsPanel } from './panels/IntegrationsPanel'
import { HelpPanel } from './panels/HelpPanel'
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
} from 'lucide-react'

const AVAILABLE_SECTIONS: { type: SectionType; name: string; desc: string; icon: any }[] = [
  { type: 'hero', name: 'Hero / Bannière Principale', desc: 'Image plein écran avec titre, sous-titre et boutons', icon: ImageIcon },
  { type: 'collection', name: 'Collection de Cadres', desc: 'Grille interactive de supercars avec prix et finitions', icon: Grid3X3 },
  { type: 'craft', name: 'Savoir-Faire & Anatomie', desc: 'Décomposition en 5 couches de fabrication d\'art', icon: Layers },
  { type: 'custom_atelier', name: 'Atelier Sur-Mesure', desc: 'Invitation vers le configurateur live A4 / A3 / A2', icon: Settings2 },
  { type: 'interiors', name: 'Mises en Situation', desc: 'Photographies d\'ambiance dans des intérieurs d\'exception', icon: Home },
  { type: 'about', name: 'Qui sommes-nous', desc: 'Histoire de la marque et ethos de l\'atelier', icon: FileText },
  { type: 'reassurance', name: 'Engagements & Garanties', desc: 'Livraison sécurisée, fabrication artisanale et support', icon: Sparkles },
  { type: 'demo', name: 'Module 3D Interactif', desc: 'Présentation de la technologie et des effets LED', icon: Sparkles },
  { type: 'faq', name: 'Foire Aux Questions', desc: 'Questions récurrentes sur les délais, les LED et la pose', icon: HelpCircle },
  { type: 'banner', name: 'Bannière de Réassurance', desc: 'Bandeau textuel avec message d\'annonce', icon: LayoutTemplate },
]

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

  // ─── Navigation & Panneau State ─────────────────────────────────────
  const [activeCategory, setActiveCategory] = useState('homepage')
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null)
  const [showGlobalStyle, setShowGlobalStyle] = useState(false)

  // ─── Layout Folding / Collapsible Sidebars ──────────────────────────
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isCenterPanelCollapsed, setIsCenterPanelCollapsed] = useState(false)

  // ─── Preview Device & Mobile Responsiveness ─────────────────────────
  const [activeDevice, setActiveDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor')
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

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

    // Autosave debounce 1.5s
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

  // ─── Snapshots History ──────────────────────────────────────────────
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
    setMobileView('editor')
    setIsMobileSidebarOpen(false)
    if (isCenterPanelCollapsed) setIsCenterPanelCollapsed(false)
  }, [isCenterPanelCollapsed])

  // ─── Beforeunload Warning ───────────────────────────────────────────
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

  // ─── Render Center Panel (Every single category is functional) ───────
  const renderCenterPanel = () => {
    // If a section is selected, show inspector directly
    if (activeSection && activeCategory === 'homepage') {
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
        return (
          <DashboardPanel
            onNavigate={handleCategoryChange}
            lastSavedTime={lastSavedTime}
          />
        )
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
        return (
          <CataloguePanel
            onSelectCollectionSection={() => {
              const colSec = doc.sections.find((s) => s.type === 'collection')
              if (colSec) {
                setActiveCategory('homepage')
                setActiveSectionId(colSec.id)
              }
            }}
          />
        )
      case 'products':
        return <ProductsPanel />
      case 'pages':
        return <PagesPanel />
      case 'design':
        return <GlobalStylePanel />
      case 'navigation':
        return <NavigationPanel />
      case 'fonts':
        return <FontsPanel />
      case 'seo':
        return <SEOPanel />
      case 'settings':
        return <SettingsPanel onNavigateToIntegrations={() => setActiveCategory('integrations')} />
      case 'domain':
        return <DomainPanel />
      case 'integrations':
        return <IntegrationsPanel />
      case 'help':
        return <HelpPanel />
      default:
        return <DashboardPanel onNavigate={handleCategoryChange} lastSavedTime={lastSavedTime} />
    }
  }

  // Current page label
  const pageLabels: Record<string, string> = {
    dashboard: 'Tableau de bord',
    homepage: 'Page d\'accueil',
    catalogue: 'Catalogue / Collection',
    products: 'Produits / Articles',
    pages: 'Pages statiques',
    design: 'Design & Apparence',
    navigation: 'Navigation & Menu',
    fonts: 'Polices & Typographies',
    seo: 'SEO & Référencement',
    settings: 'Paramètres de base',
    domain: 'Domaine & Hébergement',
    integrations: 'Intégrations',
    help: 'Aide & Support',
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* ─── TOP BAR ─── */}
      <CockpitTopBar
        currentPage={pageLabels[activeCategory] || 'Page d\'accueil'}
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
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isCenterPanelCollapsed={isCenterPanelCollapsed}
        onToggleCenterPanel={() => setIsCenterPanelCollapsed(!isCenterPanelCollapsed)}
        mobileView={mobileView}
        onMobileViewChange={setMobileView}
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
      />

      {/* ─── BODY ─── */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* 1. SIDEBAR (Collapsible w-64 <-> w-16 sur desktop, drawer slide-over sur mobile) */}
        <CockpitSidebar
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* ─── CONDITIONAL VIEW: DASHBOARD (FULL) VS SITE BUILDER (3-COLUMNS) ─── */}
        {activeCategory === 'dashboard' ? (
          <div className="flex-1 w-full min-w-0 overflow-y-auto">
            <AnalyticsDashboard />
          </div>
        ) : (
          <>
            {/* 2. CENTER PANEL (Pleine largeur sur mobile si vue Éditeur, w-[420px] sur desktop) */}
            <div
              className={`flex-col bg-white border-r border-slate-200 overflow-hidden transition-all duration-300 ${
                mobileView === 'editor'
                  ? 'flex w-full md:w-[420px]'
                  : 'hidden md:flex md:w-[420px]'
              } ${isCenterPanelCollapsed ? 'md:hidden' : ''} flex-shrink-0`}
            >
              {renderCenterPanel()}
            </div>

            {/* 3. PREVIEW (Pleine largeur sur mobile si vue Aperçu, flex-1 sur desktop) */}
            <div
              className={`flex-1 w-full min-w-0 overflow-y-auto ${
                mobileView === 'preview' ? 'flex' : 'hidden md:flex'
              }`}
            >
              <CockpitPreview
                sections={doc.sections}
                activeDevice={activeDevice}
                activeSectionId={activeSectionId}
                hoveredSectionId={hoveredSectionId}
                onSelectSection={(id) => {
                  setActiveSectionId(id)
                  setActiveCategory('homepage')
                  setMobileView('editor')
                  if (isCenterPanelCollapsed) setIsCenterPanelCollapsed(false)
                }}
                onHoverSection={setHoveredSectionId}
              />
            </div>
          </>
        )}
      </div>

      {/* ─── ADD SECTION MODAL ─── */}
      {showAddSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="fixed inset-0" onClick={() => setShowAddSection(false)} />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 space-y-4 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Ajouter une section à la page</h3>
                <p className="text-xs text-slate-500 mt-0.5">Sélectionnez un bloc pour enrichir votre vitrine automobile.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddSection(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2 max-h-[420px] overflow-y-auto pr-1">
              {AVAILABLE_SECTIONS.map((sec) => {
                const Icon = sec.icon
                return (
                  <button
                    key={sec.type}
                    type="button"
                    onClick={() => handleAddSection(sec.type)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 hover:border-red-300 hover:bg-red-50/30 transition text-left cursor-pointer group shadow-2xs"
                  >
                    <div className="w-9 h-9 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800">{sec.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{sec.desc}</p>
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
