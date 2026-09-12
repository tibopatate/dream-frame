'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PageSection } from '@/lib/page-builder/types'
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  Zap,
  CheckCircle,
  Star,
  Layers,
  ChevronUp,
  ChevronDown,
  Eye,
  Trash2,
  GripVertical,
} from 'lucide-react'
import { ProductDemonstrationSection } from '@/components/home/ProductDemonstrationSection'
import { MOCK_PRODUCTS } from '@/lib/mock-data'
import { formatPriceFromDecimal } from '@/lib/utils'

interface SectionRendererProps {
  section: PageSection
  isEditor?: boolean
  isSelected?: boolean
  isHovered?: boolean
  liveProducts?: any[]
  onSelect?: () => void
  onHover?: (hovering: boolean) => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  onDelete?: () => void
}

export function SectionRenderer({
  section,
  isEditor = false,
  isSelected = false,
  isHovered = false,
  liveProducts,
  onSelect,
  onHover,
  onMoveUp,
  onMoveDown,
  onDelete,
}: SectionRendererProps) {
  if (section.hidden && !isEditor) {
    return null
  }

  const s = section.settings || {}

  // ─── EDITOR OVERLAY ────────────────────────────────────────────────────────
  const outlineClass = isEditor
    ? isSelected
      ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-black relative z-20'
      : isHovered
      ? 'ring-1 ring-blue-400 ring-offset-1 ring-offset-black/50 relative z-10'
      : 'relative'
    : ''

  const handleClick = (e: React.MouseEvent) => {
    if (isEditor && onSelect) {
      e.stopPropagation()
      onSelect()
    }
  }

  const handleMouseEnter = () => {
    if (isEditor && onHover) onHover(true)
  }

  const handleMouseLeave = () => {
    if (isEditor && onHover) onHover(false)
  }

  // ─── SECTION 1: HERO SHOWROOM D'EXCEPTION ─────────────────────────────────
  if (section.type === 'hero') {
    const heroImage = s.bgImage || liveProducts?.[0]?.images?.[0] || 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=1200&auto=format&fit=crop'

    return (
      <div
        className={`${outlineClass} ${section.hidden ? 'opacity-40 grayscale' : ''}`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isEditor && (
          <div className="absolute top-4 left-6 z-30 flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider shadow-lg ${
              isSelected ? 'bg-amber-400 text-black' : 'bg-blue-600 text-white'
            }`}>
              HERO SHOWROOM · {section.name}
            </span>
          </div>
        )}

        <section className="relative min-h-[62vh] sm:min-h-[70vh] lg:min-h-[76vh] flex flex-col justify-between items-center px-4 sm:px-6 pt-16 sm:pt-20 pb-16 sm:pb-28 overflow-hidden bg-[#080807]">
          {/* Vidéo Réelle d'Art Automobile en Fond ou Photographie d'Exception */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            {Boolean(s.bgVideo) ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                poster={heroImage}
                className="w-full h-full object-cover object-center brightness-[1.05] contrast-[1.02] pointer-events-none"
              >
                <source src={s.bgVideo} type="video/mp4" />
              </video>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={heroImage}
                alt={s.title ? `${s.title} — Cadre 3D d'Art Automobile Dream Frame` : "Art Automobile d'Exception — Cadre 3D Dream Frame"}
                className="w-full h-full object-cover object-center brightness-[1.0] contrast-[1.05] scale-105"
              />
            )}
            {/* Dégradé supérieur léger pour la lisibilité du header */}
            <div className="absolute inset-x-0 top-0 h-24 sm:h-32 bg-gradient-to-b from-[#080807]/70 via-[#080807]/20 to-transparent pointer-events-none" />
            
            {/* Dégradé latéral subtil cinéma */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#080807]/30 via-transparent to-[#080807]/30 pointer-events-none" />

            {/* Dégradé noir doux en bas du hero */}
            <div className="absolute inset-x-0 bottom-0 h-44 sm:h-56 bg-gradient-to-t from-[#080807] via-[#080807]/60 to-transparent pointer-events-none" />
          </div>

          {/* Espace supérieur modéré pour remonter le contenu */}
          <div className="relative z-10 w-full flex-1 min-h-[12vh] sm:min-h-[16vh] lg:min-h-[20vh]" />

          {/* Contenu Typographique & CTAs du Concept (Remonté au premier plan) */}
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-3.5 sm:space-y-4 pb-2">
            {/* Eyebrow minimalist */}
            <p className="text-[10px] sm:text-xs font-light tracking-[0.35em] sm:tracking-[0.45em] uppercase text-neutral-300/90 font-sans">
              {s.badgeText || "L'ART DE CAPTURER"}
            </p>

            {/* Titre Principal Majestueux Trajan / Serif */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-[0.25em] sm:tracking-[0.35em] uppercase text-white leading-tight drop-shadow-md">
              {s.title || "L'EXCEPTIONNEL"}
            </h1>

            {/* Ligne d'accent horizontale minimaliste */}
            <div className="w-12 sm:w-16 h-[1px] bg-neutral-500/60 mx-auto" />

            {/* Sous-titre descriptif */}
            <p className="text-[11px] sm:text-xs text-neutral-300 font-light tracking-[0.2em] sm:tracking-[0.26em] uppercase max-w-lg mx-auto leading-relaxed drop-shadow-sm">
              {s.subtitle || "DES VOITURES DE LÉGENDE, ENCADRÉES POUR L'ÉTERNITÉ."}
            </p>

            {/* Le CTA remonté et centré */}
            <div className="flex items-center justify-center pt-2 sm:pt-4 w-full">
              <Link
                href={isEditor ? '#' : (s.primaryBtnLink === '#collection' ? '/catalogue' : s.primaryBtnLink || '/catalogue')}
                className="w-auto px-8 sm:px-12 py-3.5 sm:py-4 rounded-full border border-white/85 bg-white/10 hover:bg-white hover:text-black text-white text-[10px] sm:text-xs uppercase tracking-widest sm:tracking-[0.22em] font-medium transition-all duration-300 backdrop-blur-md shadow-2xl active:scale-[0.98] text-center"
              >
                <span>{s.primaryBtnText || 'Visiter notre galerie'}</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  // ─── SECTION 2: DEMO 3D ───────────────────────────────────────────────────
  if (section.type === 'demo') {
    return (
      <div
        className={`${outlineClass} ${section.hidden ? 'opacity-40 grayscale' : ''}`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isEditor && (
          <div className="absolute top-4 left-6 z-30 flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider shadow-lg ${
              isSelected ? 'bg-amber-400 text-black' : 'bg-blue-600 text-white'
            }`}>
              DÉMONSTRATION 3D · {section.name}
            </span>
          </div>
        )}
        <ProductDemonstrationSection />
      </div>
    )
  }

  // ─── SECTION 3: NOTRE COLLECTION (4 VRAIS CADRES DE LA BOUTIQUE) ───────────
  if (section.type === 'collection') {
    // 4 véritables cadres de la boutique (Ferrari F40, Bugatti Chiron, Pagani Huayra, Audi R8)
    const REAL_STORE_FRAMES = [
      {
        id: 'real-ferrari-f40',
        slug: 'ferrari-f40-1987-cadre-3d',
        name: 'Ferrari F40 (1987)',
        year: 1987,
        brand: 'Ferrari',
        specs: 'V8 Twin-Turbo · 478 CH',
        tag: 'Atelier France · Pièce Réelle',
        image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1200&auto=format&fit=crop',
        imageHover: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop',
        price: '49,99 €',
      },
      {
        id: 'real-bugatti-chiron',
        slug: 'bugatti-chiron-2016-cadre-3d',
        name: 'Bugatti Chiron (2016)',
        year: 2016,
        brand: 'Bugatti',
        specs: 'W16 Quadri-Turbo · 1 500 CH',
        tag: 'Ébénisterie & LED',
        image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=1200&auto=format&fit=crop',
        imageHover: 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?q=80&w=1200&auto=format&fit=crop',
        price: '49,99 €',
      },
      {
        id: 'real-pagani-huayra',
        slug: 'pagani-huayra-v12-cadre-3d',
        name: 'Pagani Huayra V12',
        year: 2023,
        brand: 'Pagani',
        specs: 'V12 Biturbo AMG · 730 CH',
        tag: 'Carbo-Titane & Relief',
        image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop',
        imageHover: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
        price: '49,99 €',
      },
      {
        id: 'real-audi-r8v10',
        slug: 'audi-r8-v10-performance-cadre-3d',
        name: 'Audi R8 V10',
        year: 2018,
        brand: 'Audi',
        specs: 'V10 Atmosphérique · 620 CH',
        tag: 'Vitrage HD & Module LED',
        image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1200&auto=format&fit=crop',
        imageHover: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1200&auto=format&fit=crop',
        price: '49,99 €',
      },
      {
        id: 'real-bmw-m4comp',
        slug: 'bmw-m4-competition-isle-of-man-cadre-3d',
        name: 'BMW M4 Competition',
        year: 2023,
        brand: 'BMW',
        specs: '6 Cyl. Biturbo · 510 CH',
        tag: 'Atelier France · Pièce Réelle',
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1200&auto=format&fit=crop',
        imageHover: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1200&auto=format&fit=crop',
        price: '49,99 €',
      },
    ]

    return (
      <div
        id="collection"
        className={`relative z-20 -mt-16 sm:-mt-24 lg:-mt-32 ${outlineClass} ${section.hidden ? 'opacity-40 grayscale' : ''}`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isEditor && (
          <div className="absolute top-4 left-6 z-30 flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider shadow-lg ${
              isSelected ? 'bg-amber-400 text-black' : 'bg-blue-600 text-white'
            }`}>
              {section.name}
            </span>
          </div>
        )}

        <section className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12 transition-all duration-700">
          {/* En-tête Collection Minimaliste avec Ligne Fine (Concept 100% Fidèle) */}
          <div className="flex items-center justify-between gap-4 sm:gap-8">
            <h2 className="text-[10px] sm:text-xs font-light tracking-[0.3em] sm:tracking-[0.4em] text-neutral-200 uppercase font-sans whitespace-nowrap">
              {s.title || 'NOTRE COLLECTION PASSIONNÉE'}
            </h2>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-neutral-600 via-neutral-700/60 to-transparent" />
            <Link
              href={isEditor ? '#' : '/catalogue'}
              className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-neutral-400 hover:text-amber-300 transition-colors whitespace-nowrap inline-flex items-center gap-1.5"
            >
              <span>Tout voir</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Liste Horizontale des Cadres : 4 sur mobile, 5 sur PC */}
          <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 gap-4 sm:gap-5 lg:gap-6 snap-x snap-mandatory hide-scrollbar sm:justify-center">
            {(() => {
              const allAvailable = (liveProducts && liveProducts.length > 0) ? liveProducts : REAL_STORE_FRAMES
              let displayed: any[] = []

              if (s.mode === 'manual' && Array.isArray(s.selectedProductIds) && s.selectedProductIds.length > 0) {
                displayed = s.selectedProductIds
                  .map((id: string) => allAvailable.find((p: any) => p.id === id || p.slug === id))
                  .filter(Boolean)
                if (displayed.length === 0) {
                  displayed = allAvailable.slice(0, s.limit || 5)
                }
              } else {
                if (s.category && s.category !== 'ALL') {
                  displayed = allAvailable.filter((p: any) => p.era === s.category)
                } else {
                  displayed = allAvailable
                }
                displayed = displayed.slice(0, s.limit || 5)
              }

              return displayed.map((rawItem: any, idx: number) => {
                const item = {
                  id: rawItem.id,
                  slug: rawItem.slug,
                  name: rawItem.name,
                  year: rawItem.year || 2023,
                  brand: rawItem.brand,
                  specs: rawItem.specs || rawItem.description?.slice(0, 50) || 'Atelier France · Pièce Réelle',
                  tag: rawItem.tag || (rawItem.era === 'VINTAGE' ? 'Pièce Historique' : 'Atelier France · Pièce Réelle'),
                  image: rawItem.image || rawItem.images?.[0] || 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=1200&auto=format&fit=crop',
                  imageHover: rawItem.imageHover || rawItem.images?.[1] || null,
                  price: typeof rawItem.price === 'number' ? `${rawItem.price.toFixed(2).replace('.', ',')} €` : rawItem.price,
                }

                return (
                  <div
                    key={item.id}
                    className={`snap-start shrink-0 w-[55vw] sm:w-[190px] md:w-[210px] lg:w-[230px] group flex-col items-center space-y-3 ${
                      idx >= 4 ? 'hidden sm:flex' : 'flex'
                    }`}
                  >
                {/* Vrai Cadre d'Art de la Boutique (aspect-[3/4] élégant) */}
                <Link
                  href={isEditor ? '#' : `/produit/${item.slug}`}
                  className="relative w-full aspect-[3/4] rounded-xl p-1.5 sm:p-2 bg-neutral-900/60 border border-neutral-800 ring-1 ring-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.95),0_0_15px_rgba(251,191,36,0.03)] hover:shadow-[0_20px_45px_rgba(0,0,0,1),0_0_25px_rgba(251,191,36,0.15)] hover:border-amber-400/60 transition-all duration-500 overflow-hidden block group/frame"
                >
                  <div className="relative w-full h-full rounded-lg bg-neutral-950 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={`${item.name} — Véritable Cadre 3D Dream Frame`}
                      className={`w-full h-full object-cover object-center transition-all duration-500 ${
                        item.imageHover ? 'group-hover/frame:opacity-0 group-hover/frame:scale-105' : 'group-hover/frame:scale-105'
                      }`}
                    />

                    {/* Image 2 au survol sur PC */}
                    {item.imageHover && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={item.imageHover}
                        alt={`${item.name} — Vue 2 Dream Frame`}
                        className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover/frame:opacity-100 group-hover/frame:scale-105 transition-all duration-500 pointer-events-none"
                      />
                    )}

                    {/* Reflet de vitrage optique */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none" />

                    {/* Badge réel atelier */}
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-neutral-700 text-amber-300 text-[9px] font-mono uppercase tracking-wider font-semibold">
                        {item.tag}
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Fiche Descriptive & Boutons */}
                <div className="w-full text-center space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-neutral-400 text-[10px] font-mono uppercase tracking-widest px-1">
                    <span>{item.brand} · {item.year}</span>
                    <span className="text-amber-400/90 font-semibold">{item.price}</span>
                  </div>

                  <h3 className="text-sm tracking-[0.2em] text-white uppercase group-hover:text-amber-300 transition-colors">
                    {item.name}
                  </h3>

                  <p className="text-[11px] text-neutral-400 font-light">
                    {item.specs}
                  </p>

                  <div className="pt-2 flex items-center justify-center">
                    <Link
                      href={isEditor ? '#' : `/produit/${item.slug}`}
                      className="px-5 py-2 rounded-full border border-neutral-700 hover:border-amber-400/80 bg-neutral-900/90 hover:bg-neutral-800 text-white text-[11px] font-semibold uppercase tracking-wider transition-all shadow-sm"
                    >
                      Découvrir le cadre
                    </Link>
                  </div>
                </div>
              </div>
            )
          })
        })()}
      </div>

          {/* Ambiance Atelier & Savoir-faire */}
          <div className="pt-8 border-t border-neutral-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <p className="text-xs text-neutral-400 font-light">
                Chaque pièce est assemblée à la main en France sous vitrage optique avec éclairage LED ambré 3000K intégré.
              </p>
            </div>

            <Link
              href={isEditor ? '#' : '/catalogue'}
              className="sm:hidden w-full px-6 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-medium uppercase tracking-wider text-center"
            >
              Voir tout le catalogue (8 cadres)
            </Link>
          </div>
        </section>
      </div>
    )
  }

  // ─── SECTION 4: CRAFT / SAVOIR-FAIRE ──────────────────────────────────────
  if (section.type === 'craft') {
    const layers = [
      { num: '01', title: s.layer1Title || "Papier d'Art 310g", desc: s.layer1Desc || "Canson Rag Photographique pur coton, résistant plus de 100 ans." },
      { num: '02', title: s.layer2Title || "Découpe Laser Micron", desc: s.layer2Desc || "Ailerons, jantes et galbes découpés sans aucune bavure." },
      { num: '03', title: s.layer3Title || "Passe-Partout Biseauté", desc: s.layer3Desc || "Biseau 45° taillé à la main dans un carton de conservation sans acide." },
      { num: '04', title: s.layer4Title || "Module LED 3000K", desc: s.layer4Desc || "Éclairage blanc chaud basse consommation pour sublimer la silhouette." },
      { num: '05', title: s.layer5Title || "Vitrage Acrylique HD", desc: s.layer5Desc || "Transmittance optique 99,2% et cadre aluminium anodisé noir." },
    ]

    return (
      <div
        className={`${outlineClass} ${section.hidden ? 'opacity-40 grayscale' : ''}`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isEditor && (
          <div className="absolute top-4 left-6 z-30 flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider shadow-lg ${
              isSelected ? 'bg-amber-400 text-black' : 'bg-blue-600 text-white'
            }`}>
              SAVOIR-FAIRE · {section.name}
            </span>
          </div>
        )}

        <section className="py-16 sm:py-24 border-t border-neutral-800/80 bg-neutral-950/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
            <div className="max-w-2xl mx-auto text-center space-y-2">
              <span className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-amber-400 font-semibold">
                {s.badge || 'Exigence Artisanale'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {s.title || "L'Anatomie d'une Pièce d'Exception"}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 font-light">
                {s.desc || '5 couches de matériaux nobles minutieusement assemblées dans notre atelier en France.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {layers.map((step) => (
                <div
                  key={step.num}
                  className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-2"
                >
                  <span className="text-xs font-mono font-bold text-amber-400 block">{step.num}</span>
                  <h3 className="text-sm font-bold text-white">{step.title}</h3>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    )
  }

  // ─── SECTION 5: REASSURANCE ───────────────────────────────────────────────
  if (section.type === 'reassurance') {
    return (
      <div
        className={`${outlineClass} ${section.hidden ? 'opacity-40 grayscale' : ''}`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isEditor && (
          <div className="absolute top-4 left-6 z-30 flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider shadow-lg ${
              isSelected ? 'bg-amber-400 text-black' : 'bg-blue-600 text-white'
            }`}>
              RÉASSURANCE · {section.name}
            </span>
          </div>
        )}

        <section className="py-12 border-t border-neutral-800/80 max-w-7xl mx-auto px-4 sm:px-6 bg-[#080807]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60">
              <Truck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">{s.item1Title || 'Livraison 100% Offerte'}</h4>
                <p className="text-[11px] text-neutral-400 font-light mt-0.5">
                  {s.item1Desc || 'Colissimo Suivi 48h en France avec emballage renforcé anti-choc.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60">
              <ShieldCheck className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">{s.item2Title || 'Droit de Rétractation 14 Jours'}</h4>
                <p className="text-[11px] text-neutral-400 font-light mt-0.5">
                  {s.item2Desc || 'Retour simple et sécurisé conformément à la législation française.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60">
              <Zap className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">{s.item3Title || 'LED & Fixations Incluses'}</h4>
                <p className="text-[11px] text-neutral-400 font-light mt-0.5">
                  {s.item3Desc || 'Chaque pièce arrive prête à poser sur un meuble ou à accrocher au mur.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60">
              <CheckCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">{s.item4Title || 'Manufacture & Contrôle Unitaire'}</h4>
                <p className="text-[11px] text-neutral-400 font-light mt-0.5">
                  {s.item4Desc || 'Chaque cadre est inspecté individuellement avant son expédition.'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  // ─── SECTION 6: CUSTOM ATELIER ───────────────────────────────────────────
  if (section.type === 'custom_atelier') {
    return (
      <div
        className={`${outlineClass} ${section.hidden ? 'opacity-40 grayscale' : ''}`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isEditor && (
          <div className="absolute top-4 left-6 z-30 flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider shadow-lg ${
              isSelected ? 'bg-amber-400 text-black' : 'bg-blue-600 text-white'
            }`}>
              ATELIER SUR-MESURE · {section.name}
            </span>
          </div>
        )}

        <section className="py-16 sm:py-24 border-t border-neutral-800/80 bg-[#080807]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
            <span className="text-xs tracking-[0.2em] uppercase text-amber-400 inline-block font-semibold">
              {s.badge || 'Configuration Personnalisée'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {s.title || 'Un modèle précis ? Une échelle spécifique ?'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 font-light max-w-xl mx-auto leading-relaxed">
              {s.desc ||
                'Composez votre cadre idéal : dimensions (A4, A3, A2), modèle automobile et échelle miniature. Notre configurateur live vous permet de visualiser votre projet instantanément.'}
            </p>
            <Link
              href={isEditor ? '#' : (s.btnLink || '/configurateur')}
              className="relative inline-flex items-center gap-2.5 px-10 py-4 bg-white hover:bg-neutral-100 text-black font-bold text-xs tracking-widest uppercase rounded-xl overflow-hidden transition-all shadow-2xl shadow-white/10 group active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{s.btnText || "Accéder à l'Atelier Sur-Mesure"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    )
  }

  // ─── SECTION: INTERIORS ────────────────────────────────────────────────────
  if (section.type === 'interiors') {
    return (
      <div
        className={`${outlineClass} ${section.hidden ? 'opacity-40 grayscale' : ''}`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isEditor && (
          <div className="absolute top-4 left-6 z-30 flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider shadow-lg ${
              isSelected ? 'bg-amber-400 text-black' : 'bg-blue-600 text-white'
            }`}>
              INTÉRIEURS · {section.name}
            </span>
          </div>
        )}

        <section className="py-16 sm:py-24 border-t border-neutral-800/80 bg-neutral-950/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {s.title || 'Laissez les sublimer votre pièce'}
              </h2>
              <p className="text-neutral-400 font-light text-sm sm:text-base">
                {s.desc || 'Découvrez comment nos cadres d’exception s’intègrent parfaitement dans tout type d’intérieur.'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden group">
                <img src="/interiors/lamborghini.jpg" alt="Interior Lamborghini" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
              </div>
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden group md:translate-y-8">
                <img src="/interiors/ferrari.jpg" alt="Interior Ferrari" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
              </div>
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden group">
                <img src="/interiors/porsche.jpg" alt="Interior Porsche" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  // ─── SECTION: ABOUT ────────────────────────────────────────────────────────
  if (section.type === 'about') {
    return (
      <div
        className={`${outlineClass} ${section.hidden ? 'opacity-40 grayscale' : ''}`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isEditor && (
          <div className="absolute top-4 left-6 z-30 flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider shadow-lg ${
              isSelected ? 'bg-amber-400 text-black' : 'bg-blue-600 text-white'
            }`}>
              À PROPOS · {section.name}
            </span>
          </div>
        )}

        <section className="py-20 sm:py-32 border-t border-neutral-800/80 bg-[#080807]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {s.title || 'Qui sommes-nous ?'}
            </h2>
            <div className="w-16 h-1 bg-amber-400 mx-auto rounded-full" />
            <p className="text-base sm:text-lg text-neutral-300 font-light leading-relaxed max-w-2xl mx-auto">
              {s.desc || 'Dream Frame est né d\'une passion commune pour l\'automobile et l\'artisanat français. Nous concevons et assemblons chaque cadre à la main dans notre atelier, avec une exigence de qualité absolue.'}
            </p>
          </div>
        </section>
      </div>
    )
  }

  // ─── SECTION: FAQ ──────────────────────────────────────────────────────────
  if (section.type === 'faq') {
    const faqItems = (Array.isArray(s.items) && s.items.length > 0)
      ? s.items
      : [
          { q: s.q1 || 'Quels sont les délais de fabrication et de livraison ?', a: s.a1 || 'Chaque cadre étant assemblé à la main à la demande, il faut compter 4 à 6 jours ouvrés pour la confection et l\'expédition.' },
          { q: s.q2 || 'Comment s\'alimente le rétroéclairage LED ?', a: s.a2 || 'Nos cadres sont fournis avec une batterie discrète rechargeable par USB-C, garantissant un rendu propre sans câble apparent.' },
          { q: s.q3 || 'Puis-je commander un modèle spécifique sur-mesure ?', a: s.a3 || 'Oui, notre atelier sur-mesure vous permet de configurer le cadre avec le véhicule de votre choix.' },
        ].filter((it) => it.q || it.a)

    return (
      <div
        className={`${outlineClass} ${section.hidden ? 'opacity-40 grayscale' : ''}`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isEditor && (
          <div className="absolute top-4 left-6 z-30 flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider shadow-lg ${
              isSelected ? 'bg-amber-400 text-black' : 'bg-blue-600 text-white'
            }`}>
              FAQ · {section.name}
            </span>
          </div>
        )}

        <section className="py-16 sm:py-24 border-t border-neutral-800/80 bg-neutral-950/30">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10 sm:space-y-12">
            <h2 className="text-2xl sm:text-4xl font-black text-center text-white tracking-tight">
              {s.title || 'Questions Fréquentes'}
            </h2>
            
            <div className="space-y-4 sm:space-y-5">
              {faqItems.map((item: any, idx: number) => {
                if (!item.q && !item.a) return null
                
                return (
                  <div
                    key={item.id || idx}
                    className="p-5 sm:p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 transition-all hover:border-neutral-700 space-y-2"
                  >
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                      {item.q}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </div>
    )
  }

  return null
}
