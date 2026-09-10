'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Sparkles,
  ShieldCheck,
  Truck,
  Zap,
  CheckCircle,
  HeartHandshake,
  Layers,
  ArrowRight,
  CheckCircle2,
  Sliders,
} from 'lucide-react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

const CRAFT_STEPS = [
  {
    step: '01',
    title: 'Papier Musée & Teintes Pigmentaires',
    desc: 'Papier d&apos;art Canson Rag Photographique 310g/m². Impression giclée 12 couleurs inaltérable pendant plus de 100 ans.',
    tag: 'Longévité Archivale',
  },
  {
    step: '02',
    title: 'Découpe Laser Micron-Précision',
    desc: 'Chaque galbe de carrosserie, aileron et jante est découpé au faisceau laser pour un relief 3D net sans aucune bavure.',
    tag: 'Relief Tridimensionnel',
  },
  {
    step: '03',
    title: 'Passe-Partout Biseauté 45° Noir Mat',
    desc: 'Biseau à 45 degrés taillé au cutter de précision dans un carton de conservation sans acide pour un contraste théâtral.',
    tag: 'Finition Galerie',
  },
  {
    step: '04',
    title: 'Module LED Rétro-Éclairé 3000K',
    desc: 'Ruban LED basse consommation blanc chaud 3000K calibré pour flatter les carrosseries de nuit sans éblouir la pièce.',
    tag: 'Ambiance Nocturne',
  },
  {
    step: '05',
    title: 'Châssis Aluminium & Verre Acrylique Optique',
    desc: 'Encadrement en profilé aluminium anodisé noir satiné sous vitrage acrylique optique haute transmittance 99,2% anti-UV.',
    tag: 'Protection Ultime',
  },
]

interface AboutStorytellingSectionProps {
  craftImage?: string
  craftTitle?: string
  craftSubtitle?: string
  craftEnabled?: boolean
}

export function AboutStorytellingSection({
  craftImage,
  craftTitle,
  craftSubtitle,
  craftEnabled = true,
}: AboutStorytellingSectionProps = {}) {
  const [activeStep, setActiveStep] = useState(0)

  if (!craftEnabled) return null

  return (
    <section id="a-propos" className="py-20 sm:py-32 max-w-7xl mx-auto px-4 sm:px-6 space-y-24 sm:space-y-32">
      
      {/* ─── 1. MANIFESTE & HISTOIRE DE L'ATELIER ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-center">
        <ScrollReveal direction="left" delay={0.1} className="lg:col-span-6 space-y-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-amber-400 font-bold">
              À Propos de Dream Frame · L&apos;Atelier
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.05]">
            Plus qu&apos;un tableau.{' '}
            <span className="block text-neutral-400 font-light italic mt-1">
              Une présence sculpturale dans votre intérieur.
            </span>
          </h2>

          <div className="space-y-4 text-sm text-neutral-300 font-light leading-relaxed">
            <p>
              Fondée en France par des passionnés de design automobile et d&apos;artisanat d&apos;art, la maison{' '}
              <strong className="text-white font-semibold">Dream Frame</strong> est née d&apos;un constat : les miniatures de collection méritent un écrin à la hauteur de leur légende mécanique.
            </p>
            <p>
              Plutôt que d&apos;enfermer ces icônes dans des vitrines encombrées, nous les transformons en{' '}
              <strong className="text-white font-semibold">œuvres murales d&apos;art contemporain</strong>. Suspendu dans un bureau de direction, au salon ou dans un espace de réception, chaque cadre capte immédiatement le regard et suscite l&apos;admiration de vos invités.
            </p>
            <p className="text-neutral-400">
              Chaque pièce est assemblée à la main avec une exigence absolue de précision. Nous n&apos;utilisons aucun plastique bas de gamme : uniquement de l&apos;aluminium anodisé, du papier d&apos;art épais et des LED haute fidélité.
            </p>
          </div>

          {/* Signature & Valeurs */}
          <div className="pt-4 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="italic text-lg text-white font-bold">L&apos;Atelier Dream Frame</p>
              <p className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest">
                Créateurs & Artisans d&apos;Art Automobile · France
              </p>
            </div>
            <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-full">
              <CheckCircle className="w-4 h-4" />
              <span>Savoir-Faire Français</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Visuel Atelier & Cadre en situation */}
        <ScrollReveal direction="right" delay={0.2} className="lg:col-span-6 relative">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl group">
            <Image
              src={craftImage || "/atelier/huayra-real.jpg"}
              alt="Atelier d'artisanat Dream Frame"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Badge Flottant "Pièce Faite Main" */}
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                  Contrôle Qualité Unitaire
                </span>
                <p className="text-xs font-bold text-white">Chaque cadre est vérifié et numéroté</p>
              </div>
              <CheckCircle className="w-5 h-5 text-amber-400" />
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* ─── 2. POURQUOI SUBLIMER SON INTÉRIEUR (L'EFFET WOW) ─── */}
      <div className="bg-gradient-to-b from-neutral-900/60 to-neutral-950/80 border border-neutral-800 rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-amber-400 font-bold">
            Art de Vivre & Architecture d&apos;Intérieur
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Comment Dream Frame transforme votre pièce
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
            Un tableau classique reste plat. Un cadre Dream Frame crée un jeu d&apos;ombres et de lumières qui donne vie à votre mur le jour et illumine vos soirées.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Bénéfice 1 */}
          <div className="p-6 rounded-2xl bg-black/50 border border-neutral-800/80 space-y-3 hover:border-amber-400/40 transition">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Rétroéclairage d&apos;Ambiance 3000K</h3>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              À la nuit tombée, allumez la lueur blanc chaud intégrée. Elle découpe délicatement les galbes de la supercar pour créer une atmosphère feutrée et apaisante.
            </p>
          </div>

          {/* Bénéfice 2 */}
          <div className="p-6 rounded-2xl bg-black/50 border border-neutral-800/80 space-y-3 hover:border-amber-400/40 transition">
            <div className="w-10 h-10 rounded-xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Relief Multi-Couches Saisissant</h3>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Le véhicule flotte au-dessus du fond avec une profondeur réelle de 25 mm. Vos visiteurs s&apos;approchent instinctivement pour admirer les détails minutieux.
            </p>
          </div>

          {/* Bénéfice 3 */}
          <div className="p-6 rounded-2xl bg-black/50 border border-neutral-800/80 space-y-3 hover:border-amber-400/40 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Prêt à Poser ou Accrocher</h3>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Chaque cadre inclut une attache murale renforcée ainsi qu&apos;un pied chevalet pour le poser sur un bureau, une étagère ou une console d&apos;entrée.
            </p>
          </div>
        </div>
      </div>

      {/* ─── 3. ANATOMIE D'UNE PIÈCE D'EXCEPTION (5 ÉTAPES ARTISANALES) ─── */}
      <div className="space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-amber-400 font-bold block mb-2">
              Savoir-Faire Artisanal
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              L&apos;Anatomie d&apos;une Pièce Dream Frame
            </h2>
          </div>
          <p className="text-xs text-neutral-400 font-light max-w-sm">
            5 couches de matériaux nobles minutieusement assemblées pour une durabilité absolue.
          </p>
        </div>

        {/* Accordéon / Stepper des 5 étapes */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
          {CRAFT_STEPS.map((step, idx) => {
            const isActive = activeStep === idx
            return (
              <button
                key={step.step}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`p-5 rounded-2xl text-left transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-neutral-900 border-amber-400/80 shadow-lg shadow-amber-400/5'
                    : 'bg-neutral-950/60 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900/40'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-mono font-black ${
                      isActive ? 'text-amber-400' : 'text-neutral-500'
                    }`}
                  >
                    {step.step}
                  </span>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                      isActive
                        ? 'bg-amber-400/20 text-amber-300 border-amber-400/30 font-bold'
                        : 'bg-neutral-900 text-neutral-500 border-neutral-800'
                    }`}
                  >
                    {step.tag}
                  </span>
                </div>
                <h3
                  className={`text-sm font-bold transition-colors ${
                    isActive ? 'text-white' : 'text-neutral-300'
                  }`}
                >
                  {step.title}
                </h3>
                <p className="text-xs text-neutral-400 font-light mt-2 leading-relaxed">
                  {step.desc}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* ─── 4. LES 4 ENGAGEMENTS DE CONFIANCE TOTALE ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-8 border-t border-neutral-800/80">
        {[
          {
            icon: ShieldCheck,
            title: 'Emballage Crash-Proof',
            desc: 'Carton double cannelure et mousse haute densité. Garantie zéro casse.',
          },
          {
            icon: Truck,
            title: 'Colissimo 48h Offert',
            desc: 'Expédition soignée depuis la France avec numéro de suivi SMS/Email.',
          },
          {
            icon: HeartHandshake,
            title: 'Satisfait ou Remboursé',
            desc: '30 jours pour changer d&apos;avis. Retour simple sans justification.',
          },
          {
            icon: CheckCircle,
            title: 'Garantie Atelier 2 Ans',
            desc: 'Électronique LED et cadre garantis 2 ans contre tout défaut.',
          },
        ].map((item) => (
          <div key={item.title} className="flex items-start gap-3 p-4 rounded-2xl bg-neutral-950/40 border border-neutral-800/60">
            <item.icon className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white">{item.title}</h4>
              <p className="text-[11px] text-neutral-400 font-light mt-0.5 leading-snug">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
