'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  LayoutDashboard,
  LayoutGrid,
  Palette,
  Type,
  Compass,
  Search,
  Settings,
  Package,
  ShoppingBag,
  Star,
  BarChart3,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react'

interface CockpitSidebarProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  isMobileOpen?: boolean
  onCloseMobile?: () => void
}

export function CockpitSidebar({
  activeCategory,
  onCategoryChange,
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
}: CockpitSidebarProps) {
  // Collapsible accordion state for categories
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    builder: true,
    design: true,
    navigation: true,
    settings: true,
    admin: true,
  })

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const navSections = [
    {
      key: 'builder',
      label: 'ÉDITEUR DE SECTIONS',
      items: [
        { id: 'homepage', label: "Sections d'accueil", icon: LayoutGrid },
      ],
    },
    {
      key: 'design',
      label: 'DESIGN & STYLE GLOBAL',
      items: [
        { id: 'design', label: 'Style & Couleurs', icon: Palette },
        { id: 'fonts', label: 'Polices & Typographie', icon: Type },
      ],
    },
    {
      key: 'navigation',
      label: 'NAVIGATION & MENU',
      items: [
        { id: 'navigation', label: 'Menu & En-Tête (Header)', icon: Compass },
      ],
    },
    {
      key: 'settings',
      label: 'RÉFÉRENCEMENT & OUTILS',
      items: [
        { id: 'seo', label: 'SEO & Référencement', icon: Search },
        { id: 'settings', label: 'Paramètres du site', icon: Settings },
      ],
    },
  ]

  const handleSelect = (id: string) => {
    onCategoryChange(id)
    onCloseMobile?.()
  }

  const renderNavContent = (collapsed: boolean, isMobile: boolean) => (
    <>
      {/* Header */}
      <div
        className={`flex items-center border-b border-slate-100 py-3.5 ${
          collapsed ? 'justify-center px-2' : 'justify-between px-4'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-8 h-8 rounded-md overflow-hidden flex-shrink-0 border border-slate-200">
            <Image src="/logo.jpg" alt="Dream Frame Logo" fill className="object-cover" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="font-bold text-xs text-slate-900 leading-tight truncate">
                DREAM FRAME
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                <span className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold truncate">
                  PERSONNALISATEUR
                </span>
              </div>
            </div>
          )}
        </div>

        {isMobile ? (
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Fermer le menu"
          >
            <X className="w-4 h-4" />
          </button>
        ) : onToggleCollapse ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer ${
              collapsed ? 'mt-2' : ''
            }`}
            title={collapsed ? 'Déplier la navigation' : 'Replier la navigation'}
            aria-label={collapsed ? 'Déplier la navigation' : 'Replier la navigation'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4 text-red-600" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        ) : null}
      </div>

      {/* Navigation items */}
      <div className="flex-1 overflow-y-auto py-3 scrollbar-hide">
        <nav className="flex flex-col gap-1">
          {/* Grouped Accordions */}
          {navSections.map((group) => {
            const isOpen = openGroups[group.key] ?? true

            return (
              <div key={group.key} className="mt-1">
                {/* Group label */}
                {!collapsed && (
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

                {collapsed && <div className="h-px bg-slate-100 mx-3 my-2" />}

                {/* Sub-items */}
                {(isOpen || collapsed) && (
                  <ul className="flex flex-col gap-0.5 px-2">
                    {group.items.map((item) => {
                      const Icon = item.icon
                      const isActive = activeCategory === item.id

                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => handleSelect(item.id)}
                            className={`w-full flex items-center rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                              collapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2'
                            } ${
                              isActive
                                ? 'bg-red-50 text-red-600 border-red-200 font-bold shadow-2xs'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent'
                            }`}
                            title={collapsed ? item.label : undefined}
                          >
                            <div
                              className={`flex items-center justify-center flex-shrink-0 ${
                                isActive ? 'text-red-600' : 'text-slate-400'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            {!collapsed && <span className="truncate">{item.label}</span>}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )
          })}

          {/* LIENS DIRECTS ADMINISTRATION GÉNÉRALE */}
          <div className="mt-4 pt-3 border-t border-slate-100 px-2">
            {!collapsed && (
              <p className="px-3 py-1 text-[9px] uppercase tracking-wider font-bold text-slate-400">
                GESTION COMMERCIALE
              </p>
            )}

            <div className="flex flex-col gap-0.5">
              <Link
                href="/admin/dashboard"
                className={`w-full flex items-center rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all ${
                  collapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-1.5'
                }`}
                title="Tableau de bord"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                {!collapsed && <span className="truncate">Tableau de bord</span>}
              </Link>

              <Link
                href="/admin/produits"
                className={`w-full flex items-center rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all ${
                  collapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-1.5'
                }`}
                title="Catalogue Cadres"
              >
                <Package className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                {!collapsed && <span className="truncate">Catalogue Cadres</span>}
              </Link>

              <Link
                href="/admin/commandes"
                className={`w-full flex items-center rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all ${
                  collapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-1.5'
                }`}
                title="Commandes"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                {!collapsed && <span className="truncate">Commandes</span>}
              </Link>

              <Link
                href="/admin/avis"
                className={`w-full flex items-center rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all ${
                  collapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-1.5'
                }`}
                title="Avis Clients"
              >
                <Star className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                {!collapsed && <span className="truncate">Avis Clients</span>}
              </Link>

              <Link
                href="/admin/stock"
                className={`w-full flex items-center rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all ${
                  collapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-1.5'
                }`}
                title="Gestion des Stocks"
              >
                <BarChart3 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                {!collapsed && <span className="truncate">Gestion des Stocks</span>}
              </Link>

              <Link
                href="/admin/parametres"
                className={`w-full flex items-center rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all ${
                  collapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-1.5'
                }`}
                title="Paramètres Boutique"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                {!collapsed && <span className="truncate">Paramètres Boutique</span>}
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* User Profile / Quitter */}
      <div className="p-3 border-t border-slate-100 flex-shrink-0 mt-auto bg-slate-50/50">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
          <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold flex items-center justify-center flex-shrink-0 text-xs">
            M
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">Morgan</p>
              <Link
                href="/admin/dashboard"
                className="text-[10px] text-red-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Quitter le personnalisateur</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* ─── MOBILE DRAWER (< md) ─── */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs md:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white flex flex-col h-full border-r border-slate-200 shadow-2xl md:hidden transform transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {renderNavContent(false, true)}
      </aside>

      {/* ─── DESKTOP SIDEBAR (md:) ─── */}
      <aside
        className={`hidden md:flex flex-shrink-0 bg-white border-r border-slate-200 flex-col h-[calc(100vh-3.5rem)] sticky top-14 transition-all duration-300 z-30 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {renderNavContent(isCollapsed, false)}
      </aside>
    </>
  )
}
