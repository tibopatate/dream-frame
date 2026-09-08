'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * CustomCursor — Curseur premium pour desktop.
 * 
 * Cercle translucide blanc 40px qui suit la souris avec un léger lag (lerp),
 * se réduit sur les éléments cliquables pour signaler l'interactivité.
 * Invisible sur mobile / touch devices.
 * 
 * Doit être placé dans le root layout, hors du flux DOM.
 */
export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: -100, y: -100 })
  const targetRef = useRef({ x: -100, y: -100 })
  const rafRef = useRef<number>(0)
  const [isPointer, setIsPointer] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Seulement sur desktop (hover capable + pointer fine)
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!mq.matches) return
    setIsSupported(true)

    const onMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY }

      // Détection des éléments interactifs
      const el = e.target as HTMLElement
      const clickable = el.closest('a, button, [role="button"], label, select, input')
      setIsPointer(!!clickable)
    }

    const onLeave = () => setIsHidden(true)
    const onEnter = () => setIsHidden(false)

    window.addEventListener('mousemove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)

    // Lerp animation loop — lag fluide et premium
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    const LERP_FACTOR = 0.12 // 0.08 = très lent, 0.2 = réactif

    const animate = () => {
      posRef.current.x = lerp(posRef.current.x, targetRef.current.x, LERP_FACTOR)
      posRef.current.y = lerp(posRef.current.y, targetRef.current.y, LERP_FACTOR)

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`
      }
      // Le dot suit directement, sans lag
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${targetRef.current.x}px, ${targetRef.current.y}px)`
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseenter', onEnter)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  if (!isSupported) return null

  return (
    <>
      {/* Cercle principal — laggy, translucide */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] will-change-transform"
        style={{
          // Centrage via margin négatif
          marginLeft: isPointer ? '-24px' : '-20px',
          marginTop:  isPointer ? '-24px' : '-20px',
        }}
      >
        <div
          style={{
            width:  isPointer ? '48px' : '40px',
            height: isPointer ? '48px' : '40px',
            border: isPointer ? '1.5px solid rgba(251, 191, 36, 0.8)' : '1.5px solid rgba(255, 255, 255, 0.5)',
            borderRadius: '50%',
            backgroundColor: isPointer ? 'rgba(251, 191, 36, 0.05)' : 'rgba(255, 255, 255, 0.03)',
            opacity: isHidden ? 0 : 1,
            transition: 'width 0.3s ease, height 0.3s ease, border-color 0.3s ease, background-color 0.3s ease, opacity 0.3s ease, margin 0.3s ease',
            backdropFilter: 'blur(1px)',
          }}
        />
      </div>

      {/* Point central — instantané */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] will-change-transform"
        style={{ marginLeft: '-3px', marginTop: '-3px' }}
      >
        <div
          style={{
            width: '6px',
            height: '6px',
            backgroundColor: isPointer ? '#FBBF24' : '#FFFFFF',
            borderRadius: '50%',
            opacity: isHidden ? 0 : 1,
            transition: 'background-color 0.2s ease, opacity 0.3s ease',
          }}
        />
      </div>
    </>
  )
}
