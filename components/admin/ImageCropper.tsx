'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Crop,
  Maximize2,
  ZoomIn,
  Move,
  RotateCcw,
  Sparkles,
  Layers,
  Check,
} from 'lucide-react'

export type AspectRatioType = '4:3' | '16:9' | '1:1' | '3:4'

export interface CropSettings {
  aspectRatio: AspectRatioType
  zoom: number // 1.0 to 2.5
  panX: number // -50 to 50 %
  panY: number // -50 to 50 %
}

interface ImageCropperProps {
  imageUrl: string
  initialSettings?: Partial<CropSettings>
  onChange: (settings: CropSettings) => void
}

const RATIO_PRESETS: { key: AspectRatioType; label: string; desc: string; classAspect: string }[] = [
  { key: '4:3', label: '4:3 Standard', desc: 'Format standard des cadres A4 / A3', classAspect: 'aspect-[4/3]' },
  { key: '16:9', label: '16:9 Cinématique', desc: 'Idéal pour les supercars de profil', classAspect: 'aspect-[16/9]' },
  { key: '1:1', label: '1:1 Carré Studio', desc: 'Format galerie épuré', classAspect: 'aspect-square' },
  { key: '3:4', label: '3:4 Vertical', desc: 'Format affiche / poster vertical', classAspect: 'aspect-[3/4]' },
]

export function ImageCropper({ imageUrl, initialSettings, onChange }: ImageCropperProps) {
  const [ratio, setRatio] = useState<AspectRatioType>(initialSettings?.aspectRatio || '4:3')
  const [zoom, setZoom] = useState<number>(initialSettings?.zoom || 1.0)
  const [panX, setPanX] = useState<number>(initialSettings?.panX || 0)
  const [panY, setPanY] = useState<number>(initialSettings?.panY || 0)
  const [showLedPreview, setShowLedPreview] = useState(true)

  const activePreset = RATIO_PRESETS.find((r) => r.key === ratio) || RATIO_PRESETS[0]

  const update = (newRatio = ratio, newZoom = zoom, newX = panX, newY = panY) => {
    onChange({
      aspectRatio: newRatio,
      zoom: newZoom,
      panX: newX,
      panY: newY,
    })
  }

  const handleRatioChange = (newRatio: AspectRatioType) => {
    setRatio(newRatio)
    update(newRatio, zoom, panX, panY)
  }

  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom)
    update(ratio, newZoom, panX, panY)
  }

  const handlePanXChange = (newX: number) => {
    setPanX(newX)
    update(ratio, zoom, newX, panY)
  }

  const handlePanYChange = (newY: number) => {
    setPanY(newY)
    update(ratio, zoom, panX, newY)
  }

  const resetCrop = () => {
    setZoom(1.0)
    setPanX(0)
    setPanY(0)
    update(ratio, 1.0, 0, 0)
  }

  return (
    <div className="space-y-5 rounded-2xl bg-black/60 border border-neutral-800 p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          <Crop className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Studio de Cadrage &amp; Format d&apos;Affichage
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowLedPreview(!showLedPreview)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1.5 cursor-pointer ${
              showLedPreview
                ? 'bg-amber-400 text-black'
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            {showLedPreview ? 'Aperçu Cadre LED Actif' : 'Aperçu Image Seule'}
          </button>
          <button
            type="button"
            onClick={resetCrop}
            className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition flex items-center gap-1 cursor-pointer"
            title="Réinitialiser"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>

      {/* ─── 1. Choix du Ratio d'Affichage ─── */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
          Format du visuel sur le site :
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {RATIO_PRESETS.map((preset) => {
            const isSelected = ratio === preset.key
            return (
              <button
                key={preset.key}
                type="button"
                onClick={() => handleRatioChange(preset.key)}
                className={`p-2.5 rounded-xl text-left border transition cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400/10 border-amber-400 text-white'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{preset.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <p className="text-[9px] text-neutral-500 font-light mt-0.5 truncate">
                  {preset.desc}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* ─── 2. Zone de Prévisualisation Cadre Interactif ─── */}
      <div className="relative flex items-center justify-center p-4 sm:p-6 bg-neutral-950 rounded-2xl border border-neutral-800/80 overflow-hidden">
        {/* Halo LED virtuel */}
        {showLedPreview && (
          <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        )}

        {/* Châssis Cadre Virtuel */}
        <div
          className={`relative w-full max-w-[420px] transition-all duration-300 ${
            showLedPreview
              ? 'p-3 bg-gradient-to-b from-[#181816] via-[#10100e] to-[#080807] border-4 border-neutral-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] ring-1 ring-amber-400/20'
              : 'p-0 border border-neutral-800 rounded-xl'
          }`}
        >
          {/* Passe-partout biseauté intérieur */}
          <div
            className={`relative w-full overflow-hidden rounded-lg bg-black ${activePreset.classAspect} ${
              showLedPreview ? 'ring-2 ring-neutral-900 shadow-inner' : ''
            }`}
          >
            {imageUrl ? (
              <div
                className="relative w-full h-full transition-transform duration-100 ease-out"
                style={{
                  transform: `scale(${zoom}) translate(${panX}%, ${panY}%)`,
                }}
              >
                <Image
                  src={imageUrl}
                  alt="Aperçu recadrage"
                  fill
                  className="object-cover"
                  sizes="400px"
                  priority
                />
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600 text-xs">
                <Crop className="w-6 h-6 mb-1" />
                <span>Entrez une URL d&apos;image ci-dessus</span>
              </div>
            )}

            {/* Repères de tiers (Grille de composition) */}
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-20 border border-white/20">
              <div className="border-r border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-b border-white/20" />
              <div className="border-r border-white/20" />
              <div className="border-r border-white/20" />
              <div />
            </div>
          </div>

          {/* Plaque d'immatriculation miniature sous le passe-partout */}
          {showLedPreview && (
            <div className="mt-2.5 flex items-center justify-between px-1">
              <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-neutral-500">
                Atelier Dream Frame · Écrin Acrylique LED
              </span>
              <span className="text-[8px] font-mono text-amber-400 font-bold">
                {ratio}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ─── 3. Commandes de Recadrage (Zoom & Centrage) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
        {/* Zoom */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400 font-semibold flex items-center gap-1 text-[11px]">
              <ZoomIn className="w-3 h-3 text-amber-400" /> Zoom
            </span>
            <span className="font-mono text-white text-[11px]">{Math.round(zoom * 100)}%</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="2.5"
            step="0.05"
            value={zoom}
            onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />
        </div>

        {/* Déplacement Horizontal (X) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400 font-semibold flex items-center gap-1 text-[11px]">
              <Move className="w-3 h-3 text-blue-400" /> Cadrage Gauche / Droite
            </span>
            <span className="font-mono text-white text-[11px]">{panX > 0 ? `+${panX}` : panX}%</span>
          </div>
          <input
            type="range"
            min="-30"
            max="30"
            step="1"
            value={panX}
            onChange={(e) => handlePanXChange(parseInt(e.target.value))}
            className="w-full accent-blue-400 cursor-pointer"
          />
        </div>

        {/* Déplacement Vertical (Y) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400 font-semibold flex items-center gap-1 text-[11px]">
              <Move className="w-3 h-3 text-purple-400" /> Cadrage Haut / Bas
            </span>
            <span className="font-mono text-white text-[11px]">{panY > 0 ? `+${panY}` : panY}%</span>
          </div>
          <input
            type="range"
            min="-30"
            max="30"
            step="1"
            value={panY}
            onChange={(e) => handlePanYChange(parseInt(e.target.value))}
            className="w-full accent-purple-400 cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}
