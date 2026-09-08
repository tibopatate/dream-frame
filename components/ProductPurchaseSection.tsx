'use client'

import { useState } from 'react'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { Truck, RotateCcw, ShieldCheck, Zap, Sparkles, CheckCircle2, Award } from 'lucide-react'
import type { ProductFormat } from '@/lib/data-store'

interface ProductPurchaseSectionProps {
  product: {
    id: string
    name: string
    brand: string
    slug: string
    images: string[]
    description?: string
    price: number
    sku?: string
    stock?: number
    formats?: ProductFormat[]
  }
}

const FALLBACK_FORMATS: ProductFormat[] = [
  {
    id: 'fmt-a4',
    name: 'Standard A4',
    size: '21 × 29.7 cm',
    price: 49.99,
    stock: 25,
    isDefault: true,
  },
  {
    id: 'fmt-a3',
    name: 'Grand Format A3 Collector',
    size: '30 × 42 cm',
    price: 150.00,
    stock: 10,
    isDefault: false,
  },
  {
    id: 'fmt-a2',
    name: 'Prestige Galerie A2',
    size: '50 × 70 cm',
    price: 250.00,
    stock: 5,
    isDefault: false,
  },
]

export function ProductPurchaseSection({ product }: ProductPurchaseSectionProps) {
  const formats = product.formats && product.formats.length > 0 ? product.formats : FALLBACK_FORMATS
  const defaultFormat = formats.find((f) => f.isDefault) || formats[0]
  const [selectedFormat, setSelectedFormat] = useState<ProductFormat>(defaultFormat)

  const isLowStock = (selectedFormat.stock ?? 10) <= 5

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Bloc Tarif, Sélecteur de Formats & Panier */}
      <div className="bg-neutral-900/90 border border-neutral-800/90 rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6 shadow-xl">
        {/* Prix dynamique et Livraison */}
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <div>
            <span className="text-3xl sm:text-4xl font-bold font-serif text-white transition-all">
              {selectedFormat.price.toFixed(2).replace('.', ',')} €
            </span>
            <span className="text-neutral-400 text-xs font-sans pl-2">TTC</span>
            {selectedFormat.price > 49.99 && (
              <span className="ml-2.5 inline-flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Édition Grand Format
              </span>
            )}
          </div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" />
            Livraison 100% Offerte
          </span>
        </div>

        {/* ─── Sélecteur de Formats de Cadres (A4, Grand A3 150€, Prestige A2 250€) ─── */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-mono uppercase tracking-wider text-neutral-300 font-semibold flex items-center gap-1.5">
              <span>Choisir le format d'art</span>
            </label>
            <span className="text-[11px] text-amber-400 font-medium">
              Dimensions réelles certifiées
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {formats.map((fmt) => {
              const isSelected = selectedFormat.id === fmt.id
              const isCollectorA3 = fmt.id.includes('a3') || fmt.name.includes('A3') || fmt.price === 150
              const isPrestigeA2 = fmt.id.includes('a2') || fmt.name.includes('A2') || fmt.price === 250

              return (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setSelectedFormat(fmt)}
                  className={`w-full text-left p-3.5 rounded-lg border transition-all duration-200 cursor-pointer relative flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-neutral-800/90 border-amber-400/80 shadow-lg shadow-amber-400/5 ring-1 ring-amber-400/30'
                      : 'bg-black/50 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected
                          ? 'border-amber-400 bg-amber-400 text-black'
                          : 'border-neutral-600 bg-transparent'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-neutral-200'}`}>
                          {fmt.name}
                        </span>
                        {isCollectorA3 && (
                          <span className="text-[9px] uppercase font-mono font-semibold tracking-wider px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20 text-amber-400">
                            Format Recommandé
                          </span>
                        )}
                        {isPrestigeA2 && (
                          <span className="text-[9px] uppercase font-mono font-semibold tracking-wider px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300">
                            Prestige Galerie
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-400 font-light mt-0.5">
                        Dimensions : <strong className="text-neutral-300 font-medium">{fmt.size}</strong>
                        {isCollectorA3 && ' · Miniature 1:18 en relief sous vitrine'}
                        {isPrestigeA2 && ' · Miniature 1:18 Grand Format d\'exposition'}
                        {!isCollectorA3 && !isPrestigeA2 && ' · Miniature 1:24 sous vitrage HD'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className={`text-sm font-serif font-bold ${isSelected ? 'text-amber-400' : 'text-white'}`}>
                      {fmt.price.toFixed(2).replace('.', ',')} €
                    </span>
                    <span className="text-[10px] text-neutral-500 block font-light">TTC</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Indicateur de disponibilité atelier */}
          <div className="flex items-center justify-between text-[11px] pt-1 px-1">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pièce prête à expédier depuis notre atelier</span>
            </span>
            <span className="text-neutral-500 font-mono text-[10px]">
              Expédition 24/48h
            </span>
          </div>
        </div>

        {/* Bouton Ajouter au Panier avec Prix et Format dynamiques */}
        <AddToCartButton
          variantId={`${product.id}-${selectedFormat.id}`}
          productId={product.id}
          productName={product.name}
          slug={product.slug}
          brand={product.brand}
          image={product.images[0] ?? ''}
          price={selectedFormat.price}
          stock={selectedFormat.stock ?? 5}
          formatName={selectedFormat.name}
          formatSize={selectedFormat.size}
        />

        {/* Réassurance d'Atelier */}
        <div className="space-y-3 pt-4 border-t border-neutral-800 text-xs text-neutral-300 font-light">
          <div className="flex items-start gap-3">
            <Truck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <span>Colissimo Suivi 24/48h · <strong className="text-white font-medium">Offert sans minimum d'achat</strong></span>
          </div>
          <div className="flex items-start gap-3">
            <RotateCcw className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <span>Droit de retour 14 jours (art. L221-18 Code Conso)</span>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <span>Garantie légale de conformité de 2 ans incluse</span>
          </div>
          <div className="flex items-start gap-3">
            <Zap className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <span>Éclairage LED intégré inclus + alimentation et câble tressé</span>
          </div>
        </div>

        {/* Mention DEEE */}
        <div className="pt-3 border-t border-neutral-800/60 text-[10px] text-neutral-400 leading-relaxed font-light">
          Ce cadre d'exception intègre un système d'éclairage électrique basse consommation. L'éco-participation DEEE est comprise dans le tarif.
        </div>
      </div>

      {/* Caractéristiques d'Atelier adaptées en temps réel au Format choisi */}
      <div className="space-y-3 border-t border-neutral-800 pt-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-400">Spécifications du format choisi</h2>
          <span className="text-xs font-mono text-amber-400">{selectedFormat.name}</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5 text-xs">
          {[
            ['Dimensions', selectedFormat.size],
            [
              'Miniature',
              selectedFormat.price >= 250
                ? 'Échelle 1:18 Chef-d\'œuvre en relief 3D'
                : selectedFormat.price >= 150
                ? 'Échelle 1:18 Grand Relief 3D'
                : 'Échelle 1:24 en relief 3D',
            ],
            ['Châssis', 'Ébénisterie Noir Profond Atelier'],
            ['Vitrage', 'Verre acrylique HD anti-rayures & anti-poussière'],
            ['Éclairage', 'Micro-LEDs ambrées intégrées + variateur'],
            ['Atelier', 'Fait main et certifié en France'],
          ].map(([label, value]) => (
            <div key={label} className="bg-neutral-900 border border-neutral-800 rounded-xl p-3">
              <p className="text-neutral-400 text-[10px] uppercase font-mono">{label}</p>
              <p className="text-white font-medium mt-0.5 text-xs">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
