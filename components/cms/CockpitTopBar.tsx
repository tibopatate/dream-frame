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
  Loader2
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
  lastSavedTime
}: CockpitTopBarProps) {
  return (
    <div className="sticky top-0 z-50 h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between">
      {/* Left group */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/dashboard" 
          className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quitter
        </Link>
        
        <div className="h-6 w-px bg-slate-200" />
        
        <div className="flex items-center gap-2">
          <div className="text-slate-400">
            <Home className="w-4 h-4" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[10px] text-slate-400 uppercase leading-none mb-0.5">
              Page actuelle
            </span>
            <span className="text-sm font-semibold text-slate-800 leading-none">
              {currentPage}
            </span>
          </div>
        </div>
      </div>

      {/* Center group */}
      <div className="flex items-center">
        <div className="flex items-center bg-slate-100 rounded-full p-1 gap-1">
          <button
            onClick={() => onDeviceChange('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeDevice === 'desktop'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Monitor className="w-4 h-4" />
            Ordinateur
          </button>
          <button
            onClick={() => onDeviceChange('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeDevice === 'mobile'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Mobile
          </button>
        </div>
      </div>

      {/* Right group */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1.5 text-slate-600 hover:text-slate-900 rounded-md transition-all hover:bg-slate-50 ${
              !canUndo ? 'opacity-30 cursor-not-allowed' : ''
            }`}
            aria-label="Annuler"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1.5 text-slate-600 hover:text-slate-900 rounded-md transition-all hover:bg-slate-50 ${
              !canRedo ? 'opacity-30 cursor-not-allowed' : ''
            }`}
            aria-label="Rétablir"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        <div className="h-6 w-px bg-slate-200" />

        <div className="flex items-center gap-2">
          <button
            onClick={onShowHistory}
            className="flex items-center gap-1.5 text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors"
          >
            <Clock className="w-4 h-4" />
            Historique
          </button>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Boutique
          </Link>
        </div>

        <div className="h-6 w-px bg-slate-200" />

        <div className="flex items-center gap-4">
          <div className="text-xs">
            {isPublishing ? (
              <span className="flex items-center gap-1.5 text-slate-500">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Enregistrement...
              </span>
            ) : isDirty ? (
              <span className="text-amber-600 font-medium">Modifications non enregistrées</span>
            ) : (
              <span className="text-emerald-600 font-medium">
                Enregistré {lastSavedTime ? `à ${lastSavedTime}` : ''}
              </span>
            )}
          </div>

          <button
            onClick={onSavePublish}
            disabled={isPublishing}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPublishing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : null}
            Enregistrer & Publier →
          </button>
        </div>
      </div>
    </div>
  )
}
