'use client'

import { useState } from 'react'
import { ConfigOption } from '@/lib/configurator-data'
import { Zap, Eye, Box, Compass } from 'lucide-react'

interface ConfigurationPreviewProps {
  dimension: ConfigOption
  finish: ConfigOption
  car: ConfigOption
  scale: ConfigOption
}

export function ConfigurationPreview({
  dimension,
  finish,
  car,
  scale,
}: ConfigurationPreviewProps) {
  const [ledActive, setLedActive] = useState(true)
  const [viewAngle, setViewAngle] = useState<'face' | 'perspective' | 'macro'>('face')

  // Style de bordure et texture selon la matière choisie
  const getFrameBorderStyle = () => {
    switch (finish.key) {
      case 'brushed-aluminum':
        return 'border-[#4A4843] bg-[#161614] shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]'
      case 'raw-carbon':
        return 'border-[#262522] bg-[#0A0A09] shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]'
      case 'satin-white':
        return 'border-[#D6D2C9] bg-[#F2EFE9] text-obsidian'
      case 'black-oak':
      default:
        return 'border-[#201F1C] bg-[#0E0E0C] shadow-[inset_0_0_25px_rgba(0,0,0,0.9)]'
    }
  }

  // Transformation 3D selon l'angle choisi (Section 16 du Mega Prompt)
  const get3DTransform = () => {
    switch (viewAngle) {
      case 'perspective':
        return 'perspective(1200px) rotateY(-16deg) rotateX(6deg) scale(0.95)'
      case 'macro':
        return 'scale(1.22) translateY(12px)'
      case 'face':
      default:
        return 'none'
    }
  }

  const scaleFactor = scale.scaleFactor || 0.78

  return (
    <div className="relative w-full h-full min-h-[500px] lg:min-h-[660px] flex flex-col items-center justify-center p-6 lg:p-12 bg-carbon border border-graphite overflow-hidden rounded-2xl">
      {/* Simulation rétroéclairage LED d'ambiance */}
      {ledActive && (
        <div className="absolute inset-0 pointer-events-none transition-opacity duration-700">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-champagne/10 blur-[90px] rounded-full" />
        </div>
      )}

      {/* Barre supérieure de Contrôles Visuels (Angles & LED - Section 16) */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between gap-2 flex-wrap">
        {/* Sélecteur d'angle 3D */}
        <div className="flex items-center gap-1 bg-obsidian/80 backdrop-blur-md p-1 border border-graphite rounded-lg">
          <button
            type="button"
            onClick={() => setViewAngle('face')}
            className={`px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider rounded transition-all ${
              viewAngle === 'face'
                ? 'bg-neutral-800 text-champagne font-bold'
                : 'text-ash hover:text-porcelain'
            }`}
          >
            Vue Face
          </button>
          <button
            type="button"
            onClick={() => setViewAngle('perspective')}
            className={`px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider rounded transition-all ${
              viewAngle === 'perspective'
                ? 'bg-neutral-800 text-champagne font-bold'
                : 'text-ash hover:text-porcelain'
            }`}
          >
            3D Relief
          </button>
          <button
            type="button"
            onClick={() => setViewAngle('macro')}
            className={`px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider rounded transition-all ${
              viewAngle === 'macro'
                ? 'bg-neutral-800 text-champagne font-bold'
                : 'text-ash hover:text-porcelain'
            }`}
          >
            Macro Zoom
          </button>
        </div>

        {/* Bouton Toggle Rétroéclairage LED */}
        <button
          type="button"
          onClick={() => setLedActive(!ledActive)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-mono tracking-widest uppercase transition-all duration-300 border rounded-lg ${
            ledActive
              ? 'bg-champagne text-obsidian border-champagne font-bold shadow-champagne-glow'
              : 'bg-obsidian/90 text-ash border-graphite hover:text-porcelain hover:border-ash'
          }`}
        >
          <Zap className="w-3 h-3" />
          {ledActive ? 'LED : Active' : 'LED : Éteinte'}
        </button>
      </div>

      {/* Le Cadre Virtuel Morphologique avec support 3D */}
      <div
        className={`relative z-10 w-full max-w-[420px] transition-all duration-700 ease-out p-6 sm:p-8 flex flex-col justify-between border-[12px] sm:border-[16px] shadow-2xl ${getFrameBorderStyle()} ${
          viewAngle === 'perspective' ? 'shadow-[-30px_25px_45px_rgba(0,0,0,0.8)]' : ''
        }`}
        style={{
          aspectRatio: dimension.aspectRatio || '3 / 4',
          transform: get3DTransform(),
        }}
      >
        {/* Reflet de lumière sur vitrage acrylique */}
        {viewAngle === 'perspective' && (
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none rounded" />
        )}

        {/* Passe-partout muséal intérieur avec biseau */}
        <div className="relative w-full h-full bg-[#070706] border border-graphite/60 flex flex-col justify-between p-6 overflow-hidden">
          {/* Marquage musée haute horlogerie / galerie */}
          <div className="flex justify-between items-start text-[8px] font-mono tracking-museum uppercase text-ash/80">
            <span>DREAM FRAME · ATELIER</span>
            <span className="text-champagne font-semibold">{scale.name}</span>
          </div>

          {/* Véhicule miniature central à l'échelle choisie */}
          <div className="relative flex-1 flex items-center justify-center my-4">
            {car.imageUrl ? (
              <div
                className="relative transition-transform duration-700 ease-out flex items-center justify-center"
                style={{
                  transform: `scale(${scaleFactor})`,
                }}
              >
                <img
                  src={car.imageUrl}
                  alt={car.name}
                  className="max-h-[220px] max-w-full object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.9)]"
                />
              </div>
            ) : (
              <div className="text-xs font-mono text-ash/50 tracking-widest">
                AUTOMOBILE NON SÉLECTIONNÉE
              </div>
            )}
          </div>

          {/* Cartouche d'authentification en bas de cadre */}
          <div className="border-t border-graphite/40 pt-3 flex justify-between items-end">
            <div>
              <p className="font-gallery-title text-sm tracking-subtle text-porcelain leading-none">
                {car.name}
              </p>
              <p className="text-[9px] text-ash font-mono tracking-widest uppercase mt-1">
                {dimension.subtitle} · {finish.name}
              </p>
            </div>
            <span className="text-[7px] font-mono tracking-museum text-champagne/90 border border-champagne/30 px-1.5 py-0.5">
              ÉDITION N° 01/20
            </span>
          </div>
        </div>
      </div>

      {/* Récapitulatif technique sous le cadre */}
      <div className="relative z-10 mt-6 flex items-center gap-4 sm:gap-6 text-[10px] font-mono tracking-widest uppercase text-ash flex-wrap justify-center">
        <span>Format : {dimension.subtitle}</span>
        <span className="text-graphite">/</span>
        <span>Châssis : {finish.name}</span>
        <span className="text-graphite">/</span>
        <span>Échelle : {scale.name}</span>
      </div>
    </div>
  )
}
