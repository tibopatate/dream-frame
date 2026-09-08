'use client'

import { PriceBreakdown } from '@/lib/pricing/calculate'
import { ShieldCheck, Truck } from 'lucide-react'

interface PriceDisplayProps {
  price: PriceBreakdown
  onAddToCart: () => void
  isAdding?: boolean
}

export function PriceDisplay({
  price,
  onAddToCart,
  isAdding = false,
}: PriceDisplayProps) {
  return (
    <div className="bg-carbon border border-graphite p-6 lg:p-8 space-y-6">
      {/* En-tête statut composition */}
      <div className="flex items-center justify-between border-b border-graphite pb-4">
        <span className="text-[10px] font-mono tracking-museum uppercase text-ash">
          Votre Composition d'Art
        </span>
        <span className="text-[10px] font-mono tracking-widest text-champagne">
          Pièce Unique · Atelier France
        </span>
      </div>

      {/* Affichage mécanique du prix */}
      <div className="flex items-baseline justify-between">
        <div>
          <div className="font-gallery-title text-4xl lg:text-5xl text-porcelain tracking-subtle transition-all duration-300">
            {price.formattedTtc}
          </div>
          <p className="text-[10px] font-mono text-ash tracking-widest uppercase mt-1">
            TTC · 20% TVA & Éco-participation DEEE ({price.ecoParticipationCents / 100} €) incluses
          </p>
        </div>

        {/* Badge livraison Colissimo */}
        <div className="text-right hidden sm:block">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase text-champagne bg-champagne/10 border border-champagne/20 px-2.5 py-1">
            <Truck className="w-3 h-3" />
            Livraison Offerte (France)
          </span>
        </div>
      </div>

      {/* CTA noble : Créer cette pièce */}
      <button
        type="button"
        onClick={onAddToCart}
        disabled={isAdding}
        className="w-full py-5 bg-champagne hover:bg-champagne-pale text-obsidian font-bold text-xs uppercase tracking-museum transition-all duration-300 shadow-champagne-glow disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer"
      >
        <span>{isAdding ? 'Enregistrement en cours...' : 'Créer cette pièce pour ma collection'}</span>
      </button>

      {/* Garanties légales minimalistes */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-[10px] font-mono uppercase tracking-widest text-ash/80">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3 h-3 text-champagne" />
          Garantie de conformité 2 ans
        </span>
        <span>Colissimo suivi sécurisé</span>
        <span>Contrôle qualité unitaire</span>
      </div>
    </div>
  )
}
