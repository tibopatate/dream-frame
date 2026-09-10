'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  LayoutDashboard,
  FileText,
  Grid3X3,
  Package,
  Layers,
  Camera,
  Star,
  Mail,
  FileEdit,
  LayoutTemplate,
  LayoutGrid,
  Files,
  Boxes,
  Palette,
  Type,
  Columns2,
  Square,
  Sparkles,
  Compass,
  PanelTop,
  Search,
  Settings,
  Globe,
  Plug,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Briefcase,
} from 'lucide-react'

interface CockpitSidebarProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export function CockpitSidebar({
  activeCategory,
  onCategoryChange,
  isCollapsed = false,
  onToggleCollapse,
}: CockpitSidebarProps) {
  // Collapsible accordion state for categories
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    content: true,
    customization: true,
    design: true,
    navigation: true,
    settings: true,
  })

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const navSections = [
    {
      key: 'content',
      label: 'CONTENU DU SITE',
      items: [
        { id: 'homepage', label: "Pages d'accueil", icon: FileText },
        { id: 'catalogue', label: 'Catalogue / Collections', icon: Grid3X3 },
        { id: 'products', label: 'Produits / Articles', icon: Package },
        { id: 'services', label: 'Services', icon: Briefcase },
        { id: 'craft', label: 'Savoir-faire', icon: Layers },
        { id: 'gallery', label: 'Galerie', icon: Camera },
        { id: 'reviews', label: 'Avis clients', icon: Star },
        { id: 'newsletter', label: 'Newsletter', icon: Mail },
        { id: 'forms', label: 'Formulaires', icon: FileEdit },
        { id: 'footer', label: 'Footer', icon: LayoutTemplate },
      ],
    },
    {
      key: 'customization',
      label: 'PERSONNALISATION DES PAGES',
      items: [
        { id: 'sections', label: 'Gestion des sections', icon: LayoutGrid },
        { id: 'page-templates', label: 'Modèles de pages', icon: Files },
        { id: 'components-lib', label: 'Bibliothèque de composants', icon: Boxes },
      ],
    },
    {
      key: 'design',
      label: 'DESIGN & APPARENCE',
      items: [
        { id: 'design-colors', label: 'Couleurs', icon: Palette },
        { id: 'fonts', label: 'Typographie', icon: Type },
        { id: 'design-layout', label: 'Mise en page', icon: Columns2 },
        { id: 'design-borders', label: 'Bordures & Ombres', icon: Square },
        { id: 'design-animations', label: 'Animations', icon: Sparkles },
      ],
    },
    {
      key: 'navigation',
      label: 'NAVIGATION & MENU',
      items: [
        { id: 'navigation', label: 'Menu principal', icon: Compass },
        { id: 'header-footer', label: 'Header & Footer', icon: PanelTop },
      ],
    },
    {
      key: 'settings',
      label: 'PARAMÈTRES & OUTILS',
      items: [
        { id: 'seo', label: 'SEO & Référencement', icon: Search },
        { id: 'settings', label: 'Paramètres du site', icon: Settings },
        { id: 'domain', label: 'Domaine & Hébergement', icon: Globe },
        { id: 'integrations', label: 'Intégrations', icon: Plug },
        { id: 'help', label: 'Aide & Support', icon: HelpCircle },
      ],
    },
  ]

  return (
    <aside
      className={`flex-shrink-0 bg-white border-r border-slate-200 flex flex-col h-[calc(100vh-3.5rem)] sticky top-14 transition-all duration-300 z-30 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center border-b border-slate-100 py-3.5 ${
          isCollapsed ? 'justify-center px-2' : 'justify-between px-4'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-8 h-8 rounded-md overflow-hidden flex-shrink-0 border border-slate-200">
            <Image src="/logo.jpg" alt="Dream Frame Logo" fill className="object-cover" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <h1 className="font-bold text-xs text-slate-900 leading-tight truncate">
                DREAM FRAME
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                <span className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold truncate">
                  COCKPIT ADMIN
                </span>
              </div>
            </div>
          )}
        </div>

        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer ${
              isCollapsed ? 'mt-2' : ''
            }`}
            title={isCollapsed ? 'Déplier la navigation' : 'Replier la navigation'}
            aria-label={isCollapsed ? 'Déplier la navigation' : 'Replier la navigation'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-red-600" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Navigation items */}
      <div className="flex-1 overflow-y-auto py-3 scrollbar-hide">
        <nav className="flex flex-col gap-1">
          {/* Main Dashboard Button */}
          <div className="px-2 mb-1">
            <button
              type="button"
              onClick={() => onCategoryChange('dashboard')}
              className={`w-full flex items-center rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                isCollapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2'
              } ${
                activeCategory === 'dashboard'
                  ? 'bg-red-50 text-red-600 border-red-100 font-bold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent'
              }`}
              title={isCollapsed ? 'Tableau de bord' : undefined}
            >
              <div
                className={`flex items-center justify-center flex-shrink-0 ${
                  activeCategory === 'dashboard' ? 'text-red-600' : 'text-slate-400'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
              </div>
              {!isCollapsed && <span className="truncate">Tableau de bord</span>}
            </button>
          </div>

          {/* Grouped Accordions */}
          {navSections.map((group) => {
            const isOpen = openGroups[group.key] ?? true

            return (
              <div key={group.key} className="mt-1">
                {/* Group label */}
                {!isCollapsed && (
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.key)}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-[9px] uppercase tracking-wider font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <span>{group.label}</span>
                    {isOpen ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </button>
                )}

                {isCollapsed && <div className="h-px bg-slate-100 mx-3 my-2" />}

                {/* Sub-items */}
                {(isOpen || isCollapsed) && (
                  <ul className="flex flex-col gap-0.5 px-2">
                    {group.items.map((item) => {
                      const Icon = item.icon
                      const isActive = activeCategory === item.id

                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => onCategoryChange(item.id)}
                            className={`w-full flex items-center rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                              isCollapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-1.5'
                            } ${
                              isActive
                                ? 'bg-red-50 text-red-600 border-red-100 font-bold shadow-2xs'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent'
                            }`}
                            title={isCollapsed ? item.label : undefined}
                          >
                            <div
                              className={`flex items-center justify-center flex-shrink-0 ${
                                isActive ? 'text-red-600' : 'text-slate-400'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            {!isCollapsed && <span className="truncate">{item.label}</span>}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )
          })}
        </nav>
      </div>

      {/* User Profile */}
      <div className="p-3 border-t border-slate-100 flex-shrink-0 mt-auto bg-slate-50/50">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'}`}>
          <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold flex items-center justify-center flex-shrink-0 text-xs">
            M
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">Morgan</p>
              <p className="text-[10px] text-slate-500 truncate font-mono">admin@dreamframe.fr</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
