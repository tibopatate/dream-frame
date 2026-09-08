'use client'

import { type ReactNode, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ShimmerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'white' | 'ghost' | 'amber'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * ShimmerButton — CTA premium avec effet de brillance traversante au hover.
 * 
 * L'effet shimmer est un rayon de lumière (pseudo-element ::after) qui glisse
 * de gauche à droite au survol, signalant l'interactivité de façon subtile
 * et luxueuse.
 */
export function ShimmerButton({
  children,
  variant = 'white',
  size = 'md',
  className,
  ...props
}: ShimmerButtonProps) {
  const base =
    'relative inline-flex items-center justify-center gap-2 font-semibold uppercase tracking-wider rounded-xl overflow-hidden transition-all duration-300 select-none group'

  const sizes = {
    sm: 'px-5 py-2.5 text-[10px]',
    md: 'px-7 py-3.5 text-xs',
    lg: 'px-10 py-4.5 text-sm',
  }

  const variants = {
    white:
      'bg-white text-black hover:bg-neutral-100 shadow-xl shadow-white/10 hover:shadow-white/20 active:scale-[0.98]',
    ghost:
      'bg-black/60 text-white border border-neutral-700 hover:border-neutral-500 backdrop-blur-md active:scale-[0.98]',
    amber:
      'bg-amber-400 text-black hover:bg-amber-300 shadow-lg shadow-amber-400/20 active:scale-[0.98]',
  }

  const shimmerColors = {
    white: 'bg-black/10',
    ghost: 'bg-white/15',
    amber: 'bg-white/20',
  }

  return (
    <button
      {...props}
      className={cn(base, sizes[size], variants[variant], className)}
    >
      {/* Shimmer ray */}
      <span
        className={cn(
          'pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg]',
          shimmerColors[variant],
          'opacity-0 group-hover:opacity-100 group-hover:translate-x-full',
          'transition-transform duration-700 ease-in-out'
        )}
        aria-hidden="true"
      />
      {children}
    </button>
  )
}

/**
 * ShimmerLink — Même effet shimmer mais en balise <a> (Next.js Link wrapper).
 * Utiliser avec as={ShimmerLink} depuis un composant Next/Link.
 */
import { type AnchorHTMLAttributes } from 'react'

interface ShimmerLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode
  variant?: 'white' | 'ghost' | 'amber'
  size?: 'sm' | 'md' | 'lg'
}

export function ShimmerLink({
  children,
  variant = 'white',
  size = 'md',
  className,
  ...props
}: ShimmerLinkProps) {
  const base =
    'relative inline-flex items-center justify-center gap-2 font-semibold uppercase tracking-wider rounded-xl overflow-hidden transition-all duration-300 select-none group'

  const sizes = {
    sm: 'px-5 py-2.5 text-[10px]',
    md: 'px-7 py-3.5 text-xs',
    lg: 'px-10 py-4.5 text-sm',
  }

  const variants = {
    white:
      'bg-white text-black hover:bg-neutral-100 shadow-xl shadow-white/10 hover:shadow-white/20 active:scale-[0.98]',
    ghost:
      'bg-black/60 text-white border border-neutral-700 hover:border-neutral-500 backdrop-blur-md active:scale-[0.98]',
    amber:
      'bg-amber-400 text-black hover:bg-amber-300 shadow-lg shadow-amber-400/20 active:scale-[0.98]',
  }

  const shimmerColors = {
    white: 'bg-black/10',
    ghost: 'bg-white/15',
    amber: 'bg-white/20',
  }

  return (
    <a {...props} className={cn(base, sizes[size], variants[variant], className)}>
      <span
        className={cn(
          'pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg]',
          shimmerColors[variant],
          'opacity-0 group-hover:opacity-100 group-hover:translate-x-full',
          'transition-transform duration-700 ease-in-out'
        )}
        aria-hidden="true"
      />
      {children}
    </a>
  )
}
