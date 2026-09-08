import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles, ShieldCheck, Truck, Zap, Layers, Award } from 'lucide-react'
import type { Metadata } from 'next'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { MOCK_PRODUCTS } from '@/lib/mock-data'
import { getSettings } from '@/lib/data-store'
import { ProductDemonstrationSection } from '@/components/home/ProductDemonstrationSection'

export const metadata: Metadata = {
  title: "Dream Frame — Art Automobile 3D d'Exception | Atelier France",
  description:
    'Cadres 3D d’art automobile sous vitrage haute définition avec rétroéclairage LED intégré. Fait main en France. À partir de 49,99 € · Livraison Colissimo 100% offerte.',
}

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const settings = getSettings()
  const products = MOCK_PRODUCTS.slice(0, 8)

  return (
    <main className="bg-[#080807] text-white selection:bg-amber-400 selection:text-black overflow-hidden">

      {/* ─── 1. HERO PLEIN ÉCRAN — LUXE & CLARTÉ PRODUIT IMMÉDIATE ──── */}
      <section className="relative min-h-[72vh] sm:min-h-[88vh] flex flex-col justify-center items-center px-4 sm:px-6 py-12 sm:py-20 overflow-hidden">
        {/* Image de fond photographique réelle avec animation de zoom */}
        <div className="absolute inset-0 z-0 animate-hero-zoom">
          <Image
            src="/atelier/chiron-wall.jpg"
            alt="Bugatti Chiron — Art Automobile Dream Frame"
            fill
            priority
            className="object-cover object-center brightness-[0.75] contrast-[1.1]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080807] via-[#080807]/30 to-[#080807]/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080807]/50 via-transparent to-[#080807]/50" />
        </div>

        {/* Contenu Hero centré */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 my-auto">
          {/* Badge Atelier */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-neutral-800 text-amber-400 text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Atelier Français · Cadres Décoratifs Supercars
          </div>

          {/* Titre Principal */}
          <h1 className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.02] sm:leading-[0.94] text-white">
            {settings.heroTitle || (
              <>
                L&apos;art de la supercar,{' '}
                <span className="block italic font-light text-neutral-300 mt-1 sm:mt-2">
                  sculpté en relief 3D.
                </span>
              </>
            )}
          </h1>

          {/* Sous-titre descriptif & honnête */}
          <p className="text-xs sm:text-base text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
            Cadres d’ébénisterie automobile sous vitrage optique anti-UV avec rétroéclairage LED ambré intégré.{' '}
            <span className="text-white font-semibold block sm:inline mt-1 sm:mt-0">
              À partir de 49,99 € · Livraison Colissimo 100% Offerte.
            </span>
          </p>

          {/* 2 CTA Principaux — DÉSIR & CHOIX */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            <Link
              href="/catalogue"
              className="relative w-full sm:w-auto px-8 py-4 bg-white hover:bg-neutral-100 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 shadow-2xl shadow-white/20 flex items-center justify-center gap-2 group active:scale-[0.98]"
            >
              <span>Découvrir la Collection</span>
              <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/configurateur"
              className="relative w-full sm:w-auto px-8 py-4 bg-black/70 hover:bg-black/90 backdrop-blur-md border border-neutral-700 hover:border-amber-400/60 text-white text-xs tracking-wider uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Créer mon Dream Frame</span>
            </Link>
          </div>

          {/* Marques emblématiques */}
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
          </div>
        </div>
      </section>

      {/* ─── 2. DÉMONSTRATION PRODUIT : PAS UN POSTER, UNE PIÈCE ────── */}
      <section className="py-14 sm:py-20 border-y border-neutral-800/80 bg-gradient-to-b from-[#0e0e0c] to-[#080807]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center space-y-2 mb-10 sm:mb-14">
            <span className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-amber-400 font-semibold">
              Architecture &amp; Conception
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Pas un simple poster. Une véritable œuvre murale.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light">
              Chaque cadre Dream Frame est une création autonome prête à accrocher ou poser, alliant profondeur physique et lumière chaleureuse.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pilier 1 */}
            <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                <Layers className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block font-bold">
                  25 mm de Profondeur
                </span>
                <h3 className="text-lg font-bold text-white">Relief Multi-Couches 3D</h3>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                Le modèle est découpé avec une précision chirurgicale et mis en suspension au-dessus d’un passe-partout biseauté noir mat à 45°.
              </p>
            </div>

            {/* Pilier 2 */}
            <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                <Zap className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block font-bold">
                  Blanc Chaud 3000K
                </span>
                <h3 className="text-lg font-bold text-white">Rétroéclairage LED Intégré</h3>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                Un ruban micro-LED haute fidélité baigne délicatement les arêtes de la carrosserie d’une lueur feutrée, parfaite pour tamiser vos soirées.
              </p>
            </div>

            {/* Pilier 3 */}
            <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block font-bold">
                  Papier Canson 310g/m²
                </span>
                <h3 className="text-lg font-bold text-white">Finition Musée &amp; Acrylique HD</h3>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                Impression giclée pigmentaire inaltérable, châssis aluminium anodisé noir et vitrage acrylique haute transparence 99% anti-UV.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. DÉMONSTRATION PRODUIT INTERACTIVE, PROJECTION & FORMATS ──── */}
      <ProductDemonstrationSection />

      {/* ─── 4. LA COLLECTION OFFICIELLE — 8 CADRES AUTHENTIQUES ───── */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <span className="text-xs tracking-[0.25em] uppercase text-amber-400 font-semibold block mb-1">
              Photographies Réelles de l&apos;Atelier
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              La Collection d&apos;Art Automobile
            </h2>
          </div>
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
          >
            <span>Voir les 8 cadres en détail</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </Link>
        </div>

        {/* Grille des 8 vrais produits avec numérotation d'icônes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, idx) => (
            <div
              key={product.id}
              className="group bg-neutral-900/70 border border-neutral-800 hover:border-neutral-600 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-lg"
            >
              {/* Visuel du cadre */}
              <Link href={`/produit/${product.slug}`} className="block relative aspect-[4/3] bg-black overflow-hidden">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />

                {/* Badges marque & année */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md text-amber-400 border border-neutral-800 px-2.5 py-1 rounded-full">
                    {product.brand}
                  </span>
                  <span className="text-[9px] font-mono text-neutral-300 bg-black/80 backdrop-blur-md border border-neutral-800 px-2 py-1 rounded-full">
                    {product.year}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-neutral-300 text-[9px] px-2.5 py-1 rounded-full border border-neutral-800 flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 text-amber-400" />
                  LED intégrée
                </div>
              </Link>

              {/* Informations & CTA */}
              <div className="p-5 space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold block">
                    0{idx + 1} — {product.brand.toUpperCase()}
                  </span>
                  <Link
                    href={`/produit/${product.slug}`}
                    className="font-serif text-base text-white group-hover:text-amber-300 block truncate transition-colors"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-neutral-400 font-light line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Prix & Bouton VOIR LE FRAME */}
                <div className="flex items-center justify-between border-t border-neutral-800/80 pt-3">
                  <div>
                    <span className="text-[10px] text-neutral-400 block font-light">
                      À partir de
                    </span>
                    <p className="text-base font-bold text-white font-serif">
                      49,99 €
                    </p>
                  </div>

                  <Link
                    href={`/produit/${product.slug}`}
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

      {/* ─── 4. SAVOIR-FAIRE : L'ANATOMIE D'UNE PIÈCE DREAM FRAME ───── */}
      <section className="py-16 sm:py-24 border-t border-neutral-800/80 bg-neutral-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="max-w-2xl mx-auto text-center space-y-2">
            <span className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-amber-400 font-semibold">
              Exigence Artisanale
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              L&apos;Anatomie d&apos;une Pièce d&apos;Exception
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light">
              5 couches de matériaux nobles minutieusement assemblées dans notre atelier en France.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                num: '01',
                title: "Papier d'Art 310g",
                desc: "Canson Rag Photographique pur coton, résistant plus de 100 ans.",
              },
              {
                num: '02',
                title: 'Découpe Laser Micron',
                desc: 'Ailerons, jantes et galbes découpés sans aucune bavure.',
              },
              {
                num: '03',
                title: 'Passe-Partout Biseauté',
                desc: 'Biseau 45° taillé à la main dans un carton de conservation sans acide.',
              },
              {
                num: '04',
                title: 'Module LED 3000K',
                desc: 'Éclairage blanc chaud basse consommation pour sublimer la silhouette.',
              },
              {
                num: '05',
                title: 'Vitrage Acrylique HD',
                desc: 'Transmittance optique 99,2% et cadre aluminium anodisé noir.',
              },
            ].map((step) => (
              <div
                key={step.num}
                className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-2"
              >
                <span className="text-xs font-mono font-bold text-amber-400 block">
                  {step.num}
                </span>
                <h3 className="text-sm font-bold text-white">{step.title}</h3>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. ENGAGEMENTS & RÉASSURANCE CLAIRE ────────────────────────── */}
      <section className="py-12 border-t border-neutral-800/80 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60">
            <Truck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white">Livraison 100% Offerte</h4>
              <p className="text-[11px] text-neutral-400 font-light mt-0.5">
                Colissimo Suivi 48h en France avec emballage renforcé anti-choc.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60">
            <ShieldCheck className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white">Droit de Rétractation 14 Jours</h4>
              <p className="text-[11px] text-neutral-400 font-light mt-0.5">
                Retour simple et sécurisé conformément à la législation française.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60">
            <Zap className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white">LED &amp; Fixations Incluses</h4>
              <p className="text-[11px] text-neutral-400 font-light mt-0.5">
                Chaque pièce arrive prête à poser sur un meuble ou à accrocher au mur.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60">
            <Award className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white">Manufacture &amp; Contrôle Unitaire</h4>
              <p className="text-[11px] text-neutral-400 font-light mt-0.5">
                Chaque cadre est inspecté individuellement avant son expédition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. INVITATION ATELIER SUR-MESURE ───────────────────────── */}
      <section className="py-16 sm:py-24 border-t border-neutral-800/80">
        <ScrollReveal direction="up" delay={0}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
            <span className="text-xs tracking-[0.2em] uppercase text-amber-400 inline-block font-semibold">
              Configuration Personnalisée
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Un modèle précis ? Une échelle spécifique ?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 font-light max-w-xl mx-auto leading-relaxed">
              Composez votre cadre idéal : dimensions (A4, A3, A2), modèle automobile et échelle miniature.
              Notre configurateur live vous permet de visualiser votre projet instantanément.
            </p>
            <Link
              href="/configurateur"
              className="relative inline-flex items-center gap-2.5 px-10 py-4 bg-white hover:bg-neutral-100 text-black font-bold text-xs tracking-widest uppercase rounded-xl overflow-hidden transition-all shadow-2xl shadow-white/10 group active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Accéder à l&apos;Atelier Sur-Mesure</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </main>
  )
}
