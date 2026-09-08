'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useInView, type Variant } from 'framer-motion'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

interface ScrollRevealProps {
  children: ReactNode
  direction?: Direction
  delay?: number
  duration?: number
  distance?: number
  className?: string
  once?: boolean
  threshold?: number
}

const getVariants = (direction: Direction, distance: number): { hidden: Variant; visible: Variant } => {
  const axes: Record<Direction, { x?: number; y?: number }> = {
    up:    { y:  distance },
    down:  { y: -distance },
    left:  { x:  distance },
    right: { x: -distance },
    none:  {},
  }

  const translate = axes[direction]

  return {
    hidden:  { opacity: 0, ...translate },
    visible: { opacity: 1, x: 0, y: 0 },
  }
}

/**
 * ScrollReveal — Composant d'animation à l'entrée dans le viewport.
 * 
 * Usage :
 * <ScrollReveal direction="left" delay={0.2}>
 *   <MonComposant />
 * </ScrollReveal>
 */
export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.65,
  distance = 48,
  className,
  once = true,
  threshold = 0.15,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, amount: threshold })

  const variants = getVariants(direction, distance)

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // expo-out — feeling premium
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * ScrollRevealGroup — Stagger automatique pour les listes d'éléments.
 * 
 * Usage :
 * <ScrollRevealGroup stagger={0.1} direction="up">
 *   <item /><item /><item />
 * </ScrollRevealGroup>
 */
interface ScrollRevealGroupProps {
  children: ReactNode[]
  direction?: Direction
  stagger?: number
  delay?: number
  className?: string
  itemClassName?: string
}

export function ScrollRevealGroup({
  children,
  direction = 'up',
  stagger = 0.1,
  delay = 0,
  className,
  itemClassName,
}: ScrollRevealGroupProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  }

  const itemVariants = getVariants(direction, 40)

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children.map((child, i) => (
        <motion.div
          key={i}
          variants={itemVariants}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={itemClassName}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}
