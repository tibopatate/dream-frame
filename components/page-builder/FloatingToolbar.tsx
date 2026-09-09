'use client'

import React, { useState } from 'react'
import {
  PageElement,
  ElementStyles,
  DeviceMode,
  ProductListConfig,
} from '@/lib/page-builder/types'
import {
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Type,
  Palette,
  Layout,
  ImageIcon,
  Sliders,
  ChevronRight,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Maximize2,
  Package,
} from 'lucide-react'

const THEME_COLORS = [
  '#ffffff',
  '#000000',
  '#080807',
  '#141413',
  '#f59e0b',
  '#fbbf24',
  '#38bdf8',
  '#10b981',
  '#ef4444',
  '#a1a1aa',
  '#71717a',
  'transparent',
]

const FONT_FAMILIES = [
  { label: 'Sans Pur (Inter)', value: 'var(--font-inter), sans-serif' },
  { label: 'Serif Luxe (Playfair)', value: 'var(--font-playfair), serif' },
  { label: 'Élégance Impériale (Cinzel)', value: '"Cinzel", serif' },
  { label: 'Technique Horlogère (Mono)', value: 'ui-monospace, monospace' },
  { label: 'Design Moderne (Syne)', value: '"Syne", sans-serif' },
]

interface BreadcrumbItem {
  id: string
  label: string
}

interface FloatingToolbarProps {
  element: PageElement
  breadcrumbs: BreadcrumbItem[]
  activeDevice: DeviceMode
  onUpdateStyles: (styles: Partial<ElementStyles>, isMobileOverride?: boolean) => void
  onUpdateElement: (updated: Partial<PageElement>) => void
  onSelectElement: (id: string) => void
  onDelete: () => void
  onDuplicate: () => void
  onMove: (direction: 'up' | 'down') => void
  onToggleHide: () => void
  onClose: () => void
}

export function FloatingToolbar({
  element,
  breadcrumbs,
  activeDevice,
  onUpdateStyles,
  onUpdateElement,
  onSelectElement,
  onDelete,
  onDuplicate,
  onMove,
  onToggleHide,
  onClose,
}: FloatingToolbarProps) {
  const [activeTab, setActiveTab] = useState<'quick' | 'typo' | 'style' | 'layout' | 'image' | 'collection'>(
    element.type === 'image'
      ? 'image'
      : element.type === 'product-list'
      ? 'collection'
      : ['heading', 'text', 'button', 'badge'].includes(element.type)
      ? 'typo'
      : 'style'
  )

  const isMobile = activeDevice === 'mobile'
  const currentStyles = isMobile && element.responsiveStyles?.mobile
    ? { ...element.styles, ...element.responsiveStyles.mobile }
    : element.styles

  const handleStyleChange = (key: keyof ElementStyles, value: any) => {
    onUpdateStyles({ [key]: value }, isMobile)
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-2xl bg-neutral-900/95 backdrop-blur-xl border border-neutral-700/80 rounded-2xl shadow-2xl text-white p-3 space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      {/* ─── 1. BREADCRUMBS ROW & CLOSE ────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2 text-xs">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {breadcrumbs.map((b, idx) => (
            <React.Fragment key={b.id}>
              {idx > 0 && <ChevronRight className="w-3 h-3 text-neutral-600 flex-shrink-0" />}
              <button
                type="button"
                onClick={() => onSelectElement(b.id)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider transition cursor-pointer flex-shrink-0 ${
                  b.id === element.id
                    ? 'bg-amber-400 text-black font-bold'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {b.label}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Device indicator */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isMobile && (
            <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Surcharges Mobile
            </span>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded hover:bg-neutral-800 text-xs"
          >
            ✕
          </button>
        </div>
      </div>

      {/* ─── 2. TABS SELECTOR ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 border-b border-neutral-800/80 pb-2 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('quick')}
          className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 text-xs ${
            activeTab === 'quick' ? 'bg-neutral-800 text-amber-400' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Actions</span>
        </button>

        {['heading', 'text', 'button', 'badge'].includes(element.type) && (
          <button
            type="button"
            onClick={() => setActiveTab('typo')}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 text-xs ${
              activeTab === 'typo' ? 'bg-neutral-800 text-amber-400' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Typo</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setActiveTab('style')}
          className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 text-xs ${
            activeTab === 'style' ? 'bg-neutral-800 text-amber-400' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Style &amp; Fond</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('layout')}
          className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 text-xs ${
            activeTab === 'layout' ? 'bg-neutral-800 text-amber-400' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          <span>Espacement</span>
        </button>

        {element.type === 'image' && (
          <button
            type="button"
            onClick={() => setActiveTab('image')}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 text-xs ${
              activeTab === 'image' ? 'bg-neutral-800 text-amber-400' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Image</span>
          </button>
        )}

        {element.type === 'product-list' && (
          <button
            type="button"
            onClick={() => setActiveTab('collection')}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 text-xs ${
              activeTab === 'collection' ? 'bg-neutral-800 text-amber-400' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Catalogue</span>
          </button>
        )}
      </div>

      {/* ─── 3. TAB CONTENTS ──────────────────────────────────────────────────── */}

      {/* TAB: QUICK ACTIONS */}
      {activeTab === 'quick' && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => onMove('up')}
            className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-200 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
            title="Monter l'élément"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Monter</span>
          </button>

          <button
            type="button"
            onClick={() => onMove('down')}
            className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-200 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
            title="Descendre l'élément"
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span>Descendre</span>
          </button>

          <button
            type="button"
            onClick={onDuplicate}
            className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-200 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
            title="Dupliquer (Ctrl+D)"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Dupliquer</span>
          </button>

          <button
            type="button"
            onClick={onToggleHide}
            className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-200 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
            title="Masquer sans supprimer"
          >
            {element.hidden ? <Eye className="w-3.5 h-3.5 text-amber-400" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{element.hidden ? 'Afficher' : 'Masquer'}</span>
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-lg flex items-center gap-1.5 transition cursor-pointer ml-auto"
            title="Supprimer (Suppr)"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Supprimer</span>
          </button>
        </div>
      )}

      {/* TAB: TYPOGRAPHY */}
      {activeTab === 'typo' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Police */}
          <div className="space-y-1 col-span-2">
            <label className="text-[10px] uppercase font-mono text-neutral-400">Police</label>
            <select
              value={currentStyles.fontFamily || ''}
              onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
            >
              <option value="">Par défaut du site</option>
              {FONT_FAMILIES.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          {/* Taille */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-mono text-neutral-400">Taille (px)</label>
            <input
              type="text"
              value={currentStyles.fontSize || ''}
              onChange={(e) => handleStyleChange('fontSize', e.target.value)}
              placeholder="32px"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
            />
          </div>

          {/* Graisse */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-mono text-neutral-400">Graisse</label>
            <select
              value={currentStyles.fontWeight || '400'}
              onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
            >
              <option value="300">Light (300)</option>
              <option value="400">Normal (400)</option>
              <option value="500">Medium (500)</option>
              <option value="600">Semi-Bold (600)</option>
              <option value="700">Bold (700)</option>
              <option value="900">Black (900)</option>
            </select>
          </div>

          {/* Alignement */}
          <div className="space-y-1 col-span-2 flex items-end gap-1">
            {(['left', 'center', 'right', 'justify'] as const).map((align) => (
              <button
                key={align}
                type="button"
                onClick={() => handleStyleChange('textAlign', align)}
                className={`p-2 rounded-lg border transition cursor-pointer ${
                  currentStyles.textAlign === align
                    ? 'bg-amber-400 text-black border-amber-400'
                    : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:text-white'
                }`}
              >
                {align === 'left' && <AlignLeft className="w-3.5 h-3.5" />}
                {align === 'center' && <AlignCenter className="w-3.5 h-3.5" />}
                {align === 'right' && <AlignRight className="w-3.5 h-3.5" />}
                {align === 'justify' && <AlignJustify className="w-3.5 h-3.5" />}
              </button>
            ))}

            {/* Casse */}
            <select
              value={currentStyles.textTransform || 'none'}
              onChange={(e) => handleStyleChange('textTransform', e.target.value)}
              className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
            >
              <option value="none">Casse normale</option>
              <option value="uppercase">MAJUSCULES</option>
              <option value="lowercase">minuscules</option>
              <option value="capitalize">Capitales</option>
            </select>
          </div>

          {/* Couleur Texte */}
          <div className="space-y-1 col-span-2">
            <label className="text-[10px] uppercase font-mono text-neutral-400">Couleur Texte</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentStyles.color?.startsWith('#') ? currentStyles.color : '#ffffff'}
                onChange={(e) => handleStyleChange('color', e.target.value)}
                className="w-8 h-8 rounded border border-neutral-700 bg-transparent cursor-pointer p-0"
              />
              <input
                type="text"
                value={currentStyles.color || ''}
                onChange={(e) => handleStyleChange('color', e.target.value)}
                placeholder="#ffffff"
                className="w-28 bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
              />
              <div className="flex items-center gap-1 overflow-x-auto">
                {THEME_COLORS.slice(0, 6).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleStyleChange('color', c)}
                    style={{ backgroundColor: c }}
                    className="w-5 h-5 rounded-full border border-neutral-600 hover:scale-110 transition cursor-pointer"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: STYLE & SHAPE */}
      {activeTab === 'style' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Couleur Fond */}
          <div className="space-y-1 col-span-2">
            <label className="text-[10px] uppercase font-mono text-neutral-400">Fond</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentStyles.backgroundColor?.startsWith('#') ? currentStyles.backgroundColor : '#000000'}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                className="w-8 h-8 rounded border border-neutral-700 bg-transparent cursor-pointer p-0"
              />
              <input
                type="text"
                value={currentStyles.backgroundColor || ''}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                placeholder="rgba(0,0,0,0.8)"
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
              />
            </div>
          </div>

          {/* Rayon Coins (Border Radius) */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-mono text-neutral-400">Rayon Coins (Radius)</label>
            <input
              type="text"
              value={currentStyles.borderRadius || ''}
              onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
              placeholder="16px"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
            />
          </div>

          {/* Opacité */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-mono text-neutral-400">Opacité (0-100%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={Math.round((currentStyles.opacity ?? 1) * 100)}
              onChange={(e) => handleStyleChange('opacity', Number(e.target.value) / 100)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
            />
          </div>

          {/* Bordure */}
          <div className="space-y-1 col-span-2">
            <label className="text-[10px] uppercase font-mono text-neutral-400">Bordure (Épaisseur &amp; Couleur)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentStyles.borderWidth || ''}
                onChange={(e) => handleStyleChange('borderWidth', e.target.value)}
                placeholder="1px"
                className="w-16 bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
              />
              <select
                value={currentStyles.borderStyle || 'solid'}
                onChange={(e) => handleStyleChange('borderStyle', e.target.value)}
                className="w-24 bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1.5 text-xs text-white"
              >
                <option value="none">Aucune</option>
                <option value="solid">Pleine</option>
                <option value="dashed">Tirets</option>
                <option value="dotted">Points</option>
              </select>
              <input
                type="text"
                value={currentStyles.borderColor || ''}
                onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                placeholder="#333333"
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
              />
            </div>
          </div>

          {/* Ombre Preset */}
          <div className="space-y-1 col-span-2">
            <label className="text-[10px] uppercase font-mono text-neutral-400">Ombre Portée</label>
            <select
              value={currentStyles.boxShadow || ''}
              onChange={(e) => handleStyleChange('boxShadow', e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
            >
              <option value="">Aucune ombre</option>
              <option value="0 10px 25px -5px rgba(0, 0, 0, 0.5)">Discrète</option>
              <option value="0 25px 50px -12px rgba(0, 0, 0, 0.8)">Profonde (Luxe)</option>
              <option value="0 15px 35px -5px rgba(245, 158, 11, 0.3)">Lueur Ambrée (Or)</option>
              <option value="0 20px 40px -10px rgba(255, 255, 255, 0.2)">Halo Blanc Pro</option>
            </select>
          </div>
        </div>
      )}

      {/* TAB: LAYOUT & SPACING */}
      {activeTab === 'layout' && (
        <div className="space-y-3 text-xs">
          {/* Padding 4 Côtés */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-mono text-neutral-400">Padding Intérieur (Haut · Droite · Bas · Gauche)</label>
            <div className="grid grid-cols-4 gap-2">
              <input
                type="text"
                value={currentStyles.paddingTop || ''}
                onChange={(e) => handleStyleChange('paddingTop', e.target.value)}
                placeholder="Top"
                className="bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1.5 text-xs text-white font-mono text-center"
              />
              <input
                type="text"
                value={currentStyles.paddingRight || ''}
                onChange={(e) => handleStyleChange('paddingRight', e.target.value)}
                placeholder="Right"
                className="bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1.5 text-xs text-white font-mono text-center"
              />
              <input
                type="text"
                value={currentStyles.paddingBottom || ''}
                onChange={(e) => handleStyleChange('paddingBottom', e.target.value)}
                placeholder="Bottom"
                className="bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1.5 text-xs text-white font-mono text-center"
              />
              <input
                type="text"
                value={currentStyles.paddingLeft || ''}
                onChange={(e) => handleStyleChange('paddingLeft', e.target.value)}
                placeholder="Left"
                className="bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1.5 text-xs text-white font-mono text-center"
              />
            </div>
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono text-neutral-400">Largeur (Width)</label>
              <input
                type="text"
                value={currentStyles.width || ''}
                onChange={(e) => handleStyleChange('width', e.target.value)}
                placeholder="100% / auto / 400px"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono text-neutral-400">Max Largeur</label>
              <input
                type="text"
                value={currentStyles.maxWidth || ''}
                onChange={(e) => handleStyleChange('maxWidth', e.target.value)}
                placeholder="1200px"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono text-neutral-400">Gap (Espacement flex)</label>
              <input
                type="text"
                value={currentStyles.gap || ''}
                onChange={(e) => handleStyleChange('gap', e.target.value)}
                placeholder="16px"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB: IMAGE SETTINGS */}
      {activeTab === 'image' && element.type === 'image' && (
        <div className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-mono text-neutral-400">URL de l&apos;image</label>
            <input
              type="text"
              value={element.src || ''}
              onChange={(e) => onUpdateElement({ src: e.target.value })}
              placeholder="https://..."
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono text-neutral-400">Ajustement (Object Fit)</label>
              <select
                value={currentStyles.objectFit || 'cover'}
                onChange={(e) => handleStyleChange('objectFit', e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
              >
                <option value="cover">Couvrir (cover)</option>
                <option value="contain">Contenir (contain)</option>
                <option value="fill">Étirer (fill)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono text-neutral-400">Ratio d&apos;aspect</label>
              <select
                value={currentStyles.aspectRatio || '16/9'}
                onChange={(e) => handleStyleChange('aspectRatio', e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
              >
                <option value="16/9">16:9 (Panoramique)</option>
                <option value="4/3">4:3 (Photo Classique)</option>
                <option value="1/1">1:1 (Carré)</option>
                <option value="3/4">3:4 (Portrait)</option>
                <option value="auto">Auto / Libre</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-mono text-neutral-400">Texte alternatif (SEO / Alt)</label>
            <input
              type="text"
              value={element.alt || ''}
              onChange={(e) => onUpdateElement({ alt: e.target.value })}
              placeholder="Description de la photo pour le référencement..."
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
            />
          </div>
        </div>
      )}

      {/* TAB: DYNAMIC PRODUCT LIST CONFIG */}
      {activeTab === 'collection' && element.type === 'product-list' && (
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono text-neutral-400">Catégorie</label>
              <select
                value={element.productListConfig?.category || 'ALL'}
                onChange={(e) =>
                  onUpdateElement({
                    productListConfig: {
                      category: e.target.value as any,
                      limit: element.productListConfig?.limit || 8,
                      sortBy: element.productListConfig?.sortBy || 'featured',
                    },
                  })
                }
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
              >
                <option value="ALL">Tous les cadres</option>
                <option value="VINTAGE">Légendes Vintage</option>
                <option value="MODERN">Hypercars Modernes</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono text-neutral-400">Nombre max</label>
              <select
                value={element.productListConfig?.limit || 8}
                onChange={(e) =>
                  onUpdateElement({
                    productListConfig: {
                      category: element.productListConfig?.category || 'ALL',
                      limit: Number(e.target.value),
                      sortBy: element.productListConfig?.sortBy || 'featured',
                    },
                  })
                }
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
              >
                <option value={4}>4 Cadres</option>
                <option value={8}>8 Cadres</option>
                <option value={12}>12 Cadres</option>
                <option value={16}>16 Cadres</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono text-neutral-400">Tri</label>
              <select
                value={element.productListConfig?.sortBy || 'featured'}
                onChange={(e) =>
                  onUpdateElement({
                    productListConfig: {
                      category: element.productListConfig?.category || 'ALL',
                      limit: element.productListConfig?.limit || 8,
                      sortBy: e.target.value as any,
                    },
                  })
                }
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
              >
                <option value="featured">Mis en avant</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="newest">Plus récents</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
