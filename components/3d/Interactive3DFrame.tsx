'use client'

import Image from 'next/image'

interface Interactive3DFrameProps {
  imageSrc: string
  carName: string
  brand: string
  year?: number
  price?: number
  formatScale?: string
  isVintage?: boolean
}

/**
 * Interactive3DFrame — Cadre d'Art Contemporain Dream Frame.
 * Présentation fixe, sobre et luxueuse du cadre d'atelier sans effet d'inclinaison 3D ni boutons parasites.
 */
export function Interactive3DFrame({
  imageSrc,
  carName,
  brand,
  year,
  price,
  formatScale,
  isVintage = true,
}: Interactive3DFrameProps) {
  // Couleur subtile du halo d'ambiance LED
  const ledColor = isVintage
    ? 'radial-gradient(circle, rgba(199,167,122,0.22) 0%, rgba(200,16,46,0.08) 70%, transparent 100%)'
    : 'radial-gradient(circle, rgba(199,167,122,0.2) 0%, rgba(30,30,28,0.5) 70%, transparent 100%)'

  const isF40 =
    carName?.toLowerCase().includes('f40') ||
    Boolean(brand?.toLowerCase().includes('ferrari') && carName?.toLowerCase().includes('f40'))

  return (
    <div className="relative w-full max-w-[440px] mx-auto py-2 select-none">
      {/* Halo LED d'ambiance doux et discret */}
      <div
        className="absolute inset-0 pointer-events-none blur-[60px] opacity-45"
        style={{ background: ledColor }}
      />

      {/* Châssis Cadre d'Art Atelier */}
      <div className="relative z-10 w-full aspect-[3/4] p-6 sm:p-8 bg-[#0C0C0A] border-[12px] border-[#181816] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] flex flex-col justify-between overflow-hidden rounded-sm">
        {/* Reflet vitre HD subtil */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
          style={{
            background: 'linear-gradient(115deg, rgba(255,255,255,0.18) 0%, transparent 45%, rgba(255,255,255,0.05) 100%)',
          }}
        />

        {/* En-tête passe-partout */}
        <div className="relative z-10 flex justify-between items-start text-[8px] tracking-[0.18em] uppercase text-neutral-500">
          <span className="text-neutral-200 font-bold tracking-wider">{brand}</span>
          {isF40 ? (
            <span className="text-amber-400 border border-amber-400/30 px-1.5 py-0.5 rounded text-[7px] font-semibold">
              ÉDITION COLLECTOR · 1987
            </span>
          ) : year ? (
            <span className="text-neutral-400 border border-neutral-800 px-1.5 py-0.5 rounded text-[7px] font-mono">
              {year}
            </span>
          ) : null}
        </div>

        {/* Véhicule en relief */}
        <div className="relative flex-1 flex items-center justify-center my-4">
          <Image
            src={imageSrc}
            alt={carName}
            fill
            className="object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.9)]"
            sizes="(max-width: 640px) 100vw, 400px"
            priority
          />
        </div>

        {/* Cartouche bas d'atelier */}
        <div className="relative z-10 border-t border-neutral-800/70 pt-3.5 flex justify-between items-end">
          <div>
            <p className="text-sm sm:text-base font-bold text-white leading-none">
              {carName}
            </p>
            <p className="text-[9px] text-neutral-500 tracking-[0.18em] uppercase mt-1">
              Atelier Dream Frame · {formatScale || (price && price >= 100 ? '1:24 Atelier' : '1:43 Atelier')}
            </p>
          </div>
          <div className="text-right">
            <span className="text-amber-400 text-sm font-bold block">
              {(Number(price) || 49.90).toFixed(2).replace('.', ',')} €
            </span>
            <span className="text-[8px] text-neutral-500 tracking-wider uppercase block">
              Livraison Offerte
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
