'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ShoppingBag, Zap, Check, Truck } from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface FrameShowcase {
  id: string
  slug: string
  name: string
  brand: string
  year: number
  era: 'VINTAGE' | 'MODERN'
  tagline: string
  description: string
  image: string
  price: number
}

const FEATURED_PIECES: FrameShowcase[] = [
  {
    id: 'mock-f40',
    slug: 'ferrari-f40-1987-cadre-3d',
    name: 'Ferrari F40 (1987)',
    brand: 'Ferrari',
    year: 1987,
    era: 'VINTAGE',
    tagline: "L'Ultime Chef-d'Oeuvre d'Enzo Ferrari",
    description:
      "Une legende brute en fibre de kevlar, aileron cathedrale mythique et moteur V8 biturbo. Capturee en miniature 1:24 en relief 3D sous vitrage d'exposition avec retroeclairage LED ambre.",
    image:
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1200&auto=format&fit=crop',
    price: 49.99,
  },
  {
    id: 'mock-gt3rs',
    slug: 'porsche-911-gt3-rs-992-cadre-3d',
    name: 'Porsche 911 GT3 RS (992)',
    brand: 'Porsche',
    year: 2023,
    era: 'MODERN',
    tagline: 'La Reine Indiscutee du Nurburgring',
    description:
      "Aerodynamisme actif DRS, rupteur a 9 000 tr/min et appui colossal. Les prises d'air avant et les ecopes d'ailes sont reproduites avec un realisme saisissant sous chassis d'ebenisterie.",
    image:
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop',
    price: 49.99,
  },
  {
    id: 'mock-250gto',
    slug: 'ferrari-250-gto-1962-cadre-3d',
    name: 'Ferrari 250 GTO (1962)',
    brand: 'Ferrari',
    year: 1962,
    era: 'VINTAGE',
    tagline: "L'Automobile la Plus Convoitee au Monde",
    description:
      "Dessinee par Bizzarrini et Scaglietti, la 250 GTO est le Saint Graal des collectionneurs. Finition sur passe-partout velours noir profond avec plaque commemorative numerotee.",
    image:
      'https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=1200&auto=format&fit=crop',
    price: 49.99,
  },
  {
    id: 'mock-revuelto',
    slug: 'lamborghini-revuelto-cadre-3d',
    name: 'Lamborghini Revuelto',
    brand: 'Lamborghini',
    year: 2024,
    era: 'MODERN',
    tagline: 'Le Futur Furtif du V12 Hybride',
    description:
      "Lignes d'avion de chasse furtif et puissance de 1 015 ch. Le cadre intègre un diffuseur LED rétroéclairé soulignant la signature lumineuse en Y emblématique de Sant'Agata.",
    image:
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1200&auto=format&fit=crop',
    price: 49.99,
  },
]

// ─── Variants Framer Motion ────────────────────────────────────────────────────

const slideFromLeft = {
  hidden:  { opacity: 0, x: -72 },
  visible: { opacity: 1, x: 0 },
}

const slideFromRight = {
  hidden:  { opacity: 0, x: 72 },
  visible: { opacity: 1, x: 0 },
}

const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

const easing = [0.22, 1, 0.36, 1] as const

// ─── Row animée individuelle ─────────────────────────────────────────────────

interface RowProps {
  piece: FrameShowcase
  index: number
  onAdd: (piece: FrameShowcase, e?: React.MouseEvent) => void
  addedId: string | null
}

function PieceRow({ piece, index, onAdd, addedId }: RowProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const isEven = index % 2 === 0

  // L'image arrive du côté extérieur, le texte du côté opposé
  const imageVariants = isEven ? slideFromLeft : slideFromRight
  const textVariants  = isEven ? slideFromRight : slideFromLeft

  const transition = { duration: 0.75, ease: easing, delay: 0.05 }

  return (
    <div
      ref={ref}
      className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 sm:gap-12 lg:gap-16 group`}
    >
      {/* ─── Image ─── */}
      <motion.div
        variants={imageVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        transition={transition}
        className="w-full lg:w-1/2"
      >
        <div className="relative aspect-[4/3] bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800/80 shadow-2xl transition-all duration-500 group-hover:border-neutral-700 group-hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)]">
          <Image
            src={piece.image}
            alt={piece.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />

          {/* Badges — épurés sur mobile */}
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex items-center gap-1.5 sm:gap-2">
            <span className="text-[9px] font-semibold uppercase tracking-widest bg-black/80 backdrop-blur-md text-amber-400 border border-neutral-800 px-2.5 sm:px-3 py-1 rounded-full">
              {piece.brand}
            </span>
            <span className="hidden sm:inline-block text-[9px] uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-neutral-800 px-2.5 py-1 rounded-full">
              {piece.year}
            </span>
          </div>

          {/* LED badge discret */}
          <div className="hidden sm:flex absolute bottom-4 right-4 bg-black/80 backdrop-blur-md text-neutral-300 text-[10px] px-3 py-1 rounded-full border border-neutral-800 items-center gap-1.5">
            <Zap className="w-3 h-3 text-amber-400" />
            LED intégrée
          </div>
        </div>
      </motion.div>

      {/* ─── Texte & CTA ─── */}
      <motion.div
        variants={textVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        transition={{ ...transition, delay: 0.15 }}
        className="w-full lg:w-1/2"
      >
        <div className="space-y-4 sm:space-y-5 text-center lg:text-left">
          <div className="space-y-1">
            <span className="text-xs tracking-widest text-amber-400 uppercase block">
              {piece.tagline}
            </span>
            <h3 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              {piece.name}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed max-w-lg mx-auto lg:mx-0">
            {piece.description}
          </p>

          {/* Prix & Livraison — Design sobre et haut de gamme, sans bordure fluo */}
          <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1">
            <span className="text-2xl sm:text-3xl font-bold text-white">
              49,99 €{' '}
              <span className="text-xs text-neutral-400 font-normal">TTC</span>
            </span>
            <span className="text-xs text-neutral-400 font-light tracking-wide flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              Livraison 100% Offerte
            </span>
          </div>

          {/* CTA avec effet shimmer */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            transition={{ ...transition, delay: 0.28 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1"
          >
            <button
              type="button"
              onClick={(e) => onAdd(piece, e)}
              className="relative w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-neutral-100 text-black font-semibold text-xs tracking-wider uppercase rounded-xl overflow-hidden transition-all duration-300 flex items-center justify-center gap-2.5 shadow-xl shadow-white/10 group/btn active:scale-[0.98]"
            >
              {/* Shimmer */}
              <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-black/8 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-full transition-transform duration-700" aria-hidden="true" />
              {addedId === piece.id ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  Ajouté au panier !
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  Ajouter au Panier — 49,99 €
                </>
              )}
            </button>

            <Link
              href={`/produit/${piece.slug}`}
              className="w-full sm:w-auto px-6 py-3.5 border border-neutral-800 hover:border-neutral-600 bg-neutral-900/80 hover:bg-neutral-900 text-neutral-300 hover:text-white text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Voir les détails
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Composant principal ──────────────────────────────────────────────────────

export function AlternatingScrollFrames() {
  const addItem = useCart((s) => s.addItem)
  const [addedId, setAddedId] = useState<string | null>(null)

  const handleQuickAdd = (piece: FrameShowcase, e?: React.MouseEvent) => {
    if (e) {
      import('@/components/FlyToCart').then(({ triggerFlyToCart }) => {
        triggerFlyToCart(e, { image: piece.image, quantity: 1 })
      })
    }

    addItem({
      variantId: `var-${piece.id}`,
      productId: piece.id,
      productName: piece.name,
      slug: piece.slug,
      brand: piece.brand,
      image: piece.image,
      price: piece.price,
      quantity: 1,
    })
    setAddedId(piece.id)
    setTimeout(() => setAddedId(null), 2000)
  }

  // En-tête de section animée
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, amount: 0.5 })

  return (
    <section className="py-16 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 space-y-16 sm:space-y-32">
      {/* En-tête */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 32 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-2xl mx-auto space-y-3"
      >
        <span className="text-[10px] tracking-[0.25em] uppercase text-amber-400 bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-full inline-block">
          Éditions d&apos;Exception
        </span>
        <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
          La Galerie en Mouvement
        </h2>
        <p className="text-sm text-neutral-400 font-light">
          Découvrez nos pièces phares. Chaque cadre est une œuvre autonome, prête à être accrochée.
        </p>
      </motion.div>

      {/* Rangées */}
      <div className="space-y-20 sm:space-y-36">
        {FEATURED_PIECES.map((piece, index) => (
          <PieceRow
            key={piece.id}
            piece={piece}
            index={index}
            onAdd={handleQuickAdd}
            addedId={addedId}
          />
        ))}
      </div>
    </section>
  )
}
