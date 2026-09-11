'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Zap, Sparkles, Moon, Sun, ZoomIn, X } from 'lucide-react'

interface Interactive3DFrameProps {
  imageSrc: string
  carName: string
  brand: string
  year?: number
  isVintage?: boolean
}

/**
 * Interactive3DFrame — Cadre 3D interactif en CSS perspective.
 * 
 * L'utilisateur peut incliner le cadre à la souris ou au doigt.
 * Le vitrage acrylique réfléchit la lumière dynamiquement.
 * Le rétroéclairage LED peut être activé/désactivé.
 * Comprend le mode nuit « Éteindre la pièce » et la loupe HD plein écran.
 */
export function Interactive3DFrame({
  imageSrc,
  carName,
  brand,
  year = 1987,
  isVintage = true,
}: Interactive3DFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [ledGlow, setLedGlow] = useState(true)
  const [isNightMode, setIsNightMode] = useState(false)
  const [isZoomOpen, setIsZoomOpen] = useState(false)

  const handleMove = (clientX: number, clientY: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (clientX - rect.left) / rect.width - 0.5
    const y = (clientY - rect.top) / rect.height - 0.5
    setRotation({ x: -y * 16, y: x * 16 })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    handleMove(e.clientX, e.clientY)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY)
  }

  const handleLeave = () => {
    setRotation({ x: 0, y: 0 })
    setIsHovered(false)
  }

  // Couleur du halo LED selon le mode nuit et l'époque
  const ledColor = isNightMode
    ? 'radial-gradient(circle, rgba(251,191,36,0.65) 0%, rgba(217,119,6,0.35) 45%, transparent 75%)'
    : isVintage
    ? 'radial-gradient(circle, rgba(199,167,122,0.3) 0%, rgba(200,16,46,0.12) 70%, transparent 100%)'
    : 'radial-gradient(circle, rgba(199,167,122,0.28) 0%, rgba(30,30,28,0.6) 70%, transparent 100%)'

  return (
    <div className={`relative w-full max-w-[440px] mx-auto py-6 select-none rounded-3xl transition-all duration-500 ${
      isNightMode ? 'bg-black/95 p-4 sm:p-6 ring-1 ring-amber-400/30 shadow-[0_0_80px_rgba(0,0,0,1)]' : ''
    }`}>
      {/* Contrôles Interactifs (LED + Mode Nuit + Loupe HD) */}
      <div className="flex flex-wrap justify-between items-center gap-2 mb-3 text-[9px] tracking-[0.18em] uppercase text-neutral-500">
        <span className="flex items-center gap-1.5 text-amber-400">
          <Sparkles className="w-3 h-3" />
          Pièce 3D Interactive
        </span>
        <div className="flex items-center gap-1.5">
          {/* Bouton Mode Nuit / Éteindre la pièce */}
          <button
            type="button"
            onClick={() => {
              setIsNightMode(!isNightMode)
              if (!isNightMode) setLedGlow(true)
            }}
            title="Simuler l'ambiance sombre de nuit dans un salon"
            className={`flex items-center gap-1 px-2.5 py-1 border rounded-lg transition-all duration-200 text-[9px] ${
              isNightMode
                ? 'border-amber-400 bg-amber-400/20 text-amber-300 font-bold'
                : 'border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 bg-neutral-900/60'
            }`}
          >
            {isNightMode ? <Sun className="w-2.5 h-2.5" /> : <Moon className="w-2.5 h-2.5" />}
            <span>{isNightMode ? 'Jour' : 'Éteindre la pièce'}</span>
          </button>

          {/* Bouton Loupe HD */}
          <button
            type="button"
            onClick={() => setIsZoomOpen(true)}
            title="Inspecter les détails en haute résolution"
            className="flex items-center gap-1 px-2 py-1 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 bg-neutral-900/60 rounded-lg transition text-[9px]"
          >
            <ZoomIn className="w-2.5 h-2.5" />
            <span>Zoom</span>
          </button>

          {/* Toggle LED */}
          <button
            type="button"
            onClick={() => setLedGlow(!ledGlow)}
            className={`flex items-center gap-1 px-2.5 py-1 border rounded-lg transition-all duration-200 text-[9px] ${
              ledGlow
                ? 'border-amber-400/50 text-amber-400 bg-neutral-900'
                : 'border-neutral-800 text-neutral-500 hover:text-white hover:border-neutral-700'
            }`}
          >
            <Zap className="w-2.5 h-2.5" />
            {ledGlow ? 'LED: ON' : 'LED: OFF'}
          </button>
        </div>
      </div>

      {/* Halo LED */}
      {ledGlow && (
        <div
          className={`absolute inset-0 pointer-events-none transition-all duration-700 blur-[80px] ${
            isNightMode ? 'opacity-90 scale-110' : 'opacity-65'
          }`}
          style={{ background: ledColor }}
        />
      )}

      {/* Conteneur 3D */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseLeave={handleLeave}
        className="relative z-10 w-full aspect-[3/4] cursor-grab active:cursor-grabbing"
        style={{ perspective: '1200px' }}
      >
        {/* Châssis en relief */}
        <div
          className="relative w-full h-full p-6 sm:p-8 bg-[#0C0C0A] border-[12px] border-[#181816] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.95)] flex flex-col justify-between overflow-hidden transition-transform duration-200 ease-out rounded-sm"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${isHovered ? 1.02 : 1})`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Reflet vitre HD */}
          <div
            className="absolute inset-0 pointer-events-none opacity-35 mix-blend-overlay"
            style={{
              background: `linear-gradient(${108 + rotation.y * 2}deg, rgba(255,255,255,0.22) 0%, transparent 45%, rgba(255,255,255,0.07) 100%)`,
            }}
          />

          {/* En-tête passe-partout */}
          <div
            className="relative z-10 flex justify-between items-start text-[8px] tracking-[0.18em] uppercase text-neutral-500"
            style={{ transform: 'translateZ(8px)' }}
          >
            <span className="text-neutral-200 font-bold tracking-wider">{brand}</span>
            <span className="text-amber-400 border border-amber-400/30 px-1.5 py-0.5 rounded text-[7px]">
              ÉDITION COLLECTOR · {year}
            </span>
          </div>

          {/* Véhicule flottant */}
          <div
            className="relative flex-1 flex items-center justify-center my-4"
            style={{ transform: 'translateZ(35px)' }}
          >
            <Image
              src={imageSrc}
              alt={carName}
              fill
              className="object-contain drop-shadow-[0_25px_30px_rgba(0,0,0,0.95)]"
              sizes="(max-width: 640px) 100vw, 400px"
              priority
            />
          </div>

          {/* Cartouche bas */}
          <div
            className="relative z-10 border-t border-neutral-800/70 pt-3.5 flex justify-between items-end"
            style={{ transform: 'translateZ(15px)' }}
          >
            <div>
              <p className="text-sm sm:text-base font-bold text-white leading-none">
                {carName}
              </p>
              <p className="text-[9px] text-neutral-500 tracking-[0.18em] uppercase mt-1">
                Atelier Dream Frame · 1:24 Relief
              </p>
            </div>
            <div className="text-right">
              <span className="text-amber-400 text-sm font-bold block">49,99 €</span>
              <span className="text-[8px] text-neutral-500 tracking-wider uppercase block">
                Livraison Offerte
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-[9px] text-neutral-600 tracking-[0.18em] uppercase mt-2">
        Glissez pour incliner le cadre en 3D
      </p>

      {/* Modal Zoom Loupe Plein Écran */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8"
          onClick={() => setIsZoomOpen(false)}
        >
          <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
            <span className="hidden sm:inline text-xs text-neutral-400 font-mono">Cliquer pour fermer</span>
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              className="p-2.5 rounded-full bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-800 transition cursor-pointer shadow-xl"
              aria-label="Fermer le zoom"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="relative w-full max-w-4xl h-[75vh] flex items-center justify-center">
            <Image
              src={imageSrc}
              alt={`${carName} — Zoom Haute Résolution`}
              fill
              className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,1)] scale-105 sm:scale-110 transition-transform duration-300"
              sizes="1200px"
              priority
            />
          </div>
          <div className="mt-4 text-center space-y-1">
            <p className="text-xs font-mono tracking-widest text-amber-400 uppercase">
              {brand} · {carName} — Finition Atelier Haute Définition
            </p>
            <p className="text-[11px] text-neutral-400">
              Miniature de collection, passe-partout 310g et module LED intégré
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
