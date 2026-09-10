'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Zap, Eye, ArrowRight, Layers, Sparkles, Check, Compass, Box, SunMedium } from 'lucide-react'

export function ProductDemonstrationSection() {
  // Mode de démonstration de la section 9
  const [demoStep, setDemoStep] = useState<'metamorphose' | 'angles' | 'led'>('led')

  // États spécifiques à chaque mode
  const [metamorphoseState, setMetamorphoseState] = useState<'car' | 'frame'>('frame')
  const [angleState, setAngleState] = useState<'face' | 'angle' | 'macro'>('angle')
  const [ledOn, setLedOn] = useState(true)

  // Intérieur & formats
  const [activeInterior, setActiveInterior] = useState<'bureau' | 'salon' | 'setup'>('bureau')

  const interiorDescriptions = {
    bureau: {
      title: 'Bureau de Direction & Espace de Travail',
      subtitle: 'Posé sur son chevalet ou fixé au mur',
      desc: 'Le cadre capte immédiatement le regard lors de vos réunions ou appels vidéo. La finition biseautée et le verre anti-reflet confèrent une autorité naturelle à votre espace.',
      image: '/atelier/chiron-wall.jpg',
    },
    salon: {
      title: 'Salon Contemporain & Réception',
      subtitle: 'Mise en valeur sur mur sombre ou boiserie',
      desc: 'De jour, le relief sculpté joue avec la lumière naturelle de la pièce. De nuit, l’éclairage LED ambré 3000K diffuse une lueur d’ambiance feutrée sans jamais éblouir.',
      image: '/atelier/huayra-real.jpg',
    },
    setup: {
      title: 'Espace Passionné & Setup Moderne',
      subtitle: 'L’accord parfait avec un éclairage tamisé',
      desc: 'Pensé pour les passionnés d’automobile et d’ingénierie mécanique. Chaque écope, aileron et ligne de fuite ressort avec une précision chirurgicale.',
      image: '/atelier/m4comp-real.jpg',
    },
  }

  const currentInterior = interiorDescriptions[activeInterior]

  return (
    <section className="py-16 sm:py-28 border-t border-neutral-800/80 bg-[#0a0a09] relative overflow-hidden">
      {/* Halo d'ambiance */}
      {ledOn && demoStep === 'led' && (
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none transition-opacity duration-700" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-14 relative z-10">

        {/* ─── EN-TÊTE : PROUVER LE PRODUIT ─── */}
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-amber-400 text-[10px] font-mono uppercase tracking-[0.2em]">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Démonstration Interactive
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Vivez l&apos;expérience Dream Frame
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
            De la supercar sur piste au relief d&apos;atelier sculpté sous verre : explorez chaque facette de l&apos;objet.
          </p>

          {/* 3 Onglets de Démonstration (Section 9 du Mega Prompt) */}
          <div className="pt-4 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => setDemoStep('metamorphose')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                demoStep === 'metamorphose'
                  ? 'bg-amber-400 text-black font-bold shadow-lg shadow-amber-400/20'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>1. Supercar → Dream Frame</span>
            </button>

            <button
              type="button"
              onClick={() => setDemoStep('angles')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                demoStep === 'angles'
                  ? 'bg-amber-400 text-black font-bold shadow-lg shadow-amber-400/20'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>2. Face → Angle → Relief</span>
            </button>

            <button
              type="button"
              onClick={() => setDemoStep('led')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                demoStep === 'led'
                  ? 'bg-amber-400 text-black font-bold shadow-lg shadow-amber-400/20'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>3. LED OFF → LED ON</span>
            </button>
          </div>
        </div>

        {/* ─── CONTENU INTERACTIF DYNAMIQUE SELON L'ÉTAPE ─── */}
        <div className="bg-neutral-950/70 border border-neutral-800/90 rounded-3xl p-6 sm:p-10 shadow-2xl">
          {/* ÉTAPE 1 : VOITURE RÉELLE → DREAM FRAME */}
          {demoStep === 'metamorphose' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
              <div className="lg:col-span-7 relative flex flex-col items-center">
                <div className="relative w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl">
                  <Image
                    src={metamorphoseState === 'car' ? '/atelier/huayra-real.jpg' : '/atelier/chiron-wall.jpg'}
                    alt="Métamorphose automobile"
                    fill
                    className="object-cover transition-all duration-500"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3 rounded-xl bg-black/80 backdrop-blur-md border border-neutral-800 text-xs">
                    <span className="font-mono text-[11px] text-neutral-300">
                      Vue : <strong className="text-amber-400">{metamorphoseState === 'car' ? 'Voiture Réelle' : 'Cadre 3D Sculpté'}</strong>
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">1:1 → Échelle d&apos;art</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                    De la piste à votre mur
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    La métamorphose d&apos;une icône mécanique
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                    Nous ne collons pas une simple impression 2D. Chaque ligne de carrosserie, diffuseur et galbe aérodynamique est redessiné, découpé au laser et monté en relief physique sur 5 niveaux.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMetamorphoseState(metamorphoseState === 'car' ? 'frame' : 'car')}
                    className="px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-white hover:bg-neutral-100 text-black transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95"
                  >
                    <span>{metamorphoseState === 'car' ? 'Voir le Dream Frame 3D →' : 'Voir le modèle d\'origine →'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ÉTAPE 2 : VUE DE FACE → ANGLE → DÉTAIL DU RELIEF */}
          {demoStep === 'angles' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
              <div className="lg:col-span-7 relative flex flex-col items-center">
                <div className="relative w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl">
                  <Image
                    src={
                      angleState === 'face'
                        ? '/atelier/chiron-wall.jpg'
                        : angleState === 'angle'
                        ? '/atelier/chiron-trunk.jpg'
                        : '/atelier/m4comp-real.jpg'
                    }
                    alt="Angles et relief 3D"
                    fill
                    className="object-cover transition-all duration-500"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3 rounded-xl bg-black/80 backdrop-blur-md border border-neutral-800 text-xs">
                    <span className="font-mono text-[11px] text-neutral-300">
                      Perspective : <strong className="text-amber-400">{angleState === 'face' ? 'Face Galerie' : angleState === 'angle' ? 'Angle 45° Relief' : 'Macro Profondeur 25mm'}</strong>
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">Prises de vue réelles</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                    Ingénierie du Relief 25mm
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Appréciez la véritable profondeur
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                    Observez comment les ombres naturelles s&apos;installent sous le modèle. Vu de face ou sous un angle oblique, le véhicule se détache littéralement du fond.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {(['face', 'angle', 'macro'] as const).map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAngleState(a)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                        angleState === a
                          ? 'bg-amber-400 text-black font-bold shadow-md'
                          : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {a === 'face' ? '1. Vue de Face' : a === 'angle' ? '2. Angle 45°' : '3. Macro Relief'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 : LED OFF → LED ON */}
          {demoStep === 'led' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
              <div className="lg:col-span-7 relative flex flex-col items-center">
                <div
                  className={`absolute inset-0 bg-amber-400/20 blur-[60px] rounded-3xl transition-opacity duration-700 pointer-events-none ${
                    ledOn ? 'opacity-100 scale-105' : 'opacity-0 scale-95'
                  }`}
                />

                <div className="relative w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl group">
                  <Image
                    src="/atelier/chiron-wall.jpg"
                    alt="Démonstration du cadre 3D Bugatti Chiron"
                    fill
                    className={`object-cover transition-all duration-700 ${
                      ledOn ? 'brightness-[0.95] contrast-[1.12]' : 'brightness-[0.6] contrast-[0.95]'
                    }`}
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />

                  {ledOn && (
                    <div className="absolute inset-0 ring-2 ring-inset ring-amber-400/30 rounded-2xl pointer-events-none animate-pulse" />
                  )}

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3 rounded-xl bg-black/80 backdrop-blur-md border border-neutral-800 text-xs">
                    <span className="flex items-center gap-2 font-mono text-[11px] text-neutral-300">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          ledOn ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]' : 'bg-neutral-600'
                        }`}
                      />
                      <span>Rétroéclairage 3000K : {ledOn ? 'ACTIVÉ' : 'ÉTEINT'}</span>
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono font-bold uppercase">
                      Bugatti Chiron (2016)
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                    Contrôle d&apos;Éclairage
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {ledOn ? 'Lumière Feutrée Nocturne' : 'Lumière Naturelle Diurne'}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                    {ledOn
                      ? 'De nuit, la lueur chaude 3000K découpe la silhouette de l’hypercar et fait ressortir chaque galbe de carrosserie dans l’obscurité sans fatiguer les yeux.'
                      : 'En plein jour, appréciez la découpe micronique de précision, le passe-partout biseauté noir mat 45° et le grain texturé du papier d’art Canson 310g/m².'}
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setLedOn(!ledOn)}
                    className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95 ${
                      ledOn
                        ? 'bg-amber-400 hover:bg-amber-300 text-black border border-amber-400 shadow-amber-400/20'
                        : 'bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{ledOn ? 'Éteindre la LED' : 'Allumer la LED 3000K'}</span>
                  </button>

                  <span className="text-[11px] text-neutral-400 font-mono">
                    Interrupteur discret inclus
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-neutral-800/80 text-xs">
                  <div className="flex items-center gap-2 text-neutral-300">
                    <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>Alimentation USB &amp; Câble tressé</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-300">
                    <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>Basse consommation 5W</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-300">
                    <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>Verre acrylique optique anti-UV</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-300">
                    <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>Durée de vie LED &gt; 50 000h</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ─── DANS VOTRE INTÉRIEUR : PROJECTION RÉALISTE ─── */}
        <div className="space-y-6 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block mb-1">
                Projection &amp; Décoration
              </span>
              <h3 className="text-xl sm:text-3xl font-black text-white">
                Dans votre intérieur
              </h3>
            </div>
            {/* Onglets d'ambiance */}
            <div className="flex items-center gap-2 flex-wrap">
              {(['bureau', 'salon', 'setup'] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveInterior(key)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                    activeInterior === key
                      ? 'bg-white text-black font-bold shadow-md'
                      : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {key === 'bureau' ? 'Bureau' : key === 'salon' ? 'Salon' : 'Setup Gaming'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 sm:p-8">
            <div className="md:col-span-6 relative aspect-[16/10] rounded-xl overflow-hidden bg-black border border-neutral-800">
              <Image
                src={currentInterior.image}
                alt={currentInterior.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <div className="md:col-span-6 space-y-4">
              <div>
                <span className="text-xs text-amber-400 font-mono font-bold block">
                  {currentInterior.subtitle}
                </span>
                <h4 className="text-lg sm:text-xl font-bold text-white mt-1">
                  {currentInterior.title}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                {currentInterior.desc}
              </p>
              <div className="pt-2">
                <Link
                  href="/catalogue"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white hover:text-amber-400 transition"
                >
                  <span>Choisir un cadre pour cet espace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ─── COMPARATEUR VISUEL DES 3 FORMATS ─── */}
        <div className="space-y-6 pt-6 border-t border-neutral-800/80">
          <div className="max-w-2xl mx-auto text-center space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
              Guide des Tailles Certifiées
            </span>
            <h3 className="text-xl sm:text-3xl font-black text-white">
              Quel format pour votre mur ?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-light">
              Des proportions calibrées pour s’adapter aussi bien à une étagère de bureau qu&apos;à une pièce maîtresse de salon.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                id: 'a4',
                name: 'Standard A4',
                size: '21 × 29,7 cm',
                price: '49,99 €',
                usage: 'Bureau de travail, console d’entrée, étagère bibliothèque',
                scale: 'Miniature 1:24 sous vitrage relief',
                badge: 'Format Idéal Cadeau',
              },
              {
                id: 'a3',
                name: 'Grand Format A3 Collector',
                size: '30 × 42 cm',
                price: '150,00 €',
                usage: 'Salon contemporain, chambre, bureau d’architecte',
                scale: 'Miniature 1:18 Grand Relief d’atelier',
                badge: 'Le Plus Équilibré',
                highlight: true,
              },
              {
                id: 'a2',
                name: 'Prestige Galerie A2',
                size: '50 × 70 cm',
                price: '250,00 €',
                usage: 'Pièce maîtresse au-dessus d’un canapé ou mur principal',
                scale: 'Miniature 1:18 Grand Panorama de collection',
                badge: 'Présence Muséale',
              },
            ].map((fmt) => (
              <div
                key={fmt.id}
                className={`p-6 rounded-2xl border flex flex-col justify-between space-y-6 transition-all ${
                  fmt.highlight
                    ? 'bg-neutral-900/90 border-amber-400/80 shadow-xl shadow-amber-400/5 ring-1 ring-amber-400/30'
                    : 'bg-neutral-950/60 border-neutral-800/80'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
                      {fmt.badge}
                    </span>
                    <span className="text-xs font-mono text-amber-400 font-bold">
                      {fmt.size}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{fmt.name}</h4>
                    <p className="text-2xl font-bold text-white mt-1">
                      {fmt.price}{' '}
                      <span className="text-xs text-neutral-400 font-normal font-sans">TTC</span>
                    </p>
                  </div>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    {fmt.usage}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-800 text-xs text-neutral-300">
                  <p className="font-mono text-[11px] text-amber-400">✓ {fmt.scale}</p>
                  <p className="text-[11px] text-neutral-400 mt-1">✓ Livraison Colissimo 48h Offerte</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
