import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles, ShieldCheck, Truck, Zap, Star } from 'lucide-react'
import type { Metadata } from 'next'
import { AlternatingScrollFrames } from '@/components/home/AlternatingScrollFrames'
import { HomeCollectionsSection } from '@/components/home/HomeCollectionsSection'
import { AboutStorytellingSection } from '@/components/home/AboutStorytellingSection'
import { InteriorShowcaseSection } from '@/components/home/InteriorShowcaseSection'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { getSettings } from '@/lib/data-store'

export const metadata: Metadata = {
  title: "Dream Frame — Art Automobile 3D d'Exception | Atelier France",
  description:
    'Cadres 3D d&apos;art automobile sous vitrage haute définition avec rétroéclairage LED intégré. Fait main en France. 49,99 € · Livraison Colissimo 100% offerte.',
}

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const settings = getSettings()

  return (
    <main className="bg-[#080807] text-white selection:bg-amber-400 selection:text-black overflow-hidden">

      {/* ─── 1. HERO PLEIN ÉCRAN — CINÉMATIQUE & ULTRA STYLÉ ──────────── */}
      <section className="relative min-h-[68vh] sm:min-h-[88vh] flex flex-col justify-center items-center px-4 sm:px-6 py-10 sm:py-20 overflow-hidden">

        {/* Image de fond — zoom de sortie au chargement */}
        <div className="absolute inset-0 z-0 animate-hero-zoom">
          <Image
            src="/atelier/chiron-wall.jpg"
            alt="Bugatti Chiron — Art Automobile Dream Frame"
            fill
            priority
            className="object-cover object-center brightness-[0.4] contrast-[1.15]"
            sizes="100vw"
          />
          {/* Dégradés directionnels */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080807] via-transparent to-[#080807]/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080807]/60 via-transparent to-[#080807]/60" />
        </div>

        {/* Titre & CTA — entrée fade-up */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4 sm:space-y-7 my-auto">
          {/* Titre */}
          <div className="overflow-hidden">
            <h1 className="text-3xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[1.02] sm:leading-[0.92] text-white animate-fade-up delay-100">
              {settings.heroTitle || (
                <>
                  L&apos;art de la supercar,{' '}
                  <span className="block italic font-light text-neutral-300 mt-1 sm:mt-2">
                    sculpté en relief 3D.
                  </span>
                </>
              )}
            </h1>
          </div>

          {/* Sous-titre */}
          <p className="text-xs sm:text-lg text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed animate-fade-up delay-200">
            {settings.heroSubtitle || (
              <>
                Miniatures d&apos;exception sous vitrage haute définition et rétroéclairage LED intégré.{' '}
                <strong className="text-white font-semibold">49,99 € TTC</strong> avec{' '}
                <span className="text-amber-400 font-semibold">Livraison 100% Offerte</span>.
              </>
            )}
          </p>

          {/* Boutons d'Accès Direct — Visibles Immédiatement Sans Scroller */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-up delay-300 pt-2">
            <Link
              href="/produit/bugatti-chiron-2016-cadre-3d"
              className="relative w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-neutral-100 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 shadow-2xl shadow-white/20 flex items-center justify-center gap-2 group active:scale-[0.98]"
            >
              <span>{settings.heroCtaText || 'Découvrir la Bugatti Chiron — 49,99 €'}</span>
              <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/configurateur"
              className="relative w-full sm:w-auto px-8 py-3.5 bg-black/70 hover:bg-black/90 backdrop-blur-md border border-neutral-700 hover:border-amber-400/60 text-white text-xs tracking-wider uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>L&apos;Atelier Sur-Mesure</span>
            </Link>
          </div>

          {/* Bandeau d'Accès Rapide aux 3 Supercars Phares sur Smartphone */}
          <div className="pt-3 flex sm:hidden items-center justify-center gap-2 overflow-x-auto no-scrollbar py-1">
            {[
              { name: 'Bugatti Chiron', href: '/produit/bugatti-chiron-2016-cadre-3d' },
              { name: 'Pagani Huayra', href: '/produit/pagani-huayra-v12-cadre-3d' },
              { name: 'Audi R8 V10', href: '/produit/audi-r8-v10-performance-cadre-3d' },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-neutral-800 text-[10px] font-mono font-medium text-amber-400 hover:border-amber-400/50 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 2. ACCÈS DIRECT AUX COLLECTIONS ────────────────────────────────── */}
      <div id="collections">
        <HomeCollectionsSection />
      </div>

      {/* ─── 3. GALERIE ALTERNÉE AU SCROLL ──────────────────────────────────── */}
      <div id="galerie">
        <AlternatingScrollFrames />
      </div>

      {/* ─── 4. GRAND STORYTELLING & 'À PROPOS DE NOUS' (SUBLIMATION D'INTÉRIEUR) ─── */}
      <AboutStorytellingSection
        craftImage={settings.craftSectionImage}
        craftTitle={settings.craftSectionTitle}
        craftSubtitle={settings.craftSectionSubtitle}
        craftEnabled={settings.craftSectionEnabled ?? true}
      />

      {/* ─── 5. CHEZ NOS COLLECTIONNEURS & AVIS CLIENTS VÉRIFIÉS ────────────── */}
      <InteriorShowcaseSection />

      {/* ─── 6. INVITATION ATELIER SUR-MESURE ───────────────────────────────── */}
      <section className="py-16 sm:py-24 border-t border-neutral-800/50">
        <ScrollReveal direction="up" delay={0}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
            <span className="text-xs tracking-[0.2em] uppercase text-amber-400 inline-block">
              Personnalisation Totale
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Un modèle précis ? Une échelle 1:18 ?
            </h2>
            <p className="text-sm text-neutral-300 font-light max-w-xl mx-auto leading-relaxed">
              Composez votre pièce idéale : format de cadre, supercar et échelle miniature.
              Un atelier de création en 3 étapes, sur votre téléphone ou ordinateur.
            </p>
            <Link
              href="/configurateur"
              className="relative inline-flex items-center gap-2.5 px-10 py-4 bg-white hover:bg-neutral-100 text-black font-bold text-xs tracking-widest uppercase rounded-xl overflow-hidden transition-all shadow-2xl shadow-white/10 group active:scale-[0.98]"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-black/8 opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-transform duration-700" aria-hidden="true" />
              <Sparkles className="w-4 h-4 text-amber-500" />
              Accéder à l&apos;Atelier Sur-Mesure
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Réassurance finale */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-neutral-500">
              <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-emerald-400" /> Livraison offerte</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Retour 14 jours</span>
              <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-400" /> LED incluses</span>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </main>
  )
}
