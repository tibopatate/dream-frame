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
              HERO · {section.name}
            </span>
          </div>
        )}

        <section className="relative min-h-[72vh] sm:min-h-[88vh] flex flex-col justify-center items-center px-4 sm:px-6 py-12 sm:py-20 overflow-hidden bg-[#080807]">
          {/* Photographie Réelle avec Animation Zoom */}
          <div className="absolute inset-0 z-0 animate-hero-zoom">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.bgImage || '/atelier/chiron-wall.jpg'}
              alt="Bugatti Chiron — Art Automobile Dream Frame"
              className="w-full h-full object-cover object-center brightness-[0.75] contrast-[1.1]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080807] via-[#080807]/30 to-[#080807]/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080807]/50 via-transparent to-[#080807]/50" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 my-auto">
            {/* Badge Atelier */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-neutral-800 text-amber-400 text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              {s.badgeText || 'Atelier Français · Cadres Décoratifs Supercars'}
            </div>

            {/* Titre Principal */}
            <h1 className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.02] sm:leading-[0.94] text-white">
              {s.title || "L'art de la supercar, sculpté en relief 3D."}
            </h1>

            {/* Sous-titre descriptif */}
            <p className="text-xs sm:text-base text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
              {s.subtitle || "Cadres d’ébénisterie automobile sous vitrage optique anti-UV avec rétroéclairage LED ambré intégré."}{' '}
              <span className="text-white font-semibold block sm:inline mt-1 sm:mt-0">
                {s.priceText || "À partir de 49,99 € · Livraison Colissimo 100% Offerte."}
              </span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
              <Link
                href={isEditor ? '#' : (s.primaryBtnLink || '/catalogue')}
                className="relative w-full sm:w-auto px-8 py-4 bg-white hover:bg-neutral-100 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 shadow-2xl shadow-white/20 flex items-center justify-center gap-2 group active:scale-[0.98]"
              >
                <span>{s.primaryBtnText || 'Découvrir la Collection'}</span>
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href={isEditor ? '#' : (s.secondaryBtnLink || '/configurateur')}
                className="relative w-full sm:w-auto px-8 py-4 bg-black/70 hover:bg-black/90 backdrop-blur-md border border-neutral-700 hover:border-amber-400/60 text-white text-xs tracking-wider uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{s.secondaryBtnText || 'Créer mon Dream Frame'}</span>
              </Link>
            </div>

            {/* Marques */}
            {s.showBrands !== false && (
              <div className="pt-4 flex items-center justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-neutral-400 uppercase tracking-widest font-mono flex-wrap">
                <span>Bugatti</span>
                <span className="text-neutral-700">·</span>
                <span>Pagani</span>
                <span className="text-neutral-700">·</span>
                <span>Audi</span>
                <span className="text-neutral-700">·</span>
                <span>BMW</span>
                <span className="text-neutral-700">·</span>
                <span>Lamborghini</span>
                <span className="text-neutral-700">·</span>
                <span>Porsche</span>
                <span className="text-neutral-700">·</span>
                <span>Ferrari</span>
                <span className="text-neutral-700">·</span>
                <span>McLaren</span>
              </div>
            )}
          </div>

          {/* 3 Badges de réassurance sous le Hero */}
          {s.showReassuranceBadges !== false && (
            <div className="relative z-10 w-full max-w-4xl mx-auto mt-8 sm:mt-12 pt-6 border-t border-neutral-800/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="flex items-center justify-center gap-2 text-xs text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Fait Main en France · Atelier</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Éclairage LED Ambré Intégré</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span>Verre Optique Anti-Reflet</span>
              </div>
            </div>
          )}
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

  // ─── SECTION 3: COLLECTION ────────────────────────────────────────────────
  if (section.type === 'collection') {
    let products = [...MOCK_PRODUCTS]
    if (s.category && s.category !== 'ALL') {
      products = products.filter((p) => p.era === s.category)
    }
    products = products.slice(0, s.limit || 8)

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
              CATALOGUE · {section.name}
            </span>
          </div>
        )}

        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 space-y-12 bg-[#080807]">
          {/* En-tête Collection */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-800/80 pb-8">
            <div className="space-y-3 max-w-2xl">
              <span className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-amber-400 font-semibold font-mono">
                {s.badge || 'Catalogue Collector 2026'}
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                {s.title || "Nos Cadres 3D d'Art Automobile"}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 font-light">
                {s.desc || 'Chaque pièce est assemblée à la main dans notre atelier en France avec vitrage optique et rétroéclairage LED ambré.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-400 font-mono">
                À partir de <strong className="text-white font-bold">{s.startingPrice || '49,99 €'}</strong>
              </span>
              <Link
                href={isEditor ? '#' : '/catalogue'}
                className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white text-xs font-semibold flex items-center gap-2 transition"
              >
                <span>Voir tout le catalogue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Grille des Supercars Réelles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col rounded-2xl bg-neutral-900/50 border border-neutral-800 overflow-hidden hover:border-amber-400/60 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-black"
              >
                {/* Image du Cadre 3D */}
                <div className="relative aspect-[4/3] bg-neutral-950 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-neutral-700 text-amber-400 text-[10px] font-mono uppercase tracking-wider font-semibold">
                      {product.brand}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-400/20 backdrop-blur-md border border-amber-400/30 text-amber-300 text-[10px] font-mono uppercase font-bold">
                      {product.era === 'VINTAGE' ? 'Vintage' : 'Moderne'}
                    </span>
                  </div>
                </div>

                {/* Détails */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-2 mt-1 font-light leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Prix & CTA */}
                  <div className="flex items-center justify-between border-t border-neutral-800/80 pt-3">
                    <div>
                      <span className="text-[10px] text-neutral-400 block font-light">À partir de</span>
                      <p className="text-base font-bold text-white font-serif">49,99 €</p>
                    </div>

                    <Link
                      href={isEditor ? '#' : `/produit/${product.slug}`}
                      className="px-3 py-2 bg-white hover:bg-neutral-100 text-black font-bold text-[11px] tracking-wider uppercase rounded-xl transition-all shadow-sm flex items-center gap-1 active:scale-95"
                    >
                      <span>VOIR LE FRAME</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
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
