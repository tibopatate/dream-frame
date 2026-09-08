'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'

/**
 * DrivingCarReveal — Animation cinématique de la Porsche 911 GT3 RS.
 * 
 * Utilise une silhouette SVG vectorielle pure (profil exact) qui traverse
 * l'écran de droite à gauche en synchronisation avec le scroll.
 * La traînée lumineuse, les phares et le révélation du texte sont 100% CSS/SVG.
 */
export function DrivingCarReveal() {
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { once: false, amount: 0.3 })
  const [isHovered, setIsHovered] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const wh = window.innerHeight
      const total = wh + rect.height
      const current = wh - rect.top
      setScrollProgress(Math.max(0, Math.min(1, current / total)))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Position effective de la voiture (0 = droite hors écran, 1 = gauche hors écran)
  const effectiveProgress = isHovered
    ? 0.82
    : Math.max(0, Math.min(1, (scrollProgress - 0.15) * 1.7))

  // La voiture va de 110% à -40% de largeur
  const carX = 110 - effectiveProgress * 155

  // La révélation du texte suit la voiture
  const revealPct = Math.min(100, Math.max(0, effectiveProgress * 108))

  return (
    <section
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative py-20 sm:py-32 bg-[#080807] border-y border-neutral-800/60 overflow-hidden select-none"
    >
      {/* Ambiance de circuit nocturne */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,_rgba(30,30,28,0.8)_0%,_transparent_100%)] pointer-events-none" />

      {/* Lueur de phares au sol */}
      <div
        className="absolute bottom-0 pointer-events-none transition-all duration-300"
        style={{
          left: `${carX + 2}%`,
          width: '280px',
          height: '80px',
          background: 'radial-gradient(ellipse at top, rgba(200, 220, 255, 0.12) 0%, transparent 70%)',
          filter: 'blur(8px)',
          transform: 'translateX(-50%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Badge */}
        <div className="flex items-center justify-between max-w-5xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs tracking-[0.2em] uppercase text-amber-400 bg-neutral-900 border border-neutral-800 px-3.5 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Porsche 911 GT3 RS · 525 CH Atmosphérique
          </div>
          <span className="text-[10px] text-neutral-500 uppercase tracking-widest hidden sm:block">
            Scroll ou survolez
          </span>
        </div>

        {/* Zone de course */}
        <div className="relative max-w-5xl mx-auto">
          {/* Texte de fond grisé */}
          <div className="relative h-24 sm:h-40 md:h-48 flex items-center justify-center overflow-hidden">
            <h2 className="absolute text-4xl sm:text-7xl md:text-8xl lg:text-[120px] font-black tracking-tighter uppercase text-neutral-900 select-none whitespace-nowrap">
              DREAM FRAME
            </h2>

            {/* Texte révélé — clipPath suit la voiture */}
            <div
              className="absolute inset-0 flex items-center justify-center overflow-hidden"
              style={{
                clipPath: `polygon(0 0, ${revealPct}% 0, ${revealPct}% 100%, 0 100%)`,
                transition: 'clip-path 120ms linear',
              }}
            >
              <h2 className="text-4xl sm:text-7xl md:text-8xl lg:text-[120px] font-black tracking-tighter uppercase bg-gradient-to-r from-white via-neutral-100 to-neutral-300 bg-clip-text text-transparent select-none whitespace-nowrap drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                DREAM FRAME
              </h2>
            </div>
          </div>

          {/* Piste lumineuse */}
          <div className="relative w-full h-[2px] bg-neutral-800/80">
            {/* Traînée amber qui suit */}
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-400/80 via-amber-300/40 to-transparent"
              style={{
                width: `${revealPct}%`,
                transition: 'width 120ms linear',
              }}
            />
          </div>

          {/* ─── LA VOITURE SVG DE PROFIL ─── */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: `${carX}%`,
              bottom: '2px', // posée sur la piste
              transition: 'left 120ms linear',
            }}
          >
            {/* Faisceau phare avant */}
            <div
              className="absolute pointer-events-none"
              style={{
                right: '100%',
                top: '30%',
                width: '120px',
                height: '30px',
                background: 'linear-gradient(to left, rgba(200,220,255,0.25) 0%, transparent 100%)',
                filter: 'blur(4px)',
                transform: 'translateY(-50%)',
              }}
            />

            {/* SVG Porsche 911 GT3 RS profil — vectoriel pur */}
            <svg
              viewBox="0 0 280 100"
              xmlns="http://www.w3.org/2000/svg"
              className="w-48 sm:w-64 md:w-80 h-auto drop-shadow-[0_8px_24px_rgba(0,0,0,0.9)]"
              style={{ transform: 'scaleX(-1)' }} // face vers la gauche
            >
              {/* Carrosserie principale */}
              <path
                d="M 20 72
                   L 20 70
                   Q 28 50 50 40
                   Q 80 28 110 26
                   Q 140 24 160 28
                   Q 180 30 200 40
                   Q 215 48 230 52
                   L 255 52
                   Q 265 52 268 58
                   L 268 72
                   Z"
                fill="#FFFFFF"
                fillOpacity="0.92"
              />
              {/* Toit */}
              <path
                d="M 60 40
                   Q 80 20 110 16
                   Q 140 12 165 18
                   Q 185 22 200 38"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeOpacity="0.9"
              />
              {/* Vitres */}
              <path
                d="M 68 39 Q 85 22 112 18 Q 138 14 162 22 Q 178 28 192 38 Z"
                fill="#11110F"
                fillOpacity="0.85"
              />
              {/* Aileron arrière */}
              <path
                d="M 42 39 L 25 32 L 55 32 L 53 39 Z"
                fill="#FFFFFF"
                fillOpacity="0.85"
              />
              {/* Roue avant */}
              <circle cx="210" cy="72" r="18" fill="#1a1a18" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.7" />
              <circle cx="210" cy="72" r="9" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.5" />
              <circle cx="210" cy="72" r="3" fill="#FFFFFF" fillOpacity="0.6" />
              {/* Roue arrière */}
              <circle cx="60" cy="72" r="20" fill="#1a1a18" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.7" />
              <circle cx="60" cy="72" r="10" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.5" />
              <circle cx="60" cy="72" r="3" fill="#FFFFFF" fillOpacity="0.6" />
              {/* Phares avant (LED Matrix) */}
              <rect x="248" y="52" width="14" height="4" rx="2" fill="#FBBF24" fillOpacity="0.9" />
              <rect x="248" y="58" width="10" height="3" rx="1.5" fill="#FFFFFF" fillOpacity="0.8" />
              {/* Feux arrière LED */}
              <rect x="18" y="56" width="6" height="4" rx="1" fill="#EF4444" fillOpacity="0.9" />
              {/* Détails carrosserie */}
              <line x1="80" y1="72" x2="190" y2="72" stroke="#111110" strokeWidth="1" strokeOpacity="0.4" />
            </svg>

            {/* Traînée arrière au sol */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: 0,
                bottom: 0,
                width: '60px',
                height: '3px',
                background: 'linear-gradient(to left, rgba(239, 68, 68, 0.6), transparent)',
                filter: 'blur(2px)',
                transform: 'translateX(-60px)',
              }}
            />
          </div>
        </div>

        {/* Légende */}
        <div className="flex flex-col sm:flex-row items-center justify-between max-w-5xl mx-auto mt-8 pt-5 border-t border-neutral-800/60 text-xs text-neutral-400 gap-4">
          <div className="flex items-center gap-3">
            <span className="text-white font-semibold uppercase tracking-wider">Porsche 911 GT3 RS</span>
            <span className="text-neutral-700">·</span>
            <span className="text-amber-400">4.0L Flat-6 · 525 CH · 9 000 tr/min</span>
          </div>
          <button
            type="button"
            onClick={() => setIsHovered(!isHovered)}
            className="px-4 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 hover:border-amber-400/50 text-neutral-300 hover:text-white transition-all text-[11px] flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            {isHovered ? 'Relâcher' : 'Lancer le run GT3 RS'}
          </button>
        </div>
      </div>
    </section>
  )
}
