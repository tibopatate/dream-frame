'use client'

import React from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Home,
  Monitor,
  Smartphone,
  RotateCcw,
  RotateCw,
  Clock,
  ExternalLink,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
  Maximize2,
  Minimize2,
  Menu,
} from 'lucide-react'

interface CockpitTopBarProps {
  currentPage: string
  activeDevice: 'desktop' | 'mobile'
  onDeviceChange: (device: 'desktop' | 'mobile') => void
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
  onSavePublish: () => void
  onShowHistory: () => void
  isPublishing: boolean
  isDirty: boolean
  lastSavedTime: string | null
  isSidebarCollapsed?: boolean
  onToggleSidebar?: () => void
  isCenterPanelCollapsed?: boolean
  onToggleCenterPanel?: () => void
  mobileView?: 'editor' | 'preview'
  onMobileViewChange?: (view: 'editor' | 'preview') => void
  onOpenMobileSidebar?: () => void
}

export function CockpitTopBar({
  currentPage,
  activeDevice,
  onDeviceChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onSavePublish,
  onShowHistory,
  isPublishing,
  isDirty,
  lastSavedTime,
  isSidebarCollapsed = false,
  onToggleSidebar,
  isCenterPanelCollapsed = false,
  onToggleCenterPanel,
  mobileView = 'editor',
  onMobileViewChange,
  onOpenMobileSidebar,
}: CockpitTopBarProps) {
  return (
    <div className="sticky top-0 z-50 h-14 bg-white border-b border-slate-200 px-3 sm:px-4 flex items-center justify-between">
      {/* ══════════════════════════════════════════════════════════════
          1. VERSION MOBILE (< md)
          ══════════════════════════════════════════════════════════════ */}
      <div className="flex md:hidden items-center justify-between w-full gap-2">
        {/* Gauche : Menu drawer + Bouton Quitter */}
        <div className="flex items-center gap-1.5">
          {onOpenMobileSidebar && (
            <button
              type="button"
              onClick={onOpenMobileSidebar}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link
            href="/admin/dashboard"
            className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 p-1 rounded-md"
            title="Quitter l'éditeur"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Quitter</span>
          </Link>
        </div>

        {/* Centre : Sélecteur vue Éditeur / Aperçu */}
        <div className="flex items-center bg-slate-100 rounded-full p-0.5 border border-slate-200/80">
          <button
            type="button"
            onClick={() => onMobileViewChange?.('editor')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              mobileView === 'editor'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Éditeur
          </button>
          <button
            type="button"
            onClick={() => onMobileViewChange?.('preview')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              mobileView === 'preview'
                ? 'bg-red-600 text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Aperçu
          </button>
        </div>

        {/* Droite : Bouton Publier compact */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onSavePublish}
            disabled={isPublishing}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm transition-all disabled:opacity-60 cursor-pointer"
          >
            {isPublishing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : null}
            <span>Publier</span>
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          2. VERSION DESKTOP (md:)
          ══════════════════════════════════════════════════════════════ */}
      <div className="hidden md:flex items-center justify-between w-full">
        {/* Left group */}
        <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            title={isSidebarCollapsed ? 'Afficher la barre de navigation gauche' : 'Replier la barre de navigation gauche'}
            aria-label="Replier / Afficher navigation"
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-red-600" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        )}

        <Link
          href="/admin/dashboard"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Quitter
        </Link>

        <div className="h-5 w-px bg-slate-200" />

        <div className="flex items-center gap-2">
          <div className="text-slate-400">
            <Home className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[9px] text-slate-400 uppercase font-semibold leading-none mb-0.5">
              Page actuelle
            </span>
            <span className="text-xs font-bold text-slate-800 leading-none">
              {currentPage}
            </span>
          </div>
        </div>
      </div>

      {/* Center group */}
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-slate-100 rounded-full p-1 gap-1">
          <button
            type="button"
            onClick={() => onDeviceChange('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeDevice === 'desktop'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            Ordinateur
          </button>
          <button
            type="button"
            onClick={() => onDeviceChange('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeDevice === 'mobile'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Mobile
          </button>
        </div>

        {onToggleCenterPanel && (
          <button
            type="button"
            onClick={onToggleCenterPanel}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              isCenterPanelCollapsed
                ? 'bg-red-50 text-red-600 border-red-200'
                : 'text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title={isCenterPanelCollapsed ? 'Afficher le panneau de configuration' : 'Plein écran (masquer la configuration)'}
          >
            {isCenterPanelCollapsed ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isCenterPanelCollapsed ? 'Quitter plein écran' : 'Aperçu plein écran'}</span>
          </button>
        )}
      </div>

      {/* Right group */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1.5 text-slate-600 hover:text-slate-900 rounded-md transition-all hover:bg-slate-50 cursor-pointer ${
              !canUndo ? 'opacity-30 cursor-not-allowed' : ''
            }`}
            title="Annuler (Ctrl+Z)"
            aria-label="Annuler"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1.5 text-slate-600 hover:text-slate-900 rounded-md transition-all hover:bg-slate-50 cursor-pointer ${
              !canRedo ? 'opacity-30 cursor-not-allowed' : ''
            }`}
            title="Rétablir (Ctrl+Y)"
            aria-label="Rétablir"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-5 w-px bg-slate-200" />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onShowHistory}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg px-2.5 py-1.5 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5" />
            Historique
          </button>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg px-2.5 py-1.5 hover:bg-slate-50 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Boutique
          </Link>
        </div>

        <div className="h-5 w-px bg-slate-200" />

        <div className="flex items-center gap-3">
          <div className="text-xs">
            {isPublishing ? (
              <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" />
                Publication...
              </span>
            ) : isDirty ? (
              <span className="text-amber-600 font-medium text-[11px]">Modifications non publiées</span>
            ) : (
              <span className="text-emerald-600 font-medium text-[11px]">
                Enregistré {lastSavedTime ? `(${lastSavedTime})` : ''}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onSavePublish}
            disabled={isPublishing}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {isPublishing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : null}
            Enregistrer &amp; Publier →
          </button>
        </div>
      </div>
    </div>
  </div>
)
}
