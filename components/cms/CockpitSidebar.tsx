'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  LayoutDashboard,
  FileText,
  Grid3X3,
  Package,
  Files,
  Palette,
  Compass,
  Type,
  Search,
  Settings,
  Globe,
  Plug,
  HelpCircle
} from 'lucide-react'

interface CockpitSidebarProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function CockpitSidebar({ activeCategory, onCategoryChange }: CockpitSidebarProps) {
  const navGroups = [
    {
      items: [
        { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard }
      ]
    },
    {
      label: 'PERSONNALISATION',
      items: [
        { id: 'homepage', label: "Page d'accueil", icon: FileText },
        { id: 'catalogue', label: 'Catalogue / Collection', icon: Grid3X3 },
        { id: 'products', label: 'Produits / Articles', icon: Package },
        { id: 'pages', label: 'Pages statiques', icon: Files }
      ]
    },
    {
      label: 'OPTIONS AVANCÉES',
      items: [
        { id: 'design', label: 'Design & Apparence', icon: Palette },
        { id: 'navigation', label: 'Navigation & Menu', icon: Compass },
        { id: 'fonts', label: 'Polices & Typographies', icon: Type },
        { id: 'seo', label: 'SEO & Référencement', icon: Search },
        { id: 'settings', label: 'Paramètres de base', icon: Settings }
      ]
    },
    {
      items: [
        { id: 'domain', label: 'Domaine & Hébergement', icon: Globe },
        { id: 'integrations', label: 'Intégrations', icon: Plug },
        { id: 'help', label: 'Aide & Support', icon: HelpCircle }
      ]
    }
  ]

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
        <div className="relative w-8 h-8 rounded-md overflow-hidden flex-shrink-0 border border-slate-200">
          <Image src="/logo.jpg" alt="Dream Frame Logo" fill className="object-cover" />
        </div>
        <div>
          <h1 className="font-bold text-sm text-slate-900 leading-tight">DREAM FRAME</h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
              COCKPIT ADMIN
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        <nav className="flex flex-col gap-1">
          {navGroups.map((group, groupIndex) => (
            <div key={groupIndex} className={groupIndex > 0 ? "mt-2" : ""}>
              {group.label && (
                <h3 className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 px-4 pt-4 pb-2">
                  {group.label}
                </h3>
              )}
              <ul className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive = activeCategory === item.id
                  
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => onCategoryChange(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 mx-2 rounded-lg text-sm font-medium transition-colors cursor-pointer border ${
                          isActive
                            ? 'bg-red-50 text-red-600 border-red-50'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent'
                        }`}
                        style={{ width: 'calc(100% - 16px)' }}
                      >
                        <div className={`p-1 rounded-md flex items-center justify-center ${isActive ? 'bg-red-100/50' : ''}`}>
                           <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-red-500' : 'text-slate-400'}`} />
                        </div>
                        {item.label}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-100 flex-shrink-0 mt-auto bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold flex items-center justify-center flex-shrink-0 text-sm">
            M
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">Morgan</p>
            <p className="text-xs text-slate-500 truncate">admin@dreamframe.fr</p>
          </div>
          <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors flex-shrink-0">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
