'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Zap, Sparkles } from 'lucide-react'

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

  // Couleur du halo LED selon l'époque
  const ledColor = isVintage
    ? 'radial-gradient(circle, rgba(199,167,122,0.3) 0%, rgba(200,16,46,0.12) 70%, transparent 100%)'
    : 'radial-gradient(circle, rgba(199,167,122,0.28) 0%, rgba(30,30,28,0.6) 70%, transparent 100%)'

  return (
    <div className="relative w-full max-w-[440px] mx-auto py-6 select-none">
      {/* Contrôle LED */}
      <div className="flex justify-between items-center mb-3 text-[9px] tracking-[0.18em] uppercase text-neutral-500">
        <span className="flex items-center gap-1.5 text-amber-400">
          <Sparkles className="w-3 h-3" />
          Pièce 3D Interactive
        </span>
        <button
          type="button"
          onClick={() => setLedGlow(!ledGlow)}
          className={`flex items-center gap-1.5 px-2.5 py-1 border rounded-lg transition-all duration-200 text-[9px] ${
            ledGlow
              ? 'border-amber-400/50 text-amber-400 bg-neutral-900'
              : 'border-neutral-800 text-neutral-500 hover:text-white hover:border-neutral-700'
          }`}
        >
          <Zap className="w-2.5 h-2.5" />
          {ledGlow ? 'LEDs : ON' : 'LEDs : OFF'}
        </button>
      </div>

      {/* Halo LED */}
      {ledGlow && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700 blur-[70px] opacity-65"
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
    </div>
  )
}
