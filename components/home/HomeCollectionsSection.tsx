'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Layers } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

const COLLECTIONS = [
  {
    id: 'bugatti',
    title: 'Bugatti & Hypercars',
    subtitle: 'Élite & Prestige W16',
    description:
      'Châssis 3D relief sous vitrine d’exposition avec rétroéclairage LED ambré, immortalisé en situation réelle devant la véritable Bugatti Chiron.',
    image: '/atelier/chiron-wall.jpg',
    tag: 'Collection Royale',
    count: 'Éditions Limitées',
    href: '/produit/bugatti-chiron-2016-cadre-3d',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  {
    id: 'pagani',
    title: 'Pagani & Supercars Modernes',
    subtitle: 'Artisanat & V12 Atmos',
    description:
      'L’aérodynamique de pointe et la furie des V12 d’exception : Pagani Huayra, Audi R8 V10, BMW M4 Competition.',
    image: '/atelier/huayra-real.jpg',
    tag: 'Haute Horlogerie',
    count: 'Pièces d’Orfèvre',
    href: '/catalogue?era=MODERN',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  },
  {
    id: 'custom',
    title: 'Atelier Sur-Mesure',
    subtitle: 'Création Unique 1:18 & 1:24',
    description:
      'Votre propre véhicule ou modèle de rêve configuré sur-mesure dans notre atelier avec rétroéclairage LED personnalisé et gravure de plaque.',
    image: '/atelier/m4comp-real.jpg',
    tag: 'Personnalisation Totale',
    count: 'Configuration 3D Live',
    href: '/configurateur',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  },
]

export function HomeCollectionsSection() {
  return (
    <section className="py-10 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
      <ScrollReveal direction="up" delay={0}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span className="text-xs tracking-[0.25em] uppercase text-amber-400 font-semibold">
                Explorez par Univers
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Nos Collections d&apos;Élite
            </h2>
          </div>
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white group transition-colors"
          >
            <span>Voir tout le catalogue</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </ScrollReveal>

      {/* Grille des 3 Collections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {COLLECTIONS.map((col, idx) => (
          <ScrollReveal key={col.id} direction="up" delay={0.1 * (idx + 1)}>
            <Link
              href={col.href}
              className="group relative flex flex-col justify-between h-[360px] sm:h-[420px] rounded-3xl overflow-hidden border border-neutral-800/80 hover:border-amber-400/50 transition-all duration-500 p-6 sm:p-8 bg-neutral-950 shadow-xl"
            >
              {/* Image de fond avec effet zoom au hover */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  className="object-cover brightness-[0.38] contrast-[1.1] group-hover:scale-105 group-hover:brightness-[0.45] transition-all duration-700"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              </div>

              {/* En-tête de la carte */}
              <div className="relative z-10 flex items-start justify-between">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border backdrop-blur-md ${col.badgeColor}`}
                >
                  {col.tag}
                </span>
                <span className="text-[10px] font-mono text-neutral-400 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-neutral-800">
                  {col.count}
                </span>
              </div>

              {/* Contenu bas */}
              <div className="relative z-10 space-y-3">
                <p className="text-[11px] font-mono text-amber-400 uppercase tracking-widest">
                  {col.subtitle}
                </p>
                <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-amber-300 transition-colors">
                  {col.title}
                </h3>
                <p className="text-xs text-neutral-300 font-light leading-relaxed line-clamp-2">
                  {col.description}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs font-bold text-white">
                  <span className="flex items-center gap-1.5 text-neutral-300 group-hover:text-white transition">
                    Découvrir l&apos;univers
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-amber-400 group-hover:text-black flex items-center justify-center transition-all duration-300">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
