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
  Award,
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

  // ─── SECTION 1: HERO ───────────────────────────────────────────────────────
  // ─── SECTION 1: HERO SHOWROOM BUGATTI CHIRON ──────────────────────────────
  if (section.type === 'hero') {
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

        <section className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-between items-center px-4 sm:px-6 pt-16 sm:pt-24 pb-8 sm:pb-12 overflow-hidden bg-[#080807]">
          {/* Photographie Showroom Bugatti Chiron 2016 avec reflets réalistes */}
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.bgImage || '/images/hero-chiron-showroom.jpg'}
              alt="Bugatti Chiron 2016 — Showroom Dream Frame"
              className="w-full h-full object-cover object-top sm:object-center brightness-[0.92] contrast-[1.05]"
            />
            {/* Dégradé supérieur pour la lisibilité du header */}
            <div className="absolute inset-x-0 top-0 h-32 sm:h-44 bg-gradient-to-b from-[#080807]/90 via-[#080807]/40 to-transparent pointer-events-none" />
            
            {/* Dégradé latéral cinéma / vignette */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 pointer-events-none" />

            {/* Dégradé noir progressif en bas du hero invitant naturellement au scroll */}
            <div className="absolute inset-x-0 bottom-0 h-64 sm:h-80 bg-gradient-to-t from-[#080807] via-[#080807]/80 via-40% to-transparent pointer-events-none" />
          </div>

          {/* Espace négatif supérieur autour de la supercar */}
          <div className="relative z-10 w-full flex-1 min-h-[30vh] sm:min-h-[42vh]" />

          {/* Contenu Typographique & CTAs du Concept (Positionné avec élégance sous les reflets) */}
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4 sm:space-y-5 pb-2">
            {/* Eyebrow minimalist */}
            <p className="text-[10px] sm:text-xs font-light tracking-[0.35em] sm:tracking-[0.45em] uppercase text-neutral-300/90 font-sans">
              {s.badgeText || "L'ART DE CAPTURER"}
            </p>

            {/* Titre Principal Majestueux Trajan / Serif */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-light font-serif tracking-[0.25em] sm:tracking-[0.35em] uppercase text-white leading-tight">
              {s.title || "L'EXCEPTIONNEL"}
            </h1>

            {/* Ligne d'accent horizontale minimaliste */}
            <div className="w-12 sm:w-16 h-[1px] bg-neutral-500/60 mx-auto" />

            {/* Sous-titre descriptif */}
            <p className="text-[11px] sm:text-xs text-neutral-400 font-light tracking-[0.2em] sm:tracking-[0.26em] uppercase max-w-lg mx-auto leading-relaxed">
              {s.subtitle || "DES VOITURES DE LÉGENDE, ENCADRÉES POUR L'ÉTERNITÉ."}
            </p>

            {/* Les deux CTA du concept */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-3 sm:pt-4">
              <Link
                href={isEditor ? '#' : (s.primaryBtnLink || '#collection')}
                className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-full border border-white/85 bg-white/10 hover:bg-white hover:text-black text-white text-[11px] sm:text-xs uppercase tracking-[0.22em] font-medium transition-all duration-300 backdrop-blur-md shadow-2xl active:scale-[0.98] text-center"
              >
                <span>{s.primaryBtnText || 'Visiter notre galerie'}</span>
              </Link>

              <Link
                href={isEditor ? '#' : (s.secondaryBtnLink || '/catalogue')}
                className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-full border border-neutral-700/80 hover:border-amber-400/80 bg-black/40 hover:bg-black/70 text-neutral-300 hover:text-amber-300 text-[11px] sm:text-xs uppercase tracking-[0.22em] font-medium transition-all duration-300 backdrop-blur-md shadow-2xl active:scale-[0.98] text-center"
              >
                <span>{s.secondaryBtnText || 'Notre collection passionnée'}</span>
              </Link>
            </div>

            {/* Flèche vers le bas incitant au scroll */}
            <div className="pt-4 sm:pt-6 flex justify-center">
              <a
                href={isEditor ? '#' : '#collection'}
                aria-label="Faire défiler vers la collection"
                className="flex flex-col items-center gap-2 text-white/50 hover:text-white transition-colors duration-300 group cursor-pointer"
              >
                <div className="w-[1px] h-7 sm:h-9 bg-gradient-to-b from-white/10 via-white/40 to-white animate-pulse" />
                <ChevronDown className="w-3.5 h-3.5 text-white/60 group-hover:translate-y-1 transition-transform" />
              </a>
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

  // ─── SECTION 3: NOTRE COLLECTION (GALERIE D'ART HAUT DE GAMME) ─────────────
  if (section.type === 'collection') {
    // 4 cadres phares du concept (McLaren, Audi R8, Cayenne, Ferrari F40)
    const FEATURED_CONCEPT_FRAMES = [
      {
        id: 'frame-mclaren-gt',
        slug: 'mclaren-gt-2019-cadre-3d',
        name: 'McLaren GT',
        year: 2019,
        brand: 'McLaren',
        specs: 'V8 Biturbo · 620 CH',
        tag: 'Édition Galerie',
        image: '/images/frames/frame-mclaren-gt.jpg',
        price: '49,99 €',
      },
      {
        id: 'frame-audi-r8',
        slug: 'audi-r8-v10-performance-cadre-3d',
        name: 'Audi R8',
        year: 2018,
        brand: 'Audi',
        specs: 'V10 Atmosphérique · 620 CH',
        tag: 'Pièce Numérotée',
        image: '/images/frames/frame-audi-r8.jpg',
        price: '49,99 €',
      },
      {
        id: 'frame-porsche-cayenne',
        slug: 'porsche-cayenne-turbo-2016-cadre-3d',
        name: 'Porsche Cayenne',
        year: 2016,
        brand: 'Porsche',
        specs: 'V8 Biturbo · 570 CH',
        tag: 'Collector 3D',
        image: '/images/frames/frame-porsche-cayenne.jpg',
        price: '49,99 €',
      },
      {
        id: 'frame-ferrari-f40',
        slug: 'ferrari-f40-1987-cadre-3d',
        name: 'Ferrari F40',
        year: 1987,
        brand: 'Ferrari',
        specs: 'V8 Twin-Turbo · 478 CH',
        tag: 'Icône Éternelle',
        image: '/images/frames/frame-ferrari-f40.jpg',
        price: '49,99 €',
      },
    ]

    return (
      <div
        id="collection"
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
              GALERIE · {section.name}
            </span>
          </div>
        )}

        <section className="py-16 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16 bg-[#080807] transition-all duration-700">
          {/* En-tête Collection Minimaliste avec Ligne Fine (Concept 100% Fidèle) */}
          <div className="flex items-center justify-between gap-4 sm:gap-8">
            <h2 className="text-xs sm:text-sm font-light tracking-[0.35em] sm:tracking-[0.45em] text-neutral-200 uppercase font-sans whitespace-nowrap">
              {s.title || 'NOTRE COLLECTION'}
            </h2>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-neutral-600 via-neutral-700/60 to-transparent" />
            <Link
              href={isEditor ? '#' : '/catalogue'}
              className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-neutral-400 hover:text-amber-300 transition-colors whitespace-nowrap hidden sm:inline-flex items-center gap-1.5"
            >
              <span>Voir tout le catalogue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Grille des 4 Cadres Verticaux A4 avec Éclairage Galerie Spot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-8 items-start">
            {FEATURED_CONCEPT_FRAMES.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col items-center space-y-4"
              >
                {/* Spot lumineux galerie haut de gamme au-dessus du cadre */}
                <div className="w-full flex flex-col items-center pointer-events-none -mb-3 sm:-mb-4 z-10">
                  {/* Luminaire rail */}
                  <div className="w-2.5 h-1 bg-neutral-600 rounded-sm shadow-md" />
                  {/* Source chaude */}
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-100 shadow-[0_0_16px_rgba(254,243,199,0.95)]" />
                  {/* Faisceau lumineux conique descendant sur le cadre */}
                  <div className="w-full h-12 bg-gradient-to-b from-amber-100/15 via-amber-200/5 to-transparent blur-sm" />
                </div>

                {/* Cadre d'Art Vertical Format A4 (aspect-[1/1.414]) */}
                <Link
                  href={isEditor ? '#' : `/produit/${item.slug}`}
                  className="relative w-full aspect-[1/1.414] rounded-sm p-2 sm:p-2.5 bg-gradient-to-br from-[#2a2825] via-[#1c1b19] to-[#121110] ring-1 ring-neutral-700/60 shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_20px_rgba(251,191,36,0.03)] hover:shadow-[0_25px_60px_rgba(0,0,0,1),0_0_35px_rgba(251,191,36,0.12)] hover:ring-amber-400/40 transition-all duration-500 overflow-hidden block"
                >
                  {/* Passe-partout intérieur biseauté noir conservation */}
                  <div className="relative w-full h-full bg-neutral-950 overflow-hidden ring-1 ring-black/90">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={`${item.name} (${item.year}) — Cadre 3D Dream Frame`}
                      className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    />

                    {/* Reflet verre optique subtil */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none" />

                    {/* Badge édition discrète au survol */}
                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-neutral-700 text-amber-300 text-[9px] font-mono uppercase tracking-wider">
                        {item.tag}
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Fiche Descriptive & Boutons Minimalistes */}
                <div className="w-full text-center space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-neutral-400 text-[10px] font-mono uppercase tracking-widest px-1">
                    <span>{item.brand} · {item.year}</span>
                    <span className="text-amber-400/90 font-semibold">{item.price}</span>
                  </div>

                  <h3 className="text-sm font-serif tracking-[0.2em] text-white uppercase group-hover:text-amber-300 transition-colors">
                    {item.name}
                  </h3>

                  <p className="text-[11px] text-neutral-400 font-light">
                    {item.specs}
                  </p>

                  <div className="pt-2 flex items-center justify-center gap-2">
                    <Link
                      href={isEditor ? '#' : `/produit/${item.slug}`}
                      className="px-4 py-1.5 rounded-full border border-neutral-800 hover:border-neutral-600 bg-neutral-900/60 hover:bg-neutral-800 text-white text-[10px] font-medium uppercase tracking-wider transition-all"
                    >
                      Voir le cadre
                    </Link>
                    <Link
                      href={isEditor ? '#' : '/configurateur'}
                      className="px-4 py-1.5 rounded-full border border-amber-400/40 hover:border-amber-400 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 text-[10px] font-medium uppercase tracking-wider transition-all"
                    >
                      Sur-mesure
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Ambiance Salon & Assises Galerie au Premier Plan */}
          <div className="pt-8 border-t border-neutral-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <p className="text-xs text-neutral-400 font-light">
                Chaque œuvre est fabriquée à l’unité sous vitrage optique avec éclairage LED ambré 3000K intégré.
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
              <Award className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
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

  return null
}
